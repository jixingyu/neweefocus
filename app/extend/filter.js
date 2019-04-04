'use strict';

// nunjucks filters

module.exports.shorten = (str, count) => str.slice(0, count || 1);

module.exports.assertUrl = str => {
  return '/public/build' + str;
};

