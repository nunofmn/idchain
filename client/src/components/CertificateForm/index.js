import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Dropzone from 'react-dropzone'
import forge from 'node-forge'

const CertificateForm = props => {
  const {
    handleSubmit,
    onSubmit,
    pristine,
    submitting
  } = props

  const onDrop = files => {
    const pki = forge.pki
		const fileReader = new FileReader()

		fileReader.onloadend = function () {
			const cert = pki.certificateFromPem(fileReader.result)
			console.log(cert)
		}

		fileReader.readAsText(files[0])
	}

  return (
    <div>
      <h1>New Certificate</h1>
      <Dropzone onDrop={onDrop}>
        <h2>Drop certificate here.</h2>
      </Dropzone>
      <form className='ui form' onSubmit={handleSubmit}>
        <div className='field'>
          <label>IP Address</label>
          <div>
            <Field
              name='ipAddress'
              component='input'
              type='text'
              placeholder='127.0.0.1'
            />
          </div>
        </div>
        <div className='field'>
          <label>Fingerprint</label>
          <div>
            <Field
              name='fingerprint'
              component='input'
              type='text'
              placeholder=''
            />
          </div>
        </div>
        <div className='field'>
          <label>Peer ID</label>
          <div>
            <Field
              name='peerID'
              component='input'
              type='text'
              placeholder='0xaaaaaaaaaaaaaaa'
            />
          </div>
        </div>
        <button className='ui button' type='submit' disabled={pristine || submitting}>
          {submitting ? <i /> : <i />} Submit
        </button>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'CertificateNew',
  fields: ['ipAddress', 'fingerprint', 'peerID']
})(CertificateForm)
