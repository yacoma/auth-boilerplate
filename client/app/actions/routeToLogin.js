import { sequence } from 'cerebral'
import { props } from 'cerebral/tags'
import { when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import showFlash from '../factories/showFlash'

export default sequence('Redirect to login', [
  redirectToSignal('pageRouted', { page: 'login' }),
  when(props`error.message`),
  {
    true: showFlash(props`error.message`, 'info'),
    false: [],
  },
])
