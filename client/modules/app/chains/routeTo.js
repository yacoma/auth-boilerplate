import {set, equals, when, state, input} from 'cerebral/operators'

export default [
  set(state`app.currentPage`, input`page`),
  equals(input`page`), {
    login: [
      set(state`user.signIn.validationError`, null)
    ],
    register: [],
    private: [
      set(state`app.lastVisited`, 'private'),
      when(state`user.isLoggedIn`), {
        true: [],
        false: [
          set(state`app.currentPage`, 'login'),
          set(state`user.signIn.validationError`,
            'You must log in to view this page')
        ]
      }
    ],
    otherwise: [
      set(state`app.lastVisited`, input`page`)
    ]
  }
]
