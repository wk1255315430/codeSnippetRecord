/* eslint-disable no-invalid-this */
/* eslint-disable no-negated-condition */
/* eslint-disable init-declarations */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, {
  Component
} from 'react';
import { getGlobalHeaders, getHttp ,getUserInfo } from '../../util/tool';
import { Toast } from 'antd-mobile';
require ('./timing.css');
export default class timingSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initData : [],
      isHide:false,
    };
  }
  switchDataHandle = key =>{
    let array = [];
    let item = '';
    if(typeof(key) === 'number'){
      item = String(key);
      array.push(item);
    }else{
      array = key.split(',');
    }
    array = array.map((items)=>{
      switch (items) {
      case '1':
        return items = '周一 ';
      case '2':
        return items = '周二 ';
      case '3':
        return items = '周三 ';
      case '4':
        return items = '周四 ';
      case '5':
        return items = '周五 ';
      case '6':
        return items = '周六 ';
      case '7':
        return items = '周日 ';
      default:
        return items;
      }
    });
    return array;
  }
  switchOnOffHandle =(value) => {
    let isToggleKey,isToggleValue,isToggle;
    isToggle = value.filter(item=>{
      return item.name === 'onOffStatus' || item.name === '202001' || item.name === '202002';
    });
    isToggleKey = isToggle[0].name;
    isToggleValue = isToggle[0].value;
    if(isToggleKey === 'onOffStatus'){
      return isToggleValue === 'true' ? '开机' : '关机';
    }
    if(isToggleKey === '202001'){
      return '关机';
    }else if(isToggleKey === '202002'){
      return '开机';
    }
  }
  async getInitData(){
    const userInfo = await getUserInfo();
    const http = await getHttp();
    var recipesData2 = {
      'macs': [window.devicemac]
    };
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/'+userInfo.retData.userId+'/get_weektiming';
    console.log(recUrl,window.devicemac);
    const recipesData = {
      'get_weektiming': {
        taskid:'',
        mac: window.devicemac
      }
    };
    let globalHeaders =await getGlobalHeaders(recipesData2);
    http.post(recUrl, recipesData, globalHeaders, (resp) => {
      let Data = {};
      let typeId = window.typeid;
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        Data = JSON.parse(resp.data);
        if(Data.get_weektiming_result.tasklist !== null){
          Data = Data.get_weektiming_result.tasklist.task;
          //对Data[index].command转格式
          for (let index = 0; index < Data.length; index++) {
          // eslint-disable-next-line no-constant-condition
            if(typeof (Data[index].command) === 'string'){
              Data[index].command = JSON.parse(Data[index].command.replace(/'/g, '"'));
            }
          }
          this.setState({
            initData:Data
          },()=>{console.log(this.state.initData);});
        }else{
          console.log('没有列表');
        }
      }
    }, (err) => {
      console.log(err);
    });
  }
  startDeleteHandle=()=>{
    this.setState((prevState)=>{
      return{
        isHide: !prevState.isHide
      };
    });
  }
  async endDeleteHandle(taskid,index){
    Toast.loading('');
    const userInfo = await getUserInfo();
    const http = await getHttp();
    var recipesData2 = {
      'macs': [window.devicemac]
    };
    let globalHeaders =await getGlobalHeaders(recipesData2);
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/'+userInfo.retData.userId+'/del_weektiming';
    const recipesData = {
      'del_weektiming': {
        taskid:taskid,
        sctx:{
          appId: globalHeaders.appId,
          appVersion: globalHeaders.appVersion,
          clientId: globalHeaders.clientId
        }
      }
    };
    http.post(recUrl, recipesData, globalHeaders, (resp) => {
      let data = {};
      if(resp.status === 200){
        data = JSON.parse(resp.data);
        if(data.del_weektiming_result.error !== 'ERROR_OK'){
          Toast.info(data.set_weektiming_result.error_info);
        }else{
          let arr = this.state.initData;
          arr.splice(index,1);
          this.setState({
            initData:arr
          });
          Toast.info('删除成功');
          console.log(this.state.initData);
        }
      }
    }, (err) => {
      console.log(err);
      Toast.info('服务异常,稍后重试');
    });
  }
  routerTo=(props)=>{
    !this.state.isHide && this.props.history.push('timingSet/'+ props);
  }
  componentDidMount(){
    this.getInitData();
  }
  render() {
    return (
      <div className="timing">
        <div className="upcore-navbar">
          <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
          <span className="upcore-navbar-icon-span">{'场景信息'}</span>
          <img style={this.state.isHide ? {'display':'none'}: {'display':'inline'}} src={require('../style/image/deleteicon.png')} onClick={this.startDeleteHandle.bind(this)} className="time-save"/>
          <span style={this.state.isHide ? {'display':'inline'}: {'display':'none'}} onClick={this.startDeleteHandle.bind(this)} className="time-save">完成</span>
        </div>
        <div className="contentWrap">
          {
            this.state.initData.map((item,index)=>{
              return (
                <div key={index} className="content">
                  <img style={this.state.isHide ? {'display':'inline'} : {'display':'none'}}
                    onClick={this.endDeleteHandle.bind(this,item.taskid,index)}
                    src={require('../style/image/deleteicon.png')} className="time-delete"/>
                  <div className="leftWrap" onClick={this.routerTo.bind(this,item.taskid)}>
                    <div className="time">{item.time}</div>
                    <div className="week">{item.repeat === 'Y' ? this.switchDataHandle(item.period) : '仅一次 '}{this.switchOnOffHandle(item.command.value)}</div>
                  </div>
                  <img onClick={()=>{this.props.history.push('timingSet/'+ item.taskid);}} src={require('../style/imageNew/icon_temp_increase_cool.png')} className="icon-right"/>
                </div>
              );
            })
          }
        </div>
        <div className="addTiming">
          <button className="buttonWrap" onClick={this.routerTo.bind(this,'add')}>
            {'添加设定'}
          </button>
        </div>
      </div>
    );
  }
}