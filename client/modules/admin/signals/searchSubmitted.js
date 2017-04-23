import {sequence} from 'cerebral'
import {state, props} from 'cerebral/tags'
import {set, when, debounce} from 'cerebral/operators'
import showFlash from '../../common/factories/showFlash'
import fetchUsers from '../actions/fetchUsers'

export default sequence('Search for users', [
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
        true: showFlash('Could not find any users matching.', 'info'),
        false: [],
      },
    ],
    discard: [],
  },
])
