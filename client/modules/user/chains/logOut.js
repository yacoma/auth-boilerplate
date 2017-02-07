import {set, when} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'

import removeUser from '../actions/removeUser'
import routeTo from '../../app/chains/routeTo'

export default [
  removeUser,
  when(state`app.lastVisited`), {
    true: [set(props`page`, state`app.lastVisited`)],
    false: [set(props`page`, 'home')]
  },
  ...routeTo
]
