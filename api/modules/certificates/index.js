const idchain = require('../../utils/idchain')
const Joi = require('joi')

const certificates = require('../../utils/certificates')

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/certificates',
    handler: function (request, reply) {
      certificates.getAllCertificates((err, certificates) => {
        if (err) {
          return reply(new Error('Error fetching certificates.'))
        }

        reply(certificates)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/certificate/{id}',
    handler: function (request, reply) {
      certificates.getCertificate(request.params.id, (err, certificate) => {
        if (err) {
          return reply(new Error('Error fetching certificate.'))
        }

        reply(certificate)
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
    method: 'POST',
    path: '/certificate',
    handler: function (request, reply) {
      let publicKey = request.payload.publicKey
      let ipAddress = request.payload.ipAddress
      let peerID = request.payload.peerID
      let entity = request.headers['eth-account']

      idchain.createCertificate(entity, publicKey, ipAddress, peerID, (err, value) => {
        if (err) {
          return reply(new Error(err))
        }

        reply('Certificate created for ID: ' + entity)
      })
    },
    config: {
      validate: {
        payload: {
          publicKey: Joi.string().min(40),
          ipAddress: Joi.string(),
          peerID: Joi.string()
        },
        headers: Joi.object({
          'eth-account': Joi.string().max(42).min(42)
        }).options({ allowUnknown: true })
      }
    }
  })

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
