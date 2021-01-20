<template>
  <div class="productSearchIndex">
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
        <span class="title">报价商品 ({{totalCount}})</span>
      </div>
    </div>
    </div>
    <div class="searchWraps">
      <div class="searchSidebar">
        <h4 class="title el-icon-search"><span class="titleText">分类搜索</span></h4>
        <el-select v-model="categoryNumber" placeholder="请输入或选择"  @change="handleChange" clearable filterable>
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.categoryName"
            :value="item.categoryNumber">
          </el-option>
        </el-select>
      </div>
      <div class="searchContent">
        <div class="filterTitle">
              <el-input placeholder="请输入搜索内容" size="mini" @keyup.enter.native="search" clearable v-model="keyword" class="input-with-select">
                <el-button slot="append" size="mini" icon="el-icon-search" @click="search"></el-button>
              </el-input>
              <el-button type="primary" plain size="mini" @click="hotSort(3)">
                热门
                <i class="el-icon-d-caret" v-show="isHotSort === 0"></i>
                <i class="el-icon-caret-bottom" v-show="isHotSort === 1"></i>
                <i class="el-icon-caret-top" v-show="isHotSort === 2"></i>
              </el-button>
              <el-button type="primary" plain size="mini" @click="priceSort(1)">
                价格
                <i class="el-icon-d-caret" v-show="isPriceSort === 0"></i>
                <i class="el-icon-caret-bottom" v-show="isPriceSort === 1"></i>
                <i class="el-icon-caret-top" v-show="isPriceSort === 2"></i>
              </el-button>
              <el-button type="primary" plain size="mini" @click="dateSort(2)">
                时间
                <i class="el-icon-d-caret" v-show="isDateSort === 0"></i>
                <i class="el-icon-caret-bottom" v-show="isDateSort === 1"></i>
                <i class="el-icon-caret-top" v-show="isDateSort === 2"></i>
              </el-button>
              <el-button type="primary" @click="downloadDocument('PDF')" plain size="mini">
                下载PDF
                <i class="el-icon-download el-icon--right"></i>
              </el-button>
              <el-button type="primary" @click="downloadDocument('Excel')" plain size="mini">
                下载Excel
                <i class="el-icon-download el-icon--right"></i>
              </el-button>
          <!-- <div class="more">更多筛选</div> -->
        </div>
        <template v-if="!dataList || dataList.length === 0">
          <div class="zanwuchanpin"></div>
        </template>
        <template v-else>
            <ul class="productList">
              <li
                class="productItems"
                v-for="(item, i) in dataList"
                :key="i"
                @click="productDetail(item.id)"
              >
                <div class="img">
                  <el-image fit="contain" :src="item.imageUrl">
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
                  <!-- <i
                    class="iconClient iconfont icon--wujiaoxing"
                    @click.stop="addCollect(item)"
                  ></i> -->
                </div>
                <div class="title">产品名称：{{ item.name }}</div>
                <div class="details">
                  <ul>
                    <li>
                      <!-- 出厂货号：{{ item.fa_no }} -->
                      出厂货号：<span>{{ item.fa_no }}</span>
                    </li>
                    <li>
                      装箱量：<span>{{item.in_en + "/" + item.ou_lo + "(PCS)"}}</span>
                    </li>
                    <li>
                      体积/材积：<span>{{ item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)" }}</span>
                    </li>
                    <li v-show="productInfo && productInfo.productOfferType !== 'company'">
                      出厂价：<span class="price" v-if="$_.isNumber(item.unitPrice)">{{ '￥' + item.unitPrice.toFixed(2) }}</span>
                    </li>
                    <li>
                      报价：<span class="price" v-if="$_.isNumber(item.offerAmount)">{{item.cu_de + item.offerAmount.toFixed((item.decimalPlaces || 2))}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <center style="margin:20px auto 0 auto;">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                background
                :total="totalCount"
                :page-size="pageSize"
                :page-sizes="[6, 9, 15, 30]"
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
export default {
  data () {
    return {
      url: window.location.href.replace(/offerSharingPC/gi, 'offerSharing'),
      keyword: '',
      productInfo: null,
      categoryNumber: null,
      sortOrder: 0,
      sortType: 0,
      isDateSort: 0,
      isHotSort: 0,
      isPriceSort: 0,
      currentPage: 1,
      pageSize: 6,
      totalCount: 0,
      dataList: [],
      categoryList: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  methods: {
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
    // 查看联系方式
    toContact () {
      this.$router.push({ name: 'offerContactPC', params: { id: this.$route.query.id } })
    },
    // 下载
    downloadDocument (document) {
      console.log('下载了' + document)
    },
    // 关键字搜索
    search () {
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 价格排序
    priceSort (number) {
      this.sortOrder = number
      this.sortType = this.isPriceSort = this.isPriceSort === 1 ? 2 : 1
      this.isHotSort = this.isDateSort = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // // 时间排序
    dateSort (number) {
      this.sortOrder = number
      this.sortType = this.isDateSort = this.isDateSort === 1 ? 2 : 1
      this.isHotSort = this.isPriceSort = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 热门排序
    hotSort (number) {
      this.sortOrder = number
      this.sortType = this.isHotSort = this.isHotSort === 1 ? 2 : 1
      this.isDateSort = this.isPriceSort = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 点击分类事件
    handleNodeClick (data) {
      this.categoryNumber = data.id
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 显示产品详情
    productDetail (productNumber) {
      if (!productNumber) {
        this.$message.error('该产品没有产品编号')
        return false
      }
      this.$router.push({ name: 'offerDetailPC', params: { id: productNumber, pid: this.$route.query.id } })
    },
    // 修改产品当前页
    changePage (page) {
      this.currentPage = page
      this.getProductOfferDetailPage()
    },
    // 修改产品当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return
      this.getProductOfferDetailPage()
    },
    // 获取产品类目列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/GetProductCategoryList', { offerNumber: this.$route.query.id })
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 分类搜索产品
    handleChange (value) {
      // 重新搜索产品列表
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 获取报价头部信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', {
        offerNumber: this.$route.query.id
      })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
        document.title = this.productInfo.companyName
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取报价信息产品列表
    async getProductOfferDetailPage (flag) {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        offerNumber: this.$route.query.id,
        categoryNumber: this.categoryNumber,
        keyword: this.keyword,
        sortOrder: this.sortOrder,
        sortType: this.sortType
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/ProductOfferDetailPage', fd)
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getProductCategoryList()
    this.getProductOfferByNumber()
    this.getProductOfferDetailPage()
  },
  mounted () {
    if (this.$store.state.screenWidth <= 1024) this.$router.push('/offerSharing?id=' + this.$route.query.id)
  },
  watch: {
    '$store.state.screenWidth' (val) { // 监听屏幕宽度变化
      if (val <= 1024) this.$router.push('/offerSharing?id=' + this.$route.query.id)
    }
  },
  beforeDestroy () {
    document.title = '小竹熊 云科技'
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.productSearchIndex {
  .navBar {
  background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
  .navBarTitle {
    height: 50px;
    display: flex;
    width: 900px;
    text-indent: 10px;
    margin: 0 auto;
    align-items: center;
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
  }
}
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
    width: 900px;
    margin: 20px auto;
    box-sizing: border-box;
    display: flex;
    .searchSidebar {
      width: 200px;
      height: 100%;
      background-color: #e2f1ff;
      .treeContent {
        padding: 10px;
      }
      .title {
        background-color: #4b8fc0;
        color: white;
        width: 100%;
        text-align: center;
        padding: 10px 0;
        .titleText{
          padding-left: 5px;
        }
      }
    }
    .searchContent {
      flex: 1;
      font-weight: 500;
      font-size: 12px;
      padding-left: 15px;
      box-sizing: border-box;
      .productFilter {
        display: flex;
        height: 36px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: relative;
      }
      .filterTitle {
          display: flex;
          height: 40px;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          align-items: center;
          justify-content: space-around;
          box-sizing: border-box;
          .input-with-select {
            margin-right: 10px;
          }
        }
      .productList {
        margin-top: 15px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-size: 10px;
        &::after{
          content: "";
          display: block;
          width: 220px;
        }
        .productItems {
          width: 220px;
          margin: 5px 0;
          // box-sizing: border-box;
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
                transition: all 1s;
                width: 100%;
                height: 150px;
              }
            }
          }
          .title {
            color: #7990bd;
            padding: 5px 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            border-bottom: 1px dotted #ccc;
          }
          .details {
            padding: 0 10px 10px 10px;
            ul {
              li {
                padding-top: 5px;
                .price {
                  color:#ff2505;
                }
              }
              @{deep} .el-tag {
                margin: 5px 0;
              }
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
}
</style>
