import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as AccountActions from '../../ducks/accounts'

import Header from '../../components/Header'

class HeaderContainer extends Component {
  render () {
    const { accounts, actions } = this.props

    return (
      <Header
        setAccount={actions.setAccount}
        fetchAccounts={actions.fetchAccounts}
        accounts={accounts} />
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
)(HeaderContainer)
