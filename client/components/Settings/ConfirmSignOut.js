import React from 'react'
import { connect } from 'cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Button, Modal, Icon } from 'semantic-ui-react'

export default connect(
  {
    showConfirmSignOut: state`settings.showConfirmSignOut`,
    signOutCancelled: signal`settings.signOutCancelled`,
    signOutConfirmed: signal`settings.signOutConfirmed`,
  },
  function ConfirmSignOut({
    showConfirmSignOut,
    signOutCancelled,
    signOutConfirmed,
  }) {
    return (
      <Modal
        basic
        size="small"
        dimmer="blurring"
        open={showConfirmSignOut}
        onClose={signOutCancelled}
      >
        <Modal.Header>
          <Icon name="sign out" />
          Invalidate all your tokens
        </Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to disallow refreshing
            all your current tokens?
          </p>
          <p>
            You will do this normally if a token gets compromised.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic inverted color="red" onClick={() => signOutCancelled()}>
            <Icon name="remove" />
            Cancel
          </Button>
          <Button
            basic
            inverted
            color="green"
            onClick={() => signOutConfirmed()}
          >
            <Icon name="checkmark" />
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
)
