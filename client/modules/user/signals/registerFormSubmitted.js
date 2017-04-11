import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPost} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Register new user', [
  isValidForm(state`user.registerForm`), {
    true: [
      set(state`user.registerForm.isLoading`, true),
      httpPost('/users', {
        nickname: state`user.registerForm.nickname.value`,
        email: state`user.registerForm.email.value`,
        password: state`user.registerForm.password.value`
      }), {
        success: [
          set(state`user.registerForm.showErrors`, false),
          set(state`user.registerForm.nickname.value`, ''),
          set(state`user.registerForm.email.value`, ''),
          set(state`user.registerForm.password.value`, ''),
          set(state`user.registerForm.confirmPassword.value`, ''),
          set(state`user.registerForm.isLoading`, false),
          routeTo('login'),
          showFlash('Please check your email to confirm your email address', 'success')
        ],
        error: [
          set(state`user.registerForm.password.value`, ''),
          set(state`user.registerForm.confirmPassword.value`, ''),
          set(state`user.registerForm.showErrors`, false),
          set(state`user.registerForm.isLoading`, false),
          showValidationError('Could not register!')
        ]
      }
    ],
    false: set(state`user.registerForm.showErrors`, true)
  }
])
