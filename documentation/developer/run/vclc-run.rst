Running *vclc*
==============

If you are not modifying *vclc* or the Python API, the simplest
way is to alias to the *vclc* in the PeerCache distribution.

.. code-block:: console

  alias vclc=/opt/velstor/current/bin/vclc

As a sanity check, list the root of the vtrq namespace:

.. code-block:: console

  vclc ns ls /

The expected result is:

.. code-block:: console

  {
    "error_sym": "OK",
    "message": "Processed.",
    "children": [
      "root",
      "root-private"
    ]
  }
