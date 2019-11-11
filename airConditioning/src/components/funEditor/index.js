import classnames from 'classnames';
import React from 'react';
import {inject, observer} from 'mobx-react';
import { getAttribute,getGlobalHeaders,getUrlParams,getHttp,getUserInfo } from '../../util/tool';
import { Toast } from 'antd-mobile';
import './style/index.less';
import { FunEditorItem } from '../index';
// import VDraggable from 'vdraggle';
import { List, arrayMove } from 'react-movable';
let additionalArr=[];
let aa = [];
@inject(allStores => ({
  DeviceState: allStores.DeviceState,
  mergedConfig: allStores.DeviceState.configObj||[],
  attributesChange:(attributes)=>{
    return attributes;
  }
}))
@observer
export default class FunEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      items: [],
      editState:false
    };
    // this.gotoIndex = this.gotoIndex.bind(this);
    // this.seniorEdit = this.seniorEdit.bind(this);
    // this.insertSubjoin = this.insertSubjoin.bind(this);
  }

  // gotoIndex() {
  //   history.go(-1);
  // }
  // async seniorEdit() {
  //   this.setState({editState:!this.state.editState});
  //   if(this.state.editState){
  //     this.insertSubjoin();
  //   }
  // }


  render() {
    const self = this;
    const { prefixCls,mergedConfig} = this.props;
    const { cordovaUtil, mac, deviceName, baseInfo,initCautions} = this.props.DeviceState;
    const config = this.props.mergedConfig;
    let attributes = this.props.DeviceState.getAttributes();

    //判断配置文件是否存在某功能
    // if(config && config.baseFunctionArr){
    //   additionalArr = config.baseFunctionArr.filter((item)=>{
    //     if (!attributes || !attributes.length) {
    //       return null;
    //     }
    //     const attribute = attributes.filter((attr) => attr.name === item.name);
    //     if(!attribute || attribute.length < 1){
    //       return null;
    //     }
    //     return item.show === false;
    //   });
    // }


    // 图标颜色根据模式不同变化
    let getBasicColor='#37C5BB';
    let getBasicShadowColor = '#DCF1EF';
    if(config.basicColors && config.basicColors.othersColor){
      const operationModeObj = getAttribute('operationMode',attributes);
      const ColorArr = config.basicColors.modes.filter((item) => {
        return item.modeValue === operationModeObj.value;
      });
      getBasicColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      getBasicShadowColor = ColorArr.length === 0 ? config.basicColors.othersColor.shadowColor : ColorArr[0].shadowColor;

    }

    return (
      <div className={classnames(`${prefixCls}`)}>
        {/*<div className="upcore-navbar">*/}
        {/*<span className="upcore-navbar-icon-left" onClick={this.gotoIndex}></span>*/}
        {/*<span className="upcore-navbar-icon-span">功能编辑</span>*/}
        {/*<span className={classnames(`${prefixCls}-icon-right`)} onClick={()=>{self.seniorEdit();}}>{this.state.editState?'完成':'编辑'}</span>*/}
        {/*</div>*/}
        {/*<div className={classnames(`${prefixCls}-container`)}>*/}
        <FunEditorItem
          prefixCls ={prefixCls}
          // additionalArr = {additionalArr}
          getBasicColor={getBasicColor}
          getBasicShadowColor={getBasicShadowColor}
          attributes={attributes}
          config={config}
        />

        {/*</div>*/}
        {/*<div className={classnames(`${prefixCls}-fix`)} style={{display:this.state.editState?'block':'none'}}>*/}
        {/*<img src={require('../style/image/gestures.png')}/>*/}
        {/*<span>长按拖动调整位置</span>*/}
        {/*</div>*/}
      </div>
    );
  }
}
FunEditor.defaultProps = {
  prefixCls: 'funeditor',
  mergedConfig:{}
};

