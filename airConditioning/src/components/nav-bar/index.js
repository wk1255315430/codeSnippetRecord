import classnames from 'classnames';
import React from 'react';
import UplusApi from '@uplus/uplus-api/es/uplus-api';
import './style/index.less';
let aa = false;
export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingShow: false,
      aa:false
    };
  }
  handleClick() {
    this.setState({
      settingShow: !this.state.settingShow
    });


  }

  transition() {
    // const uplusApi = new UplusApi();
    // uplusApi.vdnModule.goToPage({'url':'http://uplus.haier.com/uplusapp/DeviceList/DeviceEditView.html?mac='+window.devicemac});
    window.location.href='http://uplus.haier.com/uplusapp/DeviceList/DeviceEditView.html?mac='+window.devicemac;
  }
  componentWillReceiveProps(nextProps){
    const { prefixCls,title,settingShow,infoShow,onLeftClick } = nextProps;
    if(!settingShow && this.state.settingShow){
      this.setState({
        settingShow:false
      });
    }
  }

  render() {
    const { prefixCls,title,settingShow,infoShow,onLeftClick } = this.props;
    this.props.infoShow(this.state.settingShow);

    return (
      <div className={classnames(`${prefixCls}`)}>
        <span className={classnames(`${prefixCls}-icon-left`)} onClick={() => onLeftClick()} data-uplus-id="0001" data-uplus-action-name="返回" data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调"/>
        <span className={classnames(`${prefixCls}-name-span`)}>{title}</span>
        <span
          className={classnames(`${prefixCls}-icon-right`)} onClick={() => this.handleClick()}>
          <img alt="" className={classnames(`${prefixCls}-icon-right-img`)} src={require('../style/imageNew/icon_topbar_more.png')} />
        </span>
        <div className="setting" style={{display:(this.state.settingShow &&settingShow)?'block':'none'}}>
          <div onClick={() => this.transition()} data-uplus-id="0002" data-uplus-action-name="设备管理" data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调">
            <span>设备信息</span>
            <img alt="" src={require('../style/image/setting_next.png')} />
          </div>
        </div>
      </div>
    );
  }
}
NavBar.defaultProps = {
  prefixCls: 'upcore-navbar',
  title: '',
  onLeftClick: null,
};
