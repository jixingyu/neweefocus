'use strict';

const Service = require('egg').Service;
const saml2 = require('saml2-js');
class AuthService extends Service {
  async login() {
    const { config, ctx } = this;
    const sp = new saml2.ServiceProvider(config.sso.sp);
    const idp = new saml2.IdentityProvider(config.sso.idp);
    ctx.session.sso_referer = ctx.query.referer ? ctx.query.referer : '/';
    const login_url = await new Promise((resolve, reject) => {
      sp.create_login_request_url(idp, {}, (err, login_url) => {
        if (err != null) {
          reject('create_login_request_url error');
        }
        resolve(login_url);
      });
    });
    ctx.redirect(login_url);
  }

  async assert() {
    const { config, ctx, service } = this;
    const options = { request_body: ctx.request.body };
    const idp = new saml2.IdentityProvider(config.sso.idp);
    const sp = new saml2.ServiceProvider(config.sso.sp);
    const user = await new Promise((resolve, reject) => {
      sp.post_assert(idp, options, (err, saml_response) => {
        if (err != null) {
          reject(`sso assert error:${err.message}`);
        }
        resolve(saml_response.user);
      });
    });
    ctx.session.sso_logout = {
      name_id: user.name_id,
      session_index: user.session_index,
    };
    // 转换数据结构
    const keys = Object.keys(user.attributes);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      user.attributes[key] = user.attributes[key][0];
    }
    await service.user.initUserFromSSO(user.attributes.id);
    service.user.setCurrentUser({
      id: parseInt(user.attributes.id),
      nickname: user.attributes.nickname,
      miniAvatar: await service.user.getAvatar(user.attributes.id, 'mini'),
    });
    ctx.redirect(ctx.session.sso_referer);
  }

  async logout() {

    const { config, ctx } = this;
    const options = {
      name_id: ctx.session.sso_logout.name_id || '',
      session_index: ctx.session.sso_logout.session_index || '',
    };
    const sp = new saml2.ServiceProvider(config.sso.sp);
    const idp = new saml2.IdentityProvider(config.sso.idp);
    const logout_url = await new Promise((resolve, reject) => {
      sp.create_logout_request_url(idp, options, (err, logout_url) => {
        if (err != null) {
          reject(err.message);
        } else {
          resolve(logout_url);
        }
      });
    });
    ctx.redirect(logout_url);

  }

  async slo() {
    const { config, ctx, service } = this;
    const query = ctx.request.query;

    if (query.SAMLResponse !== undefined) {
      service.user.deleteCurrentUser();
      return ctx.redirect('/');
    } else if (query.SAMLRequest !== undefined) {
      const options = {
        relay_state: query.RelayState,
        name_id: ctx.session.sso_logout.name_id || '',
        session_index: ctx.session.sso_logout.session_index || '',
      };
      const sp = new saml2.ServiceProvider(config.sso.sp);
      const idp = new saml2.IdentityProvider(config.sso.idp);
      const logout_url = await new Promise((resolve, reject) => {
        sp.create_logout_response_url(idp, options, (err, logout_url) => {
          if (err != null) {
            reject(err.message);
          } else {
            resolve(logout_url);
          }
        });
      });
      service.user.deleteCurrentUser();
      ctx.redirect(logout_url);
    }
  }

  async metadata() {
    const { config } = this;
    const sp = new saml2.ServiceProvider(config.sso.sp);
    const metadata = sp.create_metadata();
    return metadata;
  }

}

module.exports = AuthService;
