import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '.'
import { AuthenticationError } from './errors'

let cerebral

beforeEach(() => {
  mock.setup()
  localStorage.removeItem('jwtHeader')
})

test('should authenticate when valid token in localStorage', async () => {
  expect.assertions(2)

  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.userJwt))
  cerebral = CerebralTest(app({ flash: null, flashType: null }))
  await cerebral
    .runSignal('appMounted')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(true),
      expect(state.user.nickname).toBe('Tester'),
    ])
})

test('should refresh token when expired token and refresh allowed', async () => {
  expect.assertions(2)

  localStorage.setItem(
    'jwtHeader',
    JSON.stringify(authHeader.expiredRefreshableJwt)
  )
  cerebral = CerebralTest(app({ flash: null, flashType: null }))

  mock.get('/api/refresh', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', authHeader.validJwt)
  })

  await cerebral
    .runSignal('appMounted')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(true),
      expect(state.user.nickname).toBe('Tester'),
    ])
})

test('unauthenticated route to private should redirect to login', async () => {
  expect.assertions(3)

  cerebral = CerebralTest(app({ flash: null, flashType: null }))
  await expect(
    cerebral.runSignal('pageRouted', { page: 'private' })
  ).rejects.toEqual(
    new AuthenticationError('You must log in to view this page')
  )
  expect(cerebral.getState('lastVisited')).toBe('private')
  expect(cerebral.getState('currentPage')).toBe('login')
})

test('unauthenticated route to settings should redirect to login', async () => {
  expect.assertions(3)

  cerebral = CerebralTest(app({ flash: null, flashType: null }))
  await expect(
    cerebral.runSignal('settingsRouted', { tab: 'email' })
  ).rejects.toEqual(
    new AuthenticationError('You must log in to view this page')
  )
  expect(cerebral.getState('currentPage')).toBe('login')
  expect(cerebral.getState('lastVisited')).toBe('settings')
})

test('unauthenticated route to admin should redirect to login', async () => {
  expect.assertions(3)

  cerebral = CerebralTest(app({ flash: null, flashType: null }))
  await expect(
    cerebral.runSignal('pageRouted', { page: 'admin' })
  ).rejects.toEqual(
    new AuthenticationError('You need Admin permissions to view this page')
  )
  expect(cerebral.getState('currentPage')).toBe('login')
  expect(cerebral.getState('lastVisited')).toBe('admin')
})

test('route to admin should redirect to login when not isAdmin', async () => {
  expect.assertions(3)

  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.userJwt))
  cerebral = CerebralTest(app({ flash: null, flashType: null }))

  await expect(
    cerebral.runSignal('pageRouted', { page: 'admin' })
  ).rejects.toEqual(
    new AuthenticationError('You need Admin permissions to view this page')
  )
  expect(cerebral.getState('currentPage')).toBe('login')
  expect(cerebral.getState('lastVisited')).toBe('admin')
})

test('route to admin should work when isAdmin', async () => {
  expect.assertions(4)

  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.adminJwt))
  cerebral = CerebralTest(app({ flash: null, flashType: null }))

  const result = await cerebral.runSignal('pageRouted', { page: 'admin' })
  expect(result.state.user.authenticated).toEqual(true)
  expect(result.state.user.isAdmin).toBe(true)
  expect(result.state.currentPage).toBe('admin')
  expect(result.state.lastVisited).toBe('admin')
})
