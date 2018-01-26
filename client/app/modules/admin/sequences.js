import { state, string, props, resolveObject } from 'cerebral/tags'
import { set, unset, when, debounce } from 'cerebral/operators'
import { httpGet, httpDelete, httpPut } from '@cerebral/http/operators'

import * as rootFactories from '../../factories'
import * as actions from './actions'

export const fetchUsers = [
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
    success: [
      actions.mergeUsers,
      set(state`admin.pages`, props`response.result.pages`),
    ],
    error: rootFactories.showFlash(
      'Could not fetch users from database',
      'error'
    ),
  },
]

export const fetchSortedUsers = [
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
]

export const showSignOutUserModal = [
  set(state`admin.activeUid`, props`uid`),
  set(state`admin.showConfirmSignOut`, true),
]

export const closeSignOutUserModal = [
  set(state`admin.activeUid`, null),
  set(state`admin.showConfirmSignOut`, false),
]

export const signOutUser = [
  set(state`admin.showConfirmSignOut`, false),
  set(props`nickname`, state`admin.users.${state`admin.activeUid`}.nickname`),
  httpGet(string`${state`admin.users.${state`admin.activeUid`}.@id`}/signout`),
  {
    success: [
      rootFactories.showFlash(
        string`Current tokens from ${props`nickname`} will not be refreshed`,
        'success'
      ),
    ],
    error: rootFactories.showFlash(
      string`Tokens from ${props`nickname`} could not be invalidated`,
      'error'
    ),
  },
  set(state`admin.activeUid`, null),
]

export const showRemoveUserModal = [
  set(state`admin.activeUid`, props`uid`),
  set(state`admin.showConfirmRemoveUser`, true),
]

export const closeRemoveUserModal = [
  set(state`admin.activeUid`, null),
  set(state`admin.showConfirmRemoveUser`, false),
]

export const removeUser = [
  set(state`admin.showConfirmRemoveUser`, false),
  set(props`nickname`, state`admin.users.${state`admin.activeUid`}.nickname`),
  httpDelete(string`${state`admin.users.${state`admin.activeUid`}.@id`}`),
  {
    success: [
      unset(state`admin.users.${state`admin.activeUid`}`),
      rootFactories.showFlash(
        string`${props`nickname`} was successfully deleted`,
        'success'
      ),
    ],
    error: rootFactories.showFlash(
      string`${props`nickname`} could not be deleted`,
      'error'
    ),
  },
  set(state`admin.activeUid`, null),
]

export const toggleAdmin = [
  set(state`admin.users.${props`uid`}.toggleAdminIsLoading`, true),
  when(state`admin.users.${props`uid`}.isAdmin`),
  {
    true: [set(props`isAdmin`, false), set(props`groups`, [])],
    false: [set(props`isAdmin`, true), set(props`groups`, ['Admin'])],
  },
  httpPut(
    string`${state`admin.users.${props`uid`}.@id`}`,
    resolveObject({
      groups: props`groups`,
    })
  ),
  {
    success: [set(state`admin.users.${props`uid`}.isAdmin`, props`isAdmin`)],
    error: rootFactories.showValidationError(
      string`Admin could not be toggled for ${state`admin.users.${props`uid`}.nickname`}`
    ),
  },
  set(state`admin.users.${props`uid`}.toggleAdminIsLoading`, false),
]

export const searchUsers = [
  debounce(500),
  {
    continue: [
      set(state`admin.searchIsLoading`, true),
      set(state`admin.searchString`, props`value`),
      set(state`admin.users`, {}),
      fetchUsers,
      set(state`admin.searchIsLoading`, false),
      when(props`noUsersFound`),
      {
        true: rootFactories.showFlash(
          'Could not find any users matching.',
          'info'
        ),
        false: [],
      },
    ],
    discard: [],
  },
]

export const changePageSize = [
  set(state`admin.pageSize`, props`value`),
  set(state`admin.currentPage`, 1),
  set(state`admin.users`, {}),
  fetchUsers,
]

export const changePage = [
  actions.getNextPage,
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
]
