import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { hideDeviceInfo, getGlobalHeaders, getAttribute,getHttp,getUserInfo} from '../../util/tool';
import { Picker, List, WhiteSpace, Button, Toast } from 'antd-mobile';
require('./sleepingCurve.css');
// const cordovaUtil = new CordovaUtil();
const newCurve = {
  'line_name': '请输入曲线名称',
  'coldSleeptemp': '26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26',
  'hotSleeptemp': '26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26',
  'status': 'CLOSE',
  'isUserlist': true,
  'isAddCurve': true
};
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class SleepingCurve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curvelist: [],
      currentCurve: '',
      sleepingCurveExecStatus: false
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.gotoCurve = this.gotoCurve.bind(this);
    this.changeSleep = this.changeSleep.bind(this);
    this.getCurveList = this.getCurveList.bind(this);
    this.setSleepingCurveExecStatus = this.setSleepingCurveExecStatus.bind(this);
    this.getSleepingCurveExecStatus = this.getSleepingCurveExecStatus.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  gotoCurve(curvelist) {
    const path = {
      pathname: '/curve',
      state: curvelist
    };
    this.props.history.push(path);
  }
  async changeSleep(id) {
    // await getGlobalHeaders();
    if (this.state.sleepingCurveExecStatus) {
      Toast.fail('睡眠曲线执行中,无法切换!', 2);
      return true;
    }
    const self = this;
    this.setState({
      currentCurve: id
    });
    const userInfo = await getUserInfo();
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/change_sleep';
    const data = {
      'line_id_after': this.state.currentCurve,
      'mac': devicemac,
      'userid': userInfo.retData?userInfo.retData.userId : ''
    };
    let curveData = '';
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    //   return cordovaUtil.httpEngine;
    // });
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      console.log(resp);
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      if (curveData.retCode === '00000') {
        Toast.info('切换睡眠曲线成功!', 2);
      } else {
        Toast.fail('切换睡眠曲线失败!', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('切换睡眠曲线失败!', 2);
    });
    return true;
  }
  async setSleepingCurveExecStatus() {
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    const self = this;
    let alarms = [];
    // await getGlobalHeaders();
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    const a = cordovaUtil.logicEngineModule.getCautionsPromise(window.devicemac).then((list) => {
      alarms.concat(list.retData);
    });
      // return cordovaUtil.httpEngine;
    // });
    const userInfo = await getUserInfo();
    let body = {
      mac: devicemac,
      userid: userInfo.retData?userInfo.retData.userId : ''
    };
    let recUrl = '';
    let mode = '';
    let operationObj = getAttribute('operationMode', this.props.DeviceState.attributes);
    let onOffStatusObj = getAttribute('onOffStatus', this.props.DeviceState.attributes);
    
    console.log(onOffStatusObj);
    if (!onOffStatusObj.value) {
      Toast.fail('关机下无法执行睡眠曲线', 2);
      return true;
    } else if (alarms.length > 0) {
      Toast.fail('设备故障下无法执行睡眠曲线', 2);
      return true;
    } else if (operationObj.value === '0') {
      mode = '3';
    } else if (operationObj.value === '1') {
      mode = '1';
    } else if (operationObj.value === '4') {
      mode = '2';
    } else {
      Toast.fail('送风,除湿模式下不支持睡眠曲线', 2);
      return true;
    }
    if (this.state.sleepingCurveExecStatus) {
      recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/unexec_double_sleep_new';
    } else {
      recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/exec_double_sleep_new';
      body.mode = mode;
    }
    let curveData = '';
    let globalHeaders = await getGlobalHeaders(body);
    globalHeaders.timestamp = String(new Date().getTime());
    if (!cordova) {
      return false;
    }
    const http = await getHttp();
    http.post(recUrl, body, globalHeaders, (resp) => {
      console.log(resp);
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      if (curveData.retCode === '00000') {
        self.setState({
          'sleepingCurveExecStatus': self.state.sleepingCurveExecStatus ? false : true
        });
      } else if (self.state.sleepingCurveExecStatus) {
        Toast.fail('停止睡眠曲线失败!', 2);
      } else {
        Toast.fail('执行睡眠曲线失败!', 2);
      }
    }, (err) => {
      console.log(err);
      if (self.state.sleepingCurveExecStatus) {
        Toast.fail('停止睡眠曲线失败!', 2);
      } else {
        Toast.fail('执行睡眠曲线失败!', 2);
      }
    });
    return true;
  }
  componentWillMount() {    
    this.getCurveList();
    this.getSleepingCurveExecStatus();
  }
  async getCurveList() {
    const self = this;
    // await getGlobalHeaders();
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/double_sleep_select_news';
    let curveData = '';
    const data = {
      'mac': devicemac,
    };
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    //   return cordovaUtil.httpEngine;
    // });
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      console.log(resp);
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      if (curveData.retCode === '00000') {
        curveData.userlist.forEach((list) => {
          list.isUserlist = true;
        });
        const curveList = curveData.userlist.concat(curveData.systemlist);
        curveList.forEach((curve) => {
          if (curve.status === 'OPEN') {
            self.setState({
              currentCurve: curve.line_id
            });
          }
        });
        self.setState({
          'curvelist': curveList
        });
      } else {
        Toast.fail('获取睡眠曲线失败!', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('获取睡眠曲线失败!', 2);
    });
    return true;
  }
  async getSleepingCurveExecStatus() {
    const self = this;
    // await getGlobalHeaders();
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/sleep_exec_state_by_user';
    let curveData = '';
    const userInfo = await getUserInfo();
    const data = {
      mac: devicemac,
      userid: userInfo.retData?userInfo.retData.userId : ''
    };
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    //   return cordovaUtil.httpEngine;
    // });
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      console.log(resp);
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      if (curveData.retCode === '00000') {
        self.setState({
          sleepingCurveExecStatus: curveData.execState === 0 || curveData.execState === '0' ? false : true
        });
      } else {
        Toast.fail('获取睡眠曲线执行状态失败!', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('获取睡眠曲线执行状态失败!', 2);
    });
    return true;
  }
  render() {
    hideDeviceInfo(false);
    const height = document.documentElement.clientHeight - 108;
    const {
      curvelist,
      currentCurve
    } = this.state;
    return (<div className="sleepingCurve">
      <div className="upcore-navbar">
        <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
        <span className="upcore-navbar-icon-span">{'睡眠曲线'}</span>
        <span className="iconRight" onClick={() => {this.setSleepingCurveExecStatus();}}>{this.state.sleepingCurveExecStatus? '停止':'执行'}</span>
      </div>
      <ul style={{'height':height}}>
        {
          curvelist.map((item,index) => {
            let curveTime = item.coldSleeptemp.split(',');
            curveTime = (curveTime.length - 1) / 2; 
            return (
              <li key={item.line_id}>
                <span className={item.line_id === currentCurve? 'icon_left icon_left_select':'icon_left'} onClick={() => {this.changeSleep(item.line_id);}}></span>
                <span className="name">{item.line_name}</span>
                <span className="defaultTime">{`${curveTime}小时`}</span>
                <span className="icon_right" onClick={() => {this.gotoCurve(item);}}></span>
              </li>
            );
          })
        }
      </ul>
      <div className="btn" onClick={() => {this.gotoCurve(newCurve);}}>增加新曲线</div>
    </div>);
  }
}