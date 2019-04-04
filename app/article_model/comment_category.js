'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CommentCategory = app.articleModel.define('eef_comment_category', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    controller: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    action: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    identifier: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    params: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    callback: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    locator: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1',
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName: 'eef_comment_category',
  });

  CommentCategory.associate = function() {

  };

  return CommentCategory;
};
