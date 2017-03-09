import {test} from 'tap'
import {runAction} from 'cerebral/test'
import removeUser from './removeUser'

test('should remove user state', test => {
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
    test.equal(state.user.isLoggedIn, false),
    test.same(state.user.api, {}),
    test.same(state.user.token, {}),
    test.equal(state.user.email, ''),
    test.equal(state.user.nickname, ''),
    test.equal(state.user.language, ''),
    test.equal(state.user.isAdmin, false)
  ])
})
