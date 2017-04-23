import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'

export default sequence('Set values for settings form', [
  set(state`settings.profileForm.nickname.value`, state`user.nickname`),
])
