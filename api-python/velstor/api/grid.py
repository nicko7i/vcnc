import requests

from velstor.api.util import print_error
from velstor.api.util import urlencode
from velstor.api.fulfill202 import fulfill202
from velstor.api.util import fake_requests_response as fake_response

#  grid.py:  Operations about grid jobs


def get(session, jobid):
    """Retrieves details about a grid job.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        jobid (str): The job's identifying string.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #
    url = '/'.join([session.base_url()
                    , 'grid/job'
                    , urlencode(jobid)])
    r = requests.get(url)
    return fulfill202(session, r)


def delete(session, jobid):
    """Deletes information about a grid job.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        jobid (str): The job's identifying string.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #
    url = '/'.join([session.base_url()
                    , 'grid/job'
                    , urlencode(jobid)])
    r = requests.delete(url)
    return fulfill202(session, r)


def post(session, jobid, workspace_name):
    """Posts information about a grid job.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        jobid (str): The job's identifying string.
        workspace_name (str): The PeerCache workspace employed by the job.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #
    url = '/'.join([session.base_url()
                    , 'grid/job'
                    , urlencode(jobid)])
    r = requests.post(url, json={'workspace_name': workspace_name})
    return fulfill202(session, r)

def list(session):
    """Retrieves a list of existing jobs.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #
    url = '/'.join([session.base_url()
                    , 'grid/jobs'])
    r = requests.get(url)
    return fulfill202(session, r)

