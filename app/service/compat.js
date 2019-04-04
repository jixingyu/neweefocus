'use strict';

const Service = require('egg').Service;
const enums = require('../enums.js');
const Err_Common = require('../error/common');

class CompatService extends Service {
  async getConfig(key, module = 'system') {
    const { app, ctx } = this;
    let configs = await app.redis.get(enums.Redis.eefConfigPrefix + module);
    if (configs === null) {
      const rows = await ctx.model.Config.findAll({ attributes: [ 'name', 'value' ], where: { module }, raw: true });
      configs = {};
      rows.forEach(element => {
        configs[element.name] = element.value;
      });
      await app.redis.set(enums.Redis.eefConfigPrefix + module, JSON.stringify(configs), 'EX', app.config.defaultRedisExpire);
    } else {
      configs = JSON.parse(configs);
    }
    if (key === null) {
      return configs;
    }
    return configs.hasOwnProperty(key) ? configs[key] : null;
  }

  async getArticleConfig(key, module = 'system') {
    const { app, ctx } = this;
    let configs = await app.redis.get(enums.Redis.eefArticleConfigPrefix + module);
    if (configs === null) {
      const rows = await ctx.articleModel.Config.findAll({ attributes: [ 'name', 'value' ], where: { module }, raw: true });
      configs = {};
      rows.forEach(element => {
        configs[element.name] = element.value;
      });
      await app.redis.set(enums.Redis.eefArticleConfigPrefix + module, JSON.stringify(configs), 'EX', app.config.defaultRedisExpire);
    } else {
      configs = JSON.parse(configs);
    }
    if (key === null) {
      return configs;
    }
    return configs.hasOwnProperty(key) ? configs[key] : null;
  }

  async meta() {
    const [ author, generator, keywords, description ] = await Promise.all([
      this.getConfig('author'),
      this.getConfig('generator'),
      this.getConfig('keywords'),
      this.getConfig('description'),
    ]);
    return `<meta name="author" content="${author}">
<meta name="generator" content="${generator}">
<meta name="keywords" content="${keywords}">
<meta name="description" content="${description}">`;
  }

  async formatContent(content, options) {
    options = options || { meta: true, script: true };
    // meta
    if (options.meta) {
      const meta = await this.meta();
      content	= content.replace(/\<\/head\>/i, `${meta}</head>`);
    }

    // ga code
    if (options.script) {
      const gaCode = await this.getConfig('foot_script');
      if (/\<\/body\>/i.test(content)) {
        content	= content.replace(/\<\/body\>/i, `${gaCode}</body>`);
      } else {
        content	= content.replace(/\<\/html\>/i, `${gaCode}</html>`);
      }
    }

    return content;
  }

  path(path, host = 'main') {
    host = `${host}Host`;
    const slashIndex = path.indexOf('/');
    if (slashIndex !== -1) {
      const dir = path.substr(0, slashIndex);
      if (this.app.config[host].path.hasOwnProperty(dir)) {
        return this.app.config[host].path[dir] + path.substr(slashIndex);
      }
    }
    return this.ctx.throwException(Err_Common.Err_Common_Exec);
  }

  url(url, host = 'main') {
    host = `${host}Host`;
    const slashIndex = url.indexOf('/');
    if (slashIndex !== -1) {
      const dir = url.substr(0, slashIndex);
      if (this.app.config[host].url.hasOwnProperty(dir)) {
        return this.app.config[host].url[dir] + url.substr(slashIndex);
      }
    }
    return url;
  }
}

module.exports = CompatService;
