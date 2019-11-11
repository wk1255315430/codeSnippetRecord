import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { IconSwitch,PopSelect,OnoffSwitch,FlipSwitch,CarePopSelect } from '../index';
import { getAttribute,getGlobalHeaders,getHttp,getUserInfo } from '../../util/tool';
import {Toast} from 'antd-mobile';
let additionalArr = [];
export default class DeviceControl extends React.Component {
  constructor(props){
    super(props);
    this.state={
      basicColor:'#37C5BB',
      basicIconColor:'#37C5BB',
      basicShadowColor:'#DCF1EF',
      normalColor:'#9BE2DD',
      otherImg :require('../../assets/image/editor_other.png'),
      additionalFlag:false,
      additionalArr:[]
    };
    this.getComponents = this.getComponents.bind(this);
    this.getComponentsAddition = this.getComponentsAddition.bind(this);
    this.getOnoffSwitch = this.getOnoffSwitch.bind(this);
    this.getIconSwitch = this.getIconSwitch.bind(this);
    this.getPopSelect = this.getPopSelect.bind(this);
    this.getCarePopSelect = this.getCarePopSelect.bind(this);
    this.getFlipSwitch = this.getFlipSwitch.bind(this);
    this.changeAddition = this.changeAddition.bind(this);
    this.otherEdit = this.otherEdit.bind(this);
    this.selectSubjoin = this.selectSubjoin.bind(this);
    this.insertSubjoin = this.insertSubjoin.bind(this);
  }

  componentDidMount(){
    // console.log(nextProps);
    const { config ,onOffStatus,isOnline,attributes} = this.props;
    if(config.basicColors && config.basicColors.othersColor){
      const operationModeObj = getAttribute('operationMode',attributes);
      const ColorArr = config.basicColors.modes.filter((item) => {
        return item.modeValue === operationModeObj.value;
      });
      let getBasicColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      let getbasicIconColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      let getBasicShadowColor = ColorArr.length === 0 ? config.basicColors.othersColor.shadowColor : ColorArr[0].shadowColor;
      let getNormalColor = ColorArr.length === 0 ? config.basicColors.othersColor.normalColor : ColorArr[0].normalColor;
      let getEditImg = ColorArr.length === 0 ? config.basicColors.othersColor.editImg : ColorArr[0].editImg;
      if(!(onOffStatus && isOnline)){
        getBasicColor='#C8C8C8';
        getbasicIconColor ='#C8C8C8';
        getBasicShadowColor='#E6EAF5';
        this.setState({additionalFlag:false});//附加功能隐藏
      }
      this.setState({basicColor:getBasicColor,basicIconColor:getbasicIconColor,basicShadowColor:getBasicShadowColor,normalColor:getNormalColor,otherImg:getEditImg});
    }
    this.selectSubjoin();
  }
  componentWillReceiveProps(nextProps){
    // console.log(nextProps);
    const { config ,onOffStatus,isOnline,attributes} = nextProps;
    if(config.basicColors && config.basicColors.othersColor){
      const operationModeObj = getAttribute('operationMode',attributes);
      const ColorArr = config.basicColors.modes.filter((item) => {
        return item.modeValue === operationModeObj.value;
      });
      let getBasicColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      let getbasicIconColor = ColorArr.length === 0 ? config.basicColors.othersColor.color : ColorArr[0].color;
      let getBasicShadowColor = ColorArr.length === 0 ? config.basicColors.othersColor.shadowColor : ColorArr[0].shadowColor;
      let getNormalColor = ColorArr.length === 0 ? config.basicColors.othersColor.normalColor : ColorArr[0].normalColor;
      let getEditImg = ColorArr.length === 0 ? config.basicColors.othersColor.editImg : ColorArr[0].editImg;
      if(!(onOffStatus && isOnline)){
        getBasicColor='#C8C8C8';
        getbasicIconColor ='#C8C8C8';
        getBasicShadowColor='#E6EAF5';
        this.setState({additionalFlag:false});//附加功能隐藏
      }
      this.setState({basicColor:getBasicColor,basicIconColor:getbasicIconColor,basicShadowColor:getBasicShadowColor,normalColor:getNormalColor,otherImg:getEditImg});
    }
    // console.log(this.state.additionalArr.length,'231111111111111111');
    // if(this.state.additionalArr.length === 0){
    // }

  }

