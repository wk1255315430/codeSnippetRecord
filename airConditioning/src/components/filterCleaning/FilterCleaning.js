import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { CordovaUtil } from '@uplus/updevicecore';
import { hideDeviceInfo, getGlobalHeaders } from '../../util/tool';
require('./filterCleaning.css');
// const cordovaUtil = new CordovaUtil();
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class FilterCleaning extends Component {
  constructor(props) {
    super(props);
    const md5 = require('js-md5');
    const seconds = new Date().getTime();
    const str = `mac=${window.devicemac}##timestamp=${seconds}`;
    // const str = 'mac=DC330D16D7EB##timestamp=1531451237181';
    const sign = md5(str);
    const a = window.btoa(str);
    this.state = {
      // “mac=DC330D16D7EB##timestamp=1531452012356”  使用base64编码
      A: a,
      //  "mac=DC330D16D7EB##timestamp=1531452012356"字符串 md5加密
      SIGN: sign,
      // 时间戳
      B: seconds
    };
    this.gotoIndex = this.gotoIndex.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  componentWillMount() {
    // getGlobalHeaders();
  }
  render() {
    hideDeviceInfo(false);
    const height = document.documentElement.clientHeight - 40;
    const pageUrl = 'http://uhome.haier.net:8470/acbizCms/airfilternew/getDeviceFilterState.do?';
    const params = `A=${this.state.A}&SIGN=${this.state.SIGN}&B=${this.state.B}&hybrid_navbar_hidden=true`;
    return (<div>
      <div className="upcore-navbar">
        <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
        <span className="upcore-navbar-icon-span">{'滤网清洗'}</span>
      </div>
      <div className="contect">
        <iframe width="100%" height={`${height}px`} src={`${pageUrl}${params}`}></iframe>
      </div>
    </div>);
  }
}