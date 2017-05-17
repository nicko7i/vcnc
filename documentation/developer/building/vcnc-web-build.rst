Building *vcnc-web*
-------------------

*vcnc-web* is software that runs inside the browser.  The build process,
using Node.js as a scripting environment, generates a directory which can
be served by any web browser as if it were a static site.

.. code-block:: console

  % npm install
  % npm run build:production

The ``build:production`` target produces optimized and `minified`_ JavaScript
wrapped in HTML, placing the results in the ``/dist`` directory.

During development, the ``start`` target builds the project,
starts a Node.js server, and opens a connected browser window.

.. code-block:: console

  % npm start

.. _minified: https://en.wikipedia.org/wiki/Minification_(programming)
