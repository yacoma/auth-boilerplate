import {sequence} from 'cerebral'
import {state, props} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default sequence('Show confirm-remove-user modal', [
  set(state`admin.activeUid`, props`uid`),
  set(state`admin.showConfirmRemoveUser`, true)
])
