import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Icon, Table}
    from 'semantic-ui-react'
import sortedUsers from '../../computed/sortedUsers'
import Search from './Search'
import UserRow from './UserRow'

export default connect({
  sortedUsers: sortedUsers,
  usersSortBy: state`admin.usersSortBy`,
  usersSortDir: state`admin.usersSortDir`,
  sortUsersClicked: signal`admin.sortUsersClicked`
},
  function Admin ({sortedUsers, usersSortBy, usersSortDir, sortUsersClicked}) {
    return (
      <Grid container stackable padded='vertically' centered>
        <Grid.Column width={16}>
          <Header as='h1' textAlign='center' color='blue' icon>
            <Icon name='users' />
            User Admin
          </Header>
          <Table inverted striped definition sortable unstackable>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell>
                  <Search />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={usersSortBy === 'nickname' ? usersSortDir : null}
                  onClick={() => sortUsersClicked({sortBy: 'nickname'})}
                >
                  Nickname
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={usersSortBy === 'email' ? usersSortDir : null}
                  onClick={() => sortUsersClicked({sortBy: 'email'})}
                >
                  E-mail address
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={usersSortBy === 'emailConfirmed' ? usersSortDir : null}
                  onClick={() => sortUsersClicked({sortBy: 'emailConfirmed'})}
                >
                  Confirmed
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Admin
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={usersSortBy === 'lastLogin' ? usersSortDir : null}
                  onClick={() => sortUsersClicked({sortBy: 'lastLogin'})}
                >
                  Last login
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={usersSortBy === 'registered' ? usersSortDir : null}
                  onClick={() => sortUsersClicked({sortBy: 'registered'})}
                >
                  Registered
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={usersSortBy === 'registerIP' ? usersSortDir : null}
                  onClick={() => sortUsersClicked({sortBy: 'registerIP'})}
                >
                  Register IP
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedUsers.map((uid) => {
                return (
                  <UserRow key={uid} uid={uid} />
                )
              })}
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    )
  }
)
