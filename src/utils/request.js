import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import qs from "qs";
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
});
// 请求前进行拦截
service.interceptors.request.use(
  (config) => {
    // 判断store中实现存在的token
    if (store.getters.token) {
    
      //读取token信息，并将token添加到headers头部信息中
      config.headers["token"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// 响应时拦截
service.interceptors.response.use(
 
  (response) => {
    const res = response.data;
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token
      expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "用户登录信息过期，请重新登录",
          "系统提示",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
//请求方法
const http = {
  //post请求
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [
        (params) => {
          return JSON.stringify(params);
        },
      ],
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [
        (params) => {
          return JSON.stringify(params);
        },
      ],
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  //get请求
  get(url, params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
  },
  //rest风格的get请求
  getRestApi(url, params) {
    let _params;
    if (Object.is(params, undefined || null)) {
      _params = "";
    } else {
      _params = "/";
      for (const key in params) {
        if (
          params.hasOwnProperty(key) &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          _params += `${params[key]}/`;
        }
      }
      _params = _params.substr(0, _params.length - 1);
    }
    if (_params) {
      return service.get(`${url}${_params}`);
    } else {
      return service.get(url);
    }
  },
  //删除请求
  delete(url, params) {
    let _params;
    if (Object.is(params, undefined || null)) {
      _params = "";
    } else {
      _params = "/";
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (
          params.hasOwnProperty(key) &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          _params += `${params[key]}/`;
        }
      }
      _params = _params.substr(0, _params.length - 1);
    }
    if (_params) {
      return service.delete(`${url}${_params}`).catch((err) => {
        message.error(err.msg);
        return Promise.reject(err);
      });
    } else {
      return service.delete(url).catch((err) => {
        message.error(err.msg);
        return Promise.reject(err);
      });
    }
  },
  //文件上传请求
  upload(url, params) {
    return service.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  //登录请求
  login(url, params) {
    return service.post(url, params, {
      transformRequest: [
        (params) => {
          return qs.stringify(params);
        },
      ],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },
};
export default http;
