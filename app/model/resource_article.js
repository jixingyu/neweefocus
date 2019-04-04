'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ResourceArticle = app.model.define('eef_resource_article', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markup: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'html',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    uid: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    category: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    cluster: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    status: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_submit: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_publish: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_update: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    user_update: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    seo_keywords: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    seo_description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    size: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    is_hot: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    recommended: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    download_count: {
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
    tableName: 'eef_resource_article',
  });

  ResourceArticle.associate = function() {

  };

  return ResourceArticle;
};
