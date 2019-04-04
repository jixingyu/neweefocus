'use strict';

const Service = require('egg').Service;
const enums = require('../enums');

class ArticleService extends Service {

  async getArticles(params) {
    const { ctx } = this;
    let { where, columns, order, limit, offset } = params;
    columns = columns || ctx.articleModel.Article.defaultColumns;
    order = order || [[ 'time_publish', 'DESC' ]];
    const cond = {
      attributes: columns,
      where,
      order,
      raw: true,
    };
    if (limit) {
      cond.limit = limit;
    }
    if (offset) {
      cond.offset = offset;
    }

    return await ctx.articleModel.Article.findAll(cond);
  }

  async getArticle(id) {
    const { ctx } = this;

    let article;
    if (ctx.helper.isNumber(id)) {
      article = await ctx.articleModel.Article.findOne({
        attributes: [ 'subject', 'subtitle', 'content', 'author', 'slug', 'poll_url', 'summary', 'source', 'pages', 'recommended', 'time_publish', 'visits' ],
        where: { id },
        raw: true,
      });
    } else {
      article = id;
      id = article.id;
    }
    let result = null;
    if (!ctx.helper.empty(article)) {
      result = article;
      result.author = null;
      if (this.config.article.enableTag) {
        const tags = await ctx.service.tag.get(enums.EefModule.article, id);
        // EEFOCUS TODO need breakpage?
        result.content = ctx.service.tag.addLink(article.content, tags);
        // Get tag
        result.tag = tags;
      }

      // Get author
      if (article.author !== 0) {
        const author = await ctx.articleModel.Author.findOne({
          where: { id: article.author },
          raw: true,
        });
        if (author) {
          if (author.photo === '') {
            author.photo = this.config.article.defaultAuthorPhoto;
          }
          result.author = author;
        }
      }

      // Get attachments
      result.attachments = [];
      const assets = await ctx.articleModel.Asset.findAll({
        where: { article: id, type: enums.Asset.FIELD_TYPE_ATTACHMENT },
        raw: true,
      });
      assets.forEach(element => {
        result.attachments.push({
          original_name: element.original_name,
          extension: element.extension,
          size: element.size,
          url: ctx.helper.siteUrl('download/attachment/' + element.name),
        });
      });

      // Get partnumber
      result.partnumber = await ctx.service.partnumber.getUrls(enums.EefModule.article, id);
    }
    return result;
  }

  async relate(fromId) {
    const { app, ctx } = this;

    const articleFrom = await ctx.articleModel.Article.findOne({
      attributes: [ 'related_type', 'time_publish' ],
      where: { id: fromId },
      raw: true,
    });
    let article = null;
    const columns = [ 'id', 'subject', 'subtitle', 'content', 'author', 'slug', 'poll_url', 'summary', 'source', 'pages', 'recommended', 'time_publish', 'visits' ];
    if (!ctx.helper.empty(articleFrom) && articleFrom.related_type !== enums.Article.FIELD_RELATED_TYPE_OFF) {
      const cond = {
        raw: true,
        attributes: columns,
        where: { time_publish: { [app.Sequelize.Op.lt]: articleFrom.time_publish } },
        order: [[ 'time_publish', 'DESC' ]],
      };
      if (articleFrom.related_type === enums.Article.FIELD_RELATED_TYPE_CUSTOM) {

        const relateArticles = await ctx.articleModel.ArticleRelated.findAll({
          raw: true,
          where: { article: fromId },
        });
        if (!ctx.helper.empty(relateArticles)) {
          const relatedIds = [];
          relateArticles.forEach(element => {
            relatedIds.push(element.related);
          });
          cond.where.id = relatedIds;
          article = await ctx.articleModel.Article.findOne(cond);
        }
      }
      if (!article) {
        article = await ctx.service.tag.relate(fromId, cond);
      }
    }
    if (article) {
      article = await this.getArticle(article);
    }
    return article;
  }

  async getAvailableArticlePage(params) {
    const { app, ctx } = this;
    const defaultWhere = {
      time_publish: { [app.Sequelize.Op.lte]: ctx.helper.now() },
      status: enums.Article.FIELD_STATUS_PUBLISHED,
      active: 1,
    };
    if (params) {
      params.where = { ...defaultWhere, ...params.where };
    } else {
      params = { where: defaultWhere };
    }
    return await this.getArticlePage(params);
  }

  async getAvailableArticleCount() {
    const { app, ctx } = this;
    const articleCount = await app.redis.get(enums.Redis.articleCount);
    if (!articleCount) {
      const articleCount = await ctx.articleModel.Article.count({
        time_publish: { [app.Sequelize.Op.lte]: ctx.helper.now() },
        status: enums.Article.FIELD_STATUS_PUBLISHED,
        active: 1,
      });
      await app.redis.set(enums.Redis.articleCount, articleCount, 'EX', 180);
    }
    return articleCount;
  }

  async getArticlePage(params) {
    const { ctx } = this;
    let { columns } = params;
    columns = columns || ctx.articleModel.Article.defaultColumns;

    const tagExist = columns.indexOf('tag');
    if (tagExist !== -1) {
      columns.splice(tagExist, 1);
    }
    params.columns = columns;
    const resultset = await this.getArticles(params);
    if (!ctx.helper.empty(resultset)) {
      const articleIds = [],
        authorIds = [],
        authors = {};
      let tags = {};

      const [ categories, channels ] = await Promise.all([
        ctx.service.category.getList(),
        ctx.service.channel.getList(),
      ]);

      resultset.forEach(element => {
        articleIds.push(element.id);
        if (element.author !== 0) {
          authorIds.push(element.author);
        }
      });

      if (authorIds.length > 0 && Array.isArray(columns) && columns.indexOf('author') !== -1) {
        const authorRows = await ctx.articleModel.Author.findAll({ where: { id: authorIds }, raw: true });
        authorRows.forEach(element => {
          authors[element.id] = { name: element.name };
        });
      }
      if (Array.isArray(columns) && tagExist !== -1 && this.config.article.enableTag) {
        tags = await this.service.tag.multiple(enums.EefModule.article, articleIds);
      }

      resultset.forEach(element => {
        if (Array.isArray(columns) && columns.indexOf('channel') !== -1 && channels.hasOwnProperty(element.channel)) {
          element.channel_title = channels[element.channel].title;
          element.channel_slug = channels[element.channel].slug;
          element.channel_url = channels[element.channel].url;
          element.url = this.service.url.getArticleUrl({ id: element.id, channel: element.channel_slug, slug: element.slug });
        }
        if (Array.isArray(columns) && columns.indexOf('category') !== -1 && categories.hasOwnProperty(element.category)) {
          element.category_title = categories[element.category].title;
          element.category_slug = categories[element.category].slug;
        }
        if (Array.isArray(columns) && columns.indexOf('author') !== -1 && authors.hasOwnProperty(element.author)) {
          element.author_name = authors[element.author].name;
        }
        if (Array.isArray(columns) && columns.indexOf('image') !== -1 && element.image !== '') {
          element.thumb = this.service.image.getThumbFromOriginal(element.image);
        }
        if (Array.isArray(columns) && tagExist !== -1 && this.config.article.enableTag && tags.hasOwnProperty(element.id)) {
          element.tag = tags[element.id];
        }
      });
    }
    return resultset;
  }
}

module.exports = ArticleService;
