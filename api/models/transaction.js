'use strict'
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    blockstamp: DataTypes.STRING,
    event: DataTypes.JSON,
    data: DataTypes.JSON,
    entity: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Transaction.belongsTo(models.Entity, {
          foreignKey: 'entity'
        })
      }
    }
  })
  return Transaction
}
