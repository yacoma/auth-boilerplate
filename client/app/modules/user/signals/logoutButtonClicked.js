import { sequence } from 'cerebral'
import { state } from 'cerebral/tags'
import { set } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import removeUser from '../actions/removeUser'
import showFlash from '../../../factories/showFlash'

export default sequence('Log user out', [
  set(state`user.loginForm.isLoading`, false),
  removeUser,
  redirectToSignal('pageRouted', { page: 'home' }),
  showFlash('Good bye!', 'info'),
])
