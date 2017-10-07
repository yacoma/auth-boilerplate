import test from 'ava'
import mock from 'xhr-mock'
import uuid from 'uuid'
import { provide } from 'cerebral'
import StorageModule from '@cerebral/storage'
import HttpProvider from '@cerebral/http'
import { CerebralTest } from 'cerebral/test'

import Admin from '.'
import App from '../app'
import User from '../user'

const jwtHeader =
  'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
  'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
  'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIj' +
  'p0cnVlfQ.anr0ZkRErPzXT0DAhLjSegaC9vpK7u2FgqETzEg-h-A'

let cerebral

test.beforeEach(t => {
  mock.setup()
  localStorage.removeItem('jwtHeader')
  cerebral = CerebralTest({
    modules: {
      admin: Admin,
      app: App({ flash: null, flashType: null }),
      user: User({ '@id': null }),
      storage: StorageModule({ target: localStorage }),
    },
    providers: [
      provide('uuid', uuid),
      HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
          Authorization: jwtHeader,
        },
      }),
    ],
  })

  cerebral.setState('admin.users.testuid000', {
    '@id': '/users/1',
    nickname: 'TestAdmin',
    toggleAdminIsLoading: false,
    isAdmin: false,
  })
  cerebral.setState('admin.currentPage', 3)
  cerebral.setState('admin.pages', 5)
})

test.serial('isAdmin should toggle', t => {
  mock.put('/api/users/1', (req, res) => {
    return res.status(200).header('Content-Type', 'application/json')
  })

  return cerebral
    .runSignal('admin.toggleAdminClicked', { uid: 'testuid000' })
    .then(({ state }) => [
      t.false(state.admin.users.testuid000.toggleAdminIsLoading),
      t.true(state.admin.users.testuid000.isAdmin),
    ])
})

test('should switch to previous page', t => {
  return cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'previous' })
    .then(({ state }) => [t.is(state.admin.currentPage, 2)])
})

test('should switch to next page', t => {
  return cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'next' })
    .then(({ state }) => [t.is(state.admin.currentPage, 4)])
})

test('should switch to first page', t => {
  return cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'first' })
    .then(({ state }) => [t.is(state.admin.currentPage, 1)])
})

test('should switch to last page', t => {
  return cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'last' })
    .then(({ state }) => [t.is(state.admin.currentPage, 5)])
})

test('should switch to specified page', t => {
  return cerebral
    .runSignal('admin.changePageClicked', { nextPage: 2 })
    .then(({ state }) => [t.is(state.admin.currentPage, 2)])
})

test('should switch sorting order', t => {
  return cerebral
    .runSignal('admin.sortUsersClicked', { sortBy: 'nickname' })
    .then(({ state }) => [
      t.is(state.admin.usersSortBy, 'nickname'),
      t.is(state.admin.usersSortDir, 'descending'),
    ])
})

test.serial('should change sorting row', t => {
  return cerebral
    .runSignal('admin.sortUsersClicked', { sortBy: 'email' })
    .then(({ state }) => [
      t.is(state.admin.usersSortBy, 'email'),
      t.is(state.admin.usersSortDir, 'ascending'),
    ])
})
