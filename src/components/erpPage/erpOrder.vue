<template>
  <div class="erpOrderBox">
    <div class="erweimaApp" @mouseenter="hoverLogo" @mouseleave="hoverIsLogo">
      <img class="jiaerweima" :src="jiaerweima" alt="" />
      <div class="saomaDiv" v-show="isActive">
        <div class="saoma"></div>
      </div>
    </div>
    <div class="titleBox">
      <div class="logo">
        <img src="~@/assets/images/logo.png" alt="" />
      </div>
      <h1 class="title">同步择样订单</h1>
      <div class="titleEn">
        <span class="titleEnSpan">Synchronize orders</span>
      </div>
    </div>
    <div class="synchronizeOrders">
      <el-table
        :header-cell-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        :data="tableList"
        id="myTable"
        border
        ref="singleTable"
        size="medium"
        height="570"
        tooltip-effect="dark"
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <el-table-column label="选择" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="hall_na"
          label="择样来源"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="the_nu"
          label="本次代号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="择样编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="happenDate"
          label="择样时间"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{
              scope.row.happenDate &&
                scope.row.happenDate.replace(/t[\s\S]+/gi, "")
            }}
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
        <div class="myPagination">
          <div class="total">
            共
            <span style="color:#165af7;font-weight:bold;">{{ totalCount }}</span>
            条
          </div>
          <div class="pages" v-show="tableList && tableList.length > 1">
            <div class="shouye" @click="toOnePage">首页</div>
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              background
              prev-text="上一页"
              next-text="下一页"
              :total="totalCount"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              :page-sizes="[6, 9, 15, 30]"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </div>
      </center>
      <el-input
        id="SampleOrder"
        v-model="currentValue"
        placeholder="隐藏域"
        type="hidden"
      ></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jiaerweima: require('@/assets/images/erweimaicon@2x.png'),
      isActive: false,
      value: null,
      currentSelectItem: {
        // 选中的值
        token:
          this.$store.state.userInfo && this.$store.state.userInfo.accessToken,
        number: null
      },
      tableList: [],
      totalCount: null,
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    currentValue () {
      return JSON.stringify(this.currentSelectItem)
    }
  },
  methods: {
    toOnePage () {
      if (this.currentPage === 1) {
        this.$message.error('已经在首页了呢')
        return
      }
      this.currentPage = 1
      this.getOrderList()
    },
    hoverLogo () {
      this.isActive = true
      this.jiaerweima = require('@/assets/images/erweima2.png')
    },
    hoverIsLogo () {
      this.jiaerweima = require('@/assets/images/erweimaicon@2x.png')
      this.isActive = false
    },
    async waitTime (s) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve()
        }, 1000 * s)
      })
    },
    currentChange (page) {
      this.currentPage = page
      this.getOrderList()
    },
    handleSizeChange (pages) {
      this.pageSize = pages
      if (this.currentPage * pages > this.totalCount) return
      this.getOrderList()
    },
    async getOrderList () {
      const res = await this.$http.post('/api/SampleOrderERPPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        OrderType: 'Sample'
      })
      if (res.data.result.code === 200) {
        // for (let i = 0; i < 20; i++) {
        //   this.tableList.push(res.data.result.item.items[0])
        // }
        this.tableList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.message)
      }
    },
    handleSelectionChange (row) {
      if (row) {
        this.tableList.forEach(item => {
          // 排他,每次选择时把其他选项都清除
          switch (item.orderNumber) {
            case row.orderNumber:
              item.checked = true
              break
            default:
              item.checked = false
              break
          }
        })
        this.currentSelectItem.number = row.orderNumber
      }
    }
  },
  mounted () {
    this.getOrderList()
  },
  async beforeDestroy () {
    //  this.$store.dispatch("getToken");
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.erpOrderBox {
  width: 800px;
  height: 800px;
  background: url("~@/assets/images/erpbg.png") no-repeat center;
  background-size: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 60px 40px 0 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .erweimaApp {
    position: absolute;
    right: 0;
    width: 34px;
    top: 110px;
    height: 34px;
    border: 1px solid #165af7;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(0, -50%);
    &:hover {
      background-color: #165af7;
    }
    .jiaerweima {
      width: 18px;
      height: 18px;
      left: -50%;
      top: 50%;
    }
    .saomaDiv {
      position: absolute;
      width: 120px;
      height: 100px;
      left: -110px;
      .saoma {
        width: 100px;
        height: 100px;
        position: absolute;
        box-sizing: border-box;
        background: url("~@/assets/images/erweimaxiazai.png") no-repeat center;
        background-size: 100%;
        &::after {
          content: "";
          display: block;
          position: absolute;
          right: -19px;
          top: 50%;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-left-color: #fff;
        }
      }
    }
  }
  .titleBox {
    height: 100px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    .logo {
      position: absolute;
      top: 50%;
      height: 72px;
      left: 0;
      transform: translate(0, -50%);
      img {
        height: 72px;
      }
    }
    .title {
      width: 100%;
      font-size: 25px;
      padding: 0;
      margin: 0;
      vertical-align: top;
      font-family: Source Han Sans CN;
      font-weight: 500;
      margin-bottom: 12px;
      color: #000000;
    }
    .titleEn {
      width: 100%;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      .titleEnSpan {
        position: relative;
        padding: 0 10px;
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 60px;
          height: 2px;
          background-color: #165af7;
          top: 50%;
        }
        &::before {
          left: 100%;
        }
        &::after {
          right: 100%;
        }
      }
    }
  }
  .synchronizeOrders {
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
    @{deep} #myTable {
      background: transparent;

      @{deep} .el-table__body tr.current-row > td {
        background-color: #e0f2ff !important;

        /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
      }
      @{deep} tr.el-table__row {
        background-color: transparent;
      }

      @{deep} .el-table__empty-block {
        background: url("~@/assets/images/无数据.png") no-repeat center;
        @{deep} .el-table__empty-text {
          opacity: 0;
        }
      }
    }
    @{deep} .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #f5fbff !important;
      /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
    }
    @{deep} .el-table .sort-caret.ascending {
      border-bottom-color: #fff;
      top: 5px;
    }
    @{deep} .el-table .ascending .sort-caret.ascending {
      border-bottom-color: #409eff;
    }
    @{deep} .el-table .sort-caret.descending {
      border-top-color: #fff;
    }
    @{deep} .el-table .descending .sort-caret.descending {
      border-top-color: #409eff;
    }
    .el-pagination {
      position: relative;
      @{deep} .el-pagination__total {
        position: absolute;
        left: 0;
        font-weight: 400;
        color: #606266;
      }
      @{deep} .el-pagination__jump,
      @{deep}.btn-prev,
      @{deep}.el-pager,
      @{deep}.btn-next {
        float: right;
      }
    }
  }
}
.myPagination {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  .pages {
    display: flex;
    align-items: center;
    .shouye {
      font-size: 13px;
      margin-right: 10px;
      cursor: pointer;
    }
    @{deep} .btn-next,
    @{deep} .btn-prev {
      background-color: transparent;
      color: #000;
    }
  }
}
// @media screen and (max-width: 1025px) {
//   .SynchronizeOrders {
//     width: 80%;
//     font-size: 20px;
//     #myTable {
//       width: 100%;
//     }
//   }
// }
// @media screen and (max-width: 415px) {
//   .SynchronizeOrders {
//     width: 100%;
//     font-size: 16px;
//     #myTable {
//       width: 100%;
//     }
//   }
// }
</style>
