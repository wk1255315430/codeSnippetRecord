import classnames from 'classnames';
import React from 'react';
import {inject, observer} from 'mobx-react';
import { getAttribute,getGlobalHeaders,getUrlParams,getHttp,getUserInfo } from '../../util/tool';
import { Toast } from 'antd-mobile';
import './style/index.less';
import { List, arrayMove } from 'react-movable';
let isready = false;
@observer
export default class FunEditorItemNew extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      items: [],
      editState:false,
      display:true
    };
    this.gotoIndex = this.gotoIndex.bind(this);
    this.seniorEdit = this.seniorEdit.bind(this);
    this.selectSubjoin = this.selectSubjoin.bind(this);
    this.insertSubjoin = this.insertSubjoin.bind(this);

  }
  gotoIndex() {
    history.go(-1);
  }
  async seniorEdit() {
    this.setState({editState:!this.state.editState});
    if(this.state.editState){
      this.insertSubjoin();
    }
  }
  componentDidMount(){
    isready=false;
    const { additionalArr,getBasicColor,getBasicShadowColor} = this.props;
    if(this.state.items.length===0){
      this.selectSubjoin();
    }
  }
  componentWillReceiveProps(nextProps){
    const { additionalArr,getBasicColor,getBasicShadowColor,config,attributes} = nextProps;
    if(this.state.items.length===0){
      this.selectSubjoin();
    }
    // if(this.state.items.length===0){
    //只有第一次获取到数组才会重新给items赋值,其他情况都是移动后items变化
    // if(!isready){
    // this.setState({
    //   items:additionalArr
    // });
    // }
    // isready = true;
    // }
    // if(!editState){
    //   this.selectSubjoin();
    // }

  }
  async selectSubjoin(){

    const self = this;
    //获取配置里的附加功能
    const { getBasicColor,getBasicShadowColor,config,attributes} = this.props;
    let additionalArr = [];
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
        if(curveData.funSeqinfoList && curveData.funSeqinfoList.length === 0){
          self.setState({
            'items': additionalArr
          });
        }else{
          self.setState({
            'items': additionalList
          });
        }
      }else{
        // Toast.fail('获取附加功能排序失败!', 2);
        self.setState({
          'items': additionalArr
        });
      }
    }, (err) => {
      console.log(err);
      self.setState({
        'items': additionalArr,
        display:false
      });
      // Toast.fail('获取附加功能排序失败!', 2);
    });
  }
  async insertSubjoin(){
    let funSeqinfoList =[];
    for(let i=0;i<this.state.items.length;i++){
      funSeqinfoList.push({
        'functionName': this.state.items[i].text,
        'functionCode': this.state.items[i].name,
        'customizationFlag': 1,
        'functionRank': i+1
      });
    }
    const recUrl = 'https://uhome.haier.net:7263/uhome/acbiz/function/insertSubjoin';
    let curveData = '';
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
      const resptype = typeof(resp.data);
      if (resptype === 'string') {
        curveData = JSON.parse(resp.data);
      } else {
        curveData = resp.data;
      }
      console.log(curveData);
      if (curveData.retCode === '0000') {
        // Toast.info(curveData.retInfo);
      }else{
        Toast.info(curveData.retInfo);
      }
    }, (err) => {
      // Toast.info('服务器开小差了');
      console.log(err);
    });
  }
  render() {
    const self = this;
    const { prefixCls,additionalArr,getBasicColor,getBasicShadowColor} = this.props;
    // let isedit = editState;
    return (
      <div>
        <div className="upcore-navbar">
          <span className="upcore-navbar-icon-left" onClick={this.gotoIndex}></span>
          <span className="upcore-navbar-icon-span">功能编辑</span>
          <span className={classnames(`${prefixCls}-icon-right`)} style={{display:this.state.display?'inline-block':'none'}} onClick={()=>{self.seniorEdit();}}>{this.state.editState?'完成':'编辑'}</span>
        </div>
        <div className={classnames(`${prefixCls}-container`)}>
          <div style={{display:this.state.editState?'block':'none'}}>
            <List
              values={this.state.items}
              onChange={({ oldIndex, newIndex }) =>
                this.setState(prevState => ({
                  items: arrayMove(prevState.items, oldIndex, newIndex)
                }))
              }
              renderList={({ children, props }) => <div {...props}>{children}</div>}
              renderItem={({ value, props }) => {
                const row = (
                  <div {...props} className="editorItemNew">
                    <div>
                      <div className="editorImgDivNew">
                        <img src={value.iconNew}/>
                      </div>
                    </div>
                    <span>{value.text}</span>
                  </div>);
                return (row);
              }}
            />

          </div>
          <div style={{display:this.state.editState?'none':'block'}}>
            {
              this.state.items.map( function(item, index) {
                return (
                  <div className="editorItemNew" key={index}>
                    <div >
                      <div className="editorImgDivNew">
                        <img src={item.iconNew}/>
                      </div>
                    </div>
                    <span>{item.text}</span>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className={classnames(`${prefixCls}-fix`)} style={{display:this.state.editState?'block':'none'}}>
          <img src={require('../style/image/gestures.png')}/>
          <span>长按拖动调整位置</span>
        </div>
      </div>
    );
  }
}

