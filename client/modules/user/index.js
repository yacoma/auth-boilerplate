import {form, changeField} from 'cerebral-forms'

import loginFormSubmitted from './signals/loginFormSubmitted'
import registerFormSubmitted from './signals/registerFormSubmitted'
import emailFormSubmitted from './signals/emailFormSubmitted'
import passwordFormSubmitted from './signals/passwordFormSubmitted'
import logoutButtonClicked from './signals/logoutButtonClicked'

export default (module) => {
  let uid = null
  const location = window.location
  const urlParams = new URLSearchParams(location.search)
  let urlParamsChanged = false
  if (urlParams.has('@id')) {
    uid = decodeURIComponent(urlParams.get('@id'))
    urlParams.delete('@id')
  }
  if (urlParamsChanged) {
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`)
  }

  return {
    signals: {
      fieldChanged: changeField,
      loginFormSubmitted,
      registerFormSubmitted,
      emailFormSubmitted,
      passwordFormSubmitted,
      logoutButtonClicked
    },

    state: {
      email: '',
      nickname: '',
      language: '',
      isAdmin: false,
      isLoggedIn: false,
      token: {},
      api: {
        '@id': uid
      },
      signIn: form({
        email: {
          value: '',
          validationRules: ['isEmail'],
          validationMessages: ['Not valid email'],
          isRequired: true,
          requiredMessage: 'Email is required'
        },
        password: {
          value: '',
          validationRules: ['minLength:5'],
          validationMessages: ['Too short'],
          isRequired: true,
          requiredMessage: 'Password is required'
        },
        showErrors: false,
        validationError: null,
        isLoading: false
      }),
      register: form({
        nickname: {
          value: '',
          validationRules: ['minLength:3'],
          validationMessages: ['Too short'],
          isRequired: true,
          requiredMessage: 'Nickname is required'
        },
        email: {
          value: '',
          validationRules: ['isEmail'],
          validationMessages: ['Not valid email'],
          isRequired: true,
          requiredMessage: 'Email is required'
        },
        password: {
          value: '',
          validationRules: ['minLength:5'],
          validationMessages: ['Too short'],
          dependsOn: 'user.register.confirmPassword',
          isRequired: true,
          requiredMessage: 'Password is required'
        },
        confirmPassword: {
          value: '',
          validationRules: ['equalsField:password'],
          validationMessages: ['Not equal to password'],
          dependsOn: 'user.register.password',
          isRequired: true,
          requiredMessage: 'You must confirm password'
        },
        showErrors: false,
        validationError: null,
        isLoading: false
      }),
      emailForm: form({
        email: {
          value: '',
          validationRules: ['isEmail'],
          validationMessages: ['Not valid email'],
          isRequired: true,
          requiredMessage: 'Email is required'
        },
        showErrors: false,
        validationError: null,
        isLoading: false
      }),
      passwordForm: form({
        password: {
          value: '',
          validationRules: ['minLength:5'],
          validationMessages: ['Too short'],
          dependsOn: 'user.passwordForm.confirmPassword',
          isRequired: true,
          requiredMessage: 'Password is required'
        },
        confirmPassword: {
          value: '',
          validationRules: ['equalsField:password'],
          validationMessages: ['Not equal to password'],
          dependsOn: 'user.passwordForm.password',
          isRequired: true,
          requiredMessage: 'You must confirm password'
        },
        showErrors: false,
        validationError: null,
        isLoading: false
      })
    }
  }
}
