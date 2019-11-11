/* eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { CordovaUtil } from '@uplus/updevicecore';
import { hideDeviceInfo, getGlobalHeaders,getHttp,getUserInfo } from '../../util/tool';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import UplusApi from '@uplus/uplus-api/es/uplus-api';
// import md5 from 'js-md5';
// const cordovaUtil = new CordovaUtil();
require('./faultDetection.css');
let isError = false;

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}
async function doAjax(_self, _alarmLenth) {
  // await getGlobalHeaders();
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //   return cordovaUtil.httpEngine;
  // });
  const data = {
    'mac': devicemac,
  };
  let globalHeaders = await getGlobalHeaders(data);
  globalHeaders.timestamp = String(new Date().getTime());
  const http = await getHttp();
  let url = 'https://uhome.haier.net:7253/acquisitionData/device/scene/getDeviceFilterState';
  http.post(url, data, globalHeaders, function(res) {
    //let datas = JSON.parse(res.data);
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    let desc = datas.desc;
    console.log(datas);
    if (_alarmLenth > 0) {
      _self.setState({
        resuleDesc: '需要维修'
      });
      _self.setState({
        optimization: desc === '急需清洗' ? 'block' : (desc === '需要清洗' ? 'block' : 'none')
      });
    } else {
      _self.setState({
        resuleDesc: desc === '急需清洗' ? '有待优化' : (desc === '需要清洗' ? '有待优化' : '状态良好')
      });
    }
    console.log(desc);
  }, function(e) {
    console.log(e);
  });
  return true;
}
// async function getAjax(_fault) {
//     // await getGlobalHeaders();
//     // const http = await cordovaUtil.initDeviceReady().then(() => {
//     //     return cordovaUtil.httpEngine;
//     // });
//     const data = {};
//     let globalHeaders = await getGlobalHeaders(data);
//     globalHeaders.timestamp = String(new Date().getTime());
//     const http = await getHttp();
//     const recUrl = `http://uhome.haier.net:7260/uhome/acbiz/fault/${faultCode}/getFaultInfo`;
//     http.post(recUrl,data,globalHeaders,function (res){
//         let resptype = typeof(res.data);
//         let datas = {};
//         if (resptype === 'string') {
//             datas = JSON.parse(res.data);
//         } else {
//             datas = res.data;
//         }
//         console.log('12345',datas);
//         console.log('1234',res);
//         console.log("123",res.data);
//         // window.faultName=res.data.faultName;
//         // window.serverFault =res.serverFault;
//         window.userAdvice = datas.userAdvice;
//         window.userTip = datas.userTip;
//     }, function(e) {
//         console.log(e);
//     });
//     return true;
// }
// async function postAjax(_Repair) {
//     // await getGlobalHeaders();
//     // const http = await cordovaUtil.initDeviceReady().then(() => {
//     //     return cordovaUtil.httpEngine;
//     // });
//     // window.globalHeaders.timestamp = String(new Date().getTime());
//     const userInfo = await getUserInfo();
//     const data = {
//         code:303,
//         key:'8f0faab91b0f47529c491b2d9c18d122',
//         phonecenter:userInfo.retData?userInfo.retData.phonecenter : '',
//         access_token:userInfo.retData?userInfo.retData.accessToken : '',
//     };
//     let globalHeaders = await getGlobalHeaders(data);
//     globalHeaders.timestamp = String(new Date().getTime());
//     const http = await getHttp();
//     // let url='http://entrace.haier.net:8778/uesrCenter/gateWay';
//     let url = 'http://entrace.haier.net:8778/go_weizhan/homeForeign';
//     http.post(url, data, globalHeaders, function (res) {
//         let resptype = typeof(res.data);
//         let datas = {};
//         if (resptype === 'string') {
//             datas = JSON.parse(res.data);
//         } else {
//             datas = res.data;
//         }
//         window.Repair=datas.data;
//
//     });
// }
// async function repair(){
//     let errDes =errorName;
//     let arr =['室内温度传感器故障','室外EEPROM异常','CBD与模块通讯故障','电源超、欠压保护','室外无负载故障','室内EEPROM故障','室外风机故障'];
//     for(let i =0;i<arr.length;i++){
//         if(arr[i] ===errDes){
//             isError = true;
//             break;
//         }else{
//             isError = false;
//         }
//     }
//     console.log(errDes,isError,'11111111111');
// }
const alarmArrays = ['室内制热过载/高负荷报警', '室外模块故障', '室外除霜传感器故障', '室外排气传感器故障', '室外AC电流保护', '室外EEPROM异常', '室内盘管传感器故障', '室外压机运转异常', '室外DC电流保护', '室内外通讯故障', '电源超、欠压保护', '面板与内机通信故障', '室外无负载故障', '室外压机过热保护', 'CT电流异常', '室外环境传感器异常', '室外盘管传感器异常', '满水保护', '室内制冷结冰保护', '高低压力保护', '室外蒸发传感器故障', '室外制冷过载', '室内EEPROM故障', '室外回气传感器故障', '压机传感器故障', '压机回气温度过高', '水泵排水故障', '三相电电源故障', 'CBD与模块通讯故障', '室内风机故障', '室外风机故障', '四通阀故障', '门开关故障', '除尘网需清洗提示', '缺水保护', '湿度传感器故障', '室内温度传感器故障', '外部报警/耙流开关故障', '温度截止保护报警', '异模式运转故障', '电子膨胀阀故障', '室内蒸发传感器故障', '机械手限位故障', 'PM2.5传感器故障'];
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
      startBt: false
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
      if (i >= alarmArrays.length-2) {
        // const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
        const uplusApi = new UplusApi();
        // console.log(self.props);
        let alarmObj = []; //[{desc:'室内error',name:'indoorError'},{desc:'室外error',name:'outdoorError'}];
        // await cordovaUtil.initDeviceReady().then(() => {
        uplusApi.logicEngineModule.getCautionsPromise(window.devicemac).then((list) => {
          console.log(list.retData);
          alarmObj = alarmObj.concat(list.retData);
          // if(alarmObj.length>0){
          //   self.setState({
          //     resuleDesc: '需要维修'
          //   });
          // }
          self.setState({
            alarms: alarmObj,
            // online: onlineStatus
          });
          doAjax(self, alarmObj.length);
        });
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
  errClick(_desc, _name) {
    // console.log('999',_desc);
    // let arr =['室外模块故障','室外EEPROM异常','CBD与模块通讯故障','电源超、欠压保护','室外无负载故障','室内EEPROM故障','室外风机故障','室外直流风机故障'];
    // for(let i =0;i<arr.length;i++){
    //   if(arr[i] ===_desc){
    //       isError = true;
    //       break;
    //   }else{
    //       isError = false;
    //   }
      this.props.history.push('/detection');
    // }
    this.setState({
      errClick: true,
      errDes: _desc
    });
  }
  goFilterCleaning() {
    this.props.history.push('/filterCleaning');
  }
  custom() {
    this.props.history.push('/Repairs');
  }
  async componentWillMount() {
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
  	const self = this;
    this.setState({
      online: onlineStatus
  });
    // const uplusApi = new UplusApi();
  	// // console.log(self.props);
    // let alarmObj = []; //[{desc:'室内error',name:'indoorError'},{desc:'室外error',name:'outdoorError'}];
    // await cordovaUtil.initDeviceReady().then(() => {
    // uplusApi.logicEngineModule.getCautionsPromise(window.devicemac).then((list) => {
    //     console.log(list.retData);
    //     alarmObj = alarmObj.concat(list.retData);
    //     this.setState({
    //       alarms: alarmObj,
    //       online: onlineStatus
    //     });
    //     doAjax(self, alarmObj.length);
    //     // getAjax();
    //     // postAjax();
    //     // repair();
    //   });
    // });
  }
  componentDidMount(){
    let height = window.screen.height;
    document.getElementById('errorDetail').style.height = (height -40) + 'px';
    // document.getElementById('errorDetail').style.top = 'px';
  }
  render() {
    hideDeviceInfo(false);
    let alarmObj = this.state.alarms;
    let alarmArray = [];
    // let arr = [];
    for (let i = 0; i < alarmObj.length; i++) {
        // for(let i in alarmObj) {
        if (alarmArray.indexOf(alarmObj[i].desc) == -1) {
            alarmArray.push(alarmObj[i].desc);
        }
        // }
    }
    //   for (let i = 0; i < alarmArray.length; i++) {
    //     // arr.push(alarmArray[i]);
    //   arr.push(alarmArray[i].desc);
    // }
    window.faultCode=2;
    window.errorName=this.state.errDes;
    alarmObj = alarmArray;
    console.log(this.state.resuleDesc);
    const height = document.documentElement.clientHeight;
    return (<div className="bg" style={{height:`${height}px`}}>
                <div className="upcore-navbar">
                    <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left"></span>
                    <span className="upcore-navbar-icon-sapn">{'故障检测'}</span>
                </div>
                <div className="imgContainer">
                    <img src={require('./images/examination_aircon.png')} className="aircon" />
                    <img style={{display:this.state.resultShow}} src={this.state.resuleDesc==='有待优化'?(require('./images/optimize.png')):(this.state.resuleDesc==='状态良好'?require('./images/normal.png'):require('./images/maintenance.png'))} className="resultImg" />
                    <img style={{display:this.state.imgShow}} src={require("./images/examination_magnifier.png")} className="magnifier" />               
                </div>
                <div className="pContainer" style={{display:this.state.btShow}}>
                    <p className="fontWhite">请确保设备已联网</p>              
                </div>
                <div className="checkContainer" style={{display:this.state.imgShow}}>
                    <p className="fontWhite">室内机检测</p>
                    <p className="fontWhite">正在检测{this.state.checkItem}</p>
                </div>
                <div className="checking" style={{display:this.state.imgShow}}>
                    <p className="fontWhite">检测中{this.state.checkPoint}</p>
                </div>
                <div className={['resultContainer', this.state.resultShow==='block'?'showTags':'opacity0'].join(' ')}>
                    <p className="fontWhite" >{this.state.resuleDesc}</p>
                </div>
                <div className={['resultTipContainer', this.state.resuleDesc==='状态良好'?(this.state.resultShow === 'block'?'showTags':'opacity0'):'opacity0'].join(' ')}>
                    <p className="fontWhite">定期清洗空调滤网</p>
                    <p className="fontWhite">可以让空气更清新健康</p>
                </div>
                <div className={['resultTipContainer2', this.state.resuleDesc==='需要维修'?(this.state.resultShow === 'block'?'showTags':'opacity0'):'opacity0'].join(' ')}>
                    <p className="fontWhite alarmNum">{alarmObj.length}个故障</p>
                    {alarmObj.map((item,index)=>{
                        return (
                            <p onClick={()=>{this.errClick(item);}} key={'ALARM_ID' + index} className="fontWhite alarmItem"><img className="alarmIcon" src={require("./images/should_maintenance.png")} />{item}<b>＞</b></p>
                        );
                    })}
                    <p className="fontWhite alarmNum" style={{display:this.state.optimization}}>1个待优化项</p>
                    <p style={{display:this.state.optimization}} onClick={()=>{this.goFilterCleaning();}} className="fontWhite alarmItem"><img className="alarmIcon" src={require("./images/should_maintenance.png")} />滤网需要清洗<b>＞</b></p>                   
                </div>
                <div style={{display:this.state.resuleDesc ==='有待优化'? 'block':'none'}} className={['resultTipContainer2', this.state.resuleDesc ==='有待优化'?(this.state.resultShow === 'block'?'showTags':'opacity0'):'opacity0'].join(' ')}>
                    <p className="fontWhite alarmNum">1个待优化项</p>
                    <p onClick={()=>{this.goFilterCleaning();}} className="fontWhite alarmItem"><img className="alarmIcon" src={require("./images/should_maintenance.png")} />滤网需要清洗<b>＞</b></p>
                </div>
                <div className="btContainer">
                    <Button onClick={()=>{this.hideBt();}} style={{display:this.state.btShow}} className="fontBlue">开始</Button>
                </div>
                <div id="errorDetail" className={['errorDetail', this.state.resuleDesc==='需要维修'?(this.state.errClick === true?'DisBl':'DisNo'):'DisNo'].join(' ')}>
                    {/*<div className="imgContainer">*/}
                        {/*<img src={require("./images/icon_malfunction@3x.png")} className="faultIcon" />*/}
                        {/*<p className="errorName">{this.state.errDes}</p>*/}
                    {/*</div>*/}
                    {/*<div className="errData">*/}
                        {/*/!*<p className="xf1">故障描述：</p>*!/*/}
                        {/*<div className="xf2">故障原因：</div>*/}
                        {/*<div className="fontbg">{window.userTip}</div>*/}
                        {/*<div style={{clear:'both'}}></div>*/}
                    {/*</div>*/}
                    {/*<div className="errData2">*/}
                        {/*/!*<p className="fontbg">{this.state.faultDesc}</p>*!/*/}
                        {/*<div className="xf3">修复建议：</div>*/}
                        {/*<div className="fontbg2">{window.userAdvice}</div>*/}
                        {/*<div style={{clear:'both'}}></div>*/}
                    {/*</div>*/}
                    {/*<div className="btContainer" style={{display:isError?'none':'inline-block'}}>*/}
                        {/*<a className="aBt" href="tel:400-699-9999">电话报修</a>*/}
                        {/*<a className="aBx" onClick={() => {this.custom();}}>一键报修</a>*/}
                    {/*</div>*/}
                    {/*<div className="btContainer" style={{display:isError?'inline-block':'none'}}>*/}
                        {/*/!*<div className="btContainer" style={{display:isError?'none':'inline-block'}}>*!/*/}
                        {/*<a className="aBc" href="tel:400-699-9999">电话报修</a>*/}
                    {/*</div>*/}
                </div>
                <div className={['errorDetail', this.state.startBt===true?(this.state.online === false?'DisBl':'DisNo'):'DisNo'].join(' ')}>
                    <div className="imgContainer">
                        <img src={require("./images/icon_malfunction@3x.png")} className="faultIcon" />
                        <p className="errorCode">您的设备不在线</p>
                        <p className="errorCode">请联网后重新进入该页面</p>
                    </div>
                </div>
            </div>);
  }
}