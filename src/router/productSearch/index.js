const Collect = () => import('@/views/productSearch/Collect.vue')
const HotRecommend = () => import('@/views/productSearch/HotRecommend.vue')
const NewRecommend = () => import('@/views/productSearch/NewRecommend.vue')
const ProductSearch = () => import('@/views/productSearch/ProductSearch.vue')
export default [
  {
    path: '/productSearch',
    name: 'ProductSearch',
    component: ProductSearch
  },
  {
    path: '/collect',
    name: 'collect',
    component: Collect
  },
  {
    path: '/hotRecommend',
    name: 'hotRecommend',
    component: HotRecommend
  },
  {
    path: '/newRecommend',
    name: 'newRecommend',
    component: NewRecommend
  }
]
