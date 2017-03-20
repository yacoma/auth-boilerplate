import test from 'ava'
import {runAction} from 'cerebral/test'
import removeUser from './removeUser'

test('should remove user state', t => {
  return runAction(removeUser, {
    state: {
      user: {
        email: 'admin@example.com',
        nickname: 'Admin',
        language: '',
        isAdmin: true,
        isLoggedIn: true,
        token: {},
        api: {
          '@id': '/users/1',
          '@type': '/users'
        }
      }
    }
  })
  .then(({state}) => [
    t.false(state.user.isLoggedIn),
    t.deepEqual(state.user.api, {}),
    t.deepEqual(state.user.token, {}),
    t.is(state.user.email, ''),
    t.is(state.user.nickname, ''),
    t.is(state.user.language, ''),
    t.false(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), null)
  ])
})
