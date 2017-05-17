.. _build_prepare:

Preparing to Build
==================

The following is needed to build the software:

* Libraries from PeerCache
* Node Version Manager (nvm)

The libraries and programs on which the software depends have been gathered
into a directory called *TOOLROOT*. Build preparation comes down to
obtaining the appropriate TOOLROOT and configuring the developer's environment
to use it.

We consider two situations. The first is a PeerCache developer who will be
working on *vcnc* and PeerCache at the same time. The goal is to run PeerCache
and *vcnc* from their respective development directories and have everything
work together correctly. This is called the *internal* case.

The second situation is a customer who is modifying *vcnc* and wants it to
run correctly against a PeerCache product release.  This is called the *external*
case.

Internal TOOLROOT
'''''''''''''''''

*vcnc* uses the same TOOLROOT as PeerCache.  Build PeerCache first. When the
build is finished, run ``make install`` to put the latest PeerCache libraries
into your TOOLROOT.  You are now ready to install GNU Tools.

.. _external_toolroot:

External TOOLROOT
'''''''''''''''''

Each PeerCache product distribution is, when unpacked, *also* a TOOLROOT for *vcnc*.

Install the distribution onto your workstation, and then create a symbolic link:

.. code-block:: console

  ./peercache-leap42.run --target /opt/velstor/current
  mkdir -p /opt/frqu
  ln -s /opt/velstor/current /opt/frqu/TOOLROOT

You are now ready to install GNU tools.

Install GNU Tools
'''''''''''''''''

Parts of *vcnc-server* rely on *autotools*, *boost*, and *gcc*.
TOOLROOT provides *autotools* and *boost*.  The platform (CentOS 7
or Leap 42) provides GCC 4.8.  On SuSE, it sufficient to install the
"C++ Development" pattern using YAST.

.. note::

  The software does not build with GCC 6.x.

Configure the Environment
'''''''''''''''''''''''''

We need ``$TOOLROOT/bin`` on our path, and *nvm* configured to use ``$TOOLROOT/nvm``.

.. code-block:: bash

  export PATH=/opt/frqu/TOOLROOT/bin:$PATH
  export NVM_DIR="/opt/frqu/TOOLROOT/nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
  [[ -r $NVM_DIR/bash_completion ]] && . $NVM_DIR/bash_completion

You are now ready to build the *vcnc* software. At minimum, you will need to build
*vcnc-server*.


