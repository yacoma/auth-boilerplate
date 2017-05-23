import {sequence} from 'cerebral'
import {state, string, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {httpGet} from '@cerebral/http/operators'
import showFlash from '../../common/factories/showFlash'
import mergeUsers from './mergeUsers'

export default sequence('Fetch users from database', [
  when(state`admin.usersSortDir`, usersSortDir => usersSortDir === 'ascending'),
  {
    true: set(props`sortDir`, 'asc'),
    false: set(props`sortDir`, 'desc'),
  },
  set(
    props`sort`,
    string`sortby=${state`admin.usersSortBy`}&sortdir=${props`sortDir`}`
  ),
  set(
    props`pagination`,
    string`&page=${state`admin.currentPage`}&pagesize=${state`admin.pageSize`}`
  ),
  when(state`admin.searchString`, searchString => searchString !== ''),
  {
    true: set(props`search`, string`&search=${state`admin.searchString`}`),
    false: set(props`search`, ''),
  },
  httpGet(string`/users?${props`sort`}${props`pagination`}${props`search`}`),
  {
    success: [mergeUsers, set(state`admin.pages`, props`result.pages`)],
    error: showFlash('Could not fetch users from database', 'error'),
  },
])
