import React from 'react';
const config = {
  baseFunctionArr: [
    {
      'name': 'windSpeedL',
      'show':true,
      'baseType': 'PopupSelect',
      'text': '风速',
      'valuesConfig':[
        {
          'text':'高风',
          'value':'1',
          'uplusid':'0012',
          'valueIcon':require('../assets/image/fanspeed_high.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_high.png'),
        },
        {
          'text':'中风',
          'value':'2',
          'uplusid':'0013',
          'valueIcon':require('../assets/image/fanspeed_mid.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_mid.png'),
        },
        {
          'text':'低风',
          'value':'3',
          'uplusid':'0014',
          'valueIcon':require('../assets/image/fanspeed_low.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_low.png'),
        },
        {
          'text':'自动风',
          'value':'5',
          'uplusid':'0015',
          'valueIcon':require('../assets/image/fanspeed_auto.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_auto.png'),
        }
      ],
      'icon': require('../assets/image/fanspeed_auto.png'),
      'iconNew': require('../assets/imageNew/icon_fanspeed_auto.png'),
      'ifOperate': true
    },
  ]
};
export default config;
