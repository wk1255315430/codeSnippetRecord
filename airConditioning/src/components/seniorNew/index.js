import classnames from 'classnames';
import React from 'react';
import {inject, observer} from 'mobx-react';
import { getAttribute,getGlobalHeaders,getUrlParams,getHttp,getUserInfo } from '../../util/tool';
import { Toast } from 'antd-mobile';
import './style/index.less';
import {arrayMove} from 'react-movable';
import List from 'react-movable/lib/List';
let sHA256 = require('js-sha256').sha256;

//空调类型：1:定频；0：变频
let type = '0';
//空调清洁类型
let firstCleanDevice = 'false';
let hotSeniorArr =[]; //我的定制
let moreSeniorArr =[]; //更多
let seniorFunctionConfig = [{
  attrName: 'energySaving',
  dev: '智慧节能',
  isShow:true,
  uplusid:'1001',
  image:require('../style/imageNew/custmfunction_energysaving.png')
}, {
  attrName: 'timing',
  dev: '定时开关机',
  isShow:true,
  uplusid:'1002',
  image:require('../style/imageNew/customfunction_timing.png')
}, {
  attrName: 'energyRecord',
  dev: '能耗记录',
  isShow:false,
  uplusid:'1003',
  image:require('../style/imageNew/customfunction_energyconsumptionrecords.png')
}, {
  attrName: 'sleepingCurve',
  dev: '睡眠曲线',
  isShow:true,
  uplusid:'1004',
  image:require('../style/imageNew/customfunction_sleep.png')
}, {
  attrName: 'faultDetection',
  dev: '故障检测',
  isShow:false,
  uplusid:'1005',
  image:require('../style/imageNew/customfunction_faultdetection.png')
}, {
  attrName: 'filterCleaning',
  dev: '滤网清洗',
  isShow:false,
  uplusid:'1006',
  image:require('../style/imageNew/customfunction_filter.png')
}, {
  attrName: 'airConditioningCleaning',
  dev: '空调清洁',
  isShow:false,
  uplusid:'1007',
  image:require('../style/imageNew/customfunction_acclean.png')
}, {
  attrName: 'purifyingFilter',
  dev: '净化滤芯',
  isShow:false,
  uplusid:'1008',
  image:require('../style/imageNew/customfunction_jhlx.png')
}, {
  attrName: 'heatAccumulation',
  dev: '蓄热',
  isShow:false,
  uplusid:'1009',
  image:require('../style/imageNew/heatAccumulationStatus.png')
}];
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@observer
export default class SeniorNew extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      editState:false,
      display:true,
      seniorFunctionConfig:seniorFunctionConfig,
      seniorFunctionConfigFrom:[],
      hotSeniorArr:[],
      moreSeniorArr:[]
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.seniorEdit = this.seniorEdit.bind(this);
    this.gotoSubpage = this.gotoSubpage.bind(this);
    this.offLineToast = this.offLineToast.bind(this);
    this.powerOffToast = this.powerOffToast.bind(this);
    this.selectAdvance = this.selectAdvance.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  async seniorEdit() {
    this.setState({editState:!this.state.editState});
    //点击完成才会保存数据
    if(this.state.editState){
      hotSeniorArr =[]; //我的定制
      moreSeniorArr =[]; //更多
      const [...seniorFunctionConfigclone] = this.state.seniorFunctionConfig;
      let k=0; //数组里更多的下标
      for(let j in seniorFunctionConfigclone){
        if(seniorFunctionConfigclone[j].dev === '更多'){
          k=j;
          break;
        }
      }
      // for (let i=0;i<seniorFunctionConfigclone.length;i++){
      //   //如果i小于k才会在首页展示
      //   if(i<k){
      //     // seniorFunctionConfigclone[i].customizationFlag='1';
      //     // seniorFunctionConfigclone[i].functionRank=i+1;
      //     hotSeniorArr.push(seniorFunctionConfigclone[i]);
      //   }else if(i>k){
      //     // seniorFunctionConfigclone[i].customizationFlag='0';
      //     // seniorFunctionConfigclone[i].functionRank=i;
      //     moreSeniorArr.push(seniorFunctionConfigclone[i]);
      //   }
      // }
      let funSeqinfoList=[];
      let arr=this.state.seniorFunctionConfigFrom;
      for (let i=0;i<seniorFunctionConfigclone.length;i++){
        for(let x=0;x<arr.length;x++){
          if(i<k){
            if(seniorFunctionConfigclone[i].attrName === arr[x].functionCode){
              arr[x].customizationFlag='1';
              arr[x].functionRank=i+1;
              funSeqinfoList.push(arr[x]);
              hotSeniorArr.push(seniorFunctionConfigclone[i]);
            }
          }else if(i>k){
            if(seniorFunctionConfigclone[i].attrName === arr[x].functionCode){
              arr[x].customizationFlag='0';
              arr[x].functionRank=i;
              funSeqinfoList.push(arr[x]);
              moreSeniorArr.push(seniorFunctionConfigclone[i]);
            }
          }
        }
      }
      this.setState({
        hotSeniorArr:hotSeniorArr,
        moreSeniorArr:moreSeniorArr
      });
      const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/function/insertAdvance';
      const userInfo = await getUserInfo();
      const data = {
        'mac': devicemac,
        'userId':userInfo.retData?userInfo.retData.userId : '',
        'productType':model,
        'funSeqinfoList':funSeqinfoList
      };
      let globalHeaders = await getGlobalHeaders(data);
      const http = await getHttp();
      http.post(recUrl, data, globalHeaders, (resp) => {
        console.log(resp);

      }, (err) => {
        console.log(err);
        // Toast.fail('获取附加功能排序失败!', 2);
      });
    }

  }
  async gotoSubpage(path,item) {
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    const extentInfo = {
      'uplusActionName':item.dev,
      'uplusCategoryId':'设备详情页-空调-高级功能',
      'uplusPageName':'空调定制服务列表页'
    };
    const onOffObj = getAttribute('onOffStatus',this.props.DeviceState.attributes);
    const isPowerOn = onOffObj.value === 'true'? true: false;
    // 在线信息
    let isOnline = onlineStatus;
    // if (baseInfo && baseInfo.connection) {
    //   // OFFLINE, UNCONNECTED, CONNECTING, CONNECTED, READY
    //   isOnline = baseInfo.connection === 'READY';
    // } else {
    //   isOnline = (baseInfo && baseInfo.deviceInfo && baseInfo.deviceInfo.status &&
    //     String(baseInfo.deviceInfo.status.online).toUpperCase() === 'TRUE');
    // }
    const alarmObj = await cordovaUtil.initDeviceReady().then(() => {
      cordovaUtil.logicEngineModule.getCautionsPromise(window.devicemac).then((list) => {
        console.log(list);
        return list.retData;
      });
    }) || [];
    //开始
    let self = this;
    if (type === '1' && path === 'energyRecord') {
      Toast.info('糟糕！定频空调无此功能', 2);
    } else if (!isOnline) {
      self.offLineToast(path,item);
    } else if (!isPowerOn) {
      self.powerOffToast(path,item);
    } else if (path === 'sleepingCurve' && (alarmObj.length !== 0)) {
      Toast.fail('空调故障中，睡眠曲线不可用', 3);
    } else if (path === 'airConditioningCleaning') {
      this.props.history.push({
        pathname: '/airConditioningCleaning',
        state: firstCleanDevice
      });
    }else {
      cordovaUtil.upTraceModule.reportPageClickEvent({actionCode:item.uplusid,extentInfo:extentInfo}).then((ret) => {
        this.props.history.push(`/${path}`);
      });
      // this.props.history.push(`/${path}`);
    }
  }
  offLineToast(path,item){
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    const extentInfo = {
      'uplusActionName':item.dev,
      'uplusCategoryId':'设备详情页-空调-高级功能',
      'uplusPageName':'空调定制服务列表页'
    };
    if (path === 'timing') {
      Toast.fail('空调离线中，无法进行定时开关机', 3);
    } else if (path === 'sleepingCurve') {
      Toast.fail('空调离线中，睡眠曲线不可用', 3);
    } else if (path === 'faultDetection') {
      Toast.fail('空调离线中，无法进行故障检测', 3);
    } else if (path === 'airConditioningCleaning') {
      Toast.fail('空调离线中，无法进行空调清洁', 3);
    } else if (path === 'purifyingFilter') {
      Toast.fail('空调离线中，无法进行净化滤芯', 3);
    } else {
      cordovaUtil.upTraceModule.reportPageClickEvent({actionCode:item.uplusid,extentInfo:extentInfo}).then((ret) => {
        this.props.history.push(`/${path}`);
      });
      // this.props.history.push(`/${path}`);
    }
  }
  powerOffToast(path,item){
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    const extentInfo = {
      'uplusActionName':item.dev,
      'uplusCategoryId':'设备详情页-空调-高级功能',
      'uplusPageName':'空调定制服务列表页'
    };
    if (path === 'faultDetection') {
      Toast.fail('空调关机中，无法进行故障检测', 3);
    } else if (path === 'sleepingCurve') {
      Toast.fail('空调关机中，睡眠曲线不可用', 3);
    } else if (path === 'purifyingFilter') {
      Toast.fail('空调关机中，无法进行净化滤芯', 3);
    } else {
      cordovaUtil.upTraceModule.reportPageClickEvent({actionCode:item.uplusid,extentInfo:extentInfo}).then((ret) => {
        this.props.history.push(`/${path}`);
      });
      // this.props.history.push(`/${path}`);
    }
  }
  //结束
  async getParams() {
    const { prefixCls, attributes,isOnline,cordovaUtil,history} = this.props;
    const self = this;
    // await getGlobalHeaders();
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/device/get_cityDevlist';
    const userInfo = await getUserInfo();
    const data = {
      'get_devlist_info': {
        'sctx': {
          'appId': userInfo.retData ? userInfo.retData.appId : '',
          'appVersion': userInfo.retData ? userInfo.retData.appVersion : '',
          'clientId': userInfo.retData ? userInfo.retData.clientId : ''
        },
        'typeIdentifier': typeid,
        'type': '',
        'subType': '',
        'specialCode': ''
      }
    };
    let curveData = '';
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    //   return cordovaUtil.httpEngine;
    // });
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      // console.log(resp);
      let Data = {};
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        Data = JSON.parse(resp.data);
      } else {
        Data = resp.data;
      }
      if (Data.retCode === '00000' && Data.cityList.length > 0) {
        for (let i = 0; i < Data.cityList.length; i++) {
          for (let j = 0; j < Data.cityList[i].classList.length; j++) {
            for (let k = 0; k < Data.cityList[i].classList[j].deviceList.length; k++) {
              let list = Data.cityList[i].classList[j].deviceList[k];
              if (list.mac === devicemac) {
                type = list.fixedState;
                firstCleanDevice = list.firstCleanDevice;
                console.log(type);
                console.log(firstCleanDevice);
                return;
              }
            }
          }
        }
      }
    }, (err) => {
      console.log(err);
    });
    return true;
  }
  async selectAdvance(){

    let newseniorFunctionConfig = [];//合并后的数组
    // for (let i=0;i<seniorFunctionConfig.length;i++){
    //   if(seniorFunctionConfig[i].isShow){
    //     hotSeniorArr.push(seniorFunctionConfig[i]);
    //   }else{
    //     moreSeniorArr.push(seniorFunctionConfig[i]);
    //   }
    // }



    //获取数据库里的附加功能列表
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/function/selectAdvance';
    // const recUrl = 'http://192.168.160.134:7240/uhome/acbiz/function/selectAdvance';
    let curveData = '';

    const userInfo = await getUserInfo();
    const data = {
      'mac': devicemac,
      'userId':userInfo.retData?userInfo.retData.userId : '',
      'productType':model,
    };
    let globalHeaders = await getGlobalHeaders(data);
    console.log(globalHeaders,'selectAdvance');
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      const resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      console.log(curveData);
      if (curveData.retCode === '0000') {
        //去重
        var arr =curveData.funSeqinfoList;
        var result = [];
        var obj = {};
        for(var l =0; l<arr.length; l++){
          if(!obj[arr[l].functionCode]){
            result.push(arr[l]);
            obj[arr[l].functionCode] = true;
          }
        }
        arr =result;
        //去重结束
        hotSeniorArr =[]; //我的定制
        moreSeniorArr =[]; //更多
        for(let i=0;i<arr.length;i++){
          for (let j=0;j<seniorFunctionConfig.length;j++){
            if(arr[i].functionCode === seniorFunctionConfig[j].attrName){
              if(arr[i].customizationFlag==='1'){
                hotSeniorArr.push(seniorFunctionConfig[j]);
              }else{
                moreSeniorArr.push(seniorFunctionConfig[j]);
              }
            }
          }
        }
        this.setState({
          hotSeniorArr:hotSeniorArr,
          moreSeniorArr:moreSeniorArr
        });
        newseniorFunctionConfig=hotSeniorArr.concat([{dev: '更多'}]);
        newseniorFunctionConfig = newseniorFunctionConfig.concat(moreSeniorArr);
        this.setState({
          seniorFunctionConfig:newseniorFunctionConfig,
          seniorFunctionConfigFrom:arr
        });

      } else{
        // Toast.fail('获取定制排序失败!', 2);
      }
    }, (err) => {
      hotSeniorArr =[]; //我的定制
      moreSeniorArr =[]; //更多
      console.log(err);
      for (let j in seniorFunctionConfig){
        if(seniorFunctionConfig[j].isShow){
          hotSeniorArr.push(seniorFunctionConfig[j]);
        }else{
          moreSeniorArr.push(seniorFunctionConfig[j]);
        }
      }
      this.setState({
        hotSeniorArr:hotSeniorArr,
        moreSeniorArr:moreSeniorArr,
        display:false
      });
      // Toast.fail('获取定制排序失败!', 2);
    });
  }
  //换token
  async getToken() {
    let getSign = (url, body, appId, appKey, timestamp) => {
      return sHA256(url + body + appId + appKey + timestamp);
    };
    const recUrl = 'https://data.haier.net/system-manager-rest/token/exchange';
    // const recUrl = 'http://192.168.160.185:7020/system-manager-rest/token/exchange';
    const userInfo = await getUserInfo();
    const data = {
      'accessToken':userInfo.retData ? userInfo.retData.accessToken : '',
      'sysCode':'openplatform',
      'username':'acgroup'
    };
    console.log(data,'tokendata');
    let curveData = '';
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    // let getSign =sHA256(recUrl + data + globalHeaders.appId + globalHeaders.appKey + globalHeaders.timestamp);
    globalHeaders.sign= sHA256('/system-manager-rest/token/exchange' + JSON.stringify(data) + globalHeaders.appId + globalHeaders.appKey + globalHeaders.timestamp);
    const access= {'Access-User-Token':userInfo.retData ? userInfo.retData.accessToken : ''};
    globalHeaders = Object.assign(globalHeaders,access);
    console.log(globalHeaders,'exchange');
    const http = await getHttp();

    http.post(recUrl, data, globalHeaders, (resp) => {

      let Data = {};
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        Data = JSON.parse(resp.data);
      } else {
        Data = resp.data;
      }
      if (Data.retCode === 0) {
        window.userToken=Data.data['Access-User-Token'];//临时赋值
      }

    }, (err) => {
      console.log(err);
    });
  }
  componentWillMount() {
    //只有R机型,才会有净化滤芯的功能入口
    // if (seniorFunctionConfig.length > 7 && typeid !== '201c120024000810031200000000000000000000020000000000000000000040' && typeid !== '201c120024000810021200000000000000000000010000000000000000000040') {
    //   seniorFunctionConfig.pop();
    // }
    // if(seniorFunctionConfig.length > 7 && (model === 'KFR-35GW/23ABA21AU1套机'||model === 'KFR-35GW/23AAA21AU1套机' || model === 'KFR-26GW/23ABA21AU1套机')) {
    //   seniorFunctionConfig.pop();
    // }
    // if(seniorFunctionConfig.length > 7 && (model === 'KFR-35GW/01AAA81AU1套机'|| model === 'KFR-35GW/01ABA81AU1套机'|| model === 'KFR-26GW/01ABA81AU1套机'|| model === 'KFR-35GW/01ABA23AU1套机'|| model === 'KFR-26GW/01ABA23AU1套机')) {
    //   seniorFunctionConfig.pop();
    // }
    this.getParams();
    this.getToken();
    // this.selectAdvance();



  }

  render() {
    const self = this;
    const { prefixCls} = this.props;
    if(this.state.hotSeniorArr.length===0 && this.state.moreSeniorArr.length === 0){
      this.selectAdvance();

    }
    // const hotSenior = ['energyRecord','timing','energySaving'];
    // let hotSeniorArr =[];
    // let moreSeniorArr =[];
    // for (let i=0;i<seniorFunctionConfig.length;i++){
    //   moreSeniorArr.push(seniorFunctionConfig[i]);
    // }
    // for(let i=0;i<hotSenior.length;i++){
    //   for (let j in seniorFunctionConfig){
    //     if(hotSenior[i] === seniorFunctionConfig[j].attrName){
    //       hotSeniorArr.push(seniorFunctionConfig[j]);
    //       moreSeniorArr.splice(j,1);
    //     }
    //   }
    // }
    return (
      <div className={classnames(`${prefixCls}`)}>
        <div className="upcore-navbar">
          <span className="upcore-navbar-icon-left" onClick={this.gotoIndex}></span>
          <span className="upcore-navbar-icon-span">定制服务</span>
          <span className={classnames(`${prefixCls}-icon-right`)} style={{display:this.state.display?'inline-block':'none'}} onClick={()=>{self.seniorEdit();}} data-uplus-id="1010" data-uplus-action-name="高级功能编辑" data-uplus-page-name="空调定制服务列表页" data-uplus-category-id="设备详情页-空调-高级功能">{this.state.editState?'完成':'编辑'}</span>
        </div>
        <div className={classnames(`${prefixCls}-container`)} style={{display:(this.state.hotSeniorArr.length !==0 || this.state.moreSeniorArr.length !== 0)?'block':'none'}}>
          <div className={classnames(`${prefixCls}-container-customtitle`)}>
            <span>我的定制</span>
            <span style={{display:this.state.editState?'inline-block':'none'}}>(选定后在操控页面展示)</span>
          </div>
          <div className={classnames(`${prefixCls}-container-customlist`)}>
            <div style={{display:this.state.editState?'block':'none'}}>
              <List
                values={this.state.seniorFunctionConfig}
                onChange={({ oldIndex, newIndex }) =>
                  this.setState(prevState => ({
                    seniorFunctionConfig: arrayMove(prevState.seniorFunctionConfig, oldIndex, newIndex)
                  }))
                }
                renderList={({ children, props }) => <div {...props}>{children}</div>}
                renderItem={({ value, props }) => {
                  const title=(
                    <div className={classnames(`${prefixCls}-container-moretitle`)}>
                      <span>更多</span>
                    </div>
                  );
                  if(value.dev ==='更多'){
                    return (title);
                  }
                  let row =(<div></div>);
                  // if(this.state.editState){
                  row = (
                    <div {...props} className={classnames(`${prefixCls}-container-item`)} onClick={()=>{self.gotoSubpage(value.attrName,value);}} >
                      <img src={value.image}/>
                      <span>{value.dev}</span>
                      <span className={classnames(`${prefixCls}-container-item-span`)}></span>
                    </div>);
                  return (row);
                }}
              />
            </div>
          </div>
          <div style={{display:this.state.editState?'none':'block'}}>
            {
              this.state.hotSeniorArr.map( function(item, index) {
                return (
                  <div className={classnames(`${prefixCls}-container-item`)} key={index} onClick={()=>{self.gotoSubpage(item.attrName,item);}} >
                    <img src={item.image}/>
                    <span>{item.dev}</span>
                    <span className={classnames(`${prefixCls}-container-item-span`)}></span>
                  </div>
                );
              })
            }
          </div>
          <div style={{display:this.state.editState?'none':'block'}}>
            <div className={classnames(`${prefixCls}-container-moretitle`)}>
              <span>更多</span>
            </div>
            <div>
              {
                this.state.moreSeniorArr.map( function(item, index) {
                  return (
                    <div className={classnames(`${prefixCls}-container-item`)} key={index} onClick={()=>{self.gotoSubpage(item.attrName,item);}} >
                      <img src={item.image}/>
                      <span>{item.dev}</span>
                      <span className={classnames(`${prefixCls}-container-item-span`)} ></span>
                    </div>
                  );
                })
              }
            </div>
          </div>

        </div>
        <div className={classnames(`${prefixCls}-fix`)} style={{display:this.state.editState?'block':'none'}}>
          <img src={require('../style/image/gestures.png')}/>
          <span>长按拖动调整位置</span>
        </div>
      </div>
    );
  }
}
SeniorNew.defaultProps = {
  prefixCls: 'seniorNew',
  attributes: []
};

