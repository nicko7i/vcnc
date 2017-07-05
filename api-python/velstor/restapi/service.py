import requests
from velstor.restapi.fulfill202 import fulfill202

# service.py:  Operations on a TRQ


def shutdown(session, vtrqid):
    """Gracefully shuts down a vTRQ.

    Args:
        session (:class:`~velstor.restapi.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.

    Returns:
        The return value of :func:`~velstor.restapi.fulfill202.fulfill202`
    """
    # validate vtrqid is an integer
    url = '/'.join([session.base_url()
                    , 'vtrq'
                    , 'service'
                    , str(vtrqid)])
    r = requests.delete(url)
    return fulfill202(session, r)
