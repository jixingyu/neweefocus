'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ChannelItem = app.articleModel.define('eef_channel_channel_item', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    channel: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    source: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    item: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    provider: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    slug: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    category: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0',
    },
    time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    recommended: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_channel_channel_item',
  });

  ChannelItem.associate = function() {

  };

  return ChannelItem;
};
