export function oldAgreementMachineControl(commands,attributes,logicAttrs){
  console.log('commands',commands);
  //1.0协议需要额组命令参数，标准功能模型展示
  let newCommands = [];

  for(let i in attributes){
    switch(String(i)){
    case '202001':
    case '202002'://开关机
    case '202004':
    case '202003':
    case '202006':
    case '202005':
    case '202008':
    case '202007':
    case '20200a':
    case '202009': 
    case '20200k':
    case '20200j':  
    case '20200m':
    case '20200l':
      // if(attributes[i]){
      newCommands.push({
        name: String(i),
        value: attributes[i]
      });
      // }
      break;
    case '20200n':
      newCommands.push({
        name: '20200n',
        value: attributes[i]
      });
      break;
    case '20200o':
      newCommands.push({
        name: '20200o',
        value: attributes[i]
      });
      break;
    case '20200D':
      newCommands.push({
        name: '20200D',
        value: attributes[i]
      });
      break;  
    case '20200E':
      newCommands.push({
        name: '20200E',
        value: attributes[i]
      });
      break; 
    case '20200F':
      newCommands.push({
        name: '20200F',
        value: attributes[i]
      });
      break; 
    case '20200G':
      newCommands.push({
        name: '20200G',
        value: attributes[i]
      });
      break; 
    case '20200H':
      newCommands.push({
        name: '20200H',
        value: attributes[i]
      });
      break;
    case '20200I':
      newCommands.push({
        name: '20200I',
        value: attributes[i]
      });
      break;
    case '20200J':
      newCommands.push({
        name: '20200J',
        value: attributes[i]
      });
      break;
    default:
    }
  }

  console.log('newCommands',newCommands);


  //针对1.0协议的底板，做命令补丁处理
  let commandResult = constraints(commands,logicAttrs,newCommands);
  return commandResult;
}

