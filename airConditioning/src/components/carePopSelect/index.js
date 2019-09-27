import classnames from 'classnames';
import {Popover} from 'antd-mobile';
import React from 'react';
import { getAttribute } from '../../util/tool';
import './style/index.less';

const Item = Popover.Item;

export default class CarePopSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state={
      visible:false
    };
  }
  componentWillReceiveProps(nextProps){
    const { name,text,config,isOnline,value,disabled,iconImg,operationModeValue,basicColor,basicIconColor,basicShadowColor,normalColor,calculate} = nextProps;
    if(!disabled || !isOnline){
      this.setState({visible:false});
    }

  }

  divRev = React.createRef();
  visibleChange(visible){
    if (visible) {
      // 调整am-popover-arrow的位置
      window.setTimeout(() => {
        const arrowDivList = document.querySelectorAll('.am-popover-arrow');
        let arrowDiv = null;
        for (let i = 0; i < arrowDivList.length; i++) {
          if (arrowDivList[i] && arrowDivList[i].scrollWidth) {
            arrowDiv = arrowDivList[i];
            break;
          }
        }
        if (arrowDiv && arrowDiv.style && this.divRev && this.divRev.current) {
          arrowDiv.style.left = `${this.divRev.current.offsetLeft + (this.divRev.current.clientWidth / 2) - 16}px`;
        }
      }, 20);
    }
    this.setState({visible:visible});
  }
  select(opt,name){
    console.log(opt);
    this.props.calculate(name,opt.key);
    this.setState({
      visible: false,
    });
  }
  render() {
    const { name,text,config,isOnline,value,disabled,iconImg,operationModeValue,basicColor,basicIconColor,basicShadowColor,normalColor,calculate} = this.props;
    let chooseArr =[];
    let showText = text;
    let showImg = iconImg;
    let showShadowColor = basicShadowColor;
    let disabledColor = normalColor;
    let basicIconColor1 = basicIconColor;
    let basicColor1 = basicColor;
    if(config &&operationModeValue==='0'){
      chooseArr = config.filter((item)=>{
        return item.value === value;
      });
      if(chooseArr.length){
        showText=chooseArr[0].text;
        showImg=chooseArr[0].valueIcon;
      }
    }
    //功能不可点击时
    if(!disabled){
      basicIconColor1 = '#C8C8C8';
      basicColor1 = '#C8C8C8';
    }
    let itemStyle={
      float:'left',
      width:((100/config.length<20) ? 20 :100/config.length)+'%',
      padding:'0px'
    };
    return (
      <div className="container" style={{backgroundColor:basicIconColor1,boxShadow: `0px 3px 4px ${showShadowColor}`,opacity:(operationModeValue==='0' ||!disabled)?'1':'0.5'}} ref={this.divRev}>
        <Popover mask
          visible={this.state.visible}
          disabled={disabled}
          placement="bottom"
          overlayClassName="Popover"
          onSelect={(opt)=>{this.select(opt,name);}}
          onVisibleChange={(visible)=>{this.visibleChange(visible);}}
          // onPopupAlign={(popupDomNode,align)=>{this.popupAlign(popupDomNode,align);}}
          overlay={config.map((item,index)=>{

            return (<Item key={item.value} style={itemStyle}>
              <div style={{backgroundColor:item.value === value?basicColor:disabledColor}} className="itemImgDiv"><img className="itemImg" src={item.valueIcon}></img></div>
              <p style={{fontSize:'12px',textAlign:'center',color:item.value === value?basicColor:disabledColor}}>{item.text}</p>
            </Item>);
          })}
        >
          <div>
            <img src={showImg}></img>
            <p style={{color:basicColor1,width:'60px',marginLeft:'-6px'}}>{showText}</p>
          </div>
        </Popover>
        <div className="disabledDiv" style={{display:disabled?'none':'block'}}></div>
      </div>   
      
    );
  }
}


