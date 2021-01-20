const SystemParams = () => import('@/views/systemManage/SystemParams.vue')
const RoleManage = () => import('@/views/systemManage/RoleManage.vue')
const MenuManage = () => import('@/views/systemManage/MenuManage.vue')
const ClientManage = () => import('@/views/systemManage/ClientManage.vue')
const CategoryMan = () => import('@/views/systemManage/categoryMan.vue')
const ReportReview = () => import('@/views/systemManage/reportReview.vue')
const AppVersion = () => import('@/views/systemManage/appVersion.vue')
const ErrorLog = () => import('@/views/systemManage/errorLog.vue')
const SMSMan = () => import('@/views/systemManage/SMSMan.vue')
const CateAllocation = () => import('@/views/systemManage/cateAllocation.vue')
const TouristMan = () => import('@/views/systemManage/touristMan.vue')
const ProductPackAllocation = () => import('@/views/systemManage/productPackAllocation.vue')
const ProductPackMan = () => import('@/views/systemManage/productPackMan.vue')
const ClientMerge = () => import('@/views/systemManage/clientMerge.vue')
const AppLoginRecord = () => import('@/views/systemManage/appLoginRecord.vue')
const SeeProductRecordCount = () => import('@/views/systemManage/seeProductRecordCount.vue')
const DownloadStatistics = () => import('@/views/systemManage/downloadStatistics.vue')
const VipSpotNewProductsMan = () => import('@/views/systemManage/vipSpotNewProductsMan.vue')

export default [
  {
    path: '/systemParams',
    name: 'SystemParams',
    component: SystemParams
  },
  {
    path: '/roleManage',
    name: 'RoleManage',
    component: RoleManage
  },
  {
    path: '/menuManage',
    name: 'MenuManage',
    component: MenuManage
  },
  {
    path: '/clientManage',
    name: 'ClientManage',
    component: ClientManage
  },
  {
    path: '/categoryMan',
    name: 'categoryMan',
    component: CategoryMan
  },
  {
    path: '/reportReview',
    name: 'reportReview',
    component: ReportReview
  },
  {
    path: '/appVersion',
    name: 'appVersion',
    component: AppVersion
  },
  {
    path: '/errorLog',
    name: 'errorLog',
    component: ErrorLog
  },
  {
    path: '/SMSMan',
    name: 'SMSMan',
    component: SMSMan
  },
  {
    path: '/cateAllocation',
    name: 'cateAllocation',
    component: CateAllocation
  },
  {
    path: '/touristMan',
    name: 'touristMan',
    component: TouristMan
  },
  {
    path: '/productPackAllocation',
    name: 'productPackAllocation',
    component: ProductPackAllocation
  },
  {
    path: '/clientMerge',
    name: 'clientMerge',
    component: ClientMerge
  },
  {
    path: '/productPackMan',
    name: 'productPackMan',
    component: ProductPackMan
  },
  {
    path: '/appLoginRecord',
    name: 'appLoginRecord',
    component: AppLoginRecord
  },
  {
    path: '/seeProductRecordCount',
    name: 'seeProductRecordCount',
    component: SeeProductRecordCount
  },
  {
    path: '/downloadStatistics',
    name: 'downloadStatistics',
    component: DownloadStatistics
  },
  {
    path: '/vipSpotNewProductsMan',
    name: 'vipSpotNewProductsMan',
    component: VipSpotNewProductsMan
  }
]
