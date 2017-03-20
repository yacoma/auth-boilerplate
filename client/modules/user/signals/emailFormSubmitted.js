import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPost} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'
import setValidationError from '../factories/setValidationError'

export default [
  isValidForm(state`user.emailForm`), {
    true: [
      set(state`user.emailForm.isLoading`, true),
      httpPost('/reset', {
        email: state`user.emailForm.email.value`
      }), {
        success: [
          set(state`user.emailForm.showErrors`, false),
          set(state`user.emailForm.validationError`, null),
          set(state`user.emailForm.email.value`, ''),
          set(state`user.emailForm.isLoading`, false),
          routeTo('login'),
          showFlash('Please check your email for a password reset link', 'success')
        ],
        error: [
          set(state`user.emailForm.showErrors`, false),
          setValidationError(
            'user.emailForm.validationError',
            'Could not send password reset email!'
          ),
          set(state`user.emailForm.isLoading`, false)
        ]
      }
    ],
    false: set(state`user.emailForm.showErrors`, true)
  }
]
