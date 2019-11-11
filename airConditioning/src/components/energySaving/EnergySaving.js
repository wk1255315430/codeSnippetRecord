import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { hideDeviceInfo, getGlobalHeaders,getUserInfo, getDeviceClassifyCodeByTypeId, getDeviceMiddleClassifyCodeByTypeId } from '../../util/tool';
require('./energySaving.css');
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class EnergySaving extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }

  componentWillMount() {
    this.getUserInfo();
    // getGlobalHeaders();


  }
  async getUserInfo() {
    const self = this;
    let userInfo = {};
    userInfo = await getUserInfo();
    userInfo = userInfo.retData;
    self.setState({
      userInfo: userInfo,
    });
  }
  render() {
    const userInfo = this.state.userInfo;

    hideDeviceInfo(false);
    const height = document.documentElement.clientHeight - 40;
    const devicemac = window.devicemac;
    const pageUrl = 'http://uhome.haier.net:8470/acbizCms/view/H5/web/aircircle/energy_saving/index.html?';
    const params = `appId=${userInfo?userInfo.appId:''}&provinceCode=&clientId=${userInfo?userInfo.clientId:''}&mac=${window.devicemac}&accToken=${userInfo?userInfo.accessToken:''}&hybrid_navbar_hidden=true`;
    // const params= 'appId=MB-AIRCONDITION1-0000&provinceCode=%E5%B1%B1%E4%B8%9C&clientId=E626A702-EA43-4A11-9226-D7D53145DCB1&mac=DC330D16D7EB&accToken=TGT2BCIQC199UM0K2DPKC1LXZ59WB0';
    return (
      <div>
        <div className="upcore-navbar">
          <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
          <span className="upcore-navbar-icon-span">{'智慧节能'}</span>
        </div>
        <div className="energy-main">
          <iframe width="100%" height={`${height}px`} src={`${pageUrl}${params}`}></iframe>
        </div>
      </div>
    );
  }
}