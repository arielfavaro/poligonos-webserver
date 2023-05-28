'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Camadas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Camadas.init({
    nome: DataTypes.STRING,
    identificador: DataTypes.STRING,
    tabela: DataTypes.STRING,
    cor_borda: DataTypes.STRING,
    cor_preenchimento: DataTypes.STRING,
    ativo: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'camadas',
    modelName: 'Camadas',
  });
  return Camadas;
};