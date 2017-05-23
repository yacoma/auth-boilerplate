import {sequence} from 'cerebral'
import {state, string} from 'cerebral/tags'
import {set} from 'cerebral/operators'
import {isValidForm} from '@cerebral/forms/operators'
import {httpPut} from '@cerebral/http/operators'
import showFlash from '../../common/factories/showFlash'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Edit your user profile', [
  isValidForm(state`settings.profileForm`),
  {
    true: [
      set(state`settings.profileForm.showErrors`, false),
      set(state`settings.profileForm.isLoading`, true),
      httpPut(string`${state`user.api.@id`}`, {
        nickname: state`settings.profileForm.nickname.value`,
      }),
      {
        success: [
          set(state`user.nickname`, state`settings.profileForm.nickname.value`),
          set(state`settings.profileForm.isLoading`, false),
          showFlash('Your profile has be saved', 'success'),
        ],
        error: [
          set(state`settings.profileForm.isLoading`, false),
          showValidationError('Could not save your profile!'),
        ],
      },
    ],
    false: set(state`settings.profileForm.showErrors`, true),
  },
])
