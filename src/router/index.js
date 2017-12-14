import Vue from 'vue'
import Router from 'vue-router'
import Config from './config'

Vue.use(Router)

const CreditCar = () => import('@/components/CreditCar')

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'creditcar',
      component: CreditCar,
      meta: {
        title: '信用卡'
      }
    }
  ]
})

new Config(router).render()

export default router
