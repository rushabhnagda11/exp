module.exports = (sequelize, DataTypes) => {
    const Parameter = sequelize.define('Parameter', {
      learningRate : DataTypes.FLOAT,
      steps : DataTypes.INTEGER,
      layers : DataTypes.INTEGER
      // invoiceType: DataTypes.STRING
    }, {
      classMethods: {
        associate: (models) => {
          //Parameter.belongsTo(models.Experiment, { foreignKey: 'modelId' })
        }
      },
      timestamps: true,
      paranoid: true
    })
  
    return Parameter
  }
  