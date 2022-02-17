import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'login',
            meta: { title: '' },
            component: () =>
                import ( /* webpackChunkName: "login" */ '../components/login.vue'),
        },
        {
            path: '/login',
            name: 'login',
            meta: { title: '' },
            component: () =>
                import ( /* webpackChunkName: "login" */ '../components/login.vue'),
        },

    ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}