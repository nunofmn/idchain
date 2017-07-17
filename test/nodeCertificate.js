/* globals contract, it, assert, artifacts */

const NodeCertificate = artifacts.require('./NodeCertificate')
const async = require('async')

contract('NodeCertificate', (accounts) => {
  it('should init all entities', (done) => {
    let nodeCertificate

    NodeCertificate.deployed()
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
          assert.equal(results[4], false, 'Incorrect entity-4 status.')
          assert.equal(results[5], false, 'Incorrect entity-5 status.')

          done()
        })
      })
  })

  it('check entity bootstraping', (done) => {
    let nodeCertificate

    NodeCertificate.deployed()
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
          assert.equal(results[4], false, 'Incorrect entity-5 status.')
          assert.equal(results[5], false, 'Incorrect entity-6 status.')

          done()
        })
      })
  })

  it('signs a entity', (done) => {
    let nodeCertificate
    const signers = accounts.slice(0, 3)
    const target = accounts[3]

    NodeCertificate.deployed()
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
            done()
          })
      })
      .catch((err) => {
        console.log(err)
      })
  })

  it('signs another entity with new valid signer', (done) => {
    let nodeCertificate
    const signers = accounts.slice(1, 4)
    const target = accounts[4]

    NodeCertificate.deployed()
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
            done()
          })
      })
      .catch((err) => {
        console.log(err)
      })
  })

  it('unsigns another entity which signed another one', (done) => {
    let nodeCertificate
    const signer = accounts[0]
    const target = accounts[3]

    NodeCertificate.deployed()
      .then((instance) => {
        nodeCertificate = instance

        return nodeCertificate.unsignEntity(target, { from: signer, gas: 2000000 })
          .then(() => {
            return new Promise((resolve, reject) => {
              const targets = [accounts[3], accounts[4]]

              async.map(targets, (invalidated, callback) => {
                nodeCertificate.getEntityStatus.call(invalidated)
                  .then((status) => {
                    callback(null, status)
                  })
                  .catch((err) => {
                    callback(err)
                  })
              }, (err, results) => {
                if (err) {
                  return reject(err)
                }

                resolve(results)
              })
            })
          })
          .then((results) => {
            results.forEach(result => assert.equal(result, false, 'Incorrect after unsigning.'))

            done()
          })
          .catch((err) => {
            console.log(err)
          })
      })
  })

  it('a entity and its descendants are valid again', (done) => {
    let nodeCertificate
    const signer = accounts[0]
    const target = accounts[3]

    NodeCertificate.deployed()
      .then((instance) => {
        nodeCertificate = instance

        return nodeCertificate.signEntity(target, { from: signer, gas: 2000000 })
          .then(() => {
            return new Promise((resolve, reject) => {
              const targets = [accounts[3], accounts[4]]

              async.map(targets, (validated, callback) => {
                nodeCertificate.getEntityStatus.call(validated)
                  .then((status) => {
                    callback(null, status)
                  })
                  .catch((err) => {
                    callback(err)
                  })
              }, (err, results) => {
                if (err) {
                  return reject(err)
                }

                resolve(results)
              })
            })
          })
          .then((results) => {
            results.forEach(result => assert.equal(result, true, 'Entity 3 and 4 should be valid.'))

            done()
          })
          .catch((err) => {
            done(err)
          })
      })
  })
})
