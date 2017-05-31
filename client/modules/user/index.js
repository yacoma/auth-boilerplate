import fieldChanged from './signals/fieldChanged'
import loginFormSubmitted from './signals/loginFormSubmitted'
import registerFormSubmitted from './signals/registerFormSubmitted'
import emailFormSubmitted from './signals/emailFormSubmitted'
import passwordFormSubmitted from './signals/passwordFormSubmitted'
import logoutButtonClicked from './signals/logoutButtonClicked'

export default urlParams => module => {
  return {
    signals: {
      fieldChanged,
      loginFormSubmitted,
      registerFormSubmitted,
      emailFormSubmitted,
      passwordFormSubmitted,
      logoutButtonClicked,
    },

    state: {
      email: '',
      nickname: '',
      isAdmin: false,
      authenticated: false,
      token: {},
      api: {
        '@id': urlParams['@id'],
      },
      loginForm: {
        email: {
          value: '',
          validationRules: ['isEmail'],
          isRequired: true,
        },
        password: {
          value: '',
          validationRules: ['minLength:5'],
          isRequired: true,
        },
        showErrors: false,
        isLoading: false,
      },
      registerForm: {
        nickname: {
          value: '',
          validationRules: ['minLength:3'],
          isRequired: true,
        },
        email: {
          value: '',
          validationRules: ['isEmail'],
          isRequired: true,
        },
        password: {
          value: '',
          validationRules: ['minLength:5'],
          isRequired: true,
        },
        confirmPassword: {
          value: '',
          validationRules: ['equalsField:user.registerForm.password'],
          isRequired: true,
        },
        showErrors: false,
        isLoading: false,
      },
      emailForm: {
        email: {
          value: '',
          validationRules: ['isEmail'],
          isRequired: true,
        },
        showErrors: false,
        isLoading: false,
      },
      passwordForm: {
        password: {
          value: '',
          validationRules: ['minLength:5'],
          isRequired: true,
        },
        confirmPassword: {
          value: '',
          validationRules: ['equalsField:user.passwordForm.password'],
          isRequired: true,
        },
        showErrors: false,
        isLoading: false,
      },
    },
  }
}
