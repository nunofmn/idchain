import { combineReducers } from 'redux'

import certificates from './ducks/certificates'
import accounts from './ducks/accounts'

const rootReducer = combineReducers({
  certificates,
  accounts
})

export default rootReducer
