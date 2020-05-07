# Overview

- Programming language: [Javascript(ES6)](http://www.ecma-international.org/ecma-262/6.0)
- State and side effects management: [Cerebral 4](http://cerebraljs.com)
- View layer: [React](https://facebook.github.io/react)
- UI framework: [Semantic UI React](http://react.semantic-ui.com)
- Authentication: [JSON Web Token (JWT)](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token)

# Cerebral

Cerebral allows to organize the workflow of even complex apps in a declarative
way which is easy to reason about.
It uses a single state tree and the view components are subscribing to branches
of this tree.
State changes happens only in signals which contain a [function-tree](https://cerebraljs.com/docs/addons/index.html),
a sequence of functions which change the state or run side effects.

# React

React like Views are the best choice for Cerebral.
Choosing React over Inferno because Inferno is not compatible with
Semantic UI.

# Semantic UI React

Semantic UI is a great and beautiful UI framework which allows
to fast and easy create a boilerplate which looks beautiful out
of the box. But it's also extremely customizable.

Semantic UI React gives a seamless integration with the React framework
and uses the same human friendly component and prop names.

I'm just using the default theme and the only CSS I added is the body
background and the form background. IMHO it looks really great.
