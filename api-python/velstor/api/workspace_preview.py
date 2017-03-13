"""

"""
import json
import copy
from velstor.api.util import fake_requests_response as fake_response
from velstor.api import workspace as ws

def _to_preview_by_spec(spec):
    """Returns a preview workspace spec from its legacy form

       Returns the workspace spec as an object.  Accepts either 
       objects or JSON strings.
    """

    def munge(elem):
        "Converts a workspace entry to its preview form"
        e = copy.copy(elem)
        del e['local']
        return e

    if type(spec) is str:
        spec = json.loads(spec)
    writeback = 'never' if spec[0]['local'] else 'always'
    return { "writeback": writeback
            , "maps": [ munge(e) for e in spec ] }

def _to_preview_by_body(body):
    "Converts a response body from its original form to the preview form"

    b = json.loads(body)
    b['spec'] = _to_preview_by_spec(b['spec'])
    return json.dumps(b)

def _to_spec(preview):
    """Converts a workspace specification in preview form to its orignal form.

    Operates at a different structural level from _to_preview_by_body(..).
    """

    def munge(local):
        "Returns a function that will add a 'local' key with value 'local'"
        def func(d):
            rtn = copy.copy(d)
            rtn['local'] = local
            return rtn
        return func

    foo = " ".join(preview)
    prvw = json.loads(foo)
    writeback = prvw['writeback'].lower()
    if writeback == 'always':
        local = False
    elif writeback == 'never':
        local = True
    else:
        raise ValueError("invalid value '{}' for writeback".format(writeback))

    return json.dumps([ (munge(local))(e) for e in prvw['maps'] ])

def delete(session, vtrqid, path):
    return ws.delete(session, vtrqid, path)

def get(session, vtrqid, path):
    response = ws.get(session, vtrqid, path)
    if response['status_code'] == 200:
        return { "status_code": 200
                 , "body": _to_preview_by_body(response['body']) }
    return response

def list(session, vtrqid, path):
    return ws.list(session, vtrqid, path)

def set(session, vtrqid, path, preview):
    try:
        #
        #  The spec is received as an array of strings from argparse. We
        #  have pass it into the downstream api as an array.
        #
        return ws.set(session, vtrqid, path, [_to_spec(preview)])
    except ValueError as e:
        message = 'Invalid workspace specification: ' + str(e)
        return fake_response(400, 'EINVAL', message)
