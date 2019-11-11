import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {NavBar,BannerConfig,TargetTemperature,DeviceControl,Custom} from '../../components';
import { Toast } from 'antd-mobile';
import { getAttribute,getUserInfo,getGlobalHeaders,getHttp } from '../../util/tool';
import './style/home.less';
let fromChild = false;//navbar传的设备信息是否显示的标志
// const configUtil = new ConfigUtil();
// configUtil.getUrlParams().then((urlParamsObj) => {
//   window.typeid = urlParamsObj.typeid;
//   window.devicemac = urlParamsObj.devicemac;
//   window.model = decodeURIComponent(urlParamsObj.model);
//   window.model = window.model ? window.model.replace('/', '_') : window.model;
// });
@inject(allStores => ({
  DeviceState: allStores.DeviceState,
  mergedConfig: allStores.DeviceState.configObj||[],
  attributesChange:(attributes)=>{
    console.log(attributes);
    return attributes;
  }
}))
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingShow: true
    };
  }
  //模式切换
  operationModeCalculate(commands){
    let self = this;
    if (commands[0] && commands[0].name === 'operationMode') {
      // 切换模式时自动关闭睡眠曲线
      self.closeSleepingCurve();
      //自清洁、电辅热在切换模式时自动关闭
      // self.operationSingleComm([{
      //   name: 'selfCleaningStatus',
      //   value: 'false'
      // }, {
      //   name: 'electricHeatingStatus',
      //   value: 'false'
      // }]);
    }
  }
  //切换送风,智能
  blowingCalculate(commands){
    let self = this;
    let attributes = this.props.DeviceState.attributes;
    const windSpeed = attributes.filter((attr) => attr.name === 'windSpeed')[0];
    const operationMode=attributes.filter((attr) => attr.name ==='operationMode')[0];
    if (commands[0] && commands[0].name === 'operationMode' && commands[0].value === '6') {
      //切换模式到送风时，将风速设置为低风, 静眠关闭
      if(windSpeed.value === '5'){
        self.operationSingleComm([{
          name: 'windSpeed',
          value: '3'
        }, {
          name: 'silentSleepStatus',
          value: 'false'
        },{
          name: 'electricHeatingStatus',
          value: 'false'
        }]);
      }else{
        self.operationSingleComm([{
          name: 'silentSleepStatus',
          value: 'false'
        },{
          name: 'electricHeatingStatus',
          value: 'false'
        }]);
      }
    } else if (commands[0] && commands[0].name === 'operationMode' && commands[0].value === '0') {
      //智能模式下，强力和静音自动关闭
      if(windSpeed.value!=='5'){
        // self.operationSingleComm([{
        //   name: 'windSpeed',
        //   value: '5'
        // }, {
        // name: 'targetTemperature',
        // value: '26'
        // }, {
        //   name: 'muteStatus',
        //   value: 'false'
        // },{
        //   name: 'rapidMode',
        //   value: 'false'
        // }]);
      }
    }
  }
  //关机
  offStatusCalculate(commands){
    let self = this;
    if (commands[0] && commands[0].name === 'onOffStatus' && commands[0].value === 'false') {
      // self.operationSingleComm([{
      //   name: 'selfCleaningStatus',
      //   value: 'false'
      // }]);
    }
  }
  //强力，静音，静眠
  othersCalculate(commands){
    let self = this;
    if (commands[0] && commands[0].name === 'muteStatus' && commands[0].value === 'true') {
      self.operationSingleComm([{
        name: 'rapidMode',
        value: 'false'
      }]);
    }
    if (commands[0] && commands[0].name === 'rapidMode' && commands[0].value === 'true') {
      self.operationSingleComm([{
        name: 'muteStatus',
        value: 'false'
      }, {
        name: 'silentSleepStatus',
        value: 'false'
      }]);
    }
    if (commands[0] && commands[0].name === 'silentSleepStatus' && commands[0].value === 'true') {
      self.operationSingleComm([{
        name: 'rapidMode',
        value: 'false'
      }]);
    }
  }

  //00000000000000008080000000041410型号代码下发逻辑补充，下发单命令
  oldModeCalculate(commands){
    let self = this;
    // 老typeid空调需要下发单命令
    self.operationModeCalculate(commands);
    self.blowingCalculate(commands);
    self.offStatusCalculate(commands);
    self.othersCalculate(commands);
    return commands;
  }
  //模式切换
  newOperationModeCalculate(commands){
    let self = this;
    if (commands[0] && commands[0].name === 'operationMode') {
      // 切换模式时自动关闭睡眠曲线
      self.closeSleepingCurve();

    }
  }
  //切换送风,智能
  newBlowingCalculate(commands){
    let self = this;
    let attributes = this.props.DeviceState.attributes;
    const windSpeed = attributes.filter((attr) => attr.name === 'windSpeed')[0];
    const windSpeedL = attributes.filter((attr) => attr.name === 'windSpeedL')[0];
    const windSpeedR = attributes.filter((attr) => attr.name === 'windSpeedR')[0];
    if (commands[0] && commands[0].name === 'operationMode' && commands[0].value === '6') {
    //切换模式到送风时，将风速设置为低风,,强力，静音，静眠关闭
      if(windSpeed && windSpeed.value === '5'){
        commands.push({
          'name': 'windSpeed',
          'value': '3'
        });
      }
      if(windSpeedL&&windSpeedL.value === '5'){
        commands.push({
          'name': 'windSpeedL',
          'value': '3'
        });
      }
      if(windSpeedR&&windSpeedR.value === '5'){
        commands.push({
          'name': 'windSpeedR',
          'value': '3'
        });
      }
      commands.push({
        'name': 'silentSleepStatus',
        'value': 'false'
      });
      commands.push({
        'name': 'rapidMode',
        'value': 'false'
      });
      commands.push({
        'name': 'muteStatus',
        'value': 'false'
      });
      commands.push({
        'name': 'electricHeatingStatus',
        'value': 'false'
      });
    } else if (commands[0] && commands[0].name === 'operationMode' && commands[0].value === '0') {
      //智能模式下，强力和静音自动关闭，风速调为自动风
      if(windSpeed){
        commands.push({
          'name': 'windSpeed',
          'value': '5'
        });
      }
      commands.push({
        'name': 'rapidMode',
        'value': 'false'
      });
      commands.push({
        'name': 'targetTemperature',
        'value': '26'
      });
      commands.push({
        'name': 'muteStatus',
        'value': 'false'
      });
    }else if (commands[0] && commands[0].name === 'specialMode') {

      commands.push({
        'name': 'operationMode',
        'value': '0'
      });
      commands.push({
        'name': 'targetTemperature',
        'value': '26'
      });
      commands.push({
        'name': 'windSpeed',
        'value': '5'
      });

    }
  }
  //关机
  newOffStatusCalculate(commands){
    let self = this;
    if (commands[0] && commands[0].name === 'onOffStatus' && commands[0].value === 'false') {
      // commands.push({
      //   'name': 'selfCleaningStatus',
      //   'value': 'false'
      // });
    }
  }
  //强力，静音，静眠
  newOthersCalculate(commands){
    let self = this;
    if (commands[0] && commands[0].name === 'muteStatus' && commands[0].value === 'true') {
      commands.push({
        'name': 'rapidMode',
        'value': 'false'
      });
    }
    if (commands[0] && commands[0].name === 'rapidMode' && commands[0].value === 'true') {
      commands.push({
        'name': 'muteStatus',
        'value': 'false'
      });
      commands.push({
        'name': 'silentSleepStatus',
        'value': 'false'
      });
    }
    if (commands[0] && commands[0].name === 'silentSleepStatus' && commands[0].value === 'true') {
      commands.push({
        'name': 'rapidMode',
        'value': 'false'
      });
    }
  }
  newModeCalculate(commands){
    let self = this;
    self.newOperationModeCalculate(commands);
    self.newBlowingCalculate(commands);
    self.newOffStatusCalculate(commands);
    self.newOthersCalculate(commands);
    return commands;
  }
  beforeCalculate(commands) {
    const self = this;
    let operationModeObj = {};
    let selfCleaningStatusObj = {};
    const attributes = this.props.DeviceState.getAttributes();
    for(let i = 0; i < attributes.length; i++) {
      if (attributes[i].name === 'operationMode') {
        operationModeObj = attributes[i];
      }
      if (attributes[i].name === 'selfCleaningStatus') {
        selfCleaningStatusObj = attributes[i];
      }
    }
    return new Promise((resolve) => {
      //之前型号处理逻辑关系，切海极网后可删除
      if (operationModeObj.value && operationModeObj.value !== '0' && operationModeObj.value !== '4' && commands[0] && commands[0].name === 'electricHeatingStatus' && commands[0].value === 'true') {
        Toast.info('该模式下不支持该功能', 1);
      } else if (selfCleaningStatusObj.value === 'true' && commands[0] && commands[0].name === 'freshAirStatus') {
        Toast.info('该模式下不支持该功能', 1);
      } else if (window.typeid === '00000000000000008080000000041410') {
        // 老typeid空调需要下发单命令
        let calculateCommands = self.oldModeCalculate(commands);
        resolve(calculateCommands);
      }else{
        let calculateCommands = self.newModeCalculate(commands);
        resolve(calculateCommands);
      }

      // resolve(commands);
    });
  }
  operationSingleComm(arrs) {
    const { cordovaUtil, mac } = this.props.DeviceState;
    arrs.forEach((arr) => {
      cordovaUtil.logicEngineModule.calculatePromise(mac, arr.name, arr.value, true).then(() => {
        cordovaUtil.logicEngineModule.operatePromise(mac);
      });
    });
  }
  async closeSleepingCurve() {
    if(typeid==='20086108008203240212fd22052be6000000ce57f0dc6699fd60c0984ab02440'){
      return;
    }
    const userInfo = await getUserInfo();
    const body = {
      mac: window.devicemac,
      userid: userInfo.retData?userInfo.retData.userId : '',
    };
    let data = {};
    let globalHeaders = await getGlobalHeaders(body);
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/unexec_double_sleep_new';
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    //   return cordovaUtil.httpEngine;
    // });
    const http = await getHttp();
    http.post(recUrl, body, globalHeaders, (resp) => {
      console.log(resp.data);
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        data = JSON.parse(resp.data);
      } else {
        data = resp.data;
      }
      if (data.retCode === '00000') {
        Toast.info('已关闭睡眠曲线', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('关闭睡眠曲线失败!', 2);
    });
  }
  calculate(name,value) {
    const { cordovaUtil, mac } = this.props.DeviceState;
    this.beforeCalculate([{
      name: name,
      value: value,
    }]).then((commands) => {
      console.log(commands);
      cordovaUtil.logicEngineModule.calculateAllPromise(mac, commands).then(() => {
        cordovaUtil.logicEngineModule.operatePromise(mac);
        // if(name==='operationMode'&&value==='0'){
        //   cordovaUtil.logicEngineModule.calculateAllPromise(mac, [{name:'windSpeed',value:'5'}]).then(() => {
        //     cordovaUtil.logicEngineModule.operatePromise(mac);
        //   });
        // }

      });

    });
  }
  handleLeftClick() {

    const { cordovaUtil } = this.props.DeviceState;
    // const nav = navigator || window.navigator;
    // if (/iPhone|mac|iPod|iPad/i.test(nav.userAgent) && cordovaUtil && cordovaUtil.coreEngine) {
    //   cordovaUtil.coreEngine.closeH5ContainerView(() => {
    //     console.log('c');
    //   },
    //   () => {
    //     console.log('c');
    //   });
    // } else if (nav && nav.app) {
    //   nav.app.exitApp();
    // }
    if (cordovaUtil && typeof cordovaUtil.closeH5ContainerView === 'function') {
      cordovaUtil.closeH5ContainerView(
        () => {console.log('closeS');},
        () => {console.log('closeF');});
    }
  }
  infoClick() {
    // console.log(fromChild,'22222');
    if(fromChild){
      this.setState({
        settingShow: false
      });
    }else{
      this.setState({
        settingShow: true
      });
    }
    // console.log(this.state.settingShow,'231');

  }
  infoShow(show){
    fromChild = show;
    // this.setState({
    //   fromChild:show
    // });
  }

  render() {
    const { mergedConfig } = this.props;
    const { cordovaUtil, mac, deviceName, baseInfo,initCautions} = this.props.DeviceState;
    // window.devicemac = mac;
    // window.typeid = baseInfo.typeId;
    const attributes = this.props.DeviceState.getAttributes();
    const cautions = this.props.DeviceState.getCautions() || [];
    const history = this.props.history;
    // const values = getAttribute('targetTemperature',attributes);
    // 在线信息
    let onlineStatus = false;
    if (baseInfo && baseInfo.connection) {
      // OFFLINE, UNCONNECTED, CONNECTING, CONNECTED, READY
      onlineStatus = baseInfo.connection === 'READY';
    } else {
      onlineStatus = (baseInfo && baseInfo.deviceInfo && baseInfo.deviceInfo.status &&
            String(baseInfo.deviceInfo.status.online).toUpperCase() === 'TRUE');
    }
    let onOffStatus = false;
    if (mergedConfig.onOffName) {
      const attribute = attributes.filter((attr) => attr.name === mergedConfig.onOffName);
      if (attribute && attribute.length) {
        onOffStatus = String(attribute[0].value).toUpperCase() === 'TRUE';
      }
    }
    // if(typeof onlineStatus === 'undefined'){
    //   console.log(onlineStatus,'111111111');
    // }
    return (
      <div style={{display:typeof onlineStatus === 'undefined'?'none':'block'}} onClick={() => this.infoClick()}>
        {/*<p>mac:{mac}</p>*/}
        {/*<p>baseInfo:{JSON.stringify(baseInfo)}</p>*/}
        {/*<p>attributes:{JSON.stringify(attributes)}</p>*/}
        {/*<p>cautions:{JSON.stringify(cautions)}</p>*/}
        {/*<p>mergedConfig:{JSON.stringify(mergedConfig)}</p>*/}
        {/*<Alarms alarmsList ={cautions}/>*/}
        <NavBar
          title={deviceName}
          settingShow={this.state.settingShow}
          onLeftClick={() => this.handleLeftClick()}
          infoShow={(show)=>{this.infoShow(show);}}
        />

        <BannerConfig
          bannerList={mergedConfig.bannerConfig}
          baseInfo={baseInfo}
          attributes={attributes}
          isOnline={onlineStatus}
          alarmsList ={cautions}
          history={history}
        />
        <TargetTemperature
          attributes={attributes}
          isOnline={onlineStatus}
          onOffStatus={onOffStatus}
          config={this.props.mergedConfig}
          alarmsList ={cautions}
          calculate={(name,value)=>{this.calculate(name,value);}}/>
        <DeviceControl
          attributes={attributes}
          isOnline={onlineStatus}
          onOffStatus={onOffStatus}
          config={this.props.mergedConfig}
          history={history}
          calculate={(name,value)=>{this.calculate(name,value);}}/>
        <Custom
          attributes={attributes}
          isOnline={onlineStatus}
          cordovaUtil={cordovaUtil}
          history={history}/>
      </div>);
  }
}

export default Home;
