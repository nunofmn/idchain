import React from 'react'
import { reduxForm } from 'redux-form'

const CertificateForm = props => {
  const {
    fields: { ipAddress, publicKey, peerID },
    handleSubmit,
    createCertificate,
    submitting
  } = props

  return (
    <div>
      <h1>New Certificate</h1>
      <form className='ui form' onSubmit={handleSubmit(createCertificate)}>
        <div className='field'>
          <label>IP Address</label>
          <input type='text' placeholder='127.0.0.1' {...ipAddress} />
        </div>
        <div className='field'>
          <label>Public Key</label>
          <input type='text' placeholder='Public Key' {...publicKey} />
        </div>
        <div className='field'>
          <label>Node Identifier</label>
          <input type='text' placeholder='0xaaaaaaaaaaaaaaa' {...peerID} />
        </div>
        <button className='ui button' type='submit' disabled={submitting}>
          {submitting ? <i /> : <i />} Submit
        </button>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'CertificateNew',
  fields: ['ipAddress', 'publicKey', 'peerID']
})(CertificateForm)
