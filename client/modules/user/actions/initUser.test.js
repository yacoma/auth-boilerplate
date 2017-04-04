import test from 'ava'
import HttpProvider from 'cerebral-provider-http'
import StorageProvider from 'cerebral-provider-storage'
import {runAction} from 'cerebral/test'
import initUser from './initUser'

test('should initialize user state', t => {
  const jwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJsYW5ndWFnZSI6IiIsIm5vbmNlIjoiOTFlNzg3Z' +
    'jhhZTllNGE2YTllMzM3NTUzMWNhZTQ5YWMiLCJzdWIiOiJhZG1pbkBleGFtcGxlLm' +
    'NvbSIsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV9.lE' +
    'TPoIBVbyZ3XUPzGIstyzNx8SNg9SQYJNCfKFynWiA'
  )

  return runAction(initUser, {
    state: {
      user: {
        email: '',
        nickname: '',
        language: '',
        isAdmin: false,
        isLoggedIn: false,
        token: {},
        api: {}
      }
    },
    props: {
      headers: {
        authorization: jwtHeader
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
    t.true(state.user.isLoggedIn),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'admin@example.com'),
    t.is(state.user.nickname, 'Admin'),
    t.is(state.user.language, ''),
    t.true(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"')
  ])
})
