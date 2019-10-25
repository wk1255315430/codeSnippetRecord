const regObj = {
  phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
};

function regexCheck(config) {
  if (!config.value || config.value === null) return config.des + "不能为空";
  for (let key in regObj) {
    if (key === config.type) {
      if (!regObj[key].test(config.value)) {
        return config.des + "格式不正确";
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}

module.exports = {
  regexCheck: regexCheck
};
