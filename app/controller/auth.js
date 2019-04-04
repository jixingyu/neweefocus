'use strict';

const Controller = require('./common');
class AuthController extends Controller {
  async login() {
    const { service } = this;
    await service.auth.login();
  }

  async assert() {
    const { service } = this;
    await service.auth.assert();
  }

  async logout() {
    const { service } = this;
    await service.auth.logout();
  }

  async slo() {
    const { service } = this;
    await service.auth.slo();
  }

  async metadata() {
    const { service, ctx } = this;
    const metadata = await service.auth.metadata();
    ctx.body = metadata;
    ctx.type = 'application/xml';
  }

}

module.exports = AuthController;
