import React, {
  Component
} from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import echarts from 'echarts/lib/echarts'; //必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/graphic';
import 'echarts/lib/chart/line';
require('./ChangeableLineEcharts.css');
let myChart = {};
let data = [];
let id = '';
@inject(allStores => ({
  DeviceState: allStores.DeviceState
}))
@withRouter
@observer
export class ChangeableLineEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.initPie = this.initPie.bind(this);
  }
  initPie() {
    let {
      option = {}
    } = this.props;
    const self = this;
    data = option.series[0].data;
    myChart = echarts.init(this.ID);
    myChart.setOption(option);
    myChart.setOption({
      graphic: echarts.util.map(data, function(item, dataIndex) {
        return {
          type: 'circle',
          position: myChart.convertToPixel('grid', item),
          shape: {
            r: 20
          },
          invisible: true,
          draggable: true,
          ondrag: function(a) {
            a.event.preventDefault();
            let y = myChart.convertFromPixel('grid', this.position)[1];
            if (y > 30) {
              data[dataIndex][1] = 30;
            } else if (y < 16) {
              data[dataIndex][1] = 16;
            } else {
              data[dataIndex][1] = y;
            }
            myChart.setOption({
              series: [{
                'data': data
              }]
            });
            if (self.props.id === 'cold') {
              self.props.setColdSleeptemp(dataIndex, data[dataIndex][1]);
            } else {
              self.props.setHotSleeptemp(dataIndex, data[dataIndex][1]);
            }
          },
          z: 100
        };
      })
    });
  }
  componentDidMount() {
    this.initPie();
  }
  componentDidUpdate() {
    let dom = document.getElementsByTagName('canvas');
    if (this.props.width !== dom[0].offsetWidth + 'px') {
      myChart.resize();
    }
    this.initPie();
  }
  render() {
    const {
      width = '100%', height = '300px'
    } = this.props;
    id = this.props.id;
    return (<div className="linecontainer">
      <div ref={ID => this.ID = ID} id={id} style={{width, height}}></div>            
    </div>);
  }
}