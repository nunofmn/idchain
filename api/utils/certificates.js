const knex = require('../../db.js')

const certificates = {

  createCertificate (data, callback) {
    knex('certificates')
    .insert({
      id: parseInt(data.args.id),
      ipAddress: data.args.ip,
      publicKey: data.args.pk,
      peerID: data.args.peer,
      blockstamp: data.args.timestamp.c[0],
      valid: data.args.valid,
      signer: data.args.entity
    })
    .then((value) => {
      callback(null)
    })
    .catch((error) => {
      callback(error)
    })
  },

  getCertificate (id, callback) {
    knex('certificates')
    .select('*')
    .where({id})
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      callback(error, null)
    })
  },

  getCertificatesByEntity (entity, callback) {
    knex
    .select('certificates.id', 'signer',
            'publicKey', 'peerID',
            'blockstamp', 'valid')
    .from('certificates')
    .innerJoin('entities', 'certificates.signer', 'entities.id')
    .where('entities.id', entity)
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      callback(error, null)
    })
  },

  getAllCertificates (callback) {
    knex
    .select('*')
    .from('certificates')
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      callback(error, null)
    })
  }
}

module.exports = certificates
