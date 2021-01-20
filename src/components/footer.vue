<template>
  <div class="footer">
    <div class="footerBox">
      <div class="left">
        <p class="contactMe" @click="$router.push('/beforeIndex/companyInfo/contactUs')">
          联系我们
        </p>
        <p class="contactMe" @click="$router.push('/beforeIndex/companyInfo/aboutUs')">
          关于小竹熊 云科技
        </p>
        <p class="contactMe" @click="$router.push('/beforeIndex/companyInfo/termsService')">
          服务条款
        </p>
        <p class="contactMe" @click="$router.push('/beforeIndex/companyInfo/legalNotices')">
          法律声明
        </p>
        <p class="contactMe" @click="$router.push('/beforeIndex/companyInfo/privacyStatement')">
          隐私声明
        </p>
      </div>
      <div class="right">
        <p class="contactMe">
          Copyright©<span>{{ year }}</span>深圳宏升软件技术开发有限公司
          <span> 粤ICP备13031421号-4 </span>
          <img src="~@/assets/images/cnzz.gif" alt="" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
  },
  computed: {
    year () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  background-color: #fbfbfb;
  box-sizing: border-box;
  font-size: 12px;
  color: #777777;
  .footerBox{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    min-width: 900px;
    .left{
      flex: 1;
      display: flex;
      align-items: center;
      .contactMe{
        margin-right: 50px;
        cursor: pointer;
        &:hover{
          color: #3872f8;
        }
      }
    }
    .right{
      .contactMe{
        display: flex;
        align-items: center;
        span{
          margin: 0 5px;
        }
      }
    }
  }
}
</style>
