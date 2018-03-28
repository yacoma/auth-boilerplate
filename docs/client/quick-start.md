# Cerebral React client

JavaScript code is in the client subdirectory. To rebuild the bundle you
need to install the JS dependencies (listed in package.json). Run:

```sh
$ npm install
```

to install them. Then run:

```sh
$ npm run build
```

To rebuild the bundle after changing it.

If you want to rebuild the bundle and immediately after start the server
you can use:

```sh
$ npm start
```

## Testing

To run the tests use:

```sh
$ npm test
```

For checking coverage:

```sh
$ npm run coverage
```

After you can create a coverage report in html format:

```sh
$ npm run coverage:report
```

For checking linting errors:

```sh
$ npm run lint
```

You can automatically fix them with:

```sh
$ npm run format
```
