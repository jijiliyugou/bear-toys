
<template>
  <div class="offerDetailBox">
      <div class="topLayout">
      <div class="left">
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
      </div>
      <div class="middel">
          <van-notice-bar :scrollable="scrollable" :delay="0">
            {{(productInfo && productInfo.companyName) || '小竹熊  云科技'}}的分享
          </van-notice-bar>
      </div>
      <div class="right">
        <el-popover
          placement="bottom"
          title="复制链接地址"
          trigger="click">
           <div style="display:flex;align-items:center;">
            <div id="copyUrl" style="height:30px;border:1px solid #DCDFE6;line-height:30px;overflow: hidden;fontSize:0.16rem;white-space: nowrap;text-overflow:ellipsis;maxWidth: 5.333333rem" disabled>{{url}}</div><el-button size="small" @click="copyUrl">复制</el-button>
          </div>
          <el-button class="grid-content bg-purple offterBtn" slot="reference"><i class="offterShare el-icon-share"></i> 分享</el-button>
          </el-popover>
      </div>
    </div>
    <div class="offerInfo">
      <div class="navBar">
        <div class="navBarTitle">
          <span class="title">基本信息</span>
        </div>
      </div>
    </div>
    <el-card class="box-card">
      <div class="text-item" v-if="productInfo && productInfo.productOfferType === 'company'">公司名称：<span>{{ companyInfo && companyInfo.companyName }}</span></div>
      <div class="text-item" v-else>工厂名称：<span>{{ companyInfo && companyInfo.companyName }}</span></div>
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
      scrollable: false,
      url: window.location.href.split('/#/')[0] + '/#/offerSharing?id=' + this.$route.params.id,
      productInfo: null,
      companyInfo: null
    }
  },
  methods: {
    // 判断内容是否超过容器
    onScrollable () {
      var containerLength = $('.middel').width()
      var textLength = $('.van-notice-bar').width()
      console.log(textLength, containerLength)
      if (textLength > containerLength) {
        this.scrollable = true
      } else {
        this.scrollable = false
      }
    },
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
        this.$nextTick(() => {
          this.onScrollable()
        })
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
        params: { id: this.$route.params.id }
      })
    } else {
      this.$router.push({
        name: 'offerContactPC',
        params: { id: this.$route.params.id }
      })
    }
  },
  watch: {
    '$store.state.screenWidth' (val) {
      // 监听屏幕宽度变化
      if (val <= 1024) {
        this.$router.push({
          name: 'offerContactPC',
          params: { id: this.$route.params.id, companyNumber: this.$route.params.companyNumber }
        })
      } else {
        this.$router.push({
          name: 'offerContactPC',
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
  .offerInfo {
    .navBar {
      background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
      .navBarTitle {
        width: 95%;
        font-size: 0.32rem;
        height: 0.666667rem;
        display: flex;
        text-indent: 0.133333rem;
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
            width: 0.053333rem;
            background-color: #165af7;
            transform: translate(0, -50%);
            border-radius: 0 0.066667rem 0.066667rem 0;
          }
        }
      }
    }
  }
  .box-card {
    width: 95%;
    margin: 0 auto;
    .text-item {
      display: flex;
      align-items: center;
      height: 0.533333rem;
      padding: 5px 0;
      &.addr {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        cursor: pointer;
        height: 100%;
        .right {
          width: 16px;
          height: 16px;
          padding-top: 8px;
          float: right;
          background: url("~@/assets/images/分享定位地址.png") no-repeat center;
          background-size: 100%, 100%;
        }
      }
      &.lianxi {
        margin-top: 0.1rem;
        font-size: 16px;
        a {
          font-size: 0.33333rem;
          font-weight: 600;
        }
      }
    }
  }
  .fanhui{
    width: 95%;
    margin: 0 auto;
    margin-top: 0.266667rem;
    display: flex;
    justify-content: flex-end;
    .el-button{
        background-color:#165af7;
        color: #fff;
        @{deep} .iconfont{
            margin-right: 0.066667rem;
        }
    }
  }
  .topLayout{
  width: 95%;
  height: 1.066667rem;
  font-size: 0.32rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left{
    .el-image{
      width: 1.066667rem;
      height: 1.066667rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .middel{
    flex: 1;
    overflow: hidden;
    text-align: center;
    @{deep} .van-notice-bar{
      display: inline-block;
      word-break:keep-all;/* 不换行 */
      white-space:nowrap;/* 不换行 */
    }
  }
  .right {
    .el-popover__reference{
      background-color: transparent;
    }
    span{
      padding: 0;
      margin: 0;
      .el-button{
        color: #F7BA24;
        font-size: 0.3rem;
        padding: 0;
        border: none;
        cursor: pointer;
        i{
          font-size: 0.35rem;
        }
      }
    }
  }
}
}
</style>
