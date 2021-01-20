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
          <el-button type="primary" @click="openAdd">新增</el-button>
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
        <el-table-column
          prop="ch_pa"
          label="中文名"
        ></el-table-column>
        <el-table-column
          prop="en_pa"
          label="英文名"
        ></el-table-column>
        <el-table-column
          prop="pa_nu"
          label="编号"
        ></el-table-column>
        <el-table-column
          prop="createdOn"
          label="举报日期"
          sortable
        >
          <template slot-scope="scope">
            {{
              scope.row.createdOn &&
                scope.row.createdOn.split(".")[0].replace(/T/g, " ")
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <el-button
              style="margin-right:10px;"
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button>
            <el-popconfirm
              title="确定要删除这条包装信息吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
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
    <!-- 新增/编辑 -->
    <el-dialog :title="title" :visible.sync="packDialog" destroy-on-close width="50%">
      <el-form ref="packForm" :rules="packRules" label-width="100px" :model="packFormData">
        <el-form-item label="包装名称：" prop="ch_pa">
          <el-input v-model="packFormData.ch_pa"></el-input>
        </el-form-item>
        <el-form-item label="英文名称：" prop="en_pa">
          <el-input v-model="packFormData.en_pa"></el-input>
        </el-form-item>
        <el-form-item label="包装编号：" prop="pa_nu">
          <el-input v-model="packFormData.pa_nu"></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="submint">提 交</el-button>
            <el-button type="danger" @click="packDialog = false">取 消</el-button>
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
      packDialog: false,
      title: '新增',
      packFormData: {
        ch_pa: null,
        en_pa: null,
        pa_nu: null
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      packRules: {
        ch_pa: [
          { required: true, message: '请输入包装名称', trigger: 'blur' },
          { min: 1, max: 99, message: '请输入 1-99 个字符', trigger: 'blur' }
        ],
        en_pa: [
          { required: true, message: '请输入包装英文名称', trigger: 'blur' },
          { min: 1, max: 99, message: '请输入 1-99 个字符', trigger: 'blur' }
        ],
        pa_nu: [
          { required: true, message: '请输入包装编号', trigger: 'blur' },
          { min: 1, max: 99, message: '请输入 1-99 个字符', trigger: 'blur' }
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
        dateTile: []
      }
    }
  },
  methods: {
    // 列表查询
    search () {
      this.currentPage = 1
      this.getProductPackPage()
    },
    // 获取产品包装列表
    async getProductPackPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.searchForm.keyword,
        StartTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        EndTime: this.searchForm.dateTile && this.searchForm.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/GetProductPackPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getProductPackPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProductPackPage()
    },
    // 打开新增
    openAdd () {
      this.title = '新增'
      this.packFormData = {
        ch_pa: null,
        en_pa: null,
        pa_nu: null
      }
      this.packDialog = true
    },
    // 打开编辑
    handleEdit (row) {
      this.title = '编辑'
      // 克隆
      for (const key in row) {
        this.packFormData[key] = row[key]
      }
      this.packDialog = true
    },
    // 新增/编辑
    async submint () {
      let url = '/api/CreateProductPack'
      if (this.title === '编辑') url = '/api/UpdateProductPack'
      const res = await this.$http.post(url, this.packFormData)
      if (res.data.result.code === 200) {
        this.$message.success(this.title + '成功')
        this.getProductPackPage()
      } else {
        this.$message.error(res.data.result.msg)
      }
      this.packDialog = false
    },
    // 删除
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteProductPack', { id: row.id })
      if (res.data.result.code === 200) {
        this.getProductPackPage()
        this.$message.success('删除成功')
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  mounted () {
    this.getProductPackPage()
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
