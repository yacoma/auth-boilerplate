import {form, changeField} from 'cerebral-forms'

import signIn from './chains/signIn'
import register from './chains/register'
import logOut from './chains/logOut'

export default {
  state: {
    email: '',
    nickname: '',
    language: '',
    isAdmin: false,
    isLoggedIn: false,
    token: {},
    api: {},
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
      integrityError: null,
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
      integrityError: null,
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
      integrityError: null,
      isLoading: false
    })
  },

  signals: {
    fieldChanged: changeField,
    loginFormSubmitted: signIn,
    registerFormSubmitted: register,
    logoutButtonClicked: logOut
  }
}
