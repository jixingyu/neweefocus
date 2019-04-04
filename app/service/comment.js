'use strict';

const Service = require('egg').Service;
const enums = require('../enums');
const Err_Common = require('../error/common');
const Err_Comment = require('../error/comment');

class CommentService extends Service {
  async loadContent(uri) {
    const { ctx } = this;
    const match = await ctx.service.channel.matchRoute(uri);
    if (match) {
      const root = match.id;
      const rootData = await ctx.articleModel.CommentRoot.findOne({
        raw: true,
        where: {
          item: root,
          module: enums.EefModule.channel,
          category: enums.EefModule.article,
        },
      });
      if (rootData) {
        const articleComment = await this.loadCache(rootData.id);
        if (articleComment) {
          return articleComment;
        }
        let [ limit, operation ] = await Promise.all([
          ctx.service.compat.getArticleConfig('leading_limit', 'comment'),
          ctx.service.compat.getArticleConfig('display_operation', 'comment'),
        ]);
        limit = parseInt(limit);
        const { count, rows } = await this.getList(rootData.id, limit, 0);
        if (count) {
          const renderOptions = {
            operation,
            user: {
              avatar: 'medium',
            },
          };
          const posts = await this.renderList(rows, renderOptions);
          const result = {
            root: rootData,
            count,
            posts,
            url_list: ctx.service.url.getCommentUrl('root', { root: rootData.id }),
            url_submit: ctx.service.url.getCommentUrl('submit'),
          };
          this.saveCache(rootData.id, result);
          return result;
        }
      }
    }
    return null;
  }

  async loadCache(key) {
    const { app } = this;
    let articleComment = await app.redis.get(enums.Redis.articleCommentPrefix + key);
    if (articleComment !== null) {
      articleComment = JSON.parse(articleComment);
    }
    return articleComment;
  }

  async saveCache(key, value) {
    const app = this.app;
    return await app.redis.set(enums.Redis.articleCommentPrefix + key, JSON.stringify(value), 'EX', app.config.defaultRedisExpire);
  }

  async clearCache(key) {
    await this.app.redis.del(enums.Redis.articleCommentPrefix + key);
  }

  async getList(rootId, limit, offset) {
    const { ctx } = this;
    return await ctx.articleModel.CommentPost.findAndCountAll({
      raw: true,
      where: {
        root: rootId,
        active: 1,
      },
      order: [[ 'time', 'DESC' ]],
      limit,
      offset,
    });
  }

  async renderList(posts, options) {
    const { ctx } = this;
    if (!Array.isArray(posts) || posts.length <= 0) {
      return posts;
    }
    const ops = {};

    options.user = options.user || {};
    const field = options.user.field || 'name';
    const avatar = options.user.avatar || 'small';
    const uids = [];
    let hasGuest = false;
    posts.forEach(element => {
      if (element.uid === 0) {
        hasGuest = true;
      } else if (uids.indexOf(element.uid) === -1) {
        uids.push(element.uid);
      }
    });
    const [ users, avatars ] = await Promise.all([
      ctx.service.user.getUser(uids, field),
      ctx.service.user.getAvatars(uids, avatar),
    ]);
    for (const i in users) {
      users[i].url = ctx.service.url.getProfileUrl(users[i].id);
      users[i].avatar = avatars[users[i].id];
    }
    if (hasGuest) {
      users['0'] = {
        name: '访客',
        url: this.app.config.host,
        avatar: await ctx.service.user.getAvatar(0, avatar),
      };
    }
    ops.users = users;

    // operation
    options.operation = options.operation || {};
    if (typeof options.operation === 'string') {
      options.operation = { level: options.operation };
    }
    const level = options.operation.level ? options.operation.level : 'author';
    const uid = typeof options.operation.uid !== 'undefined' ? options.operation.uid : ctx.service.user.getCurrentUser('id');
    const list = options.operation.list ? options.operation.list : {
      edit: '编辑',
      approve: '启用',
      delete: '删除',
      reply: '回复',
    };

    const setOperations = post => {
      let opList = [];
      if (level === 'author' && uid === post.uid) {
        opList = [ 'delete' ];
      } else if (uid) {
        opList = [];
      } else {
        opList = [];
      }
      const operations = {};
      for (const op of opList) {
        if (!list.hasOwnProperty(op)) {
          continue;
        }
        let title = '';
        let url = '';
        // let flag;
        switch (op) {
          case 'delete':
            url = ctx.service.url.getCommentUrl(op, {
              post: post.id,
            });
            title = list[op];
            break;
          // case 'approve':
          //   if (post.active) {
          //     flag = 0;
          //     title = '禁用';
          //   } else {
          //     flag = 1;
          //     title = '启用';
          //   }
          //   url = ctx.service.url.getCommentUrl(op, {
          //     post: post.id,
          //     flag,
          //   });
          //   break;
          // case 'reply':
          //   url = ctx.service.url.getCommentUrl(op, {
          //     post: post.id,
          //   });
          //   title = list[op];
          //   break;
          default:
            break;
        }
        if (url === '' || title === '') {
          continue;
        }

        operations[op] = { title, url };
      }

      return operations;
    };

    // EEFOCUS TODO target

    posts.forEach(post => {
      post.content = this.renderPost(post);

      if (!ctx.helper.empty(ops.users)) {
        if (ops.users.hasOwnProperty(post.uid)) {
          post.user = ops.users[post.uid];
        } else {
          post.user = ops.users['0'];
        }
      }
      post.operations = setOperations(post);
    });
    return posts;
  }

