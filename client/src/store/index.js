import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import createHistory from 'history/createBrowserHistory'

import rootReducer from '../reducer'

export const history = createHistory()

export function configure (initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    createLogger(),
    routerMiddleware(history)
  )(create)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}
