import {AuthenticationError} from '../errors'

function authenticate ({props, state}) {
  if (!state.get('user.authenticated')) {
    throw new AuthenticationError('You must log in to view this page')
  }
}

export default authenticate
