import UplusApi from '@uplus/uplus-api/es/uplus-api';
const uplusApi = new UplusApi();
// let globalHeaders = {};
// let userData = {};
// let signData = {};


export async function getUserInfo() {
  await uplusApi.initDeviceReady();
  return await uplusApi.userModule.getUserInfo();
}

export async function getSignCode(data) {
  await uplusApi.initDeviceReady();
  // console.log(data);
  let time = String((new Date()).getTime());
  return await uplusApi.userModule.getSignCode({data:data,timestamp:time});
}

export async function getHttp() {
  await uplusApi.initDeviceReady();
  return await uplusApi.httpModule.httpEngine;
}

// export async function getGlobalHeaders(data) {
//
//   const globalHeaders = {
//     'Content-Type': 'application/json;charset=utf-8'
//   };
//
//   await uplusApi.initDeviceReady();
//   const sign = await getSignCode(data);
//   const userInfo = await getUserInfo();
//   globalHeaders.phoneNumber=userInfo.retData ? userInfo.retData.phoneNumber : '';
//   globalHeaders.appId = userInfo.retData ? userInfo.retData.appId : '';
//   globalHeaders.appKey = userInfo.retData ? userInfo.retData.appKey : '';
//   globalHeaders.appName = userInfo.retData ? userInfo.retData.appName : '';
//   globalHeaders.appVersion = userInfo.retData ? userInfo.retData.appVersion : '';
//   globalHeaders.clientId = userInfo.retData ? userInfo.retData.clientId : '';
//   globalHeaders.accessToken = userInfo.retData ? userInfo.retData.accessToken : '';
//   globalHeaders.userId = userInfo.retData ? userInfo.retData.userId : '';
//   globalHeaders.sdToken = userInfo.retData?userInfo.retData.sdToken : '';
//   globalHeaders.sign = sign.retData ? sign.retData.sign: '';
//   return globalHeaders;
// }
export async function getGlobalHeaders(data) {

  const globalHeaders = {
    'Content-Type': 'application/json;charset=utf-8'
  };

  await uplusApi.initDeviceReady();
  const sign = await getSignCode(data);
  const userInfo = await getUserInfo();
  globalHeaders.phoneNumber=userInfo.retData ? (userInfo.retData.phoneNumber ? userInfo.retData.phoneNumber : '') : '';
  globalHeaders.appId = userInfo.retData ? userInfo.retData.appId : '';
  globalHeaders.appKey = userInfo.retData ? userInfo.retData.appKey : '';
  globalHeaders.appName = userInfo.retData ? userInfo.retData.appName : '';
  globalHeaders.appVersion = userInfo.retData ? userInfo.retData.appVersion : '';
  globalHeaders.clientId = userInfo.retData ? userInfo.retData.clientId : '';
  globalHeaders.accessToken = userInfo.retData ? (userInfo.retData.accessToken ? userInfo.retData.accessToken : '') : '';
  globalHeaders.userId = userInfo.retData ? (userInfo.retData.userId ? userInfo.retData.userId : '') : '';
  globalHeaders.sdToken = userInfo.retData? (userInfo.retData.sdToken ? userInfo.retData.sdToken: '') : '';
  globalHeaders.sign = sign.retData ? sign.retData.sign: '';
  return globalHeaders;
}

/**
 * 核心算法 解析typeid 输出对应的设备
 */
function parseTypeIdByte(target, begin, offset, left, right) {
  /* eslint-disable */
  let hexRadix = 16;
  let first = parseInt(target.substring(begin, begin + offset), hexRadix) << left;
  let tempBegin = begin + offset;
  let second = parseInt(target.substring(tempBegin, tempBegin + offset), hexRadix) >> right;
  return (first + second) & 0xff;
}
/**
 * 根据typeid计算设备大类
 *
 * @param typeId typeid
 * @return 返回设备大类
 */
export function getDeviceClassifyCodeByTypeId(typeId) {
  let typeNum = -1;
  if (typeId && typeId.length >= 30) {
    if (typeId.startsWith('0')) {
      typeNum = parseTypeIdByte(typeId, 14, 2, 2, 6);
    } else {
      typeNum = parseTypeIdByte(typeId, 16, 1, 4, 0);
    }
  }
  return typeNum;
}
/**
 * 根据typeid计算设备中类
 *
 * @param typeId typeid
 * @return 返回设备中类
 */
export function getDeviceMiddleClassifyCodeByTypeId(typeId) {
  let typeNum = -1;
  if (typeId && typeId.length >= 30) {
    if (typeId.startsWith('0')) {
      typeNum = parseTypeIdByte(typeId, 16, 2, 2, 6);
    } else {
      typeNum = parseTypeIdByte(typeId, 18, 1, 4, 0);
    }
  }
  return typeNum;
}
/**
 * 隐藏或显示设备信息
 */
export function hideDeviceInfo(showOrHide) {
  let infoWraper = document.getElementsByClassName('info_wraper');
  if (infoWraper) {
    if (showOrHide) {
      infoWraper[0].style.display = 'block';
    } else {
      infoWraper[0].style.display = 'none';
    }
  }
}
/**
 * 设置底板时间,与手机时间同步。
 * @param attrName 当前时间属性名
 * @param time 下发的时间
 */
export async function setDevTime(attrName,time) {
  await uplusApi.initDeviceReady();
  uplusApi.logicEngineModel.calculatePromise(window.devicemac, attrName, String(time), true).then((data) => {
    uplusApi.logicEngineModel.operatePromise(window.devicemac);
  });
}


export function getAttribute(attributeName, attributes=[]) {
    if(attributes.length > 0) {
        let currentAttr = [];
        if(Array.isArray(attributeName)){
            attributeName.forEach( key => {
                attributes.forEach( index =>{
                    if(key === index.name) {
                        currentAttr.push(index);
                    }
                });
            });
        }else{
            attributes.forEach( key => {
                if(attributeName === key.name){
                    currentAttr = key;
                }
            });
        }
        return currentAttr.length === 0 ? false : currentAttr;
    }
    return false;
}

export function getUrlParams() {
  const url = window.location.search;
  const query = {};
  if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
          query[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
  }

  const hash = window.location.hash;
  if (hash.indexOf('?') !== -1) {
      const hashStr = hash.substr(hash.indexOf('?') + 1, hash.length);

      const hashArr = hashStr.split('&');
      for (let i = 0; i < hashArr.length; i++) {
          query[hashArr[i].split('=')[0]] = decodeURI(hashArr[i].split('=')[1]);
      }
  }
  return query;
}
/*
**判断是否是微信的运行环境
*/
export function isWeiXinBrowser(){
  let ua = navigator.userAgent.toLowerCase();
  let isWeixin = ua.indexOf("micromessenger") != -1;
  if (isWeixin) {
    return true;
  } else {
    return false;
  }
}

/*
**动态加载微信的JS资源
*/
export function loadWeiXinJS(){
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://res.wx.qq.com/open/js/jweixin-1.4.0.js";
  document.getElementsByTagName("head")[0].appendChild(script);

  script.onload = function(){
    alert('WXScript is loaded!');
  };
}
