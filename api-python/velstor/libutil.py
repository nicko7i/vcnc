import json


def unpack_response(response):
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


