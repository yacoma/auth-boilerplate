import {sequence} from 'cerebral'
import {when} from 'cerebral/operators'
import {props} from 'cerebral/tags'
import routeTo from '../factories/routeTo'
import showFlash from '../factories/showFlash'

export default sequence('Redirect to login', [
  routeTo('login'),
  when(props`error.message`), {
    true: showFlash(props`error.message`, 'info'),
    false: []
  }
])
