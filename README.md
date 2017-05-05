Boilerplate for an authentication workflow
==========================================

Morepath REST server
--------------------

From inside the project directory create a clean Python environment with
[virtualenv](https://virtualenv.pypa.io/en/latest) and activate it:

```console
$ virtualenv -p python3 env
$ source env/bin/activate
```

After this you can install the package including dependencies using:

```console
(env) $ pip install -Ue .
```

Once that is done you can start the server:

```console
(env) $ gunicorn server.run
```

You can go to <http://localhost:8000> to see the UI.

For installing the test suite and running the tests use:

```console
(env) $ pip install -Ur develop_requirements.txt
(env) $ py.test
```

Cerebral React client
---------------------

JavaScript code is in the client subdirectory. To rebuild the bundle you
need to install the JS dependencies (listed in package.json). Run:

```console
$ npm install
```

to install them. Then run:

```console
$ npm run build
```

To rebuild the bundle after changing it.

If you want to rebuild the bundle and immediately after start the server
you can use:

```console
$ npm start
```
