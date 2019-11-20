import axios from "axios";
import qs from "qs";
import { showLoading, hideLoading } from "./loading";
import { Message as message } from "element-ui";
import store from "../store";

axios.defaults.timeout = 20000; //响应时间
// axios.defaults.headers["Content-Type"] =
//   "application/x-www-form-urlencoded;charset=UTF-8"; //配置请求头
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    if (config.method === "post") {
      config.data = qs.stringify(config.data);
    }
    showLoading();
    if (config.url == "/api/user/bmsl") {
      return config;
    }
    if (/^\/api\/admin/.test(config.url)) {
      if (store.getters["token"]) {
        config.headers.Authorization = `Bearer ${store.getters["token"]}`;
        return config;
      } else {
        message.error("token未获得");
        return Promise.reject("token未获得");
      }
    } else {
      return config;
    }
  },
  error => {
    hideLoading();
    console.log("错误的传参");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  response => {
    hideLoading();
    if (!response.data.success) {
      return Promise.resolve(response);
    }
    return response;
  },
  error => {
    hideLoading();
    return Promise.reject(error);
  }
);
export default axios;
