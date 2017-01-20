Example deployment for auth-boilerplate
=======================================

We use a ``post-receive`` git hook to puplish the repository on the live server.
He triggers on every push to the git repo on the server.

The ``post-receive`` hook uses the path defined in the ``livepath`` variable.
Make sure that this path exists on the server before pushing.

The hook triggers ``make deploylive`` which is defined in ``Makefile``.
This copy the production settings to ``settings.json``, install the dependencies and
build the App.

In addition on every push to GitHub master branch Travis CI triggers a push to
the live server at auth-boilerplate.yacoma.it.

The ``conf/web`` directory contains examples for server configuration with gunicord
behind a nginx reverse proxy. For monitoring and controlling gunicord we use supervisor.

- **nginx.conf** - the nginx configuration.
- **supervisord.conf** - the supervisor configuration for gunicorn.
