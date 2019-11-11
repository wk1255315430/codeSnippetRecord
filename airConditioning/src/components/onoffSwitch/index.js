import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { getAttribute } from '../../util/tool';
// import { isolateGlobalState } from 'mobx/lib/core/globalstate';
let powerOff = require('../../assets/image/power_off.png');

export default class OnoffSwitch extends React.Component {
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
    const { flag,name,value,disabled,text,config,activeValue,basicColor,basicIconColor,basicShadowColor,iconImg,iconOffImg,calculate,isOnline} = this.props;
    let showText = text;
    let showImg = iconImg;
    if(value === 'false'&& iconOffImg){
      showImg = iconOffImg;
    }

    if(config && config.valueRange && config.valueRange.dataList){
      let showArr=config.valueRange.dataList.filter((item)=>{
        return item.data === value;
      });
      if(showArr.length>0){
        showText = showArr[0].desc;
      }
    }
    let showColor = basicColor;
    let showShadowColor = basicShadowColor;
    if(name === 'onOffStatus' && value === 'false'){
      showImg = powerOff;
    }

    return (
      <div className={classnames(`container-${flag}`)}
        style={{backgroundColor:basicIconColor,boxShadow: `0px 3px 4px ${showShadowColor}`}}
        onClick={()=>{this.click(value,name,isOnline,disabled);}}>
        <img src={showImg}></img>
        <p style={{color:showColor}}>{text}</p>
      </div>
    );
  }
}


