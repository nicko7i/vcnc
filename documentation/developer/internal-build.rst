.. _internal_build:

Internal Builds
===============

The vCNC software is built using header files and libraries provided by a
PeerCache customer release bundle, and tested using a lightweight PeerCache
deployment running on the developer's laptop or workstation.

Configuring the Development Environment
---------------------------------------

Python and Node.js are obtained from TOOLROOT. The database,
redis and RethinkDB, can be obtained from any PeerCache unified
release file.

Python
''''''

Python is needed for the documentation generator *Sphinx* and for vCNC software
written in Python.  Ensure you are using the Python 3.5 bundled in *TOOLROOT*.

.. code-block:: console

    % sudo pip install --upgrade pip
    % sudo pip install virtualenv
    % virtualenv -p /opt/frqu/TOOLROOT/bin/python3 venv
    % source ./venv/bin/activate
    % (venv) pip install sphinx sphinx-autobuild sphinx_rtd_theme

node.js
'''''''

The build system uses the nvm bundled with *TOOLROOT*. Place the following in
your *.bashrc* file:

.. code-block:: bash

    export NVM_DIR="/opt/frqu/TOOLROOT/nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
    [[ -r $NVM_DIR/bash_completion ]] && . $NVM_DIR/bash_completion

redis and RethinkDB
'''''''''''''''''''

By default, vCNC expects redis and RethinkDB running with their default
configuration at their default ports.

The document `Installing the PeerCache Tools Locally<https://docs.google.com/document/d/1ZiepQCDps2hb8Qi7k9BGE5yPtBrc6hfG7TXoUVFt5Tw/edit?usp=sharing>`_ describes how to deploy a complete
PeerCache system from a unified build.  Follow the document, but only install *vcnc-redis.service*
and *vcnc-rethinkdb.service* to your */etc/systemd/services* directory.

Alternatively, use the *dummy* client to sync (-f) ``//depot/release/golden-bits/peercache-leap42.run``,
and then:

.. code-block:: bash

  sudo bash
  cd /tmp/release/golden-bits
  ./peercache-leap42.run --target /opt/velstor/current
  cd /opt/velstor/current/share/etc
  cp velstor-vcnc-rethinkdb.service velstor-vcnc-redis.service /etc/systemd/system
  cd /etc/systemd/system
  systemctl enable velstor-vcnc-rethinkdb.service
  systemctl enable velstor-vcnc-redis.service
  systemctl start velstor-vcnc-rethinkdb.service
  systemctl start velstor-vcnc-redis.service

Building the Software
---------------------

The vCNC repository houses a suite of independent projects.  There
is no top-level, "grand unified" build.  Each project is built separately.

Build and Install PeerCache
'''''''''''''''''''''''''''

vCNC is dependent on PeerCache libraries.  Running 'make install' after
building PeerCache puts the libraries in TOOLROOT for the vCNC
build to use.

Building vnc-server
'''''''''''''''''''

vCNC server comprises two programs.

*vcnc-rest* is a Node.js server using a custom V8 JavaScript extension object.
An *autotools* build system ties together the C++ and JavaScript portions of
the project. Once the project has been built with *autotools*, Node development
proceeds using npm in the usual way.

*vcnc-sampler* is a Node.js server that provides real-time perforce data
for *vcnc-web*.

The each program can run without the other.  In particular, the REST
interface *vcnc-rest* works correctly without *vcnc-sampler*.

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

Running the Software
---------------------

Building vcnc-web
'''''''''''''''''

TBD

Building this documentation
---------------------------

The build must be done under the Python virtual environment.

.. code-block:: console

  % cd *project-root*
  % source ./venv/bin/activate
  (venv) cd documentation
  (venv) make html

Sphinx will generate a static HTML website in the documentation/_build
directory.  It may be viewed at
file:///*project-root*/documentation/_build/html/index.html

Publishing this documentation
'''''''''''''''''''''''''''''

The documentation is published on GitHub Pages by placing the
generated files into the /docs directory of the 'master'
branch of 'vcnc'.

After pushing the latest documentation sources to origin/master, build
the documentation as described above and then publish as follows:

.. code-block:: console

  % cd *project-root*
  % git checkout master
  % git pull
  % cd documentation
  % make publish
  % git add ../docs
  % git commit -m "publish documentation"
  % git push

The updated, generated, documentation is now in master/docs on GitHub.
From there, it automagically appears on GitHub pages.
