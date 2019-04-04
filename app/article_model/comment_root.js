'use strict'

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CommentRoot = app.articleModel.define('eef_comment_root', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    module: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    item: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1'
    },
    author: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'eef_comment_root'
  });

  CommentRoot.associate = function() {

  }

  return CommentRoot;
};
