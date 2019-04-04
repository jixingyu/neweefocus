'use strict';

exports.now = () => parseInt(Date.now() / 1000); // 时间戳秒级
/**
 * 平级结构转层级
 * @param {Array} arr 平级结构
 * @return {Array} 层级结构
 */
exports.unflatten = function(arr) {
  const tree = [];
  const mappedArr = {};
  let arrElem;
  let mappedElem;
  // First map the nodes of the array to an object -> create a hash table.
  for (let i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id].children = [];
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parent_id) {
        mappedArr[mappedElem.parent_id].children.push(mappedElem);
        mappedArr[mappedElem.parent_id].children.sort((a, b) => a.order - b.order);
      } else { // If the element is at the root level, add it to first level elements array.
        tree.push(mappedElem);
        tree.sort((a, b) => a.order - b.order);
      }
    }
  }
  return tree;
};


exports.flattenTree = function(root, key) {
  const flatten = [ Object.assign({}, root) ];
  delete flatten[0][key];

  if (root[key] && root[key].length > 0) {
    return flatten.concat(root[key]
      .map(child => this.flattenTree(child, key))
      .reduce((a, b) => a.concat(b), [])
    );
  }

  return flatten;
};

exports.multiSort = function(array, sortObject = {}) {
  const sortKeys = Object.keys(sortObject);

  // Return array if no sort object is supplied.
  if (!sortKeys.length) {
    return array;
  }

  // Change the values of the sortObject keys to -1, 0, or 1.
  for (const key in sortObject) {
    sortObject[key] = sortObject[key] === 'desc' || sortObject[key] === -1 ? -1
      : (sortObject[key] === 'skip' || sortObject[key] === 0 ? 0 : 1);
  }

  const keySort = (a, b, direction) => {
    direction = direction !== null ? direction : 1;

    if (a === b) { // If the values are the same, do not switch positions.
      return 0;
    }

    // If b > a, multiply by -1 to get the reverse direction.
    return a > b ? direction : -1 * direction;
  };

  return array.sort((a, b) => {
    let sorted = 0;
    let index = 0;

    // Loop until sorted (-1 or 1) or until the sort keys have been processed.
    while (sorted === 0 && index < sortKeys.length) {
      const key = sortKeys[index];

      if (key) {
        const direction = sortObject[key];

        sorted = keySort(a[key], b[key], direction);
        index++;
      }
    }

    return sorted;
  });
};

exports.isApiCall = function(ctx) {
  const httpPath = ctx.request.url;
  const reg = new RegExp('^/api/');
  return reg.test(httpPath);
};

/**
 * 时间戳转换
 * @param {Date} date 时间
 * @param {string} fmt 时间格式
 * @return {string} 时间
 */
exports.formatDate = function(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };

  // 遍历这个对象
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
    }
  }
  return fmt;
};

exports.formatString = function(str, params) {
  return str.replace(/{([^{}]+)}/gm, function(match, name) {
    return params[name];
  });
};

exports.empty = function(val) {
  if (typeof val === 'undefined' || val === null || val === '') {
    return true;
  }
  const string = JSON.stringify(val);
  if (string === '{}' || string === '[]') {
    return true;
  }
  return false;
};

exports.isNumber = function(str) {
  return Number.isInteger(str) || /^[0-9]+$/.test(str);
};

exports.padLeftZero = function(str) {
  return ('00' + str).substr(str.length);
};

exports.siteUrl = function(url) {
  if (url.substr(0, 1) === '/') {
    return this.app.config.host + url;
  }
  return this.app.config.host + '/' + url;
};
