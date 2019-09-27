import React from 'react';
const config = {
  baseFunctionArr: [
    {
      'name': 'operationMode',
      'show':true,
      'baseType': 'PopupSelect',
      'text': 'Care智能',
      'outlineText':'模式',
      'valuesConfig': [
        {
          'text':'制冷',
          'value':'1',
          'uplusid':'0008',
          'valueIcon':require('../assets/image/cold.png'),
          'valueIconNew':require('../assets/imageNew/icon_mode_cool.png'),
        },
        {
          'text':'除湿',
          'value':'2',
          'uplusid':'0009',
          'valueIcon':require('../assets/image/dry.png'),
          'valueIconNew':require('../assets/imageNew/icon_mode_dry.png'),
        },
        {
          'text':'制热',
          'value':'4',
          'uplusid':'0010',
          'valueIcon':require('../assets/image/warm.png'),
          'valueIconNew':require('../assets/imageNew/icon_mode_heat.png'),
        },
        {
          'text':'送风',
          'value':'6',
          'uplusid':'0011',
          'valueIcon':require('../assets/image/fan.png'),
          'valueIconNew':require('../assets/imageNew/icon_mode_fan.png'),
        }
      ],
      'icon': require('../assets/image/care.png'),
      'iconNew': require('../assets/imageNew/icon_care.png'),
      'outlineIcon':require('../assets/image/cold.png'),
      'outlineIconNew':require('../assets/imageNew/icon_mode_cool.png'),
      'ifOperate': true
    },
    {
      'name': 'specialMode',
      'show':true,
      'baseType': 'CarePopupSelect',
      'text': 'Care智能',
      'valuesConfig': [
        {
          'text':'成年男性',
          'value':'0',
          'uplusid':'0016',
          'valueIcon':require('../assets/image/careman.png'),
          'valueIconNew':require('../assets/imageNew/icon_careman.png'),
        },
        {
          'text':'成年女性',
          'value':'1',
          'uplusid':'0017',
          'valueIcon':require('../assets/image/carewoman.png'),
          'valueIconNew':require('../assets/imageNew/icon_carewoman.png'),
        },
        {
          'text':'孕/幼',
          'value':'2',
          'uplusid':'0018',
          'valueIcon':require('../assets/image/carechild.png'),
          'valueIconNew':require('../assets/imageNew/icon_carechild.png'),
        },
        {
          'text':'老人',
          'value':'3',
          'uplusid':'0019',
          'valueIcon':require('../assets/image/careold.png'),
          'valueIconNew':require('../assets/imageNew/icon_careold.png'),
        }
      ],
      'icon': require('../assets/image/care.png'),
      'iconNew': require('../assets/imageNew/icon_care.png'),
      'ifOperate': true
    },
    {
      'name': 'rapidMode',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_strong_click.png'),
      'iconoff':require('../assets/image/function_strong_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_strong.png'),
      'text': '极速',
      'activeValues': 'true',
      'uplusid':'0036',
      'ifOperate': true
    }
  ]
};
export default config;
