import test from 'ava'
import { runSignal } from 'cerebral/test'

import routeTo from './routeTo'

test('should route to home', t => {
  return runSignal(routeTo('home'), {
    state: { lastVisited: 'private' },
  }).then(({ state }) => [
    t.is(state.currentPage, 'home'),
    t.is(state.lastVisited, 'home'),
    t.is(state.headerText, 'Auth Boilerplate'),
    t.is(state.headerIcon, null),
  ])
})

test('route to login should not change lastVisited', t => {
  return runSignal(routeTo('login'), {
    state: { lastVisited: 'private' },
  }).then(({ state }) => [
    t.is(state.currentPage, 'login'),
    t.is(state.lastVisited, 'private'),
    t.is(state.headerText, 'Log in your account'),
    t.is(state.headerIcon, 'user'),
  ])
})

test('route to register should not change lastVisited', t => {
  return runSignal(routeTo('register'), {
    state: { lastVisited: 'private' },
  }).then(({ state }) => [
    t.is(state.currentPage, 'register'),
    t.is(state.lastVisited, 'private'),
    t.is(state.headerText, 'Create account'),
    t.is(state.headerIcon, 'user'),
  ])
})

test('route to private should set header title', t => {
  return runSignal(routeTo('private'), {
    state: {
      user: {
        authenticated: true,
        nickname: 'Test',
      },
    },
  }).then(({ state }) => [
    t.is(state.currentPage, 'private'),
    t.is(state.lastVisited, 'private'),
    t.is(state.headerText, 'Hello Test!'),
    t.is(state.headerIcon, null),
  ])
})

test('newpassword with passed @id should route to newpassword', t => {
  return runSignal(routeTo('newpassword'), {
    state: {
      user: {
        authenticated: false,
        api: {
          '@id': '/users/1',
        },
      },
    },
  }).then(({ state }) => [
    t.is(state.currentPage, 'newpassword'),
    t.is(state.headerText, 'New Password'),
    t.is(state.headerIcon, 'user'),
  ])
})

test('settings should set currentTab and nickname', t => {
  return runSignal(routeTo('settings', 'email'), {
    state: {
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
    t.is(state.currentPage, 'settings'),
    t.is(state.lastVisited, 'settings'),
    t.is(state.settings.currentTab, 'email'),
    t.is(state.settings.profileForm.nickname.value, 'Test'),
    t.is(state.headerText, "Test's settings"),
    t.is(state.headerIcon, 'user'),
  ])
})
