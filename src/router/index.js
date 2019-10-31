import Vue from 'vue'
import Router from 'vue-router'
import Connection from '@/components/Connection'
import ChainState from '@/components/ChainState'
import Account from '@/components/Account'
import Transaction from '@/components/Transaction'
import AboutMe from '@/components/AboutMe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default',
      component: Connection
    },
    {
      path: '/Connection',
      name: 'Connection',
      component: Connection
    },
    {
      path: '/ChainState',
      name: 'ChainState',
      component: ChainState
    },
    {
      path: '/Account',
      name: 'Account',
      component: Account
    },
    {
      path: '/Transaction',
      name: 'Transaction',
      component: Transaction
    },
    {
      path: '/AboutMe',
      name: 'AboutMe',
      component: AboutMe
    }
  ]
})
