'use strict';

const Controller = require('./common');

class HomeController extends Controller {
  async index() {
    await this.render('demo/index.html');
  }
}

module.exports = HomeController;
