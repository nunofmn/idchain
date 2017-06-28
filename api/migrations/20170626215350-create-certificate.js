'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Certificates', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ipAddress: {
        type: Sequelize.STRING
      },
      publicKey: {
        type: Sequelize.STRING
      },
      peerID: {
        type: Sequelize.STRING
      },
      blockstamp: {
        type: Sequelize.STRING
      },
      valid: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Certificates')
  }
}