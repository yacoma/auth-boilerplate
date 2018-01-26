import test from 'ava'
import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '../..'
import { authHeader } from '../../test_constants'

let cerebral

test.beforeEach(t => {
  mock.setup()
  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.userJwt))
  cerebral = CerebralTest(app({ flash: null, flashType: null }))

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
