import React from 'react';
import { inject, observer } from 'mobx-react';
import { getUrlParams } from './util/getUrlParams';
import { Switch, Route, withRouter, Router } from 'react-router-dom';
import UplusApi from '@uplus/uplus-api/es/uplus-api';
import { isWeiXinBrowser, loadWeiXinJS } from './util/tool';


import Home from './containers/home';
import HomeNew from './containers/homeNew';
import Senior from './components/senior';
import SeniorNew from './components/seniorNew';
import FunEditor from './components/funEditor';
import FunEditorNew from './components/funEditorNew';
import EnergyRecord from './components/energyRecord/EnergyRecord';
import History from './components/history/History';
import EnergyPK from './components/energyPK/EnergyPK';
import EnergySaving from './components/energySaving/EnergySaving';
import SleepingCurve from './components/sleepingCurve/SleepingCurve';
import Curve from './components/curve/Curve';
import FaultDetection from './components/faultDetection/FaultDetection';
import FilterCleaning from './components/filterCleaning/FilterCleaning';
import AirConditioningCleaning from './components/airConditioningCleaning/AirConditioningCleaning';
import PurifyingFilter from './components/purifyingFilter/PurifyingFilter';
import Detection from './components/detection/Detection';
import Repairs from './components/repairs/Repairs';
import heatAccumulation from './components/heatAccumulationStatus/heatAccumulationStatus';
import {
  Timing,
  TimingSet,
} from './components';
const urlParamsObj = getUrlParams();
window.devicemac = urlParamsObj.devicemac;
window.typeid = urlParamsObj.typeid;
window.model = decodeURIComponent(urlParamsObj.model);
window.deviceName = decodeURIComponent(urlParamsObj.deviceName);

const testConfig = require('./test-attributes');

