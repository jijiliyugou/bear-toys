<template>
    <el-container class="orderManWrap">
      <el-header style="padding:0;">
        <bsTop></bsTop>
      </el-header>
    <el-main style="padding:0;overflow:visible;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            @keyup.enter.native="search"
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%;"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="时间段查询">
          <el-date-picker
            v-model="formInline.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <template v-if="!tableData || tableData.length === 0">
        <div class="zanwushuju"></div>
      </template>
      <div class="tableContent" v-else>
        <el-table :data="tableData" style="font-size:12px;">
          <el-table-column prop="orderType" label="订单类型"></el-table-column>
          <el-table-column prop="orderNumber" label="订单号"></el-table-column>
          <el-table-column prop="hall_na" label="来源"></el-table-column>
          <el-table-column
            prop="toCompanyName"
            label="公司名称"
          ></el-table-column>
          <el-table-column prop="createdOn" label="开始时间" sortable>
            <template slot-scope="scope">{{
              scope.row.createdOn.replace(/t/gi, " ")
            }}</template>
          </el-table-column>
          <el-table-column prop="messageModel" label="订单状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.messageModel === 1">择样</el-tag>
              <el-tag type="success" v-else-if="scope.row.messageModel === 2"
                >摆样</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 3"
                >补样</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 4"
                >洽谈</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 5"
                >借样</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 6"
                >带走</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 7"
                >采购</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 8"
                >厂商付款</el-tag
              >
              <el-tag type="warning" v-else-if="scope.row.messageModel === 9"
                >厂商预付款</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="happenDate" label="截至时间" sortable>
            <template slot-scope="scope">{{
              scope.row.happenDate.replace(/t/gi, " ")
            }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="eventView(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="handleDelete(scope.$index, scope.row)"
                >导出</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <center style="margin-top:20px;">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            background
            :page-sizes="[10, 20, 30, 50]"
            :total="totalPage"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="currentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </center>
      </div>
    </div>
    </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
  </el-container>
</template>

<script>
import bsTop from '@/components/BsTop.vue'
import bsFooter from '@/components/oldFooter'
export default {
  components: {
    bsTop,
    bsFooter
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      totalPage: null,
      formInline: {
        keyword: null,
        dateTile: null
      },
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    // 获取订单管理列表
    async getOrderManList () {
      const fd = {
        keyword: this.formInline.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) if (!fd[key]) delete fd[key]
      const res = await this.$http.post('/api/SampleOrderPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalPage = res.data.result.item.totalCount
      }
    },
    // 查询
    search () {
      this.currentPage = 1
      this.getOrderManList()
    },
    // 查看
    eventView (index, row) {
      console.log(index, row)
    },
    // 导出
    handleDelete (index, row) {
      console.log(index, row)
    },
    // 切换当前页
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getOrderManList()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getOrderManList()
    }
  },
  mounted () {
    this.getOrderManList()
  }
}
</script>

<style lang="less">
.orderManWrap {
  position: relative;
  .searchBox {
    max-width: 1200px;
    min-width: 1024px;
    margin: 0 auto;
    padding: 50px 0;
    box-sizing: border-box;
    .el-form {
      font-size: 12px;
      .btnList {
        float: right;
      }
    }
    .tableContent {
      .el-table {
        width: 100%;
      }
    }
    .explanation {
      height: 100px;
      width: 100%;
      margin-top: 50px;
      font-size: 12px;
      color: #999;
      ul {
        width: 100%;
        height: 100%;
        display: flex;
        li {
          flex: 1;
          .title {
            padding: 5px 0;
          }
          p {
            padding: 2px 0;
          }
        }
      }
    }
  }
}
</style>
