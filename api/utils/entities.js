const bunyan = require('bunyan')
const log = bunyan.createLogger({
  name: 'idchain',
  serializers: { err: bunyan.stdSerializers.err }
})

const Entity = require('../models').Entity

const entities = {

  saveEntity (data, callback) {
    Entity
      .findOrCreate({
        where: {
          id: data.args.entity
        },
        defaults: {
          id: data.args.entity,
          name: data.args.name,
          valid: data.args.valid,
          bootstraper: data.args.bootstraper
        }
      })
      .spread((entity, isCreated) => {
        if (isCreated) {
          log.info('Entity already created.')
        }

        callback(null)
      })
      .catch((error) => {
        callback(error)
      })
  },

  getEntities (callback) {
    Entity
      .findAll()
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  getEntityById (id, callback) {
    Entity
      .findById(id)
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  },

  updateEntity (id, fields, callback) {
    Entity
      .update(fields, { where: { id } })
      .then((data) => {
        callback(null, data)
      })
      .catch((error) => {
        callback(error, null)
      })
  }
}

module.exports = entities
