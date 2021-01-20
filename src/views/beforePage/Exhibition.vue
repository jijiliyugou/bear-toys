<template>
  <div>
    <div class="navBar">
      <div class="navBarTitle">
        展会信息
      </div>
    </div>
    <div class="exhibitionContent">
      <template v-if="!exhibitionList || exhibitionList.length === 0">
        <div class="zanwuxinxi"></div>
      </template>
      <template v-else>
        <div class="title">
          <h4>
            展会名称
            <span class="rightTitle">展会时间</span>
          </h4>
        </div>
        <ul class="textList">
          <li
            class="textItem"
            v-for="item in exhibitionList"
            :key="item"
            @click="toExhibitionDetail(item)"
          >
            <div class="left">
              <h4 class="text">2014法律纠纷地方撒VS得到从第三方</h4>
              <p>
                中国现代玩具行业起步于20世纪80年代中后期，伴随着中国经济的持续快速发展，国际玩具取得了长足的进步，中国也成为了全球最大的玩具生产过和出口国。2012年，中国玩具童车制造行业规模以上企业实现产品销售搜狐如1374.35亿元，教上年同期增长13.45%，河南作为中原经济区的重要省份，在玩具的物流......
              </p>
            </div>

            <div class="dateBox">
              <div class="date">
                <div class="day">23</div>
                <div class="year">2020-03</div>
              </div>
            </div>
          </li>
        </ul>
        <center style="margin:20px;">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            :page-sizes="[10, 30, 60, 100]"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="changePage"
            @size-change="handleSizeChange"
          ></el-pagination>
        </center>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalCount: 10,
      currentPage: 1,
      pageSize: 10,
      exhibitionList: 20
    }
  },
  methods: {
    toExhibitionDetail (item) {
      console.log(item)
      this.$message.error('暂无详情页')
    },
    changePage (page) {
      this.currentPage = page
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
    }
  }
}
</script>

<style lang="less" scoped>
.navBar {
  background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
  .navBarTitle {
    height: 50px;
    display: flex;
    max-width: 1200px;
    min-width: 1024px;
    margin: 0 auto;
    align-items: center;
  }
}
.exhibitionContent {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .title {
    margin-top: 20px;
    width: 100%;
    padding: 10px 0 10px 20px;
    font-size: 14px;
    box-sizing: border-box;
    border-bottom: 4px solid rgba(237, 237, 237, 1);
    font-size: 16px;
    h4 {
      color: #666666;
      display: flex;
      justify-content: space-between;
      font-weight: 500;

      .rightTitle {
        text-align: center;
        width: 180px;
      }
    }
  }
  .textList {
    width: 100%;
    padding: 20px 0 0 0;
    .textItem {
      height: 150px;
      display: flex;
      justify-content: space-between;
      padding: 5px 0 5px 20px;
      margin: 20px 0;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
      box-sizing: border-box;
      flex-wrap: wrap;
      align-content: flex-start;
      cursor: pointer;
      .left {
        flex: 1;
        .text {
          font-weight: 600;
          color: #000;
          font-size: 18px;
          margin: 28px 0;
        }
        p {
          font-size: 14px;
          color: #444;
          overflow: hidden;

          text-overflow: ellipsis;

          display: -webkit-box;

          -webkit-box-orient: vertical;

          -webkit-line-clamp: 2;
        }
      }

      .dateBox {
        width: 180px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: 1px solid rgba(235, 235, 235, 1);
        .date {
          border: 1px solid rgba(22, 90, 247, 1);
          width: 60px;
          height: 60px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: center;
          padding-top: 8px;
          box-sizing: border-box;
          color: rgba(22, 90, 247, 1);
          .year {
            font-size: 12px;
          }
        }
      }
      &:hover {
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
        .date {
          background-color: #1559f7;
          color: white;
        }
      }
    }
  }
}
</style>
