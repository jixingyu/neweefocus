'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CommentPost = app.articleModel.define('eef_comment_post', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    root: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
    },
    reply: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markup: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_updated: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1',
    },
    ip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: '',
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  }, {
    tableName: 'eef_comment_post',
  });

  CommentPost.associate = function() {

  };

  return CommentPost;
};
