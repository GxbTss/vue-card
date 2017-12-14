/**
 * Created by asyncguo on 2017/12/12.
 */
export default class RouterConfig {
  constructor (router) {
    this.router = router
  }
  render () {
    const router = this.router
    router.beforeEach((to, from, next) => {
      document.title = to.meta.title
      next()
    })
  }
}
