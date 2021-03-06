# Example deployment for auth-boilerplate

## Requirements for the server

- [nginx](https://nginx.org/en/)
- [supervisor](http://supervisord.org/)
- [make](https://www.gnu.org/software/make/)

## Overview

On Debian/Ubuntu you can install them as superuser with:

```sh
$ apt-get install nginx supervisor make
```

We use a `post-receive` git hook to publish the repository on the live
server. He triggers on every push to the git repo on the server.

The `post-receive` hook uses the path defined in the `livepath`
variable. Make sure that this path exists on the server before pushing
the first time.

The hook triggers `make deploylive` which is defined in `Makefile`. This
install the dependencies and build the App.

In addition on every push to GitHub master branch Travis CI triggers a
push to the live server. So the live site is in sync with the GitHub
master branch.

## Configuration

The `deploy/conf` directory contains examples for git hook and server
configuration with gunicord behind a nginx reverse proxy. For monitoring
and controlling gunicord we use supervisor.

- **git/hooks/post-receive** - put this in the `hooks` directory of
  your bare git repository on the server and make sure it is executable.
- **web/nginx.conf** - the nginx configuration.
- **web/supervisord.conf** - the supervisor configuration for
  gunicorn.
- **web/gunicorn.conf.py** - gunicorn configuration which id used
  directly from here.

## Database

PonyORM supports SQLite, PostgreSQL, MySQL/MariaDB and Oracle.
In auth-boilerplate we use Postgres in production and SQLite
for development and testing.

When you want to use another database then SQLite you have to
first create a database for auth-boilerplate on the server.

Then configure `server/settings/production.yml` according
to the database setup.
