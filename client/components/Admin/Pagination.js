import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'

export default connect(
  {
    pageSize: state`admin.pageSize`,
    pageSizeChanged: signal`admin.pageSizeChanged`,
    currentPage: state`admin.currentPage`,
    pages: state`admin.pages`,
    changePageClicked: signal`admin.changePageClicked`,
  },
  function Admin({
    pageSize,
    pageSizeChanged,
    currentPage,
    pages,
    changePageClicked,
  }) {
    const paginationOptions = [
      { text: '10', value: 10 },
      { text: '20', value: 20 },
      { text: '30', value: 30 },
      { text: '50', value: 50 },
      { text: '100', value: 100 },
    ]

    return (
      <Menu floated="right" inverted pagination>
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === 1}
          onClick={() => changePageClicked({ nextPage: 'first' })}
        >
          <Icon name="angle double left" />
        </Menu.Item>
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === 1}
          onClick={() => changePageClicked({ nextPage: 'previous' })}
        >
          <Icon name="angle left" />
        </Menu.Item>
        <Menu.Item>
          <strong>{currentPage}</strong>/{pages}
        </Menu.Item>
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === pages}
          onClick={() => changePageClicked({ nextPage: 'next' })}
        >
          <Icon name="angle right" />
        </Menu.Item>
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === pages}
          onClick={() => changePageClicked({ nextPage: 'last' })}
        >
          <Icon name="angle double right" />
        </Menu.Item>
        <Menu.Item>users/page:</Menu.Item>
        <Dropdown
          item
          selection
          upward
          floating
          defaultValue={pageSize}
          options={paginationOptions}
          onChange={(e, { value }) => pageSizeChanged({ value })}
        />
      </Menu>
    )
  }
)
