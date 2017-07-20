import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import certificates from './ducks/certificates'
import accounts from './ducks/accounts'

const rootReducer = combineReducers({
  certificates,
  accounts,
  form: formReducer,
  router: routerReducer
})

export default rootReducer
