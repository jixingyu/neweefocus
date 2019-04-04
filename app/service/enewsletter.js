'use strict';

const Service = require('egg').Service;

class EnewsletterService extends Service {
  async getCategories() {
    const categories = await this.ctx.model.EnewsletterCategory.findAll({ raw: true });
    const result = {};
    categories.forEach(element => {
      element.url = this.service.url.getEnewsletterCategoryUrl(element.id);
      result[element.id] = element;
    });
    return result;
  }
}

module.exports = EnewsletterService;
