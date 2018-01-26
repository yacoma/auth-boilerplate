import { state, props, string, resolveObject } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { httpPost, httpPut } from '@cerebral/http/operators'
import { setField, isValidForm } from '@cerebral/forms/operators'

import * as rootFactories from '../../factories'
import * as rootActions from '../../actions'
import * as actions from './actions'

export const changeField = setField(state`${props`path`}`, props`value`)

export const signinUser = [
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
          rootActions.initUser,
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
          rootFactories.showValidationError('Could not log-in!'),
        ],
      },
    ],
    false: set(state`user.loginForm.showErrors`, true),
  },
]

export const registerUser = [
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
              rootActions.initUser,
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
              rootFactories.showValidationError('Could not log-in!'),
            ],
          },
          set(state`user.registerForm.nickname.value`, ''),
          set(state`user.registerForm.email.value`, ''),
          set(state`user.registerForm.password.value`, ''),
          set(state`user.registerForm.isLoading`, false),
          rootFactories.showFlash(
            'Welcome! Please check your mailbox to confirm your email address.',
            'success'
          ),
        ],
        error: [
          set(state`user.registerForm.password.value`, ''),
          set(state`user.registerForm.isLoading`, false),
          rootFactories.showValidationError('Could not register!'),
        ],
      },
    ],
    false: set(state`user.registerForm.showErrors`, true),
  },
]

export const requestPasswordReset = [
  isValidForm(state`user.emailForm`),
  {
    true: [
      set(state`user.emailForm.showErrors`, false),
      set(state`user.emailForm.isLoading`, true),
      httpPost(
        '/reset',
        resolveObject({
          email: state`user.emailForm.email.value`,
        })
      ),
      {
        success: [
          set(state`user.emailForm.email.value`, ''),
          set(state`user.emailForm.isLoading`, false),
          rootActions.redirectToLogin,
          rootFactories.showFlash(
            'Please check your email for a password reset link',
            'success'
          ),
        ],
        error: [
          set(state`user.emailForm.isLoading`, false),
          rootFactories.showValidationError(
            'Could not send password reset email!'
          ),
        ],
      },
    ],
    false: set(state`user.emailForm.showErrors`, true),
  },
]

export const updatePassword = [
  isValidForm(state`user.passwordForm`),
  {
    true: [
      set(state`user.passwordForm.showErrors`, false),
      set(state`user.passwordForm.confirmPassword.value`, ''),
      set(state`user.passwordForm.isLoading`, true),
      httpPut(
        string`${state`user.api.@id`}`,
        resolveObject({
          password: state`user.passwordForm.password.value`,
        })
      ),
      {
        success: [
          set(state`user.api.@id`, null),
          set(state`user.passwordForm.password.value`, ''),
          set(state`user.passwordForm.isLoading`, false),
          redirectToSignal('pageRouted', { page: 'home' }),
          rootFactories.showFlash('Your password has been updated', 'success'),
        ],
        error: [
          set(state`user.passwordForm.password.value`, ''),
          set(state`user.passwordForm.isLoading`, false),
          rootFactories.showValidationError('Could not update Password!'),
        ],
      },
    ],
    false: set(state`user.passwordForm.showErrors`, true),
  },
]

export const logoutUser = [
  set(state`user.loginForm.isLoading`, false),
  actions.removeUser,
  redirectToSignal('pageRouted', { page: 'home' }),
  rootFactories.showFlash('Good bye!', 'info'),
]
