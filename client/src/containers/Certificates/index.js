import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import CertificateForm from '../../components/CertificateForm'
import CertificatesList from '../../components/CertificatesList'
import * as CertificateActions from '../../ducks/certificates'

class Certificates extends Component {
  render () {
    const { certificatesList, accounts, actions } = this.props

    return (
      <div>
        <h1 className='ui header'>Certificates</h1>
        <CertificatesList
          fetchCertificates={actions.fetchCertificatesByEntity}
          certificates={certificatesList.certificates}
          account={accounts.account}
        />
        <CertificateForm
          createCertificate={actions.createCertificate}
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    accounts: state.accounts,
    newCertificate: state.certificates.newCertificate,
    certificatesList: state.certificates.certificatesList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(CertificateActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Certificates)
