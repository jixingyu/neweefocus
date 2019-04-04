'use strict';
const Err_Common = require('../error/common');
const fs = require('fs');

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      if (ctx.isXHR) {
        // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        const error = status === 500 && ctx.app.config.env === 'prod' && err.name !== 'cusException'
          ? 'Internal Server Error'
          : err.message;

        ctx.body = {
          code: err.code || Err_Common.Err_Common_Exec,
          error,
        };

        if (ctx.app.config.env === 'local' || status === 422) {
          ctx.body.detail = err.errors;
        }
        ctx.status = status;
      } else {
        const baseDir = ctx.app.config.baseDir;
        if (fs.existsSync(`${baseDir}/app/view/error/${status}.html`)) {
          await ctx.render(`error/${status}`, { message: err.message });
        } else {
          await ctx.render('error/error', { message: err.message });
        }
      }
    }
  };
};
