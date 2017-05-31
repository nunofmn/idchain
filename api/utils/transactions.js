const knex = require('../../db.js')
const crypto = require('crypto')

// Hotfix for development
// ethereumjs-testrpc does not hash tx
const randomizeHash = function (txhash, blockstamp) {
  const hash = crypto.createHash('sha256')
  hash.update(txhash + blockstamp)

  return '0x' + hash.digest('hex')
}

const transactions = {

  putTransaction (id, data, callback) {
    knex('transactions')
    .insert({
      id: process.env.ENV === 'dev' ? randomizeHash(id, data.args.timestamp.c[0]) : id,
      blockstamp: data.args.timestamp.c[0],
      event: data.event,
      data: data,
      entity: data.args.entity,
      created_at: new Date(),
      updated_at: new Date()
    })
    .then((value) => {
      callback(null)
    })
    .catch((error) => {
      console.log(error)
      callback(error)
    })
  },

  getTransaction (id, callback) {
    knex('transactions')
    .select('*')
    .where({id})
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      console.log(error)
      callback(error, null)
    })
  },

  getTransactionsByEntity (entity, callback) {
    knex
    .select('*')
    .from('transactions')
    .innerJoin('entities', 'transactions.entity', 'entities.id')
    .where('entities.id', entity)
    .then((data) => {
      callback(null, data)
    })
    .catch((error) => {
      console.log(error)
      callback(error, null)
    })
  }
}

module.exports = transactions
