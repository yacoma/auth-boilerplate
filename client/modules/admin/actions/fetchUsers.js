import {sequence} from 'cerebral'
import {state, string, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {httpGet} from 'cerebral-provider-http/operators'
import showFlash from '../../common/factories/showFlash'
import mergeUsers from './mergeUsers'

export default sequence('Fetch users from database', [
  when(state`admin.usersSortDir`, (sortDir) => sortDir === 'ascending'), {
    true: set(props`sortDir`, 'asc'),
    false: set(props`sortDir`, 'desc')
  },
  set(props`sort`,
    string`sortby=${state`admin.usersSortBy`}&sortdir=${props`sortDir`}`
  ),
  set(props`search`, string`search=${state`admin.searchString`}`),
  httpGet(
    string`/users?${props`sort`}&${props`search`}`
  ), {
    success: mergeUsers,
    error: showFlash('Could not fetch users from database', 'error')
  }
])
