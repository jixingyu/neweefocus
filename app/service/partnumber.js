'use strict';

const Service = require('egg').Service;

class PartnumberService extends Service {

  async getUrls(module, item, type = null) {
    const { ctx } = this;
    const tagIds = [];
    const result = [];

    // Get item releate tag ids
    const where = { item, module };
    if (type !== null) {
      where.type = type;
    }
    const rules = await ctx.articleModel.PartnumberUrl.findAll({
      attributes: [ 'title', 'url' ],
      limit: 5,
      raw: true,
    });
    if (!ctx.helper.empty(rules)) {
      const rows = await ctx.articleModel.PartnumberLink.findAll({
        attributes: [ 'tag' ],
        where,
        raw: true,
      });

      if (!ctx.helper.empty(rows)) {
        rows.forEach(element => {
          tagIds.push(element.tag);
        });
        const tags = await ctx.articleModel.PartnumberTag.findAll({
          attributes: [ 'id', 'term' ],
          where: { id: tagIds },
          raw: true,
        });
        tags.forEach(element => {
          result[element.term] = [];
          rules.forEach(rule => {
            result[element.term].push({
              title: rule.title,
              url: rule.url.replace('$tag', encodeURIComponent(element.term)),
            });
          });
        });
      }
    }
    return result;
  }
}

module.exports = PartnumberService;
