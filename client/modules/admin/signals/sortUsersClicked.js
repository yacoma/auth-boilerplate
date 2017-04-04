import {sequence} from 'cerebral'
import {state, string, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {httpGet} from 'cerebral-provider-http/operators'
import showFlash from '../../common/factories/showFlash'
import mergeUsers from '../actions/mergeUsers'

export default sequence('Fetch sorted users from database', [
  when(state`admin.usersSortBy`, props`sortBy`,
    (currentSortBy, sortBy) => currentSortBy === sortBy
  ), {
    true: [
      when(state`admin.usersSortDir`,
        (currentSortDir) => currentSortDir === 'ascending'
      ), {
        true: set(props`sortDir`, 'desc'),
        false: set(props`sortDir`, 'asc')
      }
    ],
    false: set(props`sortDir`, 'asc')
  },
  httpGet(string`/users?sortby=${props`sortBy`}&sortdir=${props`sortDir`}`), {
    success: [
      mergeUsers,
      set(state`admin.usersSortBy`, props`sortBy`),
      when(props`sortDir`, (sortDir) => sortDir === 'asc'), {
        true: set(state`admin.usersSortDir`, 'ascending'),
        false: set(state`admin.usersSortDir`, 'descending')
      }
    ],
    error: showFlash('Could not fetch sorted users from database', 'error')
  }
])
