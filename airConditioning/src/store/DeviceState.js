import { observable, action } from 'mobx';
import { default as DeviceState } from './base';
const keyList = Object.keys(DeviceState);
const obj = {};
keyList.map((key) => {
  obj[key] = typeof DeviceState[key] === 'function' ? action.bound(DeviceState[key]) : DeviceState[key];
  return null;
});

export default observable(obj);
