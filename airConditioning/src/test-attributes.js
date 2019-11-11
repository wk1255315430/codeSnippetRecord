/* eslint-disable */
module.exports = {
  'data': [
    {
      'name': 'getAllProperty',
      'desc': '查询状态',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'getAllProperty'
        }]
      },
      'operationType': 'I'
    },
    {
      'name': 'getAllAlarm',
      'desc': '查询报警',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'getAllAlarm'
        }]
      },
      'operationType': 'I'
    },
    {
      'name': 'stopCurrentAlarm',
      'desc': '停止报警',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'stopCurrentAlarm'
        }]
      },
      'operationType': 'I'
    },
    {
      'name': 'getBigDataFrame',
      'desc': '查询大数据',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'getBigDataFrame'
        }]
      },
      'operationType': 'I'
    },
    {
      'name': 'onOffStatus',
      'desc': '开关机状态',
      'readable': true,
      'writable': true,
      'value': 'true',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开机'
        },
        {
          'data': 'false',
          'desc': '关机'
        }]
      },
      'operationType': 'IG'
    },
    {
      'name': 'targetTemperature',
      'desc': '目标温度',
      'readable': true,
      'writable': true,
      'value': '26',
      'valueRange': {
        'type': 'STEP',
        'dataStep': {
          'dataType': 'Double',
          'step': '1',
          'minValue': '16',
          'maxValue': '30'
        }
      },
      'operationType': 'G'
    },
    {
      'name': 'windDirectionVertical',
      'desc': '上下摆风',
      'value': '0',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '0',
          'desc': '固定'
        },
        {
          'data': '1',
          'desc': '固定'
        },
        {
          'data': '2',
          'desc': '固定'
        },
        {
          'data': '3',
          'desc': '固定'
        },
        {
          'data': '4',
          'desc': '固定'
        },
        {
          'data': '5',
          'desc': '固定'
        },
        {
          'data': '6',
          'desc': '固定'
        },
        {
          'data': '7',
          'desc': '固定'
        },
        {
          'data': '8',
          'desc': '自动'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'multiPeopleMode',
      'desc': '功能模式',
      'value': '2',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '0',
          'desc': '关闭'
        },
        {
          'data': '1',
          'desc': '单人洗'
        },
        {
          'data': '2',
          'desc': '双人洗'
        },
        {
          'data': '3',
          'desc': '多人洗热'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'operationMode',
      'desc': '功能模式',
      'value': '2',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '0',
          'desc': '智能'
        },
        {
          'data': '1',
          'desc': '制冷'
        },
        {
          'data': '2',
          'desc': '除湿'
        },
        {
          'data': '4',
          'desc': '制热'
        },
        {
          'data': '6',
          'desc': '送风'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'specialMode',
      'desc': '特殊模式',
      'readable': false,
      'writable': true,
      'defaultValue': '0',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '0',
          'desc': '无特殊模式'
        },
        {
          'data': '1',
          'desc': '老人模式'
        },
        {
          'data': '2',
          'desc': '儿童模式'
        },
        {
          'data': '3',
          'desc': '孕妇模式'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'windSpeed',
      'desc': '设定风速',
      'readable': true,
      'writable': true,
      'value': '2',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '1',
          'desc': '高'
        },
        {
          'data': '2',
          'desc': '中苏'
        },
        {
          'data': '5',
          'desc': '自动'
        },
        {
          'data': '3',
          'desc': '低'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'tempUnit',
      'desc': '温度显示',
      'readable': true,
      'writable': true,
      'defaultValue': '1',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '1',
          'desc': '摄氏度'
        },
        {
          'data': '2',
          'desc': '华氏度'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'pmvStatus',
      'desc': '舒适/PMV功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开'
        },
        {
          'data': 'false',
          'desc': '关'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'intelligenceStatus',
      'desc': '智能功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开'
        },
        {
          'data': 'false',
          'desc': '关'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'halfDegreeSettingStatus',
      'desc': '0.5度设定功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开'
        },
        {
          'data': 'false',
          'desc': '关'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'screenDisplayStatus',
      'desc': '屏显功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开'
        },
        {
          'data': 'false',
          'desc': '关'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': '10degreeHeatingStatus',
      'desc': '10°制热功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开'
        },
        {
          'data': 'false',
          'desc': '关'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'echoStatus',
      'desc': '蜂鸣器回响状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'false',
          'desc': '蜂鸣器回响（云适应无效）'
        },
        {
          'data': 'true',
          'desc': '蜂鸣器不响（云适应有效）'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'lockStatus',
      'desc': '电子锁状态',
      'readable': false,
      'writable': true,
      'value': 'true',
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '锁定'
        },
        {
          'data': 'false',
          'desc': '未锁定'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'silentSleepStatus',
      'desc': '静眠模式开启状态',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'false',
          'desc': '静眠模式关闭'
        },
        {
          'data': 'true',
          'desc': '静眠模式开启'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'muteStatus',
      'desc': '静音开关状态',
      'readable': true,
      'writable': true,
      'value': 'true',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'false',
          'desc': '静音关闭'
        },
        {
          'data': 'true',
          'desc': '静音开启'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'rapidMode',
      'desc': '强力模式状态',
      'readable': true,
      'writable': true,
      'value': 'true',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'false',
          'desc': '强力模式关闭'
        },
        {
          'data': 'true',
          'desc': '强力模式开启'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'electricHeatingStatus',
      'desc': '电加热功能状态',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启电加热'
        },
        {
          'data': 'false',
          'desc': '关闭电加热'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'healthMode',
      'desc': '健康（负离子）模式',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启健康模式'
        },
        {
          'data': 'false',
          'desc': '关闭健康模式'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'targetHumidity',
      'desc': '目标湿度',
      'readable': false,
      'writable': true,
      'defaultValue': '50',
      'valueRange': {
        'type': 'STEP',
        'dataStep': {
          'dataType': 'Integer',
          'step': '1',
          'minValue': '30',
          'maxValue': '90'
        }
      },
      'operationType': 'G'
    },
    {
      'name': 'humanSensingStatus',
      'desc': '感人模式',
      'readable': false,
      'writable': true,
      'defaultValue': '0',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': '0',
          'desc': '感人关'
        },
        {
          'data': '1',
          'desc': '感人避让'
        },
        {
          'data': '2',
          'desc': '感人跟随'
        },
        {
          'data': '3',
          'desc': '感人'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'windDirectionHorizontal',
      'desc': '左右摆风',
      'readable': false,
      'writable': true,
      'defaultValue': '0',
      'value': '7',
      'valueRange': {
        'type': 'LIST',
        'dataList': [
          {
            "data": "1",
            "code": "302001",
            "desc": "左右摆位置固定"
          },
          {
            "data": "2",
            "code": "302002",
            "desc": "1"
          },
          {
            "data": "3",
            "code": "302003",
            "desc": "2"
          },
          {
            "data": "4",
            "code": "302004",
            "desc": "3"
          },
          {
            "data": "5",
            "code": "302005",
            "desc": "4"
          },
          {
            "data": "6",
            "code": "302006",
            "desc": "5"
          },
          {
            "data": "7",
            "code": "302007",
            "desc": "自动"
          }]
      },
      'operationType': 'G'
    },
    {
      'name': 'energySavingStatus',
      'desc': '省电/ECO模式状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启省电模式'
        },
        {
          'data': 'false',
          'desc': '关闭省电模式'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'lightStatus',
      'desc': '情景灯光状态',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启情境灯光'
        },
        {
          'data': 'false',
          'desc': '关闭情境灯光'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'selfCleaningStatus',
      'desc': '自清洁功能状态',
      'readable': true,
      'writable': true,
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启自清洁'
        },
        {
          'data': 'false',
          'desc': '关闭自清洁'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'ch2oCleaningStatus',
      'desc': '甲醛净化功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启甲醛净化功能'
        },
        {
          'data': 'false',
          'desc': '关闭甲醛净化功能'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'pm2p5CleaningStatus',
      'desc': 'PM2.5净化功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启PM2.5净化功能'
        },
        {
          'data': 'false',
          'desc': '关闭PM2.5净化功能'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'humidificationStatus',
      'desc': '加湿功能状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启加湿功能'
        },
        {
          'data': 'false',
          'desc': '关闭加湿功能'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'freshAirStatus',
      'desc': '新风功能状态',
      'value': 'false',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '开启新风'
        },
        {
          'data': 'false',
          'desc': '关闭新风'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'indoorTemperature',
      'desc': '当前室内温度',
      'readable': true,
      'writable': false,
      'value': '32',
      'valueRange': {
        'type': 'STEP',
        'dataStep': {
          'dataType': 'Double',
          'step': '0.5',
          'minValue': '0',
          'maxValue': '55'
        }
      }
    },
    {
      'name': 'pm2p5Level',
      'desc': '室内PM2.5等级',
      'readable': true,
      'writable': false,
      'defaultValue': '0',
      'value': '1',
      'valueRange': {
        'type': 'STEP',
        'dataStep': {
          'dataType': 'Integer',
          'step': '1',
          'minValue': '0',
          'maxValue': '3'
        }
      },
      'operationType': 'I'
    },
    {
      'name': 'indoorPM2p5Value',
      'desc': '室内PM2.5实际值',
      'readable': true,
      'writable': false,
      'defaultValue': '0',
      'value': '0',
      'valueRange': {
        'type': 'STEP',
        'dataStep': {
          'dataType': 'Integer',
          'step': '1',
          'minValue': '0',
          'maxValue': '4095'
        }
      },
      'operationType': 'I'
    },
    {
      'name': 'indoorHumidity',
      'desc': '湿度',
      'readable': true,
      'writable': false,
      'value': '12',
      'defaultValue': '0',
      'valueRange': {
        'type': 'STEP',
        'dataStep': {
          'dataType': 'Integer',
          'step': '1',
          'minValue': '0',
          'maxValue': '4095'
        }
      },
      'operationType': 'I'
    },
    {
      'name': 'cleaningTimeStatus',
      'desc': '底板净化功能时间状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '清零'
        },
        {
          'data': 'false',
          'desc': '正常累计'
        }]
      },
      'operationType': 'G'
    },
    {
      'name': 'cloudFilterChangeFlag',
      'desc': '云端净化提醒状态',
      'readable': false,
      'writable': true,
      'defaultValue': 'false',
      'valueRange': {
        'type': 'LIST',
        'dataList': [{
          'data': 'true',
          'desc': '云端净化累计时间到，需提醒用户更换滤网'
        },
        {
          'data': 'false',
          'desc': '云端净化累计时间未到，不需提醒用户更换滤网'
        }]
      },
      'operationType': 'G'
    }
  ],
  baseInfo: {
    'connection': 'READY'
  }

};
