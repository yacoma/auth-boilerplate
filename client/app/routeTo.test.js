import { runSignal } from 'cerebral/test'

import routeTo from './routeTo'

test('should route to home', () => {
  return runSignal(routeTo('home'), {
    state: { lastVisited: 'private' },
  }).then(({ state }) => [
    expect(state.currentPage).toBe('home'),
    expect(state.lastVisited).toBe('home'),
    expect(state.headerText).toBe('Auth Boilerplate'),
    expect(state.headerIcon).toBe(null),
  ])
})

test('route to login should not change lastVisited', () => {
  return runSignal(routeTo('login'), {
    state: { lastVisited: 'private' },
  }).then(({ state }) => [
    expect(state.currentPage).toBe('login'),
    expect(state.lastVisited).toBe('private'),
    expect(state.headerText).toBe('Log in your account'),
    expect(state.headerIcon).toBe('user'),
  ])
})

test('route to register should not change lastVisited', () => {
  return runSignal(routeTo('register'), {
    state: { lastVisited: 'private' },
  }).then(({ state }) => [
    expect(state.currentPage).toBe('register'),
    expect(state.lastVisited).toBe('private'),
    expect(state.headerText).toBe('Create account'),
    expect(state.headerIcon).toBe('user'),
  ])
})

test('route to private should set header title', () => {
  return runSignal(routeTo('private'), {
    state: {
      user: {
        authenticated: true,
        nickname: 'Test',
      },
    },
  }).then(({ state }) => [
    expect(state.currentPage).toBe('private'),
    expect(state.lastVisited).toBe('private'),
    expect(state.headerText).toBe('Hello {nickname}!'),
    expect(state.headerIcon).toBe(null),
  ])
})

test('newpassword with passed @id should route to newpassword', () => {
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
    expect(state.currentPage).toBe('newpassword'),
    expect(state.headerText).toBe('New Password'),
    expect(state.headerIcon).toBe('user'),
  ])
})

test('settings should set currentTab and nickname', () => {
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
    expect(state.currentPage).toBe('settings'),
    expect(state.lastVisited).toBe('settings'),
    expect(state.settings.currentTab).toBe('email'),
    expect(state.settings.profileForm.nickname.value).toBe('Test'),
    expect(state.headerText).toBe("{nickname}'s settings"),
    expect(state.headerIcon).toBe('user'),
  ])
})
