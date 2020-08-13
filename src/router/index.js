import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            meta: { title: '月饼礼盒' },
            component: () => import(/* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/login',
            name: 'login',
            meta: { title: '月饼礼盒' },
            component: () => import(/* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/product',
            name: 'product',
            meta: { title: '月饼礼盒' },
            component: () => import(/* webpackChunkName: "product" */ '../components/product.vue'),
        },
        {
            path: '/addaddress',
            name: 'addaddress',
            component: () => import(/* webpackChunkName: "addaddress" */ '../components/addaddress.vue'),
            meta: { title: '保存收货地址' }
        },
        {
            path: '/ordercheck',
            name: 'ordercheck',
            component: () => import(/* webpackChunkName: "ordercheck" */ '../components/ordercheck.vue'),
            meta: { title: '确定订单' }
        },
        {
            path: '/ordertrack',
            name: 'ordertrack',
            component: () => import(/* webpackChunkName: "ordertrack" */ '../components/ordertrack.vue'),
            meta: { title: '订单跟踪' }
        },
        {
            path: '/myorder',
            name: 'myorder',
            component: () => import(/* webpackChunkName: "myorder" */ '../components/myorder.vue'),
            meta: { title: '我的订单' }
        },
        {
            path: '/addrise',
            name: 'addrise',
            component: () => import(/* webpackChunkName: "addrise" */ '../components/addrise.vue'),
            meta: { title: '添加抬头' }
        },
        {
            path: '/orderdetail',
            name: 'orderdetail',
            component: () => import(/* webpackChunkName: "orderdetail" */ '../components/orderdetail.vue'),
            meta: { title: '订单详情' }
        },
        {
            path: '/invoicenews',
            name: 'invoicenews',
            component: () => import(/* webpackChunkName: "invoicenews" */ '../components/invoicenews.vue'),
            meta: { title: '发票信息' }
        },
        {
            path: '/addinvoice',
            name: 'addinvoice',
            component: () => import(/* webpackChunkName: "addinvoice" */ '../components/addinvoice.vue'),
            meta: { title: '添加发票信息' }
        }
    ]
})

const originalPush = Router.prototype.push
   Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}