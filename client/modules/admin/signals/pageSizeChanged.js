import {sequence} from 'cerebral'
import {state, props} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import fetchUsers from '../actions/fetchUsers'

export default sequence('Change page size', [
  set(state`admin.pageSize`, props`value`),
  set(state`admin.currentPage`, 1),
  set(state`admin.users`, {}),
  fetchUsers,
])
