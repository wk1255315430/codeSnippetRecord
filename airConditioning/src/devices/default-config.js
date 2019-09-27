import React from 'react';


const config = {
  onOffName: 'onOffStatus',
  basicColors:{
    othersColor:{
      color:'#37C5BB',
      shadowColor:'#DCF1EF',
      normalColor:'#9BE2DD',
      ponitImg:require('../assets/image/othersPoint.png'),
      leftImg:require('../assets/image/othersLeft.png'),
      RightImg:require('../assets/image/othersRight.png'),
      editImg:require('../assets/image/editor_other.png')
    },
    modes:[
      {
        modeValue:'1',
        color:'#4A90E2',
        shadowColor:'#E6EAF5',
        normalColor:'#A5C8F1',
        ponitImg:require('../assets/image/coldPoint.png'),
        leftImg:require('../assets/image/coldLeft.png'),
        RightImg:require('../assets/image/coldRight.png'),
        editImg:require('../assets/image/editor_cool.png')
      },
      {
        modeValue:'4',
        color:'#F57723',
        shadowColor:'#F6E5DB',
        normalColor:'#FABB91',
        ponitImg:require('../assets/image/warmPoint.png'),
        leftImg:require('../assets/image/warmLeft.png'),
        RightImg:require('../assets/image/warmRight.png'),
        editImg:require('../assets/image/editor_heat.png')
      }
    ]
  },
  bannerConfig: [
    {
      'name': 'indoorTemperature',
      'text': '室内温度',
      'unit': '℃',
      'baseType': 'BannerItem'
    },{
      'name': 'indoorHumidity',
      'text': '室内湿度',
      'unit': '%',
      'baseType': 'BannerItem'
    },{
      'name': 'indoorPM2p5Value',
      'text': '室内PM2.5',
      'unit': 'ug/m³',
      'baseType': 'BannerItem'
    },{
      'name': 'co2Value',
      'text': 'CO2浓度',
      'unit':'PPM',
      'baseType': 'BannerItem'
    }
  ],
  temperatureConfig: {
    'name': 'targetTemperature',
    'ifOperate': true
  },
  baseFunctionArr: [
    {
      'name': 'onOffStatus',
      'show':true,
      'baseType': 'OnoffSwitch',
      'icon': require('../assets/image/power.png'),
      'iconNew': require('../assets/imageNew/icon_switch.png'),
      'text': '开关',
      'activeValues': 'true',
      'ifOperate': true
    },
    {
      'name': 'operationMode',
      'show':true,
      'baseType': 'PopupSelect',
      'text': '模式',
      'valuesConfig': [
        {
          'text':'PMV',
          'value':'0',
          'uplusid':'0007',
          'valueIcon':require('../assets/image/pmv.png'),
          'valueIconNew':require('../assets/imageNew/icon_mode_pmv.png'),
        },
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
      'icon': require('../assets/image/pmv.png'),
      'iconNew': require('../assets/imageNew/icon_mode_pmv.png'),
      'ifOperate': true
    },{
      'name': 'specialMode',
      'show':true,
    },
    {
      'name': 'windSpeed',
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
    {
      'name': 'windSpeedL',
      'show':true,
      'baseType': 'PopupSelect',
      'text': '风速·左',
      'valuesConfig':[
        {
          'text':'高风·左',
          'value':'1',
          'uplusid':'0020',
          'valueIcon':require('../assets/image/fanspeed_high.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_high.png'),
        },
        {
          'text':'中风·左',
          'value':'2',
          'uplusid':'0021',
          'valueIcon':require('../assets/image/fanspeed_mid.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_mid.png'),
        },
        {
          'text':'低风·左',
          'value':'3',
          'uplusid':'0022',
          'valueIcon':require('../assets/image/fanspeed_low.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_low.png'),
        },
        {
          'text':'自动风·左',
          'value':'5',
          'uplusid':'0023',
          'valueIcon':require('../assets/image/fanspeed_auto.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_auto.png'),
        }
      ],
      'icon': require('../assets/image/fanspeed_auto.png'),
      'iconNew': require('../assets/imageNew/icon_fanspeed_auto.png'),
      'ifOperate': true
    },
    {
      'name': 'windSpeedR',
      'show':true,
      'baseType': 'PopupSelect',
      'text': '风速·右',
      'valuesConfig':[
        {
          'text':'高风·右',
          'value':'1',
          'uplusid':'0024',
          'valueIcon':require('../assets/image/fanspeed_high.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_high.png'),
        },
        {
          'text':'中风·右',
          'value':'2',
          'uplusid':'0025',
          'valueIcon':require('../assets/image/fanspeed_mid.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_mid.png'),
        },
        {
          'text':'低风·右',
          'value':'3',
          'uplusid':'0026',
          'valueIcon':require('../assets/image/fanspeed_low.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_low.png'),
        },
        {
          'text':'自动风·右',
          'value':'5',
          'uplusid':'0027',
          'valueIcon':require('../assets/image/fanspeed_auto.png'),
          'valueIconNew':require('../assets/imageNew/icon_fanspeed_auto.png'),
        }
      ],
      'icon': require('../assets/image/fanspeed_auto.png'),
      'iconNew': require('../assets/imageNew/icon_fanspeed_auto.png'),
      'ifOperate': true
    },
    {
      'name': 'windDirectionVertical',
      'show':false,
      'baseType': 'FlipSwitch',
      'icon': require('../assets/image/function_updown_click.png'),
      'iconoff':require('../assets/image/function_updown_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_updown.png'),
      'text': '上下摆风',
      'offValues': '0',
      'activeValues': '8',
      'uplusid':'0028',
      'ifOperate': true
    },
    {
      'name': 'windDirectionVerticalL',
      'show':false,
      'baseType': 'FlipSwitch',
      'icon': require('../assets/image/function_updown_click.png'),
      'iconoff':require('../assets/image/function_updown_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_updown.png'),
      'text': '上下摆风·左',
      'offValues': '0',
      'activeValues': '8',
      'uplusid':'0029',
      'ifOperate': true
    },
    {
      'name': 'windDirectionVerticalR',
      'show':false,
      'baseType': 'FlipSwitch',
      'icon': require('../assets/image/function_updown_click.png'),
      'iconoff':require('../assets/image/function_updown_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_updown.png'),
      'text': '上下摆风·右',
      'offValues': '0',
      'activeValues': '8',
      'uplusid':'0030',
      'ifOperate': true
    },
    {
      'name': 'windDirectionHorizontal',
      'show':false,
      'baseType': 'FlipSwitch',
      'icon': require('../assets/image/function_leftright_click.png'),
      'iconoff':require('../assets/image/function_leftright_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_leftright.png'),
      'text': '左右摆风',
      'offValues': '0',
      'activeValues': '7',
      'uplusid':'0031',
      'ifOperate': true
    },
    {
      'name': 'windDirectionHorizontalL',
      'show':false,
      'baseType': 'FlipSwitch',
      'icon': require('../assets/image/function_leftright_click.png'),
      'iconoff':require('../assets/image/function_leftright_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_leftright.png'),
      'text': '左右摆风·左',
      'offValues': '0',
      'activeValues': '7',
      'uplusid':'0032',
      'ifOperate': true
    },
    {
      'name': 'windDirectionHorizontalR',
      'show':false,
      'baseType': 'FlipSwitch',
      'icon': require('../assets/image/function_leftright_click.png'),
      'iconoff':require('../assets/image/function_leftright_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_leftright.png'),
      'text': '左右摆风·右',
      'offValues': '0',
      'activeValues': '7',
      'uplusid':'0033',
      'ifOperate': true
    },
    {
      'name': 'electricHeatingStatus',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_electricalheat_click.png'),
      'iconoff':require('../assets/image/function_electricalheat_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_electricalheat.png'),
      'text': '电加热',
      'activeValues': 'true',
      'uplusid':'0034',
      'ifOperate': true
    },
    {
      'name': 'silentSleepStatus',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_sleep_click.png'),
      'iconoff':require('../assets/image/function_sleep_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_sleep.png'),
      'text': '静眠',
      'activeValues': 'true',
      'uplusid':'0035',
      'ifOperate': true
    },
    {
      'name': 'rapidMode',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_strong_click.png'),
      'iconoff':require('../assets/image/function_strong_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_strong.png'),
      'text': '强力',
      'activeValues': 'true',
      'uplusid':'0036',
      'ifOperate': true
    },
    {
      'name': 'muteStatus',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_mute_click.png'),
      'iconoff':require('../assets/image/function_mute_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_mute.png'),
      'text': '静音',
      'activeValues': 'true',
      'uplusid':'0037',
      'ifOperate': true
    },
    {
      'name': 'screenDisplayStatus',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_screen_click.png'),
      'iconoff': require('../assets/image/function_screen_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_screen.png'),
      'text': '灯光',
      'activeValues': 'true',
      'uplusid':'0038',
      'ifOperate': true
    },
    {
      'name': 'healthMode',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_health_click.png'),
      'iconoff': require('../assets/image/function_health_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_health.png'),
      'text': '健康',
      'activeValues': 'true',
      'uplusid':'0039',
      'ifOperate': true
    },
    {
      'name': 'cleaningTimeStatus',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_purification_click.png'),
      'iconoff': require('../assets/image/function_purification_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_purification.png'),
      'text': '净化',
      'activeValues': 'true',
      'uplusid':'0040',
      'ifOperate': true
    },
    {
      'name': 'freshAirStatus',
      'show':false,
      'baseType': 'IconSwitch',
      'icon': require('../assets/image/function_freshair_click.png'),
      'iconoff': require('../assets/image/function_freshair_off.png'),
      'iconNew':require('../assets/imageNew/icon_function_freshair.png'),
      'text': '新风',
      'activeValues': 'true',
      'uplusid':'0041',
      'ifOperate': true
    }

  ]
};
export default config;
