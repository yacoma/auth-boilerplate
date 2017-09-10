import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Input, Icon } from 'semantic-ui-react'

export default connect(
  {
    isLoading: state`admin.searchIsLoading`,
    searchSubmitted: signal`admin.searchSubmitted`,
  },
  function Search({ isLoading, searchSubmitted }) {
    return (
      <Input
        inverted
        iconPosition="left"
        placeholder="Search users..."
        loading={isLoading}
        onChange={(e, { value }) => searchSubmitted({ value })}
      >
        <Icon name="users" />
        <input />
      </Input>
    )
  }
)
