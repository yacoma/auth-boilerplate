import { sequence } from 'cerebral'
import { when } from 'cerebral/operators'
import { props } from 'cerebral/tags'
import redirect from '../factories/redirect'
import showFlash from '../factories/showFlash'

export default sequence('Redirect to login', [
  redirect('login'),
  when(props`error.message`),
  {
    true: showFlash(props`error.message`, 'info'),
    false: [],
  },
])
