const bunyan = require('bunyan')
const log = bunyan.createLogger({
  name: 'idchain',
  serializers: { err: bunyan.stdSerializers.err }
})

const Signature = require('../models').Signature

const signatures = {

  addSigner (target, source, callback) {
    Signature
      .create({
        target,
        source
      })
      .then((data) => {
        callback(null)
      })
      .catch((error) => {
        callback(error)
      })
  },

  removeSigner (target, signer, callback) {
    Signature
      .destroy({
        where: {
          target,
          signer
        }
      })
      .then(() => {
        callback(null)
      })
      .catch((error) => {
        callback(error)
      })
  },

  getSignedBy (target, callback) {
    Signature
      .findAll({
        where: {
          target
        }
      })
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  getSignatures (source, callback) {
    Signature
      .findAll({
        where: {
          source
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

module.exports = signatures
