import {sequence} from 'cerebral'
import {state, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import fetchUsers from '../actions/fetchUsers'

export default sequence('Fetch sorted users', [
  when(
    state`admin.usersSortBy`,
    props`sortBy`,
    (currentSortBy, sortBy) => currentSortBy === sortBy
  ),
  {
    true: [
      when(
        state`admin.usersSortDir`,
        currentSortDir => currentSortDir === 'ascending'
      ),
      {
        true: set(state`admin.usersSortDir`, 'descending'),
        false: set(state`admin.usersSortDir`, 'ascending'),
      },
    ],
    false: set(state`admin.usersSortDir`, 'ascending'),
  },
  set(state`admin.usersSortBy`, props`sortBy`),
  fetchUsers,
])
