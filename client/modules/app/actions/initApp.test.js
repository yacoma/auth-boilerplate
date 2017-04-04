import test from 'ava'
import StorageProvider from 'cerebral-provider-storage'
import {runAction} from 'cerebral/test'
import initApp from './initApp'

test('should initialize app state', t => {
  const jwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJsYW5ndWFnZSI6IiIsIm5vbmNlIjoiOTFlNzg3Z' +
    'jhhZTllNGE2YTllMzM3NTUzMWNhZTQ5YWMiLCJzdWIiOiJhZG1pbkBleGFtcGxlLm' +
    'NvbSIsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV9.lE' +
    'TPoIBVbyZ3XUPzGIstyzNx8SNg9SQYJNCfKFynWiA'
  )

  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

  return runAction(initApp, {
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
    providers: [
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
