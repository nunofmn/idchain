import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import certificates from './ducks/certificates'
import accounts from './ducks/accounts'

const rootReducer = combineReducers({
  certificates,
  accounts,
  router: routerReducer
})

export default rootReducer
