import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { hideDeviceInfo, getGlobalHeaders } from '../../util/tool';
require('./history.css');
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export default class History extends Component {
  constructor(props) {
    super(props);
    this.gotoIndex = this.gotoIndex.bind(this);
  }
  gotoIndex() {
    history.go(-1);
  }
  render() {
    hideDeviceInfo(false);
    console.log(this.props.location);
    console.log(this.props.location.state);
    const list = this.props.location.state.list.reverse();
    const num = this.props.location.state.number;
    let title = '近7天';
    if (num === 0) {
      title = '近7天';
    } else if (num === 1) {
      title = '近30天';
    } else {
      title = '近1年';
    }
    return (<div className="history">
      <div className="upcore-navbar">
        <span onClick={this.gotoIndex} className="upcore-navbar-icon-left" ></span>
        <span className="upcore-navbar-icon-span">耗电历史记录</span>
      </div>
      <p>{title}</p>
      <ul>
        {
          list.map((item,index) => {
            const Date = item.time;
            const year = Date.substring(0, 4);
            const month = Date.substring(4, 6);
            const day = Date.substring(6, Date.length);
            let name = '';
            if(day === '') {
              name = `${year}年${month}月`;
            }else{
              name = `${year}.${month}.${day}`;
            }
            return(
              <li key={`${index}_history`}>
                <span className="name">{name}</span>
                <span className="value">{item.totalPowerConsumption}度</span>
              </li>
            );
          })
        }
      </ul>
    </div>);
  }
}