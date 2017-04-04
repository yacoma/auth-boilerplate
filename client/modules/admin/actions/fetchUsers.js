import {sequence} from 'cerebral'
import {httpGet} from 'cerebral-provider-http/operators'
import showFlash from '../../common/factories/showFlash'
import mergeUsers from './mergeUsers'

export default sequence('Fetch users from database', [
  httpGet('/users?sortby=nickname'), {
    success: mergeUsers,
    error: showFlash('Could not fetch the users from database', 'error')
  }
])
