Publishing this Document
========================

The documentation is published on GitHub Pages by placing the
generated files into the /docs directory of the 'master'
branch of 'vcnc'.

After pushing the latest documentation sources to origin/master, build
the documentation as described above and then publish as follows:

.. code-block:: console

  % cd documentation
  % make publish
  % git add ../docs
  % git commit -m "publish documentation"
  % git push

The updated, generated, documentation is now in master/docs on GitHub.
From there, it automagically appears on GitHub pages.
