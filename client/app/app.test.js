import test from 'ava'
import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '.'
import { AuthenticationError } from './errors'
import * as constants from './test_constants'

let cerebral

test.beforeEach(t => {
  mock.setup()
  localStorage.removeItem('jwtHeader')
})

test.serial('should authenticate when valid token in localStorage', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(constants.userJwtHeader))
  cerebral = CerebralTest(app({ flash: null, flashType: null }))
  return cerebral
    .runSignal('appMounted')
    .then(({ state }) => [
      t.true(state.user.authenticated),
      t.is(state.user.nickname, 'Tester'),
    ])
})

test.serial(
  'should refresh token when expired token and refresh allowed',
  t => {
    localStorage.setItem(
      'jwtHeader',
      JSON.stringify(constants.expiredRefreshableJwtHeader)
    )
    cerebral = CerebralTest(app({ flash: null, flashType: null }))

    mock.get('/api/refresh', (req, res) => {
      return res
        .status(200)
        .header('Content-Type', 'application/json')
        .header('Authorization', constants.validJwtHeader)
    })

    return cerebral
      .runSignal('appMounted')
      .then(({ state }) => [
        t.true(state.user.authenticated),
        t.is(state.user.nickname, 'Tester'),
      ])
  }
)

test.serial(
  'unauthenticated route to private should redirect to login',
  async t => {
    cerebral = CerebralTest(app({ flash: null, flashType: null }), {
      throwToConsole: false,
    })
    const error = await t.throws(
      cerebral.runSignal('pageRouted', { page: 'private' }),
      AuthenticationError
    )

    t.is(error.message, 'You must log in to view this page')
    t.is(cerebral.getState('currentPage'), 'login')
    t.is(cerebral.getState('lastVisited'), 'private')
  }
)

test.serial(
  'unauthenticated route to settings should redirect to login',
  async t => {
    cerebral = CerebralTest(app({ flash: null, flashType: null }), {
      throwToConsole: false,
    })
    const error = await t.throws(
      cerebral.runSignal('settingsRouted', { tab: 'email' }),
      AuthenticationError
    )

    t.is(error.message, 'You must log in to view this page')
    t.is(cerebral.getState('currentPage'), 'login')
    t.is(cerebral.getState('lastVisited'), 'settings')
  }
)

test.serial(
  'unauthenticated route to admin should redirect to login',
  async t => {
    cerebral = CerebralTest(app({ flash: null, flashType: null }), {
      throwToConsole: false,
    })
    const error = await t.throws(
      cerebral.runSignal('pageRouted', { page: 'admin' }),
      AuthenticationError
    )

    t.is(error.message, 'You need Admin permissions to view this page')
    t.is(cerebral.getState('currentPage'), 'login')
    t.is(cerebral.getState('lastVisited'), 'admin')
  }
)

test.serial(
  'route to admin should redirect to login when not isAdmin',
  async t => {
    localStorage.setItem('jwtHeader', JSON.stringify(constants.userJwtHeader))
    cerebral = CerebralTest(app({ flash: null, flashType: null }), {
      throwToConsole: false,
    })

    const error = await t.throws(
      cerebral.runSignal('pageRouted', { page: 'admin' }),
      AuthenticationError
    )

    t.is(error.message, 'You need Admin permissions to view this page')
    t.is(cerebral.getState('currentPage'), 'login')
    t.is(cerebral.getState('lastVisited'), 'admin')
  }
)

test.serial('route to admin should work when isAdmin', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(constants.adminJwtHeader))
  cerebral = CerebralTest(app({ flash: null, flashType: null }))

  return cerebral
    .runSignal('pageRouted', { page: 'admin' })
    .then(({ state }) => [
      t.true(state.user.authenticated),
      t.true(state.user.isAdmin),
      t.is(state.currentPage, 'admin'),
      t.is(state.lastVisited, 'admin'),
    ])
})
