import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPost} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import initUser from '../actions/initUser'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Sign-in user', [
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
          initUser,
          set(state`user.signIn.isLoading`, false),
          when(state`app.lastVisited`), {
            true: routeTo(state`app.lastVisited`),
            false: routeTo('home')
          }
        ],
        error: [
          set(state`user.signIn.password.value`, ''),
          set(state`user.signIn.showErrors`, false),
          set(state`user.signIn.isLoading`, false),
          showValidationError('Could not log-in!')
        ]
      }
    ],
    false: set(state`user.signIn.showErrors`, true)
  }
])
