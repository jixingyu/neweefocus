'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Navigation = app.model.define('eef_core_navigation', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },
    section: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    cache_ttl: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1',
    },
  }, {
    tableName: 'eef_core_navigation',
  });

  Navigation.associate = function() {

  };

  return Navigation;
};
