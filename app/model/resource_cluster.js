'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ResourceCluster = app.model.define('eef_resource_cluster', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    left: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    right: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    depth: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    slug: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'eef_resource_cluster',
  });

  ResourceCluster.associate = function() {

  };

  return ResourceCluster;
};
