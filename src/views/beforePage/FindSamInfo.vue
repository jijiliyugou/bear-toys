<template>
  <div style="min-height: 395px;">
    <div class="navBar">
      <div class="navBarTitle">
        找样信息
      </div>
    </div>
    <div class="findSamInfoContent">
      <div class="sendDate">
        发布时间
        <i class="jiangxu" v-show="isJiangxu" @click="handlerSort"></i>
        <i class="shengxu" v-show="!isJiangxu" @click="handlerSort"></i>
      </div>
      <template v-if="!noticeList || noticeList.length === 0">
        <div class="zanwuxinxi"></div>
      </template>
      <template v-else>
        <ul class="Infoitems">
          <li v-for="(item, i) in noticeList" :key="i">
            <div class="date">
              <div class="day">
                {{
                  item.bearNotice.publishDate
                    ? $_.last(
                        item.bearNotice.publishDate.split(/t/i)[0].split(/-/gi)
                      )
                    : ""
                }}
              </div>
              <div class="year">
                {{
                  item.bearNotice.publishDate
                    ? item.bearNotice.publishDate.split(/-/gi)[0] +
                      "-" +
                      item.bearNotice.publishDate.split(/-/gi)[1]
                    : ""
                }}
              </div>
            </div>
            <div class="txt">
              <p>{{ item.bearNotice.notice }}</p>
              <span
                @click="
                  $router.push({
                    name: 'noticeDetail',
                    params: { id: item.bearNotice.noticeNumber }
                  })
                "
                >查看更多>></span
              >
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
      isJiangxu: true,
      totalCount: 10,
      pageSize: 40,
      currentPage: 1,
      noticeList: null
    }
  },
  methods: {
    // 切换排序
    handlerSort () {
      this.isJiangxu = !this.isJiangxu
      this.noticeList.reverse()
    },
    changePage (page) {
      this.isJiangxu = true
      this.currentPage = page
      this.getNoticeList()
    },
    handleSizeChange (pageSize) {
      this.isJiangxu = true
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getNoticeList()
    },
    async getNoticeList () {
      const res = await this.$http.post('/api/BearNoticePage', {
        noticeType: 'Ordinary',
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.noticeList = res.data.result.item.result.items
        this.totalCount = res.data.result.item.result.totalCount
      }
    }
  },
  mounted () {
    this.getNoticeList()
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
.findSamInfoContent {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .sendDate {
    color: #666;
    display: flex;
    align-items: center;
    font-size: 14px;
    border-bottom: 4px solid rgba(237, 237, 237, 1);
    padding: 16px 10px 16px;
    .shengxu {
      height: 14px;
      width: 22px;
      margin-left: 5px;
      background: url("~@/assets/images/shengxu.png") no-repeat center center;
      background-size: 80%;
      cursor: pointer;
    }
    .jiangxu {
      height: 14px;
      width: 22px;
      margin-left: 5px;
      background: url("~@/assets/images/jiangxu.png") no-repeat center center;
      background-size: 80%;
      cursor: pointer;
    }
  }
  .Infoitems {
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      height: 100px;
      width: 570px;
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
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
        margin-right: 20px;
        color: rgba(22, 90, 247, 1);
        .year {
          font-size: 12px;
        }
      }
      .txt {
        width: 450px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        line-height: 30px;
        p {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 18px;
        }
        span {
          font-size: 14px;
          color: #666666;
          cursor: pointer;
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