window.consoleLog = (message) => {
  console.log.call(console, message);
};
@inject(allStores => ({
  DeviceState: allStores.DeviceState,
  testConfig: testConfig
}))
@withRouter
@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const self = this;
    const uplusApi = new UplusApi();
    //监听事件触发处理
    // let onPause = function(){
    //   // console.log('触发');
    //   // console.log('mac',urlParamsObj.devicemac);
    //   uplusApi.initDeviceReady().then(() => uplusApi.getDeviceInfoByMac({
    //     deviceId: urlParamsObj.devicemac,
    //   }).then((response) => {
    //     // console.log(response);
    //     const retData = response.retData;
    //     const retCode = response.retCode;
    //     if(retCode === '120000' || retCode === 'G20202'){
    //       // console.log('删除关闭');
    //       uplusApi.initDeviceReady().then(function() {
    //         uplusApi.closeH5ContainerView();
    //       });
    //     }
    //     // console.log(retData && retData.extendedInfo && retCode === '00000');
    //     if (retData && retData.extendedInfo && (retCode === '00000' || retCode === '000000')) {
    //
    //       let deviceDetailData = retData.extendedInfo;
    //       let devAppName = deviceDetailData.devAppName;
    //       // console.log(devAppName);
    //       self.props.DeviceState.setDeviceName(devAppName);
    //     }
    //   }));
    // };

    if (/test=true/.test(window.location.href)) {
      self.props.DeviceState.setDeviceState(urlParamsObj.devicemac,
        testConfig.baseInfo, testConfig.data);
      self.props.DeviceState.setCordovaUtil(uplusApi);
    } else if (isWeiXinBrowser()) {//判断是否是微信运行环境，加载微信js
      loadWeiXinJS();
    } else {
      uplusApi.initDeviceReady().then(() => {
        self.props.DeviceState.setCordovaUtil(uplusApi);
        console.log('cordova ready!');
        //设备名称
        self.props.DeviceState.setDeviceName(deviceName);
        // uplusApi.getDeviceInfoByMac({
        //   'deviceId':urlParamsObj.devicemac
        // }).then((response) => {
        //   self.props.DeviceState.setDeviceName(response.retData.extendedInfo.devAppName);
        // });
        // 初始数据
        uplusApi.logicEngineModule.getBaseInfoPromise(urlParamsObj.devicemac).then((baseInfo) => {
          self.props.DeviceState.setBaseInfo(baseInfo.retData);
          console.log(baseInfo.retData);
        });
        // 获取报警信息
        uplusApi.logicEngineModule.getCautionsPromise(urlParamsObj.devicemac).then((initCautions) => {
          self.props.DeviceState.setCautions(initCautions && initCautions.retData);
        });
        // 暂时没有调用initialattribute, 会导致设备状态更新不及时
        uplusApi.logicEngineModule.getAttributeListPromise(urlParamsObj.devicemac).then((initAttrss) => {
          self.props.DeviceState.setMac(urlParamsObj.devicemac);
          self.props.DeviceState.setOrUpdateAttributes(initAttrss.retData);
        });
        // 订阅设备
        uplusApi.logicEngineModule.attachPromise(urlParamsObj.devicemac,
          (mac, baseInfo, attributes, cautions) => {
            self.props.DeviceState.setDeviceState(mac, baseInfo,
              attributes, cautions);
          });

        // uplusApi.updeviceModule.getDeviceInfoById({
        //   'deviceId':urlParamsObj.devicemac
        // }).then((data) => {
        //   console.log(data,'11111111111');
        //   if(data.retCode === '00000'){
        //     self.props.DeviceState.setDeviceName(data.retData.deviceInfo.name);
        //   }
        // });
        // document.addEventListener('pause',onPause,false);
        // document.addEventListener('resume',onPause,false);
        // uplusApi.addResumeEventListener(() => {
        //   onPause();
        // });
      });
    }

    window.updateDeviceDetail = async () => {
      let requestBody = {
        deviceId: urlParamsObj.devicemac || '',
      };
      // 先获取用户信息
      const userInfo = await uplusApi.userModule.getUserInfo();
      // 再获取签名
      const timestamp = String(Number(new Date()));
      const signCode = await uplusApi.userModule.getSignCode({
        data: JSON.stringify(requestBody),
        timestamp: timestamp,
      });

      if (signCode && signCode.retData && signCode.retData.body) {
        try {
          requestBody = JSON.parse(signCode.retData.body);
        } catch (error) {
          console.log('signCodeError');
        }
      }
      uplusApi.httpModule.post({
        url: 'http://uhome.haier.net/emuplus/device/v2/detailInfo',
        data: requestBody,
        headers: {
          // app信息
          appId: userInfo.retData.appId || '',
          appKey: userInfo.retData.appKey || '',
          appName: userInfo.retData.appName || '',
          appVersion: userInfo.retData.appVersion || '',
          clientId: userInfo.retData.clientId || '',
          // 登录信息
          accessToken: userInfo.retData.accessToken || '',
          userId: userInfo.retData.userId || '',
          // 签名信息
          sign: signCode.retData.sign || '',
          timestamp: timestamp,
          'Content-Type': 'application/json;charset=utf-8',
        },
      }).then((response) => {
        console.log(response);
        if (response && response.retCode && response.retCode === '00000') {
          self.props.DeviceState.setDeviceName(response.retData.baseInfo.deviceName);
        }
      });
    };

    // 注册设备名称改变事件
    window.ON_DEVICENAME_CHANGED = (deviceName) => {
      self.props.DeviceState.setDeviceName(deviceName);
      console.log('device name' + deviceName);
    };
    // 注册全局error事件
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      const message = [
        'Message: ' + msg,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + columnNo,
        'Error object: ' + JSON.stringify(error),
      ].join(' - ');
      // 使用自定义的console方法
      if (typeof window.consoleLog === 'function') {
        window.consoleLog(message);
      }
      return false;
    };
  }


  render() {
    return (
      <Router history={this.props.history}>
        <Switch>
          {/*<Route path="/" exact component={Home} />*/}
          <Route path="/" exact component={HomeNew} />
          <Route path="/senior" component={Senior}/>
          <Route path="/seniorNew" component={SeniorNew}/>
          <Route path="/funEditor" component={FunEditor}/>
          <Route path="/funEditorNew" component={FunEditorNew}/>
          <Route path="/energyRecord" component={EnergyRecord}/>
          <Route path="/history" component={History}/>
          <Route path="/energyPK" component={EnergyPK}/>
          <Route path="/timing" component={Timing}/>
          <Route path="/TimingSet/:id" component={TimingSet}/>
          <Route path="/energySaving" component={EnergySaving}/>
          <Route path="/sleepingCurve" component={SleepingCurve}/>
          <Route path="/curve" component={Curve}/>
          <Route path="/faultDetection" component={FaultDetection}/>
          <Route path="/filterCleaning" component={FilterCleaning}/>
          <Route path="/airConditioningCleaning" component={AirConditioningCleaning}/>
          <Route path="/purifyingFilter" component={PurifyingFilter}/>
          <Route path="/detection" component={Detection}/>
          <Route path="/repairs" component={Repairs}/>
          <Route path="/heatAccumulation" component={heatAccumulation}/>
        </Switch>
      </Router>
    );
  }
}
