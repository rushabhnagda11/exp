module.exports = (sequelize, DataTypes) => {
    const Experiment = sequelize.define('Experiment', {
      modelId: DataTypes.INTEGER,
      parametersId: DataTypes.INTEGER,
      score : DataTypes.DOUBLE
    }, {
      classMethods: {
        associate: (models) => {
          // associations can be defined here
          Experiment.belongsTo(models.Model, { foreignKey: 'modelId' }),
          Experiment.belongsTo(models.Parameter, { foreignKey: 'parametersId' })          
        }
      },
      timestamps: true,
      paranoid: true
    })
  
    return Experiment
  }
  