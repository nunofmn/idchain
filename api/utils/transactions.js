const crypto = require('crypto')
const bunyan = require('bunyan')
const log = bunyan.createLogger({
  name: 'idchain',
  serializers: { err: bunyan.stdSerializers.err }
})

const Transaction = require('../models').Transaction

// Hotfix for development
// ethereumjs-testrpc does not hash tx
const randomizeHash = function (txhash, blockstamp) {
  const hash = crypto.createHash('sha256')
  hash.update(txhash + blockstamp)

  return '0x' + hash.digest('hex')
}

const transactions = {

  putTransaction (id, data, callback) {
    const rndId = process.env.ENV === 'dev' ? randomizeHash(id, data.args.timestamp.c[0]) : id

    Transaction
      .findOrCreate({
        where: {
          id: rndId
        },
        defaults: {
          id: rndId,
          blockstamp: data.args.timestamp.c[0],
          event: data.event,
          data: data,
          entity: data.args.entity
        }
      })
      .spread((transaction, isCreated) => {
        if (isCreated) {
          log.info('Transaction already created. Updating.')
        }

        callback(null)
      })
      .catch((error) => {
        callback(error)
      })
  },

  getTransaction (id, callback) {
    Transaction
      .findById(id)
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  getTransactionsByEntity (entity, callback) {
    Transaction
      .findAll({
        where: {
          entity
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

module.exports = transactions
