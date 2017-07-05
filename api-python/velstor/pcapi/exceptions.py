import json
from velstor.libutil import unpack_response


class RESTException(Exception):
    def __init__(self, response):
        super(RESTException, self).__init__(
            "Non 2xx HTTP response: '{}'".format(response)
        )
        response = unpack_response(response)
        self.http_code = response['status_code']
        self.error_sym = response['body']['error_sym']


def raise_if_not_2xx(response):
    """Convenience function"""
    response = unpack_response(response)
    http_code = response['status_code']
    if not (200 <= http_code and http_code < 300):
        raise RESTException(response)
