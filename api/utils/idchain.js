const fs = require('fs')
const path = require('path')

const Web3 = require('web3')
const contract = require('truffle-contract')
const host = process.env.CLIENT

const transactions = require('./transactions')
const entities = require('./entities')
const certificates = require('./certificates')
const signatures = require('./signatures')

const web3 = new Web3(new Web3.providers.HttpProvider('http://' + host))

const contractCode = fs.readFileSync(path.join(__dirname, '../..', 'build/contracts/NodeCertificate.json'))
const NodeCertificate = contract(contractCode)

let nodecert

const idchain = {

  initContract (callback) {
    NodeCertificate.deployed()
      .then((instance) => {
        nodecert = instance
        callback()
      })
  },

  setupEvents (callback) {
    nodecert.SignCertificate().watch((err, result) => {
      if (err) { return console.error('Sign Certificate event error.') }

      transactions.putTransaction(result.transactionHash, result, (err) => {
        if (err) { return console.error('Error saving transaction to database.') }

        signatures.addSigner(result.args.target, result.args.entity, (err) => {
          if (err) { return console.error('Error saving signature to database.') }
        })
      })
    })

    nodecert.UnsignCertificate().watch((err, result) => {
      console.log(result)

      if (err) { return console.error('Unsign Certificate event error.') }

      transactions.putTransaction(result.transactionHash, result, (err) => {
        if (err) { return console.error('Error saving transaction to database.') }

        signatures.removeSigner(result.args.target, result.args.entity, (err) => {
          if (err) { return console.error('Error removing signature to database.') }
        })
      })
    })

    nodecert.CreateCertificate().watch((err, result) => {
      if (err) { return console.error('Create Certificate event error.') }

      transactions.putTransaction(result.transactionHash, result, (err) => {
        if (err) { return console.error('Error saving transaction to database.') }

        certificates.createCertificate(result, (err) => {
          if (err) { return console.error('Error saving certificate to database.') }
        })
      })
    })

    nodecert.RevokeCertificate().watch((err, result) => {
      if (err) { return console.error('Revoke Certificate event error.') }

      transactions.putTransaction(result.transactionHash, result, (err) => {
        if (err) { console.error('Error saving transaction to database.') }
      })
    })

    nodecert.EntityInit().watch((err, result) => {
      if (err) { return console.error('Revoke Certificate event error.') }

      entities.saveEntity(result, (err) => {
        if (err) { console.error('Error saving entity to database.') }

        transactions.putTransaction(result.transactionHash, result, (err) => {
          if (err) { console.error('Error saving transaction to database.') }
        })
      })
    })

    callback()
  },

  getAccounts (callback) {
    callback(web3.eth.accounts)
  },

  initEntity (account, name, callback) {
    nodecert.initEntity(name, { from: account }).then((value) => {
      callback(null)
    }).catch((e) => {
      callback(e)
    })
  },

  getCertificate (account, nodeId, callback) {
    nodecert.getCertificate.call(nodeId, { from: account }).then((value) => {
      let data = {
        publicKey: value[0],
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

  createCertificate (account, publicKey, ipAddress, peerID, callback) {
    nodecert.newCertificate(publicKey, ipAddress, peerID, { from: account }).then((value) => {
      callback(null, value)
    }).catch((e) => {
      callback(e, null)
    })
  },

  signCertificate (target, account, callback) {
    nodecert.signCertificate(target, { from: account }).then((value) => {
      callback(null, value)
    }).catch((e) => {
      callback(e, null)
    })
  },

  unsignCertificate (target, account, callback) {
    nodecert.unsignCertificate(target, { from: account }).then((value) => {
      callback(null, value)
    }).catch((e) => {
      console.log(e)
      callback(e, null)
    })
  },

  getSigners (account, nodeId, callback) {
    nodecert.getSigners.call(nodeId, { from: account }).then((value) => {
      console.log('Signers: ' + value)
      callback(null, value)
    }).catch((e) => {
      callback(e, null)
    })
  }
}

module.exports = idchain
