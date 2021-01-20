<template>
  <div class="box">
    <div class="topLaout">
      <el-breadcrumb class="navBar" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="contentWrap">
      <div class="left">
        <ul class="itemsTitle">
          <router-link
            class="itemTitle"
            tag="li"
            to="/beforeIndex/companyInfo/contactUs"
            >联系我们</router-link
          >
          <router-link
            class="itemTitle"
            tag="li"
            to="/beforeIndex/companyInfo/aboutUs"
            >关于我们</router-link
          >
          <router-link
            class="itemTitle"
            tag="li"
            to="/beforeIndex/companyInfo/termsService"
            >服务条款</router-link
          >
          <router-link
            class="itemTitle"
            tag="li"
            to="/beforeIndex/companyInfo/legalNotices"
            >法律声明</router-link
          >
          <router-link
            class="itemTitle"
            tag="li"
            to="/beforeIndex/companyInfo/privacyStatement"
            >隐私声明</router-link
          >
        </ul>
      </div>
      <div class="right">
        <router-view @editTitle="editTitle"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: null
    }
  },
  methods: {
    editTitle (val) {
      this.title = val
    }
  },
  created () {},
  mounted () {}
}
</script>
<style scoped lang="less">
.box {
  width: 100%;
  .topLaout {
    background: linear-gradient(#f5f5f5, #fff, #cfcfcf);
    .navBar {
      height: 50px;
      max-width: 1200px;
      min-width: 1024px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }
  }
  .contentWrap {
    max-width: 1200px;
    min-width: 1024px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .left {
      width: 280px;
      height: 350px;
      margin-right: 20px;
      box-shadow: 0px 2px 6px 0px rgba(4, 0, 0, 0.06);
      .itemsTitle {
        width: 100%;
        height: 350px;
        display: flex;
        flex-direction: column;
        .itemTitle {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            background: #f7f7f7;
          }
          &.router-link-active {
            background-color: #7d7d7d;
            color: white;
          }
        }
      }
    }
    .right {
      flex: 1;
    }
  }
}
</style>
