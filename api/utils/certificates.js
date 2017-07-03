const Certificate = require('../models').Certificate

const certificates = {

  createCertificate (data, callback) {
    Certificate
      .create({
        id: parseInt(data.args.id),
        ipAddress: data.args.ip,
        publicKey: data.args.pk,
        peerID: data.args.peer,
        blockstamp: data.args.timestamp.c[0],
        valid: data.args.valid,
        entity: data.args.entity
      })
      .then((value) => {
        callback(null)
      })
      .catch((error) => {
        callback(error)
      })
  },

  getCertificate (id, callback) {
    Certificate
      .findById(id)
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  getCertificatesByEntity (entity, callback) {
    Certificate
      .findAll({
        where: {
          entity: entity
        }
      })
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  getAllCertificates (callback) {
    Certificate
      .findAll()
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  getCertificatesByPeerId (peerId, callback) {
    Certificate
      .findAll({
        where: {
          peerID: peerId
        }
      })
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  }
}

module.exports = certificates
