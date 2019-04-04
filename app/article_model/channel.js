'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Channel = app.articleModel.define('eef_channel_channel', {
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
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1',
    },
    name: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
      unique: true,
    },
    theme: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'default',
    },
    time_created: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_updated: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    slug: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'eef_channel_channel',
  });

  Channel.associate = function() {

  };

  return Channel;
};
