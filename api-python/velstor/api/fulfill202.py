#
#  Copyright (C) 2016 IC Manage Inc.
#
#  See the file COPYING for license details.
#
import time
import requests


def _return(status_code, body, func, delivery):
    """Consolidates return value processing.

    Args:
        status_code: The HTTP status code resulting from this REST operation.
        body: The REST response body.
        func: The callable passed to fulfill202.
        delivery: The fullfill/202 delivery status, one of 'pending',
            'completed' or 'failed'.

    Returns:
        A dict having two keys: 'http_status' and 'body'. See fulfill202()
        for a more detailed description.
    """
    if hasattr(func, '__call__'):
        func(delivery)
    return {
        'status_code': status_code,
        'body': body
    }


def fulfill202(session, response, interval=10, callback=None):
    """Implements a synchronous interface to an asynchronous REST API.

    When the vTRQ takes more than a certain time to respond, the vCNC issues
    an HTTP 202 'Accepted' response.  The header of the 202 response contains
    a URL at which the client (this library) may poll for the eventual result.

    This convenience function converts the asynchronous protocol into
    a synchronous call, performing the necessary polling and returning either
    the final result or an appropriate error code.  The return value looks
    like a Requests 'response' object. *http_status* contains an integer HTTP
    status value and *body* contains the HTTP response body as
    documented by the vCNC REST API.

    The callback is invoked each time a polling response is received. The
    callback is passed a single string argument, one of *pending*, *completed*,
    or *failed*. *Pending* means the REST interface expects to eventually
    deliver the result; *failed* means the API call has permanently failed; and
    *completed* means this polling result contains the delivered response.

    Args:
        session (:class:`~velstor.api.session.Session`): Provides security\
        information.
        response (object): A Requests.response object.
        interval (int): The interval, in seconds, at which the REST server\
        will be polled.
        callback (callable): A callable taking a single string argument.

    Returns:
        dict: A dict having two keys: 'http_status' and 'body'.
    """
    #
    #  If the response status isn't 202, return the response directly.
    #
    if response.status_code != 202:
        return _return(
            response.status_code
            , response.text
            , callback
            , 'completed')
    #
    #  Otherwise, poll for the result.
    #
    try:
        url = response.headers['location']
    except:
        return _return(
            502
            , 'Bad Gateway, no location header.'
            , callback
            , 'failed')
    while True:
        time.sleep(interval)
        #
        #  Make a properly secured http request.
        #
        poll = requests.get(url)
        #
        #  If the poll itself fails, pass the error through.
        #
        if poll.status_code != 200:
            return _return(
                poll.status_code
                , poll.text
                , callback
                , 'failed')
        try:
            poll_content = poll.json()
            poll_delivery = poll_content['delivery']
        except:
            return _return(
                502
                , 'Bad Gateway, invalid JSON body (' + poll.text + ').'
                , callback
                , 'failed')
        #
        #  Otherwise, check the delivery status.
        #  ... if the status is 'failed', return a 410 'Gone' to indicate that
        #      the deferred results will never be available.
        #
        if poll_delivery == 'failed':
            return _return(
                410
                , 'Gone'
                , callback
                , 'failed')
        #
        #  ... if the status is 'completed', return the deferred status and
        #      body as the actual status and bodyp.x
        #
        if poll_delivery == 'completed':
            try:
                poll_status = poll_content['status']
                poll_body = poll_content['body']
            except:
                return _return(
                    502
                    , 'Bad Gateway, invalid JSON body (' + poll_content + ').'
                    , callback
                    , 'failed')
            return _return(
                poll_status
                , poll_body
                , callback
                , 'completed')
        #
        #  ... if the status is 'pending', go to the top of the loop to wait
        #      for the next poll.
        #
        if poll_delivery == 'pending':
            if hasattr(callback, '__call__'):
                callback('pending')
            else:
                # The next line is Python 3.3 or later
                # print('.', end='', file=sys.stderr, flush=True)
                pass
            continue
        #
        #  ... Otherwise, the status itself is invalid, which is itxs own
        #      sort of EREMOTEIO.
        #
        return _return(
            502
            , 'Bad Gateway, invalid delivery status: ' + poll_delivery
            , callback
            , 'failed')
