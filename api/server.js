const path = require('path')
const Glue = require('glue')
const idchain = require('./utils/idchain')

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
    return console.error('Error composing API server.')
  }

  server.start(function (err) {
    if (err) {
      return console.error('Error starting API server.')
    }

    idchain.initContract(() => {
      idchain.getAccounts((accounts) => {
        accounts.map((account) => {
          let entity = 'entity' + Math.floor((Math.random() * 1000))

          idchain.initEntity(account, entity, (err) => {
            if (err) {
              return console.log('Entity already initialized')
            }

            console.log('Account ', account, ' initialized')
          })
        })
      })

      idchain.setupEvents((err, value) => {
        if (err) {
          return console.error('Error initiating idchain events.')
        }
        console.log(value)
      })
    })
  })

  console.log('Server running.')
})
