import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Message} from 'semantic-ui-react'

export default connect({
  flash: state`app.flash`,
  flashType: state`app.flashType`,
  flashClosed: signal`app.flashClosed`
},
  function Flash ({flash, flashType, flashClosed}) {
    const flashTypeAttr = flashType ? {[flashType]: true} : {}
    return (
      <Grid centered>
        <Grid.Column>
          <Message
            {...flashTypeAttr}
            header={flash}
            hidden={!flash}
            onDismiss={() => flashClosed()}
          />
        </Grid.Column>
      </Grid>
    )
  }
)
