import React from 'react'
import { connect } from '@cerebral/react'
import { state, props, signal } from 'cerebral/tags'
import { Table, Button, Icon } from 'semantic-ui-react'
import ConfirmSignOut from './ConfirmSignOut'
import ConfirmRemoveUser from './ConfirmRemoveUser'

export default connect(
  {
    user: state`admin.users.${props`uid`}`,
    email: state`user.email`,
    signOutButtonClicked: signal`admin.signOutButtonClicked`,
    removeUserButtonClicked: signal`admin.removeUserButtonClicked`,
    toggleAdminClicked: signal`admin.toggleAdminClicked`,
    toggleAdminIsLoading: state`admin.users.${props`uid`}.toggleAdminIsLoading`,
  },
  function UserRow({
    uid,
    user,
    email,
    signOutButtonClicked,
    removeUserButtonClicked,
    toggleAdminClicked,
    toggleAdminIsLoading,
  }) {
    return (
      <Table.Row>
        <Table.Cell collapsing textAlign="center">
          <Button
            inverted
            icon
            color="yellow"
            onClick={() => signOutButtonClicked({ uid })}
          >
            <Icon name="sign out" size="large" />
          </Button>
          <ConfirmSignOut />
          {user.email !== 'admin@example.com' &&
            user.email !== email && (
              <Button
                inverted
                icon
                color="red"
                onClick={() => removeUserButtonClicked({ uid })}
              >
                <Icon name="remove user" size="large" />
              </Button>
            )}
          <ConfirmRemoveUser />
        </Table.Cell>
        <Table.Cell>{user.nickname}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell textAlign="center">
          {user.emailConfirmed ? (
            <Icon name="checkmark" color="green" size="large" />
          ) : (
            <Icon name="remove" color="red" size="large" />
          )}
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Button
            inverted
            basic
            icon
            color="blue"
            loading={toggleAdminIsLoading}
            disabled={
              user.email === 'admin@example.com' || user.email === email
            }
            onClick={() => toggleAdminClicked({ uid })}
          >
            {user.isAdmin ? (
              <Icon name="checkmark" color="green" size="large" />
            ) : (
              <Icon name="remove" color="red" size="large" />
            )}
          </Button>
        </Table.Cell>
        <Table.Cell>{user.lastLogin}</Table.Cell>
        <Table.Cell>{user.registered}</Table.Cell>
        <Table.Cell>{user.registerIP}</Table.Cell>
      </Table.Row>
    )
  }
)
