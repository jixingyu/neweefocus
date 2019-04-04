'use strict';

const Service = require('egg').Service;
const axios = require('axios');
const eefocusApi = require('../api').eefocus;
class UserService extends Service {

  getCurrentUser(key) {
    const { ctx } = this;
    const currentUser = ctx.session.currentUser;
    if (currentUser) {
      if (key) {
        if (currentUser[key]) {
          return currentUser[key];
        }
      } else {
        return currentUser;
      }
    }
    return null;
  }

  setCurrentUser(user) {
    const { ctx } = this;
    ctx.session.currentUser = user;
  }

  deleteCurrentUser() {
    const { ctx } = this;
    delete ctx.session.currentUser;
  }

  async getAvatar(id, size = 80) {
    const result = await axios.get(eefocusApi.getAvatar, {
      auth: this.config.eefApiAuth,
      params: {
        id,
        size,
        html: 0,
      },
    });
    return result.data.data;
  }

  async getAvatars(uids, size) {
    const result = await axios.get(eefocusApi.mgetAvatar, {
      auth: this.config.eefApiAuth,
      params: {
        id: uids.join(','),
        size,
        html: 0,
      },
    });
    return result.data;
  }

  async initUserFromSSO(uid) {
    // join member
    const { ctx } = this;
    if (ctx.helper.empty(uid)) {
      return false;
    }

    const exist = await ctx.model.Member.count({ where: { uid } });

    if (!exist) {
      await ctx.model.Member.create({
        uid,
        time: ctx.helper.now(),
      });
      // Call the remote API to check if the user is join in this community
      const url = ctx.helper.formatString(eefocusApi.checkJoin, {
        uid,
      });
      const result = await axios.get(url);
      if (result.data === 0) {
        const joinUrl = ctx.helper.formatString(eefocusApi.join, {
          uid,
        });
        await axios.get(joinUrl);
      }
    }

    return true;
  }

  async getUser(uid, fields) {
    let id;
    let uri;
    if (Array.isArray(uid)) {
      id = uid.join(',');
      uri = eefocusApi.uclientMget;
    } else {
      id = uid;
      uri = eefocusApi.uclientGet;
    }
    const params = { id };
    if (typeof fields !== 'undefined') {
      params.field = Array.isArray(fields) ? fields.join(',') : fields;
    }
    const result = await axios.get(uri, {
      auth: this.config.eefApiAuth,
      params,
    });
    return result.data;
  }

  async addTimeline(params) {
    const { ctx } = this;
    params.time = params.time || ctx.helper.now();
    const currentUid = this.getCurrentUser('id');
    params.uid = params.uid || currentUid;
    if (!params.uid) {
      return false;
    }
    params.app_key = params.app_key || this.config.mainHost.identifier;
    const result = await axios.post(eefocusApi.timelineAdd, params, {
      auth: this.config.eefApiAuth,
    });
    return result.data;
  }
}

module.exports = UserService;
