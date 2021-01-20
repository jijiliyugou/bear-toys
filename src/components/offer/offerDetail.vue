<template>
  <div class="baojia">
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
            {{(productInfo && productInfo.companyName) || '小竹熊 云科技'}}的分享
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
    <el-card class="box-card">
      <div class="textContent">
        <div class="offerParams">
          <div class="theme">
            {{ productInfo && productInfo.title }}
          </div>
          <div class="companyParams" v-if="productInfo && productInfo.productOfferType === 'company'">
            <p>联 系 人：<span>{{ productInfo && productInfo.linkman }}</span></p>
            <p>报价方式：<span>{{ productInfo && productInfo.offerMethod }}</span></p>
            <p>尺<em style="opacity: 0;">尺码</em>码：<span>{{ productInfo && productInfo.size }}</span></p>
          </div>
          <div class="supplierParams" v-else>
            <p>报价参数：<span>{{ productInfo && productInfo.baseNumber }}</span></p>
          </div>
        </div>
        <div class="dates">
          <p class="dateIconBox"><i class="dateIcon"></i>{{ productInfo && productInfo.createdOn && productInfo.createdOn.split('T')[0] }}</p>
          <a @click="toContact" class="lookInfo">查看联系方式></a>
        </div>
      </div>
    </el-card>
    <!-- <div class="backTo">
      <el-page-header
        @back="toOfferSharing"
        content="商品详情"
      ></el-page-header>
    </div> -->
    <div class="listTitle">
      <span class="listTitleTXT">商品详情</span>
      <span class="backtrack" @click="backtrackPage"><i class="backtrackIcon iconfont icon-fanhui"></i> 返回</span>
    </div>
    <!-- <div slot="header" class="detailTitle">
        <div class="titleText">商品详情</div>
      </div> -->
    <div class="centent"  v-if="productDetail">
      <div class="imgBox">
      <el-image :preview-src-list="[productDetail && productDetail.imageUrl]" style="width: 100%;height: 100%;"
      :src="productDetail && productDetail.imageUrl"
      fit="contain">
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
      <div class="cententText">
        <p class="textItem name">{{productDetail.name}}</p>
        <p class="textItem">出厂货号：{{productDetail.fa_no}}</p>
        <p class="textItem">包装方式：{{productDetail.ch_pa}}</p>
        <p class="textItem">样品规格：{{productDetail.pr_le + " X " + productDetail.pr_wi + " X " + productDetail.pr_hi + "(CM)"}}</p>
        <p class="textItem">包装规格：{{productDetail.in_le + " X " + productDetail.in_wi + " X " + productDetail.in_hi + "(CM)"}}</p>
        <p class="textItem">外箱规格：{{productDetail.ou_le + " X " + productDetail.ou_wi + " X " + productDetail.ou_hi + "(CM)"}}</p>
        <p class="textItem">装箱量：{{productDetail.in_en + "/" + productDetail.ou_lo + "(PCS)"}}</p>
        <p class="textItem">体积/材积：{{productDetail.bulk_stere + "(CBM)" + "/" + productDetail.bulk_feet + "(CUFT)"}}</p>
        <p class="textItem">毛重/净重：{{productDetail.ne_we + "/" + productDetail.gr_we + "(kg)"}}</p>
        <p class="textItem" v-show="productInfo && productInfo.productOfferType !== 'company'">出厂价：<span class="price" v-if="$_.isNumber(productDetail.unitPrice)">{{ '￥' + (productDetail.unitPrice && productDetail.unitPrice.toFixed(2)) }}</span></p>
        <p class="textItem">报价：<span class="price" v-if="$_.isNumber(productDetail.offerAmount)">{{productDetail.cu_de + productDetail.offerAmount.toFixed((productDetail.decimalPlaces || 2))}}</span></p>
      </div>
      <p class="createDate"><i class="createDateIcon"></i>{{productInfo && productInfo.createdOn.split('T')[0]}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      scrollable: false,
      url: window.location.href.split('/#/')[0] + '/#/offerSharing?id=' + this.$route.params.pid,
      productDetail: null,
      productInfo: null,
      currentPage: 1,
      pageSize: 10
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
    // 查看联系方式
    toContact () {
      this.$router.push({ name: 'offerContact', params: { id: this.$route.params.pid } })
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
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', { offerNumber: this.$route.params.pid })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
        document.title = this.productInfo.companyName
        this.$nextTick(() => {
          this.onScrollable()
        })
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取产品明细
    async getProductByNumber () {
      const res = await this.$http.post('/api/GetProductByProductNumber', {
        id: this.$route.params.id
      })
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductByNumber()
  },
  mounted () {
    if (this.$store.state.screenWidth > 1024) this.$router.push({ name: 'offerDetailPC', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
  },
  watch: {
    '$store.state.screenWidth' (val) {
      if (val > 1024) this.$router.push({ name: 'offerDetailPC', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
    }
  },
  beforeDestroy () {
    document.title = '小竹熊 云科技'
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.baojia {
  width: 100%;
  height: 100%;
  overflow: auto;
  font-size: 0.32rem;
  .item {
    margin-bottom: 0.24rem;
    &:last-of-type{
      margin-bottom: 0;
    }
  }
   .topLayout{
  width: 95%;
  height: 1.066667rem;
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
 .box-card {
    width: 95%;
    margin: 0 auto;
    border-radius: 0.133333rem;
    @{deep} .el-card__body{
      padding: 0 0.24rem;
    }
    .textContent {
      display: flex;
      flex-direction:column;
      justify-content: space-around;
      padding:0.133333rem 0;
      .offerParams{
      margin-bottom: 0.133333rem;
      border-radius: 0.066667rem;
      border-bottom: 1px solid #ccc;
        .theme {
          width: 50%;
          padding: 10px;
          font-weight: 600;
        }
      .companyParams{
        p{
          padding: 0.133333rem;
          display: flex;
          span{
            color: #c0c4cc;
          }
        }
      }
      .supplierParams{
        p {
          padding: 0.133333rem;
          span{
              color: #c0c4cc;
            }
        }
      }
    }
    .dates{
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #626262;
      .dateIconBox{
        display: flex;
        align-items: center;
        .dateIcon{
        width: 0.266667rem;
        height: 0.266667rem;
        margin-right: 0.066667rem;
        border-radius: 50%;
        overflow: hidden;
        background:url('~@/assets/images/报价分享时间.png') no-repeat center;
        background-size: contain;
        }
      }
      .lookInfo{
          color: #165af7;
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
    }
    }
  }
  .line{
    width: 100%;
    height: 100%;
    height: 0.266667rem;
    background: #F5F5F5;
  }
  .listTitle {
      width: 95%;
      margin: 0 auto;
      margin-top: 0.066667rem;
      height: 0.933333rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
      .listTitleTXT {
        position: relative;
        text-indent: 0.133333rem;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          height: 70%;
          width: 0.066667rem;
          background-color: #165af7;
          transform: translate(0, -50%);
          border-radius: 0 5px 5px 0;
        }
      }
      .backtrack{
        font-weight: normal;
        cursor: pointer;
        display: flex;
        align-items: center;
        i{
          margin-right: 0.066667rem;
        }
      }
    }
  .backTo{
    font-size: 0.24rem;
    padding: 0.133333rem;
    border-bottom: 1px solid #EBEEF5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .centent{
    padding: 0.133333rem;
    display: flex;
    font-size: 0.26rem;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .createDate{
      position: absolute;
      bottom: 0.24rem;
      left: 0.266667rem;
      display: flex;
      color: #707070;
      align-items: center;
      .createDateIcon{
        display: block;
        width: 0.266667rem;
        height: 0.266667rem;
        background: url('~@/assets/images/报价分享时间.png') no-repeat center;
        background-size:contain;
        margin-right: 0.066667rem;
      }
    }
    .imgBox{
      flex: 1;
      height: 100%;
      flex-wrap: wrap;
      align-items: center;
      padding-right: 0.133333rem;
      box-sizing: border-box;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .cententText{
      color: #707070;
      flex: 2;
      .textItem{
        margin-bottom: 0.133333rem;
        .price{
          color: #ff2505;
        }
      }
      .name{
        color: #000;
        font-weight: 600;
        font-size: 0.3rem;
      }
    }
  }
}
</style>
