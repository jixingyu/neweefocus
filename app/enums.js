'use strict';

exports.Article = {
  FIELD_STATUS_PUBLISHED: 11,
  FIELD_STATUS_DELETED: 12,

  FIELD_RELATED_TYPE_OFF: 0,
  FIELD_RELATED_TYPE_AUTO: 1,
  FIELD_RELATED_TYPE_CUSTOM: 2,

  FIELD_SEO_SITE_DEFAULT: 0,
  FIELD_SEO_TITLE_ARTICLE: 1,
  FIELD_SEO_TITLE_CATEGORY: 2,
  FIELD_SEO_KEYWORDS_TAG: 1,
  FIELD_SEO_KEYWORDS_CATEGORY: 2,
  FIELD_SEO_DESCRIPTION_SUMMARY: 1,
};

exports.Asset = {
  FIELD_TYPE_IMAGE: 'image',
  FIELD_TYPE_ATTACHMENT: 'attachment',
};

const prefix = 'newEef_';
exports.Redis = {
  channelList: prefix + 'channelList',
  categoryList: prefix + 'categoryList',
  blockPrefix: prefix + 'block_',
  navFront: prefix + 'navFront',
  eefConfigPrefix: prefix + 'eefConfig_',
  eefArticleConfigPrefix: prefix + 'eefArticleConfig_',
  newestResources: prefix + 'newestResources',
  articleCount: prefix + 'articleCount',
  articleCommentPrefix: prefix + 'articleComment_',
  commentCategoriesPrefix: prefix + 'commentCategories_',
};

exports.EefModule = {
  article: 'article',
  resource: 'resource',
  channel: 'channel',
};
