/* eslint-disable camelcase */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {hideDeviceInfo, getGlobalHeaders, getUserInfo, getHttp} from '../../util/tool';
require('./Repairs.css');
async function postAjax(_Repair) {
  // await getGlobalHeaders();
  // const http = await cordovaUtil.initDeviceReady().then(() => {
  //     return cordovaUtil.httpEngine;
  // });
  // window.globalHeaders.timestamp = String(new Date().getTime());
  const userInfo = await getUserInfo();
  const data = {
    code:'303',
    key:'8f0faab91b0f47529c491b2d9c18d122',
    phonecenter:userInfo.retData?userInfo.retData.phoneNumber : '',
    access_token:userInfo.retData?userInfo.retData.sdToken : '',
  };
  let globalHeaders = await getGlobalHeaders(data);
  globalHeaders.timestamp = String(new Date().getTime());
  const http = await getHttp();
  // let url='http://entrace.haier.net:8778/uesrCenter/gateWay';
  let url = 'http://entrace.haier.net:8778/go_weizhan/homeForeign';
  http.post(url, data, globalHeaders, function (res) {
    let resptype = typeof(res.data);
    let datas = {};
    if (resptype === 'string') {
      datas = JSON.parse(res.data);
    } else {
      datas = res.data;
    }
    window.Repair=datas.data;
  });
}
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer

export default class History extends Component {
  constructor(props) {
    super(props);
    this.gotoIndex = this.gotoIndex.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  repair() {
    window.location.href=Repair;
  }
  componentWillMount(){
    postAjax();
  }
  render() {
    const height = document.documentElement.clientHeight - 40;
    return (
      <div className="backg" >
        <div className="upcore-navbar">
          <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left"></span>
          <span className="upcore-navbar-icon-sapn">{'一键报修'}</span>
        </div>
        <div className="windows1" >
          <iframe src={Repair} className="windows2" height={`${height}px`}></iframe>
        </div>
      </div>
    );
  }
}
