import './styles.css'
import 'file-loader?name=[name].[ext]!./index.html'

import React from 'react'
import {render} from 'react-dom'
import controller from './controller'
import {Container} from 'cerebral/react'

import App from './components/App'

// support tap events
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

render((
  <Container controller={controller}>
    <App />
  </Container>
), document.querySelector('#app'))
