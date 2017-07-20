'use strict'
module.exports = (sequelize, DataTypes) => {
  const Signature = sequelize.define('Signature', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
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