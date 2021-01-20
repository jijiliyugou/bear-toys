<template>
  <div style="width:100%;">
    <div class="berad">
      <el-page-header
        @back="changeIsDetail"
        content="产品详情"
      ></el-page-header>
      <span class="backtrack" @click="changeIsDetail"><i class="backtrackIcon iconfont icon-fanhui"></i> 返回</span>
    </div>
    <div class="Graphic" v-if="productDetail">
      <div class="left">
        <div class="swiperList">
          <el-image
            fit="contain"
            :src="productDetail && productDetail.bearProduct && productDetail.bearProduct.imageUrl"
            :preview-src-list="
              productDetail.imglist &&
                productDetail.imglist.map(
                  val => val && val.imgUrl.replace(/_MiddlePic/, '_Photo')
                )">
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
          <i
            v-show="productDetail.isFavorite"
              class="iconClient iconfont icon-wujiaoxing-"
              @click.stop="addCollect(productDetail)"
            ></i>
            <i
            v-show="!productDetail.isFavorite"
              class="iconClient iconfont icon-wujiaoxingkong"
              @click.stop="addCollect(productDetail)"
            ></i>
        </div>
      </div>
      <!-- 产品内容 -->
      <div class="right">
        <p class="login">
          产品单价与供应商信息只有以采购商登录可见
          <span>已登录</span>
        </p>
        <div class="priceInfo">
          <div class="createDate">
            发布时间：
            <span>
              {{ productDetail.bearProduct.createdOn | createdOn }}
            </span>
          </div>
          <div class="productName">
            <h2>{{ productDetail.bearProduct.name }}</h2>
          </div>
          <ul class="productParams">
            <li v-if="$store.state.userInfo && $store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0].companyType === 'Sales'">
              参考单价：<span  :class="{ price : true}">{{ (integralTotal > 0 ?  productDetail.cu_de + productDetail.bearProduct.price : '积分查看价格') }}</span>
            </li>
            <li v-else>
              参考单价：<span  class="price">{{ productDetail.cu_de + productDetail.bearProduct.price.toFixed(2) }}</span>
            </li>
            <li>
              出厂货号：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.fa_no
              }}
            </li>
            <li>
              包装：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.ch_pa
              }}
            </li>
            <li>
              产品规格：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.pr_le +
                    " X " +
                    productDetail.bearProduct.pr_wi +
                    " X " +
                    productDetail.bearProduct.pr_hi +
                    "(CM)"
              }}
            </li>
            <li>
              外箱规格：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.ou_le +
                    " X " +
                    productDetail.bearProduct.ou_wi +
                    " X " +
                    productDetail.bearProduct.ou_hi +
                    "(CM)"
              }}
            </li>
            <li>
                    包装规格：{{
                      productDetail.bearProduct.fa_no === 0
                        ? "???"
                        : productDetail.bearProduct.in_le +
                          " X " +
                          productDetail.bearProduct.in_wi +
                          " X " +
                          productDetail.bearProduct.in_hi +
                          "(CM)"
                    }}
                  </li>
            <li>
              装箱量：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.in_en +
                    "/" +
                    productDetail.bearProduct.ou_lo +
                    "(PCS)"
              }}
            </li>
            <li>
              体积/材积：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.bulk_stere +
                    "(CBM)" +
                    "/" +
                    productDetail.bearProduct.bulk_feet +
                    "(CUFT)"
              }}
            </li>
            <li>
              毛重/净重：{{
                productDetail.bearProduct.fa_no === 0
                  ? "???"
                  : productDetail.bearProduct.ne_we +
                    "/" +
                    productDetail.bearProduct.gr_we +
                    "(kg)"
              }}
            </li>
            <div class="tagBox">
              <!-- 厂商角色 -->
              <el-tag type="success" v-if="$store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0] && $store.state.userInfo.commparnyList[0].companyType === 'Supplier'"
                   @click="openSupplierDetail(productDetail)"
                >来源：{{ productDetail.supplierNumber == $store.state.userInfo.commparnyList[0].companyNumber ? productDetail.supplierName : productDetail.exhibitionName }}
              </el-tag>
              <!-- 展厅角色 | 管理员角色 -->
              <el-tag type="success" v-else-if="$store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0] && $store.state.userInfo.commparnyList[0].companyType === 'Exhibition' || $store.state.userInfo.commparnyList[0].companyType === 'Admin'"
                   @click="openExhibitionDetail(productDetail)"
                >来源：{{ productDetail.supplierName }}
              </el-tag>
              <!-- 游客角色 | 公司角色-->
              <el-tag type="success" v-else @click="openSalesDetail(productDetail)">来源：{{ productDetail.isIntegral ? productDetail.supplierName : productDetail.exhibitionName }}
              </el-tag>
              <!-- 来源模态框 -->
              <div class="box" v-show="isShowSourceDetail">
                <div class="title">
                  <span>来源明细：</span>
                  <i
                    class="el-icon-circle-close"
                    @click="isShowSourceDetail = false"
                  ></i>
                </div>
                <div class="content">
                  <div class="left">
                    <li>
                      <span class="title" v-if="companyType === 'Exhibition'">厂商名称：</span>
                      <span class="title" v-else>展厅名称：</span>
                      <span class="myText">{{
                        companyData && companyData.companyName
                      }}</span>
                    </li>
                    <li>
                      <span class="title">移动电话：</span>
                      <span class="myText">{{
                        companyData && companyData.phoneNumber
                      }}</span>
                    </li>
                    <li>
                      <span class="title">联系电话：</span>
                      <span class="myText">{{
                        companyData && companyData.telephoneNumber
                      }}</span>
                    </li>
                    <li>
                      <span class="title">QQ：</span>
                      <span class="myText">{{
                        companyData && companyData.qq
                      }}</span>
                    </li>
                  </div>
                  <div class="right">
                    <li>
                      <span class="title">联系人：</span>
                      <span class="myText">{{
                        companyData && companyData.contactsMan
                      }}</span>
                    </li>
                    <li>
                      <span class="title">电子邮箱：</span>
                      <span class="myText">{{
                        companyData && companyData.e_mail
                      }}</span>
                    </li>
                    <li>
                      <span class="title">传真号：</span>
                      <span class="myText">{{
                        companyData && companyData.fax
                      }}</span>
                    </li>
                    <li>
                      <span class="title" v-if="companyType === 'Exhibition'">厂商地址：</span>
                      <span class="title" v-else>展厅地址：</span>
                      <span class="myText">{{
                        companyData && companyData.address
                      }}</span>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    number: String
  },
  data () {
    return {
      companyType: this.$store.state.userInfo.commparnyList[0].companyType,
      integralTotal: null,
      isShowSourceDetail: false,
      activeIndex: 0,
      hoverActive: false,
      myMargin: 0,
      productDetail: null,
      companyData: null
    }
  },
  methods: {
    // 查积分
    async getIntegralTotal () {
      const res = await this.$http.post('/api/GetIntegralTotal', {})
      if (res.data.result.code === 200) {
        this.integralTotal = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 收藏
    async addCollect (item) {
      const res = await this.$http.post('/api/CreateProductCollection', {
        productNumber: item.bearProduct.productNumber
      })
      if (res.data.result.code === 200) {
        this.$message.closeAll()
        if (item.isFavorite) {
          this.$message.success('取消收藏成功')
        } else {
          this.$message.success('收藏成功')
        }
        item.isFavorite = !item.isFavorite
      }
    },
    async getProductByNumber () {
      const res = await this.$http.post('/api/BearProductByNumber', {
        productNumber: this.number
      })
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item
        this.imagesList = res.data.result.item.imglist
          ? res.data.result.item.imglist
          : []
      }
    },
    changeIsDetail () {
      this.$emit('changeIsDetail', this.productDetail)
    },
    // 展厅 | 管理员 角色打开来源详情
    async openExhibitionDetail (item) {
      if (!this.isShowSourceDetail) {
        const res = await this.$http.post('/api/CompanyByID', {
          companyNumber: item.supplierNumber
        })
        if (res.data.result.code === 200) {
          this.companyData = res.data.result.item
        } else {
          this.isShowSourceDetail = true
        }
      }
      this.isShowSourceDetail = !this.isShowSourceDetail
    },
    // 公司角色打开来源详情
    async openSalesDetail (item) {
      if (!this.isShowSourceDetail) {
        const res = await this.$http.post('/api/CompanyByID', {
          companyNumber: item.bearProduct.isIntegral ? item.supplierNumber : item.exhibitionNumber
        })
        if (res.data.result.code === 200) {
          this.companyData = res.data.result.item
        } else {
          this.isShowSourceDetail = true
        }
      }
      this.isShowSourceDetail = !this.isShowSourceDetail
    },
    // 工厂角色打开来源详情
    async openSupplierDetail (item) {
      if (!this.isShowSourceDetail) {
        const res = await this.$http.post('/api/CompanyByID', {
          companyNumber: item.supplierNumber === (this.$store.state.userInfo.commparnyList && this.$store.state.userInfo.commparnyList[0] && this.$store.state.userInfo.commparnyList[0].supplierNumber) ? item.supplierName : item.exhibitionNumber
        })
        if (res.data.result.code === 200) {
          this.companyData = res.data.result.item
        } else {
          this.isShowSourceDetail = true
        }
      }
      this.isShowSourceDetail = !this.isShowSourceDetail
    }
  },
  filters: {
    createdOn (val) {
      return val.split('.')[0].replace(/t/gi, ' ')
    }
  },
  created () {
    if (this.$store.state.userInfo.commparnyList[0].companyType === 'Sales') this.getIntegralTotal()
  },
  mounted () {
    // this.getUpdateIntegral()
    this.getProductByNumber()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.berad {
  margin: 5px 0;
  height: 36px;
  font-size: 16px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @{deep} .el-page-header__left:hover {
    color: #409eff;
  }
  .backtrack{
    font-weight: normal;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      color: #409eff;
    }
    i{
      margin-right: 10px;
    }
  }
}
.Graphic {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    width: 500px;
    .swiperList {
      width: 100%;
      height: 500px;
      border: 1px solid #ededed;
      cursor: pointer;
      position:relative;
      .iconClient {
              position: absolute;
              font-size: 30px;
              right: 10px;
              top: 10px;
              color: #fb6055;
              cursor: pointer;
            }
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
  .right {
    flex: 1;
    position: relative;
    .login {
      padding: 5px 30px;
      font-size: 12px;
      color: #444444;
      background-color: #e2ebff;
      opacity: 0;
      span {
        color: #165af7;
        margin-left: 20px;
      }
    }
    .priceInfo {
      padding-left: 30px;
      .createDate {
        font-size: 12px;
        color: #444444;
      }
      .productName {
        color: #aaa;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        h2 {
          color: black;
          font-weight: 400;
          flex: 1;
          padding-top: 10px;
          font-size: 24px;
        }
      }
      .Introduction {
        line-height: 30px;
      }
      .productParams {
        font-size: 16px;
        margin-top: 10px;
        font-weight: 400;
        position: relative;
        li {
          line-height: 40px;
          .price{
            color: #ff0000;
            font-size: 22px;
          }
        }
        .tagBox {
          height: 32px;
          margin-top: 10px;
          display: inline-block;
          position: relative;
          @{deep} .el-tag {
            font-size: 20px;
            left: 0;
            cursor: pointer;
            &:hover {
              background-color: #fff;
            }
          }
          .box {
            position: absolute;
            right: -440px;
            top: -200px;
            width: 400px;
            height: 250px;
            border-radius: 5px;
            border: 1px solid #e1f3d8;
            background-color: #f0f9eb;
            box-sizing: border-box;
            &::before {
              content: "";
              position: absolute;
              left: -50px;
              bottom: 0;
              width: 50px;
              height: 50px;
              background: url("~@/assets/images/尖尖.png") no-repeat right;
            }
            .title {
              padding: 5px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 18px;
              border-bottom: 1px solid #e1f3d8;
              i {
                color: #979797;
                cursor: pointer;
                &:hover {
                  color: #5cb6ff;
                }
              }
            }
            .content {
              height: 215px;
              display: flex;
              padding: 0 5px;
              box-sizing: border-box;
              .left,
              .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-sizing: border-box;
                font-size: 12px;
                li {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  box-sizing: border-box;
                  span.title {
                    font-size: 12px;
                    width: 60px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    border: none;
                    padding: 0;
                  }
                  .myText {
                    flex: 1;
                    display: block;
                    line-height: normal;
                    box-sizing: border-box;
                    word-break: normal;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
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
