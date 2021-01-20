<template>
<div class="wrapBox">
    <!-- 打开择样排行列表 -->
      <div class="rankingWrapContent">
          <p class="titleTXT">择样排行</p>
          <div class="bigRankingHeaderTop">
            <div class="changshang">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">厂商名称</div>
            </div>
            <div class="huohao">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">出厂货号</div>
            </div>
            <div class="zeyangshu">
              <div class="icon">
                <i></i>
              </div>
              <div class="text">择样数</div>
            </div>
          </div>
        </div>

        <ul
          class="rankingWrapBody"
          v-infinite-scroll="addSampleSelectionList"
          infinite-scroll-disabled="activeAddSample"
        >
          <template v-if="sampleSelectionList && sampleSelectionList.length">
            <li v-for="(item, i) in sampleSelectionList" :key="i">
              <span class="item">{{ item.ma_na }}</span>
              <span class="item">{{ item.fa_no }}</span>
              <span class="item">{{ item.sumfa_no }}</span>
            </li>
            <center style="padding:10px;backgroundColor:#f5f7fa;color:#aaa">
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </ul>
</div>
</template>

<script>
export default {
  props: ['options'],
  data () {
    return {
      loading: false,
      mySampleSelectionCurrentPage: 1,
      sampleSelectionPageSize: 20,
      sampleSelectionList: [],
      myProductSearchValue: null,
      sampleSelectionTotalCount: 0
    }
  },
  methods: {
    // 下拉加载更多
    async addSampleSelectionList () {
      this.mySampleSelectionCurrentPage++
      const res = await this.getSampleSelectionList()
      if (res.data.result.code === 200) {
        this.sampleSelectionList = this.sampleSelectionList.concat(res.data.result.item)
        this.sampleSelectionTotalCount = res.data.result.item.totalCount
      }
    },
    // 获取 历史择样
    async getSampleSelectionList () {
      return await this.$http.post('/api/ProductRanking', {
        companyNumber: this.options.client_nu,
        pageIndex: this.mySampleSelectionCurrentPage,
        pageSize: this.sampleSelectionPageSize
      })
    }
  },
  created () {

  },
  async mounted () {
    const res = await this.getSampleSelectionList()
    if (res.data.result.code === 200) {
      this.sampleSelectionList = res.data.result.item
      this.sampleSelectionTotalCount = res.data.result.item.totalCount
    }
  },
  computed: {
    noMore () {
      return this.sampleSelectionList.length >= this.sampleSelectionTotalCount
    },
    disabled () {
      return this.loading || this.noMore
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
  height: 825px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-direction: column;
  .rankingWrapContent {
        width: 100%;
        height: 150px;
        padding: 0 20px;
        box-sizing: border-box;
        background-color: #165af7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .titleTXT {
          color: white;
          text-align: center;
          padding: 20px;
        }
        .bigRankingHeaderTop {
          width: 100%;
          flex: 1;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          justify-content: space-between;
          .changshang,
          .huohao,
          .zeyangshu,
          .name {
            height: 100%;
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            align-content: center;
            .text,
            .icon {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .icon {
              margin-bottom: 5px;
              i {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
            }
          }
          .changshang {
            .icon {
              i {
                background: url("~@/assets/images/工厂.png") no-repeat center;
                background-size: cover;
                border-radius: 0;
              }
            }
          }
          .huohao {
            position: relative;
            &::before,
            &::after {
              content: "";
              position: absolute;
              height: 20px;
              width: 2px;
              top: 50%;
              background-color: #bfbfbf;
              transform: translate(0, -50%);
            }
            &::before {
              left: -1px;
            }
            &::after {
              right: -1px;
            }
            .icon {
              i {
                background: url("~@/assets/images/编号@2x (1).png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .name {
            .icon {
              i {
                background: url("~@/assets/images/名称@2x.png") no-repeat center;
                background-size: contain;
              }
            }
          }
          .zeyangshu {
            .icon {
              i {
                background: url("~@/assets/images/数据@2x.png") no-repeat center;
                background-size: contain;
              }
            }
          }
        }
  }
  .rankingWrapBody {
        font-size: 14px;
        border: none;
        height: 675px;
        width: 100%;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          border: none;
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #f2f2f2;
          padding: 0 20px;
          .item {
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 0 5px;
          }
          .imgItem {
            flex: 1;
            text-align: center;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 5px;
            @{deep} .el-image {
              cursor: pointer;
            }
          }
        }
      }
}
.zanwushuju1 {
  width: 100%;
  height: 382px;
  margin: 0 auto;
  background: url("~@/assets/images/暂无数据.png") no-repeat center;
  background-size: 100%;
  position: absolute;
  left: 0;
}
</style>
