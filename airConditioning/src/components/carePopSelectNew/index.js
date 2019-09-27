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
    const { name,text,config,isOnline,value,disabled,iconImg,operationModeValue,basicColor,basicIconColor,calculate} = nextProps;
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
    const { name,text,config,isOnline,value,disabled,iconImg,operationModeValue,basicColor,basicIconColor,calculate} = this.props;
    let chooseArr =[];
    let showText = text;
    let showImg = iconImg;
    let showIconColor = basicIconColor;
    let showColor = basicColor;
    if(config &&operationModeValue==='0'){
      chooseArr = config.filter((item)=>{
        return item.value === value;
      });
      if(chooseArr.length){
        showText=chooseArr[0].text;
        showImg=chooseArr[0].valueIconNew;
      }
    }
    //功能不可点击时
    if(!disabled || operationModeValue!=='0'){
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
              <div style={{backgroundColor:item.value === value?basicColor:'#DDDDDD'}} className="itemImgDivNew"><img className="itemImgNew" src={item.valueIconNew}></img></div>
              <p style={{fontSize:'14px',textAlign:'center',color:basicColor}}>{item.text}</p>
            </Item>);
          })}
        >
          <div className="popNew">
            <div className="containerNew" >
              <div className="containerNew-img" style={{backgroundColor:showIconColor}}>
                <img src={showImg}></img>
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


