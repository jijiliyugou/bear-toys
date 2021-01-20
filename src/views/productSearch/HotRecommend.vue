<template>
<el-container class="productSearchIndex">
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <productSearchTop :showColl="true" parentEl="hotRecommend"></productSearchTop>
    <div class="searchWraps">
      <div class="searchSidebar">
        <h4 class="title el-icon-menu">产品目录</h4>
        <div class="treeContent">
          <el-tree
            :data="categoryList"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="searchContent">
        <!-- <div class="productFilter">
          <el-button size="small">
            价格排序
            <i class="iconfont icon-xiangxiajiantou"></i>
          </el-button>
          <el-button size="small">
            时间排序
            <i class="iconfont icon-xiangxiajiantou"></i>
          </el-button>
          <div class="priceFilter">
            <p>价格筛选</p>
            <el-input class="priceInput"></el-input>
            <span></span>
            <el-input class="priceInput"></el-input>
          </div>
          <div class="searchBtnBox">
            <el-button size="small" class="searchBtn">搜索</el-button>
            <p>
              总记录共
              <span class="count">{{ totalCount }}</span>条
            </p>
          </div>
          <div class="more">
            <i class="iconfont icon-gengduo"></i>
          </div>
        </div>-->
         <div class="filterTitle">
          <div class="searchOptions"><p>搜索内容： <span class="colorGreen">{{ $store.state.httpContent }}</span> </p> <p>用时： <span class="colorGreen">{{ $store.state.httpTime | dataFormat }} </span>  秒</p></div>
          <p class="totalCountBox">总记录共 <span class="count">{{ totalCount }}</span>条</p>
        </div>
        <div>
          <template v-if="!dataList || dataList.length === 0">
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
            <div v-show="!isDetail">
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
            <ul class="productList">
              <li
                class="productItems"
                v-for="(item, i) in dataList"
                :key="i"
                @click="productDetail(item.productNumber)"
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
              <div class="buwei"></div>
            </ul>
          <center style="margin:20px auto 0 auto;" v-show="!$store.state.beforeSearchImgPreview">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[12, 20, 40, 60]"
              background
              :total="totalCount"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="changePage"
              @size-change="handleSizeChange"
            ></el-pagination>
          </center>
            </div>
          </template>
          <div class="productList" v-if="isDetail">
            <productDetail
              :number="datailNumber"
              @changeIsDetail="changeIsDetail"
            ></productDetail>
          </div>
        </div>
      </div>
    </div>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="isShowCropper" destroy-on-close append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :canScale='option.canScale'
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :mode="option.mode"
          ></vueCropper>
        </div>
      </div>
      <center slot="footer" class="dialog-footer">
        <el-button type="info" @click="cropperCancel">取 消</el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-left"
          @click="$refs.cropper.rotateLeft()"
          >左 旋 转</el-button
        >
        <el-button
          type="primary"
          class="el-icon-refresh-right"
          @click="$refs.cropper.rotateRight()"
          >右 旋 转</el-button
        >
        <el-button type="success" @click="onCubeImg" :loading="cropperLoading"
          >确认</el-button
        >
      </center>
    </el-dialog>
    </el-main>
    <el-footer style="padding:0;" height="162px">
    <bsFooter></bsFooter>
  </el-footer>
  </el-container>
</template>

