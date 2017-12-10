'use strict'
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Models', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
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
        return queryInterface.dropTable('Models')
    }
}