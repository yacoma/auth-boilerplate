import {set, when} from 'cerebral/operators'
import {state, input} from 'cerebral/tags'

import removeUser from '../actions/removeUser'
import routeTo from '../../app/chains/routeTo'

export default [
  removeUser,
  when(state`app.lastVisited`), {
    true: [set(input`page`, state`app.lastVisited`)],
    false: [set(input`page`, 'home')]
  },
  ...routeTo
]
