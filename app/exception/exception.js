'use strict';
module.exports = class Exception extends Error {
  constructor(err) {
    super(err.message);
    this.code = err.code;
    this.status = err.status || 200;
    this.name = 'cusException';
  }
};
