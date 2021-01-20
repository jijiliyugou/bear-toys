<template>
  <div>
    <ul>
      <li
        @click.prevent="toMeInfo(item)"
        v-for="(item, i) in this.commparnyList"
        :key="i"
      >
        <el-avatar :size="50" :src="item.companyLogo"></el-avatar>
        <p style="margin-left:20px;">{{ item.companyName }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commparnyList: null
    }
  },
  methods: {
    async toMeInfo (item) {
      const res = await this.$http.post('/api/UserAffiliateCompany', {
        UserId: this.$route.query.id,
        CompanyNumber: item.companyNumber
      })
      if (res.data.result.isLogin) {
        this.$store.commit('setToken', res.data.result)
        await this.waitTime(1)
        this.$router.push('/erpOrder')
      } else {
        this.$message.error('请求失败，请检查网络')
      }
    },
    async waitTime (s) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve()
        }, 1000 * s)
      })
    }
  },
  mounted () {
    if (this.$route.query.id === 'undefined') {
      this.$router.push('/erpLogin')
    }
    this.commparnyList = this.$store.state.userInfo.commparnyList
  }
}
</script>

<style lang="less" scoped>
ul {
  width: 800px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 200px;
  margin: 200px auto 50px auto;
  li {
    border: 2px solid #e1e1e1;
    height: 100%;
    padding: 0px 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
