module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ipAddress: DataTypes.STRING,
    fingerprint: DataTypes.STRING,
    peerID: DataTypes.STRING,
    blockstamp: DataTypes.STRING,
    entity: DataTypes.STRING,
    revoked: DataTypes.BOOLEAN
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