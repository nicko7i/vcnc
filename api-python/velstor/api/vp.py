import requests

from velstor.api.fulfill202 import fulfill202

#  vp.py:  Operations about VPs


def to_vtrqspace(session, vtrqid, vpid, paths):
    """Deprecated.
    """
    #  validate vtrqid is an int
    #  validate vpid
    #  validate paths is an array of string
    #
    url = '/'.join([session.base_url(),
                    'vtrq/vp',
                    str(vtrqid),
                    vpid,
                    'to_vtrqspace'])
    r = requests.post(url,
                      json={'paths': paths})
    return fulfill202(session, r)


def get(session, vtrqid, vpid):
    """Retrieves details about a mounted client file system.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        vpid (str): An opaque VP (mounted client file system) identifier.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate vpid
    #
    url = '/'.join([session.base_url(),
                    'vtrq/vp',
                    str(vtrqid),
                    vpid])
    r = requests.get(url)
    return fulfill202(session, r)


def delete(session, vtrqid, vpid):
    """Dismounts a mounted client file system.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        vpid (str): An opaque VP (mounted client file system) identifier.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate vpid
    #
    url = '/'.join([session.base_url(),
                    'vtrq/vp',
                    str(vtrqid),
                    vpid])
    r = requests.delete(url)
    return fulfill202(session, r)


def find(session, vtrqid, vp_host, mount_point):
    """Returns a filtered list of VP identifiers.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        vp_host (str): The client hostname to match.
        mount_point (str): The path on the client host at which the VP is mounted.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate vpid
    #
    url = '/'.join([session.base_url(),
                    'vtrq/vp',
                    str(vtrqid)])
    r = requests.get(url,
                     params={'vp_host': vp_host,
                             'mount_point': mount_point})
    return fulfill202(session, r)