  async selectSubjoin(){
    const self = this;
    //获取配置里的附加功能
    const { prefixCls, attributes,onOffStatus,isOnline,config,history} = this.props;


    //获取数据库里的附加功能列表
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/function/selectSubjoin';
    let curveData = '';
    const additionalList = [];
    const userInfo = await getUserInfo();
    const data = {
      'mac': devicemac,
      'userId':userInfo.retData?userInfo.retData.userId : ''
    };
    let globalHeaders = await getGlobalHeaders(data);
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      const resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }

      if (curveData.retCode === '0000') {
        //去重
        var arr =curveData.funSeqinfoList;
        var result = [];
        var obj = {};
        for(var l =0; l<arr.length; l++){
          if(!obj[arr[l].functionCode]){
            result.push(arr[l]);
            obj[arr[l].functionCode] = true;
          }
        }
        arr =result;
        //去重结束
        for(let i=0;i<arr.length;i++){
          for(let j=0;j<additionalArr.length;j++){
            if(arr[i].functionCode === additionalArr[j].name){
              additionalList.push(additionalArr[j]);
            }
          }
        }

        if (curveData.funSeqinfoList && curveData.funSeqinfoList.length === 0) {
          self.setState({
            'additionalArr': additionalArr
          });
          this.insertSubjoin();
        } else if(additionalArr.length !== 0 && arr.length !== additionalArr.length) { // 如果增加了功能,需要重新传顺序
          let list=[];
          list = additionalArr.filter((item)=>{

            const attribute = arr.filter((attr) => attr.functionCode === item.name);
            if(attribute.length >= 1){
              return null;
            }

            return item;
          });
          self.setState({
            'additionalArr': additionalList.concat(list)
          });
          this.insertSubjoin();

        }else {
          self.setState({
            'additionalArr': additionalList
          });
        }

      } else{
        // Toast.fail('获取附加功能排序失败!', 2);
        self.setState({
          'additionalArr': additionalArr
        });
      }
    }, (err) => {
      console.log(err);
      self.setState({
        'additionalArr': additionalArr
      });
      // Toast.fail('获取附加功能排序失败!', 2);
    });

  }
  async insertSubjoin(){
    let funSeqinfoList =[];
    for(let i=0;i<this.state.additionalArr.length;i++){
      funSeqinfoList.push({
        'functionName': this.state.additionalArr[i].text,
        'functionCode': this.state.additionalArr[i].name,
        'customizationFlag': 1,
        'functionRank': i+1
      });
    }
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/function/insertSubjoin';
    const userInfo = await getUserInfo();
    const data = {
      'mac': devicemac,
      'userId':userInfo.retData?userInfo.retData.userId : '',
      'productType':model,
      'funSeqinfoList':funSeqinfoList
    };
    let globalHeaders = await getGlobalHeaders(data);
    const http = await getHttp();
    http.post(recUrl, data, globalHeaders, (resp) => {
      // console.log(resp,'22222222222222');

    }, (err) => {
      console.log(err);
      // Toast.fail('获取附加功能排序失败!', 2);
    });
  }

  getComponents(obj){
    let self =this;
    if(obj.baseType === 'OnoffSwitch'){
      return (self.getOnoffSwitch(obj,true));
    }else if(obj.baseType === 'PopupSelect'){
      return (self.getPopSelect(obj,true));
    }else if(obj.baseType === 'CarePopupSelect'){
      return (self.getCarePopSelect(obj,true));
    }
    return null;  
  }
  getComponentsAddition(obj){
    let self =this;
    if(obj.baseType === 'IconSwitch'){
      return (self.getIconSwitch(obj,false));
    }else if(obj.baseType === 'PopupSelect'){
      return (self.getPopSelect(obj,false));
    }else if(obj.baseType === 'FlipSwitch'){
      return (self.getFlipSwitch(obj,false));
    }else if(obj.baseType === 'CarePopupSelect'){
      return (self.getCarePopSelect(obj,true));
    }
    return null;  
  }
  getOnoffSwitch(obj,flag){
    const { attributes,onOffStatus,isOnline,config,calculate} = this.props;
    let iconObj = getAttribute(obj.name,attributes);
    return (
      <OnoffSwitch
        flag={flag}
        name={obj.name}
        value={iconObj.value}
        config={iconObj}
        isOnline={isOnline}
        text={obj.text}
        disabled={iconObj.writable}
        activeValue={obj.activeValues}
        basicColor={this.state.basicColor}
        basicIconColor ={this.state.basicIconColor}
        basicShadowColor={this.state.basicShadowColor}
        iconImg={obj.icon}
        calculate={(name,value)=>{this.props.calculate(name,value);}}
      >
      </OnoffSwitch>
    );
  }
  getIconSwitch(obj,flag){
    const { attributes,onOffStatus,isOnline,config,calculate} = this.props;
    let iconObj = getAttribute(obj.name,attributes);
    return (
      <IconSwitch 
        flag={flag}
        name={obj.name}
        value={iconObj.value}
        config={iconObj}
        isOnline={isOnline}
        text={obj.text}
        disabled={iconObj.writable}
        activeValue={obj.activeValues}
        basicColor={this.state.basicColor}
        basicShadowColor={this.state.basicShadowColor}
        iconImg={obj.icon}
        iconOffImg={obj.iconoff}
        calculate={(name,value)=>{this.props.calculate(name,value);}}
      >
      </IconSwitch>
    ); 
  }
  getFlipSwitch(obj,flag){
    const { attributes,onOffStatus,isOnline,config,calculate} = this.props;
    let iconObj = getAttribute(obj.name,attributes);
    return (
      <FlipSwitch
        flag={flag}
        name={obj.name}
        value={iconObj.value}
        config={iconObj}
        isOnline={isOnline}
        text={obj.text}
        disabled={iconObj.writable}
        offValue={obj.offValues}
        activeValue={obj.activeValues}
        basicColor={this.state.basicColor}
        basicShadowColor={this.state.basicShadowColor}
        iconImg={obj.icon}
        iconOffImg={obj.iconoff}
        calculate={(name,value)=>{this.props.calculate(name,value);}}
      >
      </FlipSwitch>
    );
  }
  getPopSelect(confiObj){
    const { attributes,onOffStatus,isOnline,config,calculate} = this.props;
    let attrObj = getAttribute(confiObj.name,attributes);
    const operationMode = getAttribute('operationMode',attributes);
    const valuesList = [];
    // 按照UI配置文件里面的顺序
    for (let i = 0; i < confiObj.valuesConfig.length; i++) {
      const item = confiObj.valuesConfig[i];
      if (!item || !attrObj.valueRange || !attrObj.valueRange.dataList || !attrObj.valueRange.dataList.slice()) {
        continue;
      }
      for (let j = 0; j < attrObj.valueRange.dataList.slice().length; j++) {
        const element = attrObj.valueRange.dataList.slice()[j];
        if (item && String(item.value) === String(element.data)) {
          valuesList.push(item);
          break;
        }
      }
    }
    if(operationMode.value === '6'&&(confiObj.name ==='windSpeed' || confiObj.name ==='windSpeedL' || confiObj.name ==='windSpeedR')){
      for(let k in valuesList){
        if(valuesList[k].value === '5'){
          valuesList.splice(k, 1);
        }
      }
    }
    return (
      <PopSelect
        name={confiObj.name}
        text={confiObj.text}
        outlineText={confiObj.outlineText}
        config={valuesList}
        isOnline={isOnline}
        value={attrObj.value}
        disabled={attrObj.writable}
        iconImg={confiObj.icon}
        outlineIcon={confiObj.outlineIcon}
        iconOffImg={confiObj.iconoff}
        basicColor={this.state.basicColor}
        basicIconColor ={this.state.basicIconColor}
        basicShadowColor={this.state.basicShadowColor}
        normalColor={this.state.normalColor}
        calculate={(name,value)=>{this.props.calculate(name,value);}}
      ></PopSelect>
    );  
  }
  getCarePopSelect(confiObj){
    const { attributes,onOffStatus,isOnline,config,calculate} = this.props;
    let attrObj = getAttribute(confiObj.name,attributes);
    const operationMode = getAttribute('operationMode',attributes);
    const valuesList = [];
    // 按照UI配置文件里面的顺序
    for (let i = 0; i < confiObj.valuesConfig.length; i++) {
      const item = confiObj.valuesConfig[i];
      if (!item || !attrObj.valueRange || !attrObj.valueRange.dataList || !attrObj.valueRange.dataList.slice()) {
        continue;
      }
      for (let j = 0; j < attrObj.valueRange.dataList.slice().length; j++) {
        const element = attrObj.valueRange.dataList.slice()[j];
        if (item && String(item.value) === String(element.data)) {
          valuesList.push(item);
          break;
        }
      }
    }
    // if(operationMode.value === '6'&&(confiObj.name ==='windSpeed' || confiObj.name ==='windSpeedL' || confiObj.name ==='windSpeedR')){
    //   for(let k in valuesList){
    //     if(valuesList[k].value === '5'){
    //       valuesList.splice(k, 1);
    //     }
    //   }
    // }
    return (
      <CarePopSelect
        name={confiObj.name}
        text={confiObj.text}
        config={valuesList}
        isOnline={isOnline}
        value={attrObj.value}
        disabled={attrObj.writable}
        iconImg={confiObj.icon}
        operationModeValue={operationMode.value}
        basicColor={this.state.basicColor}
        basicIconColor ={this.state.basicIconColor}
        basicShadowColor={this.state.basicShadowColor}
        normalColor={this.state.normalColor}
        calculate={(name,value)=>{this.props.calculate(name,value);}}
      ></CarePopSelect>
    );
  }

  changeAddition(){
    const { onOffStatus,isOnline} = this.props;
    if(onOffStatus && isOnline){
      this.setState({additionalFlag:!this.state.additionalFlag});
    }
  }
  otherEdit() {
    const {prefixCls, attributes,onOffStatus,isOnline,config,history} = this.props;
    this.props.history.push('/funEditor');
  }

  render() {
    const { prefixCls, attributes,onOffStatus,isOnline,config,history} = this.props;
    let self =this;
    let showFuncArr=[];
    // let additionalArr=[];
    if(config && config.baseFunctionArr){
      showFuncArr = config.baseFunctionArr.filter((item)=>{
        //判断配置文件是否存在某功能
        if (!this.props.attributes || !this.props.attributes.length) {
          return null;
        }
        const attribute = this.props.attributes.filter((attr) => attr.name === item.name);
        if(!attribute || attribute.length < 1){
          return null;
        }
        if(!item.baseType){ //占位的没有baseType的不展示
          return null;
        }
        return item.show === true;
      });  
    }

    if(config && config.baseFunctionArr){
      additionalArr = config.baseFunctionArr.filter((item)=>{
        if (!this.props.attributes || !this.props.attributes.length) {
          return null;
        }
        const attribute = this.props.attributes.filter((attr) => attr.name === item.name);
        if(!attribute || attribute.length < 1){
          return null;
        }
        if(!item.baseType){
          return null;
        }
        return item.show === false;
      });
    }
    if(this.state.additionalArr.length === 0){
      this.selectSubjoin();
    }
    // if(config && config.baseFunctionArr){
    //   additionalArr = config.baseFunctionArr.filter((item)=>{
    //     if (!this.props.attributes || !this.props.attributes.length) {
    //       return null;
    //     }
    //     const attribute = this.props.attributes.filter((attr) => attr.name === item.name);
    //     if(!attribute || attribute.length < 1){
    //       return null;
    //     }
    //     if(!item.baseType){
    //       return null;
    //     }
    //     return item.show === false;
    //   });
    // }
    return (
      <div>
        <div className={classnames(`${prefixCls}`)}>
          <div className={classnames(`${prefixCls}-basic`)}>
            {showFuncArr.length>0 && showFuncArr.map((item,index)=>{
              return (
                <div key={index} style={{width:(100/showFuncArr.length+'%')}} className={classnames(`${prefixCls}-basic-item`)}>
                  {self.getComponents(item)}
                </div>);
            })}
            <div style={{clear:'both'}}></div>
          </div>
          <div className={classnames(`${prefixCls}-icon`)} style={{backgroundColor:this.state.basicIconColor}} onClick={this.changeAddition}>
            <img className={this.state.additionalFlag?'roate':''} src={require('../../assets/image/arrow.png')}/>
          </div>
        </div>
        <div className={classnames(`${prefixCls}-additional`)} style={{display:this.state.additionalFlag?'block':'none'}}>
          {this.state.additionalArr.length>0 && this.state.additionalArr.map((item,index)=>{
            return (
              <div key={index} style={{width:'20%',float:'left',height:'75px'}} className={classnames(`${prefixCls}-basic-item`)}>
                {self.getComponentsAddition(item)}
              </div>);
          })}
          <div style={{width:'20%',float:'left',height:'75px'}} className={classnames(`${prefixCls}-basic-item`)}>
            <div onClick={this.otherEdit}>
              <div className="editorIcon" style={{boxShadow: `0px 3px 4px ${this.state.basicShadowColor}`}}>
                <img src={this.state.otherImg}></img>
              </div>
              <p className={classnames('container-p')} style={{color:'#969696'}}>功能编辑</p>
            </div>
          </div>
          <div style={{clear:'both'}}></div>
        </div>
      </div>
    );
  }
}
DeviceControl.defaultProps = {
  prefixCls: 'device-control',
  attributes: []
};

