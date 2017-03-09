import t from 'tap'
import {RunSignal} from 'cerebral/test'

import App from '.'
import User from '../user'

t.test('test App module', function (t) {
  let runSignal
  t.beforeEach(function (done) {
    runSignal = RunSignal({
      modules: {
        app: App({'flash': null, 'flashType': null}),
        user: User({'@id': null})
      }
    })
    done()
  })

  t.test('page should route to home', function (t) {
    return runSignal('app.pageRouted', {page: 'home'})
      .then(({state}) => [
        t.equal(state.app.currentPage, 'home'),
        t.equal(state.app.lastVisited, 'home'),
        t.equal(state.user.isLoggedIn, false)
      ])
      .catch(t.threw)
      .then(t.end)
  })

  t.test('route to login should not change lastVisited', function (t) {
    return runSignal('app.pageRouted', {page: 'login'})
      .then(({state}) => [
        t.equal(state.app.currentPage, 'login'),
        t.notEqual(state.app.lastVisited, 'login')
      ])
      .catch(t.threw)
      .then(t.end)
  })

  t.test('route to register should not change lastVisited', function (t) {
    return runSignal('app.pageRouted', {page: 'register'})
      .then(({state}) => [
        t.equal(state.app.currentPage, 'register'),
        t.notEqual(state.app.lastVisited, 'register')
      ])
      .catch(t.threw)
      .then(t.end)
  })

  t.test('route to private should redirect to login', function (t) {
    return runSignal('app.pageRouted', {page: 'private'})
      .then(({state}) => [
        t.equal(state.user.isLoggedIn, false),
        t.equal(state.app.currentPage, 'login'),
        t.equal(state.app.lastVisited, 'private'),
        t.equal(state.app.flash, null),
        t.equal(state.app.flashType, null)
      ])
      .catch(t.threw)
      .then(t.end)
  })

  t.test('route to newpassword should redirect to login', function (t) {
    return runSignal('app.pageRouted', {page: 'newpassword'})
      .then(({state}) => [
        t.equal(state.user.api['@id'], null),
        t.equal(state.app.currentPage, 'login'),
        t.notEqual(state.app.lastVisited, 'newpassword'),
        t.equal(state.app.flash, null),
        t.equal(state.app.flashType, null)
      ])
      .catch(t.threw)
      .then(t.end)
  })
  t.end()
})

t.test('test App module with passed @id', function (t) {
  let runSignal
  t.beforeEach(function (done) {
    runSignal = RunSignal({
      modules: {
        app: App({'flash': null, 'flashType': null}),
        user: User({'@id': '/user/1'})
      }
    })
    done()
  })

  t.test('route to newpassword with passed @id', function (t) {
    return runSignal('app.pageRouted', {page: 'newpassword'})
      .then(({state}) => [
        t.equal(state.user.api['@id'], '/user/1'),
        t.equal(state.app.currentPage, 'newpassword'),
        t.notEqual(state.app.lastVisited, 'newpassword')
      ])
      .catch(t.threw)
      .then(t.end)
  })
  t.end()
})
