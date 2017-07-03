'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Signatures', {
      source: {
        type: Sequelize.STRING,
        references: {
          model: 'Entities',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      target: {
        type: Sequelize.STRING,
        references: {
          model: 'Entities',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Signatures')
  }
}