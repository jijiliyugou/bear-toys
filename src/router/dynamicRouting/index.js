/** 产品查询模块 */
import productSearch from '@/router/productSearch/index'
/** 系统管理模块 */
import systemManage from '@/router/systemManage/index'
/** 个人管理模块 */
import myManage from '@/router/myManage/index'
export default [...productSearch, ...systemManage, ...myManage]
