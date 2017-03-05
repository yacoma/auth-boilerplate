import {state, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {isValidForm} from 'cerebral-forms'
import {httpPost} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'

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
          when(props`status`, (status) => status === 403 || status === 422), {
            true: set(
              state`user.emailForm.validationError`,
              props`result.validationError`
            ),
            false: set(
              state`user.emailForm.validationError`,
              'Could not send password reset email!'
            )
          },
          set(state`user.emailForm.isLoading`, false)
        ]
      }
    ],
    false: set(state`user.emailForm.showErrors`, true)
  }
]
