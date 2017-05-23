import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {unset} from 'cerebral/operators'
import {httpGet} from '@cerebral/http/operators'
import {removeStorage} from '@cerebral/storage/operators'
import initUser from './initUser'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Refresh token', [
  httpGet('/refresh'),
  {
    success: initUser,
    error: [
      removeStorage('jwtHeader'),
      showValidationError('Could not refresh your token!'),
    ],
  },
  unset(state`user.token.shouldRefresh`),
])
