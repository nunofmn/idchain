/* globals FileReader */
import React from 'react'
import { Field, reduxForm, change } from 'redux-form'
import Dropzone from 'react-dropzone'
import forge from 'node-forge'

const CertificateForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting
  } = props

  const getCertFingerprint = (cert) => {
    const certAsn1 = forge.pki.certificateToAsn1(cert)
    const certDer = forge.asn1.toDer(certAsn1).getBytes()
    const md = forge.md.sha256.create()

    md.start()
    md.update(certDer)

    return md.digest().toHex().toUpperCase().match(/.{1,2}/g).join(':')
  }

  const getCertData = (certData) => {
    const cert = forge.pki.certificateFromPem(certData)
    const subjectAltName = cert.getExtension('subjectAltName')

    return {
      ipAddress: subjectAltName.altNames[1].value,
      fingerprint: getCertFingerprint(cert),
      peerID: subjectAltName.altNames[2].value
    }
  }

  const updateCertFields = (certFields) => {
    Object.keys(certFields).forEach(field => {
      props.dispatch(change('CertificateNew', field, certFields[field]))
    })
  }

  const onDrop = files => {
    const fileReader = new FileReader()

    fileReader.onloadend = () => {
      const certFields = getCertData(fileReader.result)
      updateCertFields(certFields)
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
