from velstor.libutil import unpack_response


class RESTException(Exception):
    """
    Raised when an unexpected HTTP status is received from the REST server.
    
    Args:
        response: The 'requests' library response object.
        
    Attributes:
        http_code (int): The HTTP status code.
        error_sym (String): The 'errno.h' code from the REST endpoint.
    """
    def __init__(self, response):
        """
        Constructs a RESTException from a 'requests' response object.
        """
        super(RESTException, self).__init__(
            "Non 2xx HTTP response: '{}'".format(response)
        )
        response = unpack_response(response)
        self.http_code = response['status_code']
        self.error_sym = response['body']['error_sym']


def raise_if_not_2xx(response):
    """
    Raises :class:`RESTException` if the response code is not between 200 and 299.
    
    Args:
        response: The 'requests' library response object.
    """
    response = unpack_response(response)
    http_code = response['status_code']
    if not (200 <= http_code and http_code < 300):
        raise RESTException(response)
