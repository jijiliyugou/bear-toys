<template>
  <div
    class="baojia"
    @scroll="baojiaScroll"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled"
  >
  <div class="boxOne">
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
          <van-notice-bar :scrollable="scrollable" :delay="1">
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
  </div>
  <div class="boxTwo">
    <div class="keyWordSearch">
      <el-input v-model="keyword" clearable @keyup.enter.native="search" placeholder="请输入搜索关键字"></el-input>
      <el-button type="primary" @click="search" round>搜索</el-button>
    </div>
    <div class="floatSearch">
      <div class="listTitle">
        <span class="listTitleTXT">报价商品 ({{ totalCount }})</span>
        <div class="downloads">
        </div>
      </div>
      <div class="filterProduct">
        <p :class="{'filterItem': true, 'active': sortOrder === 3}" @click="sortHot(3)">热度<i v-show="isHot === 0" class="el-icon-d-caret"></i><i class="el-icon-caret-bottom" v-show="isHot === 1"></i><i v-show="isHot === 2" class="el-icon-caret-top"></i></p>
        <p :class="{'filterItem': true, 'active': sortOrder === 1}" @click="sortPrice(1)">单价<i v-show="isPrice === 0" class="el-icon-d-caret"></i><i class="el-icon-caret-bottom" v-show="isPrice === 1"></i><i v-show="isPrice === 2" class="el-icon-caret-top"></i></p>
        <p :class="{'filterItem': true, 'active': sortOrder === 2}" @click="sortDate(2)">时间<i v-show="isDate === 0" class="el-icon-d-caret"></i><i class="el-icon-caret-bottom" v-show="isDate === 1"></i><i v-show="isDate === 2" class="el-icon-caret-top"></i></p>
        <p :class="{'filterItem': true, 'active': isScreen === 1}" @click="sortScreen">筛选<i v-show="isScreen === 0" class="el-icon-d-caret"></i><i class="el-icon-caret-bottom" v-show="isScreen === 1"></i></p>
        <p :class="{'filterItem': true, 'active': isCate === 1}" @click="sortCate">分类<i v-show="isCate === 0" class="el-icon-d-caret"></i><i class="el-icon-caret-bottom" v-show="isCate === 1"></i></p>
        <div class="more">
          <i v-show="isList" class="list" @click="checkList"></i>
          <i v-show="!isList" class="square" @click="checkList"></i>
        </div>
      </div>
      <transition name="el-zoom-in-top">
        <div class="screens transition-box" v-show="isScreen === 1">
          <div class="contentWrap">
            <div class="item">
            <div class="left">
              <div class="title">价格区间：</div><el-input
            size="mini"
              placeholder="最低"
              cle
              v-model="packingOptions.minPrice">
            </el-input><em style="margin:0 0.066667rem;">-</em><el-input
            size="mini"
              placeholder="最高"
              v-model="packingOptions.maxPrice">
            </el-input>
            </div>
            <div class="right">
              <div class="title">时间区间：</div>
              <el-select v-model="packingDatetime" @change="getDateList" size="mini" placeholder="全部">
                <el-option
                  v-for="(item, i) in dateList"
                  :key="i"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            </div>
          </div>
          <div class="packing">
              <div class="title">包装：</div>
              <el-select v-model="packingOptions.pa_nu" size="mini" placeholder="全部">
                <el-option
                  v-for="item in packingList"
                  :key="item.value"
                  :label="item.ch_pa"
                  :value="item.pa_nu">
                </el-option>
            </el-select>
          </div>
          <div class="selectImg">
            <div class="title">图片：</div>
            <el-radio size="mini" v-model="packingOptions.isUpInsetImg" :label="true">是</el-radio>
            <el-radio size="mini" v-model="packingOptions.isUpInsetImg" :label="false">否</el-radio>
          </div>
          </div>
          <div class="submitBtnList">
            <!-- <div class="reset">重置</div> -->
            <el-button class="reset" type="info" @click="resetPackingOptions">重置</el-button>
            <el-button class="submit" type="info"  @click="subPackingOptions">确认</el-button>
          </div>
      </div>
      </transition>
      <transition name="el-zoom-in-top">
        <div class="category" v-show="isCate === 1">
          <div class="contentWrap">
          <div class="leftCate">
            <ul class="cateItens">
              <li :class="{item: true, active:isActive === i}" @click="isActive = i;isItemActive = null;categoryChildren = item.children;allCateCount = item;currentCate = item;" v-for="(item, i) in categoryList" :key="i">{{ item.name }}</li>
            </ul>
          </div>
          <div class="rightCate">
            <p :class="{allCateCount:true, active: isItemActive === null}">{{ currentCate?allCateCount.name + '(' + allCateCount.count + ')':'全部' }}</p>
            <!-- <p :class="{allCateCount:true, active: isItemActive === null}" v-show="!currentCate">全部</p> -->
            <ul class="cateItens">
              <li :class="{item: true, active: isItemActive === i}" @click="isItemActive = i;currentCate = item;" v-for="(item, i) in categoryChildren" :key="i">
                {{ item.name }}({{ item.count }})
              </li>
            </ul>
          </div>
          </div>
          <div class="submitBtnList">
            <el-button class="reset" type="info" @click="resetCategory">重置</el-button>
            <el-button class="submit" type="info"  @click="subPackingOptions">确认</el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
    <div class="productList">
      <template v-if="totalCount > 0">
      <div class="listItems" v-show="isList">
          <el-card
          class="listItem"
          v-for="(item, i) in productList"
          :key="i"
          @click.stop.native="productDetail(item.id)"
        >
          <div class="contentBox">
            <div class="left">
            <el-image
              style="position: static"
              :src="item.imageUrl"
              fit="contain"
            >
              <div slot="placeholder" class="image-slot">
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
          <div class="right">
            <p class="productName">{{ item.name }}</p>
            <p class="productCode">
              出厂货号：<span>{{ item.fa_no }}</span>
            </p>
            <p>
              装箱量：<span>{{item.in_en + "/" + item.ou_lo + "(PCS)"}}</span>
            </p>
            <p>
              体积/材积：<span>{{  item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)" }}</span>
            </p>
            <p class="productPrice" v-show="(productInfo && productInfo.productOfferType) !== 'company'">
              出厂价：<span class="price">
                {{ '￥' + item.unitPrice.toFixed(2) }}
              </span>
            </p>
            <p class="productPrice">
              报价：<span class="price">{{
                item.cu_de + item.offerAmount.toFixed((item.decimalPlaces || 2))
              }}</span>
            </p>
          </div>
          </div>
          <div class="createDate"><i class="dateIcon"></i>{{ item && item.createdOn && item.createdOn.split('T')[0] }}</div>
        </el-card>
      </div>
      <div class="squareItems" v-show="!isList">
          <el-card
          class="squareItem"
          v-for="(item, i) in productList"
          :key="i"
          @click.stop.native="productDetail(item.id)"
        >
          <div class="top">
            <el-image
              style="position: static"
              :src="item.imageUrl"
              fit="contain"
            >
              <div slot="placeholder" class="image-slot">
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
          <div class="bottom">
            <p class="productName">{{ item.name }}</p>
            <p class="productCode">
              出厂货号：<span>{{ item.fa_no }}</span>
            </p>
            <p class="productPrice" v-show="(productInfo && productInfo.productOfferType) !== 'company'">
              出厂价：<span class="price">
                {{ '￥' + item.unitPrice.toFixed(2) }}
              </span>
            </p>
            <p class="productPrice">
              报价：<span class="price">{{
                item.cu_de + item.offerAmount.toFixed((item.decimalPlaces || 2))
              }}</span>
            </p>
          </div>
        </el-card>
      </div>
        <center><i :class="{'el-icon-loading':!disabled}"></i>{{ disabled ? '没有更多了...' : '加载中...' }}</center>
      </template>
      <el-image
        v-else
        style="width: 100%; position: static"
        :src="require('@/assets/images/暂无产品.png')"
        fit="contain"
      ></el-image>
      <footer class="myFooter">
        <span style="flex:1;"></span>
        <span style="flex:1;"></span>
        <span style="flex:1;textAlign:right;">{{(productInfo && productInfo.companyName) || '小竹熊 云科技'}}</span>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentCate: null,
      allCateCount: 0,
      isActive: null,
      isItemActive: null,
      dateList: [
        { label: '全部', value: '' },
        { label: '当天', value: 'today' },
        { label: '一周', value: 'lastOneWeek' },
        { label: '一个月', value: 'lastOneMonth' },
        { label: '三个月', value: 'lastThreeMonth' },
        { label: '六个月', value: 'lastHalfYear' }
      ],
      packingDatetime: null,
      categoryList: [],
      categoryChildren: [],
      packingList: [],
      packingOptions: {
        minPrice: null,
        maxPrice: null,
        pa_nu: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      },
      isShowShaixuan: false,
      scrollable: false,
      url: window.location.href,
      keyword: null,
      productInfo: null,
      productList: [],
      currentPage: 1,
      pageSize: 10,
      categoryNumber: '',
      totalCount: 0,
      isList: true,
      isPrice: 0,
      isDate: 0,
      isHot: 0,
      isCate: 0,
      isScreen: 0,
      sortOrder: 0,
      sortType: null
    }
  },
  methods: {
    // 获取所有分类
    async getProductCategoryList () {
      this.$store.commit('updateAppLoading', true)
      const res = await this.$http.post('/api/SelectProductCategory', { companyNumber: this.productInfo.companyNumber })
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item
        // this.categoryChildren = this.categoryList[0].children
      } else {
        this.$message.error(res.data.result.msg)
      }
      this.$store.commit('updateAppLoading', false)
    },
    // 重置分类搜索
    resetCategory () {
      this.isActive = null
      this.isItemActive = null
      this.currentCate = null
      this.categoryChildren = null
    },
    // 高级搜索
    subPackingOptions () {
      this.currentPage = 1
      this.getProductOfferDetailPage()
      this.isScreen = 0
      this.isCate = 0
    },
    // 重置
    resetPackingOptions () {
      this.packingOptions = {
        minPrice: null,
        maxPrice: null,
        pa_nu: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      }
      this.packingDatetime = null
    },
    // 格式化时间
    formatTime (param) {
      const y = param.getFullYear()
      let m = param.getMonth() + 1
      let d = param.getDate()
      m = m < 10 ? ('0' + m) : m
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    getDateList (code) {
      if (code) {
        const date = new Date()
        const endTime = this.formatTime(date)
        const date1 = Date.parse(date)
        let start = ''
        const oneDay = 1000 * 3600 * 24

        switch (code) {
          // 今天
          case 'today':
            start = new Date()
            break
          // 最近1周
          case 'lastOneWeek':
            start = date1 - oneDay * 7
            break
          // 最近1月
          case 'lastOneMonth':
            start = new Date()
            start.setMonth(start.getMonth() - 1)
            break
          // 最近3月
          case 'lastThreeMonth':
            start = new Date()
            start.setMonth(start.getMonth() - 3)
            break
          // 最近半年
          case 'lastHalfYear':
            start = date1 - oneDay * 183
            break
        }
        this.packingOptions.startTime = this.formatTime(new Date(start)) + 'T00:00:00'
        this.packingOptions.endTime = endTime + 'T23:59:59'
      } else {
        this.packingOptions.startTime = null
        this.packingOptions.endTime = null
      }
      console.log(this.packingOptions)
    },
    // 获取包装方式list
    async getProductChpaList () {
      const fd = {}
      if (this.productInfo.productOfferType !== 'company') fd.supplierNumber = this.productInfo.companyNumber
      const res = await this.$http.post('/api/GetProductChpaList', fd)
      if (res.data.result.code === 200) {
        this.packingList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    showShaixuan () {
      console.log(1)
    },
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
    // 关键字搜索
    search () {
      this.currentPage = 1
      this.getProductOfferDetailPage()
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
    // 查看联系方式
    toContact (e) {
      this.$router.push({ name: 'offerContact', params: { id: this.$route.query.id } })
    },
    // 切换列表
    checkList () {
      this.isList = !this.isList
    },
    // 热度排序
    sortHot (number) {
      this.sortOrder = number
      this.sortType = this.isHot = this.isHot === 1 ? 2 : 1
      this.isDate = this.isPrice = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 价格排序
    sortPrice (number) {
      this.sortOrder = number
      this.sortType = this.isPrice = this.isPrice === 1 ? 2 : 1
      this.isScreen = this.isCate = this.isHot = this.isDate = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 时间排序
    sortDate (number) {
      this.sortOrder = number
      this.sortType = this.isDate = this.isDate === 1 ? 2 : 1
      this.isScreen = this.isCate = this.isHot = this.isPrice = 0
      this.currentPage = 1
      this.getProductOfferDetailPage()
    },
    // 点击筛选事件
    sortScreen () {
      this.isCate = 0
      // this.sortOrder = 0
      this.isScreen = this.isScreen === 1 ? 0 : 1
      // this.isCate = this.isDate = this.isHot = this.isPrice = 0
    },
    // 点击分类事件
    sortCate () {
      this.isScreen = 0
      // this.isActive = null
      // this.allCateCount = 0
      // this.sortOrder = 0
      this.isCate = this.isCate === 1 ? 0 : 1
      // this.isActive = this.isScreen = this.isDate = this.isHot = this.isPrice = 0
    },
    // 下拉加载更多
    load () {
      this.currentPage++
      this.getProductOfferDetailPage(true)
    },
    handleChange (value) {
      // 重新搜索产品列表
      this.currentPage = 1
      this.getProductOfferDetailPage()
      // this.$refs.clearSelect.panel.activePath = []
      // this.$refs.clearSelect.panel.syncActivePath()
      // this.$refs.clearSelect.dropDownVisible = false
    },
    resetSelect (flag) {
      if (flag && this.$refs.clearSelect.getCheckedNodes().length === 0) {
        // 重置激活路径，级联下拉框恢复默认，收起展开节点路径面板
        this.$refs.clearSelect.panel.activePath = []
        this.$refs.clearSelect.panel.syncActivePath()
      }
    },
    // 滚动事件
    baojiaScroll (e) {
      const top = e.target.scrollTop
      const boxOne = $('.boxOne').outerHeight(true)
      const item = document.getElementsByClassName('boxTwo')[0]
      const itemHeight = $('.boxTwo').outerHeight(true)
      const box = $('.productList')[0]
      if (top >= boxOne) {
        item.style.position = 'fixed'
        item.style.left = '0'
        item.style.top = '0'
        box.style.paddingTop = itemHeight + 'px'
      } else {
        item.style.position = 'static'
        box.style.paddingTop = 0 + 'px'
      }
    },
    // 获取报价信息产品列表
    async getProductOfferDetailPage (flag) {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        offerNumber: this.$route.query.id,
        categoryNumber: this.currentCate && this.currentCate.id,
        keyword: this.keyword,
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        ...this.packingOptions
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      console.log(fd)
      const res = await this.$http.post('/api/ProductOfferDetailPage', fd)
      if (res.data.result.code === 200) {
        this.productList = flag
          ? this.productList.concat(res.data.result.item.items)
          : res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取报价信息
    async getProductOfferByNumber () {
      const res = await this.$http.post('/api/GetProductOfferByNumber', {
        offerNumber: this.$route.query.id
      })
      if (res.data.result.code === 200) {
        this.productInfo = res.data.result.item
        this.getProductChpaList()
        this.getProductCategoryList()
        document.title = this.productInfo.companyName
        this.$nextTick(() => {
          this.onScrollable()
        })
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 点击列表进入详情页
    productDetail (id) {
      if (!id) {
        this.$message.error('该产品没有产品编号')
        return false
      }
      this.$router.push({ name: 'offerDetail', params: { id: id, pid: this.$route.query.id } })
    }
  },
  created () {
    this.getProductOfferByNumber()
    this.getProductOfferDetailPage()
  },
  beforeDestroy () {
    document.title = '小竹熊 云科技'
  },
  computed: {
    noMore () {
      return this.totalCount <= this.productList.length
    },
    disabled () {
      return this.$store.state.vueElementLoading || this.noMore
    }
  },
  mounted () {
    if (this.$store.state.screenWidth > 1024) this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
  },
  watch: {
    '$store.state.screenWidth' (val) {
      if (val > 1024) {
        this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
      }
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.baojia {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  font-size: 0.32rem;
  &::-webkit-scrollbar {
    display: none;
  }
  .boxTwo{
    width: 100%;
    background-color: #fff;
    position: relative;
    z-index: 1;
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
  .text {
    font-size: 0.186667rem;
  }

  .item {
    margin-bottom: 0.24rem;
    &:last-of-type {
      margin-bottom: 0;
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
  .keyWordSearch {
    width: 95%;
    margin: 0.266667rem auto;
    height: 0.8rem;
    background: #eceeef;
    border-radius: 0.453333rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    .el-input{
      height: 100%;
      background-color: transparent;
      flex: 1;
      @{deep} input{
        height: 100%;
        background-color: transparent;
        width: 100%;
        border: none;
        // font-size: 0.346667rem;
        font-size: 0.32rem;
        text-indent: 0.266667rem;
      }
    }
    .el-button{
      width: 1.866667rem;
      height: 100%;
      border-radius: 0.5rem;
      // font-size: 0.346667rem;
      font-size: 0.32rem;
      background-color: #165AF7;
    }
  }
  .floatSearch {
    width: 100%;
    // margin: 0 auto;
    background-color: #fff;
    padding: 0 0.2rem;
    box-sizing: border-box;
    position: relative;
    .screens,.category{
      position: absolute;
      width: 100%;
      font-size: 0.25rem;
      box-sizing: border-box;
      left: 0;
      background-color: #fff;
      box-shadow: 1px 3px 10px 1px rgba(0, 60, 200, 0.1);
    }
    .screens{
      .contentWrap{
        padding: 0.366667rem 0.2rem;
        padding-bottom: 0;
        .item{
        display: flex;
        justify-content: space-between;
        .left,.right{
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          .title{
            flex: 1;
            white-space:nowrap;
          }
        }
        // .right{
        //   padding-left: 10px;
        // }
        .left{
          padding-right: 0.133333rem;
        }
      }
      }
      .packing,.selectImg{
        display: flex;
        align-items: center;
      }
      .selectImg{
        margin-top: 0.266667rem;
        .title{
          margin-right:0.266667rem;
        }
      }
      .submitBtnList {
        margin-top: 0.5rem;
        display: flex;
        .reset,.submit{
          flex: 1;
          text-align: center;
          padding: 0.2rem;
          margin: 0;
          border: none;
          border-radius: 0;
          font-size: 0.25rem;
        }
        .reset{
          background-color: #ccc;
          color: #000;
        }
        .submit{
          background-color: #165af7;
        }
      }
    }
    .category{
      .contentWrap{
        height: 5.333333rem;
        bottom: -5.333333rem;
        display: flex;
        justify-content: space-between;
      .leftCate{
        width: 2rem;
        height: 100%;
        padding: 0.2rem 0;
        box-sizing: border-box;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .cateItens{
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          overflow-x: hidden;
          overflow-y: scroll;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
          .item{
            width: 100%;
            padding-bottom: 0.2rem;
            margin: 0;
            box-sizing: border-box;
            background-color: #fff;
            &:last-of-type{
              padding: 0;
            }
            &.active{
              color: #165af7;
            }
          }
        }
      }
      .rightCate{
        flex: 1;
        height: 100%;
        background-color: #e4f3ff;
        padding: 0.2rem 0.2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .allCateCount{
          padding-bottom: 0.2rem;
          &.active {
            color: #165af7;
          }
        }
        .cateItens{
          width: 100%;
          display: flex;
          flex: 1;
          flex-wrap: wrap;
          align-content: flex-start;
          overflow-x: hidden;
          overflow-y: scroll;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
          &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
          .item{
            margin-right: 0.3rem;
            &.active{
              color: #165af7;
            }
          }
        }
      }
      }
      .submitBtnList {
        display: flex;
        .reset,.submit{
          flex: 1;
          text-align: center;
          padding: 0.2rem;
          margin: 0;
          border: none;
          border-radius: 0;
          font-size: 0.25rem;
        }
        .reset{
          background-color: #ccc;
          color: #000;
        }
        .submit{
          background-color: #165af7;
        }
      }
    }
    .listTitle {
      width: 100%;
      height: 0.933333rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
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
          border-radius: 0 0.066667rem 0.066667rem 0;
        }
      }
    }
    .filterProduct{
      width: 100%;
      height: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.293333rem;
      color: #707070;
      border-bottom: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      .filterItem{
        flex: 1;
      }
      .more{
        display: flex;
        justify-content: flex-end;
        i.list{
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          background: url('~@/assets/images/格式化列表.png') no-repeat center;
          background-size: contain;
        }
        i.square{
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          background: url('~@/assets/images/liebiao2.png') no-repeat center;
          background-size: contain;
        }
      }
      .active {
        color: #165AF7;
      }
    }
  }
    .productList {
    width: 95%;
    margin: 0 auto 0.666667rem auto;
    font-size: 0.26rem;
    .listItems {
      .listItem {
        margin-bottom: 0.266667rem;
        border-radius: 0.133333rem;
        &:first-of-type {
          margin-top: 0.266667rem;
        }
        @{deep} .el-card__body {
          padding: 0.133333rem;
          .contentBox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
            margin-right: 0.133333rem;
            border-radius: 0.133333rem;
            box-sizing: border-box;
            display:flex;
            align-items:center;
            width: 2rem;
            height: 2rem;
            .el-image{
              width: 100%;
              height: 100%;
              img{
                width: 100%;
              }
            }
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #626262;
              p{
                padding: 2px 0;
                &.productName {
                font-weight: 600;
                color: #000;
              }
              &.productPrice {
                .price {
                  color: #f54d35;
                  font-weight: 500;
                }
              }
            }
          }
          }
          .createDate{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 0.133333rem;
            color: #626262;
            .dateIcon {
              display: block;
              width: 0.266667rem;
              height: 0.266667rem;
              background: url('~@/assets/images/报价分享时间.png') no-repeat center;
              background-size:contain;
              margin-right: 0.066667rem;
            }
          }
        }
      }
    }
    .squareItems{
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding-bottom: 0.266667rem;
      .squareItem{
        width: 48%;
        margin-top: 0.24rem;
        @{deep} .el-card__body{
          padding: 0.133333rem;
        }
        .top{
          width: 100%;
          height: 2.32rem;
          .el-image{
            width: 100%;
            height: 2.32rem;
            img {
              width: 100%;
              height: 2.32rem;
            }
          }
        }
        .bottom{
          padding-bottom: 0.066667rem;
          color: #626262;
          p {
            padding-top: 0.133333rem;
            &.productName{
              color: #000;
              font-weight: 500;
            }
            .price{
              color: #f54d35;
              font-weight: 500;
            }
          }
        }
      }
    }
    .myFooter{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.666667rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      padding: 0 0.333333rem;
      box-sizing: border-box;
      color: #88ca93;
    }
  }
}

.el-select-dropdown__wrap {
    max-height: 3.653333rem;
    .el-select-dropdown__list {
    padding: 0.08rem 0;
    .el-select-dropdown__item{
      font-size: 0.266667rem;
      padding: 0 0.266667rem;
      height: 0.666667rem;
      line-height: 0.666667rem;
    }
  }
}
</style>
