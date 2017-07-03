'use strict'
module.exports = (sequelize, DataTypes) => {
  const Signature = sequelize.define('Signature', {
    source: DataTypes.STRING,
    target: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    }
  })

  return Signature
}