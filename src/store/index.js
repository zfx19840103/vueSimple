import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    state:{
        //存放的键值对就是所要管理的状态
        list: { //list页面的
            id: 1,
            name: '用户名',
            phone: '14533341123',
            address: '送快递放假啊可是发动机'
        }
    },
    mutations:{
        //es6语法，等同edit:funcion(){...}
        edit(state, payload){
            // state.list.name = 'jack';

            console.log(payload)
        }
    },
    getters: {
        nameinfo(state, getters) {
            console.log(state, getters)
        }
    },
    aEdit(context,payload){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                context.commit('edit',payload)
                resolve()
            },2000)
        })
    }
})

export default store