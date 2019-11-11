/* eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { hideDeviceInfo, getGlobalHeaders,getHttp,getUserInfo } from '../../util/tool';
import { Picker, List, WhiteSpace, Button, Toast } from 'antd-mobile';
require('./timingSet.css');
// const cordovaUtil = new CordovaUtil();
var times = [];
let minuteArray = [];
for (let p = 0; p < 60; p+=10) {
    let zero = '';
    if (p < 10) {
        zero = '0';
    }
    let minuteObj = {
        label: zero + p,
        value: zero + p 
    };
    minuteArray.push(minuteObj);
}
let hourArray = []
for (let i = 0; i < 24; i++) {
    let zero = '';
    i < 10 ? i = '0' + i : i = i;
    let ampmObj = {
        label: zero + i,
        value: zero + i
    };
    hourArray.push(ampmObj);
}
times.push(hourArray);
// times.push(middleArry);
times.push(minuteArray);
// @inject(allStores => ({
//   DeviceState: allStores.DeviceState
// }))
// @withRouter
// @observer
export default class Timing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cols: 2,
            onValue: [],
            colorValue: ['#2283E2'],
            taskid: '',
            WeekdayArray:['一','二','三','四','五','六','日'],
            toggle:['开机','关机'],
            isToggle:null,
            checked:[],
        };
        this.gotoIndex = this.gotoIndex.bind(this);
    }
    gotoIndex() {
        history.go(-1);
    }
    componentDidMount() {
      console.log(this.props.location)
    }
    weekdayHandle = (props)=>{
        var flag = this.state.checked.includes(String(props+1));
        return flag ? 'active' : '';
        
    }
    toggleHandle = (props,e)=>{
        this.setState({
            isToggle:props.index
        })
    }
    editChecked = (props)=>{
        let arr = this.state.checked;
        let index = arr.indexOf(props.target.value)
        if(index != -1){
             arr.splice(index,1);
             this.setState({
                checked:arr
            })
             return;
        };
        arr.push(props.target.value)
        this.setState({
            checked:arr
        })
    }
    async getInitData(id){
    Toast.loading('加载中..');
    const userInfo = await getUserInfo();
    const http = await getHttp();
    var recipesData2 = {
      'macs': [window.devicemac]
    };
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/'+userInfo.retData.userId+'/get_weektiming';
    const recipesData = {
      'get_weektiming': {
        taskid: id,
        mac: window.devicemac
      }
    };
    console.log(recipesData);
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
            checked:Data[0].repeat === 'Y' && this.switchDataHandle( Data[0].period),
            isToggle:this.switchOnOffHandle(Data[0].command.value),
            onValue:Data[0].time.split(':')
          },()=>{console.log(this.state)})
        }else{
          console.log('没有列表');
        }
      }
      Toast.hide();
    }, (err) => {
      Toast.hide();
      console.log(err);
    });
  }
  async saveHandle(){
    let command = '';
    if(this.state.isToggle === 0 || this.state.isToggle === 1){
      this.state.isToggle === 1 ? command = '00000000000000008080000000041410##0##00000' : command = '00000000000000008080000000041410##1##00000'
    }else{
      return Toast.info('未选择定时类型');
    };
    if(this.state.onValue.length < 2){
      return Toast.info('时间未设置');
    }
    let period = '';
    let repeat = '';
    if(this.state.checked.length > 0){
      repeat = 'Y';
      period = this.state.checked.join(',');
    }else{
      repeat = 'N';
      period = '';
    }
    Toast.loading('加载中...')
    const userInfo = await getUserInfo();
    const http = await getHttp();
    var recipesData2 = {
      'macs': [window.devicemac]
    };
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/'+userInfo.retData.userId+'/set_weektiming';
    const recipesData = {
      'set_weektiming': {
        task: {
          mac: window.devicemac,
          time: this.state.onValue.join(':'),
          command: command,
          repeat: repeat,
          period: period,
          status: "START"
        }
      }
    };
    if(this.state.taskid){
      recipesData.set_weektiming.task.taskid = this.state.taskid;
    }
    let globalHeaders =await getGlobalHeaders(recipesData2);
    http.post(recUrl, recipesData, globalHeaders, (resp) => {
      let data = {};
      if(resp.status === 200){
        data = JSON.parse(resp.data);
        if(data.set_weektiming_result.error !== 'ERROR_OK'){
          Toast.info(data.set_weektiming_result.error_info);
        }else{
          console.log(data);
          Toast.info('成功');
          this.gotoIndex();
        }
      }
    }, (err) => {
      console.log(err);
      Toast.info('服务异常,稍后重试');
      Toast.hide();
    });

    console.log(recipesData,);
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
    return array;
  }
  switchOnOffHandle =(value) => {
    let isToggleKey,isToggleValue,isToggle;
    isToggle = value.filter(item=>{
      return item.name === 'onOffStatus' || item.name === '202001' || item.name === '202002';
    });
    isToggleKey = isToggle[0].name;
    isToggleValue = isToggle[0].value;
    // 0 1对应数组下标 和0关1开相反
    if(isToggleKey === 'onOffStatus'){
      return isToggleValue === 'true' ? 0 : 1;
    }
    if(isToggleKey === '202001'){
      return 1;
    }else if(isToggleKey === '202002'){
      return 0;
    }
  }
  componentDidMount(){
    if(this.props.match.params !== undefined){
      if(this.props.match.params.id !== 'add'){
          this.getInitData(this.props.match.params.id);
            this.setState({
              taskid : this.props.match.params.id
        })
      }
    }
  }
    render() {
        // hideDeviceInfo(false);
        console.log('1')
        return (
            <div className="timing">
                <div className="upcore-navbar">
                    <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
                    <span className="upcore-navbar-icon-span">{'定时开关机设置'}</span>
                    <span className="time-save" onClick={this.saveHandle.bind(this)}>{'保存'}</span>
                </div>
                <div className="timingSpace"></div>
                <div className="timingtype">
                    <div className="title">定时类型</div>
                    <div className='timingToggle'>
                            {this.state.toggle.map((item,index)=>(
                                <button key={index}
                                 className={this.state.isToggle == index? 'active':''}
                                 onClick={this.toggleHandle.bind(this,{index})}
                                >{item}
                                </button>
                            ))}
                    </div>
                </div>
                <List style={{ backgroundColor: 'white',paddingTop: '0px' }} className="picker-list">
                    <Picker 
                        data={times}
                        extra="未设置"
                        cols={this.state.cols}
                        title=""
                        value={this.state.onValue}
                        cascade={false}
                        format={(labels) => { return labels.join(':');}}
                        onChange={v => {this.setState({ onValue: v });}}
                        onOk={v => {
                            this.setState({ onValue: v });
                            console.log(v)
                        }}
                    >
                        <List.Item arrow="horizontal">时间设定</List.Item>
                    </Picker>
                </List>
                <div className="timingtype">
                    <div className="title">重复</div>
                   <div className="timingToggle timingGrow">
                   {this.state.WeekdayArray.map((item, index) => (
                         <label key={index} htmlFor={'weeked'+ index}
                         className={this.weekdayHandle(index)}>
                           <input id={'weeked'+ index} value={index+1} name="checkbox" type="checkbox" onChange={this.editChecked} />
                            {item}
                        </label>
                        ))}
                   </div>
                </div>
            </div>
        );
    }
}