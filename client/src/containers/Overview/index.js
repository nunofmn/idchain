import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as AccountActions from '../../ducks/accounts'
import * as CertificateActions from '../../ducks/certificates'

import CertificatesList from '../../components/CertificatesList'

import './style.css'

class Overview extends Component {
  render () {
    const { certificatesList, accounts, actions } = this.props

    return (
      <div>
        <h1 className='ui header'>Overview</h1>
        <div className='sub header'>Account: <span id='accountId'>{accounts.account}</span></div>
        <CertificatesList
          fetchCertificates={actions.fetchCertificatesByEntity}
          certificates={certificatesList.certificates}
          account={accounts.account}
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    accounts: state.accounts,
    certificatesList: state.certificates.certificatesList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AccountActions, CertificateActions), dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)
