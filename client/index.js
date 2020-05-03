import 'semantic-ui-css/semantic.css'
import './styles.css'

import App from './components/App'
import { Container } from '@cerebral/react'
import React from 'react'
import controller from './controller'
import { render } from 'react-dom'

render(
  <Container controller={controller}>
    <App />
  </Container>,
  document.getElementById('root')
)
