// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import Cookie from 'js-cookie';
import store from './store'
import axios from 'axios';
import moment from 'moment';

moment.locale('zh-cn');
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') =>{
    return moment(dataStr).format(pattern)
})

axios.defaults.withCredentials = true;

Vue.prototype.$axios = axios;

Vue.prototype.$moment = moment;


import FastClick from 'fastclick'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

// FastClick.prototype.onTouchEnd = function (event) {
    // if (event.target.hasAttribute("type") && event.target.getAttribute("type") == "text") {
        // event.preventDefault();
    //     return false;
    // }
// }

import 'element-ui/lib/theme-chalk/index.css';
// import { Dialog } from 'element-ui';

// Vue.use(Dialog);


Vue.use(ElementUI);


Vue.config.productionTip = false

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    let realname = getQueryVariable('real_name');
    
    if(!!realname) {
        realname = decodeURIComponent(realname);
        localStorage.setItem('moon_email', realname);
    }

    const role = localStorage.getItem('moon_email');

    if (!role && to.path !== '/login') {

        if (to.path !== '/product') {
            next('/login')
        } else {
            next();
        }
    } else {

        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
