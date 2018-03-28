# Models

Paths and Views in Morepath are bound to a Model.
So we will use the Model names as chapters in the API documentation.
Each model is bound to a Path and has related View method(s).

The permissions are defined in [server/permissions.py](https://github.com/yacoma/auth-boilerplate/blob/master/server/permissions.py).

Details about the Cerberus schemas used by the views can be found in [server/schema.yml](https://github.com/yacoma/auth-boilerplate/blob/master/server/schema.yml).

## Root

**Path:** '/'

### GET method

Returns a dictionary of available collections and there entry points.

**Permission:** `None`

**Example request:**

```js
http.get('/')
```

#### Responses

##### 200 - OK

**Example response JSON:**

```json
{
  "collections": {
    "users": {
      "@id": "/users"
    },
    "groups": {
      "@id": "/groups"
    }
  }
}
```

## UserCollection

**Path:** '/users'

### GET method

Returns a list of user entities and if pagination is enabled
the number of total pages.
The query can be searched, sorted and paginated. The search
applies on nickname and email.

**Permission**: `ViewPermission`

**Example request:**

```js
http.get(
  '/users',
  {
    search: 'Marie', // caseinsensitive, uses nickname and email fields
    sortby: 'nickname',
    sortdir: 'desc', // default: 'asc'
    page: 4, // 0 disables pagination
    pagesize: 5
  },
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

**Example response JSON:**

```json
{
  "users": [
    {
      "@id": "/users/1",
      "nickname": "Leader",
      "email": "leader@example.com",
      "emailConfirmed": true,
      "isAdmin": true,
      "lastLogin": "2017-04-30 15:42:57",
      "registered": "2017-04-20 23:04:27",
      "registerIP": "127.0.0.1"
    },
    {
      "@id": "/users/2",
      "nickname": "Marie",
      "email": "marie@example.com",
      "emailConfirmed": false,
      "isAdmin": false,
      "lastLogin": "2017-04-30 14:38:25",
      "registered": "2017-04-27 20:05:57",
      "registerIP": "127.0.0.1"
    }
  ],
  "pages": 5
}
```

### POST method

Add a new user. Use on registration.
A confirm email is sent to the email address.

**Permission**: `None`

**Validation schema:** `user`

**Example request:**

```js
http.post('/users', {
  nickname: 'Marie',
  email: 'marie@example.com',
  password: 'Secret0'
})
```

#### Responses

##### 201 - Created

User created successfully.

**Response JSON:** empty

**Signal emitted:** `user.email_updated`

##### 409 - Conflict

Email address already exists.

**Response JSON:**

```json
{
  "validationError": "Email already exists"
}
```

##### 422 - Unprocessable Entity

Validation error either from **EmailValidationService**
or from **Cerberus** schema validation.

**Response JSON from EmailValidationService** when email address is not valid:

```json
{
  "email": ["Not valid email"]
}
```

**Response JSON from EmailValidationService** when email domain cannot be found:

```json
{
  "email": ["Email could not be delivered"]
}
```

**Example response JSON from Cerberus** when schema is not valid:

```json
{
  "nickname": ["must be of string type"]
}
```

## User

**Path:** '/users/{id}'

### GET method

Returns the user entity with the requested id.

**Permission**: `ViewPermission`

**Example request:**

```js
http.get(
  '/users/1',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

**Example response JSON:**

```json
{
  "@id": "/users/1",
  "nickname": "Leader",
  "email": "leader@example.com",
  "emailConfirmed": true,
  "isAdmin": true,
  "lastLogin": "2017-04-30 15:42:57",
  "registered": "2017-04-20 23:04:27",
  "registerIP": "127.0.0.1"
}
```

### PUT method

Update a user entity with the fields which are provided.
Other fields stay untouched.

If the email field is updated, the `email_confirmed` field is set
to `False` and a confirm email is sent to the new email address.

**Permission**: `EditPermission`

**Validation schema:** `user`

**Example request:**

```js
http.put(
  '/users/1',
  {
    nickname: 'Marie',
    email: 'marie@example.com'
  },
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

User updated successfully.

**Response JSON:** empty

**Signal emitted** when email was updated: `user.email_updated`

##### 409 - Conflict

Email address already exists.

**Response JSON:**

```json
{
  "validationError": "Email already exists"
}
```

##### 422 - Unprocessable Entity

Validation error either from **EmailValidationService**
or from **Cerberus** schema validation.

**Response JSON from EmailValidationService** when email address is not valid:

```json
{
  "email": ["Not valid email"]
}
```

**Response JSON from EmailValidationService** when email domain cannot be found:

```json
{
  "email": ["Email could not be delivered"]
}
```

**Example response JSON from Cerberus** when schema is not valid:

```json
{
  "nickname": ["must be of string type"]
}
```

### DELETE method

Delete a user entity.

**Permission**: `EditPermission`

**Example request:**

```js
http.delete(
  '/users/1',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

User deleted successfully.

**Response JSON**: empty

## Login

**Path:** '/login'

### POST method

Log in the user and return a JWT token in the `Authorization` header.

**Permission**: `None`

**Validation schema:** `login`

**Example request:**

```js
http.post('/login', {
  email: 'test@example',
  password: 'secret'
})
```

#### Responses

##### 200 - OK

User successfully logged in.

**Response JSON:** empty

**Response Headers:** `'Authorization': jwt_token`

##### 403 - Forbidden

Invalid credentials.

**Response JSON:**

```json
{
  "validationError": "Invalid email or password"
}
```

##### 422 - Unprocessable Entity

Validation error from **Cerberus** schema validation.

**Example response JSON** when schema is not valid:

```json
{
  "password": ["min length is 5"]
}
```

## Refresh

**Path:** '/refresh'

### GET method

Receives an expired or nearly expired JWT token in the request
`Authorization` header and returns a refreshed JWT token in
the response `Authorization` header.

**Permission**: `None`

**Example request:**

```js
http.get(
  '/refresh',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

Token successfully refreshed.

**Response JSON:** empty

**Response Headers:** `'Authorization': jwt_token`

##### 403 - Forbidden

The JWT token could not be refreshed.

**Response JSON** when `refresh_until` or token has expired:

```json
{
  "validationError": "Your session has expired"
}
```

**Response JSON** when token could not be refreshed:

```json
{
  "validationError": "Could not refresh your token"
}
```

## ResetNonce

**Path:** 'users/{id}/signout'

### GET method

Reset the refresh nonce of the user with the given `id`.

**Permission**: `None`

**Example request:**

```js
http.get(
  '/users/1/signout',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

The refresh nonce successfully reset so all current
JWT tokens of this user cannot be refreshed anymore.

**Response JSON:** empty

## ConfirmEmail

**Path:** 'users/{id}/confirm/{token}'

### GET method

Confirm the email address of the user with the given `id`.
The link is sent from the `user.email_updated` signal to the
users email address which should be confirmed.
It contains a token which is generated from `TokenService` and
contains a time-limit which can be adjusted in the `token.max_age` setting.

**Permission**: `EditPermission`

**Example request:**

```js
http.get(
  '/users/4/confirm/Im5ld3VzZXJAZXhhbXBsZS5jb20i.C3dnsw.2meomRPK3wnYwB2AERt2ygjFaRE'
)
```

#### Responses

##### 302 - Found

After processing the request it redirects to the homepage.
Examples here are in Python language.

**Example redirect URL** when email address is successfully confirmed:

```python
from base64 import urlsafe_b64encode


flash = urlsafe_b64encode(
    'Thank you for confirming your email address'.encode('utf-8')
).replace(b'=', b'').decode('utf-8')

url = "http://yourawesomesite.com/?flashtype=success&flash=" + flash
```

**Example redirect URL** when email address was already confirmed before:

```python
flash = urlsafe_b64encode(
    'Your email is already confirmed. Please log in.'.encode('utf-8')
).replace(b'=', b'').decode('utf-8')

url = "http://yourawesomesite.com/?flashtype=info&flash=" + flash
```

**Example redirect URL** when email address could not be confirmed:

```python
flash = urlsafe_b64encode(
    'The confirmation link is invalid or has been expired'.encode('utf-8')
).replace(b'=', b'').decode('utf-8')

url = "http://yourawesomesite.com/?flashtype=error&flash=" + flash
```

## SendResetEmail

**Path:** '/reset'

### POST method

Send a password reset email to given `email` address.

**Permission**: `None`

**Validation schema:** `send_reset_email_validator`

**Example request:**

```js
http.post('/reset', {
  email: 'marie@example.com'
})
```

#### Responses

##### 200 - OK

Password reset email successfully sent.

**Response JSON:** empty

##### 403 - Forbidden

Email not in database or email address not yet confirmed.

**Response JSON** when email not in database:

```json
{
  "validationError": "Email not found"
}
```

**Response JSON** when email address not yet confirmed:

```json
{
  "validationError":
    "Your email must be confirmed before resetting the password."
}
```

##### 422 - Unprocessable Entity

Validation error from **Cerberus** schema validation.

**Example response JSON** when schema is not valid:

```json
{
  "email": ["must be of string type"]
}
```

## ResetPassword

**Path:** 'users/{id}/reset/{token}'

### GET method

Allows the user with given `id` to reset his password.
The link is sent from the `MailerService` to the
users email address if it was confirmed before.
It contains a token which is generated from `TokenService` and
contains a time-limit which can be adjusted in the `token.max_age` setting.

**Permission**: `None`

**Example request:**

```js
http.get(
  '/users/7/reset/Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI'
)
```

#### Responses

##### 302 - Found

After processing the request it redirects on success to '/newpassword'
and on error to '/login'.
Examples here are in Python language.

**Example redirect URL** when reset password request was excepted:

```python
url = "http://yourawesomesite.com/newpassword?%40id=%2Fusers%2F7%2Freset%2F" +
      "Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI"
```

**Example redirect URL** when reset link is invalid:

```python
flash = urlsafe_b64encode(
    'The password reset link is invalid or has been expired'.encode('utf-8')
).replace(b'=', b'').decode('utf-8')

url = "http://yourawesomesite.com/login?flashtype=error&flash=" + flash
```

### PUT method

Reset the password of the user with given `id` to the provided password.

**Permission**: `None`

**Validation schema:** `reset_password`

**Example request:**

```js
http.put(
  '/users/7/reset/Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI',
  {
    password: 'NewSecret'
  }
)
```

#### Responses

##### 200 - OK

Password resetted successfully.

**Response JSON:** empty

##### 403 - Forbidden

Email not in database or email address not yet confirmed.

**Response JSON** when reset token is invalid:

```json
{
  "validationError": "The password reset link is invalid or has been expired"
}
```

**Response JSON** when email address not yet confirmed:

```json
{
  "validationError":
    "Your email must be confirmed before resetting the password."
}
```

##### 422 - Unprocessable Entity

Validation error from **Cerberus** schema validation.

**Example response JSON** when schema is not valid:

```json
{
  "password": ["min length is 5"]
}
```

## GroupCollection

**Path:** '/groups'

### GET method

Returns a list of group entities.

**Permission**: `ViewPermission`

**Example request:**

```js
http.get(
  '/groups',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

**Example response JSON:**

```json
{
  "groups": [
    {
      "@id": "/groups/1",
      "name": "Admin",
      "users": ["leader@example.com"]
    },
    {
      "@id": "/groups/2",
      "name": "Moderator",
      "users": ["marie@example.com"]
    }
  ]
}
```

### POST method

Add a new group.

**Permission**: `EditPermission`

**Validation schema:** `group`

**Example request:**

```js
http.post('/groups', {
  name: 'Editor'
})
```

#### Responses

##### 201 - Created

Group created successfully.

**Response JSON:**

```json
{
  "@id": "/groups/4"
}
```

##### 409 - Conflict

Group name already exists.

**Response JSON:**

```json
{
  "validationError": "Group already exists"
}
```

##### 422 - Unprocessable Entity

Validation error from **Cerberus** schema validation.

**Example response JSON from Cerberus** when schema is not valid:

```json
{
  "name": ["must be of string type"]
}
```

## Group

**Path:** '/groups/{id}'

### GET method

Returns the group entity with the requested id.

**Permission**: `ViewPermission`

**Example request:**

```js
http.get(
  '/groups/1',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

**Example response JSON:**

```json
{
  "@id": "/groups/1",
  "name": "Admin",
  "users": ["leader@example.com"]
}
```

### PUT method

Update a group entity with the fields which are provided.
Other fields stay untouched.

**Permission**: `EditPermission`

**Validation schema:** `group`

**Example request:**

```js
http.put(
  '/groups/1',
  {
    name: 'Editor'
  },
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

Group updated successfully.

**Response JSON:** empty

##### 409 - Conflict

Group already exists.

**Response JSON:**

```json
{
  "validationError": "Group already exists"
}
```

##### 422 - Unprocessable Entity

Validation error from **Cerberus** schema validation.

**Example response JSON from Cerberus** when schema is not valid:

```json
{
  "name": ["must be of string type"]
}
```

### DELETE method

Delete a group entity.

**Permission**: `EditPermission`

**Example request:**

```js
http.delete(
  '/groups/1',
  {},
  {
    headers: { Authorization: jwt_token }
  }
)
```

#### Responses

##### 200 - OK

Group deleted successfully.

**Response JSON**: empty
