/* globals contract, it, assert, artifacts */

const NodeCertificate = artifacts.require('./NodeCertificate')
const async = require('async')

contract('NodeCertificate', (accounts) => {
  it('should init all entities', () => {
    let nodeCertificate

    return NodeCertificate.deployed()
      .then((instance) => {
        nodeCertificate = instance

        return new Promise((resolve, reject) => {
          async.eachOfSeries(accounts, (account, index, callback) => {
            console.log(account)

            instance.initEntity(`entity-${index}`, { from: account })
              .then(() => {
                callback()
              })
              .catch(err => callback(err))
          }, (err, results) => {
            if (err) {
              return reject(err)
            }

            return resolve()
          })
        })
      })
      .then(() => {
        async.map(accounts, (account, callback) => {
          nodeCertificate.getEntityStatus.call(account)
            .then(status => {
              callback(null, status)
            })
            .catch(err => callback(err))
        }, (err, results) => {
          if (err) {
            throw err
          }

          assert.equal(results[0], true, 'Incorrect entity-0 status.')
          assert.equal(results[1], true, 'Incorrect entity-1 status.')
          assert.equal(results[2], true, 'Incorrect entity-2 status.')
          assert.equal(results[3], false, 'Incorrect entity-3 status.')
        })
      })
  })

  it('check entity bootstraping', () => {
    let nodeCertificate

    return NodeCertificate.deployed()
      .then((instance) => {
        nodeCertificate = instance

        async.map(accounts, (account, callback) => {
          nodeCertificate.isEntityBootstraper.call(account)
            .then(status => {
              callback(null, status)
            })
            .catch(err => callback(err))
        }, (err, results) => {
          if (err) {
            throw err
          }

          assert.equal(results[0], true, 'Incorrect entity-1 status.')
          assert.equal(results[1], true, 'Incorrect entity-2 status.')
          assert.equal(results[2], true, 'Incorrect entity-3 status.')
          assert.equal(results[3], false, 'Incorrect entity-4 status.')
        })
      })
  })

  it('signs a new entity', () => {
    let nodeCertificate
    const signers = accounts.slice(0, 3)
    const target = accounts[3]

    return NodeCertificate.deployed()
      .then((instance) => {
        nodeCertificate = instance

        return new Promise((resolve, reject) => {
          async.eachSeries(signers, (signer, callback) => {
            nodeCertificate.signEntity(target, { from: signer })
              .then(() => {
                callback()
              })
              .catch((err) => callback(err))
          }, (err) => {
            if (err) {
              console.log(err)
              return reject(err)
            }

            resolve()
          })
        })
      })
      .then(() => {
        nodeCertificate.getEntityStatus.call(target)
          .then((status) => {
            assert.equal(status, true, 'Incorrect entity status after signing.')
          })
      })
      .catch((err) => {
        console.log(err)
      })
  })
})
