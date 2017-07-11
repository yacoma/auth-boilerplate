import React from 'react'
import { connect } from 'cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Button, Modal, Icon } from 'semantic-ui-react'

export default connect(
  {
    showConfirmRemoveUser: state`settings.showConfirmRemoveUser`,
    removeUserCancelled: signal`settings.removeUserCancelled`,
    removeUserConfirmed: signal`settings.removeUserConfirmed`,
  },
  function ConfirmRemoveUser({
    showConfirmRemoveUser,
    removeUserCancelled,
    removeUserConfirmed,
  }) {
    return (
      <Modal
        basic
        size="small"
        dimmer="blurring"
        open={showConfirmRemoveUser}
        onClose={removeUserCancelled}
      >
        <Modal.Header>
          <Icon name="remove user" />
          You're about deleting your User Account!
        </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete your account?</p>
          <p>This can't be undone and all your data will be removed.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            inverted
            icon
            color="red"
            onClick={() => removeUserCancelled()}
          >
            <Icon name="remove" />
            Cancel
          </Button>
          <Button
            basic
            inverted
            icon
            color="green"
            onClick={() => removeUserConfirmed()}
          >
            <Icon name="checkmark" />
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
)
