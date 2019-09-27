/*eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { ConfigUtil, CordovaUtil } from '@uplus/updevicecore';
import { hideDeviceInfo, getGlobalHeaders,getUrlParams,getHttp } from '../../util/tool';
import { Picker, List, WhiteSpace, Button, Toast, Tabs, Badge } from 'antd-mobile';
import { LineEcharts } from '../index';
require('./energyRecord.css');
// const cordovaUtil = new CordovaUtil();
// 昨天耗电量
let totalPowerConsumptionYesterday = '0';
// 昨天每小时耗电量
let averagePowerConsumptionYesterday = '0';
// 昨天开机时长
let totalTimeYesterday = '0';
// 今天耗电量
let totalPowerConsumptionToday = '0';
// 今天每小时耗电量
let averagePowerConsumptionToday = '0';
// 今天开机时长
let totalTimeToday = '0';
// 昨天击败多少
let rankYesterday = '';
// 昨天空调总量
let airAmountYesterday = '';
// 总平均每小时耗电量
let allAvePowerYesterday = '';
let list = [];
let myDate = new Date();
const year = myDate.getFullYear();
let monthNum = myDate.getMonth() + 1;
let month = monthNum > 9 ? monthNum : '0' + monthNum;
let dayNum = myDate.getDate();
let day = dayNum > 9 ? dayNum : '0' + dayNum;
const today = `${year}${month}${day}`;
let yesterday = '';
if (day === 1 && month === '01') {
  yesterday = `${year - 1}1231`;
} else if (day === 1 && month === '03') {
  if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
    yesterday = `${year}0229`;
  } else {
    yesterday = `${year}0228`;
  }
} else if (day === 1 && (month === '05' || month === '07' || month === '08' || month === '10' || month === '12')) {
  monthNum -= 1;
  month = monthNum > 9 ? monthNum : '0' + monthNum;
  yesterday = `${year}${month}31`;
} else if (day === 1 && (month === '04' || month === '06' || month === '09' || month === '11')) {
  monthNum -= 1;
  month = monthNum > 9 ? monthNum : '0' + monthNum;
  yesterday = `${year}${month}30`;
} else {
  dayNum -= 1;
  day = dayNum > 9 ? dayNum : '0' + dayNum;
  yesterday = `${year}${month}${day}`;
}
let curveOption = {
  xAxis: {
    name: '(日)',
    nameTextStyle: {
      color: '#B4B4B4'
    },
    axisLine: {
      onZero: false
    },
    data: []
  },
  yAxis: {
    name: '(度)',
    nameTextStyle: {
      color: '#B4B4B4'
    },
    axisLine: {
      onZero: false
    }
  },
  series: [{
    id: 'year',
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,
    lineStyle: {
      color: '#2886F4',
      width: 1
    },
    itemStyle: {
      color: '#8AECDB',
      borderType: 'solid'
    },
    data: []
  }]
};
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class EnergyRecord extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      option: curveOption
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.getRecord = this.getRecord.bind(this);
    this.gotoHistory = this.gotoHistory.bind(this);
    this.gotoEnergyPK = this.gotoEnergyPK.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  gotoHistory(arr, num) {
    const path = {
      pathname: '/history',
      state: {
        'list': arr,
        'number': num
      }
    };
    this.props.history.push(path);
  }
  gotoEnergyPK() {
    if (totalPowerConsumptionYesterday === '0') {
      Toast.fail('昨日能耗为0，不能进行pk!', 2);
    } else {
      const path = {
        pathname: '/energyPK',
        state: {
          // 击败多少
          'rank': rankYesterday,
          // 昨天总耗电量
          'energyConsumeTtotal': totalPowerConsumptionYesterday,
          // 昨天每小时耗电量
          'energyConsumePerHour': averagePowerConsumptionYesterday,
          // 昨天开机时间
          'energyTimeTotal': totalTimeYesterday,
          // 昨天空调数量
          'airAmount': airAmountYesterday,
          // 昨天总平均每小时耗电量
          'allAvePower': allAvePowerYesterday
        }
      };
      this.props.history.push(path);
    }
  }
  async getRecord(num) {
    // const { cordovaUtil} = this.props.DeviceState;
    // await getGlobalHeaders();
    // const http = await cordovaUtil.initDeviceReady().then(() => {
    //   return cordovaUtil.httpEngine;
    // });
    let type = 'week';
    if (num === 1) {
      type = 'month';
    } else if (num === 2) {
      type = 'year';
    }
    const self = this;
    const recUrl = 'https://uhome.haier.net:7253/acquisitionData/device/airPowerDataNew';
    let curveData = '';
    let todayIndex = '';
    let dataArr = [];
    let dateArr = [];
    const body = {
      currentTime: today,
      cursor: '1',
      measurementPeriod: type,
      deviceMacs: [devicemac],
    };
    // if (!cordova) {
    //   return false;
    // }

    let globalHeaders = await getGlobalHeaders(body);
    const http = await getHttp();
    http.post(recUrl, body, globalHeaders, (resp) => {
      console.log(resp);
      var resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      if (curveData.retCode === '00000' && curveData.airPowers[0].measurementPowerPeriods && curveData.airPowers[0].measurementPowerPeriods.length > 0) {
        list = curveData.airPowers[0].measurementPowerPeriods;
        list.forEach((item, index) => {
          if (type === 'week' && item.time === today) {
            totalPowerConsumptionToday = item.totalPowerConsumption;
            averagePowerConsumptionToday = item.averagePowerConsumption;
            totalTimeToday = item.totalTime;
          }
          if (type === 'week' && item.time === yesterday) {
            totalPowerConsumptionYesterday = item.totalPowerConsumption;
            averagePowerConsumptionYesterday = item.averagePowerConsumption;
            totalTimeYesterday = item.totalTime;
            rankYesterday = item.rank;
            airAmountYesterday = item.airAmount;
            allAvePowerYesterday = item.allAvePower;
          }
          dataArr.push([item.time, item.totalPowerConsumption]);
          dateArr.push(item.time);
        });
        curveOption.series[0].data.splice(0, curveOption.series[0].data.length, ...dataArr);
        curveOption.xAxis.data.splice(0, curveOption.xAxis.data.length, ...dateArr);
      } else if (curveData.retCode === '00000' && curveData.airPowers[0].measurementPowerPeriods === null) {
        list = [];
        Toast.info('暂无数据', 2);
        curveOption.series[0].data.splice(0, curveOption.series[0].data.length, ...dataArr);
        curveOption.xAxis.data.splice(0, curveOption.xAxis.data.length, ...dateArr);
      } else {
        list = [];
        Toast.fail('获取能耗失败!', 2);
        curveOption.series[0].data.splice(0, curveOption.series[0].data.length, ...dataArr);
        curveOption.xAxis.data.splice(0, curveOption.xAxis.data.length, ...dateArr);
      }
      if (type === 'year') {
        curveOption.xAxis.name = '(月)';
      } else {
        curveOption.xAxis.name = '(日)';
      }
      self.setState({
        option: curveOption
      });
    }, (err) => {
      console.log(err);
      Toast.fail('获取能耗失败!', 2);
      list = [];
      curveOption.series[0].data.splice(0, curveOption.series[0].data.length, ...dataArr);
      curveOption.xAxis.data.splice(0, curveOption.xAxis.data.length, ...dateArr);
      self.setState({
        option: curveOption
      });
    });
    return true;
  }
  componentDidMount() {
    this.getRecord(0);
  }
  render() {
    hideDeviceInfo(false);
    const tabs = [{
      title: '近7天',
      sub: '1'
    }, {
      title: '近30天',
      sub: '2'
    }, {
      title: '近1年',
      sub: '3'
    }, ];
    return (<div className="energyRecord">
                <div className="upcore-navbar">
                    <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left" ></span>
                    <span className="upcore-navbar-icon-span">{'能耗记录'}</span>
                </div>
                <div className="contrast">
                    <div className="title">
                        <div>昨日</div>
                        <div>今日</div>
                    </div>
                    <div className="pic">
                        <div className="box left">
                            <div className="value">{`${totalPowerConsumptionYesterday}度`}</div>
                            <div className="des">昨日耗电量</div>
                        </div>
                        <div className="box right">
                            <div className="value">{`${totalPowerConsumptionToday}度`}</div>
                            <div className="des">今日耗电量</div>
                        </div>
                    </div>
                    <div className="details">
                        <div className="border">
                            <div className="value">{`${averagePowerConsumptionYesterday}度`}</div>
                            <div className="des">每小时耗电量</div>
                        </div>
                        <div className="border">
                            <div className="value">{`${totalTimeYesterday}小时`}</div>
                            <div className="des">开机时长</div>
                        </div>
                        <div className="border right">
                            <div className="value">{`${averagePowerConsumptionToday}度`}</div>
                            <div className="des">每小时耗电量</div>
                        </div>
                        <div className="border right">
                            <div className="value">{`${totalTimeToday}小时`}</div>
                            <div className="des">开机时长</div>
                        </div>
                    </div>
                </div>
                <div>
                    <Tabs tabs={tabs}
                        initialPage={0}
                        onChange={(tab, index) => {this.getRecord(index);}}
                    >
                        <div>
                            <LineEcharts option={this.state.option}/>
                            <div className="p">(以上数据仅供参考，实际请以电表计数为准)</div>
                            <div className="history" onClick={() => {this.gotoHistory(list,0);}}>
                                <span className="des">查看耗电历史记录</span>
                                <span className="icon"></span>
                            </div>
                        </div>
                        <div>
                            <LineEcharts option={this.state.option}/>
                            <div className="p">(以上数据仅供参考，实际请以电表计数为准)</div>
                            <div className="history" onClick={() => {this.gotoHistory(list,1);}}>
                                <span className="des">查看耗电历史记录</span>
                                <span className="icon"></span>
                            </div>
                        </div>

                        <div>
                            <LineEcharts option={this.state.option}/>
                            <div className="p">(以上数据仅供参考，实际请以电表计数为准)</div>
                            <div className="history" onClick={() => {this.gotoHistory(list,2);}}>
                                <span className="des">查看耗电历史记录</span>
                                <span className="icon"></span>
                            </div>
                        </div>
                    </Tabs>
                </div>
                <div className="pk" onClick={() => {this.gotoEnergyPK();}}></div>
            </div>);
  }
}