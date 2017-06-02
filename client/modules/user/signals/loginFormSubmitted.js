import { sequence } from 'cerebral'
import { state } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import { isValidForm } from '@cerebral/forms/operators'
import { httpPost } from '@cerebral/http/operators'
import redirect from '../../common/factories/redirect'
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
          set(state`app.flash`, null),
          set(state`app.flashType`, null),
          initUser,
          set(state`user.loginForm.isLoading`, false),
          when(state`app.lastVisited`),
          {
            true: redirect(state`app.lastVisited`),
            false: redirect('home'),
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
