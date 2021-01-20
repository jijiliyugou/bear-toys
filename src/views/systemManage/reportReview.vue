<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="searchForm.keyword"
            clearable
            placeholder="关键字查询"
            @keyup.enter.native="search"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="举报类别">
          <el-select
            v-model="searchForm.reportType"
            placeholder="请选择"
            clearable
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in [
                { label: '全部', value: '' },
                { label: '屏蔽', value: 'Shield' },
                { label: '举报', value: 'Report' }
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="审核状态搜索">
          <el-select
          clearable
            v-model="searchForm.state"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in [
                { label: '全部', value: '' },
                { label: '审核通过', value: 1 },
                { label: '审核不通过', value: 0 }
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="时间段搜索">
          <el-date-picker
            v-model="searchForm.dateTile"
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
    </div>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="userImg" label="用户头像" align="center">
          <template slot-scope="scope">
            <el-image class="el-avatar" :src="scope.row.userImg" fit="cover">
              <div
                slot="error"
                size="medium"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
              >
                <img
                  style="width:100%;height:100%"
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          align="center"
        ></el-table-column>
        <el-table-column prop="reportType" label="举报类型" align="center">
          <template slot-scope="scope">
            <el-tag
              type="warning"
              effect="dark"
              v-if="scope.row.reportType === 'Shield'"
              >屏蔽</el-tag
            >
            <el-tag type="danger" effect="dark" v-else>举报</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportState" label="审核状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.reportState"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else>审核不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdOn"
          label="举报日期"
          sortable
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            {{
              scope.row.createdOn &&
                scope.row.createdOn.split(".")[0].replace(/T/g, " ")
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="reportRemark"
          label="举报原因"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="handleResult"
          label="处理意见"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定要删除这条举报信息吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
            <el-button
              style="margin-left:10px;"
              v-show="scope.row.reportType === 'Report'"
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :total="totalCount"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="shenheDialog" destroy-on-close width="50%">
      <el-form ref="shenheForm" label-width="100px" :model="shenheFormData">
        <el-form-item>
          <el-avatar
            shape="square"
            :size="100"
            fit="contain"
            :key="shenheFormData.userImg"
            :src="shenheFormData.userImg"
          >
            <img
              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="shenheFormData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="举报类型" prop="reportType">
          <el-input v-model="shenheFormData.reportType" disabled></el-input>
        </el-form-item>
        <el-form-item label="举报日期" prop="createdOn">
          <el-input v-model="shenheFormData.createdOn" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理意见" prop="handleResult">
          <el-input
            type="textarea"
            resize="none"
            v-model="shenheFormData.handleResult"
            show-word-limit
            suffix="123"
            :maxlength="
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            "
            class="txtWrap"
          ></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="review(true)">审核通过</el-button>
            <el-button type="danger" @click="review(false)"
              >审核不通过</el-button
            >
          </template>
        </center>
      </el-form>
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
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      shenheDialog: false,
      shenheFormData: {
        userImg: null,
        userName: null,
        reportType: null,
        createdOn: null,
        handleResult: null
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
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
      },
      searchForm: {
        keyword: '',
        state: '',
        dateTile: []
      }
    }
  },
  methods: {
    // 列表查询
    search () {
      this.currentPage = 1
      this.getMessageReportPage()
    },
    // 获取所有举报消息
    async getMessageReportPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        reportType: this.searchForm.reportType,
        keyword: this.searchForm.keyword,
        StartTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        EndTime: this.searchForm.dateTile && this.searchForm.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/MessageReportPage', fd)
      console.log(res)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getMessageReportPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getMessageReportPage()
    },
    // 打开审核
    handleEdit (row) {
      for (const key in row) {
        if (key === 'createdOn' && row[key].length) {
          row[key] = row[key].split('.')[0].replace(/T/g, ' ')
        }
        this.shenheFormData[key] =
          row[key] === 'Shield'
            ? '屏蔽'
            : row[key] === 'Report'
              ? '举报'
              : row[key]
      }
      this.shenheDialog = true
    },
    // 审核
    async review (flag) {
      this.shenheFormData.reportState = flag
      const res = await this.$http.post(
        '/api/UpdateMessageReport',
        this.shenheFormData
      )
      console.log(res)
      if (res.data.result.code === 200) {
        this.$message.success('审核成功')
        this.getMessageReportPage()
      } else {
        this.$message.error('审核失败，请检查网络')
      }
      this.shenheDialog = false
    },
    // 删除举报
    async handleDelete (row) {
      row.isDelete = true
      const res = await this.$http.post('/api/UpdateMessageReport', row)
      console.log(res)
      if (res.data.result.code === 200) {
        this.getMessageReportPage()
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败，请检查网络')
      }
    }
  },
  mounted () {
    this.getMessageReportPage()
  },
  created () {}
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
}
.txtWrap {
  padding: 0 0 13px 0;
  line-height: 0;
  @{deep} .el-input__count {
    line-height: 15px;
  }
}
</style>
