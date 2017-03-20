import {state} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPost} from 'cerebral-provider-http/operators'
import initUser from '../actions/initUser'
import setValidationError from '../factories/setValidationError'

export default [
  isValidForm(state`user.signIn`), {
    true: [
      set(state`user.signIn.isLoading`, true),
      httpPost('/login', {
        email: state`user.signIn.email.value`,
        password: state`user.signIn.password.value`
      }), {
        success: [
          set(state`user.signIn.email.value`, ''),
          set(state`user.signIn.password.value`, ''),
          set(state`user.signIn.showErrors`, false),
          set(state`user.signIn.validationError`, null),
          initUser,
          set(state`user.signIn.isLoading`, false),
          when(state`app.lastVisited`), {
            true: set(state`app.currentPage`, state`app.lastVisited`),
            false: set(state`app.currentPage`, 'home')
          }
        ],
        error: [
          set(state`user.signIn.password.value`, ''),
          set(state`user.signIn.showErrors`, false),
          setValidationError(
            'user.signIn.validationError',
            'Could not log-in!'
          ),
          set(state`user.signIn.isLoading`, false)
        ]
      }
    ],
    false: set(state`user.signIn.showErrors`, true)
  }
]
