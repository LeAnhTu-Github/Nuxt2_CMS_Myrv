import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2c4a6a42 = () => interopDefault(import('../pages/auth/sign-in.vue' /* webpackChunkName: "pages/auth/sign-in" */))
const _158e74a8 = () => interopDefault(import('../pages/dashboard/overview/index.vue' /* webpackChunkName: "pages/dashboard/overview/index" */))
const _c71e61de = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/auth/sign-in",
    component: _2c4a6a42,
    name: "auth-sign-in"
  }, {
    path: "/dashboard/overview",
    component: _158e74a8,
    name: "dashboard-overview"
  }, {
    path: "/",
    component: _c71e61de,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
