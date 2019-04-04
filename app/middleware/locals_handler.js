'use strict';

module.exports = () => {
  return async function localsHandler(ctx, next) {
    const _nav = await ctx.service.navigation.front();
    ctx.locals = { _nav };
    await next();
  };
};
