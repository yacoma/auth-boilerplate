import ES6Error from 'es6-error'

export class AuthenticationError extends ES6Error {
  constructor (message = '') {
    super(message)
    this.name = 'AuthenticationError'
  }
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    }
  }
}
