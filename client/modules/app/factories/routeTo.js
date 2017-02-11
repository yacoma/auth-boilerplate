import {set, equals, when} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import showFlash from '../factories/showFlash'

function routeTo (page) {
  return [
    set(state`app.currentPage`, page),
    when(state`app.initialFlash`), {
      true: [
        ...showFlash(state`app.flash`, state`app.flashType`),
        set(state`app.initialFlash`, false)
      ],
      false: []
    },
    equals(state`app.currentPage`), {
      login: [],
      register: [],
      private: [
        set(state`app.lastVisited`, 'private'),
        when(state`user.isLoggedIn`), {
          true: [],
          false: [
            set(state`app.currentPage`, 'login'),
            ...showFlash('You must log in to view this page', 'info')
          ]
        }
      ],
      newpassword: [
        when(state`user.api.@id`), {
          true: [],
          false: [
            set(state`app.currentPage`, 'login'),
            ...showFlash('You must log in to change your password', 'info')
          ]

        }
      ],
      otherwise: [
        set(state`app.lastVisited`, page)
      ]
    }
  ]
}

export default routeTo
