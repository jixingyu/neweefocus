'use strict';

const Controller = require('./common');

class CaptchaController extends Controller {
  async index() {
    const { ctx, service } = this;
    let identifier = ctx.params.identifier;
    if (/[^A-Za-z0-9]/.test(identifier)) {
      identifier = 'example';
    }
    const captcha = service.tools.captcha(identifier);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }

  async verify() {
    const { ctx, service } = this;
    let identifier = ctx.params.identifier;
    const text = ctx.params.text;
    if (/[^A-Za-z0-9]/.test(identifier)) {
      identifier = 'example';
    }
    this.success(service.tools.verifyCaptcha(identifier, text));
  }
}

module.exports = CaptchaController;
