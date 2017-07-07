Policies
========

General Policies
----------------

Indent using spaces. Do not use tabs.

Python indents four, per PEP 8.  All other languages indent by two.

Maintain 80 character margins.

Python
------

Follow PEP 8.  Where PEP 8 is silent, use the `Google Python Style Guide`_.

Docstrings are processed by `Napoleon`_ and formatted in `Google style`_.

Annotate types in your docstrings. Parameter types (Args and Keyword Args) are
parenthesized.

.. code-block:: python

    class Workspace(CommonEqualityMixin):
        """
        Represents a vtrq workspace and its hierarchical name.

        Args:
            session (Session): Security and configuration information.
            **kwargs: Optional keywords described below.

        Keyword Args:
            pathname (str): hierarchical workspace name. Default is None.
            vtrq_id (int): vtrq ID.  Default is 0.
            vtrq_path (str): Absolute vtrq path mapped

Types for properties are not parenthesized:

.. code-block:: python

    @property
    def vtrq_path(self):
        """str: Absolute vtrq path mapped by this workspace."""
        return self._vtrq_path


.. _Google Python Style Guide: https://google.github.io/styleguide/pyguide.html
.. _Google style: https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html#example-google
.. _Napoleon: https://sphinxcontrib-napoleon.readthedocs.io/en/latest/

JavaScript
----------

JavaScript follows the AirBnb `JavaScript`_ and `React`_ standards.

JavaScript standards are enforced by `ESLint`_. See vcnc-web/.eslintrc.js

Node.js code uses 'require(..)'. All other code uses ES6 import/export.

.. _React: https://github.com/airbnb/javascript/tree/master/react
.. _JavaScript: https://github.com/airbnb/javascript
.. _ESLint: http://eslint.org/

Node
----

Use npm for scripting. Do not use Grunt, Gulp or similar.

Version Control
_______________

The project is hosted at `GitHub`_.

Use `GitHub Flow`_.

The *node_modules* directory is not checked into version control.

IDE metadata directories (such as WebStorm's *.idea*) are not checked
into version control.

.. _GitHub: https://github.com/nicko7i/vcnc.git
.. _GitHub Flow: https://help.github.com/articles/github-flow/

IDEs
____

The project must always be buildable from the command line.

Developers may use any IDE they wish.  An IDE capable of performing continual
ESLInt and PEP 8 validation is recommended.