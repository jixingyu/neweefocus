'use strict';

const Service = require('egg').Service;
const enums = require('../enums');

class ChannelService extends Service {
  async entity(condition, column = null) {
    const { ctx } = this;
    if (ctx.helper.isNumber(condition)) {
      const row = await ctx.articleModel.ChannelItem.findOne({
        where: { item: condition },
        raw: true,
      });
      return ctx.helper.empty(row) ? false : (column ? row.column : row);
    } else if (typeof condition === 'string') {
      const row = await ctx.articleModel.ChannelItem.findOne({
        where: { slug: condition },
        raw: true,
      });
      return ctx.helper.empty(row) ? false : (column === null ? row : row.column);
    }
    return false;
  }

  async get(name, column = null) {
    const channelList = await this.getList();
    let result = false;
    for (const i in channelList) {
      if (name === channelList[i].id || name === channelList[i].slug) {
        result = channelList[i];
      }
    }
    return result === false ? false : (column ? result.column : result);
  }

  async getList() {
    const { app, ctx } = this;
    let channelList = await app.redis.get(enums.Redis.channelList);
    if (channelList === null) {
      const channelRows = await ctx.articleModel.Channel.findAll({ raw: true });
      channelList = {};
      channelRows.forEach(element => {
        element.url = this.service.url.getChannelUrl(element.slug);
        channelList[element.id] = element;
      });
      await app.redis.set(enums.Redis.channelList, JSON.stringify(channelList), 'EX', app.config.defaultRedisExpire);
    } else {
      channelList = JSON.parse(channelList);
    }
    return channelList;
  }

  async getCategory(id, channel) {
    const { ctx } = this;
    if (!ctx.helper.isNumber(id) || !ctx.helper.isNumber(channel)) {
      return false;
    }
    return await ctx.articleModel.ChannelPageCategory.findOne({
      where: { channel, provider: enums.EefModule.article, category: id },
      raw: true,
    });
  }

  async getRouteReg() {
    const { ctx } = this;
    const channelList = await this.getList();
    if (!ctx.helper.empty(channelList)) {
      let channelReg = '^\/(';
      for (const i in channelList) {
        channelReg += channelList[i].slug + '|';
      }
      channelReg = channelReg.substring(0, channelReg.length - 1) + ')\/(\\d+)(?:\-([^\/]+))?(?:\/(p\\d+)|\/(r\\d+))?';
      return channelReg;
    }
    return null;
  }

  async matchRoute(uri) {
    const channelReg = await this.getRouteReg();
    if (channelReg) {
      const reg = new RegExp(channelReg);
      const matches = uri.match(reg);
      if (matches) {
        return { channel: matches[1], id: matches[2] };
      }
    }
    return null;
  }
}

module.exports = ChannelService;
