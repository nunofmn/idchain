const path = require('path')
const Glue = require('glue')
const bunyan = require('bunyan')
const idchain = require('./utils/idchain')

const log = bunyan.createLogger({
  name: 'idchain',
  serializers: { err: bunyan.stdSerializers.err }
})

const manifest = {
  connections: [
    {
      port: 8080,
      labels: ['api'],
      routes: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'eth-account']
        }
      }
    }
  ],
  registrations: [
    {
      plugin: {
        register: './accounts',
        options: {
          select: ['api']
        }
      }
    },
    {
      plugin: {
        register: './certificates',
        options: {
          select: ['api']
        }
      }
    },
    {
      plugin: {
        register: './entities',
        options: {
          select: ['api']
        }
      } },
    {
      plugin: {
        register: './transactions',
        options: {
          select: ['api']
        }
      }
    },
    {
      plugin: {
        register: './signatures',
        options: {
          select: ['api']
        }
      }
    }
  ]
}

const options = {
  relativeTo: path.join(__dirname, '/modules')
}

Glue.compose(manifest, options, (err, server) => {
  if (err) {
    return log.error({ err }, 'Error composing API server.')
  }

  server.start(function (err) {
    if (err) {
      return log.error({ err }, 'Error starting API server.')
    }

    idchain.initContract(() => {
      idchain.getAccounts((accounts) => {
        accounts.map((account) => {
          let entity = 'entity' + Math.floor((Math.random() * 1000))

          idchain.initEntity(account, entity, (err) => {
            if (err) {
              return log.warn({ err }, 'Entity already initialized')
            }

            log.info('Account ', account, ' initialized')
          })
        })
      })

      idchain.setupEvents((err, value) => {
        if (err) {
          return log.error({ err }, 'Error initiating idchain events.')
        }
      })
    })
  })

  log.info('Server running.')
})
