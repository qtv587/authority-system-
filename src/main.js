import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log

import * as filters from "./filters"; // global filters
//导入封装信息确认提示框组件脚本
import myconfirm from "@/utils/myconfirm";
//导入清空表单工具
import resetForm from "@/utils/resetForm";
//导入快速复制对象工具
import objCopy from "@/utils/objCopy";
//导入按钮权限判断
import hasPermission from "@/permission/index";

Vue.prototype.hasPermission = hasPermission;
Vue.prototype.$objCopy = objCopy;
Vue.prototype.$resetForm = resetForm;
Vue.prototype.$myconfirm = myconfirm;

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
});

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
