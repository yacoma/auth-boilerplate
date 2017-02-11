import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Grid, Message} from 'semantic-ui-react'

export default connect({
  flash: state`app.flash`,
  flashType: state`app.flashType`
},
  function Flash ({flash, flashType}) {
    const flashTypeAttr = flashType ? {[flashType]: true} : {}
    return (
      <Grid centered>
        <Grid.Column>
          <Message
            {...flashTypeAttr}
            header={flash}
            hidden={!flash}
          />
        </Grid.Column>
      </Grid>
    )
  }
)
