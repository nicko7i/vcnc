import argparse
import errno
import json
from velstor.vclc.vClcException import vClcException


def reverse_dict_lookup(d, d_val):
    #
    #  Reverse dictionary lookup.  We only do this once, so it's
    #  not worth creating a reverse dictionary; we just eat the O(n)
    #  behavior.
    #  http://stackoverflow.com/questions/9542738/python-find-in-list
    #  http://stackoverflow.com/questions/2568673/inverse-dictionary-lookup-python
    #
    if d_val == "OK":
        return 0
    return list(d)[next(i for i, x in enumerate(d.values()) if x == d_val)]


def _mk_msg(*args):
    return ' '.join([str(x) for x in args])


def error_response(message,
                   error_sym="EREMOTEIO",
                   http_status=500,
                   detail=None):
    """Returns an (exit_code, dict) pair"""
    if detail:
        res = {'http_status': http_status,
               'response': {'error_sym': error_sym,
                            'message': message,
                            'detail': detail}}
    else:
        res = {'http_status': http_status,
               'response': {'error_sym': error_sym,
                            'message': message}}
    return errno.EREMOTEIO, res


def finish(status_code, json_response):
    #
    #  The vclc exit code ( $? ) is based on the 'error_sym' value
    #  from the overall operation.
    #
    exit_code = 0
    #
    #  The REST API defines that code symbolically, using an
    #  errno.h name, so we need to look it up.
    #
    ec = errno.errorcode  # the system dictionary of errno errcodes
    try:
        errsym = json.loads(json_response)['error_sym']
    except:
        message = "vCNC response is not JSON.  Is the vCNC host/port correct?"
        return error_response(message, detail=json_response)
    try:
        if errsym != 'OK':
            exit_code = reverse_dict_lookup(ec, errsym)
    except:
        msg = _mk_msg(['vclc internal error: reverse-lookup',
                       errsym])
        return error_response(msg)
    #
    #  Return the results, good, bad, or ugly.
    #
    return (exit_code,
            {'http_status': status_code,
             'response': json.loads(json_response)})


class Handler(argparse.Namespace):
    def __init__(self, session):
        super(Handler, self).__init__()
        self.session = session

    def action(self):
        #
        #  Turn the list of argument names into a list of argument values
        #
        try:
            vcnc = getattr(self, 'vcnc')
            values = [getattr(self, x) for x in self.api_args]
        except:
            raise vClcException()
        result = self.api_func(self.session.login(vcnc), *values)
        if hasattr(result, 'text'):
            return finish(result.status_code, result.text)
        return finish(result['status_code'], result['body'])
