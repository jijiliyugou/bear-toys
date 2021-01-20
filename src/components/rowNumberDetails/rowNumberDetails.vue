<template>
<div class="wrapBox">
    <!-- 打开我的排号详情 -->
        <div class="personalNumberTitle">
          <p class="titleTXT">{{ options.client_na }}排号</p>
          <div class="numberWarp" @click="openNumberList">
            <el-image
              class="myImg"
              :src="options.companyLogo"
              fit="cover"
            >
              <div
                slot="placeholder"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
              >
                {{ options.client_na }}
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
              >
                {{ options.client_na }}
              </div>
            </el-image>
            <div>
              <div class="codeTitle">我的排号:</div>
              <div class="code">{{ personalNumber.arr_nu }}</div>
            </div>
          </div>
        </div>
        <div class="personalNumberContent">
          <div class="currentCode">
            <div class="left">
              <span>当前排号</span>
            </div>
            <div class="right"></div>
          </div>
          <el-table
            class="currentCodeContent"
            :data="currentCodeList"
            style="width: 100%"
            height="200"
            :cell-style="timeStyle"
            :header-row-style="headerStyle"
            v-el-table-infinite-scroll="nextCurrentCodeContent"
          >
            <el-table-column
              prop="nego_nu"
              label="洽谈室"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="arr_nu"
              label="当前排号"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="hallcountage"
              label="平均等待时间"
              align="center"
            ></el-table-column>
          </el-table>
          <div class="buyer">
            <div class="left">
              <span>采购商</span>
            </div>
            <div class="right"></div>
          </div>
          <ul class="buyerContent" v-infinite-scroll="buyerContentLoad" >
            <li
              class="buyerItem"
              v-for="(item, i) in customerVisitList"
              :key="i"
            >
              <div class="title">{{ item.client_na }}</div>
              <div class="date">
                {{
                  item.happenDate && item.happenDate.replace(/ [\s\S]+/gi, "")
                }}
              </div>
            </li>
          </ul>
        </div>
</div>
</template>

<script>
import elTableInfiniteScroll from 'el-table-infinite-scroll'
export default {
  props: ['options'],
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data () {
    return {
      customerVisitPageSize: 20,
      customerTotal: 0,
      isNoCustomerVisit: true,
      isNoCurrentNumber: true,
      customerVisitCurrentPage: 0,
      currentNumberCurrentPage: 0,
      currentNumberPageSize: 20,
      currentCodeList: [],
      customerVisitList: [],
      personalNumber: {
        arr_nu: null,
        historyNumbers: []
      }
    }
  },
  methods: {
    // 当前排号到底加载更多
    async nextCurrentCodeContent () {
      if (this.isNoCurrentNumber) {
        return
      }
      this.currentNumberCurrentPage++
      const res = await this.getCurrentNumber()
      if (res.data.result.code === 200) {
        this.currentCodeList = this.currentCodeList.concat(
          res.data.result.item
        )
      }
    },
    // 列样式
    timeStyle (column) {
      return 'color: #165af8'
    },
    // 表头样式
    headerStyle (column) {
      return 'font-weight:600;color:black;'
    },
    // 采购商下拉加载
    async buyerContentLoad () {
      console.log('下拉到底了', this.isNoCustomerVisit)
      if (this.isNoCustomerVisit) {
        return
      }
      this.customerVisitCurrentPage++
      const res = await this.getCustomerVisit()
      console.log(res)
      if (res.data.result.code === 200) {
        this.customerVisitList = this.customerVisitList.concat(
          res.data.result.item
        )
      }
    },
    // 获取排号
    async getPersonalNumber () {
      return await this.$http.post('/api/PersonalNumber', {
        companyNumber: this.options.client_nu
      })
    },
    // 初始化数据
    async getNumber () {
      const re = await this.getPersonalNumber()
      if (re.data.result.code === 200) {
        this.personalNumber = re.data.result.item
      }
      const currentNumberList = await this.getCurrentNumber()
      if (currentNumberList.data.result.code === 200) {
        if (!currentNumberList.data.result.item.length) {
          this.isNoCurrentNumber = false
        }
        this.currentCodeList = currentNumberList.data.result.item
      }
      const res = await this.getCustomerVisit()
      if (res.data.result.code === 200) {
        this.isNoCustomerVisit = false
        this.customerVisitList = res.data.result.item
      }
    },
    // 获取排号中的采购商
    async getCustomerVisit () {
      return await this.$http.post('/api/CustomerVisit', {
        companyNumber: this.options.client_nu,
        pageIndex: this.customerVisitCurrentPage,
        pageSize: this.customerVisitPageSize
      })
    },
    // 弹出我的排号list
    openNumberList () {
      console.log(this.personalNumber)
      this.$alert(
        (this.personalNumber.historyNumbers &&
          this.personalNumber.historyNumbers.join(',')),
        '排号',
        {
          confirmButtonText: '确定'
        }
      )
    },
    // 获取当前排号
    async getCurrentNumber () {
      return await this.$http.post('/api/CurrentNumber', {
        companyNumber: this.options.client_nu,
        pageIndex: this.currentNumberPageSize,
        pageSize: this.currentNumberCurrentPage
      })
    }
  },
  computed: {
    noMore () {
      return this.customerVisitList.length >= this.customerTotal
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  created () {

  },
  mounted () {
    this.getNumber()
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
  .personalNumberTitle {
        width: 100%;
        height: 150px;
        padding: 0 30px;
        box-sizing: border-box;
        background-color: #165af7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .titleTXT {
          box-sizing: border-box;
          color: white;
          text-align: center;
          padding: 20px;
        }
        .numberWarp {
          width: 100%;
          flex: 1;
          padding: 0 20px;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          .myImg {
            margin-right: 10px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #165af7;
            color: #fff;
          }
          .code {
            font-size: 30px;
            color: #165af8;
            font-weight: bold;
          }
        }
        .historyHeaderTop {
          width: 100%;
          flex: 1;
          background-color: #fff;
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }
.personalNumberContent {
        flex: 1;
        background-color: #fff;
        display:flex;
        flex-direction: column;
        .currentCode,
        .buyer {
          // margin-top: 5px;
          background-color: #f6f9ff;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          box-sizing: border-box;
          .left {
            font-weight: bold;
            position: relative;
            span {
              margin-left: 30px;
            }
            &::before {
              content: "";
              position: absolute;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: url("~@/assets/images/排号.png") no-repeat center;
              background-size: contain;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
          .right {
            color: #888888;
          }
        }
        .buyer {
          .left {
            &::before {
              content: "";
              position: absolute;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              background: url("~@/assets/images/采购商.png") no-repeat center;
              background-size: contain;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
        }
        .buyerContent {
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
          height: 315px;
          overflow: auto;
          font-size: 14px;
          .buyerItem {
            width: 100%;
            height: 50px;
            border: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e5e5;
            .title {
              color: #333;
            }
            .date {
              color: #555;
            }
          }
        }
      }
}
</style>
