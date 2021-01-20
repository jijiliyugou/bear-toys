/** 前台模块 */
import beforeModule from '@/router/beforrIndex/index'
/** 我的消息模块 */
import meInfo from '@/router/meInfo/index'
/** 订单管理模块 */
import orderManage from '@/router/orderManage/index'
/** 动态模块 */
import dynamicRouting from '@/router/dynamicRouting/index'
/** 个人中心模块 */
import me from '@/router/me/index'
/** 404模块 */
import _404 from '@/router/404/index'
/** ERP模块 */
import ERP from '@/router/ERP/index'
/** 不需要loadding的模块 */
import dontLoad from '@/router/dontLoad/index'
/** 报价分享模块 */
import offer from '@/router/offer/index'
/** 公共聊天模块 */
import publicChat from '@/router/publicChat/index'
/** 特殊搜索路由 */
const SearchIndex = () => import('@/views/productSearch/searchIndex.vue')
/** 静态路由 */
export const staticRouters = [
  beforeModule,
  orderManage,
  publicChat,
  me,
  meInfo,
  {
    path: '/searchIndex',
    name: 'searchIndex',
    component: SearchIndex
  },
  _404,
  ...ERP,
  ...dontLoad,
  ...offer,
  {
    path: '/',
    redirect: '/beforeIndex/home'
  }
]

export async function setMenuTree (menuTree) {
  const routerList = []
  if (menuTree) {
    for (let i = 0; i < menuTree.length; i++) {
      for (let j = 0; j < menuTree[i].children.length; j++) {
        for (const value of dynamicRouting) {
          if (value.path === menuTree[i].children[j].linkUrl) {
            routerList.push(value)
          }
        }
      }
    }
  }
  routerList.push({
    path: '*',
    redirect: '/404'
  })
  return routerList
}
