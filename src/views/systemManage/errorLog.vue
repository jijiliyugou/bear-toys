<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <!-- 搜索 -->
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="关键字查询">
         <el-input
              @keyup.enter.native="search"
              clearable
              v-model="searchForm.keyword"
              placeholder="输入关键字"
              style="width: 90%"
            ></el-input>
        </el-form-item>
        <el-form-item label="状态查询">
          <el-select
          clearable
            v-model="searchForm.state"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in [
                { label: '全部', value: '' },
                { label: '未处理', value: 0 },
                { label: '已处理', value: 1 }
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段搜索">
          <el-date-picker
            v-model="searchForm.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="daterange"
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
        size="mini"
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="platform" label="终端" width="80"></el-table-column>
        <el-table-column prop="logType" label="日志类型" width="100" align="center">
          <template slot-scope="scope">
           <el-tag :type="scope.row.logType===0?'danger':scope.row.logType===1?'warning':''" effect="plain">{{scope.row.logType===0?'接口闪退':scope.row.logType===1?'接口超时':'请求失败'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="日志标题" align="center"></el-table-column>
        <el-table-column prop="url" label="地址"></el-table-column>
        <!-- <el-table-column prop="parameters" label="请求参数"></el-table-column> -->
        <el-table-column prop="message" label="错误信息"></el-table-column>
        <el-table-column prop="state" label="处理状态" width="80">
          <template slot-scope="scope">
           <el-tag :type="scope.row.state?'success':'danger'">{{scope.row.state?'已处理':'未处理'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdOn"
          label="报错时间"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.createdOn && scope.row.createdOn.replace(/T/g, " ") }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="处理意见"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              style="margin-right:10px;"
              size="mini"
              type="primary"
              @click="openEdit(scope.row)"
              >处理错误</el-button
            >
            <!-- <el-popconfirm
              title="确定要删除这个版本吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm> -->
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
    <!-- <div style="maxWidth:1200px;minWidth:800px;margin:0 auto;">
    </div> -->
    <!-- 处理错误日记dialog -->
    <el-dialog title="处理日志" :visible.sync="errorLogDialog" destroy-on-close width="50%">
      <el-form
        ref="addVersionForm"
        label-width="100px"
        :model="errorLogFormData"
      >
        <el-form-item label="终端" prop="platform">
          <el-input v-model="errorLogFormData.platform" disabled></el-input>
        </el-form-item>
        <el-form-item label="日志类型" prop="logType">
          <!-- <el-tag :type="errorLogFormData.logType===0?'danger':errorLogFormData.logType===1?'warning':''" effect="plain">{{errorLogFormData.logType===0?'接口闪退':errorLogFormData.logType===1?'接口超时':'请求失败'}}</el-tag> -->
           <el-input v-model="errorLogFormData.logType" disabled></el-input>
        </el-form-item>
        <el-form-item label="日志标题" prop="title">
          <el-input type="textarea" autosize resize="none" v-model="errorLogFormData.title" disabled></el-input>
          <!-- <el-tag>{{errorLogFormData.title}}</el-tag> -->
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <el-input type="textarea" autosize resize="none" v-model="errorLogFormData.url" disabled></el-input>
        </el-form-item>
        <el-form-item label="请求参数" prop="parameters">
          <el-input type="textarea" autosize resize="none" v-model="errorLogFormData.parameters" disabled></el-input>
        </el-form-item>
        <el-form-item label="错误信息" prop="message">
          <el-input type="textarea" autosize resize="none" v-model="errorLogFormData.message" disabled></el-input>
        </el-form-item>
        <el-form-item label="报错时间" prop="createdOn">
          <el-input type="textarea" autosize resize="none" v-model="errorLogFormData.createdOn" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理意见" prop="remark">
          <el-input type="textarea" placeholder="请输入处理意见" :rows="4" resize="none" v-model="errorLogFormData.remark"></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="subProcessingLog">提 交</el-button>
            <el-button type="danger" @click="errorLogDialog = false">取 消</el-button>
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
      isUpLoad: false,
      errorLogDialog: false,
      errorLogFormData: {
        platform: null,
        logType: null,
        title: null,
        message: null,
        createdOn: null,
        url: null,
        id: null,
        parameters: null,
        state: null,
        remark: null
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      editLogRules: {
        platForm: [
          { required: true, message: '请选择终端', trigger: 'change' }
        ],
        vesion: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          { min: 1, max: 9999, message: '请输入版本号', trigger: 'blur' }
        ],
        fileUrl: [
          { required: true, message: '请输入链接地址', trigger: 'blur' },
          { min: 1, max: 9999, message: '请输入链接地址', trigger: 'blur' }
        ]
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
      },
      searchForm: {
        keyword: '',
        state: '',
        dateTile: null
      }
    }
  },
  methods: {
    // 列表查询
    search () {
      this.currentPage = 1
      this.getLogErrorPage()
    },
    // 获取错误日志列表
    async getLogErrorPage () {
      const fd = {
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1],
        state: this.searchForm.state,
        keyword: this.searchForm.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/GetLogRecordPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getLogErrorPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getLogErrorPage()
    },
    // 打开处理日志窗口
    openEdit (row) {
      for (const key in this.errorLogFormData) {
        this.errorLogFormData[key] = row[key]
      }
      this.errorLogDialog = true
    },
    // 处理错误日志
    async subProcessingLog () {
      const fd = {
        platform: null,
        logType: null,
        title: null,
        message: null,
        url: null,
        id: null,
        parameters: null,
        state: null,
        remark: null
      }
      for (const key in fd) {
        fd[key] = this.errorLogFormData[key]
      }
      fd.state = true
      const res = await this.$http.post('/api/UpdateLogRecord', fd)
      if (res.data.result.code === 200) {
        await this.getLogErrorPage()
        this.errorLogDialog = false
        this.$message.success('处理成功')
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
    // 删除
    // async handleDelete (row) {
    //   const res = await this.$http.post('/api/UpdateBearVesion', {
    //     isdelete: true,
    //     id: row.id
    //   })
    //   if (res.data.result.code === 200) {
    //     this.$message.success('删除成功')
    //     this.getLogErrorPage()
    //   } else {
    //     this.$message.error('删除失败,请检查网络！')
    //   }
    // },
  },
  watch: {
  },
  mounted () {
    this.getLogErrorPage()
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
</style>
