import { sequence } from 'cerebral'
import { state, resolveObject } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { httpPost } from '@cerebral/http/operators'
import { isValidForm } from '@cerebral/forms/operators'
import initUser from '../actions/initUser'
import showValidationError from '../../../factories/showValidationError'

export default sequence('Sign-in user', [
  isValidForm(state`user.loginForm`),
  {
    true: [
      set(state`user.loginForm.showErrors`, false),
      set(state`user.loginForm.isLoading`, true),
      httpPost(
        '/login',
        resolveObject({
          email: state`user.loginForm.email.value`,
          password: state`user.loginForm.password.value`,
        })
      ),
      {
        success: [
          set(state`user.loginForm.email.value`, ''),
          set(state`user.loginForm.password.value`, ''),
          set(state`flash`, null),
          set(state`flashType`, null),
          initUser,
          set(state`user.loginForm.isLoading`, false),
          when(state`lastVisited`),
          {
            true: redirectToSignal(
              'pageRouted',
              resolveObject({
                page: state`lastVisited`,
              })
            ),
            false: redirectToSignal('pageRouted', { page: 'home' }),
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
