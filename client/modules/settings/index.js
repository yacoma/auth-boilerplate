import profileFormSubmitted from './signals/profileFormSubmitted'
import emailFormSubmitted from './signals/emailFormSubmitted'
import passwordFormSubmitted from './signals/passwordFormSubmitted'

export default (module) => {
  return {
    signals: {
      profileFormSubmitted,
      emailFormSubmitted,
      passwordFormSubmitted
    },

    state: {
      currentTab: 'profile',
      profileForm: {
        nickname: {
          value: '',
          validationRules: ['minLength:3'],
          isRequired: true
        },
        showErrors: false,
        isLoading: false
      },
      emailForm: {
        password: {
          value: '',
          validationRules: ['minLength:5'],
          isRequired: true
        },
        email: {
          value: '',
          validationRules: ['isEmail'],
          isRequired: true
        },
        showErrors: false,
        isLoading: false
      },
      passwordForm: {
        currentPassword: {
          value: '',
          validationRules: ['minLength:5'],
          isRequired: true
        },
        password: {
          value: '',
          validationRules: ['minLength:5'],
          isRequired: true
        },
        confirmPassword: {
          value: '',
          validationRules: ['equalsField:password'],
          isRequired: true
        },
        showErrors: false,
        isLoading: false
      }
    }
  }
}
