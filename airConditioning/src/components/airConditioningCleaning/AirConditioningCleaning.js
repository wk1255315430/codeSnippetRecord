/* eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { CordovaUtil } from '@uplus/updevicecore';
import { hideDeviceInfo, getGlobalHeaders, getAttribute,getHttp} from '../../util/tool';
import { Carousel, WingBlank, Toast } from 'antd-mobile';
// import Senior from "../senior/Senior";
// const cordovaUtil = new CordovaUtil();
require('./airConditioningCleaning.css');
var cleanType = 1;
function tip() {
  Toast.info('重置成功', 2, null, false);
}
async function getTotalWork(_self) {
  const data = {
      'mac': devicemac,
  };
  let globalHeaders = await getGlobalHeaders(data);
  const http = await getHttp();
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //   return cordovaUtil.httpEngine;
  // });
  let timestamp = String((new Date()).valueOf());
  globalHeaders.timestamp = timestamp;
  let url = 'https://uhome.haier.net:7253/acquisitionData/device/scene/getDeviceSelfCleaningState';
  http.post(url, data, globalHeaders, function(res) {
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    //let datas = JSON.parse(res.data);
    let ts = parseInt(datas.ts, 10);
    ts = ts > 999 ? 999 : ts;
    _self.setState({
      totalWork: ts
    });
  }, function(e) {
    console.log(e);
  });
  return true;
}
async function resetCleanTime(_self, _flag) {
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //   return cordovaUtil.httpEngine;
  // });
  const data = {
      'mac': devicemac,
  };
  let globalHeaders = await getGlobalHeaders(data);
  const http = await getHttp();
  let timestamp = String((new Date()).valueOf());
  globalHeaders.timestamp = timestamp;
  let url = 'https://uhome.haier.net:7253/acquisitionData/device/scene/initDeviceSelfCleaningState';
  http.post(url, data, globalHeaders, function(res) {
    //console.log(res);
    //let datas = JSON.parse(res.data);
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    if (datas.retCode === '00000') {
      _self.setState({
        totalWork: 0
      });
      if (_flag) {
        setTimeout(function() {
          // tip();
        }, 300);
      }
    }
  }, function(e) {
    console.log(e);
  });
  return true;
}
async function calculatePercent(_self) {
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //   return cordovaUtil.httpEngine;
  // });

  const data = {};
  let globalHeaders = await getGlobalHeaders(data);
  const http = await getHttp();
  let timestamp = String((new Date()).valueOf());
  globalHeaders.timestamp = timestamp;
  let url = 'https://uhome.haier.net:7253/acquisitionData/device/scene/getSelfCleanTime/' + window.devicemac;
  http.post(url, {}, globalHeaders, function(res) {

    //console.log(res);
    //let datas = JSON.parse(res.data);
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    const nowTime=(new Date()).getTime();
    let startTime = datas.startTime||nowTime+'';
    startTime = startTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1/$2/$3 $4:$5:$6');
    startTime = new Date(startTime);
    // console.log("%s",startTime);
    let interval = ((new Date()).getTime() - startTime.getTime()) / (1000 * 60);
    if (selfCleaningStatusValue==='true') {
      if (_self.state.cleanFlag) {
        _self.setState({
          cleaning: true
        });
      }
    }
    let intervalObj = setInterval(function() {
      let dateNow = new Date();
      let intervalS = (dateNow.getTime() - startTime.getTime()) / 1000;
      // console.log('%s',startTime);
      let intervalM = intervalS / 60;
      if (selfCleaningStatusValue==='false') {
        _self.setState({
          cleanPercent: 0,
          cleanSec:0,
          // cleanStage: '自清洁完成，共耗时'+Math.ceil(intervalM)+'分钟',
          cleaning: false
        });
        window.clearInterval(intervalObj);
      } else {
        if (_self.state.cleanFlag) {
          _self.setState({
            cleaning: true
          });
        }
        // let calculatePer = Math.ceil(0.067 * intervalS);
        // calculatePer = calculatePer > 100 ? 100 : calculatePer;
        // let calculateSec=Math.ceil(intervalS%60+1)-1;
        // let calculatePer = Math.ceil(intervalM)-1;
        let calculateSec=parseInt(intervalS%60);
        let calculatePer = parseInt(intervalM);
        if(calculateSec<0){
            calculateSec =0;
        }
        _self.setState({
          cleanPercent: calculatePer,
            cleanSec:calculateSec,
        });
        // if (cleanType === 1) {
        //   if (intervalM < 19) {
        //     _self.setState({
        //       cleanStage: '室内结霜'
        //     });
        //   } else if (intervalM < 20) {
        //     _self.setState({
        //       cleanStage: '室内化霜'
        //     });
        //   } else {
        //     _self.setState({
        //       cleanStage: '自清洁即将完成'
        //     });
        //   }
        // } else {
        if (intervalM < 10) {
          _self.setState({
            cleanStage: '室内结霜'
          });
        } else if (intervalM < 11.5) {
          _self.setState({
            cleanStage: '室内化霜'
          });
        } else if (intervalM < 12.5) {
          _self.setState({
            cleanStage: '室外结霜'
          });
        } else if (intervalM < 17) {
          _self.setState({
            cleanStage: '室外化霜'
          });
        } else if (intervalM < 20.7) {
          _self.setState({
            cleanStage: '压力平衡'
          });
        } else if(intervalM > 20.7){
          _self.setState({
            cleanStage: '自清洁即将完成'
          });
        }else {
          _self.setState({
            isshowTime: false
          });
        }
        // }
      }
    }, 1000);
  }, function(e) {
    console.log(e);
  });
  return true;
}
var content = '　　中国疾病预防控制中心公布的空调卫生状况调查结果显示，在对60多个城市的空调系统风管积尘量和积尘细菌含量的检测中，存在严重污染的空调风管占47.11%，中等污染的占46.17%,合格的仅占6.12%。这组触目惊心的数字告诉我们，头顶上的空调成了危害家人健康的污染源！';
content = content + '<br/>空调污染的原因<br/>　　空调通风系统如果长期运行、却疏于清洁，将成为室内空气污染的主要污染源之一。空调使用和清洁不当，家庭室内装修材料，厨房油烟，家庭成员或客人吸烟带来的二手烟，以及室外进入的粉尘、有害气体都可能是室内污染的源头。及时清洁、清理室内污染源，保持室内环境干净卫生。';
content = content + '<br/>空调污染的危害<br/>空调房间内空气质量的优劣直接与人的健康息息相关<br/>　　密闭环境下，空气流通不好，室内污染物浓度增加，空气质量下降，对人体会产生不良影响及危害。<br/>　　室内空气污染可对人体的神经系统、呼吸系统、免疫系统造成危害，引发各种疾病或者使心脑血管等慢性病复发。';
content = content + '<br/>　　世界卫生组织已将室内空气污染与高血压、胆固醇过高症及肥胖症等共同列为人类健康的10大威胁之一。<br/>室内空气污染对婴幼儿、孕产妇、老弱病残等弱势人群影响更大<br/>　　日常生活中，有一些群体身体虚弱、抵抗力差，对环境适应能力也较差，主要包括婴幼儿、孕产妇、老年人、残疾人和患有急慢性疾病的人。';
content = content + '<br/>　　人的一生约有80%左右的时间是在室内度过的，而婴幼儿、孕产妇、老弱病残等敏感人群在室内停留的时间更长。<br/><br/>养成正确的空调清洗习惯刻不容缓<br/>　　仅清洁过滤网是不够的 散热片清洁消毒是关键';
content = content + '<br/>　　目前仍然有大多数家庭对空调的清洗通常只停留在过滤网层面，事实上这样做并不能够完全清除空调带来的污染。因为过滤网只过滤了一部分的灰尘，仍会有部分灰尘通过过滤网累积在散热片上，并累积了大量的病菌。';
content = content + '<br/>　　了解空调污染的真正的原因后，我们可以在清洁空调每次多做1步，清洁过滤网的同时对空调散热片也进行清洗及消毒，这样才能有效抑制散热片细菌滋生给室内空气带来污染。';
content = content + '<br/><br/>每月消毒1次<br/>每月清洁消毒空调散热片 空调真正洁净<br/>　　每年在换季的时节空调首次开机前都应该进行彻底的清洁与消毒，但是在空调使用频繁月份如夏季，由于人们可能会长时间待在空调房内，室内空气质量直接影响着我们的健康，所以需要定期对空调进行清洁。简单的方法便是对空调每月消毒1次。';
content = content + '<br/>　　空调散热片不可拆卸，而且由于其机构的特殊性，仅靠湿布擦拭、刷子清洁等手段是没有用的，而且还容易损坏散热片。对此，消毒空调散热片应使用正规空调消毒剂，自己动手就可以轻松完成。 同时，选用产品需具备“国家卫生部消毒产品证号”，这样杀菌消毒效果才有保证。';
content = content + '另外由于散热片上的污垢和病菌被清除，空调制冷效果也会更好，实在不失为一箭双雕之举。<br/>　　当然除了解决空调污染的源头之外，空调使用期间，空调房要经常开窗通风，保持空气流通，以减少室内空气污染。';
content = content + '<br/><br/>空调清洗消毒方法<br/>　　可使用具备国家卫生部消字证号和中华预防医学会认证的专业空调消毒剂产品自行清洁，空调清洗除了清洗空调面板和过滤网之外，还要使用含有“旋净芯”技术的专业消毒产品，对最易藏污纳垢危害人体健康的空调核心部件散热片进行彻底清洗消毒，这样才能确保杀菌保洁效果。';
content = content + '<br/><br/>空调外壳和过滤网的清洗';
content = content + '<br/>　　将窗户打开，通风，然后把要用的工具准备好：抹布一块、刷子一个、温水泡好的洗衣粉水半盆；先用抹布把空调外壳擦拭一遍，然后把外壳打开，将滤网拆卸下来，用干净过滤网刷子刷一刷，把附在过滤网上的绝大部分脏物刷干净，然后将过滤网放入洗衣粉水里泡一会，最后用流动的自来水对着过滤网冲一遍，';
content = content + '用干净的抹布慢慢抹干，然后将洗净的过滤网装回空调内部，将空调外壳关闭即可。<br/><br/>空调散热片的清洗<br/>依照家安空调消毒剂使用说明使用量：<br/>　　空调消毒剂（柜式机专用）每瓶可清洗消毒1台柜式空调（注：具体用量根据空调实际的污染程度而定）；';
content = content + '<br/>　　空调消毒剂（挂壁机专用）每瓶可清洗消毒2台挂壁式空调（注：具体用量根据空调实际的污染程度而定）。<br/><br/>清洗方法<br/>空调消毒剂（挂壁机专用）<br/>1. 关闭空调电源，拔去插头，开窗保持室内空气流通；<br/>';
content = content + '2. 打开空调表面面板，取下过滤网、空气净化过滤器（部分空调具备，参阅空调说明书），露出散热片；<br/>3. 扳去喷头顶部保险片，充分摇匀瓶罐，离散热片约5cm处，按上下顺序对整个散热片进行喷洗；<br/>4. 喷洗结束后等候15分钟左右，将过滤网装上后，再运转空调制冷程序15-30分钟，污水自动随排水管排出。';
content = content + '<br/>空调消毒剂（柜式机专用）<br/>1．格栅式空调： 关闭空调电源，拔去插头，透过空调出风口挡板或打开下方进风口处面板，看到散热片。<br/>滑盖式空调： 开启空调，滑盖滑下正常出风后，拔掉插头断电，透过空调出风口挡板，看到散热片。<br/>';
content = content + '2．喷嘴处插上喷射导管，扳去喷头顶部保险片，充分摇匀瓶罐，透过出风口对准散热片5cm左右进行喷洗。<br/>3．喷洗结束后等候15分钟，再正常运转空调制冷程序15-30分钟，污水自动随排水管排出。<br/>注意：请在使用时将导管插紧，以免喷射时掉落。';
content = content + '<br/><br/>使用时机<br/>换季清洗： 夏季空调首次开机前消毒1次 夏末空调使用时消毒1次，保养空调，为冬季安心使用空调做准备。<br/>日常清洗： 空调频繁使用过程中，<br/>每1个月清洁消毒1次，效果更佳';
// 获取底板信息
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class AirConditioningCleaning extends Component {
  constructor(props, context) {
    super(props, context);
    this.gotoIndex = this.gotoIndex.bind(this);
    this.startClean = this.startClean.bind(this);
    this.state = {
      status: 0,
      Carousel: ['1', '2'],
      imgHeight: 220,
      cleanFlag: false,
      cleaning: false,
      service: false,
      instruction: false,
      video: false,
      cleanPercent: 0,
        cleanSec:0,
      totalWork: 0,
      cleanStage: '室内结霜',
      isshowTime :true
    };
    // this.state={
    //     status:1,
    //     Carousel: ['1', '2'],
    //     imgHeight: 220,
    //     cleanFlag: false,
    //     cleaning: false,
    //     service: false,
    //     instruction: false,
    //     video: false,
    //     cleanPercent: this.state.cleanPercent,
    //     cleanSec:this.state.cleanSec,
    //     totalWork: 0,
    //     cleanStage: '自清洁完成'
    // };
  }
  gotoIndex() {
  	console.log('%s',this.state.status);
    if (this.state.status === 0) {
      history.go(-1);
    } else if (this.state.status === 1) {
      this.setState({
        status: 0,
        service: false,
        cleaning: false,
        instruction: false,
        video: false
      });
    } else if (this.state.status === 2) {
      this.setState({
        status: 1,
        service: false,
        cleaning: true,
        instruction: false,
        video: false
      });
    } else if (this.state.status === 3) {
      this.setState({
        status: 2,
        service: true,
        cleaning: true,
        instruction: false,
        video: false
      });
    } else {
      this.setState({
        status: 0,
        service: false,
        cleaning: false,
        instruction: false,
        video: false
      });
      let iframe = document.getElementById('videoIframe');
      document.getElementById('videoContent').removeChild(iframe);
    }
  }
  async startClean() {
    const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    if(onOffStatusValue==="true"&&operationModeValue==='0'){
      Toast.fail('PMV模式下，无法进行空调清洁', 3);
    }else if(energySavingStatusValeu==="true"){
      Toast.fail('节能模式下，无法进行空调清洁', 3);
    }
    else if(silentSleepStatusValue==="true"){
      Toast.fail('静眠状态下，无法进行空调清洁', 3);
    }
    else if(selfCleaningStatusValue==='false'){
    this.setState({
      status: 0,
      cleaning: true,
      cleanPercent: 0,
      cleanSec:0,
    });
    let self = this;
    resetCleanTime(self, true);
    if (this.state.cleanFlag) {
      // this.props.DeviceState.cordovaUtil.logicEngineModel.calculatePromise(
      //     window.devicemac, 'selfCleaningStatus', 'true', true).then(
      //     () => this.props.DeviceState.cordovaUtil.logicEngineModel.operatePromise(window.devicemac)
      // );

      // await cordovaUtil.initDeviceReady().then(() => {
      cordovaUtil.logicEngineModule.calculatePromise(window.devicemac, 'selfCleaningStatus', 'true', true).then(() => {
        cordovaUtil.logicEngineModule.operatePromise(window.devicemac).then((e) => {
          console.log(e);
          resetCleanTime(self, true);
        });
      });
      // });
      setTimeout(function() {
        calculatePercent(self);
      }, 300);
    } else {
      setTimeout(function() {
        self.setState({
          Carousel: ['1', '2']
        });
      }, 100);
    }
    }else {
      this.setState({
        status: 0,
        cleaning: true,
        cleanPercent: 0,
        cleanSec:0,
      });
    }
  }
  manualClean() {
    let self = this;
    resetCleanTime(self, true);
    this.setState({
      status: 1,
      service: false,
      cleaning: false,
      instruction: false,
      video: false
    });
  }
  service() {
    this.setState({
      status: 2,
      service: true,
      cleaning: true,
      instruction: false,
      video: false
    });
  }
  instruction() {
    this.setState({
      status: 3,
      cleaning: true,
      service: false,
      instruction: true,
      video: false
    });
  }
  playVideo() {
    this.setState({
      video: true,
      status: 4
    });
    let iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'videoIframe');
    iframe.setAttribute('src', 'http://www.bfvyun.com/player/getplayer?playertype=0&servicetype=1&userid=16480103&fileid=AA11E9EA324C40D787431AAA55D3CA62');
    document.getElementById('videoContent').appendChild(iframe);
  }
  componentWillMount() {
    const {
      globalProps
    } = this.props;
    if (window.typeid === '00000000000000008080000000041410' || window.typeid === '0000000000000000C040000000041410') {
      this.setState({
        cleanFlag: false
      });
    } else {
      this.setState({
        cleanFlag: true
      });
    }
    //let attrObj = getAttribute('selfCleaningStatus', globalProps.attributes);
    //let cleanStatus = attrObj.value === 'true'?true:false;
    //this.setState({cleaning:cleanStatus});
    cleanType = this.props.location.state === 'ture' ? 2 : 1;
    console.log(cleanType);
    let self = this;
    //getCleanDevice(self,typeId);
    // calculatePercent(self);
    getTotalWork(self);
  }
  componentDidMount() {
    let self = this;
    hideDeviceInfo(false);

    if (selfCleaningStatusValue==='true') {
      if (self.state.cleanFlag) {
        self.setState({
          cleaning: true
        });
        calculatePercent(self);
      }
    }else{
      self.setState({
        cleaning: false
      });
    }
  }
  render() {
    // const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    let self = this;
    let silentSleepStatus=getAttribute('silentSleepStatus',this.props.DeviceState.attributes);
    let operationMode=getAttribute('operationMode',this.props.DeviceState.attributes);
    let attrObj = getAttribute('selfCleaningStatus', this.props.DeviceState.attributes);
    let selfCleaningStatusValue = attrObj.value;
    let energySavingStatus=getAttribute('energySavingStatus',this.props.DeviceState.attributes);
    let onOffStatus=getAttribute('onOffStatus',this.props.DeviceState.attributes);
    let cleanTime = '';
     // console.log('%s',silentSleepStatus.value);
    window.energySavingStatusValeu=energySavingStatus.value;
     window.silentSleepStatusValue=silentSleepStatus.value;
    window.operationModeValue=operationMode.value;
    window.selfCleaningStatusValue=selfCleaningStatusValue;
    window.onOffStatusValue=onOffStatus.value;
    if(onOffStatusValue==='true'){
      cleanTime = 21;
    }else{
      cleanTime = 50;
    }
    const height = document.documentElement.clientHeight-40;
    return (<div className="airConditioningCleaning">
                <div className="upcore-navbar">
                    <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left" ></span>
                    <span className="upcore-navbar-icon-span">{'空调清洁'}</span>
                </div>
                <div className="main" style={{height:`${height}px`,display:this.state.cleaning === true?'none':'block'}}>
                    <p>您的空调距离上次清洗已使用</p>
                    <p>{this.state.totalWork}</p><span>小时</span>
                    <p>使用空调自清洁,终结“脏空气”时代</p>
                    <div onClick={()=>{this.startClean();}} className="bt">开始空调自清洁</div>
                    <p>*基于空调大数据平台,结合风速、PM2.5进行统计</p>
                    <img src={require("./images/indexVideo.png")} onClick={()=>{this.playVideo();}} />
                </div>
                <div className="cleaning" style={{height:`${height}px`,display:this.state.cleaning === true?(this.state.cleanFlag === true?'block':'none'):'none'}}>
                    <p style={{display:this.state.isshowTime?'block':'none'}}>{this.state.cleanStage}</p>
                    <div>
                      <p style={{display:this.state.isshowTime?'block':'none'}}>{this.state.cleanPercent}:{this.state.cleanSec}</p>
                      <p style={{display:this.state.isshowTime?'none':'block',fontSize:'30px',marginTop:'45%',color:'#5a9dcd'}}>清洁中...</p>
                    </div>
                    {/*<div><p>{this.state.cleanPercent}</p><span>分钟</span></div>*/}
                    {/*<p>全程需要等待大约{cleanTime}分钟</p>*/}
                    <p>自清洁期间仅可进行开关机操作</p>
                    {/*<p>请勿使用遥控器和APP对空调进行操作</p>*/}
                    <iframe src="http://uhome.haier.net:8470/acbizCms/view/H5/web/aircircle/self_mesh_player/self_mesh_video.html?hybrid_navbar_hidden=true"></iframe>
                    <img
                        src={this.state.cleanStage.indexOf('室内')>-1?require('./images/cleaning.png'):(this.state.cleanStage.indexOf('室外')>-1?require('./images/outdoor.png'):(this.state.cleanStage.indexOf('完成')>-1?require('./images/over.png'):require('./images/balance.png')))}
                        className={['cleanImg',this.state.cleanPercent===100?'':'cleaningImg'].join(' ')}/>
                </div>
                <div className="selfcleaning" style={{height:`${height}px`,display:this.state.cleaning === true?(this.state.cleanFlag === true?'none':'block'):'none'}}>
                    <div>
                        <Carousel autoplay={false} infinite beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)} afterChange={index => console.log('slide to', index)}>
                            {this.state.Carousel.map(val => (
                                <a key={val} style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}>
                                    <img src={require(`./images/${val}.png`)} alt="" style={{ width: '100%', verticalAlign: 'top' }} onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({ imgHeight: 'auto' });
                                    }}/>
                                </a>
                            ))}
                        </Carousel>
                    </div>
                    <div onClick={()=>{this.manualClean();}} className="bt">空调清洁完成,重新计时</div>
                    <p>*基于空调大数据平台,结合风速、PM2.5进行统计</p>
                    <p onClick={()=>{this.service();}}>没有自清洁按键?</p>
                </div>
                <div className="service" style={{display:this.state.service === true?'block':'none'}}>
                    <p>您的空调距离上次清洗已使用</p>
                    <p>{this.state.totalWork}</p><span>小时</span>
                    <p>使用空调自清洁,终结“脏空气”时代</p>
                    <a href="tel:400-699-9999">拨打400,预约售后上门清洗</a>
                    <p>*基于空调大数据平台,结合风速、PM2.5进行统计</p>
                    <p>已清洗,重新计时</p>
                    <img src={require("./images/secondVideo.png")} onClick={()=>{this.instruction();}} />
                </div>
                <div className="instruction" style={{display:this.state.instruction === true?'block':'none'}}>
                    <div>为什么要清洁空调?</div>
                    <div dangerouslySetInnerHTML={{__html: content}} />
                </div>
                <div id="videoContent" className="videoContent" style={{display:this.state.video === true?'block':'none'}}>
                </div>
            </div>);
  }
}
