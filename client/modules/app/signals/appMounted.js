import {sequence} from 'cerebral'
import {when} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import initApp from '../actions/initApp'
import refreshToken from '../../user/actions/refreshToken'

export default sequence('Initiate App', [
  initApp,
  when(state`user.token.shouldRefresh`),
  {
    true: refreshToken,
    false: [],
  },
])
