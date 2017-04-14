import {sequence} from 'cerebral'
import {set, equals, when} from 'cerebral/operators'
import {state, string} from 'cerebral/tags'
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
      private: [
        set(state`app.lastVisited`, 'private'),
        authenticate([
          set(state`app.headerText`, string`Hello ${state`user.nickname`}!`),
          set(state`app.headerIcon`, null)
        ])
      ],
      login: [
        set(state`app.headerText`, 'Log in your account'),
        set(state`app.headerIcon`, 'user')
      ],
      register: [
        set(state`app.headerText`, 'Create account'),
        set(state`app.headerIcon`, 'user')
      ],
      settings: [
        set(state`app.lastVisited`, 'settings'),
        authenticate([
          when(state`user.email`, email => email !== 'admin@example.com'), {
            true: [
              set(state`app.headerText`, string`${state`user.nickname`}'s settings`),
              set(state`app.headerIcon`, 'user'),
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
        authenticateAdmin([
          set(state`app.headerText`, 'User Admin'),
          set(state`app.headerIcon`, 'users'),
          fetchUsers
        ])
      ],
      newpassword: [
        when(state`user.api.@id`), {
          true: [
            set(state`app.headerText`, 'New Password'),
            set(state`app.headerIcon`, 'user')
          ],
          false: [
            set(state`app.currentPage`, 'login'),
            showFlash('You must log in to change your password', 'info')
          ]
        }
      ],
      reset: [
        set(state`app.headerText`, 'Reset your Password'),
        set(state`app.headerIcon`, 'user')
      ],
      otherwise: [
        set(state`app.lastVisited`, page),
        set(state`app.headerText`, 'Auth Boilerplate'),
        set(state`app.headerIcon`, null)
      ]
    }
  ])
}

export default routeTo
