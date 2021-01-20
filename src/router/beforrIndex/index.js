const Home = () => import('@/views/beforePage/Home.vue')
const BeforeIndex = () => import('@/views/beforePage/BeforeIndex.vue')
const Login = () => import('@/views/beforePage/Login.vue')
const LoginConfirm = () => import('@/views/beforePage/LoginConfirm.vue')
const Showroom = () => import('@/views/beforePage/Showroom.vue')
const Buyers = () => import('@/views/beforePage/Buyers.vue')
const Supplier = () => import('@/views/beforePage/Supplier.vue')
const Product = () => import('@/views/beforePage/Product.vue')
const FindSamInfo = () => import('@/views/beforePage/FindSamInfo.vue')
const Exhibition = () => import('@/views/beforePage/Exhibition.vue')
const PurchaseInfo = () => import('@/views/beforePage/PurchaseInfo.vue')
const NoticeDetail = () => import('@/views/beforePage/NoticeDetail')
const CompanyDetail = () => import('@/views/beforePage/CompanyDetail')
const ProductDetail = () => import('@/views/beforePage/productDetail')
const ShowRoomDetail = () => import('@/views/beforePage/showRoomDetail')
const CompanyInfo = () => import('@/views/beforePage/companyInfo')
const ContactUs = () => import('@/views/beforePage/companyInfo/contactUs')
const AboutUs = () => import('@/views/beforePage/companyInfo/aboutUs')
const TermsService = () =>
  import('@/views/beforePage/companyInfo/termsService')
const LegalNotices = () =>
  import('@/views/beforePage/companyInfo/legalNotices')
const PrivacyStatement = () =>
  import('@/views/beforePage/companyInfo/privacyStatement')

export default {
  path: '/beforeIndex',
  name: 'BeforeIndex',
  component: BeforeIndex,
  children: [
    {
      path: 'home',
      name: 'Home',
      component: Home
    },
    {
      path: 'login',
      name: 'Login',
      component: Login
    },
    {
      path: 'loginConfirm',
      name: 'LoginConfirm',
      component: LoginConfirm
    },
    {
      path: 'showroom',
      name: 'Showroom',
      component: Showroom
    },
    {
      path: 'showRoomDetail/:id',
      name: 'ShowRoomDetail',
      component: ShowRoomDetail
    },
    {
      path: 'buyers',
      name: 'Buyers',
      component: Buyers
    },
    {
      path: 'supplier',
      name: 'Supplier',
      component: Supplier
    },
    {
      path: 'product',
      name: 'Product',
      component: Product
    },
    {
      path: 'productDetail/:id',
      name: 'ProductDetail',
      component: ProductDetail
    },
    {
      path: 'findSamInfo',
      name: 'FindSamInfo',
      component: FindSamInfo
    },
    {
      path: 'purchaseInfo',
      name: 'PurchaseInfo',
      component: PurchaseInfo
    },
    {
      path: 'exhibition',
      name: 'Exhibition',
      component: Exhibition
    },
    {
      path: 'noticeDetail/:id',
      name: 'noticeDetail',
      component: NoticeDetail
    },
    {
      path: 'companyDetail/:id',
      name: 'companyDetail',
      component: CompanyDetail
    },
    {
      path: 'companyInfo',
      name: 'companyInfo',
      component: CompanyInfo,
      children: [
        {
          path: 'contactUs',
          name: 'contactUs',
          component: ContactUs
        },
        {
          path: 'aboutUs',
          name: 'aboutUs',
          component: AboutUs
        },
        {
          path: 'termsService',
          name: 'termsService',
          component: TermsService
        },
        {
          path: 'legalNotices',
          name: 'legalNotices',
          component: LegalNotices
        },
        {
          path: 'privacyStatement',
          name: 'privacyStatement',
          component: PrivacyStatement
        },
        {
          path: '/beforeIndex/companyInfo',
          redirect: 'contactUs'
        }
      ]
    },
    {
      path: '/beforeIndex',
      redirect: 'home'
    }
  ]
}
