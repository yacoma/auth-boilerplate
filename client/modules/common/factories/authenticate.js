import {sequence} from 'cerebral'
import {set, when} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import showFlash from './showFlash'

function authenticate (continueSequence = []) {
  return sequence('Authenticate user', [
    when(state`user.autenticated`), {
      true: continueSequence,
      false: [
        set(state`app.currentPage`, 'login'),
        showFlash('You must log in to view this page', 'info')
      ]
    }
  ])
}

export default authenticate
