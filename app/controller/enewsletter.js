'use strict';

const Controller = require('./common');
const fs = require('fs');

class EnewsletterController extends Controller {
  async index() {
    const { ctx, service } = this;
    const page = ctx.query.page || 1;
    const categories = await service.enewsletter.getCategories();
    const where = { status: 1 };
    const { limit, offset } = ctx.pageParams({ page });
    if (ctx.params.categoryId) {
      where.category = ctx.params.categoryId;
    }
    const { count, rows } = await ctx.model.EnewsletterArchive.findAndCountAll({
      where,
      order: [[ 'time_send', 'DESC' ], [ 'time_update', 'DESC' ]],
      limit,
      offset,
      raw: true,
    });
    if (rows) {
      rows.forEach(element => {
        element.category_info = categories.hasOwnProperty(element.category) ? categories[element.category] : null;
      });
    }

    await this.render('enewsletter/index', {
      enewsletters: rows,
      categories,
      paginator: {
        count,
        limit,
        page,
      },
    });
  }

  async detail() {
    const { ctx, service } = this;
    const id = parseInt(ctx.params.id);
    const row = await ctx.model.EnewsletterArchive.findByPk(id);
    if (!row || row.status === 0) {
      return ctx.redirect('/enewsletter');
    }
    row.increment('count_click');
    const file = ctx.service.compat.path('upload/enewsletter/') + row.filename;
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file).toString();
      ctx.body = await service.compat.formatContent(content);
    } else {
      ctx.body = '';
    }
  }
}

module.exports = EnewsletterController;
