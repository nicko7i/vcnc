IDEs (optional)
===============

Developers are not required to use a particular IDE, or any IDE at all.
Tips for setting up some IDEs are provided in the following sections.

WebStorm
--------

This description sets up a single WebStorm project for all of the subsystems
under the GitHub repository root.  We will use the *vcnc-web* ESLint configuration
for *vcnc-rest* as well.

First run 'npm install' in directory vcnc-web.  This provides the ESLint package
that WebStorm needs to perform linting.

We will do the following:

#. Turn off all the JavaScript inspections except for ESLint
#. Configure JavaScript for "React JSX" (which implies ES6) and "strict mode".
#. Configure ESLint to point explicitly to vcnc-web/.eslintrc.js.
#. Configure indenting in the editor.

Navigate to File :: Settings... :: Editor :: Inspections :: JavaScript.
Clear all inspections, then under "Code Quality" enable only "ESLint".

Navigate to File :: Settings... :: Languages & Frameworks :: JavaScript.
Set "JavaScript Language Version" to "React JSX" and enable "Prefer strict
mode".

From there, navigate to Code Quality Tools :: ESLint.

#. Check the Enable box.
#. Set the Node interpreter to the project interpreter in TOOLROOT.
#. The ESLint package is */<project-dir>/vcnc-web/node_modules/eslint*.
#. Set the configuration file explicitly to */<project-dir>vcnc-web/.eslintrc.js*.

Navigate to File :: Settings... :: Editor :: Code Style :: JavaScript.
Ensue that "Use tab character" is *not* checked and "Indent" is "2".
Ensure that "Indent chained methods" is *not* checked.

