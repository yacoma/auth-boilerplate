import {AuthenticationError} from '../errors'

function authenticate ({props, state}) {
  if (!state.get('user.isAdmin')) {
    throw new AuthenticationError('You need Admin permissions to view this page')
  }
}

export default authenticate
