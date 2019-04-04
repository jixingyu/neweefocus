'use strict';

const Controller = require('./common');

class TagController extends Controller {
  async index() {
    const { service } = this;
    const clusters = await service.resource.clusters(12);
    const newestResources = await service.resource.newestResources();
    await this.render('resource/index', {
      clusters,
      newestResources,
    });
  }
}

module.exports = TagController;
