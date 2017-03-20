import {state, string} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPut} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'
import setValidationError from '../factories/setValidationError'

export default [
  isValidForm(state`user.passwordForm`), {
    true: [
      set(state`user.passwordForm.isLoading`, true),
      httpPut(string`${state`user.api.@id`}`, {
        password: state`user.passwordForm.password.value`
      }), {
        success: [
          set(state`user.passwordForm.showErrors`, false),
          set(state`user.passwordForm.validationError`, null),
          set(state`user.api.@id`, null),
          set(state`user.passwordForm.password.value`, ''),
          set(state`user.passwordForm.confirmPassword.value`, ''),
          set(state`user.passwordForm.isLoading`, false),
          routeTo('home'),
          showFlash('Your password has been updated', 'success')
        ],
        error: [
          set(state`user.passwordForm.password.value`, ''),
          set(state`user.passwordForm.confirmPassword.value`, ''),
          set(state`user.passwordForm.showErrors`, false),
          setValidationError(
            'user.passwordForm.validationError',
            'Could not update Password!'
          ),
          set(state`user.passwordForm.isLoading`, false)
        ]
      }
    ],
    false: set(state`user.passwordForm.showErrors`, true)
  }
]
