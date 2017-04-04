import test from 'ava'
import mock from 'xhr-mock'
import StorageProvider from 'cerebral-provider-storage'
import HttpProvider from 'cerebral-provider-http'
import {CerebralTest} from 'cerebral/test'

import App from '.'
import User from '../user'

const jwtHeader = (
  'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
  'Im5pY2tuYW1lIjoiQWRtaW4iLCJsYW5ndWFnZSI6IiIsIm5vbmNlIjoiOTFlNzg3Z' +
  'jhhZTllNGE2YTllMzM3NTUzMWNhZTQ5YWMiLCJzdWIiOiJhZG1pbkBleGFtcGxlLm' +
  'NvbSIsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV9.lE' +
  'TPoIBVbyZ3XUPzGIstyzNx8SNg9SQYJNCfKFynWiA'
)

let cerebral

test.beforeEach(t => {
  mock.setup()
  localStorage.removeItem('jwtHeader')
  cerebral = CerebralTest({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': null})
    },
    providers: [
      HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': jwtHeader
        }
      }),
      StorageProvider({target: localStorage})
    ]
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
      t.is(state.app.flash, 'You must log in to change your password'),
      t.is(state.app.flashType, 'info')
    ])
})

test('route to newpassword with passed @id', t => {
  cerebral = CerebralTest({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': '/user/1'})
    },
    providers: [
      HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': jwtHeader
        }
      }),
      StorageProvider({target: localStorage})
    ]

  })

  return cerebral.runSignal('app.pageRouted', {page: 'newpassword'})
    .then(({state}) => [
      t.is(state.user.api['@id'], '/user/1'),
      t.is(state.app.currentPage, 'newpassword'),
      t.not(state.app.lastVisited, 'newpassword')
    ])
})

test('should login when valid token in localStorage', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))
  return cerebral.runSignal('app.pageRouted', {page: 'private'})
    .then(({state}) => [
      t.is(state.app.currentPage, 'private'),
      t.is(state.app.lastVisited, 'private'),
      t.true(state.user.isLoggedIn)
    ])
})

test('should refresh token when expired token and refresh allowed', t => {
  const expiredJwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkB' +
    'leGFtcGxlLmNvbSIsImxhbmd1YWdlIjoiIiwidWlkIjoiL3VzZXJzLzEiLCJ' +
    'pc0FkbWluIjp0cnVlLCJleHAiOjE0OTA5OTYxMzQuMCwibmlja25hbWUiOiJ' +
    'BZG1pbiIsIm5vbmNlIjoiOTFlNzg3ZjhhZTllNGE2YTllMzM3NTUzMWNhZTQ' +
    '5YWMifQ.wxNIdqI__6j6OlrqWp9ftn_hxhS7ANmTGefTzldzjQ0'
  )

  const returnJwtHeader = (
    'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6IkF' +
    'kbWluIiwibm9uY2UiOiI3NzY0N2YxODQzZDI0MDkxYTA0MmQzYzY1ZWM3OTd' +
    'jOSIsImxhbmd1YWdlIjoiIiwiZXhwIjoxNDkxMjYwNDYxLCJ1aWQiOiIvdXN' +
    'lcnMvMSIsInN1YiI6ImFkbWluQGV4YW1wbGUuY29tIiwiaXNBZG1pbiI6dHJ' +
    '1ZX0.NkXoo_ryOyvuybbx8zXwlxrGI44XWflifMpufQu_4xk'
  )

  localStorage.setItem('jwtHeader', JSON.stringify(expiredJwtHeader))

  cerebral = CerebralTest({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': null})
    },
    providers: [
      HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': expiredJwtHeader
        }
      }),
      StorageProvider({target: localStorage})
    ]
  })

  mock.post('/api/refresh', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', returnJwtHeader)
  })

  return cerebral.runSignal('app.pageRouted', {page: 'home'})
    .then(({state}) => [
      t.is(state.app.currentPage, 'home'),
      t.is(state.app.lastVisited, 'home'),
      t.true(state.user.isLoggedIn),
      t.true(state.user.nickname, 'Admin')
    ])
})
