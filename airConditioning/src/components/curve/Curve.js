/* eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { CordovaUtil } from '@uplus/updevicecore';
import { LineEcharts } from '../LineEcharts/LineEcharts';
import { ChangeableLineEcharts } from '../ChangeableLineEcharts/ChangeableLineEcharts';
import { Picker, List, Modal, Toast } from 'antd-mobile';
import { hideDeviceInfo, getGlobalHeaders, getDeviceClassifyCodeByTypeId, getDeviceMiddleClassifyCodeByTypeId,getHttp,getUserInfo } from '../../util/tool';
// const cordovaUtil = new CordovaUtil();
const alert = Modal.alert;
const prompt = Modal.prompt;
require('./curve.css');
let times = [];
let minuteArray = [{
  label: '00',
  value: '00',
  children: [{
    label: '分',
    value: '分'
  }]
}, {
  label: '30',
  value: '30',
  children: [{
    label: '分',
    value: '分'
  }]
}];
const Arr = {
  label: '小时',
  value: '小时',
  children: minuteArray
};
for (let i = 1; i < 24; i++) {
  let ampmObj = {
    label: i,
    value: i,
    children: [Arr]
  };
  times.push(ampmObj);
}
let timeMax = 8;
let coldSleepOption = {};
let hotSleepOption = {};
let width = '';
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class Curve extends Component {
  constructor(props) {
    super(props);
    let param = props.location.state;
    timeMax = (param.coldSleeptemp.split(',').length - 1) / 2;
    let hour = parseInt(timeMax, 10);
    width = (timeMax * document.body.clientWidth) / 4;
    width = width < document.body.clientWidth ? document.body.clientWidth + 'px' : width + 'px';
    let min = timeMax - hour === 0 ? '' : '30分钟';
    this.state = {
      'times': times,
      'name': '请输入曲线名称',
      'sleepTime': `${hour}小时${min}`,
      'params': param,
      'timeMax': timeMax,
      'width': width,
      'coldSleeptemp': param.coldSleeptemp,
      'hotSleeptemp': param.hotSleeptemp,
      'coldSleepOption': coldSleepOption,
      'hotSleepOption': hotSleepOption
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.setEcharts = this.setEcharts.bind(this);
    this.setSleepTime = this.setSleepTime.bind(this);
    this.addSleepCurve = this.addSleepCurve.bind(this);
    this.updateSleepCurve = this.updateSleepCurve.bind(this);
    this.delSleepCurve = this.delSleepCurve.bind(this);
    this.setColdSleeptemp = this.setColdSleeptemp.bind(this);
    this.setHotSleeptemp = this.setHotSleeptemp.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  setEcharts(dataList) {
    let dataArr = [];
    dataList.forEach((item, index) => {
      const a = index / 2;
      dataArr.push([a, item]);
    });
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            backgroundColor: '#6a7985',
          }
        },
        formatter: function(params, ticket, callback) {
          return `${params[0].data[0]}小时<br/>${Math.round(params[0].data[1])}℃`;
        }
      },
      grid: {
        left: '10',
        right: '20',
        bottom: '10',
        containLabel: true,
        backgroundColor: '#262626'
      },
      xAxis: [{
        type: 'value',
        name: '(h)',
        nameTextStyle: {
          fontSize: 10
        },
        nameLocation: 'start',
        axisLabel: {
          color: '#333',
          interval: 0,
          textStyle: {
            fontSize: 10,
          }
        },
        axisLine: {
          lineStyle: {
            color: '#dcdcdc'
          }
        },
        axisTick: {
          alignWithLabel: true,
          length: 1
        },
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#dcdcdc'
          }
        },
        min: 0,
        max: this.state.timeMax,
        interval: 0.5
      }],
      yAxis: [{
        scale: true,
        type: 'value',
        name: '(℃)',
        nameTextStyle: {
          fontSize: 10,
          color: '#111'
        },
        axisLabel: {
          color: '#333',
          textStyle: {
            fontSize: 10,
          }
        },
        axisTick: {
          alignWithLabel: true,
          length: 15
        },
        min: 14,
        max: 30,
        interval: 2,
        axisLine: {
          lineStyle: {
            color: '#dcdcdc'
          }
        },
        lineStyle: {
          color: '#dcdcdc',
          type: 'solid'
        },
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#dcdcdc'
          }
        }
      }],
      series: [{
        type: 'line',
        lineStyle: {
          color: '#149FF7',
          type: 'solid',
          width: 1
        },
        itemStyle: {
          color: '#149FF7',
          width: 3
        },
        areaStyle: {
          color: '#149FF7',
          opacity: 0.3
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: '10',
        animationDuration: 0,
        animationDurationUpdate: 0,
        animation: false,
        data: dataArr
      }]
    };
  }
  setLineName() {
    const self = this;
    prompt('请输入曲线名称', '', [{
      text: '取消',
      onPress: value => new Promise((resolve) => {
        resolve();
      }),
    }, {
      text: '确定',
      onPress: value => new Promise((resolve, reject) => {
        self.setState({
          'name': value
        });
        resolve();
      }),
    }, ], 'default', null, []);
  }
  setSleepTime(value) {
    let time = '';
    if (value[0] === '0') {
      time = `${value[2]}分钟`;
      timeMax = 0.5;
    } else if (value[2] === '00') {
      time = `${value[0]}小时`;
      timeMax = value[0];
    } else {
      time = `${value[0]}小时${value[2]}分钟`;
      timeMax = value[0] + 0.5;
    }
    width = (timeMax * document.body.clientWidth) / 4;
    width = width < document.body.clientWidth ? document.body.clientWidth + 'px' : width + 'px';
    this.setState({
      'width': width
    });
    let n = timeMax - this.state.timeMax;
    let coldSleeptempStr = this.state.coldSleeptemp;
    let coldArr = coldSleeptempStr.split(',');
    let hotSleeptempStr = this.state.hotSleeptemp;
    let hotArr = hotSleeptempStr.split(',');
    if (n > 0) {
      for (let i = 0; i < n * 2; i++) {
        coldArr.push('26');
        hotArr.push('26');
      }
    } else if (n < 0) {
      coldArr.splice(timeMax * 2 + 1, coldArr.length);
      hotArr.splice(timeMax * 2 + 1, hotArr.length);
    }
    coldSleeptempStr = coldArr.join(',');
    hotSleeptempStr = hotArr.join(',');
    this.setState({
      'timeMax': timeMax,
      'sleepTime': time,
      'coldSleeptemp': coldSleeptempStr,
      'hotSleeptemp': hotSleeptempStr,
    });
  }
  async addSleepCurve() {
    if (this.state.name === '' || this.state.name === '请输入曲线名称') {
      Toast.fail('曲线名称不能为空', 2);
      return false;
    }
    const self = this;
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/add_double_sleep_new';
    // const globalHeaders = await getGlobalHeaders();
    let coldSleeptempStr = this.state.coldSleeptemp;
    let hotSleeptemparr = [];
    let coldSleeptemparr = [];
    let coldSleeptempArr = coldSleeptempStr.split(',');
    coldSleeptempArr.forEach((item) => {
      coldSleeptemparr.push(Math.round(item));
    });
    coldSleeptempStr = coldSleeptemparr.join(',');
    let hotSleeptempStr = this.state.hotSleeptemp;
    let hotSleeptempArr = hotSleeptempStr.split(',');
    hotSleeptempArr.forEach((item) => {
      hotSleeptemparr.push(Math.round(item));
    });
    hotSleeptempStr = hotSleeptemparr.join(',');
    const userInfo = await getUserInfo();
    const data = {
      'line_name': this.state.name,
      'coldSleeptemp': coldSleeptempStr,
      'userid': userInfo.retData?userInfo.retData.userId : '',
      'mac': devicemac,
      'hotSleeptemp': hotSleeptempStr
    };
    console.log(data);
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
      if (resptype === 'string' && resp.data !== '') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      if (curveData.retCode === '00000') {
        history.go(-1);
      } else if (curveData.retCode === '34025') {
        Toast.fail('睡眠曲线名称重复!', 2);
      } else {
        Toast.fail('保存睡眠曲线失败!', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('保存睡眠曲线失败!', 2);
    });
    return true;
  }
  async updateSleepCurve(id) {
    if (this.state.name === '' || this.state.name === '请输入曲线名称') {
      Toast.fail('曲线名称不能为空', 2);
      return false;
    }
    const self = this;
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/update_double_sleep_new';
    let coldSleeptempStr = this.state.coldSleeptemp;
    let hotSleeptemparr = [];
    let coldSleeptemparr = [];
    let coldSleeptempArr = coldSleeptempStr.split(',');
    coldSleeptempArr.forEach((item) => {
      coldSleeptemparr.push(parseInt(item, 10));
    });
    coldSleeptempStr = coldSleeptemparr.join(',');
    let hotSleeptempStr = this.state.hotSleeptemp;
    let hotSleeptempArr = hotSleeptempStr.split(',');
    hotSleeptempArr.forEach((item) => {
      hotSleeptemparr.push(parseInt(item, 10));
    });
    hotSleeptempStr = hotSleeptemparr.join(',');
    const userInfo = await getUserInfo();
    const data = {
      'line_id': id,
      'line_name': this.state.name,
      'coldSleeptemp': coldSleeptempStr,
      'userid': userInfo.retData?userInfo.retData.userId : '',
      'hotSleeptemp': hotSleeptempStr
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
        history.go(-1);
      } else if (curveData.retCode === '34050') {
        Toast.fail('正在执行的睡眠曲线不能进行编辑!', 2);
      } else {
        Toast.fail('修改睡眠曲线失败!', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('修改睡眠曲线失败!', 2);
    });
    return true;
  }
  async delSleepCurve(id) {
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/sleepline/del_double_sleep_new';
    const data = {
      'line_id': id
    };
    let curveData = '';
    let globalHeaders = await getGlobalHeaders(data);
    globalHeaders.timestamp = String(new Date().getTime());
    alert('', '确定要删除睡眠曲线吗?', [{
      text: '取消',
      onPress: () => console.log('cancel'),
      style: 'default'
    }, {
      text: '确定',
      onPress: async() => {
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
            history.go(-1);
          } else if (curveData.retCode === '34010') {
            Toast.fail('睡眠曲线已开启，不可删除!', 2);
          } else {
            Toast.fail('删除睡眠曲线失败!', 2);
          }
        }, (err) => {
          console.log(err);
          Toast.fail('删除睡眠曲线失败!', 2);
        });
        return true;
      }
    }, ]);
    return true;
  }
  setColdSleeptemp(index, str) {
    let coldSleeptempStr = this.state.coldSleeptemp;
    let arr = coldSleeptempStr.split(',');
    arr[index] = str;
    coldSleeptempStr = arr.join(',');
    this.setState({
      coldSleeptemp: coldSleeptempStr
    });
  }
  setHotSleeptemp(index, str) {
    let hotSleeptempStr = this.state.hotSleeptemp;
    let arr = hotSleeptempStr.split(',');
    arr[index] = str;
    hotSleeptempStr = arr.join(',');
    this.setState({
      hotSleeptemp: hotSleeptempStr
    });
  }
  componentDidMount() {
    const data = this.props.location.state;
    timeMax = (data.coldSleeptemp.split(',').length - 1) / 2;
    this.setState({
      'name': data.line_name
    });
  }
  render() {
    hideDeviceInfo(false);
    coldSleepOption = this.setEcharts(this.state.coldSleeptemp.split(','));
    hotSleepOption = this.setEcharts(this.state.hotSleeptemp.split(','));
    if (this.state.params.isAddCurve) {
      return (<div className="curve">
                    <div className="upcore-navbar">
                        <span className="upcore-navbar-icon-left" onClick={this.gotoIndex}></span>
                        <span className="upcore-navbar-span">增加新曲线</span>
                        <span className="iconRight" onClick={() =>this.addSleepCurve(this.state.params.line_id)}>{'保存'}</span>
                    </div>
                    <List style={{backgroundColor: 'white',paddingTop:'40px'}} className="picker-list">
                        <List.Item arrow={'horizontal'}
                            extra={this.state.name}
                            onClick={() => {this.setLineName();}}
                        >曲线名称</List.Item>
                        <Picker extra={this.state.sleepTime}
                            data={times}
                            cols={4}
                            title="选择睡眠时长"
                            onOk={v => this.setSleepTime(v)}
                        >
                            <List.Item arrow={'horizontal'}>睡眠时长</List.Item>
                        </Picker>
                    </List>
                    <p>制冷温度设定</p>
                    <ChangeableLineEcharts id={'cold'} width={this.state.width} option={coldSleepOption} setColdSleeptemp={this.setColdSleeptemp.bind(this)}></ChangeableLineEcharts>
                    <p>制热温度设定</p> 
                    <ChangeableLineEcharts id={'hot'} width={this.state.width} option={hotSleepOption} setHotSleeptemp={this.setHotSleeptemp.bind(this)}></ChangeableLineEcharts>
                </div>);
    } else if (this.state.params.isUserlist) {
      return (<div className="curve">
                    <div className="upcore-navbar">
                        <span className="upcore-navbar-icon-left" onClick={this.gotoIndex}></span>
                        <span className="upcore-navbar-span">{this.state.params.line_name}</span>
                        <span className="iconRight" onClick={() => this.updateSleepCurve(this.state.params.line_id)}>{'保存'}</span>
                    </div>
                    <List style={{backgroundColor: 'white'}} className="picker-list">
                        <List.Item arrow={'horizontal'}
                            extra={this.state.name}
                            onClick={() => {this.setLineName();}}
                        >曲线名称</List.Item>
                        <Picker extra={this.state.sleepTime}
                            data={times}
                            cols={4}
                            title="选择睡眠时长"
                            onOk={v =>{this.setSleepTime(v);}}
                        >
                            <List.Item arrow={'horizontal'}>睡眠时长</List.Item>
                        </Picker>
                    </List>
                    <p>制冷温度设定</p>
                    <ChangeableLineEcharts id={'cold'} width={this.state.width} option={coldSleepOption} setColdSleeptemp={this.setColdSleeptemp.bind(this)}></ChangeableLineEcharts>
                    <p>制热温度设定</p> 
                    <ChangeableLineEcharts id={'hot'} width={this.state.width} option={hotSleepOption} setHotSleeptemp={this.setHotSleeptemp.bind(this)}></ChangeableLineEcharts>
                    <div className="del" onClick={() => this.delSleepCurve(this.state.params.line_id)}>删除曲线</div>
                </div>);
    }
    return (<div className="curve">
                <div className="upcore-navbar">
                    <span className="upcore-navbar-icon-left" onClick={this.gotoIndex}></span>
                    <span className="upcore-navbar-span">{this.state.params.line_name}</span>
                </div>
                <List style={{backgroundColor: 'white'}} className="picker-list">
                    <List.Item arrow={'empty'} extra={this.state.params.line_name}>曲线名称</List.Item>
                    <List.Item arrow={'empty'} extra={'8小时'}>睡眠时长</List.Item>
                </List>
                <p>制冷温度设定</p>  
                <LineEcharts option={coldSleepOption}></LineEcharts>
                <p>制热温度设定</p>  
                <LineEcharts option={hotSleepOption}></LineEcharts>
            </div>);
  }
}