Boilerplate for an authentication workflow
==========================================

Detailed documentation you can find at http://auth-boilerplate.readthedocs.io.

tl;dr
-----

### Morepath REST server

From inside the project directory create a clean Python environment with
[virtualenv](https://virtualenv.pypa.io/en/latest) and activate it:

```console
virtualenv -p python3 env
source env/bin/activate
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


### Cerebral React client

JavaScript code is in the client subdirectory. To rebuild the bundle you
need to install the JS dependencies (listed in package.json). Run:

```console
npm install
```

to install them. Then run:

```console
npm run build
```

To rebuild the bundle after changing it.

If you want to rebuild the bundle and immediately after start the server
you can use:

```console
npm start
```

Development
------------

If you want to create a pull request, this is the workflow:

- Fork the repository on GitHub and clone it.
- Checkout a new branch.
  ```console
  git checkout -b patch-1
  ```
- Make the changes you want.
- Add them to git.
  ```console
  git add .
  ```
- For making commits use the following cli which will guide you.
  Javascript code will be auto-formatted with `prettier` during commit.
  ```console
  npm run commit
  ```
- Push the changes.
  ```console
  git push --set-upstream origin patch-1
  ```
- Create the pull request on GitHub.
