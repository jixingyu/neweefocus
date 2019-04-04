'use strict';

const Controller = require('./common');
const Err_Common = require('../error/common');

class CommentController extends Controller {
  async index() {
    const { ctx, service } = this;
    const rootId = parseInt(ctx.params.rootId) || 1;
    const root = await ctx.articleModel.CommentRoot.findByPk(rootId);
    let isActive = null;
    let count = null;
    let target = null;
    let posts = null;
    const { limit, offset, page } = ctx.pageParams();

    if (root) {
      isActive = root.active;
      const result = await service.comment.getList(rootId, limit, offset);
      posts = result.rows;
      count = result.count;
      const renderOptions = {
        operation: await service.compat.getArticleConfig('display_operation', 'comment'),
        user: {
          avatar: 'medium',
        },
      };
      posts = await service.comment.renderList(posts, renderOptions);

      target = await service.comment.getTarget(rootId);
    }

    await this.render('comment/index', {
      root: rootId,
      active: isActive,
      target,
      posts,
      paginator: {
        count,
        limit,
        page,
      },
    });
  }

  async post() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    const post = await ctx.articleModel.CommentPost.findByPk(id, { raw: true });
    if (!post || post.active === 0) {
      ctx.throwException(Err_Common.Err_Common_Parms_Wrong);
    }
    post.content = service.comment.renderPost(post);
    const target = await service.comment.getTarget(post.root);
    const data = { post, target };
    if (post.uid) {
      const [ user, avatar ] = await Promise.all([
        service.user.getUser(post.uid, 'name'),
        service.user.getAvatar(post.uid),
      ]);
      post.user = { name: user.name, avatar, url: service.url.getProfileUrl(post.uid) };
    }
    await this.render('comment/post', data);
  }

  async load() {
    const { ctx } = this;
    const content = await ctx.service.comment.loadContent(ctx.query.uri);
    this.success(content);
  }

  async delete() {
    const { ctx, service } = this;

    const id = ctx.params.id;
    const currentUid = service.user.getCurrentUser('id');
    // 验参
    ctx.validate({ type: 'int', min: 1 }, { id });

    const post = await ctx.articleModel.CommentPost.findByPk(id);
    if (!post || post.uid !== currentUid) {
      ctx.throwException(Err_Common.Err_Common_Parms_Wrong);
    }
    await post.destroy();
    service.comment.clearCache(post.root);
    this.success();
  }

  async create() {
    const { ctx } = this;
    const result = await this.service.comment.processPost();
    if (result) {
      this.success();
    } else {
      ctx.throwException(Err_Common.Err_Common_Exec);
    }
  }
}

module.exports = CommentController;
