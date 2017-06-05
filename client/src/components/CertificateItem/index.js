import React from 'react'

const CertificateItem = ({certificate}) => {
  return (
    <tr className='certificate-item'>
      <td>{certificate.id}</td>
      <td>{certificate.peerID}</td>
      <td>{certificate.valid ? 'Valid' : 'Invalid'}</td>
    </tr>
  )
}

export default CertificateItem
