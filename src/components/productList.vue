<template>
  <div style="position:relative;">
    <div class="productwrap">
      <div class="content">
        <div class="filterTitle">
          <p>搜索内容： <span class="colorGreen">{{ $store.state.httpContent }}</span></p><p>用时： <span class="colorGreen">{{ $store.state.httpTime | dataFormat }}</span>  秒</p>
        </div>
        <template
          v-if="!productList || (productList && productList.length < 1)"
        >
        <div class="preview" v-if="$store.state.beforeSearchImgPreview">
          <div class="miniImg">
            <el-image
            @click.native.stop.prevent="openCubeImg($store.state.beforeSearchImgPreview.img)"
            :src="$store.state.beforeSearchImgPreview.img"
            fit="contain"></el-image>
          </div>
            <el-image
            :src="$store.state.beforeSearchImgPreview.baseImg"
            @click.native.stop.prevent="openCubeImg($store.state.beforeSearchImgPreview.baseImg)"
            fit="contain"></el-image>
            <div class="title"><span>搜索产品</span></div>
          </div>
          <div class="zanwuchanpin"></div>
        </template>
        <template v-else>
          <div class="preview" v-if="$store.state.beforeSearchImgPreview">
            <div class="miniImg">
            <el-image
            @click.native="openCubeImg($store.state.beforeSearchImgPreview.img)"
            :src="$store.state.beforeSearchImgPreview.img"
            fit="contain"></el-image>
          </div>
            <el-image
            @click.native="openCubeImg($store.state.beforeSearchImgPreview.baseImg)"
            :src="$store.state.beforeSearchImgPreview.baseImg"
            fit="contain"></el-image>
            <div class="title"><span>搜索产品</span></div>
          </div>
          <ul class="productList">
            <li
              class="productItems"
              v-for="(item, index) in productList"
              :key="index"
              @click="toProductDetail(item)"
            >
              <div class="img">
                <el-image fit="contain" :src="item.img" lazy>
                  <div
                    slot="placeholder"
                    class="image-slot"
                    style="width:150px;margin:0 auto;"
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
                    style="width:150px;margin:0 auto;"
                  >
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                </el-image>
                <i
                  v-show="item.isFavorite"
                    class="iconClient iconfont icon-wujiaoxing-"
                    @click.stop="addCollect(item)"
                  ></i>
                  <i
                  v-show="!item.isFavorite"
                    class="iconClient iconfont icon-wujiaoxingkong"
                    @click.stop="addCollect(item)"
                  ></i>
              </div>
              <div class="title">产品名称：{{ item.name }}</div>
              <div class="details">
                <ul>
                  <li>
                    出厂货号：{{ item.fa_no === 0 ? "???" : item.fa_no }}
                  </li>
                  <li>包装：{{ item.fa_no === 0 ? "???" : item.ch_pa }}</li>
                  <li>
                    产品规格：{{
                      item.fa_no === 0
                        ? "???"
                        : item.pr_le +
                          " X " +
                          item.pr_wi +
                          " X " +
                          item.pr_hi +
                          "(CM)"
                    }}
                  </li>
                  <li>
                    外箱规格：{{
                      item.fa_no === 0
                        ? "???"
                        : item.ou_le +
                          " X " +
                          item.ou_wi +
                          " X " +
                          item.ou_hi +
                          "(CM)"
                    }}
                  </li>
                  <li>
                    包装规格：{{
                      item.fa_no === 0
                        ? "???"
                        : item.in_le +
                          " X " +
                          item.in_wi +
                          " X " +
                          item.in_hi +
                          "(CM)"
                    }}
                  </li>
                  <li>
                    装箱量：{{
                      item.fa_no === 0
                        ? "???"
                        : item.in_en + "/" + item.ou_lo + "(PCS)"
                    }}
                  </li>
                  <li>
                    体积/材积：{{
                      item.fa_no === 0
                        ? "???"
                        : item.bulk_stere +
                          "(CBM)" +
                          "/" +
                          item.bulk_feet +
                          "(CUFT)"
                    }}
                  </li>
                  <li>
                    毛重/净重：{{
                      item.fa_no === 0
                        ? "???"
                        : item.ne_we + "/" + item.gr_we + "(kg)"
                    }}
                  </li>
                   <!-- 厂商角色 -->
                    <el-tag type="success" v-if="$store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0] && $store.state.userInfo.commparnyList[0].companyType === 'Supplier'"
                      >来源：{{ item.supplierNumber == ($store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0] && $store.state.userInfo.commparnyList[0].companyNumber) ? item.supplierName : item.exhibitionName }}
                    </el-tag>
                    <!-- 展厅角色 | 管理员角色 -->
                    <el-tag type="success" v-else-if="(($store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0] && $store.state.userInfo.commparnyList[0].companyType) === 'Exhibition') || (($store.state.userInfo.commparnyList && $store.state.userInfo.commparnyList[0] && $store.state.userInfo.commparnyList[0].companyType) === 'Admin')"
                      >来源：{{ item.supplierName }}
                    </el-tag>
                    <!-- 游客角色 | 公司角色-->
                    <el-tag type="success" v-else>来源：{{ item.isIntegral ? item.supplierName : item.exhibitionName }}</el-tag>
                </ul>
              </div>
            </li>
            <li class="pink"></li>
            <li class="pink"></li>
            <li class="pink"></li>
            <div class="itemBox" v-show="isShowHistoryName">
                <el-tooltip v-for="(item, i) in historyNames" :key="i" effect="dark" :content="item" placement="top">
                  <li class="item" @click="clickHistory(item)">
                  {{ item }}
                  </li>
                </el-tooltip>
            </div>
            <div class="historyBox" slot="reference" @click="showHistoryNameE">
              <div class="historyItem"><i class="el-icon-time"></i></div>
              <div class="historyItem">查询记录</div>
            </div>
          </ul>
          <center style="margin:20px;"  v-show="!$store.state.beforeSearchImgPreview">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              :page-sizes="[10, 20, 40, 60]"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="changePage"
              @size-change="handleSizeChange"
            ></el-pagination>
          </center>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      scrollable: false,
      isShowHistoryName: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      productList: null
    }
  },
  methods: {
    clickHistory (value) {
      this.currentPage = 1
      this.beforeSearch.name = value
      this.getProductList()
    },
    // 显示
    showHistoryNameE () {
      this.isShowHistoryName = !this.isShowHistoryName
      if (this.historyNames.length === 0) this.isShowHistoryName = false
    },
    // 重新切图
    openCubeImg (img) {
      this.$emit('handlerCubeImgEvent', img)
    },
    // 产品收藏
    async addCollect (item) {
      const res = await this.$http.post('/api/CreateProductCollection', {
        productNumber: item.productNumber
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
    // 查看詳情
    toProductDetail (item) {
      this.$emit('showProductDetail', item)
    },
    // 文字搜索产品
    async getProductList () {
      if (this.beforeSearch.name) {
        this.$store.commit('addHistoryNames', this.beforeSearch.name)
      }
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        ...this.beforeSearch
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      try {
        const res = await this.$http.post('/api/SearchBearProductPage', fd)
        if (res.data.result.code === 200 && res.data.result.item) {
          this.productList = res.data.result.item.items
          this.totalCount = res.data.result.item.totalCount
        } else {
          this.totalCount = 0
          this.productList = []
          this.$message.error(res.data.result.msg + '，请登录后查看')
        }
        $('.rootApp').animate({ scrollTop: 0 }) // 回到顶部
      } catch (error) {
        this.totalCount = 0
      }
    },
    // 分页
    changePage (currentPage) {
      this.currentPage = currentPage
      this.getProductList()
    },
    // 切換頁容量
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProductList()
    }
  },
  created () {
    if (this.$store.state.beforeSearchImg) this.productList = this.$store.state.beforeSearchImg
    else this.getProductList()
  },
  mounted () {
  },
  computed: {
    ...mapState(['historyNames']),
    ...mapState(['beforeSearchImg']),
    ...mapState(['beforeSearch'])
  },
  filters: {
    dataFormat (value) {
      return value / 1000
    }
  },
  watch: {
    beforeSearchImg (val) {
      this.productList = val
    }
  },
  beforeDestroy () {
    this.$store.commit('handlerBeforeSearchKeyWord', null)
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.search {
  text-align: center;
  margin: 30px 0;
  .myCamera {
    color: black;
    font-size: 22px;
    cursor: pointer;
  }
}
.productwrap {
  width: 100%;
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  min-height: 569px;
  box-sizing: border-box;
  display: flex;
  .productMenu {
    width: 200px;
    .title {
      background-color: #165af7;
      color: white;
      width: 100%;
      text-align: center;
      padding: 10px 0;
    }
    .treeContent {
      min-height: 533px;
      padding: 10px;
      background-color: #e4f3ff;
    }
  }
  .content {
    flex: 1;
    font-weight: 500;
    font-size: 12px;
    position: relative;
    .productFilter {
      display: flex;
      height: 34px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      position: relative;
      align-items: center;
      .el-button {
        height: 95%;
        i {
          font-size: 14px;
          margin-left: 10px;
        }
      }
      .priceFilter {
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 20px;
        p {
          width: 50px;
        }
        @{deep} .priceInput,
        @{deep} .el-input__inner {
          width: 50px;
          height: 30px;
        }
        span {
          width: 5px;
          height: 2px;
          margin: 0 5px;
          background-color: #aaa;
        }
      }
      .more {
        position: absolute;
        right: 10px;
        top: 10px;
        i {
          font-weight: 700;
          font-size: 20;
          cursor: pointer;
        }
      }
    }
    .filterTitle {
        display: flex;
        justify-content: flex-end;
        p{
          margin: 0 10px;
          .colorGreen{
            color: #3872f8;
          }
        }
      }
      .preview{
        width: 400px;
        height: 200px;
        margin: 0 auto;
        box-sizing: border-box;
        position: relative;
        .miniImg{
          position: absolute;
          right: 0;
          top: 0;
          width: 100px;
          height: 100px;
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
          background-color: #fff;
          z-index: 1;
          .el-image{
          width: 100%;
          height: 100%;
          cursor: pointer;
          @{deep} img {
            transition: all 1s;
            &:hover {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
        }
        }
        .title{
          text-align: center;
          color: #aaa;
          position: relative;
          &::before{
            position: absolute;
            content: '';
            left: 50%;
            width: 200px;
            height: 3px;
            top: 50%;
            background-color: #ddd;
            transform: translate(-50%,-50%);
            }
          span{
          position: relative;
          background-color: #fff;
          padding: 0 10px;
          }
        }
        .el-image{
          width: 100%;
          height: 184px;
          cursor: pointer;
          @{deep} img {
            transition: all 1s;
            &:hover {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
        }
      }
      .pink{
        width: 230px;
      }
    .productList {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      font-size: 10px;
      position: relative;
      .itemBox{
        position: absolute;
        bottom: 80px;
        width: 80px;
        right: -100px;
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
        padding-bottom:  5px;
        text-align: center;
        &::after{
          content: '';
          display: block;
          position: absolute;
          bottom: -5px;
          left: 5px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #fff;
        }
        .item{
          padding: 5px;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          border-top: 1px solid #ccc;
          white-space:nowrap;
          overflow: hidden;
          white-space: nowrap;/*不换行*/
          text-overflow:ellipsis;/*超出部分文字以...显示*/
          &:first-of-type{
            border-top: 1px solid transparent;
          }
          &:hover{
            background-color: #eaeefb;
          }
        }
      }
    .historyBox {
      position: absolute;
      bottom: 0px;
      right: -100px;
      width: 80px;
      height: 70px;
      border-radius: 3px;
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
      display: flex;
      flex-wrap: wrap;
      .historyItem{
        width: 100%;
        box-sizing: border-box;
        padding: 2px 0;
        display: flex;
        justify-content: center;
        &:first-of-type {
          align-items: flex-end;
          font-size: 18px;
        }
      }
      cursor: pointer;
      &:hover{
        color: #fff;
        background-color: #3872f8;
      }
    }
      .productItems {
        width: 230px;
        margin-top: 20px;
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
        box-sizing: border-box;
        cursor: pointer;
        .img {
          width: 100%;
          height: 150px;
          position: relative;
           .iconClient {
              position: absolute;
              right: 5px;
              bottom: 5px;
              color: #fb6055;
              cursor: pointer;
            }
          @{deep} .el-image {
            width: 100%;
            height: 150px;
            position: static;
            img {
              position: static;
              width: 100%;
              height: 150px;
              transition: all 1s;
            }
          }
        }
        .title {
          color: #7990bd;
          padding: 5px 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-bottom: 1px dotted #f5f7fa;
        }
        .details {
          ul > li {
            padding: 5px 10px;
          }
          @{deep} .el-tag {
            margin: 5px 10px;
            max-width: 210px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p {
            float: right;
            color: #cb9348;
            font-weight: 700;
          }
        }
        &:hover {
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
          .img {
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
    }
  }
}
@{deep} .el-tree {
  // color: white;
  background-color: transparent;
  .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
  }
  .el-tree-node:hover > .el-tree-node__content {
    background-color: transparent;
  }
  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg) !important;
    transform: rotate(0deg) !important;
  }
  .el-icon-caret-right:before {
    // 加号图片
    content: "\e723" !important;
    font-size: 16px;
    color: black;
  }
  .expanded:before {
    // 减号图片
    content: "\e722" !important;
    font-size: 16px;
  }
  // 叶子类目不要图标
  .is-leaf.el-tree-node__expand-icon.el-icon-caret-right:before {
    content: "" !important;
    font-size: 16px;
  }
}
.meiyoule {
  padding: 10px 0;
  background-color: #eeeeed;
  width: 100%;
  height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
