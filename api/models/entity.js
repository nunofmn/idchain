module.exports = (sequelize, DataTypes) => {
  const Entity = sequelize.define('Entity', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    name: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: (models) => {
        Entity.hasMany(models.Certificate)
      }
    }
  })
  return Entity
}