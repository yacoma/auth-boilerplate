import {state, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {isValidForm} from 'cerebral-forms'
import {httpPost} from 'cerebral-provider-http'

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
          set(state`user.register.integrityError`, null),
          set(state`user.register.nickname.value`, ''),
          set(state`user.register.email.value`, ''),
          set(state`user.register.password.value`, ''),
          set(state`user.register.confirmPassword.value`, ''),
          set(state`user.register.isLoading`, false),
          set(state`app.currentPage`, 'login')
        ],
        error: [
          set(state`user.register.password.value`, ''),
          set(state`user.register.confirmPassword.value`, ''),
          set(state`user.register.showErrors`, false),
          when(props`status`, (status) => status === 409), {
            true: [set(state`user.register.integrityError`, props`result.integrityError`)],
            false: [set(state`user.register.integrityError`, 'Could not register!')]
          },
          set(state`user.register.isLoading`, false)
        ]
      }
    ],
    false: [
      set(state`user.register.showErrors`, true)
    ]
  }
]
