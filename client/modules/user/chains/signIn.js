import {state, props} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {isValidForm} from 'cerebral-forms'
import {httpPost} from 'cerebral-provider-http'
import initUser from '../actions/initUser'

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
            true: [set(state`app.currentPage`, state`app.lastVisited`)],
            false: [set(state`app.currentPage`, 'home')]
          }
        ],
        error: [
          set(state`user.signIn.password.value`, ''),
          set(state`user.signIn.showErrors`, false),
          when(props`status`, (status) => status === 403), {
            true: [set(state`user.signIn.validationError`, props`result.validationError`)],
            false: [set(state`user.signIn.validationError`, 'Could not log-in!')]
          },
          set(state`user.signIn.isLoading`, false)
        ]
      }
    ],
    false: [
      set(state`user.signIn.showErrors`, true)
    ]
  }
]
