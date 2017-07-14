#
#  Copyright (C) 2016 IC Manage Inc.
#
#  See the file COPYING for license details.
#
import requests

from velstor.libutil import urlencode
from velstor.restapi.fulfill202 import fulfill202

#  namespace.py:  Operations on a TRQ namespace


def copy_vector(session, vtrqid, pairs, overwrite):
    """Performs one or more meta-data copies on the vtrq.

    Args:
        session (:class:`~velstor.restapi.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        pairs (list): A list of (source, destination) pairs.
        overwrite (bool): When true, an existing destination is overwritten with
            'cp -r' semantics; otherwise, the pair is skipped.

    Returns:
        The return value of :func:`~velstor.restapi.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate pairs is an array
    #  validate overwrite is boolean
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'meta_copy',
                    str(vtrqid)])
    r = requests.post(url,
                      params={'overwrite': overwrite},
                      json={'copy_paths': pairs})
    return fulfill202(session, r)


def delete(session, vtrqid, path, recursive):
    """Removes a namespace node.

    Args:
        session (:class:`~velstor.restapi.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified namespace path.
        recursive (bool): When True, a subtree will removed.  Otherwise, only leafs will be removed.

    Returns:
        The return value of :func:`~velstor.restapi.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'namespace',
                    str(vtrqid),
                    urlencode(path)])
    r = requests.delete(url, params={'recursive': recursive})
    return fulfill202(session, r)


def mkdir(session, vtrqid, mode, parents, path):
    """Creates a directory on the vtrq.

    Args:
        session (:class:`~velstor.restapi.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified namespace path.

    Returns:
        The return value of :func:`~velstor.restapi.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    #  validate recursive is boolean
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'namespace',
                    str(vtrqid),
                    urlencode(path),
                    'mkdir'])
    r = requests.post(url, params={'mode': mode, 'parents': parents})
    return fulfill202(session, r)


def list(session, vtrqid, path):
    """Returns names of the child nodes of a vtrq path.

    Args:
        session (:class:`~velstor.restapi.Session`): Provides security information.
        vtrqid (int): ID of the vTRQ.
        path (str): Fully-qualified namespace path.

    Returns:
        The return value of :func:`~velstor.restapi.fulfill202.fulfill202`
    """
    #  validate vtrqid is an int
    #  validate path is a string and is absolute
    url = '/'.join([session.base_url(),
                    'vtrq',
                    'namespace',
                    str(vtrqid),
                    urlencode(path),
                    'children'])
    r = requests.get(url, timeout=5.0)
    return fulfill202(session, r)
