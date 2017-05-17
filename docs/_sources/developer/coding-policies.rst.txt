Policies
========

General Policies
----------------

Indent using spaces. Do not use tabs.

Python indents four, per PEP 8.  All other languages indent by two.

Maintain 80 character margins.

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
ESLInt validation is recommended.