import classnames from 'classnames';
import {Popover} from 'antd-mobile';
import React from 'react';
import { getAttribute } from '../../util/tool';
import './style/index.less';

const Item = Popover.Item;

export default class PopSelectNew extends React.Component {
  constructor(props){
    super(props);
    this.state={
      visible:false
    };
  }
  componentWillReceiveProps(nextProps){
    const { name,text,outlineText,config,isOnline,value,disabled,iconImg,outlineIcon,basicColor,basicIconColor,calculate} = nextProps;
    if(!disabled || !isOnline){
      this.setState({visible:false});
    }

  }
  // shouldComponentUpdate(nextProps, nextState){
  //   if(this.state.visible){
  //     return false;
  //   }
  //   return true;
  // }
  // componentDidUpdate(){
  //   let containerWidth = document.getElementsByClassName('am-popover-content');

  //   if(containerWidth.length>0){
  //     window.setTimeout(function(){
  //       containerWidth = containerWidth[0].offsetWidth;
  //       let left = (window.screen.width - containerWidth)/2;
  //       document.getElementsByClassName('am-popover Popover am-popover-placement-bottomRight')[0].style.left = left +'px';
  //     },20);
  //   }
  // }
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
  // popupAlign(popupDomNode,align){
  //   console.log('2');
  //   let containerWidth = document.getElementsByClassName('am-popover-content')[0].offsetWidth;
  //   let left = (window.screen.width - containerWidth)/2;
  //   document.getElementsByClassName('am-popover Popover am-popover-placement-bottom')[0].style.left = left +'px';
  // }

  select(opt,name){
    console.log(opt);
    this.props.calculate(name,opt.key);
    this.setState({
      visible: false,
    });
  }
  render() {
    const { name,text,outlineText,config,isOnline,value,disabled,iconImg,outlineIcon,basicColor,basicIconColor,calculate} = this.props;
    let chooseArr =[];
    let showText = text;
    let showImg = iconImg;
    let showIconColor = basicIconColor;
    let showColor = basicColor;
    if(outlineText &&!isOnline){
      showText = outlineText;
      showImg=outlineIcon;
    }
    let ispmv = false;
    if(name ==='operationMode' && (value==='0'|| value==='-/-')){
      ispmv = true;
    }
    if(config){
      chooseArr = config.filter((item)=>{
        return item.value === value;
      });
      if(chooseArr.length>0){
        showText=chooseArr[0].text;
        showImg=chooseArr[0].valueIconNew;
      }
    }
    //功能不可点击时
    if(!disabled){
      showIconColor = '#DDDDDD';
      showColor = '#CCCCCC';
    }
    let itemStyle={
      float:'left',
      width:((100/config.length<20) ? 20 :100/config.length)+'%',
      padding:'0px'
    };
    return (
      <div ref={this.divRev} style={{position:'relative'}}>

        <Popover mask
          visible={this.state.visible}
          disabled={disabled}
          placement="bottom"
          overlayClassName="Popover"
          onSelect={(opt)=>{this.select(opt,name);}}
          onVisibleChange={(visible)=>{this.visibleChange(visible);}}
          // onPopupAlign={(popupDomNode,align)=>{this.popupAlign(popupDomNode,align);}}
          overlay={config.map((item,index)=>{

            return (<Item key={item.value} style={itemStyle} data-uplus-id={item.uplusid} data-uplus-action-name={text+'-'+item.text} data-uplus-page-name="空调详情页" data-uplus-category-id="设备详情页-空调-基本功能">
              <div style={{backgroundColor:item.value === value?basicColor:'#DDDDDD'}} className="itemImgDivNew">
                <img className="itemImgNew" src={item.valueIconNew}></img>
              </div>
              <p style={{fontSize:'14px',textAlign:'center',color:basicColor}}>{item.text}</p>
            </Item>);
          })}
        >
          <div className="popNew">
            <div className="containerNew" >
              <div className="containerNew-img" style={{backgroundColor:showIconColor,width:ispmv?'32px':'30px',height:ispmv?'26px':'30px',marginTop:ispmv?'9px':'8px'}}>
                <img src={showImg} style={{width:ispmv?'34px':'32px',height:ispmv?'28px':'32px',top:ispmv?'-2px':'-1px'}}></img>
              </div>
            </div>
            <p className="containerpNew" style={{color:showColor,width:'60px',marginLeft:'-6px'}}>{showText}</p>
          </div>
        </Popover>
        <div className="disabledDivNew" style={{display:disabled?'none':'block'}}></div>
      </div>

    );
  }
}


