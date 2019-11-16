function regexCheck(config) {
  const regObj = {
    phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  };

  if (!config.value) {
    return config.des + "不能为空";
  } else {
    if (regObj[config.type]) {
      for (let key in regObj) {
        if (key === config.type) {
          if (!regObj[key].test(config.value)) {
            return config.des + "格式不正确";
          } else {
            return true;
          }
        }
      }
    } else if (config.type === "") {
      return true;
    }
  }
}

module.exports = {
  regexCheck: regexCheck
};
