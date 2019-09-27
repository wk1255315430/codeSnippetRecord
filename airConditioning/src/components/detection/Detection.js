/* eslint-disable camelcase */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import UplusApi from '@uplus/uplus-api/es/uplus-api';
// import { CordovaUtil } from '@uplus/updevicecore';
import { hideDeviceInfo, getGlobalHeaders,getHttp,getUserInfo } from '../../util/tool';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
require('./detection.css');
let isError = false;
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}
// let fff=[];
async function doAjax(_self, _alarmLenth) {
  const data = {
    'mac': devicemac,
  };
}
async function getAjax(_self) {
  // await getGlobalHeaders();
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //     return cordovaUtil.httpEngine;
  // });
  const data = {
    faultName:window.faultDesc,
  };
  let globalHeaders = await getGlobalHeaders(data);
  globalHeaders.timestamp = String(new Date().getTime());
  const http = await getHttp();
  const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/fault/getFaultInfoByName';
  http.post(recUrl,data,globalHeaders,function (res){
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    _self.setState(
      {
        tip:datas.userTip,
        advice:datas.userAdvice
      }
    );
  }, function(e) {
    console.log(e);
  });
  return true;
}
async function postAjax(_Repair) {
  // await getGlobalHeaders();
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //     return cordovaUtil.httpEngine;
  // });
  // window.globalHeaders.timestamp = String(new Date().getTime());
  const userInfo = await getUserInfo();
  const data = {
    code:'303',
    key:'8f0faab91b0f47529c491b2d9c18d122',
    phonecenter:userInfo.retData?userInfo.retData.phonecenter : '',
    access_token:userInfo.retData?userInfo.retData.sdToken : '',
  };
  let globalHeaders = await getGlobalHeaders(data);
  globalHeaders.timestamp = String(new Date().getTime());
  const http = await getHttp();
  // let url='http://entrace.haier.net:8778/uesrCenter/gateWay';
  let url = 'http://entrace.haier.net:8778/go_weizhan/homeForeign';
  http.post(url, data, globalHeaders, function (res) {
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    window.Repair=datas.data;
  });
}
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class FaultDetection extends Component {
  constructor(props) {
    super(props);
    this.gotoIndex = this.gotoIndex.bind(this);
    this.state = {
      alarms: [],
      btShow: 'block',
      imgShow: 'none',
      resultShow: 'none',
      checkItem: '室内制热过载/高负荷报警',
      checkPoint: '.',
      resuleDesc: '状态良好',
      errClick: false,
      errDes: '',
      optimization: 'none',
      online: true,
      startBt: false,
      tip:'',
      advice:'',
    };
  }
  gotoIndex() {
    if (this.state.errClick === true) {
      this.setState({
        errClick: false
      });
    } else {
      history.go(-1);
    }
  }
  hideBt() {
    if (this.state.online === false) {
      this.setState({
        startBt: true
      });
      return false;
    }
    this.setState({
      btShow: 'none',
      imgShow: 'block'
    });
    let self = this;
    let i = 0;
    let points = '.';
    let timeObj = setInterval(function() {
      let point = i % 9;
      if (point === 0) {
        points = '.';
      } else if (point === 3) {
        points = '..';
      } else if (point === 6) {
        points = '...';
      }
      self.setState({
        checkItem: alarmArrays[i],
        checkPoint: points
      });
      i++;
      if (i >= alarmArrays.length) {
        clearInterval(timeObj);
      }
    }, 227);
    setTimeout(function() {
      self.setState({
        imgShow: 'none',
        resultShow: 'block'
      });
    }, 10000);
    return true;
  }
  custom() {
    this.props.history.push('/Repairs');
  }

  async componentWillMount() {
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    const self = this;
    const uplusApi = new UplusApi();
    let alarmObj = []; //[{desc:'室内error',name:'indoorError'},{desc:'室外error',name:'outdoorError'}];
    // await cordovaUtil.initDeviceReady().then(() => {
    uplusApi.logicEngineModule.getCautionsPromise(window.devicemac).then((list) => {
      alarmObj = alarmObj.concat(list.retData);
      this.setState({
        alarms: alarmObj,
        online: onlineStatus,
      });
      doAjax(self, alarmObj.length);
      getAjax(self);
      postAjax();
    });
  }
  // componentDidMount(){
  //   let height = window.screen.height;
  //   console.log(height);
  //   document.getElementById('errorDetail').style.height = (height -40) + 'px';
  //   // document.getElementById('errorDetail').style.top = 'px';
  // }
  render() {
    hideDeviceInfo(false);
    // let Advice=fff.Advice;
    let Tip=this.state.tip;
    let alarmObj = this.state.alarms;
    let alarmArray = [];
    // let arr = [];
    for (let i = 0; i < alarmObj.length; i++) {
      // for(let i in alarmObj) {
      if (alarmArray.indexOf(alarmObj[i].desc) === -1) {
        alarmArray.push(alarmObj[i].desc);
      }
    }
    window.alarmObj = alarmArray;
    let faultDesc=alarmArray[0];
    window.faultDesc=faultDesc;
    let arr =['室外模块故障','室外EEPROM异常','CBD与模块通讯故障','电源过压保护','室外无负载故障','室内EEPROM故障','室外风机故障','室外直流风机故障','室内外通讯故障'];
    for(let i =0;i<arr.length;i++){
      if(arr[i] === faultDesc){
        isError = true;
        break;
      }else{
        isError = false;
      }
    }
    const height = document.documentElement.clientHeight;
    return (<div className="bcg" style={{height:`${height}px`}}>
      <div className="upcore-navbar">
        <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left"></span>
        <span className="upcore-navbar-icon-sapn">{'故障详情'}</span>
      </div>
      <div className="imgContainer1">
        <img src={require('./images/icon_malfunction@3x.png')} className="faultIcon" />
        <p className="errorName">{faultDesc}</p>
      </div>
      <div className="errData1">
        {/*<p className="xf1">故障描述：</p>*/}
        <div className="xf2">故障原因：</div>
        <div className="fontbg">{this.state.tip}</div>
        <div style={{clear:'both'}}></div>
      </div>
      <div className="errData3">
        {/*<p className="fontbg">{this.state.faultDesc}</p>*/}
        <div className="xf3">修复建议：</div>
        <div className="fontbg2">{this.state.advice}</div>
        <div style={{clear:'both'}}></div>
      </div>
      <div className="btcContainer" style={{display:isError?'none':'inline-block'}}>
        <a className="aBt" href="tel:400-699-9999">电话报修</a>
        <a className="aBx" onClick={() => {this.custom();}}>一键报修</a>
      </div>
      <div className="btcContainer" style={{display:isError?'inline-block':'none'}}>
        {/*<div className="btContainer" style={{display:isError?'none':'inline-block'}}>*/}
        <a className="aBc" href="tel:400-699-9999">电话报修</a>
      </div>
    </div>);
  }
}
