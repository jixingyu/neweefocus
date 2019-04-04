'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');

class CommonController extends Controller {
  response(data, code, message, httpCode) {
    const { ctx } = this;
    ctx.body = {
      data,
      code,
      message,
    };
    ctx.status = httpCode;
  }

  success(data = true) {
    this.response(data, 0, '成功', 200);
  }

  async render(path, data) {
    const { app, ctx, service } = this;
    const baseDir = app.config.baseDir;

    // get current user
    const cUser = service.user.getCurrentUser();
    data = { ...data, cUser };

    // get blocks
    let blockKey = path;
    if (path.substr(-5) === '.html') {
      blockKey = path.substr(0, path.length - 5);
    }

    if (app.config.blockPages.hasOwnProperty(blockKey)) {
      const blocks = await service.block.blocks(app.config.blockPages[blockKey]);
      if (!ctx.helper.empty(blocks)) {
        data = { ...data, blocks };
      }
    }

    if (ctx.isMobile) {
      const mPath = `m/${path}`;
      const mViewFullPath = `${baseDir}/app/view/${mPath}`;
      if (fs.existsSync(mViewFullPath)) {
        return await ctx.render(mPath, data);
      }
    }
    // pc rendering
    return await ctx.render(path, data);
  }
}

module.exports = CommonController;
