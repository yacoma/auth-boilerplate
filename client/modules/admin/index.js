import sortUsersClicked from './signals/sortUsersClicked'
import signOutButtonClicked from './signals/signOutButtonClicked'
import signOutConfirmed from './signals/signOutConfirmed'
import signOutCancelled from './signals/signOutCancelled'
import removeUserButtonClicked from './signals/removeUserButtonClicked'
import removeUserConfirmed from './signals/removeUserConfirmed'
import removeUserCancelled from './signals/removeUserCancelled'
import toggleAdminClicked from './signals/toggleAdminClicked'
import searchSubmitted from './signals/searchSubmitted'
import pageSizeChanged from './signals/pageSizeChanged'
import changePageClicked from './signals/changePageClicked'

export default module => {
  return {
    signals: {
      sortUsersClicked,
      signOutButtonClicked,
      signOutCancelled,
      signOutConfirmed,
      removeUserButtonClicked,
      removeUserCancelled,
      removeUserConfirmed,
      toggleAdminClicked,
      searchSubmitted,
      pageSizeChanged,
      changePageClicked,
    },
    state: {
      users: {},
      usersSortBy: 'nickname',
      usersSortDir: 'ascending',
      showConfirmSignOut: false,
      showConfirmRemoveUser: false,
      activeUid: null,
      searchString: '',
      searchIsLoading: false,
      currentPage: 1,
      pages: 1,
      pageSize: 30,
    },
  }
}
