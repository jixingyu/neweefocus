'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Article = app.articleModel.define('eef_article_article', {
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
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    markup: {
      type: DataTypes.ENUM('html', 'text', 'markdown'),
      allowNull: false,
      defaultValue: 'html',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    user: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    author: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    poll_url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    seo_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
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
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    related_type: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    pages: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    category: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    channel: {
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
    recommended: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_create: {
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
    visits: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    watermark_check: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_article_article',
  });

  Article.defaultColumns = [ 'id', 'subject', 'image', 'user', 'author', 'slug', 'time_publish', 'visits', 'category', 'channel', 'active', 'recommended' ];

  Article.associate = function() {
    Article.hasMany(app.articleModel.TagLink, { foreignKey: 'item', sourceKey: 'id' });
    Article.hasMany(app.articleModel.ArticleRelated, { foreignKey: 'article', sourceKey: 'id' });
  };

  return Article;
};
