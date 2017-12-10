module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('Model', {
      name: DataTypes.STRING
    }, {
      classMethods: {
        associate: (models) => {
          // associations can be defined here
          Model.hasMany(models.Experiment, { foreignKey: 'modelId' }),
          Model.hasMany(models.Image, { foreignKey: 'modelId' })
        }
      },
      timestamps: true,
      paranoid: true
    })
  
    return Model
  }
  