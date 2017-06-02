"""

"""
import json
import copy
from velstor.api.util import fake_requests_response as fake_response
from velstor.api import workspace as ws


def to_delegation_from_legacy(legacy):
    """Returns a delegation workspace spec from its legacy form

       Returns the workspace spec as an object.  Accepts either 
       objects or JSON strings.
    """

    def munge(elem):
        """"Converts a legacy workspace entry to its delegation form"""
        e = copy.copy(elem)
        del e['local']
        return e

    spec = json.loads(legacy) if type(legacy) is str else legacy
    writeback = 'never' if spec[0]['local'] else 'always'
    return {'writeback': writeback,
            "maps": [munge(e) for e in spec]}


def _to_delegation_from_response_body(body):
    """"Converts a (string) response body in legacy form to the delegation form"""

    if type(body) != str:
        raise TypeError('Expected {} not {}'.format(type(""), type(body)))
    b = json.loads(body)
    b['spec'] = to_delegation_from_legacy(b['spec'])
    return json.dumps(b)


def _to_legacy_from_delegation(delegation):
    """Converts a delegation workspace specification to its legacy form.

    Operates at a different structural level from _to_delegation_from_response_body(..).
    """

    def munge(is_local):
        """"Returns a function that will add a 'local' key with value 'local'"""
        def func(d):
            rtn = copy.copy(d)
            rtn['local'] = is_local
            return rtn
        return func

    spec = json.loads(delegation) if type(delegation) is str else delegation
    writeback = spec['writeback'].lower()
    if writeback == 'always':
        local = False
    elif writeback == 'explict':
        local = True
    elif writeback == 'trickle':
        local = True
    elif writeback == 'never':
        local = True
    else:
        raise ValueError("invalid value '{}' for writeback".format(writeback))

    return [(munge(local))(e) for e in spec['maps']]


def delete(session, vtrqid, path):
    return ws.delete(session, vtrqid, path)


def get(session, vtrqid, path):
    response = ws.get(session, vtrqid, path)
    if response['status_code'] == 200:
        return {"status_code": 200,
                "body": json.dumps(_to_delegation_from_response_body(response['body']))}
    return response


def list(session, vtrqid, path):
    return ws.list(session, vtrqid, path)


def set(session, vtrqid, path, delegation):
    try:
        #
        #  The spec is received as an array of strings from argparse. We
        #  convert it into a string for the downstream API.
        #
        return ws.set(
            session,
            vtrqid,
            path,
            _to_legacy_from_delegation(" ".join(delegation)))
    except ValueError as e:
        message = 'Invalid workspace specification: ' + str(e)
        return fake_response(400, 'EINVAL', message)
