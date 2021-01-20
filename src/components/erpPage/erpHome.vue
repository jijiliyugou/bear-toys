<template>
  <div class="erpHomeBox">
    <div class="erweimaApp" @mouseenter="hoverLogo" @mouseleave="hoverIsLogo">
      <img class="jiaerweima" :src="jiaerweima" alt="" />
      <div class="saomaDiv" v-show="isActive">
        <div class="saoma"></div>
      </div>
    </div>
    <div class="titleBox">
      <div class="logo">
        <img src="~@/assets/images/logo.png" alt="" />
      </div>
      <h1 class="title">宏升合作展厅</h1>
      <div class="titleEn">
        <span class="titleEnSpan">Partners</span>
      </div>
    </div>
    <div class="Showroom">
      <li
        class="room"
        v-for="(item, index) in orgCompanyList"
        @click="topCompany(item)"
        :key="index"
      >
        <div class="myimg">
          <el-image
            style="height:100px;display:flex;align-items:center;"
            :src="item.companyLogo"
            fit="contain"
          >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 80px; margin: 0 auto"
          >
            <img
              class="errorImg"
              style="width: 80px;"
              src="~@/assets/images/imgError.jpg"
              alt
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 80px; margin: 0 auto"
          >
            <img
              class="errorImg"
              style="width: 80px;"
              src="~@/assets/images/imgError.jpg"
              alt
            />
          </div>
          </el-image>
        </div>
        <div class="text">{{ item.companyName }}</div>
      </li>
    </div>
    <div class="titleBox">
      <h1 class="title">新品推荐</h1>
      <div class="titleEn">
        <span class="titleEnSpan">New Products</span>
      </div>
    </div>
    <div class="mySwiper" @mouseenter="boxEnter" @mouseleave="boxleave">
      <swiper
        v-if="dataList.length"
        :dataList="dataList"
        :speed="2"
        :direction="direction"
        :isShow="isShow"
      ></swiper>
    </div>
    <div class="footer">
      <el-button type="primary" @click="toLogins">同步订单</el-button>
    </div>
  </div>
</template>

<script>
import swiper from '@/components/minSwiper'
export default {
  components: {
    swiper
  },
  data () {
    return {
      jiaerweima: require('@/assets/images/erweimaicon@2x.png'),
      isActive: false,
      isShow: false,
      currentPage: 1,
      pageSize: 10,
      direction: 'left',
      dataList: [],
      token: null,
      orgCompanyList: []
    }
  },
  methods: {
    hoverLogo () {
      this.isActive = true
      this.jiaerweima = require('@/assets/images/erweima2.png')
    },
    hoverIsLogo () {
      this.jiaerweima = require('@/assets/images/erweimaicon@2x.png')
      this.isActive = false
    },
    // 获取新品推荐
    async getNewArrivalsPage () {
      const res = await this.$http.post('/api/GetNewArrivalsPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        AuditStatus: 0
      })
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.items
      }
    },
    // 获取展厅
    async getOrgCompany () {
      const res = await this.$http.post('/api/CompanyManagementPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        companyType: 'Exhibition'
      })
      if (res.data.result.code === 200) {
        this.orgCompanyList = res.data.result.item.items
      }
    },
    // 去公司
    topCompany (item) {
      const href = this.$router.resolve({
        name: 'ShowRoomDetail',
        params: { id: item.companyNumber }
      })
      window.open(href.href, '_blank')
    },
    // 去登录页
    toLogins () {
      this.$router.push('/erpLogin')
    },
    boxEnter () {
      this.isShow = true
    },
    boxleave () {
      this.isShow = false
    }
  },
  mounted () {
    this.getNewArrivalsPage()
    this.getOrgCompany()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
[v-cloak] {
  display: none;
}
.erpHomeBox {
  width: 800px;
  height: 800px;
  background: url("~@/assets/images/erpbg.png") no-repeat center;
  background-size: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px 40px 0 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .erweimaApp {
    position: absolute;
    right: 0;
    top: 90px;
    width: 34px;
    height: 34px;
    border: 1px solid #165af7;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(0, -50%);
    &:hover {
      background-color: #165af7;
    }
    .jiaerweima {
      width: 18px;
      height: 18px;
      left: -50%;
      top: 50%;
    }
    .saomaDiv {
      position: absolute;
      width: 120px;
      height: 100px;
      left: -110px;
      .saoma {
        width: 100px;
        height: 100px;
        position: absolute;
        box-sizing: border-box;
        background: url("~@/assets/images/erweimaxiazai.png") no-repeat center;
        background-size: 100%;
        &::after {
          content: "";
          display: block;
          position: absolute;
          right: -19px;
          top: 50%;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-left-color: #fff;
          transform: translate(0, -50%);
        }
      }
    }
  }
  .titleBox {
    height: 100px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
    .title {
      width: 100%;
      font-size: 25px;
      padding: 0;
      margin: 0;
      vertical-align: top;
      font-family: Source Han Sans CN;
      font-weight: 500;
      margin-bottom: 12px;
      color: #000000;
    }
    .logo {
      position: absolute;
      top: 50%;
      height: 72px;
      left: 0;
      transform: translate(0, -50%);
      img {
        height: 72px;
      }
    }
    .titleEn {
      width: 100%;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      .titleEnSpan {
        position: relative;
        padding: 0 10px;
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 60px;
          height: 2px;
          background-color: #165af7;
          top: 50%;
        }
        &::before {
          left: 100%;
        }
        &::after {
          right: 100%;
        }
      }
    }
  }
  .Showroom {
    width: 100%;
    max-height: 260px;
    overflow: auto;
    box-sizing: border-box;
    border: 1px solid #d6e8fe;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-right: 11px;
    &::after {
      content: "";
      width: 210px;
      margin: 20px 0 0 20px;
    }
    .room {
      width: 210px;
      height: 100px;
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
      margin: 20px 0 0 20px;
      cursor: pointer;
      display: flex;
      .myimg {
        width: 80px;
        @{deep} .el-image {
          position: static;
          img {
            transition: all 1s;
          }
        }
      }
      .text {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:hover {
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
        @{deep} .el-image {
          img {
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
          }
        }
      }
    }
  }
  .mySwiper {
    border: 1px solid #d6e8fe;
    width: 100%;
    height: 200px;
    .swiperTitle {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        cursor: pointer;
      }
      .right {
        font-size: 12px;
        color: #aaa;
        cursor: pointer;
      }
    }
  }
  .footer {
    margin-top: 20px;
    height: 64px;
    display: flex;
    justify-content: center;
    .el-button {
      width: 320px;
      height: 64px;
      background-color: #165af7;
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      border-radius: 10px;
      &:hover {
        opacity: 0.9;
      }
    }
  }
}

// @media screen and (max-width: 1024px) {
// }
</style>
