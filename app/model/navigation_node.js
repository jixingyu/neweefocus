'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const NavigationNode = app.model.define('eef_core_navigation_node', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    navigation: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'eef_core_navigation_node',
  });

  NavigationNode.associate = function() {

  };

  return NavigationNode;
};
