import React from 'react'

const CertificateItem = ({certificate}) => {
  return (
    <tr className='certificate-item'>
      <td>{certificate.id}</td>
      <td>{certificate.peerID}</td>
      <td>{certificate.revoked ? 'Yes' : 'No'}</td>
      <td>{certificate.ipAddress}</td>
      <td>{certificate.fingerprint}</td>
    </tr>
  )
}

export default CertificateItem
