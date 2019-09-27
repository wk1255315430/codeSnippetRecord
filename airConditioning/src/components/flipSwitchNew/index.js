import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { getAttribute } from '../../util/tool';
// import { isolateGlobalState } from 'mobx/lib/core/globalstate';

export default class FlipSwitchNew extends React.Component {
  constructor(props){
    super(props);
  }
  // componentWillReceiveProps(nextProps){
  //   console.log(nextProps);
  // }
  click(value,offValue,activeValue,name,isOnline,disabled){
    console.log(disabled);
    console.log(isOnline);
    if(isOnline && disabled){
      const {calculate} = this.props;
      let nowValue = value === activeValue;
      let command = nowValue?offValue:activeValue;
      calculate(name,command);
    }
  }
  render() {
    const { flag,name,value,disabled,text,config,offValue,activeValue,basicColor,iconImg,uplusid,calculate,isOnline} = this.props;
    let showText = text;
    let showImg = iconImg;

    // if(value !== activeValue && iconOffImg){
    //   showImg = iconOffImg;
    // }
    if(config && config.valueRange && config.valueRange.dataList){
      let showArr=config.valueRange.dataList.filter((item)=>{
        return item.data === value;
      });
      if(showArr.length>0){
        showText = showArr[0].desc;
      }
    }
    let showColor = basicColor;
    let textColor = '#999999';
    // let borderColor = basicColor;
    // if(value.toUpperCase() !== activeValue.toUpperCase() || !disabled){
    //   showColor = '#999999';
    // }
    // if(!disabled){
    //   showImg = iconOffImg;
    //   showColor = '#C8C8C8';
    // }
    if(value !== activeValue || !disabled){
      showColor = '#DDDDDD';
    }

    return (
      <div>
        <div className={classnames(`containerNew-${flag}`)}
          onClick={()=>{this.click(value,offValue,activeValue,name,isOnline,disabled);}} data-uplus-id={uplusid} data-uplus-action-name={text} data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调-附加功能">
          <div style={{backgroundColor:showColor}}>
            <img src={showImg}></img>
          </div>
        </div>
        <p className={classnames('containerNew-p')} style={{color:textColor}}>{text}</p>
      </div>
    );
  }
}


