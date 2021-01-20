<template>
  <div style="min-height:569px;">
    <div class="DetailLogo"></div>
    <div class="navBar">
      <div class="navBarTitle">
        {{$route.params.title}}
      </div>
    </div>
    <div class="contactTable">
      <h2 class="companyName">{{ noticeData && noticeData.companyName }}</h2>
      <div class="tableInfo">
        <ul>
          <li class="infoItem">
            <div class="title el-icon-office-building">
              <span>公司名：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.companyName }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-user">
              <span>联系人：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.contactsMan }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-mobile-phone">
              <span>移动电话：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.phoneNumber }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-message">
              <span>电子邮箱：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.e_mail }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-phone-outline">
              <span>联系电话：</span>
            </div>
            <div class="text">
              {{ noticeData && noticeData.telephoneNumber }}
            </div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-printer">
              <span>传真号：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.fax }}</div>
          </li>

          <li class="infoItem">
            <div class="title iconfont icon-QQ3">
              <span>QQ号：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.qq }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-map-location">
              <span>公司地址：</span>
            </div>
            <div class="text">{{ noticeData && noticeData.address }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      noticeData: null
    }
  },
  methods: {
    async getCompanyByNumber () {
      const res = await this.$http.post('/api/CompanyByID', {
        companyNumber: this.$route.params.id
      })
      if (res.data.result.code === 200) {
        this.noticeData = res.data.result.item
      }
    }
  },
  mounted () {
    this.getCompanyByNumber()
  }
}
</script>
<style scoped lang="less">
.DetailLogo {
  width: 100%;
  height: 280px;
  background: url("~@/assets/images/companyLianxi.jpg") no-repeat center;
  background-size: cover;
}
.navBar {
  background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
  .navBarTitle {
    height: 50px;
    display: flex;
    max-width: 1200px;
    min-width: 1024px;
    margin: 0 auto;
    align-items: center;
  }
}
.contactTable {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .companyName {
    padding: 34px 0;
    font-weight: 400;
  }
  .tableInfo {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .infoItem {
        width: 49%;
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 50px;
        margin-bottom: 20px;
        border: 1px solid rgba(206, 214, 212, 1);
        border-radius: 8px;
        .title {
          padding-left: 35px;
          width: 200px;
          height: 100%;
          display: flex;
          align-items: center;
          font-weight: 400;
          border-right: 1px solid rgba(206, 214, 212, 1);
          background: rgba(247, 247, 247, 1);
          span {
            margin-left: 10px;
          }
        }
        .text {
          flex: 1;
          padding: 0 20px;
        }
      }
    }
  }
}
</style>
