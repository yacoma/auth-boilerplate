import { sequence } from 'cerebral'
import { state, resolveObject } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { httpPost } from '@cerebral/http/operators'
import { isValidForm } from '@cerebral/forms/operators'
import showFlash from '../../../factories/showFlash'
import showValidationError from '../../../factories/showValidationError'
import initUser from '../actions/initUser'

export default sequence('Register new user', [
  isValidForm(state`user.registerForm`),
  {
    true: [
      set(state`user.registerForm.showErrors`, false),
      set(state`user.registerForm.confirmPassword.value`, ''),
      set(state`user.registerForm.isLoading`, true),
      httpPost(
        '/users',
        resolveObject({
          nickname: state`user.registerForm.nickname.value`,
          email: state`user.registerForm.email.value`,
          password: state`user.registerForm.password.value`,
        })
      ),
      {
        success: [
          httpPost(
            '/login',
            resolveObject({
              email: state`user.registerForm.email.value`,
              password: state`user.registerForm.password.value`,
            })
          ),
          {
            success: [
              set(state`flash`, null),
              set(state`flashType`, null),
              initUser,
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
              redirectToSignal('pageRouted', { page: 'home' }),
              showValidationError('Could not log-in!'),
            ],
          },
          set(state`user.registerForm.nickname.value`, ''),
          set(state`user.registerForm.email.value`, ''),
          set(state`user.registerForm.password.value`, ''),
          set(state`user.registerForm.isLoading`, false),
          showFlash(
            'Welcome! Please check your mailbox to confirm your email address.',
            'success'
          ),
        ],
        error: [
          set(state`user.registerForm.password.value`, ''),
          set(state`user.registerForm.isLoading`, false),
          showValidationError('Could not register!'),
        ],
      },
    ],
    false: set(state`user.registerForm.showErrors`, true),
  },
])
