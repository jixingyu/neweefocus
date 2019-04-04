'use strict';

const Service = require('egg').Service;
const path = require('path');

class ImageService extends Service {
  getThumbFromOriginal(filepath) {
    const fileinfo = path.parse(filepath);
    return path.join(fileinfo.dir, fileinfo.name + '-thumb' + fileinfo.ext);
  }
}

module.exports = ImageService;
