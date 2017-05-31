const config = require('./knexfile.js')['development']

const knex = require('knex')(config)

knex.migrate.latest(config)

module.exports = knex
