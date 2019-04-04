'use strict';

const Service = require('egg').Service;

class UrlService extends Service {
  getArticleUrl(params) {
    const { ctx } = this;
    const { channel, id, slug } = params;
    if (ctx.helper.empty(slug)) {
      return ctx.helper.siteUrl(`${channel}/${id}`);
    }
    return ctx.helper.siteUrl(`${channel}/${id}-${slug}`);
  }

  getChannelUrl(slug) {
    return this.ctx.helper.siteUrl(slug);
  }

  getEnewsletterCategoryUrl(id) {
    return this.ctx.helper.siteUrl(`enewsletter/index/index/cate-${id}`);
  }

  getActivityUrl(slugOrId) {
    return this.ctx.helper.siteUrl(`original/${slugOrId}`);
  }

  getResourceSponsorUrl(slugOrId) {
    return this.ctx.helper.siteUrl(`resource/${slugOrId}`);
  }

  getProfileUrl(uid) {
    const accountHost = this.app.config.accountHost.host;
    return `${accountHost}/user/profile/${uid}`;
  }

  getCommentUrl(type, options) {
    let url = '';
    switch (type) {
      case 'delete':
        url = this.ctx.helper.siteUrl(`api/comment/${options.post}`);
        break;
      case 'submit':
        url = this.ctx.helper.siteUrl('api/comment');
        break;
      case 'root':
        url = this.ctx.helper.siteUrl(`comment/list/${options.root}`);
        break;
      case 'post':
        url = this.ctx.helper.siteUrl(`comment/post/${options.post}`);
        break;

      default:
        break;
    }
    return url;
  }
}

module.exports = UrlService;
