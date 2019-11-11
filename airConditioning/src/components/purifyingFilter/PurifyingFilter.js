/* eslint-disable */
import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { CordovaUtil } from '@uplus/updevicecore';
import { hideDeviceInfo, getGlobalHeaders, getAttribute } from '../../util/tool';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
require('./purifyingFilter.css');
// const cordovaUtil = new CordovaUtil();
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class PurifyingFilter extends Component {
  constructor(props) {
    super(props);
    this.gotoIndex = this.gotoIndex.bind(this);
    this.state = {
      ControlResult: 'none',
      confirm: 'none'
    };
  }
  gotoIndex() {
    history.go(-1);
  }
  purifyingBt() {
    this.setState({
      confirm: 'block'
    });
  }
  cancelBt() {
    this.setState({
      confirm: 'none'
    });
  }
  async confirmBt() {
  const { cordovaUtil, mac, deviceName, baseInfo,onlineStatus } = this.props.DeviceState;
    const self = this;
    // await cordovaUtil.initDeviceReady().then(() => {
      cordovaUtil.logicEngineModule.calculatePromise(window.devicemac, 'cleaningTimeStatus', 'true', true).then(() => {
        cordovaUtil.logicEngineModule.operatePromise(window.devicemac).then((result) => {
          console.log(result);
          if (result.retCode !== '00000') {
            Toast.fail('操作失败!', 2);
          }
          self.setState({
            confirm: 'none',
            ControlResult: 'block'
          });
        }, (e) => {
          console.log(e);
          Toast.fail('操作失败!', 2);
          self.setState({
            confirm: 'none',
            ControlResult: 'block'
          });
        });;
      });
    // });
  }
  render() {
    hideDeviceInfo(false);
    const height = document.documentElement.clientHeight;
    return (<div style={{height:`${height}px`}}>
                <div className="upcore-navbar">
                    <span onClick={()=>{this.gotoIndex();}} className="upcore-navbar-icon-left" ></span>
                    <span className="upcore-navbar-icon-span">{'净化滤芯'}</span>
                </div>
                <div className="mainPurifying" style={{display:this.state.ControlResult === 'block'?'none':'block'}}>
                    <img src={require("./images/loading.png")}/>
                    <p>重新计时后,净化滤芯累计时间清零</p>
                </div>
                <div className="purifyingFilterbtContainer" style={{display:this.state.ControlResult === 'block'?'none':'block'}}>
                    <div onClick={()=>{this.purifyingBt();}} className="fontBlue">已清洗,&nbsp;&nbsp;重新计时</div>
                </div>
                <div className="success" style={{display:this.state.ControlResult}}>
                    <img src={require("./images/success.png")}/>
                    <p>净化滤芯累计时间已清零</p>
                </div>
                <div className="confirm" style={{display:this.state.confirm}}>
                    <div>
                        <p>确认要开启“重新计时”功能吗?</p>
                        <div>
                            <div onClick={()=>{this.cancelBt();}}>取消</div>
                            <div onClick={()=>{this.confirmBt();}}>确定</div>
                        </div>
                    </div>
                </div>
            </div>);
  }
}