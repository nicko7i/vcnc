import velstor.restapi.namespace as ns
import sys
import os
import errno
import json
from velstor.libutil import synthetic_response
from velstor.libutil import rpc_status_to_http_status

from velstor.vclc.handler import reverse_dict_lookup


def ns_copy(session, vtrqid, src, dest, overwrite):
    """Modified velstor.api call for meta-data copies"""
    result = ns.copy_vector(session,
                            vtrqid,
                            [{'src': src, 'dest': dest}],
                            overwrite)
    # print('ns_copy:', result)
    #
    #  This command always does a single operation, but it is conveyed through
    #  a vector mechanism.  We need to unpack it here.  'result' is
    #  a 'requests' response object.
    #
    #
    #  Emulate a requests.response object
    #
    try:
        #
        #  If the request didn't complete the operation, the standard
        #  response handling is sufficient.
        #
        if result['status_code'] != 200:
            return result
        #
        #  Unpack the json-formatted body
        #
        payload = json.loads(result['body'])
        if payload['error_sym'] != 'OK':
            return result
        #
        #  Everything went well.  If the array is empty, the metadata copy
        #  succeeded and 'error_sym' is 'OK'. Otherwise, the 'error_sym'
        #  value is the value inside the array.
        #
        errsym = 'OK'
        if len(payload['result']):
            errsym = payload['result'][0]['error_sym']
        message = os.strerror(reverse_dict_lookup(errno.errorcode, errsym))
        return synthetic_response(
            rpc_status_to_http_status(errsym),
            errsym,
            message)
    except:
        message = 'Internal client error on meta-data copy: '
        # message += str(sys.exc_info()[0])
        message += str(sys.exc_info())
        return synthetic_response(500, 'EREMOTEIO', message)
