Introduction
============

Services are used for triggering side effects which you want to move out of the
view.

A custom service can be created like this:

```python
@App.method(App.service, name='myCustomService')
def my_custom_service(app, name):
    setting1 = getattr(app.settings.custom_service, 'setting1', None)
    setting2 = getattr(app.settings.custom_service, 'setting2', None)

    return MyCustomService(setting1=setting1, setting2=setting2)
```
A function is decorated with the `@App.method` decorator and gets `App.service`
and a name to identify your service.
The function receives an app instance and the service name. So you have access
to app attributes like settings. The function should return the service class.

For examples take a look at
[server/services.py](https://github.com/yacoma/auth-boilerplate/blob/master/server/services.py).

The service can be initiated for example in the view or by a signal from an
app instance like this:
```python
    my_custom_service = app.service(name='myCustomService')
```
and also from the request:
```python
    my_custom_service = request.app.service(name='myCustomService')
```


MailerService
=============

The MailerService integrates the simple
[Yagmail SMTP client](https://github.com/kootenpv/yagmail) for sending emails.
For signing links which are sent to the user the TokenService is used.

API
---

### Parameters

- **username:** SMPT username (string from settings)
- **password:** SMTP password (string from settings)
- **host:** SMPT server host (string from settings)
- **port:** SMPT server port (string from settings)
- **starttls:** True, if starttls should be used (boolean from settings)
- **smtp_skip_login:** True, if login should be skipped (boolean from settings)
- **token_service:** a reference to a token service instance

### Class method `send_confirmation_email`

Sending an email confirming the users email address.

#### Parameters

- **user:** user entity
- **request:** current request object

### Class method `send_reset_email`

Sending an email allowing the user to reset his password.

#### Parameters

- **user:** user entity
- **request:** current request object


TokenService
============

The TokenService uses [itsdangerous](https://pythonhosted.org/itsdangerous)
URLSafeTimedSerializer to sign links which are time limited.

API
---

### Parameters

- **secret:** The secret string used for creating the token
  (string from settings).
- **max_age:** Maximal time the token should be valid in seconds
  (integer from settings). By default without limit.

### Class method `create`

Creates a token.

#### Parameters

- **obj:** The object to serialize. For `MailerService` we use the user's
  email address.
- **salt:** The salt used for serialization.

#### Return value

- Returns the token.

### Class method `validate`

Validates a token.

#### Parameters

- **token:** The token to validate.
- **salt:** The salt used for validation.

#### Return values

- Returns `True` if the token is valid.
- Returns `False` if the token is invalid.


EmailValidationService
======================

EmailValidationService uses
[email_validator](https://github.com/JoshData/python-email-validator)
to normalize and verify email addresses.
During verification it checks also if the email domain is available.

API
---

### Class method `normalize`

Normalizes the email address by converting domain to lower case and replacing
'googlemail.com' domain with 'gmail.com' domain.

#### Parameters

- **email:** email address to normalize

#### Return values

- Returns the normalized email address.
- Returns original email address if the syntax is not correct.

### Class method `verify`

Normalizes the email address like `normalize` and verifies if the email domain
is available.

#### Parameters
- **email:** email address to verify

#### Return values

- Returns the normalized email address.
- Raises `EmailSyntaxError` if a syntax error occurs.
- Raises `EmailUndeliverableError` if the domain is unavailable.
