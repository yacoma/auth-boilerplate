import {sequence} from 'cerebral'
import {set, when} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import showFlash from './showFlash'

function authenticateAdmin (continueSequence = []) {
  return sequence('Authenticate user with admin permissions', [
    when(state`user.isAdmin`), {
      true: continueSequence,
      false: [
        set(state`app.currentPage`, 'login'),
        showFlash('You need Admin permissions to view this page', 'info')
      ]
    }
  ])
}

export default authenticateAdmin
