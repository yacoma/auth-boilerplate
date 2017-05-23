import {sequence} from 'cerebral'
import {state, string} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {httpPost, httpDelete} from '@cerebral/http/operators'
import {isValidForm} from '@cerebral/forms/operators'
import removeUser from '../../user/actions/removeUser'
import redirect from '../../common/factories/redirect'
import showFlash from '../../common/factories/showFlash'

export default sequence('Delete yourself', [
  set(state`settings.showConfirmRemoveUser`, false),
  isValidForm(state`settings.accountForm`),
  {
    true: [
      set(state`settings.accountForm.showErrors`, false),
      set(state`settings.accountForm.isLoading`, true),
      httpPost('/login', {
        email: state`user.email`,
        password: state`settings.accountForm.password.value`,
      }),
      {
        success: [
          set(state`settings.accountForm.password.value`, ''),
          httpDelete(string`${state`user.api.@id`}`),
          {
            success: [
              removeUser,
              set(state`settings.accountForm.isLoading`, false),
              redirect('home'),
              showFlash(string`You were successfully deleted. Bye!`, 'success'),
            ],
            error: [
              set(state`settings.accountForm.isLoading`, false),
              showFlash(string`You could not be deleted`, 'error'),
            ],
          },
        ],
        error: [
          set(state`settings.accountForm.password.value`, ''),
          set(state`settings.accountForm.isLoading`, false),
          showFlash('Password is not correct - please try again', 'error'),
        ],
      },
    ],
    false: [
      set(state`settings.accountForm.showErrors`, true),
      showFlash('Please provide your password', 'error'),
    ],
  },
])
