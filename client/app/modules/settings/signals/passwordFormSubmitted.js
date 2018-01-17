import { sequence } from 'cerebral'
import { state, string, resolveObject } from 'cerebral/tags'
import { set } from 'cerebral/operators'
import { isValidForm } from '@cerebral/forms/operators'
import { httpPost, httpPut } from '@cerebral/http/operators'
import showFlash from '../../../factories/showFlash'
import showValidationError from '../../../factories/showValidationError'

export default sequence('Change your password', [
  isValidForm(state`settings.passwordForm`),
  {
    true: [
      set(state`settings.passwordForm.showErrors`, false),
      set(state`settings.passwordForm.confirmPassword.value`, ''),
      set(state`settings.passwordForm.isLoading`, true),
      httpPost(
        '/login',
        resolveObject({
          email: state`user.email`,
          password: state`settings.passwordForm.currentPassword.value`,
        })
      ),
      {
        success: [
          set(state`settings.passwordForm.currentPassword.value`, ''),
          httpPut(
            string`${state`user.api.@id`}`,
            resolveObject({
              password: state`settings.passwordForm.password.value`,
            })
          ),
          {
            success: [
              set(state`settings.passwordForm.password.value`, ''),
              set(state`settings.passwordForm.isLoading`, false),
              showFlash('Your password has been changed', 'success'),
            ],
            error: [
              set(state`settings.passwordForm.password.value`, ''),
              set(state`settings.passwordForm.isLoading`, false),
              showValidationError('Could not change Password!'),
            ],
          },
        ],
        error: [
          set(state`settings.passwordForm.currentPassword.value`, ''),
          set(state`settings.passwordForm.password.value`, ''),
          set(state`settings.passwordForm.isLoading`, false),
          showFlash(
            'Current password is not correct - please try again',
            'error'
          ),
        ],
      },
    ],
    false: set(state`settings.passwordForm.showErrors`, true),
  },
])
