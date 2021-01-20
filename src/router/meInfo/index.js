const MeInfo = () => import('@/views/meInfo/MeInfo.vue')
const InfoList = () => import('@/views/meInfo/infoList/InfoList.vue')
const FindList = () => import('@/views/meInfo/findList/FindList.vue')
const NewSletter = () => import('@/views/meInfo/newSletter/NewSletter.vue')

export default {
  path: '/meInfo',
  name: 'meInfo',
  component: MeInfo,
  children: [
    {
      path: 'infoList',
      name: 'InfoList',
      component: InfoList
    },
    {
      path: 'findList',
      name: 'FindList',
      component: FindList
    },
    {
      path: 'newSletter',
      name: 'NewSletter',
      component: NewSletter
    },
    {
      path: '/meInfo',
      redirect: '/meInfo/infoList'
    }
  ]
}
