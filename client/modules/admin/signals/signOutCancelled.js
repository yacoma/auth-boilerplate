import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default sequence('Close confirm-sign-out-user modal', [
  set(state`admin.activeUid`, null),
  set(state`admin.showConfirmSignOut`, false),
])
