import test from 'ava'
import StorageProvider from 'cerebral-provider-storage'
import {runAction} from 'cerebral/test'
import redirect from './redirect'
import App from '../../app'

test('should redirect to home', t => {
  return runAction(redirect('home'), {
    state: {
      app: {},
    },
    modules: {
      app: App({flash: null, flashType: null}),
    },
    providers: [StorageProvider({target: localStorage})],
  }).then(({state}) => [
    t.is(state.app.currentPage, 'home'),
    t.is(state.app.lastVisited, 'home'),
    t.is(state.app.headerText, 'Auth Boilerplate'),
    t.is(state.app.headerIcon, null),
  ])
})

test('should redirect to settings email tab', t => {
  return runAction(redirect('settings', 'email'), {
    state: {
      app: {
        currentPage: 'private',
        lastVisited: 'private',
      },
      user: {
        nickname: 'Test',
        email: 'test@example.com',
        authenticated: true,
        isAdmin: false,
      },
      settings: {
        currentTab: 'profile',
        profileForm: {
          nickname: {value: ''},
        },
      },
    },
    modules: {
      app: App({flash: null, flashType: null}),
    },
    providers: [StorageProvider({target: localStorage})],
  }).then(({state}) => [
    t.is(state.app.currentPage, 'settings'),
    t.is(state.settings.currentTab, 'email'),
    t.is(state.app.lastVisited, 'settings'),
    t.is(state.app.headerText, "Test's settings"),
    t.is(state.app.headerIcon, 'user'),
  ])
})
