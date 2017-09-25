const Joi = require('joi')
const bunyan = require('bunyan')
const log = bunyan.createLogger({
  name: 'idchain',
  serializers: { err: bunyan.stdSerializers.err }
})

const certificates = require('../../utils/certificates')

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/peer/{id}',
    handler: function (request, reply) {
      certificates.getCertificatesByPeerId(request.params.id, (err, certificate) => {
        if (err) {
          log.error(err)
          return reply(new Error('Error fetching certificate.'))
        }

        reply(certificate)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(40).max(40)
        }
      }
    }
  })

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
