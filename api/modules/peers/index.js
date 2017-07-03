const Joi = require('joi')

const certificates = require('../../utils/certificates')

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/peer/{id}',
    handler: function (request, reply) {
      certificates.getCertificatesByPeerId(request.params.id, (err, certificate) => {
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

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
