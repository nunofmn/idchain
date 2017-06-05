import React, { Component } from 'react'

import './style.css'

import CertificateItem from '../CertificateItem'

class CertificatesList extends Component {
  componentWillMount () {
    const { fetchCertificates, account } = this.props

    if (account !== null) {
      fetchCertificates(account)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { fetchCertificates, account } = this.props

    if (nextProps.account !== account && nextProps.account != null) {
      fetchCertificates(nextProps.account)
    }
  }

  render () {
    const { fetchCertificates, account, certificates } = this.props

    return (
      <div className='certificates-list'>
        <button className='ui basic button'
          onClick={() => fetchCertificates(account)}>
          <i className='refresh icon' />
          Update
        </button>
        <table className='ui single line fixed table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Peer ID</th>
              <th>Validity</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate, index) => {
              return <CertificateItem key={index} certificate={certificate} />
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default CertificatesList
