const knex = require('../../db.js')

const signatures = {

  addSigner (target, signer, callback) {
    knex('signers')
    .insert({
      target,
      signer,
      created_at: new Date(),
      updated_at: new Date()
    })
    .then((data) => {
      callback(null)
    })
    .catch((error) => {
      console.log(error)
      callback(error)
    })
  },

  removeSigner (target, signer, callback) {
    console.log('REMOVING SIGNER', target, ' ', signer)
    knex('signers')
    .del()
    .where({
      target,
      signer
    })
    .then((data) => {
      callback(null)
    })
    .catch((error) => {
      console.log(error)
      callback(error)
    })
  },

  getSignedBy (target, callback) {
    knex('signers')
    .select('*')
    .where({ target })
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      console.log(error)
      callback(error, null)
    })
  },

  getSignatures (signer, callback) {
    knex('signers')
    .select('*')
    .where({ signer })
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      console.log(error)
      callback(error, null)
    })
  }

}

module.exports = signatures
