Design Notes
============

REST API Conventions
--------------------

"REpresentational State Transfer" (REST) comprises two ideas:

# *resources* found at *URLs* are manipulated with HTTP verbs such as GET and DELETE
# State transitions are explicitly modeled with HATEOAS_

This section describes the conventions by which **vcnc-rest** models resources
and operations.  **vcnc** does not use HATEOAS.

We will use the term *endpoint* for the left-hand portion of the resource URL
from the beginning of the route to the resource ID.  For example, in::

  GET /blog/post/2000-01-01-12345

*/blog/post* is the *endpoint*.  While this term is not universally accepted
for REST we use it here because it is more specific than "URL".

Singular and Plural
'''''''''''''''''''

Plural endpoints refer to a resource collection as a whole.::

  GET /grid/jobs

returns the collection of all grid jobs.  Singular endpoints operate on a single
resource::

  DELETE /grid/job/12345

Creating a new resource without specifying the ID would be a POST on the
(plural) endpoint::

  POST /_cursors

produces a new cursor resource having a server-generated ID, while::

  POST /workspace/0/%2Fmy%2Fnew%2Fworkspace

creates a new workspace called  */my/new/workspace* on vTRQ 0.

POST and PUT
''''''''''''

The fundamental difference is idempotency (calling it once
has the same effect as calling it more than once). PUT is idempotent; POST is
not.  **vcnc** uses PUT to create or modify a resource whose name is
already known, and POST to create a new resource with a server-generated name.

Hierarchical Names
''''''''''''''''''

Many PeerCache entities have hierarchical names, which are represented by *paths*
such as */a/path/name*.  Hierarchical names are URL-encoded when passed as part
of the URL. Consequently, a path name is always a single URL element.

Endpoint /vtrq
''''''''''''''

Every endpoint under */vtrq* takes an integer vTRQ ID as part of the URL,
immediately after the endpoint.  For example::

  GET /vtrq/workspace/1/%2Fsilver%2Fmoon

returns information about workspace */silver/moon* on the vTRQ having ID '1'.

Extended Operations
'''''''''''''''''''

In some cases, the HTTP 1.1 verbs are not sufficient to everything we wish to
do with a resource.  **vcnc** has two ways of dealing with this.

When the operation applies to a single resource, an operator is added at the
end of the URL.  */vtrq/namespace/0/%2Fa%2Fdirectory/children returns the child
nodes of */a/directory* on vTRQ 0.

Otherwise, the operation name is placed immediately before the vTRQ ID and POST
is use to tunnel the data needed by the operation.  For example::

  POST /vtrq/meta_copy/5

performs a meta-data copy on vTRQ 5. Details are sent in the request body.

.. _HATEOAS: https://en.wikipedia.org/wiki/HATEOAS
