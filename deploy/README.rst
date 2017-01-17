Example deployment for auth-boilerplate
=======================================

We use a ``post-receive`` git hook to puplish the repository live on the server.
He triggers on every push to the git repo on the server.

In addition on every push to GitHub master branch Travis CI triggers a push to
the live server at auth.yacoma.it.

The ``post-receive`` hook uses the path defined in the ``livepath`` variable.
Make sure that this path exists on the server before pushing.

The hook triggers a ``make deploylive`` which is defined in ``Makefile``.
This copy the production settings to ``settings.json``, install the dependencies and
build the App.

The ``conf/web`` directory contains examples for server configuration with gunicord
and nginx as proxy. For monitoring and controlling gunicord we use supervisor.

- **nginx.conf** - the nginx configuration.
- **gunicorn.conf** - the supervisor configuration for gunicorn.
- **legacy-apache2** - a legacy Apache2 mod-wsgi configuration I used before with nginx proxy.
  For inspiration.
