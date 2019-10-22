import axios from "axios";
import qs from "qs";

axios.defaults.timeout = 20000; //响应时间
// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded;charset=UTF-8"; //配置请求头
axios.defaults.baseURL = "/api"; //配置接口地址
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    if (config.method === "post") {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    console.log("错误的传参");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  response => {
    if (!response.data.success) {
      return Promise.resolve(response);
    }
    return response;
  },
  error => {
    console.log("网络异常");
    return Promise.reject(error);
  }
);
export default axios;
