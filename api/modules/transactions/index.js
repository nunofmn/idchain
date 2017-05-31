const Joi = require('joi')
const transactions = require('../../utils/transactions.js')

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/transaction/{id}',
    handler: function (request, reply) {
      transactions.getTransaction(request.params.id, function (err, data) {
        if (err) {
          return reply(new Error(err))
        }

        reply(data)
      })
    },
    config: {
      validate: {
        params: {
          id: Joi.string().min(40) // FIX: get transaction id true size
        }
      }
    }
  })

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
