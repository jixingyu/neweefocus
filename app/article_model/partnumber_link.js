'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const PartnumberLink = app.articleModel.define('eef_partnumber_link', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    module: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    item: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    order: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_partnumber_link',
  });

  PartnumberLink.associate = function() {

  };

  return PartnumberLink;
};
