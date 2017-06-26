import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { ConnectedRouter } from 'react-router-redux'

import { history, configure } from './store/index'

import App from './components/App/index'

const store = configure()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
