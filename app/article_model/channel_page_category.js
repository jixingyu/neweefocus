'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ChannelPageCategory = app.articleModel.define('eef_channel_page_category', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    page: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    channel: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    provider: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    category: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0',
    },
    category_title: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    seo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName: 'eef_channel_page_category',
  });

  ChannelPageCategory.associate = function() {

  };

  return ChannelPageCategory;
};
