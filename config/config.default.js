/* eslint valid-jsdoc: "off" */

'use strict';
const fs = require('fs');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551324351150_5941';

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  // add your middleware config here
  config.middleware = [ 'localsHandler', 'errorHandler' ];
  // config.mysql = {
  //   clients: {
  //     eefocus: {
  //       host: '192.168.2.82',
  //       port: '3309',
  //       user: 'wyx',
  //       password: 'yunxiang',
  //       database: 'pi_main_eefocus',
  //     },
  //   },
  // };
  config.sequelize = {
    datasources: [
      {
        delegate: 'model', // load all models to app.model and ctx.model
        baseDir: 'model', // load models from `app/model/*.js`
        dialect: 'mysql',
        host: '192.168.2.82',
        port: 3309,
        database: 'pi_main_eefocus',
        username: 'wyx',
        password: 'yunxiang',
        define: {
          timestamps: false,
        },
        operatorsAliases: false,
      },
      {
        delegate: 'articleModel', // load all models to app.articleModel and ctx.articleModel
        baseDir: 'article_model', // load models from `app/article_model/*.js`
        dialect: 'mysql',
        host: '192.168.2.82',
        port: 3309,
        database: 'pi_article_eefocus',
        username: 'wyx',
        password: 'yunxiang',
        define: {
          timestamps: false,
        },
        operatorsAliases: false,
      },
    ],
  };

  //  sso config
  config.host = 'http://127.0.0.1:7001';
  config.sso = {
    sp: {
      entity_id: config.host + '/sso/sp',
      private_key: fs.readFileSync('./config/sso/server.pem').toString(),
      certificate: fs.readFileSync('./config/sso/server.crt').toString(),
      assert_endpoint: config.host + '/sso/assert',
      //  force_authn: true,
      nameid_format: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
      sign_get_request: false,
      allow_unencrypted_assertion: true,
    },
    idp: {
      sso_login_url: 'https://sso.eefocus.com/saml2/idp/SSOService.php',
      sso_logout_url: 'https://sso.eefocus.com/saml2/idp/SingleLogoutService.php',
      certificates: [
        fs.readFileSync('./config/sso/sso-eefocus-com.crt').toString(),
      ],
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '192.168.0.196',
      password: '',
      db: 0,
    },
  };

  config.session = {
    key: 'EEHUB_SESS',
    maxAge: 8 * 3600 * 1000, // 8h
    httpOnly: false,
    encrypt: true,
  };

  config.security = {
    csrf: false, // EEFOCUS TODO
    // csrf: {
    //   ignore: '/sso/assert',
    // },
    domainWhiteList: [ '127.0.0.1', 'sso.eefocus.com' ],
  };
  config.validate = {
    convert: true,
    // validateRoot: false,
  };

  // add your user config here
  const userConfig = {
    sitename: '与非网',
    // myAppName: 'egg',
    eefApiAuth: {
      username: 'pi',
      password: 'www912ac5eefocuscb9195com',
    },
    perPage: 10,
    defaultRedisExpire: 300,
    article: {
      enableTag: true,
      defaultAuthorPhoto: 'image/default-author.png',
    },
    blockPages: {
      'article/index': [ 'widget-editor-recommended-news', 'widget-moore8-webcast', 'widget-main-hot', 'widget-recommended-image', 'widget-rolling-info-home' ],
    },
    blockFilters: {
      'widget-moore8-webcast': 'webcastList',
      'widget-rolling-info-home': 'adHome',
    },
    mainHost: {
      path: {
        upload: '/Users/hypnos/Work/git/neweefocus/uploads', // '/data/vhosts/main.eefocus.com/upload'
      },
      url: {
        upload: 'https://upload.semidata.info/www.eefocus.com',
      },
      identifier: 'pi250d',
    },
    accountHost: {
      host: 'https://account.eefocus.com',
    },
    articleHost: {
      identifier: 'pib2a5',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
