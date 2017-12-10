'use strict'
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Experiments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            modelId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Models',
                    key: 'id'
                }
            },
            parametersId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Parameters',
                    key: 'id'
                }
            },
            score : {
                type: Sequelize.DOUBLE
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
        return queryInterface.dropTable('Experiments')
    }
}