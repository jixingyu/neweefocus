'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Block = app.model.define('eef_core_block', {
    id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    root: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    template: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    render: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    config: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cache_ttl: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    cache_level: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    title_hidden: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1',
    },
    cloned: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    class: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    subline: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'eef_core_block',
  });

  Block.associate = function() {

  };

  return Block;
};
