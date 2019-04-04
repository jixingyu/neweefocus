'use strict';

const Controller = require('./common');
const Err_Common = require('../error/common');
const Err_Article = require('../error/article');

class ArticleController extends Controller {
  async index() {
    const { service, ctx } = this;
    const { limit, offset, page } = ctx.pageParams();
    const [ articles, count ] = await Promise.all([
      service.article.getAvailableArticlePage({ limit, offset }),
      service.article.getAvailableArticleCount(),
    ]);
    await this.render('article/index', {
      articles,
      paginator: {
        count,
        limit,
        page,
      },
    });
  }

  async detail() {
    const { app, ctx, service } = this;
    const channel = ctx.params[0];
    const id = ctx.params[1];
    const slug = ctx.params[2] || '';
    let remain = null;
    if (typeof ctx.params[2] !== 'undefined') {
      const pageOrRemain = ctx.params[2].substr(0, 1);
      if (pageOrRemain === 'p') {
        const page = ctx.params[2].substr(1);
      } else {
        remain = ctx.params[2].substr(1);
      }
    }
    // EEFOCUS TODO preview, seo title from config
    const article = await service.article.getArticle(id);
    if (ctx.helper.empty(article)) {
      ctx.throwException(Err_Common.Err_Common_404);
    }
    const entity = await service.channel.entity(id);
    const channelSet = await service.channel.get(channel);
    if (!entity || entity.time > ctx.helper.now() || entity.channel !== channelSet.id) {
      ctx.throwException(Err_Common.Err_Common_404);
    }
    if (entity.active === 0) {
      ctx.throwException(Err_Article.Not_Active);
    }
    entity.slug = entity.slug || '';
    if (slug !== entity.slug) {
      return ctx.redirect(service.url.getArticleUrl({ id, channel, slug: entity.slug }));
    }
    const seoTitle = `${article.subject}-${channelSet.title}-${app.config.sitename}`;
    const category = await service.channel.getCategory(entity.category, channelSet.id);
    const breadCrumbs = this.getBreadCrumbs(channelSet, 'detail', category, article.subject);
    await this.render('article/detail', {
      article,
      remain,
      seoTitle,
      breadCrumbs,
    });
  }

  async ajaxDetail() {
    const { ctx, service } = this;
    const id = ctx.params.from;

    const article = await service.article.relate(id);
    const html = await ctx.renderView('article/ajax_detail', {
      article,
    });
    this.success(html);
  }

  getBreadCrumbs(channel, type, category, detail = null) {
    const breadCrumbs = {
      home: {
        name: 'EEFOCUS 主页',
        url: this.app.config.host,
      },
      channel: {
        name: channel.title,
        url: this.ctx.helper.siteUrl(channel.slug),
      },
      category: {
        name: category.category_title,
        url: this.ctx.helper.siteUrl(`${channel.slug}/list-${category.slug}`),
      },
    };

    if (type === 'detail') {
      breadCrumbs.detail = {
        name: detail,
      };
    }

    return breadCrumbs;
  }
}

module.exports = ArticleController;
