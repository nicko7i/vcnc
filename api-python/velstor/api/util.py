from __future__ import print_function
import urllib
import sys
import json

from functools import partial
print_error = partial(print, file=sys.stderr)


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


def fake_requests_response(status_code, error_sym, message):
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
    rtn.text = json.dumps({'error_sym': error_sym
                           , 'message': message})
    return rtn
