import { sequence } from 'cerebral'
import { state, props } from 'cerebral/tags'
import { set, equals, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'

import { prepareSettingsForm } from './modules/settings/sequences'
import { fetchUsers } from './modules/admin/sequences'
import * as actions from './actions'
import * as factories from './factories'

const routeTo = sequence('Route to', [
  set(state`currentPage`, props`page`),
  when(state`initialFlash`),
  {
    true: [
      factories.showFlash(state`flash`, state`flashType`),
      set(state`initialFlash`, false),
    ],
    false: [],
  },
  equals(state`currentPage`),
  {
    private: [
      set(state`lastVisited`, 'private'),
      actions.authenticate,
      set(state`headerText`, 'Hello {nickname}!'),
      set(state`headerIcon`, null),
    ],
    login: [
      set(state`headerText`, 'Log in your account'),
      set(state`headerIcon`, 'user'),
    ],
    register: [
      set(state`headerText`, 'Create account'),
      set(state`headerIcon`, 'user'),
    ],
    settings: [
      set(state`lastVisited`, 'settings'),
      actions.authenticate,
      when(state`user.email`, email => email !== 'admin@example.com'),
      {
        true: [
          set(state`headerText`, "{nickname}'s settings"),
          set(state`headerIcon`, 'user'),
          when(props`tab`),
          {
            true: set(state`settings.currentTab`, props`tab`),
            false: [],
          },
          prepareSettingsForm,
        ],
        false: [
          when(props`page`, page => page !== 'home'),
          {
            true: redirectToSignal('pageRouted', { page: 'home' }),
            false: [],
          },
          factories.showFlash('Admin cannot edit his settings', 'warning'),
        ],
      },
    ],
    admin: [
      set(state`lastVisited`, 'admin'),
      actions.authenticateAdmin,
      set(state`headerText`, 'User Admin'),
      set(state`headerIcon`, 'users'),
      fetchUsers,
    ],
    newpassword: [
      when(
        state`user.api.@id`,
        state`user.authenticated`,
        (uid, authenticated) => uid && !authenticated
      ),
      {
        true: [
          set(state`headerText`, 'New Password'),
          set(state`headerIcon`, 'user'),
        ],
        false: [
          when(props`page`, page => page !== 'home'),
          {
            true: redirectToSignal('pageRouted', { page: 'home' }),
            false: [],
          },
          factories.showFlash(
            'To reset your password use the reset link',
            'info'
          ),
        ],
      },
    ],
    reset: [
      set(state`headerText`, 'Reset your Password'),
      set(state`headerIcon`, 'user'),
    ],
    otherwise: [
      set(state`lastVisited`, props`page`),
      set(state`headerText`, 'Auth Boilerplate'),
      set(state`headerIcon`, null),
    ],
  },
])

export default routeTo
