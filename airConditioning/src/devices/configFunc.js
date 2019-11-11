export default class ConfigUtil {
  // 获取url中'?'符后的参数
  getUrlParams() {
    const url = window.location.search;
    const query = {};
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        query[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
    }

    const hash = window.location.hash;
    if (hash.indexOf('?') !== -1) {
      const hashStr = hash.substr(hash.indexOf('?') + 1, hash.length);
      const hashArr = hashStr.split('&');
      for (let i = 0; i < hashArr.length; i++) {
        query[hashArr[i].split('=')[0]] = decodeURI(hashArr[i].split('=')[1]);
      }
    }
    return query;
  }

  // 合并配置文件
  mergeConfig(defaultConfig, extraConfig) {
    if (!defaultConfig) {
      return {};
    }
    if (!extraConfig) {
      return defaultConfig;
    }
    // navbarConfig
    if (extraConfig.navbarConfig) {
      defaultConfig.navbarConfig = {
        ...defaultConfig.navbarConfig,
        ...extraConfig.navbarConfig,
      };
    }
    // bannerConfig
    if (extraConfig.bannerConfig) {
      defaultConfig.bannerConfig = {
        ...defaultConfig.bannerConfig,
        ...extraConfig.bannerConfig,
      };
    }
    // baseFunctionArr
    if (extraConfig.baseFunctionArr) {
      for (let i = 0; i < extraConfig.baseFunctionArr.length; i++) {
        const extraItem = extraConfig.baseFunctionArr[i];
        for (let j = 0; j < defaultConfig.baseFunctionArr.length; j++) {
          if (defaultConfig.baseFunctionArr[j].name === extraItem.name) {
            defaultConfig.baseFunctionArr[j] = {
              ...defaultConfig.baseFunctionArr[j],
              ...extraItem,
            };
          }
        }
      }
    }
    // deviceStateOnChange
    if (typeof extraConfig.deviceStateOnChange === 'function') {
      defaultConfig.deviceStateOnChange = extraConfig.deviceStateOnChange;
    }
    return defaultConfig;
  }
}