<script>
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/oldFooter'
import productSearchTop from '@/components/productSearchTop'
import productDetail from '@/components/productDetail'
import { VueCropper } from 'vue-cropper'
export default {
  components: { bsTop, productSearchTop, productDetail, VueCropper, bsFooter },
  data () {
    return {
      categoryNumber: null,
      cropperLoading: false,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        full: false, // 是否输出原图比例的截图
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 1000, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [2, 1], // 截图框的宽高比例
        canMove: true, // 图片是否可移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      isShowCropper: false,
      httpTime: null,
      isDetail: false,
      loading: false,
      datailNumber: null,
      currentPage: 1,
      pageSize: 12,
      totalCount: 0,
      dataList: [],
      categoryList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  methods: {
    // 确定裁剪图片
    onCubeImg () {
      this.cropperLoading = true
      // 获取cropper的截图的 数据
      this.$refs.cropper.getCropBlob(async file => {
        const urlPreView = URL.createObjectURL(file)
        this.option.img = urlPreView
        this.$store.commit('handlerBeforeSearchImgPreview', { img: urlPreView, baseImg: this.$store.state.beforeSearchImgPreview.baseImg })
        // 上传
        const companyNumber = this.$store.state.userInfo.commparnyList
          ? this.$store.state.userInfo.commparnyList[0].companyNumber
          : 'Tourist'
        const fd = new FormData()
        fd.append('companynumber', companyNumber)
        fd.append('file', file)
        try {
          const res = await this.$http.post('/api/File/SearchPicture', fd)
          if (res.data.result.code === 200) {
            this.cropperCancel()
            this.$store.commit('searchValues', res.data.result.object)
          } else {
            this.cropperCancel()
            this.$store.commit('searchValues', null)
            this.$message.error(res.data.result.message)
          }
          // this.$router.push('hotRecommend')
        } catch (error) {
          this.cropperCancel()
        }
      })
    },
    // 取消裁剪
    cropperCancel () {
      this.$refs.cropper.clearCrop()
      this.isShowCropper = false
      this.cropperLoading = false
      this.option.img = ''
      this.$refs.uploadRef && (this.$refs.uploadRef.value = '')
    },
    // 重新切图
    openCubeImg (img) {
      this.isShowCropper = true
      this.option.img = img
    },
    // 收藏
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
    handleNodeClick (data) {
      this.$store.commit('handlerBeforeSearchImgPreview', null)
      this.currentPage = 1
      this.categoryNumber = data.id
      this.getProduct()
    },
    // 回退事件
    changeIsDetail (productDetail) {
      this.isDetail = false
      this.dataList.forEach(item => {
        if (item.productNumber === this.datailNumber) item.isFavorite = productDetail.isFavorite
      })
    },
    // 显示产品详情
    productDetail (productNumber) {
      if (productNumber) {
        this.isDetail = true // 打开详情页
        this.datailNumber = productNumber
      } else {
        this.$message.error('该产品没有productNumber')
      }
    },
    successUpload (response, file, fileList) {
      this.$store.commit('searchValues', response)
      this.$store.commit('updateAppLoading', false)
    },
    // 文字搜索
    async getProduct () {
      this.loading = true
      try {
        const fd = {
          keyword: this.$store.state.searchValue,
          categoryNumber: this.categoryNumber,
          skipCount: this.currentPage,
          maxResultCount: this.pageSize
        }
        for (const key in fd) {
          if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
            delete fd[key]
          }
        }
        const res = await this.$http.post('/api/HotRecommendPage', fd)
        if (res.data.result.code === 200 && res.data.result.item) {
          this.dataList = res.data.result.item.items
          this.totalCount = res.data.result.item.totalCount
        } else {
          this.$message.error(res.data.result.msg)
          this.totalCount = 0
        }
        $('.rootApp').animate({ scrollTop: 0 }) // 回到顶部
        this.loading = false
      } catch (error) {
        this.loading = false
        this.totalCount = 0
      }
    },
    // 修改热门产品当前页
    changePage (page) {
      this.currentPage = page
      this.getProduct()
    },
    // 修改热门产品当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProduct()
    },
    // 获取产品类目列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/ProductCategoryList', {})
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  filters: {
    dataFormat (value) {
      return value / 1000
    }
  },
  watch: {
    '$store.state.imageSearchValue' (newVal) {
      if (newVal) {
        this.dataList = newVal
        this.totalCount = newVal.length
        this.isDetail = false
        this.$nextTick(() => {
          this.$store.commit('clearSearch')
        })
      }
    },
    '$store.state.beforeSearch' (newval) {
      this.search = newval
    }
  },
  mounted () {
    this.$store.commit('handlerBeforeSearchImgPreview', null)
    this.$store.commit('handlerHttpTime', null)
    this.$store.commit('handlerHttpContent', null)
    if (this.$route.params.id) {
      this.productDetail(this.$route.params.id)
    } else {
      this.getProduct()
      this.$root.eventHub.$on('toHotRecommend', () => {
        this.currentPage = 1
        this.totalCount = 0
        this.dataList = []
        this.isDetail = false
        this.categoryNumber = null
        this.search = this.$store.state.searchValues
        if (this.$store.state.hotSearchImg instanceof Array) {
          this.dataList = this.$store.state.hotSearchImg
          this.totalCount = this.dataList.length
          this.$store.commit('clearSearch')
        } else {
          this.$store.commit('handlerBeforeSearchImgPreview', null)
          this.$store.commit('clearSearch')
          this.getProduct()
        }
      })
    }
  },
  created () {
    this.getProductCategoryList()
  },
  beforeDestroy () {
    this.$root.eventHub.$off('toHotRecommend')
    this.$store.commit('handlerhotSearchImg', null)
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.productSearchIndex {
  position: relative;
  min-height: 765px;
  .searchTops {
    width: 100%;
    text-align: center;
    margin: 30px 0;
    .myCamera {
      color: black;
      font-size: 22px;
      cursor: pointer;
    }
  }
  .searchWraps {
    width: 100%;
    box-sizing: border-box;
    max-width: 1200px;
    min-width: 1024px;
    margin: 20px auto;
    display: flex;
    .searchSidebar {
      width: 200px;
      height: 100%;
      background-color: #e2f1ff;
      .treeContent {
        min-height: 580px;
        padding: 10px;
      }
      .title {
        background-color: #4b8fc0;
        color: white;
        width: 100%;
        text-align: center;
        padding: 10px 0;
      }
    }
    .searchContent {
      flex: 1;
      padding-left: 20px;
      font-weight: 500;
      font-size: 12px;
      .productFilter {
        display: flex;
        height: 36px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: relative;
        ::v-deep .el-button {
          height: 100%;
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
          .priceInput,
          ::v-deep .el-input__inner {
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
        .searchBtnBox {
          height: 100%;
          display: flex;
          align-items: center;
          margin-left: 20px;
          .searchBtn {
            width: 50px;
            height: 30px;
          }
          p {
            height: 100%;
            width: 150px;
            display: flex;
            align-items: center;
            justify-content: left;
            padding-left: 10px;
          }
          .count {
            color: red;
            margin: 0 5px;
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
        margin-top: 5px;
        display: flex;
        height: 36px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: relative;
        align-items: center;
        justify-content:space-between;
        box-sizing: border-box;
        &:after {
          display: block;
          content:'';
          flex:1
        }
        .totalCountBox {
          flex:1;
          text-align: center;
          .count {
          color: red;
          margin: 0 5px;
          }
        }
        .searchOptions{
          display: flex;
          box-sizing:border-box;
          p{
            margin-right:20px;
          }
          .colorGreen{
            color: #66b1ff;
          }
        }
      }
      .productList {
        display: flex;
        flex-wrap: wrap;
        font-size: 10px;
        justify-content:space-between;
        &::after {
          content: '';
          width: 230px;
          display: block;
          margin: 5px;
        }
        .buwei{
          content: '';
          width: 230px;
          margin: 5px;
        }
        .productItems {
          width: 230px;
          margin: 5px;
          cursor: pointer;
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
          .img {
            width: 100%;
            height: 150px;
            border-bottom: 1px solid #ccc;
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
              img {
                width: 100%;
                height: 150px;
                transition: all 1s;
              }
            }
          }
          .title {
            color: #7990bd;
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            border-bottom: 1px dotted #ccc;
          }
          .details {
            padding: 0 5px;
            ul {
              li {
                padding-top: 5px;
              }
              @{deep} .el-tag {
                margin: 5px 0;
              }
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
    }
  }
  ::v-deep .el-tree {
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
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
