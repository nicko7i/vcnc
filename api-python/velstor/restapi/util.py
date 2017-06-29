from __future__ import print_function
import urllib
import sys
import json

from functools import partial
print_error = partial(print, file=sys.stderr)

#
#  Must be kept in sync with vcnc_server/js-extension/src/cncSession.cc
_http_status = {
    'OK': 200,
    'EPERM': 401,
    'EEXIST': 409,
    'ENOTDIR': 409,
    'ENOENT': 404,
    'EHOSTDOWN': 504,
    'EINVAL': 400,
    'ENOTEMPTY': 409,
    'EPROTO': 500,
    'EUNATCH': 500,
}


def urlencode(path):
    """URL encodes a string
        Args:
            path (str): The string to be encoded.

        Returns:
            str: The URL encoded string.
    """
    #  Adapt to Python 2 vs Python 3
    if hasattr(urllib, 'quote'):
        return urllib.quote(path, '')
    return urllib.parse.quote(path, '')


def synthetic_response(status_code, error_sym, message):
    """
    Returns an object that looks like a 'requests' Response object

    Args:
        status_code (int): An HTTP status code value.
        error_sym (str): A symbolic error code, as documented by the vCNC REST API.
        message (str): A brief description of the error.

    Returns:
        dict: A dictionary with two keys: an integer 'status_code' and a
        string 'body'.
    """

    class expando(object):
        pass
    rtn = expando()
    rtn.status_code = status_code
    rtn.text = json.dumps({'error_sym': error_sym,
                           'message': message})
    return rtn


def rpc_status_to_http_status(error_sym):
    """
    Returns the HTTP status code corresponding to the PIDL RPC status code.
    
    :param error_sym: The error code from the vtrq.
    :return: The corresponding HTTP status code.
    
    throws: KeyError
    """
    return _http_status[error_sym]
