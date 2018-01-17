import { sequence } from 'cerebral'
import { state, string, resolveObject } from 'cerebral/tags'
import { set } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { httpPut } from '@cerebral/http/operators'
import { isValidForm } from '@cerebral/forms/operators'
import showFlash from '../../../factories/showFlash'
import showValidationError from '../../../factories/showValidationError'

export default sequence('Update password', [
  isValidForm(state`user.passwordForm`),
  {
    true: [
      set(state`user.passwordForm.showErrors`, false),
      set(state`user.passwordForm.confirmPassword.value`, ''),
      set(state`user.passwordForm.isLoading`, true),
      httpPut(
        string`${state`user.api.@id`}`,
        resolveObject({
          password: state`user.passwordForm.password.value`,
        })
      ),
      {
        success: [
          set(state`user.api.@id`, null),
          set(state`user.passwordForm.password.value`, ''),
          set(state`user.passwordForm.isLoading`, false),
          redirectToSignal('pageRouted', { page: 'home' }),
          showFlash('Your password has been updated', 'success'),
        ],
        error: [
          set(state`user.passwordForm.password.value`, ''),
          set(state`user.passwordForm.isLoading`, false),
          showValidationError('Could not update Password!'),
        ],
      },
    ],
    false: set(state`user.passwordForm.showErrors`, true),
  },
])
