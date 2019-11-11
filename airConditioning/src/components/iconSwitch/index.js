import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { getAttribute } from '../../util/tool';
// import { isolateGlobalState } from 'mobx/lib/core/globalstate';

export default class IconSwitch extends React.Component {
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
    const { flag,name,value,disabled,text,config,activeValue,basicColor,basicShadowColor,iconImg,iconOffImg,calculate,isOnline} = this.props;
    let showText = text;
    let showImg = iconImg;
    if(value !== 'true'&& iconOffImg){
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
    let textColor = '#969696';
    let showShadowColor = basicShadowColor;
    let borderColor = basicColor;
    // if(value.toUpperCase() !== activeValue.toUpperCase() || !disabled){
    //   showColor = '#999999';
    // }
    //不可写按钮置灰
    if(!disabled){
      showImg = iconOffImg;
      showColor = '#C8C8C8';
      // borderColor = '#C8C8C8';
    }
    if(value !== 'true' || !disabled){
      borderColor = '#ffffff';
    }

    return (
      <div>
        <div className={classnames(`container-${flag}`)}
          style={{backgroundColor:showColor,boxShadow: `0px 3px 4px ${showShadowColor}`,borderColor:`${borderColor}`}}
          onClick={()=>{this.click(value,name,isOnline,disabled);}}>
          <img src={showImg}></img>
        </div>
        <p className={classnames('container-p')} style={{color:textColor}}>{text}</p>
      </div>
    );
  }
}


