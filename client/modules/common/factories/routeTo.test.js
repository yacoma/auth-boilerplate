import test from 'ava'
import StorageProvider from '@cerebral/storage'
import { runAction } from 'cerebral/test'
import routeTo from './routeTo'
import App from '../../app'

test('should route to home', t => {
  return runAction(routeTo('home'), {
    state: { app: { lastVisited: 'private' } },
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'home'),
    t.is(state.app.lastVisited, 'home'),
    t.is(state.app.headerText, 'Auth Boilerplate'),
    t.is(state.app.headerIcon, null),
  ])
})

test('route to login should not change lastVisited', t => {
  return runAction(routeTo('login'), {
    state: { app: { lastVisited: 'private' } },
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'login'),
    t.is(state.app.lastVisited, 'private'),
    t.is(state.app.headerText, 'Log in your account'),
    t.is(state.app.headerIcon, 'user'),
  ])
})

test('route to register should not change lastVisited', t => {
  return runAction(routeTo('register'), {
    state: { app: { lastVisited: 'private' } },
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'register'),
    t.is(state.app.lastVisited, 'private'),
    t.is(state.app.headerText, 'Create account'),
    t.is(state.app.headerIcon, 'user'),
  ])
})

test('route to private should set header title', t => {
  return runAction(routeTo('private'), {
    state: {
      app: {},
      user: {
        authenticated: true,
        nickname: 'Test',
      },
    },
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'private'),
    t.is(state.app.lastVisited, 'private'),
    t.is(state.app.headerText, 'Hello Test!'),
    t.is(state.app.headerIcon, null),
  ])
})

test('route to newpassword should redirect to home', t => {
  return runAction(routeTo('newpassword'), {
    state: {
      app: {},
      user: {
        authenticated: false,
        api: {},
      },
    },
    modules: {
      app: App({ flash: null, flashType: null }),
    },
    providers: [StorageProvider({ target: localStorage })],
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'home'),
    t.not(state.app.lastVisited, 'newpassword'),
  ])
})

test('route to newpassword when user authenticated should redirect to home', t => {
  return runAction(routeTo('newpassword'), {
    state: {
      app: {},
      user: {
        authenticated: true,
        api: {
          '@id': '/users/1',
        },
      },
    },
    modules: {
      app: App({ flash: null, flashType: null }),
    },
    providers: [StorageProvider({ target: localStorage })],
  }).then(({ state }) => [t.is(state.app.currentPage, 'home')])
})

test('newpassword with passed @id should route to newpassword', t => {
  return runAction(routeTo('newpassword'), {
    state: {
      app: {},
      user: {
        authenticated: false,
        api: {
          '@id': '/users/1',
        },
      },
    },
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'newpassword'),
    t.is(state.app.headerText, 'New Password'),
    t.is(state.app.headerIcon, 'user'),
  ])
})

test('settings should set currentTab and nickname', t => {
  return runAction(routeTo('settings', 'email'), {
    state: {
      app: {},
      settings: {
        currentTab: 'profile',
        profileForm: {
          nickname: {
            value: '',
          },
        },
      },
      user: {
        authenticated: true,
        nickname: 'Test',
      },
    },
  }).then(({ state }) => [
    t.is(state.app.currentPage, 'settings'),
    t.is(state.app.lastVisited, 'settings'),
    t.is(state.settings.currentTab, 'email'),
    t.is(state.settings.profileForm.nickname.value, 'Test'),
    t.is(state.app.headerText, "Test's settings"),
    t.is(state.app.headerIcon, 'user'),
  ])
})
