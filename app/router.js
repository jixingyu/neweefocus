'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const loginAuth = app.middleware.loginAuth();

  router.get('/', controller.home.index);
  router.get('/demo', controller.demo.index);

  // sso router start
  router.get('/login', controller.auth.login);
  router.get('/logout', controller.auth.logout);
  router.get('/sso/slo', controller.auth.slo);
  router.get('/sso/sp', controller.auth.metadata);
  router.post('/sso/assert', controller.auth.assert);
  // sso router end

  // article router start
  router.get('/article', controller.article.index);
  router.get('/article/ajaxDetail/:from', controller.article.ajaxDetail);
  (async () => {
    const ctx = await app.createAnonymousContext();
    const channelReg = await ctx.service.channel.getRouteReg();
    if (channelReg) {
      app.router.get(new RegExp(channelReg), controller.article.detail);
    }
  })();
  // article router end

  // comment router start
  router.get('/comment/list/:rootId(\\d+)', controller.comment.index);
  router.get('/comment/list/:rootId(\\d+)/page/:page(\\d+)', controller.comment.index);
  router.get('/comment/index/load', controller.comment.load);
  router.delete('/api/comment/:id', loginAuth, controller.comment.delete);
  router.post('/api/comment', controller.comment.create);
  router.get('/comment/post/:id', controller.comment.post);
  // comment router end

  // tag router start
  router.get('/tag/:tag', controller.tag.index);
  router.get('/tag/:tag/p:page(\\d+)', controller.tag.index);
  // tag router end

  // enewsletter router start
  router.get('/enewsletter', controller.enewsletter.index);
  router.get('/enewsletter/index/index/cate-:categoryId(\\d+)', controller.enewsletter.index);
  router.get('/enewsletter/index/detail/id-:id(\\d+)', controller.enewsletter.detail);
  // enewsletter router end

  // resource router start
  router.get('/resource', controller.resource.index);
  // resource router end

  // activity router start
  router.get('/original', controller.activity.original);
  router.get('/original/:slugOrId', controller.activity.detail);
  // activity router end

  // captcha router start
  router.get('/captcha/:identifier', controller.captcha.index);
  router.get('/captcha/verify/:identifier/:text', controller.captcha.verify);
  // activity router end
};
