import {set} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  set(state`app.showFlash`, false),
  set(state`app.flash`, null),
  set(state`app.flashType`, null)
]
