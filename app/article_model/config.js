'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Config = app.model.define('eef_core_config', {
    id: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    category: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    edit: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filter: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    order: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    visible: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1',
    },
  }, {
    tableName: 'eef_core_config',
  });

  Config.associate = function() {

  };

  return Config;
};
