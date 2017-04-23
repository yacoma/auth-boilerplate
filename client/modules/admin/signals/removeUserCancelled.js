import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default sequence('Close confirm-remove-user modal', [
  set(state`admin.activeUid`, null),
  set(state`admin.showConfirmRemoveUser`, false),
])
