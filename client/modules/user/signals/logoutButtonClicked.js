import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import removeUser from '../actions/removeUser'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'

export default sequence('Log user out', [
  set(state`user.signIn.isLoading`, false),
  removeUser,
  routeTo('home'),
  showFlash('Good bye!', 'info')
])
