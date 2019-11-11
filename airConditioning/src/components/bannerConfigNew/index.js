import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import {BannerItem} from '../../components';

export default class BannerConfigNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topHeight: false
    };
  }
  handleClick() {
    this.setState({
      topHeight: !this.state.topHeight
    });
  }
  getBaseFunctionalComponent(baseFunctionArr) {
    const result = [];
    const self = this;
    if (!baseFunctionArr) {
      return result;
    }
    let countNumber = 0;
    let cacheArr = [];
    let addBefore = false;
    for (let i = 0; i < baseFunctionArr.length; i++) {
      const item = baseFunctionArr[i];
      // 如果不支持这个属性则直接下一轮
      if (!self.getTypeComponent(item)) {
        continue;
      }
      if (addBefore) {
        addBefore = false;
        item.addBefore = true;
      }
      cacheArr.push(item);
    }
    if (cacheArr.length > 0) {
      result.push(cacheArr.map((arr, index) => self.getColComponent(arr, index,cacheArr.length)));
      cacheArr = [];
    }
    return result;
  }
  getColComponent(item, index,length) {
    const self = this;
    return (
      <div
        key={item.name || (item.baseType + index)}
        style={{width:(100/length+'%'),float:'left',textAlign:'center'}}
        className={`upcore-col col-${item.colWidth} ${item.addBefore ? 'show-before' : ''}`}
      >
        {self.getTypeComponent(item)}
      </div>
    );
  }
  getTypeComponent(item) {
    if (!this.props.attributes || !this.props.attributes.length) {
      return null;
    }
    const attribute = this.props.attributes.filter((attr) => attr.name === item.name);
    if (!attribute || attribute.length < 1 || !attribute[0].value || attribute[0].value === '-/-' || attribute[0].value === '0'|| attribute[0].value === '0.00') {
      return null;
    }
    if(item.name === 'indoorHumidity'&& attribute[0].value === '100'){
      return null;
    }
    if (item.baseType === 'BannerItem') {
      return this.getBannerItemComponent({
        ...attribute[0],
        ...item,
      });
    }
    return null;
  }
  getBannerItemComponent(attribute) {
    return (
      <BannerItem
        value={attribute.value}
        name={attribute.text}
        unit={attribute.unit}/>

    );
  }

  render() {
    const { prefixCls, bannerList, attributes, isOnline,alarmsList,history } = this.props;
    const bannerArr = bannerList || [];
    let comboNormal = require('../style/image/combo_indoordata_normal.png');
    if(this.state.topHeight){
      comboNormal = require('../style/image/combo_indoordata_click.png');
    }

    let styleObj ={
      height: this.state.topHeight ? '84px' : '0px',
      padding: this.state.topHeight ? '6px 20px 0px' : '0px 20px'
    };
    let alarms = alarmsList;
    let alarmArray = [];
    let arr = [];
    for (let i = 0; i < alarms.length; i++) {
      if(alarmArray.indexOf(alarms[i].desc) === -1){
        alarmArray.push(alarms[i].desc);
      }
    }
    return (
      <div className={classnames(`${prefixCls}`)}>
        <div className={classnames(`${prefixCls}-top`,{[`${prefixCls}-online`]: isOnline, [`${prefixCls}-offline`]: !isOnline })} style={styleObj}>
          <div className={classnames(`${prefixCls}-title`)}>室内数据</div>
          <div className={classnames(`${prefixCls}-detail`)}>
            {this.getBaseFunctionalComponent(bannerArr)}
            {/*<BannerItem attributes={attributes} desc={'indoorTemperature'}/>*/}
          </div>
        </div>
        <div className={classnames(`${prefixCls}-bottom`)}>
          <img alt="" className={classnames(`${prefixCls}-bottom-img`,{[`${prefixCls}-offline`]: !isOnline })} src={comboNormal} onClick={() => this.handleClick()}/>
        </div>
        <div className={classnames(`${prefixCls}-alarms`,{[`${prefixCls}-offline`]: !isOnline })}>
          {alarmArray.map((item,index)=>{
            return (
              <div onClick={()=>{
                this.props.history.push('/detection');
              }} key={index}>
                <img src={require('../style/image/icon_prompt.png')}/>
                <span>{item}</span>
              </div>

            );
          })}
        </div>
      </div>
    );
  }
}
BannerConfigNew.defaultProps = {
  prefixCls: 'upcore-bannernew',
  bannerList: [],
  attributes: []
};

