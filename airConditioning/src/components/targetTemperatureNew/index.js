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
let defaultPointImg = require('../style/imageNew/button_temp_cool.png');


let touchTemp = 0;
let touchtrue =false; //是否touchmove，如果没有会执行touchend里的温度变化重绘canvas
let touchCancel = false; //当温度最高或者最低时不允许再touchmove，也不允许touchend里重绘canvas
let istouch = false;//是否是手滑动使温度变化
let temicon = false;//温度箭头是否显示
let temText='';//温度圈里顶部状态显示
let PMV = 'PMV';//pmv模式温度圈中间显示
let aa =false;
let temNum = 0;//温度圈显示的温度值
let clickalarm =0;//点击温度的次数

// let tempRange = 0;
// let minTemp = 0;


//touchStart点位置
let offsetTop = '';
let offsetLeft = '';

let canvasWidth = 252;
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
      temp: 100,
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
    // baseConvas.addEventListener('touchmove',touchMove);
    // baseConvas.width = canvasWidth;
    // baseConvas.height = canvasWidth;
    const { config,attributes,onOffStatus,isOnline,alarmsList} = this.props;
    const targetTemperatureObj = getAttribute('targetTemperature',attributes);
    const operationModeObj = getAttribute('operationMode',attributes);
    const specialMode = getAttribute('specialMode',attributes);
    const selfCleaningStatus = getAttribute('selfCleaningStatus',attributes);
    let temWritable = targetTemperatureObj.writable;
    let basicTemp = parseFloat(targetTemperatureObj.value);
    this.setState({PMV:false,Wind:false});

    if(operationModeObj.value === '0'){
      this.setState({PMV:true});
      // let calculateTemp = (this.state.temp -26)>0?('+'+(this.state.temp -26)):('-'+(26-this.state.temp));
      // basicTemp = basicTemp + 26;
      //判断是否有specialMode
      const care = config.baseFunctionArr.filter((item) => {
        if(!item.baseType){
          return null;
        }
        return item.name === 'specialMode';
      });
      if(care.length>0){
        this.setState({care:true});
        PMV='Care';
        temWritable =false;
        this.setState({writable:temWritable});
      }
    }
    this.setState({onOffStatus:onOffStatus,onlineStatus:isOnline,writable:temWritable});
    const disabled = onOffStatus && isOnline;
    if(!disabled || !temWritable ){
      aa = false;
      this.setState({temp:100});
    }
    if(selfCleaningStatus.value ==='true'){
      temNum = basicTemp;
    }
    if(operationModeObj.value === '2'&& typeid==='20086108008203240212fd22052be6000000ce57f0dc6699fd60c0984ab02440'){
      this.setState({Wind:true});
      temNum = '除湿';
    }
    if(operationModeObj.value === '6'){
      this.setState({Wind:true});
      temNum = '送风';
    }
    // if(baseConvas && config.basicColors && config.basicColors.othersColor && disabled){
    if(baseConvas && config.basicColors && config.basicColors.othersColor && disabled && temWritable){
      if(aa && this.state.temp === basicTemp){
        aa = false;
      }
      // console.log(this.state.temp,basicTemp);
      if(!aa && this.state.temp !== basicTemp){

        PMV = 'PMV';
        PMV = PMV + (Math.abs(basicTemp) === 0 ? '': (basicTemp>0?('+'+basicTemp):basicTemp));
        this.setState({temp:basicTemp});
        const calculateResult = this.calculateRad(basicTemp,targetTemperatureObj.valueRange,operationModeObj.value);
        this.drawTargetColor(calculateResult,document.getElementById('hideImg'),temWritable);
      }
    }
    // if(!disabled){
    if(!disabled ||!temWritable){
      this.cleanCanvas();
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('生命周期');
    const { config,attributes,onOffStatus,isOnline,alarmsList} = nextProps;
    const targetTemperatureObj = getAttribute('targetTemperature',attributes);
    const operationModeObj = getAttribute('operationMode',attributes);
    const specialMode = getAttribute('specialMode',attributes);
    const selfCleaningStatus = getAttribute('selfCleaningStatus',attributes);
    let temWritable = targetTemperatureObj.writable;
    let basicTemp = parseFloat(targetTemperatureObj.value);
    this.setState({PMV:false,Wind:false});
    if(operationModeObj.value === '0'){
      this.setState({PMV:true});
      // let calculateTemp = (this.state.temp -26)>0?('+'+(this.state.temp -26)):('-'+(26-this.state.temp));
      // basicTemp = basicTemp + 26;
      //判断是否有specialMode
      const care = config.baseFunctionArr.filter((item) => {
        if(!item.baseType){
          return null;
        }
        return item.name === 'specialMode';
      });
      if(care.length>0){
        this.setState({care:true});
        PMV='Care';
        temWritable =false;
        this.setState({writable:temWritable});
      }
    }
    this.setState({onOffStatus:onOffStatus,onlineStatus:isOnline,writable:temWritable});
    const disabled = onOffStatus && isOnline;
    if(!disabled || !temWritable ){
      aa = false;
      this.setState({temp:100});
    }
    if(selfCleaningStatus.value ==='true'){
      temNum = basicTemp;
    }
    if(operationModeObj.value === '2' && typeid==='20086108008203240212fd22052be6000000ce57f0dc6699fd60c0984ab02440'){
      this.setState({Wind:true});
      temNum = '除湿';
    }
    if(operationModeObj.value === '6'){
      this.setState({Wind:true});
      temNum = '送风';
    }
    // if(baseConvas && config.basicColors && config.basicColors.othersColor && disabled){
    if(baseConvas && config.basicColors && config.basicColors.othersColor && disabled && temWritable){
      if(aa && this.state.temp === basicTemp){
        aa = false;
      }
      // console.log(this.state.temp,basicTemp);
      if(!aa && this.state.temp !== basicTemp){

        PMV = 'PMV';
        PMV = PMV + (Math.abs(basicTemp) === 0 ? '': (basicTemp>0?('+'+basicTemp):basicTemp));
        this.setState({temp:basicTemp});
        const calculateResult = this.calculateRad(basicTemp,targetTemperatureObj.valueRange,operationModeObj.value);
        this.drawTargetColor(calculateResult,document.getElementById('hideImg'),temWritable);
      }
    }
    // if(!disabled){
    if(!disabled ||!temWritable){
      this.cleanCanvas();
    }
  }

  calculateRad(value,range,operationModeValue){
    let min = parseFloat(range.dataStep.minValue);
    let max = parseFloat(range.dataStep.maxValue);
    const step = parseFloat(range.dataStep.step);
    // if(operationModeValue === '0'){
    //   min = min + 26;
    //   max = max + 26;
    // }
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
  drawTargetColor(calculateResult,basicPoint,flag){
    this.cleanCanvas();
    let circle = baseConvas.getContext('2d');
    circle.lineWidth = 12;
    circle.strokeStyle = '#ffffff';
    circle.beginPath();//开始一个新的路径
    circle.lineCap='round';
    circle.arc(centerX, centerY, circleR, -0.5 * Math.PI, calculateResult.rad, false);///用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    circle.stroke();//对当前路径进行描边
    circle.closePath();
    if(flag){
      //页面或图像加载完成后执行
      // window.onload=function(){
      circle.drawImage(basicPoint,calculateResult.point.x-16,calculateResult.point.y-16,32,32);
      // };
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
    // if(this.state.onlineStatus && this.state.onOffStatus){
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
    // if(this.state.onlineStatus && this.state.onOffStatus && !touchCancel){
    if(this.state.onlineStatus && this.state.onOffStatus && this.state.writable && !touchCancel){
      let pointY = parseFloat(e.targetTouches[0].pageY) - offsetTop;
      let pointX = parseFloat(e.targetTouches[0].pageX) - offsetLeft;

      const operationModeObj = getAttribute('operationMode',this.props.attributes);
      const targetTemperatureObj = getAttribute('targetTemperature',this.props.attributes);
      let distanceToCenter = Math.sqrt(Math.pow(Math.abs(pointY - centerY),2) + Math.pow(Math.abs(pointX - centerX),2));
      // console.log(distanceToCenter,'11111111');
      if(distanceToCenter <= (circleR+10) && distanceToCenter >= (circleR-10)){
        let distanceToTop = Math.sqrt(Math.pow(Math.abs(pointY - topPointY),2) + Math.pow(Math.abs(pointX - topPointX),2));
        let cos = (Math.pow(distanceToCenter,2)+Math.pow(circleR,2)-Math.pow(distanceToTop,2))/(2*distanceToCenter*circleR);
        let rad = 0;
        if(pointX < centerX){//在左边
          rad = 2 * Math.PI - Math.acos(cos);
        }else{
          rad = Math.acos(cos);
        }

        touchTemp = Math.floor(rad/(2 * Math.PI)*(this.state.range) + this.state.min);
        touchTemp = touchTemp > this.state.max ? this.state.max:touchTemp;
        touchTemp = touchTemp < this.state.min ? this.state.min:touchTemp;
        // this.cleanCanvas();
        let calculateObj = this.calculatePoint(rad-0.5 * Math.PI);
        console.log(calculateObj.rad);
        if(calculateObj.rad > -1.55 && calculateObj.rad<4.65){
          // this.drawTargetColor(calculateObj,this.state.basicColor,document.getElementById('hideImg'),true);
          this.drawTargetColor(calculateObj,document.getElementById('hideImg'),this.state.writable);
          this.setState({temp:touchTemp});
          if(this.state.PMV){
            PMV = 'PMV';
            PMV = PMV + (Math.abs(touchTemp) === 0 ? '': (touchTemp>0?('+'+touchTemp):touchTemp));
          }
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
      aa=true;
    }
  }

  //mouseUp、touchEnd，色温调节完毕，下发命令
  touchEnd(e){
    console.log('end');
    // if(this.state.onlineStatus && this.state.onOffStatus){
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
          touchTemp = Math.floor(rad/(2 * Math.PI)*(this.state.range) + this.state.min);
          touchTemp = touchTemp > this.state.max ? this.state.max:touchTemp;
          touchTemp = touchTemp < this.state.min ? this.state.min:touchTemp;

          this.setState({temp:touchTemp});
          // PMV = PMV + (Math.abs(touchTemp) === 0 ? '': (touchTemp>0?('+'+touchTemp):touchTemp));
          // PMV = 'PMV';
          this.cleanCanvas();
          let calculateObj = this.calculatePoint(rad-0.5 * Math.PI);
          // if(!touchCancel){
          // this.drawTargetColor(calculateObj,this.state.basicColor,document.getElementById('hideImg'),true);
          this.drawTargetColor(calculateObj,document.getElementById('hideImg'),this.state.writable);
          // }
          if(this.state.PMV){
            PMV = 'PMV';
            PMV = PMV + (Math.abs(touchTemp) === 0 ? '': (touchTemp>0?('+'+touchTemp):touchTemp));
            this.props.calculate('targetTemperature',String(touchTemp));
          }else{
            this.props.calculate('targetTemperature',String(touchTemp));
          }

          // touchCancel = true;
        }
      }else if(touchtrue){
        if(this.state.PMV){
          this.props.calculate('targetTemperature',String(touchTemp));
        }else{
          this.props.calculate('targetTemperature',String(touchTemp));
        }
      }
      aa=true;
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
    // if(this.state.PMV){
    //   tempNow =tempNow -26;
    // }
    if(flag ===1 && tempNow === parseFloat(targetTemperatureObj.valueRange.dataStep.minValue)){
      Toast.info('当前已是最低温度', 1);
      return;
    }else if(flag ===2 && tempNow === parseFloat(targetTemperatureObj.valueRange.dataStep.maxValue)) {
      Toast.info('当前已是最高温度', 1);
      return;
    }
    if(this.state.PMV){
      // console.log('1');
      this.props.calculate('targetTemperature',String(afterValue));
    }else{
      // console.log('2');
      this.props.calculate('targetTemperature',String(afterValue));
    }
    // this.setState({temp:afterValue});
    aa = false;
  }
  // alarmCancel(){
  //   clickalarm = clickalarm+1;
  //   if(clickalarm ===10){
  //     // if(hidealarm){
  //     //   window.hidealarm =true;
  //     // }
  //     window.hidealarm = true;
  //     localStorage.setItem('hidealarm',true);
  //     clickalarm = 0;
  //   }
  // }

  render() {
    const { config,attributes,onOffStatus,isOnline,alarmsList} = this.props;
    const operationModeObj = getAttribute('operationMode',attributes);
    const specialModeObj = getAttribute('specialMode',attributes);
    const operationWritable = operationModeObj.writable;
    const disabled = this.state.onOffStatus && this.state.onlineStatus && alarmsList.length===0;
    let showColor = this.state.basicColor;
    let showShadowColor = this.state.basicShadowColor;
    // if(!disabled || (!this.state.writable &&!operationWritable)){
    //   showColor = '#969696';
    //   showShadowColor = '#E6EAF5';
    // }

    if(this.state.temp !==100){
      temNum = this.state.temp;
    }
    if(disabled){
      if(this.state.Wind){
        temText = '设定模式';

      }else if(this.state.PMV){
        temText = '设定模式';
      } else{
        temText = '设定温度';
      }
    }else{
      temText = '设备状态';
    }
    temicon =this.state.Wind || !this.state.writable ||(this.state.PMV&&this.state.care);
    // temicon =this.state.Wind ||(this.state.PMV&&this.state.care);
    return (
      <div className="targetTempNew" style={{background:disabled?'#2283E2':'#CCCCCC'}}>
        <div className="targetTempDivNew" id="targetTempDiv">
          <canvas id="canvas" width={canvasWidth} height={canvasWidth}
            onTouchStart={this.touchStart}
            onTouchMove={this.touchMove}
            onTouchEnd={this.touchEnd}
            data-uplus-id="0005"
            data-uplus-action-name="温度条"
            data-uplus-page-name="空调详情页"
            data-uplus-category-id="设备详情页-空调-基本功能"></canvas>
          <img id="hideImg" className="hideImg" src={require('../style/imageNew/button_temp_cool.png')}/>
          <div className="targetControlNew">
            <div >{temText}</div>
            <div style={{display:disabled?'block':'none'}}>
              <img style={{visibility:temicon?'hidden':'visible'}} id="leftImg" src={require('../style/imageNew/icon_temp_reduse_cool.png')} onClick={(e)=>{this.clickEvent(1);}} data-uplus-id="0003" data-uplus-action-name="温度‘-’" data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调-基本功能"/>
              <div className="targetTempSpanNew">
                <span style={{fontSize:this.state.PMV?'30px':''}}>{this.state.PMV?PMV:temNum}</span>
                <span style={{fontSize:'14px',display:(this.state.PMV || this.state.Wind)?'none':'inline-block',position:'absolute',marginTop:'8px'}} > ℃</span>
              </div>
              <img style={{visibility:temicon?'hidden':'visible'}} id="rightImg" src={require('../style/imageNew/icon_temp_increase_cool.png')} onClick={(e)=>{this.clickEvent(2);}} data-uplus-id="0004" data-uplus-action-name="温度‘+’" data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调-基本功能"/>
            </div>
            <div className="offStatusNew" style={{display:disabled?'none':'block'}}>
              {this.state.onlineStatus?(this.state.onOffStatus?(alarmsList.length>0?'设备故障':''):'关机'):'离线'}
            </div>
          </div>
          <div className="boxShadowNew" >
          </div>
        </div>
      </div>
    );
  }
}


