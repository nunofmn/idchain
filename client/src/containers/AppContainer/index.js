import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as AccountActions from '../../ducks/accounts'
import './style.css'

class AppContainer extends Component {
  render () {
    return (
      <div>
        <div id='main' className='ui main text container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    accounts: state.accounts
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(AccountActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer)
