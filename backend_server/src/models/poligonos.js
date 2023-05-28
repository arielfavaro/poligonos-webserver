'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poligonos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Poligonos.init({
    geom: DataTypes.GEOMETRY,
    ativo: DataTypes.BOOLEAN,
  }, {
    sequelize,
    tableName: 'poligonos',
    modelName: 'Poligonos',
    indexes: [
      {
        fields: ['geom'],
        using: 'gist',
      },
    ],
  });
  return Poligonos;
};