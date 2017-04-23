import {sequence} from 'cerebral'
import {state, string, props} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {httpGet} from 'cerebral-provider-http/operators'
import showFlash from '../../common/factories/showFlash'

export default sequence('Sign out user', [
  set(state`admin.showConfirmSignOut`, false),
  set(props`nickname`, state`admin.users.${state`admin.activeUid`}.nickname`),
  httpGet(string`${state`admin.users.${state`admin.activeUid`}.@id`}/signout`),
  {
    success: [
      showFlash(
        string`Current tokens from ${props`nickname`} will not be refreshed`,
        'success'
      ),
    ],
    error: showFlash(
      string`Tokens from ${props`nickname`} could not be invalidated`,
      'error'
    ),
  },
  set(state`admin.activeUid`, null),
])
