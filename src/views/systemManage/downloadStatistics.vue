<template>
  <el-container>
    <div class="testBox"></div>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <!-- <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;"> -->
    <div style="max-width: 1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="公司查询">
          <el-input
            v-model="formInline.companyKeyword"
            clearable
            placeholder="公司名称/公司编号"
            @keyup.enter.native="search"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工查询">
          <el-input
            v-model="formInline.personnelKeyword"
            clearable
            placeholder="员工姓名"
            @keyup.enter.native="search"
            style="width: 90%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间段搜索">
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
    </div>
    <div class="tableContent">
      <el-table
        :data="SMSInfoList"
        style="width: 100%"
      >
        <el-table-column
          prop="companyName"
          align="center"
          label="公司名称"
        ></el-table-column>
        <el-table-column prop="companyNumber" label="公司编号" align="center"></el-table-column>
        <el-table-column
          prop="personnelName"
          align="center"
          label="员工名称"
        ></el-table-column>
        <el-table-column
          prop="downloadCount"
          label="下载次数"
          align="center"
        ></el-table-column>
        <el-table-column prop="createdOn" label="下载时间" sortable align="center">
          <template slot-scope="scope">{{
            scope.row.createdOn.replace(/T/g, " ")
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              style="margin-right:10px;"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除此角色吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column> -->
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
      SMSInfoList: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      formInline: {
        // 搜索表单
        keyword: null,
        dateTile: null,
        companyKeyword: null,
        personnelKeyword: null
      },
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
    search () {
      this.currentPage = 1
      this.getSearchDownloadInfosPage()
    },
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getSearchDownloadInfosPage()
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getSearchDownloadInfosPage()
    },
    // 获取下载统计列表
    async getSearchDownloadInfosPage () {
      const fd = { skipCount: this.currentPage, maxResultCount: this.pageSize, startTime: this.formInline.dateTile && this.formInline.dateTile[0], endTime: this.formInline.dateTile && this.formInline.dateTile[1], companyKeyword: this.formInline.companyKeyword, personnelKeyword: this.formInline.personnelKeyword }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/SearchDownloadInfosPage', fd)
      if (res.data.result.code === 200) {
        this.SMSInfoList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.message)
      }
    }
  },
  created () {
    this.getSearchDownloadInfosPage()
  },
  mounted () {

  }
}
</script>
<style scoped lang='less'>
.searchBox {
  padding-top: 50px;
  box-sizing: border-box;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding-bottom: 20px;
  box-sizing: border-box;
}
</style>
