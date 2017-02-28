import removeUser from '../actions/removeUser'
import routeTo from '../../common/factories/routeTo'
import showFlash from '../../common/factories/showFlash'

export default [
  removeUser,
  ...routeTo('home'),
  ...showFlash('Good bye!', 'info')
]
