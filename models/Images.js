module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
      modelId: DataTypes.INTEGER,
      name : DataTypes.STRING
      // invoiceType: DataTypes.STRING
    }, {
      classMethods: {
        associate: (models) => {
          Image.belongsTo(models.Model, { foreignKey: 'modelId' })
        }
      },
      timestamps: true,
      paranoid: true
    })
  
    return Image
  }
  