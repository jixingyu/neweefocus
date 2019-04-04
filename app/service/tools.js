'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha');

class ToolsService extends Service {
  captcha(identifier) {
    const { ctx } = this;
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      bacground: '#cc9966',
    });
    const key = 'captcha_' + identifier;
    ctx.session[key] = {
      text: captcha.text,
      expire: ctx.helper.now() + 120,
    };
    return captcha;
  }

  verifyCaptcha(identifier, text) {
    const { ctx } = this;
    const key = 'captcha_' + identifier;
    const data = ctx.session[key];
    if (data && data.expire > ctx.helper.now()) {
      return data.text.toLowerCase() === text.toLowerCase();
    }
    return false;
  }
}

module.exports = ToolsService;
