import {sequence} from 'cerebral'
import {state, props} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default sequence('Sign user out', [
  set(state`admin.activeUid`, props`uid`),
  set(state`admin.showConfirmSignOut`, true)
])
