import profileFormSubmitted from './signals/profileFormSubmitted'
import emailFormSubmitted from './signals/emailFormSubmitted'
import passwordFormSubmitted from './signals/passwordFormSubmitted'
import signOutButtonClicked from './signals/signOutButtonClicked'
import signOutConfirmed from './signals/signOutConfirmed'
import signOutCancelled from './signals/signOutCancelled'
import removeUserButtonClicked from './signals/removeUserButtonClicked'
import removeUserConfirmed from './signals/removeUserConfirmed'
import removeUserCancelled from './signals/removeUserCancelled'

export default module => {
  return {
    signals: {
      profileFormSubmitted,
      emailFormSubmitted,
      passwordFormSubmitted,
      signOutButtonClicked,
      signOutCancelled,
      signOutConfirmed,
      removeUserButtonClicked,
      removeUserCancelled,
      removeUserConfirmed,
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
          validationRules: ['equalsField:password'],
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
  }
}
