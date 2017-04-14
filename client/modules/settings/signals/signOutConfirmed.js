import {sequence} from 'cerebral'
import {state, string} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {httpPost, httpGet} from 'cerebral-provider-http/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import showFlash from '../../common/factories/showFlash'

export default sequence('Sign-out yourself', [
  set(state`settings.showConfirmSignOut`, false),
  isValidForm(state`settings.accountForm`), {
    true: [
      set(state`settings.accountForm.showErrors`, false),
      set(state`settings.accountForm.isLoading`, true),
      httpPost('/login', {
        email: state`user.email`,
        password: state`settings.accountForm.password.value`
      }), {
        success: [
          set(state`settings.accountForm.password.value`, ''),
          httpGet(string`/${state`user.api.@id`}/signout`), {
            success: [
              set(state`settings.accountForm.isLoading`, false),
              showFlash(
                string`Your current tokens will not be refreshed`,
                'success'
              )
            ],
            error: [
              set(state`settings.accountForm.isLoading`, false),
              showFlash(
                string`Your tokens could not be invalidated`,
                'error'
              )
            ]
          }
        ],
        error: [
          set(state`settings.accountForm.password.value`, ''),
          set(state`settings.accountForm.isLoading`, false),
          showFlash('Password is not correct - please try again', 'error')
        ]
      }
    ],
    false: [
      set(state`settings.accountForm.showErrors`, true),
      showFlash('Please provide your password', 'error')
    ]
  }
])
