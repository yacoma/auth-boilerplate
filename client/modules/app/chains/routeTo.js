import {set, equals, when} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import removeFlash from './removeFlash'

export default [
  set(state`app.currentPage`, props`page`),
  when(state`app.showFlash`), {
    true: [
      set(state`app.showFlash`, false)
    ],
    false: [
      ...removeFlash
    ]
  },
  equals(props`page`), {
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
      set(state`app.lastVisited`, props`page`)
    ]
  }
]
