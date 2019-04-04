'use strict';

const Controller = require('./common');

class TagController extends Controller {
  async index() {
    const { ctx, service } = this;
    const { limit, offset, page } = ctx.pageParams();
    const { count, rows } = await service.tag.articleIds({ tag: ctx.params.tag, limit, offset });
    let articles = [];
    if (rows && rows.length > 0) {
      articles = await service.article.getAvailableArticlePage({
        where: { id: rows },
        columns: [ 'id', 'subject', 'time_publish', 'channel', 'category', 'recommended', 'image', 'summary', 'tag' ],
        page: 1,
      });
    }
    await this.render('tag/index', {
      articles,
      paginator: {
        count,
        limit,
        page,
      },
    });
  }
}

module.exports = TagController;
