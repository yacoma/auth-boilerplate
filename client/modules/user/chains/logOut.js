import removeUser from '../actions/removeUser'
import routeTo from '../../app/factories/routeTo'
import showFlash from '../../app/factories/showFlash'

export default [
  removeUser,
  ...routeTo('home'),
  ...showFlash('Good bye!', 'info')
]
