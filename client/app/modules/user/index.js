import { Module } from 'cerebral'

import * as sequences from './sequences'

export default urlParams => {
  return Module({
    signals: {
      fieldChanged: sequences.changeField,
      loginFormSubmitted: sequences.signinUser,
      registerFormSubmitted: sequences.registerUser,
      emailFormSubmitted: sequences.requestPasswordReset,
      passwordFormSubmitted: sequences.updatePassword,
      logoutButtonClicked: sequences.logoutUser,
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
  })
}
