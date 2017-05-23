Example deployment for auth-boilerplate
=======================================

Requirements for the server:

- nginx
- supervisor
- make

On Debian/Ubuntu you can install them as superuser with:

```console
$ apt-get install nginx supervisor make
```

We use a `post-receive` git hook to puplish the repository on the live
server. He triggers on every push to the git repo on the server.

The `post-receive` hook uses the path defined in the `livepath`
variable. Make sure that this path exists on the server before pushing
the first time.

The hook triggers `make deploylive` which is defined in `Makefile`. This
copy the production settings to `settings.json`, install the
dependencies and build the App.

In addition on every push to Github master branch Travis CI triggers a
push to the live server. So the live site is in sync with the Github
master branch.

The `deploy/conf` directory contains examples for git hook and server
configuration with gunicord behind a nginx reverse proxy. For monitoring
and controlling gunicord we use supervisor.

- **git/hooks/post-receive** - put this in the `hooks` directory of
  your bare git repository on the server.
- **web/nginx.conf** - the nginx configuration.
- **web/supervisord.conf** - the supervisor configuration for
  gunicorn.
