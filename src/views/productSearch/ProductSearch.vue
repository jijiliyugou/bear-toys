<template>
  <el-container>
    <el-header style="padding:0;">
    <bsTop></bsTop>
  </el-header>
  <el-main style="padding:20px 0;overflow:visible;">
    <div class="myWrap">
      <productSearchTop parentEl="searchIndex"></productSearchTop>
    <ul class="hotSearch">
      <li style="minWidth:60px;">热门搜搜：</li>
      <div class="item">
        <li
        @click="toSearchIndex(item.productName)"
        v-for="(item, i) in hotWords"
        :key="i"
      >
        {{ item.productName }}
      </li>
      </div>
    </ul>
    <div class="lunbo" v-if="!carouselList || !carouselList.length">
      <h5>
        新品推荐
        <span class="gengduo" @click="$router.push('/searchIndex')"
          >查看更多</span
        >
      </h5>
      <div class="zanwuxinpin"></div>
    </div>
    <div class="lunbo" v-else>
      <h5>
        新品推荐
        <span class="gengduo" @click="$router.push('/searchIndex')"
          >查看更多</span
        >
      </h5>
      <div class="mySwiper" @mouseenter="boxEnter" @mouseleave="boxleave">
        <swiper
          v-cloak
          :dataList="carouselList"
          :speed="2"
          :direction="direction"
          :isShow="isShow"
        ></swiper>
      </div>
    </div>
    </div>
  </el-main>
  <el-footer style="padding:0;" height="162px">
    <bsFooter></bsFooter>
  </el-footer>
  </el-container>
</template>

<script>
import bsTop from '@/components/BsTop'
import productSearchTop from '@/components/productSearchTop'
import swiper from '@/components/swiper'
import bsFooter from '@/components/oldFooter'
export default {
  components: { bsTop, productSearchTop, swiper, bsFooter },
  data () {
    return {
      hotWords: [],
      isShow: false,
      direction: 'left',
      carouselList: [],
      currentPage: 1,
      pageSize: 20
    }
  },
  methods: {
    // 去产品列表
    async toSearchIndex (val) {
      this.$store.commit('searchTxtValues', val)
      this.$router.push({ path: '/searchIndex' })
    },
    // 获取搜索热词
    async getHotWord () {
      const res = await this.$http.post('/api/GetHotWord', {})
      if (res.data.result.code === 200) {
        this.hotWords = res.data.result.item
      } else {
        this.$message.error(res.data.result.item.message)
      }
    },
    // 获取新品推荐
    async getNewArrivalsPage () {
      const res = await this.$http.post('/api/GetNewArrivalsPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        AuditStatus: 0
      })
      if (res.data.result.code === 200) {
        this.carouselList = res.data.result.item.items
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    boxEnter () {
      this.isShow = true
    },
    boxleave () {
      this.isShow = false
    }
  },
  mounted () {
    this.getHotWord()
    this.getNewArrivalsPage()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.myWrap{
  width: 100%;
  .mySearchBox {
  width: 1200px;
  text-align: center;
  margin: 30px 0;
  .myCamera {
    color: black;
    font-size: 22px;
    cursor: pointer;
  }
  }
  .hotSearch {
    width: 1200px;
    min-width: 1024px;
    margin:0 auto;
    display: flex;
    justify-content: center;
    li {
      margin:10px;
      font-size: 12px;
    }
    .item{
      display: flex;
      flex-wrap:wrap;
      li{
        margin: 10px;
        color: #ccc;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .lunbo {
    max-width: 1200px;
    min-width: 1024px;
    margin: 100px auto 10px auto;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
    .gengduo {
      float: right;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
