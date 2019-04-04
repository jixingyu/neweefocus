'use strict';

const Service = require('egg').Service;
const enums = require('../enums');

class TagService extends Service {
  async multiple(module, items, type = null) {
    const { ctx } = this;
    const tagIds = [];
    const result = {};

    // Get item releate tag ids
    const where = { item: items, module };
    if (type !== null) {
      where.type = type;
    }
    const rows = await ctx.articleModel.TagLink.findAll({
      attributes: [ 'tag', 'item' ],
      where,
      order: [[ 'order', 'ASC' ]],
      raw: true,
    });

    if (!ctx.helper.empty(rows)) {
      rows.forEach(element => {
        result[element.item] = [];
        if (tagIds.indexOf(element.tag) === -1) {
          tagIds.push(element.tag);
        }
      });
      const tags = await ctx.articleModel.Tag.findAll({
        attributes: [ 'id', 'term' ],
        where: { id: tagIds },
        raw: true,
      });
      rows.forEach(element => {
        for (const tag of tags) {
          if (element.tag === tag.id) {
            result[element.item].push(tag);
            break;
          }
        }
      });
    }
    return result;
  }

  async get(module, item, type = null) {
    const { ctx } = this;
    const tagIds = [];
    const result = [];

    // Get item releate tag ids
    const where = { item, module };
    if (type !== null) {
      where.type = type;
    }
    const rows = await ctx.articleModel.TagLink.findAll({
      attributes: [ 'tag' ],
      where,
      order: [[ 'order', 'ASC' ]],
      raw: true,
    });

    if (!ctx.helper.empty(rows)) {
      rows.forEach(element => {
        tagIds.push(element.tag);
      });
      const tags = await ctx.articleModel.Tag.findAll({
        attributes: [ 'id', 'term' ],
        where: { id: tagIds },
        raw: true,
      });
      tags.forEach(element => {
        result.push(element.term);
      });
    }
    return result;
  }

  addLink(content, tags) {
    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach(element => {
        content = content.replace(new RegExp('(' + element + ')(?![^\<]*\<\/a\>)'), '<a href="" target="_blank">$1</a>');
      });
    }
    return content;
  }

  async articleIds(params) {
    const { ctx } = this;
    const { tag, type } = params;

    const tags = await ctx.articleModel.Tag.findAll({
      attributes: [ 'id' ],
      where: { term: tag },
      raw: true,
    });
    let result = [ 0, null ];
    if (!ctx.helper.empty(tags)) {
      const tagIds = [];
      tags.forEach(element => {
        tagIds.push(element.id);
      });
      const where = { tag: tagIds, module: enums.EefModule.article };
      if (type) {
        where.type = type;
      }
      const cond = {
        attributes: [ 'item' ],
        col: 'item',
        where,
        order: [[ 'time', 'DESC' ]],
        limit: params.limit,
        offset: params.offset,
        raw: true,
      };
      if (Array.isArray(tag)) {
        cond.distinct = true;
      }
      result = await ctx.articleModel.TagLink.findAndCountAll(cond);
      if (result && result.rows) {
        for (const i in result.rows) {
          result.rows[i] = result.rows[i].item;
        }
      }
    }
    return result;
  }

  async relate(articleId, cond) {
    const { ctx } = this;
    const tags = await ctx.articleModel.TagLink.findAll({
      raw: true,
      where: { module: enums.EefModule.article, item: articleId },
    });
    let article = null;
    if (!ctx.helper.empty(tags)) {
      const tagIds = [];
      tags.forEach(element => {
        tagIds.push(element.tag);
      });
      cond.include = {
        attributes: [],
        model: ctx.articleModel.TagLink,
        required: true,
        where: { module: enums.EefModule.article, tag: tagIds },
      };
      cond.subQuery = false;
      article = await ctx.articleModel.Article.findOne(cond);
    }
    return article;
  }
}

module.exports = TagService;
