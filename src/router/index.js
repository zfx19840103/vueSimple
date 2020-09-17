import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            meta: { title: '2020中秋商城' },
            component: () => import(/* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/login',
            name: 'login',
            meta: { title: '2020中秋商城' },
            component: () => import(/* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/product',
            name: 'product',
            meta: { title: '2020中秋商城' },
            component: () => import(/* webpackChunkName: "product" */ '../components/product.vue'),
        },
        {
            path: '/ordercheck',
            name: 'ordercheck',
            component: () => import(/* webpackChunkName: "ordercheck" */ '../components/ordercheck.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/ordertrack',
            name: 'ordertrack',
            component: () => import(/* webpackChunkName: "ordertrack" */ '../components/ordertrack.vue'),
            meta: { title: '2020中秋商城' }
        },
        {
            path: '/myorder',
            name: 'myorder',
            component: () => import(/* webpackChunkName: "myorder" */ '../components/myorder.vue'),
            meta: { title: '2020中秋商城' }
        },
        
        {
            path: '/orderdetail',
            name: 'orderdetail',
            component: () => import(/* webpackChunkName: "orderdetail" */ '../components/orderdetail.vue'),
            meta: { title: '2020中秋商城' }
        },
        
        {
            path: '/invoicetime',
            name: 'invoicetime',
            component: () => import(/* webpackChunkName: "invoicetime" */ '../components/invoicetime.vue'),
            meta: { title: '2020中秋商城' }
        },
    ]
})

const originalPush = Router.prototype.push
   Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
