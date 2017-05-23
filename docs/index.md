Boilerplate for an Authentication workflow
==========================================

Auth-Boilerplate can be used as a starting point for a client-server
application which needs authentication.

It provides a server based on the Morepath Python web framework
and a client based on Cerebral Javascript framework which uses
the React library as a view layer.

Goals
-----

Our design decisions are based on the following goals we want to archieve:

  - **secure:**
    Making it as secure as possible as we're creating an authentication
    and authorisation system.
  - **data under our control:**
    Controlling all data on our own servers and not outsourcing
    data or user management to other companies.
  - **user friendly:**
    Creating a friendly user experience with relaxed user-service interaction.
  - **developer friendly:**
    Providing a great developer experience by creating an API and using
    tools which are easy to understand and reason about.

Authentication
--------------

Auth-Boilerplate uses JSON Web Token Authentication.
