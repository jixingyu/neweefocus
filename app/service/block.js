'use strict';

const Service = require('egg').Service;
const enums = require('../enums');
const axios = require('axios');
const util = require('util');

class BlockService extends Service {
  async blocks(blockNames) {
    const { ctx } = this;
    const result = {};
    if (ctx.helper.empty(blockNames)) {
      return result;
    }
    const blockRows = await ctx.model.Block.findAll({ where: { name: blockNames }, raw: true });
    if (ctx.helper.empty(blockRows)) {
      return result;
    }

    for (const blockRow of blockRows) {
      if (blockRow.active === 0) {
        continue;
      }
      const block = await this.block(blockRow);
      if (!block || block === '') {
        result[blockRow.name] = '';
      } else {
        result[blockRow.name] = block;
      }
    }
    return result;
  }

  async block(blockRow) {
    const { app } = this;
    let blockData = null;
    if (blockRow.type !== 'tab' && blockRow.cache_ttl > 0) {
      blockData = null;// TODOawait app.redis.get(enums.Redis.blockPrefix + blockRow.name);
      if (blockData) {
        blockData = JSON.parse(blockData);
      }
    }
    if (blockData === null) {
      blockData = await this.buildBlock(blockRow);
      if (blockRow.type !== 'tab' && blockRow.cache_ttl > 0) {
        app.redis.set(enums.Redis.blockPrefix + blockRow.name, JSON.stringify(blockData), 'EX', blockRow.cache_ttl);
      }
    }
    return blockData;
  }

  async buildBlock(blockRow) {
    const { app, ctx } = this;
    let result = '';
    const options = ctx.helper.empty(blockRow.config) ? {} : JSON.parse(blockRow.config);
    if (app.config.blockFilters.hasOwnProperty(blockRow.name)) {
      const func = app.config.blockFilters[blockRow.name];
      result = await this[func](options);
    } else if (blockRow.type !== '') {
      let items = false;
      switch (blockRow.type) {
        case 'list':
        case 'carousel':
          items = ctx.helper.empty(blockRow.content) ? false : JSON.parse(blockRow.content);
          if (items) {
            result = { items, options };
          }
          break;
        case 'html':
          result = ctx.helper.shtml(blockRow.content);
          break;
        default:
          result = ctx.helper.escape(blockRow.content);
          break;
      }
    }
    return result;
  }

  // moore8 webcastList
  async webcastList(options) {
    const url = util.format(
      options.url,
      options.list_count
    );
    const content = await axios.get(url);

    const block = {
      content: content.data,
      target: options.target ? options.target : '_blank',
      width: options.width ? options.width : 100,
      height: options.height ? options.height : 100,
    };

    return block;
  }

  adHome(options) {
    const content = [];
    const items = options.items.split('\r\n');
    for (const item of items) {
      const matches = item.match(/\[(.+)\]\((.+)\)\{(.+)\}/);
      if (matches) {
        let url = matches[2];
        let img = matches[3];
        if (!img) {
          img = '';
        }

        if (!/^http/.test(url)) {
          url = 'https://'.url;
        }
        content.push({
          title: matches[1],
          url,
          img,
        });
      }
    }

    const block = {
      content,
      advert: options.advert,
      target: options.target,
    };

    return block;
  }
}

module.exports = BlockService;
