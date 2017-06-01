import { sequence } from 'cerebral'
import { state } from 'cerebral/tags'
import { set, unset, when } from 'cerebral/operators'
import { httpGet } from '@cerebral/http/operators'
import { removeStorage } from '@cerebral/storage/operators'
import initUser from './initUser'
import redirect from '../../common/factories/redirect'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Refresh token', [
  httpGet('/refresh'),
  {
    success: [
      set(state`app.flash`, null),
      set(state`app.flashType`, null),
      initUser,
      when(state`app.currentPage`, currentPage => currentPage === 'login'),
      {
        true: [
          when(state`app.lastVisited`),
          {
            true: redirect(state`app.lastVisited`),
            false: redirect('home'),
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
