'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ArticleRelated = app.articleModel.define('eef_article_related', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    article: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    related: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    order: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_article_related',
  });

  ArticleRelated.associate = function() {
    ArticleRelated.belongsTo(app.articleModel.Article, { foreignKey: 'article', targetKey: 'id' });
  };

  return ArticleRelated;
};
