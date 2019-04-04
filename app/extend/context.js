'use strict';
const MobileDetect = require('mobile-detect');
const ISXHR = Symbol('Context#isXHR');
const ISMobile = Symbol('Context#isMobile');
const Exception = require('../exception/exception');

module.exports = {
  get isXHR() {
    if (typeof this[ISXHR] === 'undefined') {
      this[ISXHR] = this.get('X-Requested-With') === 'XMLHttpRequest' || this.get('content-type') === 'application/json';
    }
    return this[ISXHR];
  },

  get isMobile() {
    if (typeof this[ISMobile] === 'undefined') {
      const ua = this.request.headers['user-agent'];
      const md = new MobileDetect(ua);
      this[ISMobile] = md.mobile() != null;
    }
    return this[ISMobile];
  },

  pageParams(setParams) {
    let page = (setParams && setParams.page) ? setParams.page : this.params.page;
    page = parseInt(page);
    if (!page || page <= 0) {
      page = 1;
    }
    const limit = (setParams && setParams.perPage) ? setParams.perPage : this.app.config.perPage;
    const offset = (page - 1) * limit;
    return { limit, offset, page };
  },
  throwException(errObj) {
    throw new Exception(errObj);
  },
};
