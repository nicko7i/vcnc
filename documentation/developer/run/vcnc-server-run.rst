Running *vcnc-server*
=====================

*vcnc-server* comprises two programs: *vcnc-rest* and *vcnc-sampler*.

*vcnc-rest* is the REST server that talks to the *vtrq* and to which *vclc* connects.
You'll probably want to run that.

*vcnc-sampler* takes in data from *vtrq* and *vpms*, processes it,
and makes it available to *vcnc-rest*.  The environment we prepared doesn't
include a *vda*, so this document won't talk about running *vcnc-sampler*.

The following code moves to the *vcnc-rest* directory and runs the server
in the foreground:

.. code-block:: console

  cd vcnc-server/vcnc-rest
  npm start

An interactive REST interface is available:

.. code-block:: console

  firefox http://localhost:6130/v1/doc/api/?url=spec
