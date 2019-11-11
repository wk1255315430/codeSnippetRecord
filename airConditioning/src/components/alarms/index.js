import classnames from 'classnames';
import React from 'react';
import './style/index.less';

export default class Alarms extends React.Component {
  
  render() {
    const { prefixCls, alarmsList } = this.props;
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
        {alarmArray.map((item,index)=>{
          return (
            <div key={index}>
              <img src={require('../style/image/icon_prompt.png')}/>
              <span>{item}</span>
            </div>

          );
        })}
      </div>
    );
  }
}
Alarms.defaultProps = {
  prefixCls: 'upcore-alarms',
  alarmsList:[]
};
