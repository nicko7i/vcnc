Preparing to Run
================

*vcnc* depends on three servers:

* `RethinkDB`_
* `REDIS`_
* PeerCache *vtrq*

There are a bewildering number of ways to run these servers. We will describe two: one using a
development *vtrq*, and the other using a released *vtrq*.

All the servers are run locally using their default ports.  By doing so we eliminate a great
deal of tricky configuration alignments.

*vtrq* from *triptych*
______________________

PeerCache developers may use *triptych* to launch the *vtrq*.  *vcnc* expects *vtrq* to
be listening on port ``6100`` of *localhost* (or 127.0.0.x).

.. note::

  Most *triptych* scripts use port ``5700``.  You may need to change your script accordingly.

*vtrq* from PeerCache Product Release
-------------------------------------

We will use the PeerCache installation from the :ref:`external_toolroot` section of :ref:`build_prepare`.

As root, copy the sample *vtrq* .service file to the *systemd* directory and configure it as a service.

.. code-block:: console

  cp /opt/velstor/current/share/vcnc/installer/velstor-vtrq.service /etc/systemd/system
  systemctl enable velstor-vtrq
  systemctl start velstor-vtrq

This will give you a local *vtrq* instance.  If you also need *vpm* and *vp*, refer to these
`instructions for installing PeerCache locally`_

REDIS and RethinkDB
-------------------

Obtain the executables from a PeerCache release.  Install the release locally if you haven't
already.

.. code-block:: console

  ./peercache-leap42.run --target /opt/velstor/current

As root, copy the sample *redis* and *rethinkdb* .service files to the *systemd* directory
and configure them as services.

.. code-block:: console

  cp /opt/velstor/current/share/vcnc/installer/vcnc-redis.servce /etc/systemd/system
  cp /opt/velstor/current/share/vcnc/installer/vcnc-rethinkdb.servce /etc/systemd/system
  systemctl enable vcnc-redis.service
  systemctl start vcnc-redis.service
  systemctl enable vcnc-rethinkdb.service
  systemctl start vcnc-rethinkdb.service

Verify the Services
-------------------

Check that everything is OK by getting the status for each service:

.. code-block:: console

  systemctl status vcnc-redis.service vcnc-rethinkdb.service velstor-vtrq.service

*vtrq* should be listening on port 6100; *redis* on port 6379; *rethinkdb* on port 29105.

.. _REDIS: https://redis.io/

.. _RethinkDB: https://github.com/rethinkdb/rethinkdb

.. _instructions for installing PeerCache locally: https://docs.google.com/document/d/1ZiepQCDps2hb8Qi7k9BGE5yPtBrc6hfG7TXoUVFt5Tw/edit?usp=sharing
