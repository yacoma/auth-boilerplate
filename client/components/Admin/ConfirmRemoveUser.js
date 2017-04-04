import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Button, Modal, Icon} from 'semantic-ui-react'

export default connect({
  nickname: state`admin.users.${state`admin.activeUid`}.nickname`,
  showConfirmRemoveUser: state`admin.showConfirmRemoveUser`,
  removeUserCancelled: signal`admin.removeUserCancelled`,
  removeUserConfirmed: signal`admin.removeUserConfirmed`
},
  function ConfirmRemoveUser ({
    nickname, showConfirmRemoveUser, removeUserCancelled, removeUserConfirmed
  }) {
    return (
      <Modal basic size='small' dimmer='blurring'
        open={showConfirmRemoveUser}
        onClose={removeUserCancelled}
      >
        <Modal.Header>
          <Icon name='remove user' />
          Delete User Account
        </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete {nickname}?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic inverted
            color='red'
            onClick={() => removeUserCancelled()}
          >
            <Icon name='remove' />
            Cancel
          </Button>
          <Button basic inverted
            color='green'
            onClick={() => removeUserConfirmed()}
          >
            <Icon name='checkmark' />
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
)
