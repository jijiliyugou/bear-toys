<template>
  <div class="box">
    <header class="top">
      <div class="left">
        <span class="title">CONTACT US</span>
        <div class="pList">
          <p>您是否希望了解更多关于我们？</p>
          <p>您是否对我们的产品和服务感兴趣？</p>
          <p>请随时与我们联系，</p>
          <p>我们将乐于与您探讨合作事宜。</p>
        </div>
        <div class="dianList">
          <span class="dian"></span>
          <span class="dian"></span>
          <span class="dian"></span>
          <span class="dian"></span>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <p class="el-icon-printer myicon"></p>
          <p class="title">传真</p>
          <p class="content">0755-23963365</p>
        </div>
        <div class="item">
          <p class="el-icon-message myicon"></p>
          <p class="title">邮件</p>
          <p class="content">Toys@Toysbao.com</p>
        </div>
        <div class="item">
          <p class="el-icon-phone-outline myicon"></p>
          <p class="title">电话</p>
          <p class="content">0755-28963362</p>
        </div>
        <div class="item">
          <p class="el-icon-map-location myicon"></p>
          <p class="title">地址</p>
          <p class="content">民乐科技大厦205室</p>
        </div>
      </div>
    </header>
    <footer>
      <BMapComponent
        :addr="noticeData"
        v-if="noticeData"
      ></BMapComponent>
    </footer>
  </div>
</template>

<script>
import BMapComponent from '@/components/map.vue'
export default {
  components: { BMapComponent },
  data () {
    return {
      noticeData: {
        address: '深圳市龙岗区坂田街道民乐科技大厦205室',
        appLoginCount: 0,
        audit_state: '1',
        companyAPI: null,
        companyKeyCode: null,
        companyLogo: require('@/assets/images/imgError.jpg'),
        companyName: '深圳宏煌网络科技有限公司',
        companyNumber: 'HS0010552',
        companyType: 'Exhibition',
        contactsMan: '陈总',
        country: '测试展厅',
        createdBy: null,
        createdOn: '2020-09-08T14:06:46.5104435+08:00',
        deleteBy: null,
        deleteTime: '0001-01-01T00:00:00',
        e_mail: '864281822@qq.com',
        erpLoginCount: 0,
        fax: null,
        groupNumber: null,
        homepage: null,
        id: '0048f79f-1350-4c4b-8445-dabd5adb6a3a',
        isDelete: false,
        modifyBy: null,
        modifyOn: '0001-01-01T00:00:00',
        msn: null,
        phoneNumber: '15817965444',
        qq: '864281822',
        remark: null,
        skype: null,
        telephoneNumber: null
      },
      myAttress: ''
    }
  },
  methods: {
    // 回到顶部
    toTop () {
      $('#app').animate({ scrollTop: 0 })
    },
    async getAttrs () {
      const res = await $.ajax({
        type: 'get',
        url: 'https://api.map.baidu.com/geocoding/v3/',
        data: {
          address: this.noticeData.address,
          output: 'json',
          ak: 'rUWcCk2v5nZCx864jziBKuy1klV2YtrK'
        },
        dataType: 'jsonp'
      })
      if (res.status === 0) {
        this.myAttress = res.result.location
        console.log(this.myAttress)
      }
    }
  },
  created () {},
  mounted () {
    this.getAttrs()
    this.$emit('editTitle', '联系我们')
  }
}
</script>
<style scoped lang="less">
@deep: ~">>>";
.box {
  width: 100%;
  height: 1024px;
  background: #f5f7f9;
  box-shadow: 0px 2px 6px 0px rgba(4, 0, 0, 0.06);
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  .el-button {
    position: absolute;
    right: 0;
    bottom: 0;
    @{deep} i {
      -webkit-transform: scale(2);
      -moz-transform: scale(2);
      -ms-transform: scale(2);
      transform: scale(2);
    }
  }
  .top {
    height: 320px;
    display: flex;
    box-sizing: border-box;
    padding-bottom: 72px;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span.title {
        position: relative;
        padding-left: 60px;
        font-size: 14px;
        color: #696969;
        &::before {
          content: "";
          position: absolute;
          width: 40px;
          height: 3px;
          background-color: #696969;
          top: 50%;
          left: 0;
          background: #696969;
          transform: translate(0, -50%);
        }
      }
      .pList {
        height: 138px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .dianList {
        display: flex;
        .dian {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          border-radius: 50%;
          &:nth-of-type(1) {
            background-color: #0c88ef;
          }
          &:nth-of-type(2) {
            background-color: #e60023;
          }
          &:nth-of-type(3) {
            background-color: #d54b3d;
          }
          &:nth-of-type(4) {
            background-color: #1a91da;
          }
        }
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 50%;
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        .myicon {
          font-size: 30px;
          color: #696969;
        }
        .title {
          color: #696969;
        }
        .content {
          font-weight: 500;
        }
        &:nth-of-type(1) {
          padding-bottom: 22px;
        }
        &:nth-of-type(2) {
          padding-bottom: 22px;
        }
        &:nth-of-type(3) {
          padding-top: 22px;
        }
        &:nth-of-type(4) {
          padding-top: 22px;
        }
      }
    }
  }
  footer {
    flex: 1;
  }
}
</style>
