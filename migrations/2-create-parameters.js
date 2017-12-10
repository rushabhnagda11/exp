'use strict'
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Parameters', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            learningRate: {
                type: Sequelize.DOUBLE,
            },
            layers: {
                type: Sequelize.INTEGER,
            },
            steps: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        })
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Parameters')
    }
}