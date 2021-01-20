
<template>
  <div class="offerDetailBox">
    <div class="topLayout">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-image fit="contain" :src="productInfo && productInfo.companyLogo" lazy>
            <div
              slot="placeholder"
              class="image-slot"
            >
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
            <div
              slot="error"
              class="image-slot"
            >
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
          </el-image>
        </el-col>
        <el-col :span="12"
          ><div class="grid-content bg-purple conText">{{(productInfo && productInfo.companyName) || '小竹熊 云科技'}}的分享</div></el-col
        >
         <el-col :span="6" style="display:flex;justify-content:flex-end">
         <el-popover
          placement="bottom"
          title="复制链接地址"
          trigger="click">
          <div style="display:flex;align-items:center;">
            <div id="copyUrl" style="height:30px;border:1px solid #DCDFE6;line-height: 30px;" disabled>{{url}}</div><el-button size="small" @click="copyUrl">复制</el-button>
          </div>
          <el-button class="grid-content bg-purple offterBtn" slot="reference"><i class="offterShare el-icon-share"></i> 分享</el-button>
          </el-popover>
          </el-col>
      </el-row>
    </div>
    <div class="offerInfo">
      <div class="navBar">
        <div class="navBarTitle">
          <span class="title">基本信息</span>
        </div>
      </div>
    </div>
    <el-card class="box-card">
      <div class="text-item">工厂名称：<span>{{ companyInfo && companyInfo.companyName }}</span></div>
      <div class="text-item addr" @click="openMap">
        <div class="left">
          地<em style="opacity: 0">地区</em>区：<span>{{ companyInfo && companyInfo.address }}</span>
        </div>
        <div class="right"></div>
      </div>
      <div class="text-item">产品数量：<span>{{ companyInfo && companyInfo.productCount }}</span></div>
      <div class="text-item lianxi">
        我要联系：
          <a :href="tel">{{ this.companyInfo ? (this.companyInfo.phoneNumber || this.companyInfo.telephoneNumber) : '' }}</a>
      </div>
    </el-card>
    <div class="fanhui">
        <el-button size="mini" @click="backtrackPage" round icon="iconfont icon-fanhui">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: window.location.href.split('/#/')[0] + '/#/offerSharing?id=' + this.$route.params.id,
      companyInfo: null,
      productInfo: null
    }
  },
  methods: {
    // 返回
    backtrackPage () {
      this.$router.go(-1)
    },
    // 复制
    copyUrl () {
      var div = document.getElementById('copyUrl')
      var range
      if (document.body.createTextRange) {
        range = document.body.createTextRange()
        range.moveToElementText(div)
        range.select()
      } else if (window.getSelection) {
        var selection = window.getSelection()
        range = document.createRange()
        range.selectNodeContents(div)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        console.warn('none')
      }
      document.execCommand('Copy') // 执行浏览器复制命令
      // console.warn('none')
      this.$message.success('已复制好，可贴粘。')
    },
    // 打开地图
    openMap () {
      const mapAttr =
        'https://api.map.baidu.com/geocoder?address=' +
        this.companyInfo.address +
        '&output=html&src=webapp.baidu.openAPIdemo'
      window.open(mapAttr)
    },
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', {
        offerNumber: this.$route.params.id
      })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
        document.title = this.productInfo.companyName
        this.getCompanyInfo()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取联系方式
    async getCompanyInfo () {
      const res = await this.$http.post('/api/GetCompanyInfo', {
        hallNumber: this.productInfo.companyNumber
      })
      console.log(res)
      if (res.data.result.code === 200) {
        this.companyInfo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductOfferByNumber()
  },
  mounted () {
    if (this.$store.state.screenWidth <= 1024) {
      this.$router.push({
        name: 'offerContact',
        params: { id: this.$route.params.id, companyNumber: this.$route.params.companyNumber }
      })
    }
  },
  watch: {
    '$store.state.screenWidth' (val) {
      // 监听屏幕宽度变化
      if (val <= 1024) {
        this.$router.push({
          name: 'offerContact',
          params: { id: this.$route.params.id, companyNumber: this.$route.params.companyNumber }
        })
      }
    }
  },
  computed: {
    tel () {
      return 'tel:' + (this.companyInfo ? (this.companyInfo.phoneNumber || this.companyInfo.telephoneNumber) : '')
    }
  },
  beforeDestroy () {
    document.title = '小竹熊 云科技'
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.offerDetailBox {
  .topLayout {
    width: 900px;
    margin: 0 auto;
    .el-row {
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-col {
      .el-image{
        width: 80px;
        height: 80px;
        img{
          width: 80px;
          height: 80px;
        }
      }
    }
      .conText {
        text-align: center;
        color: #165bf7;
        font-size: 30px;
      }
      .offterBtn{
      color: #F7BA24;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
      border: none;
      @{deep} span{
        display: flex;
        align-items: center;
      }
      .offterShare{
        font-size: 30px;
      }
    }
      .el-popover__reference{
      background-color: transparent;
    }
    }
  }
  .offerInfo {
    .navBar {
      background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
      .navBarTitle {
        font-size: 24px;
        height: 50px;
        display: flex;
        width: 900px;
        text-indent: 10px;
        margin: 0 auto;
        align-items: center;
        .title {
          position: relative;
          font-weight: 600;
          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            height: 70%;
            width: 4px;
            background-color: #165af7;
            transform: translate(0, -50%);
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }
  }
  .box-card {
    width: 900px;
    margin: 0 auto;
    .text-item {
      display: flex;
      align-items: center;
      height: 40px;
      &.addr {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        // &:hover{
        //     color: #165af7;
        // }
        .right {
          width: 20px;
          height: 20px;
          background: url("~@/assets/images/分享定位地址.png") no-repeat center;
          background-size: contain;
        }
      }
      &.lianxi {
        margin-top: 30px;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
  .fanhui{
    width: 900px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    .el-button{
        background-color:#165af7;
        color: #fff;
        @{deep} .iconfont{
            margin-right: 5px;
        }
    }
  }
}
</style>
