
import {default as ConfigUtil} from './configFunc';
import {when} from 'mobx';
import store from '../store';
const configUtil = new ConfigUtil();
const urlParamsObj = configUtil.getUrlParams();
const defaultConfig = require('./default-config.js').default;
let typeidConfig = null, modelConfig = null;
let modelDash = decodeURIComponent(urlParamsObj.model);
modelDash = modelDash ? modelDash.replace('/', '_') : modelDash;
try {
  modelConfig = require(`./${modelDash}.js`).default;
} catch (e) {
  console.log(e);
}
try {
  typeidConfig = require(`./${urlParamsObj.typeid}.js`).default;
  // modelConfig = require(`./${modelDash}.js`).default;
} catch (e) {
  console.log(e);
}
when(
  // 一旦... attibutes有值，也就是设备初始化OK
  () => {
    return store.DeviceState && store.DeviceState.attributes && store.DeviceState.attributes.slice().length;
  },
  // ... 然后 可以修改默认的配置文件
  () => {
    // 这里可以对defaultConfig进行额外的修改，这些逻辑通常不便于放在配置文件里面，可以统一放在这里，它的优先级会低于model.js和typeid.js
    //从typeid中提取设备小类，按照设备小类加载冰箱图片
    // const subType = urlParamsObj.typeid ? urlParamsObj.typeid.substring(18, 20) : '';
    // if (subType === DOOR3) {
    //   defaultConfig.bannerConfig.iconImg = require('../assets/img/fridge_21.png');
    // }
    store.DeviceState.setConfigObj(configUtil.mergeConfig(configUtil.mergeConfig(defaultConfig, typeidConfig), modelConfig));
  }
);

