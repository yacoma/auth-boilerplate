import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Input} from 'semantic-ui-react'

export default connect({
  isLoading: state`admin.searchIsLoading`,
  searchSubmitted: signal`admin.searchSubmitted`
},
  function Search ({isLoading, searchSubmitted}) {
    return (
      <Input inverted placeholder='Search users...'
        loading={isLoading}
        icon='users'
        iconPosition='left'
        onChange={
          (e, {value}) => searchSubmitted({value})
        }
      />
    )
  }
)
