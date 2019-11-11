export default {
  cordovaUtil: null,
  configObj: {},
  deviceName: '',
  mac: '',
  onlineStatus: false,
  baseInfo: {},
  attributes: [],
  cautions: [],

  setConfigObj(obj) {
    this.configObj = obj;
  },
  setDeviceName(deviceName) {
    this.deviceName = deviceName;
  },
  getAttributes() {
    return this.attributes.slice();
  },
  getCautions() {
    return this.cautions.slice();
  },
  setDeviceState(mac, baseInfo, attributes, cautions) {
    this.setMac(mac);
    this.setBaseInfo(baseInfo);
    this.setOrUpdateAttributes(attributes);
    this.setCautions(cautions);
  },
  setCordovaUtil(cordovaUtil) {
    if (cordovaUtil) {
      this.cordovaUtil = cordovaUtil;
    }
  },
  setMac(mac) {
    if (mac && mac !== this.mac) {
      this.mac = mac;
    }
  },
  setBaseInfo(baseInfo) {
    if (baseInfo) {
      this.baseInfo = baseInfo;
      // 在线信息
      let onlineStatus = false;
      if (this.baseInfo.connection) {
        onlineStatus = this.baseInfo.connection === 'READY';
      } else {
        onlineStatus = (this.baseInfo.deviceInfo && this.baseInfo.deviceInfo.status &&
          String(this.baseInfo.deviceInfo.status.online).toUpperCase() === 'TRUE');
      }
      this.onlineStatus = onlineStatus;
    }
  },
  setOrUpdateAttributes(attributes) {
    if (attributes && attributes.length > 0) {
      let tempAttributes = [].concat(attributes);
      tempAttributes = this.valueConvert(tempAttributes);
      const initalAttributes = [].concat(this.getAttributes());
      const extraArr = [];
      for (let i = 0; i < tempAttributes.length; i++) {
        const item = tempAttributes[i];
        // 如果不在线则所有属性value默认为'-/-',不可写
        if (!this.onlineStatus) {
          item.value = '-/-';
          item.writable = false;
        }
        // 属性value校验
        if (!item.value || item.value === 'undefined' || item.value === 'null') {
          item.value = '-/-';
        }
        // 更新属性列表
        let hasUpdateAttrFlag = false;
        for (let j = 0; j < initalAttributes.length; j++) {
          if (initalAttributes[j] && initalAttributes[j].name === item.name) {
            initalAttributes[j] = item;
            hasUpdateAttrFlag = true;
            break;
          }
        }
        if (!hasUpdateAttrFlag) {
          extraArr.push(item);
        }
      }
      this.attributes = initalAttributes.concat(extraArr);
    }
  },
  valueConvert(attributesList){
    
    let heatingMode = null;
    let heatingModeSupported = null;

    let runningMode = null;
    let runningModeSupported = null;

    let resnMode = null;
    let resnSettingSupported = null;

    let power = null;
    let powerSettingSupported = null;

    let scene = null;
    let sceneSettingSupported = null;
    let remainingHotWater = null;

    for (let i = 0; i < attributesList.length; i++) {
      const attribute = attributesList[i];
      switch (attribute.name) {
      case 'heatingMode': heatingMode = attribute;
        break;
      case 'heatingModeSupported': heatingModeSupported = attribute; 
        break;

      case 'runningMode': runningMode = attribute; 
        break;
      case 'runningModeSupported': runningModeSupported = attribute; 
        break;

      case 'resnMode': resnMode = attribute; 
        break;
      case 'resnSettingSupported': resnSettingSupported = attribute; 
        break;

      case 'power': power = attribute; 
        break;
      case 'powerSettingSupported': powerSettingSupported = attribute; 
        break;

      case 'scene': scene = attribute; 
        break;
      case 'sceneSettingSupported': sceneSettingSupported = attribute; 
        break;

      case 'remainingHotWater': remainingHotWater = attribute;
        break;
      default: 
      }
    }

    if (heatingMode && heatingModeSupported && heatingModeSupported.value.toString().toUpperCase() === 'FALSE') {
      heatingMode.value = '-/-';
    }
    if (runningMode && runningModeSupported && runningModeSupported.value.toString().toUpperCase() === 'FALSE') {
      runningMode.value = '-/-';
    }
    if (resnMode && resnSettingSupported && resnSettingSupported.value.toString().toUpperCase() === 'FALSE') {
      resnMode.value = '-/-';
    }
    if (power && powerSettingSupported && powerSettingSupported.value.toString().toUpperCase() === 'FALSE') {
      power.value = '-/-';
    }
    if (scene && sceneSettingSupported && sceneSettingSupported.value.toString().toUpperCase() === 'FALSE') {
      scene.value = '-/-';
    }
    remainingHotWater = this.remainingHotWaterConvert(remainingHotWater);

    return attributesList;

  },
  remainingHotWaterConvert(remainingHotWater){
    if (remainingHotWater) {
      switch(String(remainingHotWater.value)){
      case '0': remainingHotWater.value = 0;
        break;
      case '1': remainingHotWater.value = 20;
        break;  
      case '2': remainingHotWater.value = 40;
        break;
      case '3': remainingHotWater.value = 60;
        break;
      case '4': remainingHotWater.value = 80;
        break;
      case '5': remainingHotWater.value = 100;
        break;
      default: 
        remainingHotWater.value = '-/-' ;
      }
    }
    return remainingHotWater;
  },
  setCautions(cautions) {
    if (cautions && cautions.length >= 0) {
      this.cautions = cautions;
    }
  },
};
