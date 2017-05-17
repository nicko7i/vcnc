Building *vcnc-server*
----------------------

*vcnc-server* contains two node.js projects and a C++ extension to
Google's *V8* JavaScript interpreter.  All are built as a single
*autotools* project.

Configure, build and install is done in the familiar way.

.. note::

  The build directory must be called 'Build'
  because node_gyp is hardwired to find its dependencies there.

.. code-block:: console

  % autoreconf
  % mkdir Build
  % cd Build
  % ../configure --with-pic --with-toolroot=/opt/frqu/TOOLROOT
  % make

