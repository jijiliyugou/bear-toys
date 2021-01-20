<template>
  <div style="min-height:569px;" class="productDetailBox">
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
                )
            "
          >
            <div slot="placeholder" class="image-slot">
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
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
        <p class="login" v-show="!$store.state.isLogin">
          产品单价与供应商信息只有以采购商登录可见
          <a href="#" @click="$router.push('/beforeIndex/login')">去登录</a>
        </p>
        <p class="noLogin" v-show="$store.state.isLogin">
          产品单价与供应商信息只有以采购商登录可见
          <span>已登录</span>
        </p>
        <div class="priceInfo">
          <div class="productName">
            <h2>{{ productDetail.bearProduct && productDetail.bearProduct.name }}</h2>
            <div class="createDate">
              发布时间：
              <span>{{ productDetail.bearProduct && productDetail.bearProduct.createdOn | createdOn }}</span>
            </div>
          </div>
          <ul class="productParams" v-if="productDetail.bearProduct">
            <li>
            参考单价：<span  class="price">{{productDetail.cu_de +
              (productDetail.bearProduct.price === 0
                ? "???"
                : productDetail.bearProduct.price)
            }}</span>
            </li>
            <li>
              出厂货号：{{
                (productDetail.bearProduct && productDetail.bearProduct.fa_no) === 0
                  ? "???"
                  : (productDetail.bearProduct && productDetail.bearProduct.fa_no)
              }}
            </li>
            <li>
              包装：{{
                (productDetail.bearProduct && productDetail.bearProduct.fa_no) === 0
                  ? "???"
                  : (productDetail.bearProduct && productDetail.bearProduct.ch_pa)
              }}
            </li>
            <li>
              样品规格：{{
                (productDetail.bearProduct && productDetail.bearProduct.fa_no) === 0
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
                (productDetail.bearProduct && productDetail.bearProduct.fa_no) === 0
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
              装箱量：{{
                (productDetail.bearProduct && productDetail.bearProduct.fa_no) === 0
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
              <el-tag type="success" @click="openSourceDetail(productDetail)"
                >来源：{{
                  $store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyType ==
                    "Exhibition"
                    ? productDetail.supplierName
                    : productDetail.exhibitionName
                }}</el-tag
              >

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
                      <span class="title">公司名：</span>
                      <span class="text">{{
                        companyData && companyData.companyName
                      }}</span>
                    </li>
                    <li>
                      <span class="title">移动电话：</span>
                      <span class="text">{{
                        companyData && companyData.phoneNumber
                      }}</span>
                    </li>
                    <li>
                      <span class="title">联系电话：</span>
                      <span class="text">{{
                        companyData && companyData.telephoneNumber
                      }}</span>
                    </li>
                    <li>
                      <span class="title">QQ号：</span>
                      <span class="text">{{
                        companyData && companyData.qq
                      }}</span>
                    </li>
                  </div>
                  <div class="right">
                    <li>
                      <span class="title">联系人：</span>
                      <span class="text">{{
                        companyData && companyData.contactsMan
                      }}</span>
                    </li>
                    <li>
                      <span class="title">电子邮箱：</span>
                      <span class="text">{{
                        companyData && companyData.e_mail
                      }}</span>
                    </li>
                    <li>
                      <span class="title">传真号：</span>
                      <span class="text">{{
                        companyData && companyData.fax
                      }}</span>
                    </li>
                    <li>
                      <span class="title">公司地址：</span>
                      <span class="text">{{
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
    <!-- <div class="contact">
      <div class="contactTitleTxt">其他信息</div>
      <div class="contactTitleLine"></div>
      <div class="remark">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis
        dolorem, adipisci iste iusto animi temporibus tempora enim totam fugit
        at in odit neque ab. Consequatur esse sapiente qui voluptatem dolor.
      </div>
    </div>-->
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowSourceDetail: false,
      companyData: null,
      activeIndex: 0,
      hoverActive: false,
      myMargin: 0,
      productDetail: null,
      imagesList: []
    }
  },
  methods: {
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
      } else {
        this.$message.closeAll()
        if (item.isFavorite) {
          this.$message.error('取消收藏失败')
        } else {
          this.$message.error('收藏失败')
        }
      }
    },
    async getProductByNumber () {
      const id = this.$route.params.id
      const res = await this.$http.post('/api/BearProductByNumber', {
        productNumber: id
      })
      if (res.data.result.code === 200) {
        this.productDetail = res.data.result.item
        console.log(res)
        this.imagesList = res.data.result.item.imglist
          ? res.data.result.item.imglist
          : []
      }
    },
    // 打开来源详情
    async openSourceDetail (item) {
      let number
      if (
        this.$store.state.userInfo.commparnyList &&
        this.$store.state.userInfo.commparnyList[0] &&
        this.$store.state.userInfo.commparnyList[0].companyType === 'Exhibition'
      ) {
        number = item.supplierNumber
      } else {
        number = item.exhibitionNumber
      }
      if (!this.isShowSourceDetail) {
        const res = await this.$http.post('/api/CompanyByID', {
          companyNumber: number
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
      if (val) return val.split('.')[0].replace(/t/gi, ' ')
    }
  },
  mounted () {
    this.getProductByNumber()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.productDetailBox {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
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
        font-size: 30px;
              position: absolute;
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
      padding: 5px 80px;
      font-size: 12px;
      margin-bottom: 10px;
      color: #444444;
      background-color: #e2ebff;
      a {
        color: #165af7;
        margin-left: 20px;
      }
    }
    .noLogin {
      padding: 5px 80px;
      font-size: 12px;
      margin-bottom: 10px;
      color: #444444;
      background-color: #e2ebff;
      opacity: 0;
      span {
        color: #165af7;
        margin-left: 20px;
      }
    }
    .priceInfo {
      padding-left: 80px;
      .productName {
        color: #aaa;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        h2 {
          color: black;
          font-weight: 400;
          flex: 1;
          padding-right: 20px;
          font-size: 24px;
        }
        .createDate {
          width: 185px;
          margin-top: 5px;
          font-size: 12px;
        }
      }
      .Introduction {
        line-height: 30px;
      }
      .productParams {
        margin-top: 10px;
        font-weight: 400;
        position: relative;
        li {
          line-height: 40px;
          .price {
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
                    width: 60px;
                    height: 100%;
                    display: flex;
                    font-size: 12px;
                    align-items: center;
                    border: none;
                    padding: 0;
                  }
                  span.text {
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
  margin-bottom: 100px;
  .contactTitleTxt {
    color: white;
    width: 169px;
    height: 60px;
    background-color: #165af7;
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
