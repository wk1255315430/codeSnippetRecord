import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { hideDeviceInfo, getGlobalHeaders,getHttp,getUserInfo } from '../../util/tool';
import { Toast} from 'antd-mobile';
require('./energyPK.css');
// const cordovaUtil = new CordovaUtil();
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      avatarUrl: ''
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  async getUserInfo() {
    const self = this;
    const userInfo = await getUserInfo();

    const recUrl = 'http://uhome.haier.net:7500/emuplus/account/v1.0/userinfo/query';
    const data = {
      accountToken: userInfo.retData?userInfo.retData.sdToken : ''
    };
    let response = '';
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
        response = JSON.parse(resp.data);
      } else {
        response = resp.data;
      }
      if (response.retCode === '00000') {
        console.log(response.data.userinfo.nickname);
        console.log(response.data.userinfo.avatarUrl);
        if(response.data.userinfo.nickname === null){
          self.setState({
            nickname: '',
            avatarUrl: response.data.userinfo.avatarUrl
          });
        }else {
          self.setState({
            nickname: response.data.userinfo.nickname,
            avatarUrl: response.data.userinfo.avatarUrl
          });
        }

      } else {
        Toast.fail('获取用户信息失败!', 2);
      }
    }, (err) => {
      console.log(err);
      Toast.fail('获取用户信息失败!', 2);
    });
    return true;
  }
  componentDidMount() {
    this.getUserInfo();
  }
  render() {
    hideDeviceInfo(false);
    let picurl = 'low';
    let text = '';
    let textColor = '';
    const params = this.props.location.state;
    console.log(params);
    if (params.rank > 80) {
      picurl = require('./images/high.png');
      textColor = '#32B5E6';
      text = '真是太棒了，继续保持哦~';
    } else if (params.rank > 49 && params.rank < 81) {
      picurl = require('./images/middle.png');
      textColor = '#44BE3C';
      text = '要注意节能啦，再接再厉哦~';
    } else {
      picurl = require('./images/low.png');
      textColor = '#F7B516';
      text = '哦哦，不要灰心~建议将空调设为26°或者PMV模式';
    }
    return (<div className="energyPK">
      <div className="upcore-navbar">
        <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
        <span className="upcore-navbar-icon-span">昨日能耗PK</span>
      </div>
      <div className="energyPK-main">
        <p className="avatar">
          <span style={{backgroundImage:`url(${this.state.avatarUrl})`}}></span>
        </p>
        <p className="nickname">{this.state.nickname === ''?'未设置':this.state.nickname}</p>
        <p className="pic" style={{backgroundImage:`url(${picurl})`}}></p>
        <p className="p1">您昨日的省电能力击败了</p>
        <p className="p2" style={{color:textColor}}>{`${params.rank}%`}</p>
        <p className="p3">的相同规格用户</p>
        <p className="p4" style={{color:textColor}}>{text}</p>                   
        <p className="p5">
          昨日共<span className="total" style={{color:textColor}}>{params.airAmount}</span>
          台同匹数空调运行，平均每小时耗电量<span className="allAvePower" style={{color:textColor}}>{params.allAvePower}</span>度
        </p>
        <p className="p6">您昨日平均每小时耗电量<span className="averagePowerConsumption" style={{color:textColor}}>{params.energyConsumePerHour}</span>度</p>
      </div>
    </div>);
  }
}