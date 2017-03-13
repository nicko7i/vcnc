import requests
import json

from velstor.api.util import print_error
from velstor.api.util import urlencode
from velstor.api.fulfill202 import fulfill202
from velstor.api.util import fake_requests_response as fake_response
from velstor.api.workspace_preview import _to_preview_by_spec

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

def get_as_preview(session, jobid):
    response = get(session, jobid)
    if response['status_code'] == 200:
        #
        #  The workspace spec is job_spec.workspace_spec within the response
        #
        b = json.loads(response['body'])
        b['job_spec']['workspace_spec'] = json.dumps(_to_preview_by_spec(b['job_spec']['workspace_spec']))
        return { "status_code": 200
                 , "body": json.dumps(b) }
    return response


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


def post(session, jobid, vtrq_id, workspace_name):
    """Posts information about a grid job.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security information.
        jobid (str): The job's identifying string.
        vtrq_id (int): The vTRQ of the worksapce name.
        workspace_name (str): The PeerCache workspace employed by the job.

    Returns:
        The return value of :func:`~velstor.api.fulfill202.fulfill202`
    """
    #
    url = '/'.join([session.base_url()
                    , 'grid/job'
                    , urlencode(jobid)])
    r = requests.post(url
                      , json={
                          'workspace_name': workspace_name
                          , 'vtrq_id': vtrq_id
                      })
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

