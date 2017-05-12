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
