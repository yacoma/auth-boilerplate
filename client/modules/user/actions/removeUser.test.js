import test from 'ava'
import HttpProvider from 'cerebral-provider-http'
import StorageProvider from 'cerebral-provider-storage'
import {runAction} from 'cerebral/test'
import removeUser from './removeUser'

test('should remove user state', t => {
  const jwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJsYW5ndWFnZSI6IiIsIm5vbmNlIjoiOTFlNzg3Z' +
    'jhhZTllNGE2YTllMzM3NTUzMWNhZTQ5YWMiLCJzdWIiOiJhZG1pbkBleGFtcGxlLm' +
    'NvbSIsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV9.lE' +
    'TPoIBVbyZ3XUPzGIstyzNx8SNg9SQYJNCfKFynWiA'
  )

  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

  return runAction(removeUser, {
    state: {
      user: {
        email: 'admin@example.com',
        nickname: 'Admin',
        isAdmin: true,
        isLoggedIn: true,
        token: {},
        api: {
          '@id': '/users/1'
        }
      }
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
  .then(({state}) => [
    t.false(state.user.isLoggedIn),
    t.deepEqual(state.user.api, {}),
    t.deepEqual(state.user.token, {}),
    t.is(state.user.email, ''),
    t.is(state.user.nickname, ''),
    t.false(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), null)
  ])
})
