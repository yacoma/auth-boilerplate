Quick Start
===========

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
(env) $ pip install -Ur requirements/develop.txt
(env) $ py.test
```
