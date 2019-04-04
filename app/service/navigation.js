'use strict';

const Service = require('egg').Service;
const enums = require('../enums');
const uriColumns = [
  'label',
  'fragment',
  'id',
  'class',
  'title',
  'target',
  'rel',
  'rev',
  // 'resource',
  'visible',
  'callback',
  'pages',
  'uri',
];

class NavigationService extends Service {
  async front() {
    const { app, ctx } = this;

    let nav = await app.redis.get(enums.Redis.navFront);
    if (nav === null) {
      const frontNav = await ctx.service.compat.getConfig('nav_front');
      if (!frontNav) {
        return false;
      }
      const row = await ctx.model.NavigationNode.findOne({
        where: { navigation: frontNav },
        raw: true,
      });
      if (ctx.helper.empty(row)) {
        return false;
      }
      nav = this.translatePage(JSON.parse(row.data));
      app.redis.set(enums.Redis.navFront, JSON.stringify(nav), 'EX', app.config.defaultRedisExpire);
    } else {
      nav = JSON.parse(nav);
    }
    return nav;
  }

  translatePage(data) {
    if (!this.ctx.helper.empty(data)) {
      for (const p in data) {
        let page = data[p];
        page = this.canonizePage(page);
        if (typeof page.pages !== 'undefined') {
          page.pages = this.translatePage(page.pages);
        }
        data[p] = page;
      }
    }
    return data;
  }

  canonizePage(page) {
    for (const column in page) {
      if (uriColumns.indexOf(column) === -1) {
        delete page[column];
      }
    }
    return page;
  }
}

module.exports = NavigationService;
