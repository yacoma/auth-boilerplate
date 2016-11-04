Example for a authentication workflow based on Morepath and Cerebral
====================================================================

Morepath REST server
--------------------

From inside the project directory create a clean Python environment with
`virtualenv <https://virtualenv.pypa.io/en/latest>`_ and activate it::

  $ virtualenv env
  $ source env/bin/activate

After this you can install the package including dependencies using::

  (env) $ pip install -Ue .

Once that is done you can start the server::

  (env) $ run-app

You can go to http://localhost:5000 to see the UI.

For installing the test suite and running the tests use::

  (env) $ pip install -Ur develop_requirements.txt
  (env) $ py.test


Cerebral React client
---------------------

JavaScript code is in the `client` subdirectory. To rebuild the bundle you
need to install the JS dependencies (listed in package.json). Run::

  $ npm install

to install them. Then run::

  $ webpack

To rebuild the bundle after changing it.

If you want to rebuild the bundle and immediately after start the server
you can use::

  $ npm start
