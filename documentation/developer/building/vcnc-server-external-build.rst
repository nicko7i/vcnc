External Builds
'''''''''''''''

This build process produces a vCNC that is compatible with a specific
PeerCache product release. The software is built using header files
and libraries provided by a PeerCache customer release bundle,
and tested using a lightweight PeerCache deployment running on
the developer's laptop or workstation.

The installation process involves:

* Obtaining the vCNC sources and PeerCache release bundle.
* Installing PeerCache on the developer's machine.
* Configuring the development environment.
* Building the software.
* Running a sanity check.

Obtaining the vCNC sources
~~~~~~~~~~~~~~~~~~~~~~~~~~

Fork the `GitHub project`_ to your GitHub account and then clone it to your
development machine.

.. _GitHub project: https://github.com/nicko7i/vcnc

Installing PeerCache
''''''''''''''''''''

Please refer to the `PeerCache installation document`_ maintained on the
IC Manage Google Drive account.

.. _PeerCache installation document: https://docs.google.com/document/d/1ZiepQCDps2hb8Qi7k9BGE5yPtBrc6hfG7TXoUVFt5Tw/edit?usp=sharing

In the context of building vCNC, the PeerCache software is called the *TOOLROOT*.

.. note::

  In the installation document, /opt/frqu/TOOLROOT is a symbolic link to /opt/velstor/current.
  An alternative is to use /opt/velstor/current at TOOLROOT.  The symbolic link 
  may cause problems with NVM.  Using /opt/velstor/current causes problems with 
  js-extension/binding.gyp.

.. include:: /developer/build/config-dev-env.rst

Building the Software
'''''''''''''''''''''

The vCNC repository houses a suite of independent projects.  There
is no top-level, "grand unified" build.  Each project is built separately.

Building vnc-server
~~~~~~~~~~~~~~~~~~~

*vcnc-rest* is a Node.js server using a custom V8 JavaScript extension object.
An *autotools* build system ties together the C++ and JavaScript portions of
the project. Once the project has been built with *autotools*, Node development
proceeds using npm in the usual way.

Begin by installing autotools, GNU make and GNU C++ v4.8.

Configure, build and install is done in the familiar way.
The build directory must be called 'Build'
because node_gyp is hardwired to find its dependencies there.

.. code-block:: console

  % autoreconf
  % mkdir Build
  % cd Build
  % ../configure --with-pic --with-toolroot=/opt/frqu/TOOLROOT
  % make 


