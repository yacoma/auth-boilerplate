# Overview

The settings are declared in YAML files inside the `server/settings` directory.

The default settings which are used during development can be found in
[default.yml](https://github.com/yacoma/auth-boilerplate/blob/master/server/settings/default.yml).
When running tests settings can be overridden in
[test.yml](https://github.com/yacoma/auth-boilerplate/blob/master/server/settings/test.yml).
For production we use
[production.yml](https://github.com/yacoma/auth-boilerplate/blob/master/server/settings/production.yml)
to override settings.

The settings are organized in the following sections:

- **jwtauth:** settings for
  [more.jwtauth](https://github.com/morepath/more.jwtauth/blob/master/README.rst#settings)
  identity_policy
- **database:** setup the database server
- **smtp:** setup the mail client
- **token:** tune token creation by the TokenService

You can also override settings for Morepath extensions with their corresponding
settings section. Like
[more.pony](https://github.com/morepath/more.pony/blob/master/README.rst#settings)
which uses the `pony` section.

# jwtauth

For a detailed description of 'more.jwtauth' settings take a look at the
[docs](https://github.com/morepath/more.jwtauth/blob/master/README.rst#settings).

You should at least change the `master_secret` and it's recommended to set
different ones for default, test and production settings.

Auth-boilerplate uses an `expiration_delta` of 10 minutes and the default
`refresh_delta` of 7 days. This means that the JWT token including user data
gets refreshed after 10 minutes. When a user isn't active for 7 days he will
get logged out. Adjust these settings to your needs.

When `allow_refresh` is set to `false`, refreshing the JWT token is disabled.

When `verify_expiration_on_refresh` is set to `true`, you can refresh the token
only if it's not yet expired.

# database

Setup your database server. For details see the
[PonyORM documentation](https://docs.ponyorm.com/database.html#binding-the-database-object-to-a-specific-database).

This section provides the parameters needed for setting up the database:

- **provider** - one of the following:
  - [sqlite](https://docs.ponyorm.com/api_reference.html#sqlite)
  - [postgres](https://docs.ponyorm.com/api_reference.html#postgresql)
  - [mysql](https://docs.ponyorm.com/api_reference.html#mysql)
  - [oracle](https://docs.ponyorm.com/api_reference.html#oracle)
- other parameters specific for the chosen database provider

When overriding, parameters which are not needed anymore have
to be explicitly unset by setting them to `null`.

Auth-boilerplate uses for development SQLite with a file-based data store,
for testing SQLite with an in-memory database and in production PostgreSQL.

# smtp

The configuration for the Yagmail SMTP client.
For details see the
[Yagmail docs](https://github.com/kootenpv/yagmail/blob/master/README.md).

Available settings:

- **username:** the SMTP username - instead you can store the username in a
  `.yagmail` file in your home folder which contains just the email username
- **password:** the SMTP password - this can alternatively be stored in the
  [keyring](https://github.com/kootenpv/yagmail/blob/master/README.md#username-and-password)
- **host:** SMTP server host
- **port:** SMTP port
- **starttls:** use starttls (boolean)
- **ssl:** use SSL (boolean)
- **skip_login:** skip smtp login (boolean)

# token

Configuration for the TokenService.

Available settings:

- **secret:** the secret for creating the token
- **max_age:** time in seconds after which the token expires
