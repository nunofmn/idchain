const idchain = require('../../utils/idchain')
const Joi = require('joi')

exports.register = function (server, options, next) {
  server.route({
    method: 'POST',
    path: '/account',
    handler: function (request, reply) {
      idchain.loadAccount(request.payload.account, (err, value) => {
        if (err) {
          console.log(err)
        }

        console.log('Account configured: ' + value)

        let entity = 'entity' + Math.floor((Math.random() * 1000))

        idchain.initEntity(entity, (err) => {
          if (err) {
            console.log(err)
          }
        })
      })

      reply('Account set.')
    },
    config: {
      validate: {
        payload: {
          account: Joi.string().min(42).max(42)
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/accounts',
    handler: function (request, reply) {
      idchain.getAccounts((accounts) => {
        reply(accounts)
      })
    }
  })

  server.route({
    method: 'POST',
    path: '/cert/{id}/sign',
    handler: function (request, reply) {
      idchain.signCertificate(request.params.id, (err, value) => {
        if (err) {
          console.log(err)
          return reply(new Error(err))
        }

        reply('Certificate signed.')
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

/*
 *  server.route({
 *    method: 'POST',
 *    path: '/cert/{id}/unsign',
 *    handler: function(request, reply) {
 *      idchain.unsignCertificate(request.payload.id, (err, value) => {
 *
 *        if(err) {
 *          console.log(err);
 *          return reply(new Error(err));
 *        }
 *
 *        reply('Certificate signed.');
 *      });
 *    },
 *    config: {
 *      validate: {
 *        payload: {
 *          id: Joi.string().min(42).max(42)
 *        }
 *      }
 *    }
 *  });
 *
 *  server.route({
 *    method: 'GET',
 *    path: '/cert/{id}/signers',
 *    handler: function(request, reply) {
 *      idchain.getSigners(request.params.id, (err, value) => {
 *
 *        if(err) {
 *          console.log(err);
 *          return reply(new Error(err));
 *        }
 *
 *        reply(value);
 *      });
 *    },
 *    config: {
 *      validate: {
 *        params: {
 *          id: Joi.string().min(42).max(42)
 *        }
 *      }
 *    }
 *  });
 */

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
