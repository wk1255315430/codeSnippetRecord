import classnames from 'classnames';
import React from 'react';
import { Toast } from 'antd-mobile';
// import {inject, observer} from 'mobx-react';
import './style/index.less';
import { getAttribute } from '../../util/tool';


//当前canvas对象
let baseConvas = '';
let defaultLeftImg = require('../../assets/image/othersLeft.png');
let defaultRightImg = require('../../assets/image/othersRight.png');
let defaultPointImg = require('../../assets/image/othersPoint.png');


let touchTemp = 0;
let touchtrue =false; //是否touchmove，如果没有会执行touchend里的温度变化重绘canvas
let touchCancel = false; //当温度最高或者最低时不允许再touchmove，也不允许touchend里重绘canvas
let istouch = false;//是否是手滑动使温度变化
let temicon = false;//温度箭头是否显示
let temText='';//温度圈里顶部状态显示

// let tempRange = 0;
// let minTemp = 0;


//touchStart点位置
let offsetTop = '';
let offsetLeft = '';

let canvasWidth = 300;
let centerX = canvasWidth/2;
let centerY = canvasWidth/2;
let circleR = 110;
let containerWidth = canvasWidth/2;
let topPointY = containerWidth - circleR;
let topPointX = centerX;

export default class TargetTemperature extends React.Component {
  constructor(props) {
    super(props);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.drawTargetColor = this.drawTargetColor.bind(this);
    this.cleanCanvas = this.cleanCanvas.bind(this);
    this.calculateRad = this.calculateRad.bind(this);
    this.calculatePoint = this.calculatePoint.bind(this);
    this.clickEvent = this.clickEvent.bind(this);
    this.state = {
      temp: 26,
      min:16,
      max:30,
      range:15,
      step:1,
      onlineStatus:this.props.isOnline,
      onOffStatus:this.props.onOffStatus,
      writable:true,
      alarmsList :false,
      basicColor:'#37C5BB',
      basicShadowColor:'#DCF1EF',
      ponitImg:defaultPointImg,
      leftImg:defaultLeftImg,
      rightImg:defaultRightImg,
      PMV:false,
      Wind:false,
      care:false
    };
  }
  componentDidMount(){
    baseConvas = document.getElementById('canvas');
    baseConvas.width = canvasWidth;
    baseConvas.height = canvasWidth;
    const { config,attributes,onOffStatus,isOnline,alarmsList} = this.props;
    // const alarmslength = alarmsList;
    // if(alarmslength.length>0){
    //   this.setState({alarmsList:true});
    // }
    // const disabled = onOffStatus && isOnline;
    const targetTemperatureObj = getAttribute('targetTemperature',attributes);
    const operationModeObj = getAttribute('operationMode',attributes);
    let temWritable = targetTemperatureObj.writable;
    let basicTemp = parseFloat(targetTemperatureObj.value);
    this.setState({PMV:false,Wind:false});
    if(operationModeObj.value === '0'){
      this.setState({PMV:true});
      basicTemp = basicTemp + 26;
      const care = config.baseFunctionArr.filter((item) => {
        if(!item.baseType){
          return null;
        }
        return item.name === 'specialMode';
      });
      if(care.length>0){
        this.setState({care:true});
        temWritable =false;
        this.setState({writable:temWritable});
      }

    }else if(operationModeObj.value !== '0'){
      if(basicTemp>-3 &&basicTemp<-3){
        basicTemp = basicTemp + 26;
      }
    }
    this.setState({onOffStatus:onOffStatus,onlineStatus:isOnline,writable:temWritable,temp:basicTemp});
    const disabled = onOffStatus && isOnline && temWritable;
    if(baseConvas && config.basicColors && config.basicColors.othersColor && disabled){
      const ColorArr = config.basicColors.modes.filter((item) => {
        return item.modeValue === operationModeObj.value;
      });
      // let basicTemp = parseFloat(targetTemperatureObj.value);

      if(operationModeObj.value === '6'){
        this.setState({Wind:true});
      }
      const getBasicColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      const getBasicshadowColor = ColorArr.length === 0 ? config.basicColors.othersColor.shadowColor : ColorArr[0].shadowColor;
      const basicPoint = ColorArr.length === 0 ? config.basicColors.othersColor.ponitImg : ColorArr[0].ponitImg;
      const LeftImg = ColorArr.length === 0 ? config.basicColors.othersColor.leftImg : ColorArr[0].leftImg;
      const RightImg = ColorArr.length === 0 ? config.basicColors.othersColor.RightImg : ColorArr[0].RightImg;
      this.setState({temp:basicTemp,basicColor:getBasicColor,basicShadowColor:getBasicshadowColor,ponitImg:basicPoint,leftImg:LeftImg,rightImg:RightImg});
      document.getElementById('hideImg').src = basicPoint;
      const calculateResult = this.calculateRad(basicTemp,targetTemperatureObj.valueRange,operationModeObj.value);
      this.drawTargetColor(calculateResult,getBasicColor,document.getElementById('hideImg'),temWritable);
    }
    if(!disabled||(!temWritable && !operationModeObj.writable)){
      this.cleanCanvas();
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('生命周期');
    const { config,attributes,onOffStatus,isOnline,alarmsList} = nextProps;
    // const alarmslength = alarmsList;
    // if(alarmslength.length>0){
    //   this.setState({alarmsList:true});
    // }
    // console.log(disabled);
    const targetTemperatureObj = getAttribute('targetTemperature',attributes);
    const operationModeObj = getAttribute('operationMode',attributes);
    let temWritable = targetTemperatureObj.writable;
    let basicTemp = parseFloat(targetTemperatureObj.value);
    this.setState({PMV:false,Wind:false});
    if(operationModeObj.value === '0'){
      this.setState({PMV:true});
      basicTemp = basicTemp + 26;

      //判断是否有specialMode
      const care = config.baseFunctionArr.filter((item) => {
        if(!item.baseType){
          return null;
        }
        return item.name === 'specialMode';
      });
      if(care.length>0){
        this.setState({care:true});
        temWritable =false;
        this.setState({writable:temWritable});
      }
    }

    // console.log(this.state.temp,'11111');
    this.setState({onOffStatus:onOffStatus,onlineStatus:isOnline,writable:temWritable,temp:basicTemp});
    const disabled = onOffStatus && isOnline;
    // console.log(targetTemperatureObj.value,'1111111111');
    if(baseConvas && config.basicColors && config.basicColors.othersColor && disabled && (temWritable || operationModeObj.writable)){
      const ColorArr = config.basicColors.modes.filter((item) => {
        return item.modeValue === operationModeObj.value;
      });

      if(operationModeObj.value === '6'){
        this.setState({Wind:true});
      }
      const getBasicColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      const getBasicshadowColor = ColorArr.length === 0 ? config.basicColors.othersColor.shadowColor : ColorArr[0].shadowColor;
      const basicPoint = ColorArr.length === 0 ? config.basicColors.othersColor.ponitImg : ColorArr[0].ponitImg;
      const LeftImg = ColorArr.length === 0 ? config.basicColors.othersColor.leftImg : ColorArr[0].leftImg;
      const RightImg = ColorArr.length === 0 ? config.basicColors.othersColor.RightImg : ColorArr[0].RightImg;
      this.setState({temp:basicTemp,basicColor:getBasicColor,basicShadowColor:getBasicshadowColor,ponitImg:basicPoint,leftImg:LeftImg,rightImg:RightImg});
      document.getElementById('hideImg').src = basicPoint;

      const calculateResult = this.calculateRad(basicTemp,targetTemperatureObj.valueRange,operationModeObj.value);
      this.drawTargetColor(calculateResult,getBasicColor,document.getElementById('hideImg'),temWritable);
    }
    if(!disabled ||(!temWritable && !operationModeObj.writable)){
      this.cleanCanvas();
    }
  }

  calculateRad(value,range,operationModeValue){
    let min = parseFloat(range.dataStep.minValue);
    let max = parseFloat(range.dataStep.maxValue);
    const step = parseFloat(range.dataStep.step);
    if(operationModeValue === '0'){
      min = min + 26;
      max = max + 26;
    }
    const length = (max - min + 1)/step;
    
    // console.log(min);
    // console.log(max);
    // tempRange = length;
    this.setState({min:min,max:max,range:length,step:step});
    const targetNow = (parseFloat(value) - min + 1)/step;
    const rad = ((targetNow/length)*(2*Math.PI) - (0.5 * Math.PI));
    let point = {x:centerX,y:centerY-circleR};
    if(rad > (0.5 * Math.PI)){
      point.x = containerWidth - Math.sin(1.5 * Math.PI - rad)*circleR;
      point.y = containerWidth - Math.cos(1.5 * Math.PI - rad)*circleR; 
      if(rad < Math.PI){
        point.x = containerWidth - Math.sin(rad - 0.5 * Math.PI)*circleR;
        point.y = containerWidth + Math.cos(rad - 0.5 * Math.PI)*circleR;  
      }    
    }else{
      point.x = containerWidth + Math.sin(0.5 * Math.PI - rad)*circleR;
      point.y = containerWidth + Math.cos(0.5 * Math.PI - rad)*circleR; 
      if(rad < 0){
        point.x = containerWidth + Math.sin(0.5 * Math.PI + rad)*circleR;
        point.y = containerWidth - Math.cos(0.5 * Math.PI + rad)*circleR; 
      }
    }
    return {rad:rad,point:point};
  }

  calculatePoint(rad){
    let point = {x:centerX,y:centerY-circleR};
    if(rad > (0.5 * Math.PI)){
      point.x = containerWidth - Math.sin(1.5 * Math.PI - rad)*circleR;
      point.y = containerWidth - Math.cos(1.5 * Math.PI - rad)*circleR; 
      if(rad < Math.PI){
        point.x = containerWidth - Math.sin(rad - 0.5 * Math.PI)*circleR;
        point.y = containerWidth + Math.cos(rad - 0.5 * Math.PI)*circleR;  
      }    
    }else{
      point.x = containerWidth + Math.sin(0.5 * Math.PI - rad)*circleR;
      point.y = containerWidth + Math.cos(0.5 * Math.PI - rad)*circleR; 
      if(rad < 0){
        point.x = containerWidth + Math.sin(0.5 * Math.PI + rad)*circleR;
        point.y = containerWidth - Math.cos(0.5 * Math.PI + rad)*circleR; 
      }
    }
    return {rad:rad,point:point};
  }

  //绘制渐变目标色温
  drawTargetColor(calculateResult,color,basicPoint,flag){
    this.cleanCanvas();
    let circle = baseConvas.getContext('2d');
    circle.lineWidth = 2.5;
    circle.strokeStyle = color;
    circle.beginPath();//开始一个新的路径
    circle.arc(centerX, centerY, circleR, -0.5 * Math.PI, calculateResult.rad, false);///用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    circle.stroke();//对当前路径进行描边
    circle.closePath();
    if(flag){
      circle.drawImage(basicPoint,calculateResult.point.x-15,calculateResult.point.y-15,30,30);
    } 
  }

  //清理画布
  cleanCanvas(){
    let circle = baseConvas.getContext('2d');
    circle.clearRect(0, 0, canvasWidth, canvasWidth);
  }

  //mouseDown、touchStart
  touchStart(e){
    console.log('start');
    touchtrue = false;
    touchCancel = false;
    // istouch = false;
    if(this.state.onlineStatus && this.state.onOffStatus && this.state.writable){
      offsetLeft = document.getElementById('targetTempDiv').offsetLeft;
      offsetTop = document.getElementById('targetTempDiv').offsetTop;
    }
  }

  //mouseMove、touchMove
  touchMove(e){
    console.log('move');
    touchtrue = true;
    e.stopPropagation();
    e.preventDefault();
    if(this.state.onlineStatus && this.state.onOffStatus && this.state.writable && !touchCancel){
      let pointY = parseFloat(e.targetTouches[0].pageY) - offsetTop;
      let pointX = parseFloat(e.targetTouches[0].pageX) - offsetLeft;
      const operationModeObj = getAttribute('operationMode',this.props.attributes);
      const targetTemperatureObj = getAttribute('targetTemperature',this.props.attributes);
      let distanceToCenter = Math.sqrt(Math.pow(Math.abs(pointY - centerY),2) + Math.pow(Math.abs(pointX - centerX),2));
      // console.log(distanceToCenter);
      if(distanceToCenter <= (circleR+10) && distanceToCenter >= (circleR-20)){
        let distanceToTop = Math.sqrt(Math.pow(Math.abs(pointY - topPointY),2) + Math.pow(Math.abs(pointX - topPointX),2));   
        let cos = (Math.pow(distanceToCenter,2)+Math.pow(circleR,2)-Math.pow(distanceToTop,2))/(2*distanceToCenter*circleR);
        let rad = 0;
        if(pointX < centerX){//在左边
          rad = 2 * Math.PI - Math.acos(cos);   
        }else{
          rad = Math.acos(cos); 
        }
        touchTemp = Math.round(rad/(2 * Math.PI)*(this.state.range) + this.state.min);
        touchTemp = touchTemp > this.state.max ? this.state.max:touchTemp;
        touchTemp = touchTemp < this.state.min ? this.state.min:touchTemp;
        // this.cleanCanvas();
        let calculateObj = this.calculatePoint(rad-0.5 * Math.PI);
        console.log(calculateObj.rad);
        if(calculateObj.rad > -1.55 && calculateObj.rad<4.65){
          this.drawTargetColor(calculateObj,this.state.basicColor,document.getElementById('hideImg'),this.state.writable);
          this.setState({temp:touchTemp});
        }else{
          // console.log(this.setState.temp,touchTemp,'11111111');
          if(touchTemp === parseFloat(targetTemperatureObj.valueRange.dataStep.minValue) && calculateObj.rad < -1.45){
            Toast.info('当前已是最低温度', 1);
          }else if(touchTemp === parseFloat(targetTemperatureObj.valueRange.dataStep.maxValue) &&calculateObj.rad>4.55){
            Toast.info('当前已是最高温度', 1);
          }
          touchCancel = true;
        }
        // this.drawTargetColor(calculateObj,this.state.basicColor,document.getElementById('hideImg'),operationModeObj.value === '6');
      }
    }  
  }

  //mouseUp、touchEnd，色温调节完毕，下发命令
  touchEnd(e){
    console.log('end');
    if(this.state.onlineStatus && this.state.onOffStatus && this.state.writable){
      const operationModeObj = getAttribute('operationMode',this.props.attributes);
      const targetTemperatureObj = getAttribute('targetTemperature',this.props.attributes);
      if(!touchtrue){
        let pointY = parseFloat(e.changedTouches[0].pageY) - offsetTop;
        let pointX = parseFloat(e.changedTouches[0].pageX) - offsetLeft;

        let distanceToCenter = Math.sqrt(Math.pow(Math.abs(pointY - centerY),2) + Math.pow(Math.abs(pointX - centerX),2));
        // console.log(distanceToCenter);
        if(distanceToCenter <= (circleR+10) && distanceToCenter >= (circleR-10)){
          let distanceToTop = Math.sqrt(Math.pow(Math.abs(pointY - topPointY),2) + Math.pow(Math.abs(pointX - topPointX),2));
          let cos = (Math.pow(distanceToCenter,2)+Math.pow(circleR,2)-Math.pow(distanceToTop,2))/(2*distanceToCenter*circleR);
          let rad = 0;
          if(pointX < centerX){//在左边
            rad = 2 * Math.PI - Math.acos(cos);
          }else{
            rad = Math.acos(cos);
          }
          touchTemp = Math.round(rad/(2 * Math.PI)*(this.state.range) + this.state.min);
          touchTemp = touchTemp > this.state.max ? this.state.max:touchTemp;
          touchTemp = touchTemp < this.state.min ? this.state.min:touchTemp;

          this.setState({temp:touchTemp});
          this.cleanCanvas();
          let calculateObj = this.calculatePoint(rad-0.5 * Math.PI);
          // if(!touchCancel){
          this.drawTargetColor(calculateObj,this.state.basicColor,document.getElementById('hideImg'),this.state.writable);
          // }
          if(this.state.PMV){
            this.props.calculate('targetTemperature',String(touchTemp -26));
          }else{
            this.props.calculate('targetTemperature',String(touchTemp));
          }
          // touchCancel = true;
        }
      }else if(touchtrue){
        if(this.state.PMV){
          this.props.calculate('targetTemperature',String(touchTemp -26));
        }else{
          this.props.calculate('targetTemperature',String(touchTemp));
        }
      }


      // const operationModeObj = getAttribute('operationMode',this.props.attributes);

    }
    // istouch = false;
  }

  clickEvent(flag){
    console.log('触发');
    // istouch = false;
    const targetTemperatureObj = getAttribute('targetTemperature',this.props.attributes);
    let tempNow = this.state.temp;
    let afterValue = '';
    if(flag ===1 && (tempNow>this.state.min)){//减小
      afterValue = parseFloat(tempNow) - parseFloat(this.state.step);
    }else if((tempNow<this.state.max)&& flag ===2){//增大
      afterValue = parseFloat(tempNow) + parseFloat(this.state.step);
    }

    if(this.state.PMV){
      tempNow =tempNow -26;
    }
    if(flag ===1 && tempNow === parseFloat(targetTemperatureObj.valueRange.dataStep.minValue)){
      Toast.info('当前已是最低温度', 1);
      return;
    }else if(flag ===2 && tempNow === parseFloat(targetTemperatureObj.valueRange.dataStep.maxValue)) {
      Toast.info('当前已是最高温度', 1);
      return;
    }
    if(this.state.PMV){
      // console.log('1');
      this.props.calculate('targetTemperature',String(afterValue-26));
    }else{
      // console.log('2');
      this.props.calculate('targetTemperature',String(afterValue));
    }
    this.setState({temp:afterValue});
  }

  render() {
    const { config,attributes,onOffStatus,isOnline,alarmsList} = this.props;
    const operationModeObj = getAttribute('operationMode',attributes);
    const specialModeObj = getAttribute('specialMode',attributes);
    // const targetTemperatureObj = getAttribute('targetTemperature',attributes);
    // const basicTemp = parseFloat(targetTemperatureObj.value);
    const operationWritable = operationModeObj.writable;
    const disabled = this.state.onOffStatus && this.state.onlineStatus ;
    let showColor = this.state.basicColor;
    let showShadowColor = this.state.basicShadowColor;
    if(!disabled || (!this.state.writable &&!operationWritable)){
      showColor = '#969696';
      showShadowColor = '#E6EAF5';
    }
    let PMV = 'PMV';
    if(this.state.PMV){
      let calculateTemp = (this.state.temp -26)>0?('+'+(this.state.temp -26)):('-'+(26-this.state.temp));
      PMV = PMV + (Math.abs(calculateTemp) === 0 ? '': calculateTemp);

    }
    // console.log(this.state.PMV,this.state.care,'111111');
    if(disabled){
      if(this.state.Wind){
        temText = '送风模式';
      }else if(this.state.PMV&&this.state.care){
        temText = '设定模式';
        PMV='Care';
      }else{
        temText = '设定温度';
      }
    }else{
      temText = '设备状态';
    }

    temicon =this.state.Wind || !this.state.writable ||(this.state.PMV&&this.state.care);
    return (
      <div className="targetTempDiv" id="targetTempDiv">
        <canvas id="canvas" width={canvasWidth} height={canvasWidth}
          onTouchStart={this.touchStart}
          onTouchMove={this.touchMove}
          onTouchEnd={this.touchEnd}></canvas>
        <img id="hideImg" className="hideImg" src=""/>
        <div className="targetControl">
          <div style={{color:showColor}}>{temText}</div>
          <div style={{display:disabled?'block':'none'}}>
            <img style={{visibility:temicon?'hidden':'visible'}} id="leftImg" src={this.state.leftImg} onClick={(e)=>{this.clickEvent(1);}}/>
            <div className="targetTempSpan" style={{color:showColor}}>
              <span style={{fontSize:this.state.PMV?'26px':''}}>{this.state.PMV?PMV:this.state.temp}</span>
              <span style={{fontSize:'small',display:this.state.PMV?'none':'inline-block'}} > ℃</span>
            </div>
            <img style={{visibility:temicon?'hidden':'visible'}} id="rightImg" src={this.state.rightImg} onClick={(e)=>{this.clickEvent(2);}}/>
          </div>
          <div className="offStatus" style={{display:disabled?'none':'block'}}>
            {this.state.onlineStatus?(this.state.onOffStatus?'':'关机'):'离线'}
          </div>
        </div>
        <div className="boxShadow" style={{boxShadow: `0px 6px 10px ${showShadowColor}`}}>
        </div>
      </div>
    );
  }
}


