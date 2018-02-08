import { sequence } from 'cerebral'
import { state, string, resolveObject } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import { redirectToSignal } from '@cerebral/router/operators'
import { isValidForm } from '@cerebral/forms/operators'
import {
  httpPut,
  httpPost,
  httpGet,
  httpDelete,
} from '@cerebral/http/operators'

import { removeUser } from '../user/actions'
import * as rootFactories from '../../factories'

export const prepareSettingsForm = sequence('Set values for settings form', [
  set(state`settings.profileForm.nickname.value`, state`user.nickname`),
])

export const updateProfile = sequence('Update active user profile', [
  isValidForm(state`settings.profileForm`),
  {
    true: [
      set(state`settings.profileForm.showErrors`, false),
      set(state`settings.profileForm.isLoading`, true),
      httpPut(
        string`${state`user.api.@id`}`,
        resolveObject({
          nickname: state`settings.profileForm.nickname.value`,
        })
      ),
      {
        success: [
          set(state`user.nickname`, state`settings.profileForm.nickname.value`),
          set(state`settings.profileForm.isLoading`, false),
          rootFactories.showFlash('Your profile has be saved', 'success'),
        ],
        error: [
          set(state`settings.profileForm.isLoading`, false),
          rootFactories.showValidationError('Could not save your profile!'),
        ],
      },
    ],
    false: set(state`settings.profileForm.showErrors`, true),
  },
])

export const updateEmail = sequence('Update active user email address', [
  isValidForm(state`settings.emailForm`),
  {
    true: [
      set(state`settings.emailForm.showErrors`, false),
      when(
        state`user.email`,
        state`settings.emailForm.email.value`,
        (currentEmail, email) => currentEmail !== email
      ),
      {
        true: [
          set(state`settings.emailForm.isLoading`, true),
          httpPost(
            '/login',
            resolveObject({
              email: state`user.email`,
              password: state`settings.emailForm.password.value`,
            })
          ),
          {
            success: [
              set(state`settings.emailForm.password.value`, ''),
              httpPut(
                string`${state`user.api.@id`}`,
                resolveObject({
                  email: state`settings.emailForm.email.value`,
                })
              ),
              {
                success: [
                  set(state`user.email`, state`settings.emailForm.email.value`),
                  set(state`settings.emailForm.isLoading`, false),
                  rootFactories.showFlash(
                    'Please check your mailbox to confirm your new email address',
                    'success'
                  ),
                ],
                error: [
                  set(state`settings.emailForm.isLoading`, false),
                  rootFactories.showValidationError('Could not update email!'),
                ],
              },
            ],
            error: [
              set(state`settings.emailForm.password.value`, ''),
              set(state`settings.emailForm.isLoading`, false),
              rootFactories.showFlash(
                'Password is not correct - please try again',
                'error'
              ),
            ],
          },
        ],
        false: rootFactories.showFlash(
          'This email address is the same as your current email',
          'warning'
        ),
      },
    ],
    false: set(state`settings.emailForm.showErrors`, true),
  },
])

export const updatePassword = sequence('Update active user password', [
  isValidForm(state`settings.passwordForm`),
  {
    true: [
      set(state`settings.passwordForm.showErrors`, false),
      set(state`settings.passwordForm.confirmPassword.value`, ''),
      set(state`settings.passwordForm.isLoading`, true),
      httpPost(
        '/login',
        resolveObject({
          email: state`user.email`,
          password: state`settings.passwordForm.currentPassword.value`,
        })
      ),
      {
        success: [
          set(state`settings.passwordForm.currentPassword.value`, ''),
          httpPut(
            string`${state`user.api.@id`}`,
            resolveObject({
              password: state`settings.passwordForm.password.value`,
            })
          ),
          {
            success: [
              set(state`settings.passwordForm.password.value`, ''),
              set(state`settings.passwordForm.isLoading`, false),
              rootFactories.showFlash(
                'Your password has been changed',
                'success'
              ),
            ],
            error: [
              set(state`settings.passwordForm.password.value`, ''),
              set(state`settings.passwordForm.isLoading`, false),
              rootFactories.showValidationError('Could not change Password!'),
            ],
          },
        ],
        error: [
          set(state`settings.passwordForm.currentPassword.value`, ''),
          set(state`settings.passwordForm.password.value`, ''),
          set(state`settings.passwordForm.isLoading`, false),
          rootFactories.showFlash(
            'Current password is not correct - please try again',
            'error'
          ),
        ],
      },
    ],
    false: set(state`settings.passwordForm.showErrors`, true),
  },
])

