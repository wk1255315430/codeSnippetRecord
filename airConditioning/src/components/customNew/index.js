import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { getAttribute,getGlobalHeaders,getUrlParams,getHttp,getUserInfo } from '../../util/tool';
import { Toast } from 'antd-mobile';
let urlObj = getUrlParams();
let devicemac = urlObj.devicemac;
let hotSeniorArr =[];
// let typeid = urlObj.typeid;

//空调类型：1:定频；0：变频
let type = '0';
//空调清洁类型
let firstCleanDevice = 'false';
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
  uplusid:'1003',
  image:require('../style/imageNew/customfunction_energyconsumptionrecords.png')
}, {
  attrName: 'sleepingCurve',
  dev: '睡眠曲线',
  isShow:false,
  uplusid:'1004',
  image:require('../style/imageNew/customfunction_sleep.png')
}, {
  attrName: 'faultDetection',
  dev: '故障检测',
  isShow:true,
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
export default class CustomNew extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      hotSeniorArr:[]
    };
    this.gotoSubpage = this.gotoSubpage.bind(this);
    // this.getParams = this.getParams.bind(this);
    this.offLineToast = this.offLineToast.bind(this);
    this.powerOffToast = this.powerOffToast.bind(this);
    this.selectAdvance = this.selectAdvance.bind(this);
  }
  async gotoSubpage(path,item) {
    const { prefixCls, attributes,isOnline,cordovaUtil,history} = this.props;
    const extentInfo = {
      'uplusActionName':item.dev,
      'uplusCategoryId':'设备详情页-空调-高级功能',
      'uplusPageName':'空调定制服务列表页'
    };
    const onOffObj = getAttribute('onOffStatus',this.props.attributes);
    const isPowerOn = onOffObj.value === 'true'? true: false;
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
    }
  }
  offLineToast(path,item){
    const { prefixCls, attributes,isOnline,cordovaUtil,history} = this.props;
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
    }
  }
  powerOffToast(path,item){
    const { prefixCls, attributes,isOnline,cordovaUtil,history} = this.props;
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
  //  结束
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
    const http = await getHttp();

    http.post(recUrl, data, globalHeaders, (resp) => {
      const resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }


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
        hotSeniorArr=[];
        for(let i=0;i<arr.length;i++){
          for (let j in seniorFunctionConfig){
            if(arr[i].functionCode === seniorFunctionConfig[j].attrName && arr[i].customizationFlag==='1'){
              hotSeniorArr.push(seniorFunctionConfig[j]);
            }
          }
        }
        this.setState({
          'hotSeniorArr': hotSeniorArr
        });
      } else{
        // Toast.fail('获取定制排序失败!', 2);
      }
    }, (err) => {
      console.log(err);
      hotSeniorArr=[];
      for (let j in seniorFunctionConfig){
        if(seniorFunctionConfig[j].isShow){
          hotSeniorArr.push(seniorFunctionConfig[j]);
        }
      }
      this.setState({
        'hotSeniorArr': hotSeniorArr
      });
      // Toast.fail('获取定制排序失败!', 2);
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
    this.selectAdvance();

  }
  render() {
    const self = this;
    if(this.state.hotSeniorArr.length===0){
      this.selectAdvance();
    }
    const { prefixCls, attributes,isOnline,cordovaUtil,history} = this.props;
    return (
      <div className={classnames(`${prefixCls}`)} style={{display : (isOnline && typeid !=='20086108008203240212fd22052be6000000ce57f0dc6699fd60c0984ab02440')?'block':'none'}}>
        <div className={classnames(`${prefixCls}-title`)}>我的定制</div>
        <div className={classnames(`${prefixCls}-main`)}>
          {
            this.state.hotSeniorArr.map( function(item, index) {
              return (
                <div key={index} className={classnames(`${prefixCls}-main-item`)} onClick={()=>{self.gotoSubpage(item.attrName,item);}} >
                  <div className={classnames(`${prefixCls}-main-item-container`)}>
                    <img src={item.image}/>
                    <div>{item.dev}</div>
                  </div>

                </div>
              );
            })
          }
          <div className={classnames(`${prefixCls}-main-item`)} onClick={() => {
            this.props.history.push('/seniorNew');
            window.scrollTo(0, 0);
          }}>
            <div className={classnames(`${prefixCls}-main-item-container`)}>
              <img src={require('../style/imageNew/customfunction_more.png')}/>
              <div>更多</div>
            </div>
          </div>
          <div style={{clear:'both'}}></div>
        </div>
      </div>
    );
  }
}
CustomNew.defaultProps = {
  prefixCls: 'customNew',
  attributes: []
};

