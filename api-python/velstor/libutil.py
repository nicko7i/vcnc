import json


def unpack_response(response):
    if isinstance(response['body'], str):
        return {
            'status_code': response['status_code'],
            'body': json.loads(response['body'])
        }
    return response
