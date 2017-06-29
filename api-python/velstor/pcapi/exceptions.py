import json


class RESTException(Exception):
    def __init__(self, doc):
        super(RESTException, self).__init__(
            "Non 2xx HTTP response: '{}'".format(doc)
        )
        response = json.loads(doc)
        self.http_code = response['http_status']
        self.error_sym = response['error_sym']


def raise_if_not_2xx(doc):
    """Convenience function"""
    http_code = json.loads(doc)['http_status']
    if not (200 <= http_code and http_code < 300):
        raise RESTException(doc)
