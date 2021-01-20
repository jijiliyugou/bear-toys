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
         clearable
              @keyup.enter.native="search"
              v-model="searchForm.keyword"
              placeholder="输入关键字"
              style="width: 90%"
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
          <el-button type="primary" @click="openAddVersion">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        size="medium"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="platForm" label="手机平台"></el-table-column>
        <el-table-column prop="vesion" label="版本号"></el-table-column>
        <el-table-column
          prop="fileUrl"
          label="版本地址"
          align="center"
          width="400"
        ></el-table-column>
        <el-table-column
          prop="createdOn"
          label="新增日期"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.createdOn && scope.row.createdOn.replace(/T/g, " ") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              style="margin-right:10px;"
              size="mini"
              type="primary"
              @click="openEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定要删除这个版本吗？"
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
    <!-- 新增编辑版本 -->
    <el-dialog :title="versionTitle" :visible.sync="versionDialog" v-if="versionDialog" width="50%">
      <el-form
        ref="addVersionForm"
        label-width="100px"
        :rules="addVersionRules"
        :model="versionFormData"
      >
        <el-form-item label="平台" prop="platForm">
          <el-select v-model="versionFormData.platForm" placeholder="请选择">
            <el-option
              v-for="item in $store.state.globalJson.Json.PlatForm"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="vesion">
          <el-input v-model="versionFormData.vesion"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="fileUrl">
          <el-input
            v-model="versionFormData.fileUrl"
            :disabled="versionFormData.versionFile  !=  ''"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <input
            type="file"
            ref="installFile"
            @change="changeUpload"
            :accept="
              $store.state.globalJson.Json.packageManage &&
                $store.state.globalJson.Json.packageManage[0].itemCode
            "
            :size="
              $store.state.globalJson.Json.packageManage &&
                $store.state.globalJson.Json.packageManage[1].itemCode
            "
          />
        </el-form-item>
        <center>
          <template>
            <el-button
              type="primary"
              @click="handleEdit()"
              :disabled="isUpLoad"
            >
              <i :class="{ 'el-icon-loading': isUpLoad }"></i>
              {{ isUpLoad ? "文件上传中" : "提 交" }}
            </el-button>
            <el-button type="danger" @click="versionDialog = false"
              >取 消</el-button
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
      isUpLoad: false,
      versionDialog: false,
      versionTitle: '新增版本',
      versionFormData: {
        platForm: null,
        vesion: null,
        fileUrl: '',
        versionFile: ''
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      addVersionRules: {
        platForm: [
          { required: true, message: '请选择手机平台', trigger: 'change' }
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
        keyword: null,
        dateTile: []
      }
    }
  },
  methods: {
    // 列表查询
    search () {
      this.currentPage = 1
      this.getAppVersionPage()
    },
    // 获取所有app版本
    async getAppVersionPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1],
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        keyword: this.searchForm.keyword
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/BearVesionPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getAppVersionPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getAppVersionPage()
    },
    // 打开编辑窗口
    openEdit (row) {
      console.log(row, this.versionFormData)
      this.versionTitle = '版本编辑'
      for (const key in this.versionFormData) {
        this.versionFormData[key] = row[key]
      }
      this.versionFormData.id = row.id
      this.versionDialog = true
    },
    // 打开新增版本
    openAddVersion () {
      this.versionTitle = '版本新增'
      this.versionFormData = {
        vesion: null,
        fileUrl: '',
        platForm: '',
        versionFile: ''
      }
      this.versionDialog = true
    },
    // 编辑/新增
    async handleEdit () {
      this.$refs.addVersionForm.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            this.versionTitle === '版本新增'
              ? '/api/CreateBearVesion'
              : '/api/UpdateBearVesion',
            this.versionFormData
          )
          if (res.data.result.code === 200) {
            this.$message.success(
              this.versionTitle === '版本新增' ? '新增成功' : '编辑成功'
            )
            this.getAppVersionPage()
            this.versionDialog = false
          } else {
            this.$message.error('编辑失败,请检查网络！')
          }
        }
      })
    },
    // 删除
    async handleDelete (row) {
      const res = await this.$http.post('/api/UpdateBearVesion', {
        isdelete: true,
        id: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getAppVersionPage()
      } else {
        this.$message.error('删除失败,请检查网络！')
      }
    },
    // 选择文件
    async changeUpload (e) {
      this.isUpLoad = true
      this.versionFormData.versionFile = e.target.files[0]
      const fd = new FormData()
      fd.append('BusinessType', 'package')
      fd.append('file', this.versionFormData.versionFile)
      const res = await this.$http.post('/api/File/InsertPic', fd)
      if (res.data.result.code === 200) {
        this.versionFormData.fileUrl = res.data.result.object[0].filePath
        this.$message.success('上传文件成功')
      } else {
        this.$message.success('上传文件失败，请检查网络')
      }
      this.isUpLoad = false
      console.log(this.versionFormData.versionFile)
    }
  },
  watch: {
    versionDialog (val) {
      if (!val) {
        this.$refs.installFile.value = ''
      }
    }
  },
  mounted () {
    this.getAppVersionPage()
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
