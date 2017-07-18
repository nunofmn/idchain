const Certificate = require('../models').Certificate
const entities = require('./entities')

const certificates = {

  createCertificate (data, callback) {
    Certificate
      .create({
        id: parseInt(data.args.id),
        ipAddress: data.args.ip,
        fingerprint: data.args.pk,
        peerID: data.args.peer,
        blockstamp: data.args.timestamp.c[0],
        revoked: data.args.revoked,
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
        entities.getEntityById(data[0].entity, (err, entity) => {
          console.log('HEREEEEEEEEE: ', entity)

          if (err) {
            callback(err, null)
          }

          const finalCertificate = Object.assign({}, data[0].dataValues, { valid: entity.valid })

          callback(null, finalCertificate)
        })
      })
      .catch((error) => {
        callback(error, null)
      })
  }
}

module.exports = certificates
