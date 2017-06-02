"""

"""
import requests
import json
from velstor.api.util import fake_requests_response as fake_response
from velstor.api.util import urlencode
from velstor.api.fulfill202 import fulfill202

# workspace.py:  Operations on a TRQ's set of workspace specifications


def delete(session, vtrqid, path):
    """Deletes a workspace.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified workspace name.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    #
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'workspaces',
                    str(vtrqid),
                    urlencode(path)])
    r = requests.delete(url)
    return fulfill202(session, r)


def get(session, vtrqid, path):
    """Retrieves a workspace specification.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified workspace name.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    #
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'workspaces',
                    str(vtrqid),
                    urlencode(path)])
    r = requests.get(url)
    return fulfill202(session, r)


def list(session, vtrqid, path):
    """Returns the names at a workspace path.

    The names may represent workspaces or nodes of the hierarchy.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified workspace path.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    #
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'workspaces',
                    str(vtrqid),
                    urlencode(path),
                    'children'])
    r = requests.get(url)
    return fulfill202(session, r)


def set(session, vtrqid, path, spec):
    """Creates or overwrites a workspace.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified workspace name.
        spec (Iterable[str]): Workspace definition

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    #
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'workspaces',
                    str(vtrqid)])
    try:
        r = requests.post(url, json={'name': path, 'spec': spec})
        return fulfill202(session, r)
    except ValueError as e:
        message = 'Invalid workspace specification: ' + str(e)
        return fake_response(400, 'EINVAL', message)
