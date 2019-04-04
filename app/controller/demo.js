'use strict';

const Controller = require('./common');

class DemoController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = {
      currentUser: service.user.getCurrentUser(),
    };
    await ctx.render('demo/index.html', data);
  }
}

module.exports = DemoController;
