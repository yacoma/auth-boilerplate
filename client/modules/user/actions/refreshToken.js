import {state} from 'cerebral/tags'
import {unset} from 'cerebral/operators'
import {httpGet} from 'cerebral-provider-http/operators'
import {removeStorage} from 'cerebral-provider-storage/operators'
import initUser from './initUser'
import showValidationError from '../../common/factories/showValidationError'

export default [
  httpGet('/refresh'), {
    success: initUser,
    error: [
      removeStorage('jwtHeader'),
      showValidationError('Could not refresh your token!')
    ]
  },
  unset(state`user.token.shouldRefresh`)
]
