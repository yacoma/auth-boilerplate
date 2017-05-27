import { sequence } from 'cerebral'
import { state } from 'cerebral/tags'
import { set } from 'cerebral/operators'

export default sequence('Show confirm-sign-out-yourself modal', [
  set(state`settings.showConfirmSignOut`, true),
])
