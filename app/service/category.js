'use strict';

const Service = require('egg').Service;
const enums = require('../enums');

class CategoryService extends Service {
  async getList() {
    const { app, ctx } = this;
    let categoryList = await app.redis.get(enums.Redis.categoryList);
    if (categoryList === null) {
      const categoryRows = await ctx.articleModel.Category.findAll({ where: { depth: 1 }, raw: true });
      categoryList = {};
      categoryRows.forEach(element => {
        categoryList[element.id] = element;
      });
      await app.redis.set(enums.Redis.categoryList, JSON.stringify(categoryList), 'EX', app.config.defaultRedisExpire);
    } else {
      categoryList = JSON.parse(categoryList);
    }
    return categoryList;
  }
}

module.exports = CategoryService;
