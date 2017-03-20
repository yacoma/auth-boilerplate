import {state} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPost} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'
import setValidationError from '../factories/setValidationError'

export default [
  isValidForm(state`user.register`), {
    true: [
      set(state`user.register.isLoading`, true),
      httpPost('/users', {
        nickname: state`user.register.nickname.value`,
        email: state`user.register.email.value`,
        password: state`user.register.password.value`
      }), {
        success: [
          set(state`user.register.showErrors`, false),
          set(state`user.register.validationError`, null),
          set(state`user.register.nickname.value`, ''),
          set(state`user.register.email.value`, ''),
          set(state`user.register.password.value`, ''),
          set(state`user.register.confirmPassword.value`, ''),
          set(state`user.register.isLoading`, false),
          routeTo('login'),
          showFlash('Please check your email to confirm your email address', 'success')
        ],
        error: [
          set(state`user.register.password.value`, ''),
          set(state`user.register.confirmPassword.value`, ''),
          set(state`user.register.showErrors`, false),
          setValidationError(
            'user.register.validationError',
            'Could not register!'
          ),
          set(state`user.register.isLoading`, false)
        ]
      }
    ],
    false: set(state`user.register.showErrors`, true)
  }
]
