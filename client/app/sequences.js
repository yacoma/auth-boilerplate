import { state, props, resolveObject } from 'cerebral/tags'
import { set, unset, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { httpGet } from '@cerebral/http/operators'
import { removeStorage } from '@cerebral/storage/operators'

import routeTo from './routeTo'
import * as actions from './actions'
import * as factories from './factories'

export const refreshToken = [
  httpGet('/refresh'),
  {
    success: [
      set(state`flash`, null),
      set(state`flashType`, null),
      actions.initUser,
      when(state`currentPage`, currentPage => currentPage === 'login'),
      {
        true: [
          when(state`lastVisited`),
          {
            true: redirectToSignal(
              'pageRouted',
              resolveObject({
                page: state`lastVisited`,
              })
            ),
            false: redirectToSignal('pageRouted', { page: 'home' }),
          },
        ],
        false: [],
      },
    ],
    error: [
      removeStorage('jwtHeader'),
      factories.showValidationError('Could not refresh your token!'),
    ],
  },
  unset(state`user.token.shouldRefresh`),
]

export const initialize = [
  actions.initApp,
  when(state`user.token.shouldRefresh`),
  {
    true: refreshToken,
    false: [],
  },
]

export const routeToPage = routeTo(props`page`)

export const routeToSettings = routeTo('settings', props`tab`)

export const redirectToLogin = [
  redirectToSignal('pageRouted', { page: 'login' }),
  when(props`error.message`),
  {
    true: factories.showFlash(props`error.message`, 'info'),
    false: [],
  },
]