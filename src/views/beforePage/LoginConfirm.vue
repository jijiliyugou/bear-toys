<template>
  <div class="confirmBox">
    <ul>
      <li
        @click.prevent="toMeInfo(item)"
        v-for="(item, i) in this.commparnyList"
        :key="i"
      >
        <el-image class="img" :src="item.companyLogo" fit="cover">
          <div
            slot="error"
            class="image-slot"
            style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
          >
            {{ item.companyName }}
          </div>
          <div
            slot="placeholder"
            class="image-slot"
            style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
          >
            {{ item.companyName }}
          </div>
        </el-image>
        <p style="margin-left:20px;">{{ item.companyName }}</p>
      </li>
      <li class="testItem"></li>
    </ul>
  </div>
</template>

<script>
import { getMenuFuc } from '@/router/index'
export default {
  data () {
    return {
      radioValue: null,
      commparnyList: []
    }
  },
  methods: {
    // 获取系统参数
    async getClientTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        return res.data.result.item
      }
    },
    /**
     * 等待几秒后执行
     * @param {number} s 等待时间，单位s秒
     */
    async waitTime (s) {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 1000 * s)
      })
    },
    async toMeInfo (item) {
      const res = await this.$http.post('/api/UserAffiliateCompany', {
        UserId: this.$route.params.userInfo.id,
        CompanyNumber: item.companyNumber
      })
      if (res.data.result.isLogin) {
        // 设置token
        this.$store.commit('setToken', res.data.result)
        this.$store.commit(
          'setComparnyId',
          res.data.result.commparnyList[0].commparnyId
        )
        this.$store.commit('updateAppLoading', true)
        await this.waitTime(1)
        // 登录成功获取系统参数
        const Json = {}
        Json.MessageRestriction = await this.getClientTypeList(
          'MessageRestriction'
        )
        Json.UserRestrictions = await this.getClientTypeList(
          'UserRestrictions'
        )
        Json.NoticeRestrictions = await this.getClientTypeList(
          'NoticeRestrictions'
        )
        Json.CompanyRestrictions = await this.getClientTypeList(
          'CompanyRestrictions'
        )
        Json.PlatForm = await this.getClientTypeList('PlatForm')
        Json.packageManage = await this.getClientTypeList('packageManage')
        this.$store.commit('globalJson/setGlobalJson', Json)
        // 登录成功获取菜单
        try {
          const re = await this.$http.post('/api/GetUserRoleMenu', {})
          if (re.data.result.code === 200 && re.data.result.item) {
            this.$store.commit('handlerLogin', true)
            this.$store.commit(
              'setRouters',
              re.data.result.item.modulesList || []
            )
            await getMenuFuc()
          } else {
            this.$message.error(re.data.result.msg)
            this.$store.commit('removeLoginItems')
          }
          this.$router.push('/me')
          // let token = JSON.stringify(res.data.result);
          // location =
          //   "http://127.0.0.1:8081/#/meInfo/infoList?id=" +token
        } catch (error) {
          this.$store.commit('updateAppLoading', false)
          this.$message.error('获取菜单失败，请检查网络')
        }
      }
    }
  },
  async mounted () {
    if (!this.$route.params.commparnyList) {
      this.$router.push('/beforeIndex/login')
    } else {
      this.commparnyList = this.$route.params.commparnyList
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.confirmBox {
  max-width:1200px;
  min-width:1024px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
ul {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  &::after {
    content: "";
    width: 25%;
    box-sizing: border-box;
    padding: 0px 50px;
    margin: 20px;
  }
  li {
    border: 2px solid #e0f0ff;
    width: 25%;
    height: 100px;
    box-sizing: border-box;
    box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
    padding: 0px 50px;
    margin: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    @{deep} .img {
      width: 50px;
      height: 50px;
      background-color: #165af7;
      color: #fff;
      transition: all 1s;
      border-radius: 50%;
    }
    p {
      transition: all 1s;
    }
    &:hover {
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
      @{deep} .img,
      p {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
      }
    }
    &.testItem {
      border: none;
      height: 0;
      box-shadow: none;
    }
  }
}
</style>
