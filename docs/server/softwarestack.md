Overview
========

- Programming language: [Python 3](https://www.python.org)
- Web framework: [Morepath](http://morepath.readthedocs.io)
- Authentication: [JSON Web Token (JWT)](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token)
- Object-Relational Mapper: [PonyORM](https://ponyorm.com)
- Validation/Normalization: [Cerberus](http://python-cerberus.org)
- Signal emitter: [Pymitter](https://github.com/riga/pymitter)
- Token creation: [It's dangerous](https://pythonhosted.org/itsdangerous)
- SMTP client: [yagmail](https://github.com/kootenpv/yagmail)
- Email validation: [email_validator](https://github.com/JoshData/python-email-validator)
- Password Hashing: [Argon2](https://argon2-cffi.readthedocs.io)
- WSGI HTTP Server: [gunicorn](http://gunicorn.org)


Morepath
========

Morepath is a web framework build the idea of creating REST APIs in mind.
It has some really great features which help to create an awesome and secure
API.

- It's model-driven which means the routing points to models instead of views
  and the views are also bind to models. This makes it an easy fit for REST.
- The model based design allows also for automatic hyperlink creation which
  doesn't break.
- It's easy to setup an identity depending on an identity_policy.
- It has a powerful permission system which is based on models and allows
  fine-grained settings for per view permissions.
- Morepath is highly extensible by subclassing your App from an extension App
  which has features you want to add to your App. These can be public Morepath
  extensions or just some custom features you want to add to several Apps.
  You can also create a default App and change settings/features by subclassing
  depending on the runtime environment like `production` or `testing`.
- Morepath is build on top of the [Reg](http://reg.readthedocs.io) dispatcher,
  which gives us some great low level features like creating services.


JSON Web Token (JWT)
====================

A token based authentication system using JSON Web Token (JWT).

For implementing JWT in Morepath we use the
[more.jwtauth](https://github.com/morepath/more.jwtauth) extension.
It provides a JWT based identity_policy and some extra features like
token refreshing.


PonyORM
=======

Easy to use and powerful database query syntax which integrates greatfully with
Python.

With [more.pony](https://github.com/morepath/more.pony) we have an awesome
Morepath integration which binds the database session to the request so you can
interact with the database in your App directly without using db_session.


Cerberus
========

Cerberus provides powerful yet simple and lightweight data validation
functionality out of the box and is designed to be easily extensible,
allowing for custom validation. It has also normalization capabilities.

It easily fits with Morepath through the
[more.cerberus](https://github.com/morepath/more.cerberus) extension.

The Cerberus schema is defined in
[server/schema.yml](https://github.com/yacoma/auth-boilerplate/blob/master/server/schema.yml).


pymitter
========

pymitter is a Python port of the extended Node.js EventEmitter 2 approach
providing namespaces, wildcards and TTL.

It allows us to emmit signals on database events.

It integrates with the lightweight
[more.emit](https://github.com/morepath/more.emit) wrapper extension.


Yagmail
=======

The [Yagmail SMTP client](https://github.com/kootenpv/yagmail) is used by the
[MailerService](services.md#MailerService) for sending emails.
It's quite simple and lightweight but has some cool features like storing
passwords in the keyring and has also a great Gmail integration. The newest
version supports also oauth2 authentication. It's quite usable though it's not
yet really mature.


It's dangerous
==============

[Itsdangerous](https://pythonhosted.org/itsdangerous) is used by the
[TokenService](services.md#TokenService).
It uses URLSafeTimedSerializer to sign links which are sent by email to the
user and which should expire after a certain time.


email_validator
===============

[email_validator](https://github.com/JoshData/python-email-validator) is a
robust email address syntax and deliverability validation library.

[EmailValidationService](services.md#EmailValidationService) uses it to
normalize and verify email addresses. During verification it checks also
if the email domain is a resolvable domain name.
