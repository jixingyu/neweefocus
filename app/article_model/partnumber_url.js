'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const PartnumberUrl = app.articleModel.define('eef_partnumber_url', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName: 'eef_partnumber_url',
  });

  PartnumberUrl.associate = function() {

  };

  return PartnumberUrl;
};
