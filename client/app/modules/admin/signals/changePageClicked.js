import { sequence } from 'cerebral'
import { state, props } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import getNextPage from '../actions/getNextPage'
import fetchUsers from '../actions/fetchUsers'

export default sequence('Change page', [
  getNextPage,
  when(
    props`nextPage`,
    state`admin.pages`,
    state`admin.currentPage`,
    (nextPage, pages, currentPage) =>
      nextPage > 0 && nextPage <= pages && nextPage !== currentPage
  ),
  {
    true: [
      set(state`admin.currentPage`, props`nextPage`),
      set(state`admin.users`, {}),
      fetchUsers,
    ],
    false: [],
  },
])
