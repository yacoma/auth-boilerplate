import { Module } from 'cerebral'

import * as sequences from './sequences'

export default Module({
  signals: {
    sortUsersClicked: sequences.fetchSortedUsers,
    signOutButtonClicked: sequences.showSignOutUserModal,
    signOutCancelled: sequences.closeSignOutUserModal,
    signOutConfirmed: sequences.signOutUser,
    removeUserButtonClicked: sequences.showRemoveUserModal,
    removeUserCancelled: sequences.closeRemoveUserModal,
    removeUserConfirmed: sequences.removeUser,
    toggleAdminClicked: sequences.toggleAdmin,
    searchSubmitted: sequences.searchUsers,
    pageSizeChanged: sequences.changePageSize,
    changePageClicked: sequences.changePage,
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
})
