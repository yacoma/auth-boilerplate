import { Module } from 'cerebral'

import * as sequences from './sequences'

export default Module({
  signals: {
    profileFormSubmitted: sequences.updateProfile,
    emailFormSubmitted: sequences.updateEmail,
    passwordFormSubmitted: sequences.updatePassword,
    signOutButtonClicked: sequences.showSignOutActiveUserModal,
    signOutCancelled: sequences.closeSignOutActiveUserModal,
    signOutConfirmed: sequences.signOutActiveUser,
    removeUserButtonClicked: sequences.showRemoveActiveUserModal,
    removeUserCancelled: sequences.closeRemoveActiveUserModal,
    removeUserConfirmed: sequences.removeActiveUser,
  },

  state: {
    currentTab: 'profile',
    profileForm: {
      nickname: {
        value: '',
        validationRules: ['minLength:3'],
        isRequired: true,
      },
      showErrors: false,
      isLoading: false,
    },
    emailForm: {
      password: {
        value: '',
        validationRules: ['minLength:5'],
        isRequired: true,
      },
      email: {
        value: '',
        validationRules: ['isEmail'],
        isRequired: true,
      },
      showErrors: false,
      isLoading: false,
    },
    passwordForm: {
      currentPassword: {
        value: '',
        validationRules: ['minLength:5'],
        isRequired: true,
      },
      password: {
        value: '',
        validationRules: ['minLength:5'],
        isRequired: true,
      },
      confirmPassword: {
        value: '',
        validationRules: ['equalsField:settings.passwordForm.password'],
        isRequired: true,
      },
      showErrors: false,
      isLoading: false,
    },
    showConfirmSignOut: false,
    showConfirmRemoveUser: false,
    accountForm: {
      password: {
        value: '',
        validationRules: ['minLength:5'],
        isRequired: true,
      },
      showErrors: false,
      isLoading: false,
    },
  },
})
