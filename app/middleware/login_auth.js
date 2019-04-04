'use strict';
// 登录验证中间件
const Err_Common = require('../error/common');
module.exports = () => {
  return async function(ctx, next) {

    const ignoreList = [

    ];
    const httpPath = ctx.request.url;
    let isIgnored = false;
    for (let idx = 0; idx < ignoreList.length; idx++) {
      const pattern = '^' + ignoreList[idx] + '/?';
      const re = new RegExp(pattern);
      if (re.test(httpPath)) {
        isIgnored = true;
      }
    }
    if (isIgnored || ctx.service.user.getCurrentUser()) {
      await next();
    } else {
      if (ctx.isXHR) {
        ctx.body = {
          data: null,
          code: Err_Common.Err_Common_Not_Login.code,
          message: Err_Common.Err_Common_Not_Login.message,
        };
        ctx.status = 401;
      } else {
        //  show sso page
        ctx.redirect('/login');
      }
    }
  };
};
