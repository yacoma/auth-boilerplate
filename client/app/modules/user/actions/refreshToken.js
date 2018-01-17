import { sequence } from 'cerebral'
import { state, resolveObject } from 'cerebral/tags'
import { set, unset, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { httpGet } from '@cerebral/http/operators'
import { removeStorage } from '@cerebral/storage/operators'
import initUser from './initUser'
import showValidationError from '../../../factories/showValidationError'

export default sequence('Refresh token', [
  httpGet('/refresh'),
  {
    success: [
      set(state`flash`, null),
      set(state`flashType`, null),
      initUser,
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
      showValidationError('Could not refresh your token!'),
    ],
  },
  unset(state`user.token.shouldRefresh`),
])
