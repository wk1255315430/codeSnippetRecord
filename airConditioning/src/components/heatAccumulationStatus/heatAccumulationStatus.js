/* eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { CordovaUtil } from '@uplus/updevicecore';
import {hideDeviceInfo, getGlobalHeaders, getAttribute, getUserInfo, getHttp} from '../../util/tool';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
require('./heatAccumulationStatus.css');
let SHA256 = require('js-sha256').sha256;
let getSign = (url, body, appId, appKey, timestamp) => {
  return SHA256(url + body + appId + appKey + timestamp);
}
// const cordovaUtil = new CordovaUtil();
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class HeatAccumulation extends Component {
  constructor(props) {
    super(props);
    this.gotoIndex = this.gotoIndex.bind(this);
    this.state = {
      heatStatus :false
    };
  }
  gotoIndex() {
    history.go(-1);
  }
  async openHeat(value) {
    let url = '';
    let aurl = '';
    if(value ==='open'){
      url = 'https://data.haier.net/ac-warmup-rest/contract/add';
      // url = 'http://192.168.160.185:7120/ac-warmup-rest/contract/add';
      aurl= '/ac-warmup-rest/contract/add';
    }else if(value ==='close'){
      url = 'https://data.haier.net/ac-warmup-rest/contract/remove';
      // url = 'http://192.168.160.185:7120/ac-warmup-rest/contract/remove';
      aurl = '/ac-warmup-rest/contract/remove';
    }
    const userInfo = await getUserInfo();
    const data = {
      'mac':devicemac,
    };
    let curveData = '';
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    globalHeaders.sign= SHA256(aurl + JSON.stringify(data) + globalHeaders.appId + globalHeaders.appKey + globalHeaders.timestamp);
    const access= {'Access-User-Token':userToken};
    globalHeaders = Object.assign(globalHeaders,access);
    console.log(globalHeaders,'蓄热');
    const http = await getHttp();
    http.post(url, data, globalHeaders, (resp) => {

      let Data = {};
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        Data = JSON.parse(resp.data);
      } else {
        Data = resp.data;
      }
      if(Data.retCode === '1000'){
        if(value ==='open'){
          this.setState({
            heatStatus:true
          });
          Toast.info('已开启蓄热');
        }else if(value ==='close'){
          this.setState({
            heatStatus:false
          })
          Toast.info('已关闭蓄热');
        }
      }
    }, (err) => {
      console.log(err);
    });
  }
  async getHeat() {
    const recUrl = 'https://data.haier.net/ac-warmup-rest/contract/signed/'+devicemac;
    // const recUrl = 'http://192.168.160.185:7120/ac-warmup-rest/contract/signed/'+devicemac;
    const data = {
      'mac':devicemac,
    };
    const userInfo = await getUserInfo();
    let curveData = '';
    let globalHeaders = await getGlobalHeaders();
    globalHeaders.timestamp = String(new Date().getTime());
    globalHeaders.sign= SHA256('/ac-warmup-rest/contract/signed/'+ devicemac + "" + globalHeaders.appId + globalHeaders.appKey + globalHeaders.timestamp);
    const access= {'Access-User-Token':userToken};
    globalHeaders = Object.assign(globalHeaders,access);
    const http = await getHttp();
    http.get(recUrl,{}, globalHeaders, (resp) => {
      console.log(resp);
      let Data = {};
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        Data = JSON.parse(resp.data);
      } else {
        Data = resp.data;
      }
      if (Data.retCode === '1000') {
        if(Data.data ===true){
          this.setState({
            heatStatus:true
          })
        }else{
          this.setState({
            heatStatus:false
          })
        }
      }
    }, (err) => {
      console.log(err);
    });
  }

  componentWillMount() {
    this.getHeat();
  }
  render() {
    hideDeviceInfo(false);
    const height = document.documentElement.clientHeight;
    return (<div style={{height:`${height}px`,position:'relative'}}>
                <div className="upcore-navbar">
                    <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left" ></span>
                    <span className="upcore-navbar-icon-span">{'蓄热'}</span>
                </div>
                <div className="heatStatusTitle">
                  欢迎使用“蓄热”功能
                </div>
                <div className="heatStatusDecNone" style={{display:this.state.heatStatus?'none':'block'}}>
                  <div>
                    <p style={{fontSize:'14px'}}>蓄热</p>
                    <p style={{fontSize:'12px'}}>是什么</p>
                  </div>
                  <div>
                    <p>根据环境情况和使用习惯，结合大数据算法，海尔空调大数据平台对您当前的空调进行智能调控预热，保证您的舒适体验。蓄热功能开启空调室外机风扇运转、压机运转，会产生一定耗电量！</p>
                  </div>
                </div>
                <div className="heatStatusBtnNone" style={{display:this.state.heatStatus?'none':'block'}}>
                  <button onClick={()=>{this.openHeat('open');}}>开启蓄热</button>
                </div>
                <div className="heatStatusDecDisplay" style={{display:this.state.heatStatus?'block':'none'}}>
                  <p>蓄热已开启</p>
                </div>

                <div className="heatStatusBtnDisplay" style={{display:this.state.heatStatus?'block':'none'}}>
                  <button onClick={()=>{this.openHeat('close');}}>关闭蓄热</button>
                </div>
                <div className="heatStatusRemarks">注：预热功能仅针对冬季制热模式进行学习</div>
                {/*<div className="mainPurifying" style={{display:this.state.ControlResult === 'block'?'none':'block'}}>*/}
                    {/*<img src={require("./images/loading.png")}/>*/}
                    {/*<p>重新计时后,净化滤芯累计时间清零</p>*/}
                {/*</div>*/}
                {/*<div className="purifyingFilterbtContainer" style={{display:this.state.ControlResult === 'block'?'none':'block'}}>*/}
                    {/*<div onClick={()=>{this.purifyingBt();}} className="fontBlue">已清洗,&nbsp;&nbsp;重新计时</div>*/}
                {/*</div>*/}
                {/*<div className="success" style={{display:this.state.ControlResult}}>*/}
                    {/*<img src={require("./images/success.png")}/>*/}
                    {/*<p>净化滤芯累计时间已清零</p>*/}
                {/*</div>*/}

            </div>);
  }
}
