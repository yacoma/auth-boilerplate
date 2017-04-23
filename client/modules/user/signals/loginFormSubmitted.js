import {sequence} from 'cerebral'
import {state} from 'cerebral/tags'
import {set, when} from 'cerebral/operators'
import {isValidForm} from 'cerebral-provider-forms/operators'
import {httpPost} from 'cerebral-provider-http/operators'
import routeTo from '../../common/factories/routeTo'
import initUser from '../actions/initUser'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Sign-in user', [
  isValidForm(state`user.loginForm`),
  {
    true: [
      set(state`user.loginForm.showErrors`, false),
      set(state`user.loginForm.isLoading`, true),
      httpPost('/login', {
        email: state`user.loginForm.email.value`,
        password: state`user.loginForm.password.value`,
      }),
      {
        success: [
          set(state`user.loginForm.email.value`, ''),
          set(state`user.loginForm.password.value`, ''),
          initUser,
          set(state`user.loginForm.isLoading`, false),
          when(state`app.lastVisited`),
          {
            true: routeTo(state`app.lastVisited`),
            false: routeTo('home'),
          },
        ],
        error: [
          set(state`user.loginForm.password.value`, ''),
          set(state`user.loginForm.isLoading`, false),
          showValidationError('Could not log-in!'),
        ],
      },
    ],
    false: set(state`user.loginForm.showErrors`, true),
  },
])
