const idchain = require('../../utils/idchain')
const Joi = require('joi')

exports.register = function (server, options, next) {
  server.route({
    method: 'PUT',
    path: '/signatures/{target}',
    handler: function (request, reply) {
      let target = request.params.target
      let signer = request.headers['eth-account']

      idchain.signCertificate(target, signer, (err, value) => {
        if (err) { return reply(new Error(err)) }

        reply(`Entity ${target} signed by ${signer}.`)
      })
    },
    config: {
      validate: {
        params: {
          target: Joi.string().max(42).min(42)
        },
        headers: Joi.object({
          'eth-account': Joi.string().max(42).min(42)
        }).options({ allowUnknown: true })
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/signatures/{target}',
    handler: function (request, reply) {
      let target = request.params.target
      let signer = request.headers['eth-account']

      idchain.unsignCertificate(target, signer, (err, value) => {
        if (err) { return reply(new Error(err)) }

        reply(`Entity ${target} unsigned by ${signer}.`)
      })
    },
    config: {
      validate: {
        params: {
          target: Joi.string().max(42).min(42)
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
