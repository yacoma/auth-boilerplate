Cerebral React client
=====================

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


Testing
-------

To run the tests use:

```console
$ npm test
```

For checking coverage:

```console
$ npm run coverage
```

After you can create a coverage report in html format:

```console
$ npm run coverage:report
```

For checking linting errors:

```console
$ npm run lint
```

You can automatically fix them with:

```console
$ npm run format
```
