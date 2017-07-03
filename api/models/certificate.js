module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ipAddress: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    peerID: DataTypes.STRING,
    blockstamp: DataTypes.STRING,
    entity: DataTypes.STRING,
    valid: DataTypes.BOOLEAN
  }, {
    underscored: true,
    classMethods: {
      associate: (models) => {
        Certificate.belongsTo(models.Entity, {
          foreignKey: 'entity'
        })
      }
    }
  })
  return Certificate
}