import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import $Store from '../store'
import { staticRouters, setMenuTree } from './routers'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const getToken = () => {
  // eslint-disable-next-line promise/param-names
  return new Promise((result, reject) => {
    axios
      .post('/api/GetToken', {
        companyNum: 'LittleBearWeb',
        platForm: 'PC'
      })
      .then(res => {
        if (res.data.result.code === 200) {
          result(res.data.result.item)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
Vue.use(VueRouter)
export const router = new VueRouter({
  linkActiveClass: 'router-link-active',
  mode: 'hash',
  // mode: "history",
  routes: staticRouters
})
export async function getMenuFuc () {
  const list = $Store.state.routers
  const routers = await setMenuTree(list)
  router.addRoutes(routers)
}
// 拦截
router.beforeEach(async (to, from, next) => {
  // 如果没有登录token
  if (!$Store.state.userInfo || !$Store.state.userInfo.accessToken) {
    const res = await getToken()
    const obj = ((typeof res === 'string') && res.constructor === String) ? { accessToken: res } : null
    $Store.commit('setToken', obj)
    if (to.path.includes('/beforeIndex') || to.path.includes('/erp') || to.path.includes('/offer') || to.path.includes('/publicChat') || to.path.includes('/dontLoad')) {
      next()
    } else {
      return next({ path: '/beforeIndex/login' })
    }
  } else { // 如果有登录token
    if (to.path.includes('/beforeIndex') || to.path.includes('/erp') || to.path.includes('/offer') || to.path.includes('/publicChat') || to.path.includes('/dontLoad')) {
      next()
    } else {
      if ($Store.state.isLogin) {
        next()
      } else {
        // 如果有token但是没有经过正规登录
        return next({ path: '/beforeIndex/login' })
      }
    }
  }
  // 切换域名配置
  // if (to.name === "InfoList" && to.query.id) {
  //   let userInfo = JSON.parse(to.query.id)
  //   console.log(to.query, to);
  //   // $Store.commit("setToken", userInfo);
  //   $Store.commit(
  //     "setComparnyId",
  //     userInfo.commparnyList[0].commparnyId
  //   );
  //   try {
  //     let re = await axios.post("/api/GetUserRoleMenu", {}, { headers: { Utoken: userInfo.accessToken } });
  //     if (re.data.result.code === 200 && re.data.result.item) {
  //       $Store.commit("handlerLogin", true);
  //       $Store.commit("setRouters", re.data.result.item.modulesList);
  //       await getMenuFuc();
  //     } else {
  //       $Store.commit("removeLoginItems");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // if (to.name === "Login" && to.query.id) {
  //   $Store.commit("removeLoginItems");
  // }
})
// 路由报错
router.onError(error => {
  console.log(error)
  // 已有路由未配置页面文件的情况下就乖乖去404吧
  router.push('/404')
})
