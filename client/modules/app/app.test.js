import test from 'ava'
import {CerebralTest} from 'cerebral/test'

import App from '.'
import User from '../user'

let cerebral

test.beforeEach(t => {
  cerebral = CerebralTest({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': null})
    }
  })
})

test('page should route to home', t => {
  return cerebral.runSignal('app.pageRouted', {page: 'home'})
    .then(({state}) => [
      t.is(state.app.currentPage, 'home'),
      t.is(state.app.lastVisited, 'home'),
      t.false(state.user.isLoggedIn)
    ])
})

test('route to login should not change lastVisited', t => {
  return cerebral.runSignal('app.pageRouted', {page: 'login'})
    .then(({state}) => [
      t.is(state.app.currentPage, 'login'),
      t.not(state.app.lastVisited, 'login')
    ])
})

test('route to register should not change lastVisited', t => {
  return cerebral.runSignal('app.pageRouted', {page: 'register'})
    .then(({state}) => [
      t.is(state.app.currentPage, 'register'),
      t.not(state.app.lastVisited, 'register')
    ])
})

test('route to private should redirect to login', t => {
  return cerebral.runSignal('app.pageRouted', {page: 'private'})
    .then(({state}) => [
      t.false(state.user.isLoggedIn),
      t.is(state.app.currentPage, 'login'),
      t.is(state.app.lastVisited, 'private'),
      t.is(state.app.flash, 'You must log in to view this page'),
      t.is(state.app.flashType, 'info')
    ])
})

test('route to newpassword should redirect to login', t => {
  return cerebral.runSignal('app.pageRouted', {page: 'newpassword'})
    .then(({state}) => [
      t.is(state.user.api['@id'], null),
      t.is(state.app.currentPage, 'login'),
      t.not(state.app.lastVisited, 'newpassword'),
      t.is(state.app.flash, null),
      t.is(state.app.flashType, null)
    ])
})

test('route to newpassword with passed @id', t => {
  cerebral = CerebralTest({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': '/user/1'})
    }
  })

  return cerebral.runSignal('app.pageRouted', {page: 'newpassword'})
    .then(({state}) => [
      t.is(state.user.api['@id'], '/user/1'),
      t.is(state.app.currentPage, 'newpassword'),
      t.not(state.app.lastVisited, 'newpassword')
    ])
})
