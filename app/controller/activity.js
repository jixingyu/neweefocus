'use strict';

const Controller = require('./common');
const fs = require('fs');

class ActivityController extends Controller {
  async original() {
    const { ctx } = this;
    const page = ctx.query.page || 1;
    const where = { status: 1 };
    const { limit, offset } = ctx.pageParams({ page });

    const { count, rows } = await ctx.model.Activity.findAndCountAll({
      where,
      order: [[ 'time_update', 'DESC' ]],
      limit,
      offset,
      raw: true,
    });
    if (rows) {
      rows.forEach(element => {
        element.url = ctx.service.url.getActivityUrl(element.slug !== '' ? element.slug : element.id);
      });
    }

    await this.render('activity/original', {
      activities: rows,
      paginator: {
        count,
        limit,
        page,
      },
    });
  }

  async detail() {
    const { ctx, service } = this;
    const slugOrId = ctx.params.slugOrId;
    let row;
    if (ctx.helper.isNumber(slugOrId)) {
      row = await ctx.model.Activity.findByPk(slugOrId);
    } else {
      row = await ctx.model.Activity.findOne({ where: { slug: slugOrId } });
    }
    if (!row || row.status === 0) {
      return ctx.redirect('/original');
    }

    // add visit record
    const uid = ctx.service.user.getCurrentUser('id');
    ctx.model.ActivityVisit.create({
      item: row.id,
      time: ctx.helper.now(),
      ip: ctx.ip,
      uid: uid ? uid : 0,
    });
    row.increment('count_click');

    if (row.url !== '') {
      return ctx.redirect(row.url);
    }
    const file = ctx.service.compat.path('upload/activity/') + row.filename;
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file).toString();
      ctx.body = await service.compat.formatContent(content, { script: true });
    } else {
      ctx.body = '';
    }
  }
}

module.exports = ActivityController;