function constraints(commands,attributes,newCommands){
  let sleepFlag = false;
  let groupCommands = newCommands;
  const windSpeed = attributes.filter((attr) => attr.name === 'windSpeed')[0];
  const operationMode = attributes.filter((attr) => attr.name === 'operationMode')[0];
  //切换模式关闭静眠
  if(commands[0] && commands[0].name === 'operationMode'){
    sleepFlag = true;
  }
  //将要下发修改的命令键值
  let codeName = '';
  let codeValue = '';
  //要被修改的建名
  let codeNameNow = '';
  //功能属性定义中code为2个6位码标识
  if(commands[0] && (commands[0].name==='onOffStatus'||commands[0].name==='freshAirStatus'||commands[0].name==='healthMode'||commands[0].name==='electricHeatingStatus'||
  commands[0].name==='humidificationStatus'||commands[0].name==='lockStatus'||commands[0].name==='selfCleaningStatus')){
    for(let i=0;i<attributes.length;i++){
      if(commands[0].name === attributes[i].name){
        let item = attributes[i].valueRange.dataList;
        for(let j =0;j<item.length;j++){
          if(commands[0].value === item[j].data){
            codeName = item[j].code;
            codeValue = item[j].code;
          }
        }

        console.log('codeName',codeName);
        console.log('codeValue',codeValue);
        let valueNow = attributes[i].value;
        for(let k =0;k<item.length;k++){
          if(valueNow === item[k].data){
            codeNameNow = item[k].code;
          }
        }
        console.log('codeNameNow',codeNameNow);

        for(let z =0;z<groupCommands.length;z++){
          let command = groupCommands[z];
          if(command.name === codeName){
            groupCommands[z].value = codeValue;
          }
          if(command.name === codeNameNow){
            groupCommands[z].value = '';
          }
        }    
      }
    }
  }else if(commands[0] && (commands[0].name==='echoStatus'||commands[0].name==='silentSleepStatus'||commands[0].name==='operationMode'||
  commands[0].name==='windSpeed'||commands[0].name==='humanSensingStatus'||commands[0].name==='windDirectionVertical'||commands[0].name==='windDirectionHorizontal')){
    //功能属性定义中code为1个6位码标识,valueRange为list
    for(let i=0;i<attributes.length;i++){
      if(commands[0].name === attributes[i].name){
        let item = attributes[i].valueRange.dataList;
        for(let j =0;j<item.length;j++){
          if(commands[0].value === item[j].data){
            codeName = attributes[i].code[0];
            codeValue = item[j].code;
          }
        }

        // let valueNow = attributes[i].value;
        // for(let k =0;k<item.length;k++){
        //   if(valueNow === item[k].data){
        //     codeNameNow = item[k].code;
        //   }
        // }

        for(let z =0;z<groupCommands.length;z++){
          let command = groupCommands[z];
          if(command.name === codeName){//codeNameNow
            groupCommands[z].value = codeValue;
          }
        }  
      }
    }
  }else if(commands[0] && commands[0].name==='targetHumidity'){
    //功能属性定义中code为1个6位码标识,valueRange为step
    for(let z =0;z<groupCommands.length;z++){
      let command = groupCommands[z];
      if(command.name === '20200G'){
        groupCommands[z].value = commands[0].value;
      }
    } 
  }else if(commands[0] && commands[0].name==='targetTemperature'){
    let commandValue = commands[0].value;
    for(let i=0;i<attributes.length;i++){
      console.log('operationMode',operationMode.value);
      if(attributes[i].name === 'targetTemperature' && operationMode.value === '0'){
        commandValue = Number(commandValue)+ 26;
        console.log('targetTemperature-value1',commandValue);
      }else if(attributes[i].name === 'targetTemperature' && operationMode.value !== '0'){
        commandValue = Number(commandValue);
        console.log('targetTemperature-value2',commandValue);
      }
    }
    for(let z =0;z<groupCommands.length;z++){
      let command = groupCommands[z];
      if(command.name === '20200E'){
        groupCommands[z].value = String(commandValue);
      }
    } 
  }

  //切换送风
  if (commands[0] && commands[0].name === 'operationMode' && commands[0].value === '6') {
    if(windSpeed.value === '5'){
      for(let i=0; i<groupCommands.length; i++){
        let item = groupCommands[i];
        switch(item.name){
        case '20200F':
          item.value = '302003';
          break;
        case '20200o':
          item.value = '302000';
          break;
        case '202008':
          // item.name = '202007';
          item.value = '';
        case '202007':
          // item.name = '202007';
          item.value = '202007';
          break;
        default:
        }
      }
    }
    for(let i=0; i<groupCommands.length; i++){
      let item = groupCommands[i];
      switch(item.name){
      case '20200o':
        item.value = '302000';
        break;
      case '202008':
        // item.name = '202007';
        item.value = '';
      case '202007':
        // item.name = '202007';
        item.value = '202007';
        break;
      default:
      }
    }
  }
  //制冷
  if (commands[0] && commands[0].name === 'operationMode' && (commands[0].value === '1' || commands[0].value === '2')) {
    for(let i=0; i<groupCommands.length; i++){
      let item = groupCommands[i];
      if(item.name === '202008'){
        // item.name = '202007';
        item.value = '';
      }
      if(item.name === '202007'){
        // item.name = '202007';
        item.value = '202007';
      }
    }
  }

  //PMV
  if (commands[0] && commands[0].name === 'operationMode' && commands[0].value === '0') {
    for(let i=0; i<groupCommands.length; i++){
      let item = groupCommands[i];
      if(item.name === '20200F'){
        item.value = '302005';
      }
      if(item.name === '20200E'){
        item.value = '26';
      }
    }
  }

  let groupCommandObjs = {};
  for(let i =0;i<groupCommands.length;i++){
    let item = groupCommands[i];
    groupCommandObjs[item.name] = item.value;
  }
  console.warn('groupCommandObjs'.groupCommandObjs)

  return {
    commands:groupCommandObjs,
    flag:sleepFlag
  };
}

