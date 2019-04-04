'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Author = app.articleModel.define('eef_article_author', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    slogan: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recommended: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    display_order: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_article_author',
  });

  Author.associate = function() {

  };

  return Author;
};
