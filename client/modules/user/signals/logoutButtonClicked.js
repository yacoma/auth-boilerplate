import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import removeUser from '../actions/removeUser'
import redirect from '../../common/factories/redirect'
import showFlash from '../../common/factories/showFlash'

export default sequence('Log user out', [
  set(state`user.loginForm.isLoading`, false),
  removeUser,
  redirect('home'),
  showFlash('Good bye!', 'info'),
])