  renderPost(post) {
    const { ctx } = this;
    let content = '';
    let markup = 'text';
    if (typeof post === 'string') {
      content = post;
    } else {
      content = post.content;
      markup = post.markup;
    }
    const renderer = (markup === 'markdown' || markup === 'html') ? 'html' : 'text';
    return ctx.service.markup.render(content, renderer);
  }

  async getTarget(root) {
    const { ctx } = this;
    const rootData = await ctx.articleModel.CommentRoot.findByPk(root);
    if (rootData && rootData.category === 'article') {
      const article = await this.getArticle(rootData.item);
      return {
        subject: article.subject,
        url: article.url,
      };
    }
    return false;
  }

  async getArticle(item) {
    const { ctx } = this;
    const [ article, channels ] = await Promise.all([
      ctx.articleModel.Article.findOne({
        attributes: [ 'subject', 'slug', 'channel', 'user' ],
        where: { id: item },
        raw: true,
      }),
      ctx.service.channel.getList(),
    ]);
    let channel;
    if (channels.hasOwnProperty(article.channel) && channels[article.channel].slug !== '') {
      channel = channels[article.channel].slug;
    } else {
      channel = article.channel;
    }
    return {
      subject: article.subject,
      uid: article.user,
      url: ctx.service.url.getArticleUrl({ channel, id: item, slug: article.slug }),
    };
  }

  async processPost() {
    const { ctx } = this;
    const [ currentUid, configs ] = await Promise.all([
      ctx.service.user.getCurrentUser('id'),
      ctx.service.compat.getArticleConfig(null, 'comment'),
    ]);
    const [ allowAnony, loginCaptcha, captcha, autoApprove ] = [ configs.allow_anonymous, configs.login_not_captcha, configs.captcha, configs.auto_approve ];
    if (!currentUid && allowAnony !== '1') {
      ctx.throwException(Err_Common.Err_Common_No_Auth);
    }
    const data = ctx.request.body;
    data.markup = 'text';
    let needCapture = false;
    if (currentUid && loginCaptcha === '1') {
      needCapture = true;
    } else if (!currentUid && captcha === '1') {
      needCapture = true;
    }
    if (needCapture) {
      // check capture
    }
    ctx.validate({
      content: { type: 'string', required: true, trim: true },
      id: { type: 'int' },
      root: { type: 'int' },
      reply: { type: 'int' },
      module: { type: 'string', trim: true },
      category: { type: 'string', trim: true },
      item: { type: 'string', trim: true },
      markup: { type: 'string', trim: true },
      redirect: { type: 'string', trim: true },
    }, data);
    data.root = parseInt(data.root);
    if (data.root > 0) {
      const root = await ctx.articleModel.CommentRoot.findByPk(data.root);
      if (!root) {
        ctx.throwException(Err_Comment.Root_Not_Fount);
      } else if (root.active === 0) {
        ctx.throwException(Err_Comment.Disabled);
      }
    }
    // EEFOCUS TODO edit
    data.id = 0;
    // new
    data.active = autoApprove === '1' ? 1 : 0;
    data.uid = currentUid || 0;
    data.ip = ctx.ip;
    const post = await this.addPost(data);
    if (post) {
      const isEnabled = !!data.active;
      if (isEnabled) {
        // publish
        this.clearCache(post.root);
        // add timeline for user
        this.timeline(post.id);
      }
    }
    return post.id;
  }

  async timeline(id, uid = null) {
    const { ctx } = this;
    uid = uid || ctx.service.user.getCurrentUser('id');
    if (!uid) {
      return false;
    }

    const params = {
      uid,
      message: '发表新评论。',
      timeline: 'new_comment',
      module: 'comment',
      link: ctx.service.url.getCommentUrl('post', { post: id }),
      app_key: ctx.helper.config.articleHost.identifier,
    };
    return await ctx.service.user.addTimeline(params);
  }

  async addPost(data) {
    const { ctx } = this;
    if (data.root === 0) {
      const rootId = await this.addRoot(data);
      if (!rootId) {
        return false;
      }
    } else {
      const root = await ctx.articleModel.CommentRoot.findByPk(data.root);
      if (!root) {
        return false;
      }
      const category = this.readCategory(root.module, root.category);
      if (!category) {
        return false;
      }
      data.module = root.module;
    }
    data.time = ctx.helper.now();
    const saveData = { reply: 0 };
    [ 'uid', 'root', 'content', 'markup', 'time', 'active', 'ip', 'module' ].forEach(element => {
      saveData[element] = data[element];
    });
    const post = await ctx.articleModel.CommentPost.create(saveData);
    return { id: post.id, root: post.root };
  }

  async addRoot(data) {
    const category = this.readCategory(data.module, data.category);
    if (!category) {
      return false;
    }
    if (!data.author) {
      const article = await this.getArticle(data.item);
      data.author = article.uid;
    }
    const root = await this.ctx.articleModel.CommentRoot.create({
      module: data.module,
      category: data.category,
      item: data.item,
      active: data.active,
      author: data.author,
    });
    return root.id;
  }

  async readCategory(module, category) {
    const { app, ctx } = this;
    let commentCategories = await app.redis.get(enums.Redis.commentCategoriesPrefix + module);
    if (commentCategories === null) {
      const categoryRows = await ctx.articleModel.CommentCategory.findAll({ raw: true, where: { module } });
      commentCategories = {};
      categoryRows.forEach(element => {
        commentCategories[element.name] = element;
      });
      await app.redis.set(enums.Redis.commentCategoriesPrefix + module, JSON.stringify(commentCategories), 'EX', app.config.defaultRedisExpire);
    } else {
      commentCategories = JSON.parse(commentCategories);
    }
    if (commentCategories && commentCategories.hasOwnProperty(category)) {
      return commentCategories[category];
    }
    return false;
  }
}

module.exports = CommentService;
