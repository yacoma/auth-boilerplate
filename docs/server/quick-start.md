# Quick Start

From inside the project directory create a clean Python environment with
[virtualenv](https://virtualenv.pypa.io/en/latest) and activate it:

```sh
$ virtualenv -p python3 env
$ source env/bin/activate
```

After this you can install the package including dependencies using:

```sh
(env) $ pip install -Ue .
```

Once that is done you can start the server:

```sh
(env) $ gunicorn server.run
```

You can go to <http://localhost:8000> to see the UI.

You can also start the server on another host/port:

```sh
(env) $ gunicorn --bind=example.com:3000 server.run
```

For installing the test suite and running the tests use:

```sh
(env) $ pip install -Ur requirements/develop.txt
(env) $ py.test
```
