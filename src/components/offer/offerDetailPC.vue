
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
        <el-col :span="12"><div class="grid-content bg-purple conText">{{(productInfo && productInfo.companyName) || '小竹熊 云科技'}}的分享</div></el-col>
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
        <span class="title">报价信息</span>
      </div>
    </div>
    </div>
    <div class="offerInfoContent">
      <el-card class="offerCard">
        <div class="offerParams">
         <div class="top">
            <div class="theme">
            {{ productInfo && productInfo.title }}
            </div>
            <div class="contacts">
              <p>联 系 人：<span>{{ productInfo && productInfo.linkman }}</span></p>
            </div>
          </div>
          <div class="companyParams" v-if="productInfo && productInfo.productOfferType === 'company'">
            <div class="left">
              <p>报价方式：<span>{{ productInfo && productInfo.offerMethod }}</span></p>
            </div>
            <div class="right">
              <p>尺<em style="opacity: 0;">尺码</em>码：<span>{{ productInfo && productInfo.size }}</span></p>
            </div>
          </div>
          <div class="supplierParams" v-else>
            <p>报价参数：<span>{{ productInfo && productInfo.baseNumber }}</span></p>
          </div>
        </div>
        <div class="dates">
          <p class="dateIconBox"><i class="dateIcon"></i>{{ productInfo && productInfo.createdOn && productInfo.createdOn.split('T')[0] }}</p>
          <a @click="toContact" class="lookInfo">查看联系方式></a>
        </div>
      </el-card>
    </div>
     <div class="offerInfo">
      <div class="navBar">
      <div class="navBarTitle">
        <span class="title">商品详情</span><span class="backtrack" @click="backtrackPage"><i class="backtrackIcon iconfont icon-fanhui"></i> 返回</span>
      </div>
    </div>
    </div>
    <div class="Graphic">
      <div class="left">
        <div class="swiperList">
          <el-image
            fit="contain"
            :src="productDetail && productDetail.imageUrl"
            :preview-src-list="[productDetail && productDetail.imageUrl]">
            <div slot="placeholder" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div slot="error" class="image-slot">
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
          </el-image>
        </div>
      </div>
      <!-- 产品内容 -->
      <div class="cententText" v-if="productDetail">
          <p class="textItem name">产品名称：{{productDetail.name}}</p>
          <p class="textItem">出厂货号：{{productDetail.fa_no}}</p>
          <p class="textItem">包装方式：{{productDetail.ch_pa}}</p>
          <p class="textItem">样品规格：{{productDetail.pr_le + " X " + productDetail.pr_wi + " X " + productDetail.pr_hi + "(CM)"}}</p>
          <p class="textItem">包装规格：{{productDetail.in_le + " X " + productDetail.in_wi + " X " + productDetail.in_hi + "(CM)"}}</p>
          <p class="textItem">外箱规格：{{productDetail.ou_le + " X " + productDetail.ou_wi + " X " + productDetail.ou_hi + "(CM)"}}</p>
          <p class="textItem">装箱量：{{productDetail.in_en + "/" + productDetail.ou_lo + "(PCS)"}}</p>
          <p class="textItem">体积/材积：{{productDetail.bulk_stere + "(CBM)" + "/" + productDetail.bulk_feet + "(CUFT)"}}</p>
          <p class="textItem">毛重/净重：{{productDetail.ne_we + "/" + productDetail.gr_we + "(kg)"}}</p>
          <p class="textItem" v-show="productInfo && productInfo.productOfferType !== 'company'">出厂价：<span class="price" v-if="$_.isNumber(productDetail.unitPrice)">{{ '￥' + productDetail.unitPrice.toFixed(2) }}</span></p>
          <p class="textItem">报价：<span class="price" v-if="$_.isNumber(productDetail.offerAmount)">{{productDetail.cu_de + productDetail.offerAmount.toFixed((productDetail.decimalPlaces || 2))}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    number: String,
    pid: String
  },
  data () {
    return {
      url: window.location.href.split('/#/')[0] + '/#/offerSharing?id=' + this.$route.params.pid,
      isShowSourceDetail: false,
      activeIndex: 0,
      hoverActive: false,
      myMargin: 0,
      productDetail: null,
      productInfo: null,
      companyData: null
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
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', { offerNumber: this.$route.params.pid })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
        document.title = this.productInfo.companyName
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
    },
    changeIsDetail () {
      this.$emit('changeIsDetail', false)
    },
    // 查看联系方式
    toContact () {
      this.$router.push({ name: 'offerContactPC', params: { id: this.$route.params.pid } })
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductByNumber()
  },
  mounted () {
    if (this.$store.state.screenWidth <= 1024) this.$router.push({ name: 'offerDetail', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
  },
  watch: {
    '$store.state.screenWidth' (val) { // 监听屏幕宽度变化
      if (val <= 1024) this.$router.push({ name: 'offerDetail', params: { id: this.$route.params.id, pid: this.$route.params.pid } })
    }
  },
  beforeDestroy () {
    document.title = '小竹熊 云科技'
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.offerDetailBox{
  .topLayout{
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
    .conText{
      text-align: center;
      color: #165BF7;
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
  .navBar {
  background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
  .navBarTitle {
    height: 50px;
    display: flex;
    width: 900px;
    text-indent: 10px;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
    .title{
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
    .backtrack{
      cursor: pointer;
      &:hover{
        color: #165af7;
      }
    }
  }
}
.offerInfoContent{
  width: 900px;
  margin: 0 auto;
  .offerCard{
    margin: 10px 0;
    .dates{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dateIconBox{
        display: flex;
        align-items: center;
        .dateIcon{
        width: 20px;
        height: 20px;
        margin-right: 5px;
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
    .offerParams{
      margin-bottom: 20px;
      border: 1px solid #cccccc;
      border-radius: 5px;
      .top{
        display: flex;
        .theme {
          width: 50%;
          padding: 10px;
          font-weight: 600;
        }
        .contacts{
          padding: 10px;
          width: 50%;
          span{
              color: #c0c4cc;
            }
        }
      }
      .companyParams{
        display: flex;
        justify-content: space-between;
        .left,.right{
          width: 50%;
          p{
            padding: 10px;
            span{
              color: #c0c4cc;
            }
          }
        }
      }
      .supplierParams{
        p {
          padding: 10px;
          span{
              color: #c0c4cc;
            }
        }
      }
    }
  }
}
}
.Graphic {
  width: 900px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .left {
    width: 400px;
    height: 400px;
    display: flex;
    align-items: center;
    .swiperList {
      width: 100%;
      height: 100%;
      cursor: pointer;
      @{deep} .el-image {
        width: 100%;
        height: 100%;
        .errorImg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  // .right {
    .cententText{
      flex: 1;
      margin-left: 20px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .textItem{
        // margin-bottom: 20px;
        // margin-top: 20px;
        .price{
          color: #ff2505;
        }
      }
      .name{
        font-weight: 600;
      }
    }
  // }
}
.contact {
  margin-top: 20px;
  font-size: 16px;
  margin-bottom: 100px;
  .contactTitleTxt {
    color: white;
    width: 169px;
    height: 60px;
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contactTitleLine {
    border-bottom: 4px solid #ededed;
  }
  .remark {
    padding-top: 20px;
  }
}
</style>
