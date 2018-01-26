import { state, props } from 'cerebral/tags'
import { when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'

import { refreshToken } from './modules/user/sequences'
import routeTo from './routeTo'
import * as actions from './actions'
import * as factories from './factories'

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
