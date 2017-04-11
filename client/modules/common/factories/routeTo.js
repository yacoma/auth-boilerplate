import {sequence} from 'cerebral'
import {set, equals, when} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import showFlash from './showFlash'
import authenticate from './authenticate'
import authenticateAdmin from './authenticateAdmin'
import prepareSettingsForm from '../../settings/actions/prepareSettingsForm'
import fetchUsers from '../../admin/actions/fetchUsers'

function routeTo (page, tab) {
  return sequence('Route to', [
    set(state`app.currentPage`, page),
    when(state`app.initialFlash`), {
      true: [
        showFlash(state`app.flash`, state`app.flashType`),
        set(state`app.initialFlash`, false)
      ],
      false: []
    },
    equals(state`app.currentPage`), {
      login: [],
      register: [],
      private: [
        set(state`app.lastVisited`, 'private'),
        authenticate()
      ],
      settings: [
        set(state`app.lastVisited`, 'settings'),
        authenticate([
          when(state`user.email`, email => email !== 'admin@example.com'), {
            true: [
              when(tab), {
                true: set(state`settings.currentTab`, tab),
                false: []
              },
              prepareSettingsForm
            ],
            false: [
              set(state`app.currentPage`, 'login'),
              showFlash('Admin cannot edit his settings', 'warning')
            ]
          }
        ])
      ],
      admin: [
        set(state`app.lastVisited`, 'admin'),
        authenticateAdmin(fetchUsers)
      ],
      newpassword: [
        when(state`user.api.@id`), {
          true: [],
          false: [
            set(state`app.currentPage`, 'login'),
            showFlash('You must log in to change your password', 'info')
          ]
        }
      ],
      otherwise: [
        set(state`app.lastVisited`, page)
      ]
    }
  ])
}

export default routeTo
