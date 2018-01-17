import { sequence } from 'cerebral'
import { state, resolveObject } from 'cerebral/tags'
import { set } from 'cerebral/operators'
import { isValidForm } from '@cerebral/forms/operators'
import { httpPost } from '@cerebral/http/operators'
import routeToLogin from '../../../actions/routeToLogin'
import showFlash from '../../../factories/showFlash'
import showValidationError from '../../../factories/showValidationError'

export default sequence('Request password reset', [
  isValidForm(state`user.emailForm`),
  {
    true: [
      set(state`user.emailForm.showErrors`, false),
      set(state`user.emailForm.isLoading`, true),
      httpPost(
        '/reset',
        resolveObject({
          email: state`user.emailForm.email.value`,
        })
      ),
      {
        success: [
          set(state`user.emailForm.email.value`, ''),
          set(state`user.emailForm.isLoading`, false),
          routeToLogin,
          showFlash(
            'Please check your email for a password reset link',
            'success'
          ),
        ],
        error: [
          set(state`user.emailForm.isLoading`, false),
          showValidationError('Could not send password reset email!'),
        ],
      },
    ],
    false: set(state`user.emailForm.showErrors`, true),
  },
])
