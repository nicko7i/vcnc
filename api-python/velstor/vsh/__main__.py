#!python3.5
# For command aliases prior to 3.2 - https://bugs.python.org/issue25299
#
# https://pythonconquerstheuniverse.wordpress.com/2011/08/29/lambda_tutorial/
from __future__ import print_function
import sys
import re
import json
import subprocess

import requests
import errno
import os


from velstor.api.session import Session
from functools import partial
from velstor.vsh.vsh_parser import vsh_parser
from velstor.vclc.handler import error_response
from velstor.api import grid

print_error = partial(print, file=sys.stderr)



def main(args=None):
    """The main routine."""
    if args is None:
        args = sys.argv[1:]

    with Session() as session:
        #
        try:
            return worker(session, vsh_parser().parse_args())
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
                        '. Did you mean to set a command line switch'
                        , ' or environment variable?'])
               
                return error_response(
                    'Could not reach vCNC server at {}:{}{}'.format(
                        host, port, suffix)
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
        except SystemExit:
            raise
        except KeyboardInterrupt:
            sys.exit(errno.EINVAL)
        except BaseException as e:
            print(e)
            raise
            # return error_response('Unexpected exception in client: '+str(e))

def worker(session, args):
    """Mounts a VP and opens a terminal window into the job's files.

    Returns a tuple (a, b) where 'a' is the exit code and 'b' a JSON string.
    """
    
    #print("Hello " + args.jobid + "!")
    session.login(args.vcnc)
    #
    #  Lookup the grid job on the vcnc
    #  Exit if you don't find it.
    response = grid.get(session, args.jobid)
    if (response['status_code'] != 200):
        return (1, response)
    #
    #  Extract the PeerCache workspace name.
    workspace = json.loads(response['body'])['job_spec']['workspace_name']
    #
    #  Check that it's still there and the same (TODO)

    #
    #  Spawn a vp.  Our wrapper script ensures we are in the installation
    #  directory. Note that 'run(..)' is new in Python 3.5
    #
    if args.mount:
        mount_point = args.mount
    else:
        mount_point = '/tmp/velstor/'+args.jobid
    try:
      os.makedirs(mount_point)
    except FileExistsError as e:
        pass
      
    #
    #  Mount the VP
    #
    vp_cmd = [
        './bin/vp'
        , '--mount={}'.format(mount_point)
        , '--mentor={}'.format(args.vpm)
        , '--workspace={}'.format(workspace)
    ]
    result = subprocess.run(vp_cmd)
    #
    #  Start an xterm.
    #
    #  We start an xterm whether or not the vp mount fails.  If everything
    #  is working correctly, the vp mount fails because there already
    #  is a vp open.  If so, then opening another terminal window
    #  at the mount point is a feature.
    #
    #  If things aren't working, then the user has to fix the underlying
    #  problem and also manually close the terminal windows.  Hopefully
    #  this will not be the common case.
    #
    subprocess.run(['xterm', '-e', 'cd {}; bash'.format(mount_point)])
    #
    #  We want to automagically unmount the VP when the user is finished.
    #  But how do we know when the user is finished?  There are better
    #  (but expensive and complicated) and worse (but simpler) ways to 
    #  do this.
    #
    #  What we do here is: the user is done when (1) the original xterm
    #  window has been closed and also (2) there are no processes whose
    #  current directory is within the mount point. 
    #
    #  We achieve that by doing a lazy ( -z ) fuse unmount, but only if
    #  we are the the original terminal (that is, the terminal that
    #  originally successfully mounted the vp).
    #
    if result.returncode == 0:
    	subprocess.run(['fusermount', '-uz', '{}'.format(mount_point)])
    #
    #  Always report success
    #
    return (0, '')
    

if __name__ == "__main__":
    (exit_code, response) = main()
    print(json.dumps(response, sort_keys=True, indent=2))
    sys.exit(127 if (exit_code > 127) else exit_code)
