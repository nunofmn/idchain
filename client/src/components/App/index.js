import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import AppContainer from '../../containers/AppContainer'
import HeaderContainer from '../../containers/HeaderContainer'
import Overview from '../../containers/Overview/index'
import Certificates from '../../containers/Certificates/index'

const App = ({children}) => {
  return (
    <Router>
      <div>
        <HeaderContainer />
        <AppContainer>
          <Overview />
          <Certificates />
        </AppContainer>
      </div>
    </Router>
  )
}

export default App
