from __future__ import print_function
import urllib
import sys
import json

#
#  Convenience function for printing to stderr
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


def rpc_status_to_http_status(error_sym):
    """
    Returns the HTTP status code corresponding to the PIDL RPC status code.
    
    Args:
        error_sym (str): The error code from the vtrq.

    Returns:
        int: The HTTP status code corresponding to 'error_sym'.
        
    Raises:
        ValueError: Unexpected value of 'error_sym'.

    """
    try:
        return _http_status[error_sym]
    except KeyError:
        raise ValueError('Unknown RPC status code {}'.format(error_sym))


def urlencode(path):
    """
    URL encodes a string
    
    Args:
        path (str): The string to be encoded.

    Returns:
        str: The URL encoded string.
    """
    try:
        # Python 2 syntax
        return urllib.quote(path, '')
    except AttributeError:
        # Python 3 syntax
        return urllib.parse.quote(path, '')


def synthetic_response(status_code, error_sym, message):
    """
    Returns an object that looks like a 'requests' Response object

    Args:
        status_code (int): An HTTP status code value.
        error_sym (str): A symbolic error code, as documented by the vCNC REST API.
        message (str): A brief description of the error.

    Returns:
        obj: A object with two attributes: an integer 'status_code' and a
        string 'body'.
    """

    #  TODO: Replace the 'Expando' with a dedicated Python class.

    class Expando(object):
        pass
    rtn = Expando()
    rtn.status_code = status_code
    rtn.text = json.dumps({'error_sym': error_sym,
                           'message': message})
    return rtn


def unpack_response(response):
    """
    Unpacks a JSON response body into a dict.
    
    Args:
        response: a response body from the 'requests' library.

    Returns:
        dict: The equivalent as a dictionary.
    """
    if isinstance(response['body'], str):
        return {
            'status_code': response['status_code'],
            'body': json.loads(response['body'])
        }
    return response


class CommonEqualityMixin(object):
    """Simple (in)equality functionality.

    See StackOverflow https://stackoverflow.com/a/390511/7702839"""
    def __eq__(self, other):
        return (isinstance(other, self.__class__)
                and self.__dict__ == other.__dict__)

    def __ne__(self, other):
        return not self.__eq__(other)
