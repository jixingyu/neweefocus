'use strict';

const Service = require('egg').Service;

class MarkupService extends Service {
  text(content) {
    content = this.ctx.helper.escape(content);
    content = content.replace(/\r?\n/g, '<br />');
    return content;
  }

  render(content, renderer) {
    if (renderer in this) {
      content = this[renderer](content);
    }
    return content;
  }
}

module.exports = MarkupService;
