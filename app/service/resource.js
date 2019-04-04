'use strict';

const Service = require('egg').Service;
const enums = require('../enums');

class ResourceService extends Service {
  async clusters(limit = null) {
    const { ctx, app } = this;
    let allItems = await app.redis.get(enums.Redis.resourceSponsors);
    if (allItems === null) {
      const categories = await ctx.model.ResourceCluster.findAll({ where: { depth: 1, active: 1 }, order: [[ 'left', 'ASC' ]], raw: true });
      if (categories && categories.length > 0) {
        allItems = [];
        categories.forEach(element => {
          allItems.push({
            id: element.id,
            title: element.title,
            image: element.image === '' ? '' : ctx.service.compat.url(element.image),
            url: ctx.service.url.getResourceSponsorUrl(element.slug || element.id),
          });
        });
        await app.redis.set(enums.Redis.resourceSponsors, JSON.stringify(allItems), 'EX', app.config.defaultRedisExpire);
      }
    } else {
      allItems = JSON.parse(allItems);
    }
    if (limit) {
      if (allItems && allItems.length > limit) {
        allItems = allItems.splice(0, limit);
      }
    }

    return allItems;
  }

  async newestResources() {
    const { app, ctx } = this;
    const limit = 10;
    const order = [[ 'order', 'DESC' ], [ 'time_publish', 'DESC' ]];
    const columns = [ 'id', 'subject', 'cluster', 'category', 'time_publish', 'image', 'content', 'size', 'type' ];
    let [ clusters, items ] = await Promise.all([
      this.clusters(),
      app.redis.get(enums.Redis.newestResources),
    ]);
    let result = null;
    if (items === null) {
      if (clusters) {
        const clusterIds = [];
        clusters.forEach(element => {
          clusterIds.push(element.id);
        });
        const where = {
          [app.Sequelize.Op.and]: app.Sequelize.literal(`${limit} > (SELECT COUNT(*) FROM eef_resource_article AS b WHERE eef_resource_article.cluster=b.cluster AND eef_resource_article.order<b.order)`),
          cluster: clusterIds,
        };

        items = await ctx.model.ResourceArticle.findAll({
          attributes: columns,
          as: 'a',
          where,
          order,
          raw: true,
        });
        if (items) {
          await app.redis.set(enums.Redis.newestResources, JSON.stringify(items), 'EX', app.config.defaultRedisExpire);
        }
      }
    } else {
      items = JSON.parse(items);
    }
    if (clusters && items) {
      clusters.forEach(element => {
        element.items = [];
        for (const i of items) {
          if (element.id === i.cluster) {
            element.items.push(i);
          }
        }
      });
      result = clusters;
    }

    return result;
  }

  async cluster(slugOrId) {
    if (this.ctx.helper.isNumber(slugOrId)) {
      return await this.ctx.model.ResourceCluster.findByPk(slugOrId);
    }
    return await this.ctx.model.ResourceCluster.findOne({ where: { slug: slugOrId } });

  }

  async getAvailableArticlePage(params) {
    const { app, ctx } = this;
    const defaultWhere = {
      time_publish: { [app.Sequelize.Op.lte]: ctx.helper.now() },
      status: enums.Article.FIELD_STATUS_PUBLISHED,
      active: 1,
    };
    if (params) {
      params.where = { ...defaultWhere, ...params.where };
    } else {
      params = { where: defaultWhere };
    }
    return await this.getArticlePage(params);
  }

  async getArticlePage(params) {
    const { ctx } = this;
    const { columns } = params;

    const order = params.order || [[ 'time_publish', 'DESC' ]];
    const cond = {
      where: params.where,
      order,
      raw: true,
    };
    if (columns) {
      cond.attributes = columns;
    }
    if (limit) {
      cond.limit = limit;
    }
    if (offset) {
      cond.offset = offset;
    }

    return await ctx.model.ResourceArticle.findAll(cond);
  }
}

module.exports = ResourceService;
