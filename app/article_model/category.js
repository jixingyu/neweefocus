'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Category = app.articleModel.define('eef_article_category', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    left: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    right: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    depth: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName: 'eef_article_category',
  });

  Category.associate = function() {

  };

  return Category;
};