export const showSignOutActiveUserModal = sequence(
  'Show confirm-sign-out-yourself modal',
  [set(state`settings.showConfirmSignOut`, true)]
)

export const closeSignOutActiveUserModal = sequence(
  'Close confirm-sign-out-yourself modal',
  [set(state`settings.showConfirmSignOut`, false)]
)

export const signOutActiveUser = sequence('Sign-out yourself', [
  set(state`settings.showConfirmSignOut`, false),
  isValidForm(state`settings.accountForm`),
  {
    true: [
      set(state`settings.accountForm.showErrors`, false),
      set(state`settings.accountForm.isLoading`, true),
      httpPost(
        '/login',
        resolveObject({
          email: state`user.email`,
          password: state`settings.accountForm.password.value`,
        })
      ),
      {
        success: [
          set(state`settings.accountForm.password.value`, ''),
          httpGet(string`${state`user.api.@id`}/signout`),
          {
            success: [
              set(state`settings.accountForm.isLoading`, false),
              rootFactories.showFlash(
                string`Your current tokens will not be refreshed`,
                'success'
              ),
            ],
            error: [
              set(state`settings.accountForm.isLoading`, false),
              rootFactories.showFlash(
                string`Your tokens could not be invalidated`,
                'error'
              ),
            ],
          },
        ],
        error: [
          set(state`settings.accountForm.password.value`, ''),
          set(state`settings.accountForm.isLoading`, false),
          rootFactories.showFlash(
            'Password is not correct - please try again',
            'error'
          ),
        ],
      },
    ],
    false: [
      set(state`settings.accountForm.showErrors`, true),
      rootFactories.showFlash('Please provide your password', 'error'),
    ],
  },
])

export const showRemoveActiveUserModal = sequence(
  'Show confirm-remove-yourself modal',
  [set(state`settings.showConfirmRemoveUser`, true)]
)

export const closeRemoveActiveUserModal = sequence(
  'Close confirm-remove-yourself modal',
  [set(state`settings.showConfirmRemoveUser`, false)]
)

export const removeActiveUser = sequence('Remove active user', [
  set(state`settings.showConfirmRemoveUser`, false),
  isValidForm(state`settings.accountForm`),
  {
    true: [
      set(state`settings.accountForm.showErrors`, false),
      set(state`settings.accountForm.isLoading`, true),
      httpPost(
        '/login',
        resolveObject({
          email: state`user.email`,
          password: state`settings.accountForm.password.value`,
        })
      ),
      {
        success: [
          set(state`settings.accountForm.password.value`, ''),
          httpDelete(string`${state`user.api.@id`}`),
          {
            success: [
              removeUser,
              set(state`settings.accountForm.isLoading`, false),
              redirectToSignal('pageRouted', { page: 'home' }),
              rootFactories.showFlash(
                string`You were successfully deleted. Bye!`,
                'success'
              ),
            ],
            error: [
              set(state`settings.accountForm.isLoading`, false),
              rootFactories.showFlash(
                string`You could not be deleted`,
                'error'
              ),
            ],
          },
        ],
        error: [
          set(state`settings.accountForm.password.value`, ''),
          set(state`settings.accountForm.isLoading`, false),
          rootFactories.showFlash(
            'Password is not correct - please try again',
            'error'
          ),
        ],
      },
    ],
    false: [
      set(state`settings.accountForm.showErrors`, true),
      rootFactories.showFlash('Please provide your password', 'error'),
    ],
  },
])
