Building *vclc*
===============

.. _set_up_virtualenv:

Set up virtualenv
-----------------

Use *pip* to `install virtualenv`_ into your system Python. Then create a Python3 virtual
environment that points to your system Python3.  This document uses *venv* for the
directory name.

.. code-block:: console

  % pip install virtualenv
  % virtualenv --python=python3 venv

*virtualenv* must be activated whenever a new shell is created.  That is done by
sourcing the *activate* script.

.. code-block:: console

  % source ./venv/bin/activate

One can verify that *python* is *python3*:

.. code-block:: console

  [nick@einbecker api-python]$ . ./venv/bin/activate
  (venv) [nick@einbecker api-python]$ python --version
  Python 3.5.3
  (venv) [nick@einbecker api-python]$


.. _install virtualenv: https://virtualenv.pypa.io/en/stable/installation/

Install development packages
----------------------------

.. code-block:: console

  % pip install -r requirements.txt

Testing vclc
------------

.. note::

  This will eventually move elsewhere in the document.

.. note::

  Assumes one is inside the IC Manage firewall.

`pytest <https://docs.pytest.org/en/latest/>`_ is the project's test framework.
The tests in *api-python/test/test_sanity.py* are configured to use the internal
`Mastiff <https://docs.google.com/a/icmanage.com/document/d/1UcJ2yql5YKih365z24zP3Zm_iz0lO5rYHYkNyixBWIg/edit?usp=sharing>`_
deployment. Change the configuration at the top of the file to use a different deployment.

To run the basic tests:

.. code-block:: console

  % cd *project-root*
  % python3 -m pytest tests/simple

