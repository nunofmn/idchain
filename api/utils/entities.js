const knex = require('../../db.js')

const entities = {

  saveEntity (data, callback) {
    knex('entities')
    .insert({
      id: data.args.entity,
      name: data.args.name,
      created_at: new Date(),
      updated_at: new Date()
    })
    .then((value) => {
      console.log(value)
      callback(null)
    })
    .catch((error) => {
      console.log(error)
      callback(error)
    })
  },

  getEntities (callback) {
    knex('entities')
    .select('*')
    .then((data) => {
      console.log(data)
      callback(null, data)
    })
    .catch((error) => {
      console.log(error)
      callback(error, null)
    })
  },

  getEntityById (id, callback) {
    knex('entities')
    .select('*')
    .where({id})
    .then((data) => {
      console.log(data)
      callback(null, data)
    })
    .catch((error) => {
      console.log(error)
      callback(error, null)
    })
  }
}

module.exports = entities
