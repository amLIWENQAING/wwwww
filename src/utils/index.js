/* global window */
import classnames from 'classnames'
import { cloneDeep, update, assign } from 'lodash'
// import config from './config'
// import request from './request'
// import { color } from './theme'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

// 对比两个对象是否一致
const cmp = (x, y) => {
  // If both x and y are null or undefined and exactly the same 
  if (x === y) {
    return true;
  }

  // If they are not strictly equal, they both need to be Objects 
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  //They must have the exact same prototype chain,the closest we can do is
  //test the constructor. 
  if (x.constructor !== y.constructor) {
    return false;
  }

  for (var p in x) {
    //Inherited properties were tested using x.constructor === y.constructor
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined 
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      // If they have the same strict value or identity then they are equal 
      if (x[p] === y[p]) {
        continue;
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal 
      if (typeof (x[p]) !== "object") {
        return false;
      }

      // Objects and Arrays must be tested recursively 
      // if ( ! Object.equals( x[ p ], y[ p ] ) ) { 
      //   return false; 
      // } 
      return cmp(x[p], y[p]);
    }
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined 
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
};

//导出
// module.exports = {
//   config,
//   request,
//   color,
//   classnames,
//   queryURL,
//   queryArray,
//   arrayToTree,
//   cmp,
// }


// arr = [{path：'ll', value:'22'}]
const customerAssgin = (originItem, arr) => {

  for (let i = 0; i < arr.length; i++) {

    originItem = update(originItem, arr[i].path, (x) => { return arr[i].value; });

  }

  return assign({}, originItem);
}

// arrPath =['']  valuePath =[item]
const customerAssgin2 = (originItem, arrPath, valuePath) => {

  for (let i = 0; i < arrPath.length; i++) {

    originItem = update(originItem, arrPath[i], (x) => { return valuePath[i]; });
  }

  return assign({}, originItem);
}

const customerAssgin3 = (originItem, func) => {
  let newItem = assign({}, originItem);
  if (func) {
    return func(newItem);
  }
}

// 用户reduce ， 获得action ， type 为要修改的 state 属性名 arrPath， result 为与path对应的 arrValue
const getAction = (keys, type, result) => {
  return {
    type: type,
    result: result,
    keys: keys,
  }
}

export {
  // config,
  // request,
  // color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  cmp,
  customerAssgin,
  customerAssgin2,
  customerAssgin3,
  getAction
}
