import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { getAttribute } from '../../util/tool';
// import { isolateGlobalState } from 'mobx/lib/core/globalstate';
let powerOff = require('../../assets/image/power_off.png');

export default class OnoffSwitchNew extends React.Component {
  constructor(props){
    super(props);
  }
  // componentWillReceiveProps(nextProps){
  //   console.log(nextProps);
  // }
  click(value,name,isOnline,disabled){
    console.log(disabled);
    console.log(isOnline);
    if(isOnline && disabled){
      const {calculate} = this.props;
      let nowValue = value.toUpperCase() === 'TRUE';
      let command = nowValue?'false':'true';
      calculate(name,command);
    }
  }
  render() {
    const { flag,name,value,disabled,text,config,activeValue,basicColor,basicIconColor,iconImg,calculate,isOnline} = this.props;
    // let showText = text;
    let showImg = iconImg;

    // if(config && config.valueRange && config.valueRange.dataList){
    //   let showArr=config.valueRange.dataList.filter((item)=>{
    //     return item.data === value;
    //   });
    //   if(showArr.length>0){
    //     showText = showArr[0].desc;
    //   }
    // }
    let showColor = basicColor;
    let showIconColor = basicIconColor;
    if(name === 'onOffStatus' && value === 'false'){
      showColor = '#666666';
      showIconColor = '#666666';
    }
    return (
      <div>
        <div className={classnames(`containerNew-${flag}`)}
          onClick={()=>{this.click(value,name,isOnline,disabled);}} data-uplus-id="0006" data-uplus-action-name="开关" data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调-基本功能">
          <div style={{backgroundColor:showIconColor}}>
            <img src={showImg} ></img>
          </div>
        </div>
        <p className={classnames(`containerpNew-${flag}`)} style={{color:showColor}}>{text}</p>
      </div>
    );
  }
}


