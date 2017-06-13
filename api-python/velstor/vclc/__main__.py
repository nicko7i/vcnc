#!python3.5
# For command aliases prior to 3.2 - https://bugs.python.org/issue25299
#
# https://pythonconquerstheuniverse.wordpress.com/2011/08/29/lambda_tutorial/
from __future__ import print_function
import sys
import re
import json

import requests
import errno


from velstor.api.session import Session
from functools import partial
from velstor.vclc.vclc_parser import vclc_parser
from velstor.vclc.handler import Handler
from velstor.vclc.handler import error_response
from velstor.vclc.vClcException import vClcException

print_error = partial(print, file=sys.stderr)
#
#  Yeah, yeah, globals are bad form...
#
quiet = False


def main(args=None):
    """The main routine."""
    if args is None:
        args = sys.argv[1:]

    with Session() as session:
        handler = Handler(session)
        parser = vclc_parser(handler)
        #
        try:
            global quiet
            results = parser.parse_args(args, handler)
            quiet = results.quiet
            return results.action()
        except requests.exceptions.RequestException as e:
            #
            #  Requests raised an exception.  Probably couldn't reach the vCNC
            #  server There is no HTTP code for this error, so we adopt 504,
            #  which is similar.
            #
            #  Yes, it would have been cooler to have done this with a single
            #  RE.
            #
            details = str(e)
            match_host = re.search("host='(\S+)'", details)
            match_port = re.search("port=(\d+)", details)
            match_error = re.search('NewConnectionError', details)
            suffix = '.'
            #
            #  If the server happens to match the vCNC server's default value,
            #  then add the additional suggestion to check configuration.
            #
            if match_host and match_port and match_error:
                host = match_host.group(1)
                port = match_port.group(1)
                if host == 'vcnc' and port == "6130":
                    suffix = ''.join([
                        ' Did you mean to set a command line switch'
                        , ' or environment variable?'])
                return error_response('Could not reach vCNC server at '
                                      + match_host.group(1)
                                      + ':'
                                      + match_port.group(1)
                                      + suffix
                                      , http_status=504
                                      , error_sym='EHOSTDOWN')
            else:
                #
                #  We don't really know what happened.  Just dump the raw data
                #  as the message.
                #
                return error_response(details)
            #
            #
        except vClcException:
            #
            #  Calling 'vclc' with no arguments isn't trapped as an error by
            #  argparse.
            #
            m = parser.format_usage()
            m = re.sub('\n[ ]+', ' ', m)
            return error_response(m, http_status=400, error_sym='EINVAL')
        except SystemExit:
            raise
        except KeyboardInterrupt:
            sys.exit(errno.EINVAL)
        except BaseException as e:
            raise
            # return error_response('Unexpected exception in client: '+str(e))


if __name__ == "__main__":
    (exit_code, response) = main()
    if not quiet:
        print(json.dumps(response, sort_keys=True, indent=2))
    sys.exit(127 if (exit_code > 127) else exit_code)
