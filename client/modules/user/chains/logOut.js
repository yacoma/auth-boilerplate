import {set} from 'cerebral/operators'
import {props} from 'cerebral/tags'

import removeUser from '../actions/removeUser'
import routeTo from '../../app/chains/routeTo'

export default [
  removeUser,
  set(props`page`, 'home'),
  ...routeTo
]
