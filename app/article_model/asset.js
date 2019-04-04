'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Asset = app.articleModel.define('eef_article_asset', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },
    extension: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    size: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    mime_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    time_create: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    user: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    article: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    type: {
      type: DataTypes.ENUM('image', 'attachment'),
      allowNull: false,
      defaultValue: 'attachment',
    },
    download: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_article_asset',
  });

  Asset.associate = function() {

  };

  return Asset;
};
