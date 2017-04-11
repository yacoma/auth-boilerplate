import {sequence} from 'cerebral'
import {set, equals, when} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import showFlash from './showFlash'
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
        when(state`user.isLoggedIn`), {
          true: [],
          false: [
            set(state`app.currentPage`, 'login'),
            showFlash('You must log in to view this page', 'info')
          ]
        }
      ],
      settings: [
        set(state`app.lastVisited`, 'settings'),
        when(state`user.isLoggedIn`), {
          true: [
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
          ],
          false: [
            set(state`app.currentPage`, 'login'),
            showFlash('You must log in to view this page', 'info')
          ]
        }
      ],
      admin: [
        set(state`app.lastVisited`, 'admin'),
        when(state`user.isAdmin`), {
          true: fetchUsers,
          false: [
            set(state`app.currentPage`, 'login'),
            showFlash(
              'You need Admin permissions to view this page',
              'info'
            )
          ]
        }
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
