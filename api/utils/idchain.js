const path = require('path')
const bunyan = require('bunyan')
const log = bunyan.createLogger({
  name: 'idchain',
  serializers: { err: bunyan.stdSerializers.err }
})

const Web3 = require('web3')
const contract = require('truffle-contract')
const host = process.env.CLIENT

const transactions = require('./transactions')
const entities = require('./entities')
const certificates = require('./certificates')
const signatures = require('./signatures')

const provider = new Web3.providers.HttpProvider('http://' + host)
const web3 = new Web3()

const NodeCertificate = contract(require(path.join(__dirname, '../../build/contracts/NodeCertificate.json')))

web3.setProvider(provider)
NodeCertificate.setProvider(provider)

let nodecert

const idchain = {

  initContract (callback) {
    callback()
  },

  setupEvents (callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        nodecert.SignCertificate().watch((err, result) => {
          if (err) { return log.error('Sign Certificate event error.', err) }

          transactions.putTransaction(result.transactionHash, result, (err) => {
            if (err) { return log.error('Error saving transaction to database.', err) }

            signatures.addSigner(result.args.target, result.args.entity, (err) => {
              if (err) { return log.error('Error saving signature to database.', err) }
            })
          })
        })

        nodecert.UnsignCertificate().watch((err, result) => {
          if (err) { return log.error('Unsign Certificate event error.', err) }

          transactions.putTransaction(result.transactionHash, result, (err) => {
            if (err) { return log.error('Error saving transaction to database.', err) }

            signatures.removeSigner(result.args.target, result.args.entity, (err) => {
              if (err) { return log.error('Error removing signature to database.', err) }
            })
          })
        })

        nodecert.CreateCertificate().watch((err, result) => {
          if (err) { return log.error('Create Certificate event error.', err) }

          transactions.putTransaction(result.transactionHash, result, (err) => {
            if (err) { return log.error('Error saving transaction to database.', err) }

            certificates.createCertificate(result, (err) => {
              if (err) { return log.error('Error saving certificate to database.', err) }
            })
          })
        })

        nodecert.RevokeCertificate().watch((err, result) => {
          if (err) { return log.error('Revoke Certificate event error.', err) }

          transactions.putTransaction(result.transactionHash, result, (err) => {
            if (err) { return log.error('Error saving transaction to database.', err) }
          })
        })

        nodecert.EntityInit().watch((err, result) => {
          if (err) { return log.error('Revoke Certificate event error.', err) }

          entities.saveEntity(result, (err) => {
            if (err) { return log.error('Error saving entity to database.', err) }

            transactions.putTransaction(result.transactionHash, result, (err) => {
              if (err) { return log.error('Error saving transaction to database.', err) }
            })
          })
        })

        callback()
      })
      .catch((error) => {
        callback(error)
      })
  },

  getAccounts (callback) {
    callback(web3.eth.accounts)
  },

  initEntity (account, name, callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        return nodecert.initEntity(name, { from: account })
      })
      .then((value) => {
        callback(null)
      }).catch((e) => {
        callback(e)
      })
  },

  getCertificate (account, nodeId, callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        return nodecert.getCertificate.call(nodeId, { from: account })
      })
      .then((value) => {
        let data = {
          fingerprint: value[0],
          ipAddress: value[1],
          date: value[2],
          id: value[3].valueOf(),
          valid: value[4],
          signer: value[5]
        }

        callback(null, data)
      }).catch((e) => {
        callback(e, null)
      })
  },

  createCertificate (account, fingerprint, ipAddress, peerID, callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        return nodecert.newCertificate(fingerprint, ipAddress, peerID, { from: account, gas: 2000000 })
      })
      .then((value) => {
        callback(null, value)
      }).catch((e) => {
        callback(e, null)
      })
  },

  signCertificate (target, account, callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        return nodecert.signCertificate(target, { from: account })
      })
      .then((value) => {
        callback(null, value)
      }).catch((e) => {
        callback(e, null)
      })
  },

  unsignCertificate (target, account, callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        return nodecert.unsignCertificate(target, { from: account })
      })
      .then((value) => {
        callback(null, value)
      }).catch((e) => {
        log.error(e)
        callback(e, null)
      })
  },

  getSigners (account, nodeId, callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        nodecert.getSigners.call(nodeId, { from: account })
      })
      .then((value) => {
        callback(null, value)
      }).catch((e) => {
        callback(e, null)
      })
  }
}

module.exports = idchain
