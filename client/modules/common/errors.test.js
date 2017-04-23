/* eslint-env mocha */
import test from 'ava'
import {AuthenticationError} from './errors'

test('should instanciate AuthenticationError', t => {
  const error = new AuthenticationError('User could not be authenticated')

  t.true(error instanceof Error)
  t.is(error.name, 'AuthenticationError')
  t.is(error.message, 'User could not be authenticated')
  t.truthy(error.stack)
  t.is(error.toJSON().name, 'AuthenticationError')
  t.is(error.toJSON().message, 'User could not be authenticated')
  t.truthy(error.toJSON().stack)
})

test('should have empty message', t => {
  const error = new AuthenticationError()

  t.true(error instanceof Error)
  t.is(error.name, 'AuthenticationError')
  t.is(error.message, '')
  t.truthy(error.stack)
  t.is(error.toJSON().name, 'AuthenticationError')
  t.is(error.toJSON().message, '')
  t.truthy(error.toJSON().stack)
})

test('should extend AuthenticationError', t => {
  class CustomAuthenticationError extends AuthenticationError {
    constructor(message) {
      super(message)
      this.name = 'CustomAuthenticationError'
    }
  }

  const error = new CustomAuthenticationError(
    'Admin could not be authenticated'
  )

  t.true(error instanceof Error)
  t.true(error instanceof AuthenticationError)
  t.is(error.name, 'CustomAuthenticationError')
  t.is(error.message, 'Admin could not be authenticated')
  t.truthy(error.stack)
  t.is(error.toJSON().name, 'CustomAuthenticationError')
  t.is(error.toJSON().message, 'Admin could not be authenticated')
  t.truthy(error.toJSON().stack)
})
