module.exports = (sequelize, DataTypes) => {
  const Entity = sequelize.define('Entity', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    bootstraper: DataTypes.BOOLEAN,
    valid: DataTypes.BOOLEAN
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