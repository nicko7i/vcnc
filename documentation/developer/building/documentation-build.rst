Building this document
----------------------

The build must be done under the Python virtual environment.

.. code-block:: console

  % cd *project-root*
  % source ./venv/bin/activate
  (venv) cd documentation
  (venv) make html

Sphinx will generate a static HTML website in the documentation/_build
directory.  It may be viewed at
file:///*project-root*/documentation/_build/html/index.html

