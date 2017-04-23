import {sequence} from 'cerebral'
import {state, string, props} from 'cerebral/tags'
import {set, unset} from 'cerebral/operators'
import {httpDelete} from 'cerebral-provider-http/operators'
import showFlash from '../../common/factories/showFlash'

export default sequence('Delete user', [
  set(state`admin.showConfirmRemoveUser`, false),
  set(props`nickname`, state`admin.users.${state`admin.activeUid`}.nickname`),
  httpDelete(string`${state`admin.users.${state`admin.activeUid`}.@id`}`),
  {
    success: [
      unset(state`admin.users.${state`admin.activeUid`}`),
      showFlash(string`${props`nickname`} was successfully deleted`, 'success'),
    ],
    error: showFlash(string`${props`nickname`} could not be deleted`, 'error'),
  },
  set(state`admin.activeUid`, null),
])
