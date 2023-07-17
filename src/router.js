// import Vue from 'vue'
import VueRouter from 'vue-router'

import Chat from './Chat'
import Login from './Login'
import HelloMsg from './HelloMsg'

Vue.use(VueRouter)

export default new VueRouter({
  history: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/chat'
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/hellomsg',
      name: 'hellomsg',
      component: HelloMsg
    }
  ]
})
