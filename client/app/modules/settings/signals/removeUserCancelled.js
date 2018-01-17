import { sequence } from 'cerebral'
import { state } from 'cerebral/tags'
import { set } from 'cerebral/operators'

export default sequence('Close confirm-remove-yourself modal', [
  set(state`settings.showConfirmRemoveUser`, false),
])
