/** 报价分享 */
const OfferSharing = () => import('@/components/offer/offerSharing.vue')
/** 报价详情 */
const OfferDetail = () => import('@/components/offer/offerDetail.vue')
/** 报价分享PC */
const OfferSharingPC = () => import('@/components/offer/offerSharingPC.vue')
/** 报价详情pc */
const OfferDetailPC = () => import('@/components/offer/offerDetailPC.vue')
/** 报价联系方式 */
const OfferContact = () => import('@/components/offer/offerContact.vue')
/** 报价联系方式pc */
const OfferContactPC = () => import('@/components/offer/offerContactPC.vue')
export default [
  {
    path: '/offerSharing',
    name: 'offerSharing',
    component: OfferSharing
  },
  {
    path: '/offerSharingPC',
    name: 'offerSharingPC',
    component: OfferSharingPC
  },
  {
    path: '/offerDetail/:pid/:id',
    name: 'offerDetail',
    component: OfferDetail
  },
  {
    path: '/offerDetailPC/:pid/:id',
    name: 'offerDetailPC',
    component: OfferDetailPC
  },
  {
    path: '/offerContact/:id',
    name: 'offerContact',
    component: OfferContact
  },
  {
    path: '/offerContactPC/:id',
    name: 'offerContactPC',
    component: OfferContactPC
  }
]
