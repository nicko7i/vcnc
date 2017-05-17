Configuring the Development Environment
=======================================

TBD

Python
------

Python is needed for the documentation generator *Sphinx* and for vCNC software
written in Python.  Ensure you are using the Python 3.5 bundled in *TOOLROOT*.

.. code-block:: console

    % sudo pip install --upgrade pip
    % sudo pip install virtualenv
    % virtualenv -p /opt/frqu/TOOLROOT/bin/python3 venv
    % source ./venv/bin/activate
    % (venv) pip install sphinx sphinx-autobuild sphinx_rtd_theme

node.js
-------

The build system uses the nvm bundled with *TOOLROOT*. Place the following in
your *.bashrc* file:

.. code-block:: bash

    export NVM_DIR="/opt/frqu/TOOLROOT/nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
    [[ -r $NVM_DIR/bash_completion ]] && . $NVM_DIR/bash_completion



