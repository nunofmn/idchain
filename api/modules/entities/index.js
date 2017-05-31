const Joi = require('joi')

const entities = require('../../utils/entities')
const certificates = require('../../utils/certificates')
const transactions = require('../../utils/transactions')
const signatures = require('../../utils/signatures')

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/entities',
    handler: function (request, reply) {
      entities.getEntities((err, data) => {
        if (err) {
          return reply(new Error(err))
        }

        reply(data)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/entity/{id}',
    handler: function (request, reply) {
      entities.getEntityById(request.params.id, (err, data) => {
        if (err) {
          return reply(new Error(err))
        }

        reply(data)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(42).max(42)
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/entity/{id}/certificates',
    handler: function (request, reply) {
      certificates.getCertificatesByEntity(request.params.id, (err, certificates) => {
        if (err) {
          return reply(new Error('Error fetching certificates.'))
        }

        reply(certificates)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(42).max(42)
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/entity/{id}/transactions',
    handler: function (request, reply) {
      transactions.getTransactionsByEntity(request.params.id, (err, transactions) => {
        if (err) {
          return reply(new Error('Error fetching transactions.'))
        }

        reply(transactions)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(42).max(42)
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/entity/{id}/signatures',
    handler: function (request, reply) {
      signatures.getSignatures(request.params.id, (err, signatures) => {
        if (err) {
          return reply(new Error('Error fetching signatures.'))
        }

        reply(signatures)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(42).max(42)
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/entity/{id}/signed_by',
    handler: function (request, reply) {
      signatures.getSignedBy(request.params.id, (err, signatures) => {
        if (err) {
          return reply(new Error('Error fetching signed by.'))
        }

        reply(signatures)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(42).max(42)
        }
      }
    }
  })

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
