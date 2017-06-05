import React from 'react'

import './style'

const Certificate = props => {
  const {
    id,
    valid,
    signer,
    ipAddress,
    publicKey,
    peerID,
    blockstamp
  } = props

  return (
    <div>
      <div className='cert-elem' id='cert-id'>
        <h4>Certificate #{id}</h4>
        <h3>Valid? {valid}</h3>
      </div>
      <div className='cert-elem' id='cert-signer'>
        <p>Signer:</p>
        <p>{signer}</p>
      </div>
      <div className='cert-elem' id='cert-ip'>
        <p>IP Address:</p>
        <p>{ipAddress}</p>
      </div>
      <div className='cert-elem' id='cert-key'>
        <p>Public Key:</p>
        <p>{publicKey}</p>
      </div>
      <div className='cert-elem' id='cert-peerid'>
        <p>Peer ID:</p>
        <p>{peerID}</p>
      </div>
      <div className='cert-elem' id='cert-blockstamp'>
        <p>Blockstamp:</p>
        <p>{blockstamp}</p>
      </div>
    </div>
  )
}

export default Certificate
