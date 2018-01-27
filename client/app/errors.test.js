/* eslint-env mocha */
import { AuthenticationError } from './errors'

test('should instanciate AuthenticationError', () => {
  const error = new AuthenticationError('User could not be authenticated')

  expect(error instanceof Error).toBe(true)
  expect(error.name).toBe('AuthenticationError')
  expect(error.message).toBe('User could not be authenticated')
  expect(error.stack).toBeTruthy()
  expect(error.toJSON().name).toBe('AuthenticationError')
  expect(error.toJSON().message).toBe('User could not be authenticated')
  expect(error.toJSON().stack).toBeTruthy()
})

test('should have empty message', () => {
  const error = new AuthenticationError()

  expect(error instanceof Error).toBe(true)
  expect(error.name).toBe('AuthenticationError')
  expect(error.message).toBe('')
  expect(error.stack).toBeTruthy()
  expect(error.toJSON().name).toBe('AuthenticationError')
  expect(error.toJSON().message).toBe('')
  expect(error.toJSON().stack).toBeTruthy()
})

test('should extend AuthenticationError', () => {
  class CustomAuthenticationError extends AuthenticationError {
    constructor(message) {
      super(message)
      this.name = 'CustomAuthenticationError'
    }
  }

  const error = new CustomAuthenticationError(
    'Admin could not be authenticated'
  )

  expect(error instanceof Error).toBe(true)
  expect(error instanceof AuthenticationError).toBe(true)
  expect(error.name).toBe('CustomAuthenticationError')
  expect(error.message).toBe('Admin could not be authenticated')
  expect(error.stack).toBeTruthy()
  expect(error.toJSON().name).toBe('CustomAuthenticationError')
  expect(error.toJSON().message).toBe('Admin could not be authenticated')
  expect(error.toJSON().stack).toBeTruthy()
})
