import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '../..'

let cerebral

beforeEach(() => {
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

test('isAdmin should toggle', async () => {
  expect.assertions(2)

  mock.put('/api/users/1', (req, res) => {
    return res.status(200).header('Content-Type', 'application/json')
  })

  await cerebral
    .runSignal('admin.toggleAdminClicked', { uid: 'testuid000' })
    .then(({ state }) => [
      expect(state.admin.users.testuid000.toggleAdminIsLoading).toBe(false),
      expect(state.admin.users.testuid000.isAdmin).toBe(true),
    ])
})

test('should switch to previous page', async () => {
  expect.assertions(1)

  await cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'previous' })
    .then(({ state }) => [expect(state.admin.currentPage).toBe(2)])
})

test('should switch to next page', async () => {
  expect.assertions(1)

  await cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'next' })
    .then(({ state }) => [expect(state.admin.currentPage).toBe(4)])
})

test('should switch to first page', async () => {
  expect.assertions(1)

  await cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'first' })
    .then(({ state }) => [expect(state.admin.currentPage).toBe(1)])
})

test('should switch to last page', async () => {
  expect.assertions(1)

  await cerebral
    .runSignal('admin.changePageClicked', { nextPage: 'last' })
    .then(({ state }) => [expect(state.admin.currentPage).toBe(5)])
})

test('should switch to specified page', async () => {
  expect.assertions(1)

  await cerebral
    .runSignal('admin.changePageClicked', { nextPage: 2 })
    .then(({ state }) => [expect(state.admin.currentPage).toBe(2)])
})

test('should switch sorting order', async () => {
  expect.assertions(2)

  await cerebral
    .runSignal('admin.sortUsersClicked', { sortBy: 'nickname' })
    .then(({ state }) => [
      expect(state.admin.usersSortBy).toBe('nickname'),
      expect(state.admin.usersSortDir).toBe('descending'),
    ])
})

test('should change sorting row', async () => {
  expect.assertions(2)

  await cerebral
    .runSignal('admin.sortUsersClicked', { sortBy: 'email' })
    .then(({ state }) => [
      expect(state.admin.usersSortBy).toBe('email'),
      expect(state.admin.usersSortDir).toBe('ascending'),
    ])
})
