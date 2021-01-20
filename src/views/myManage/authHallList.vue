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
        <div style="display:flex;align-items: center;justify-content: space-between;">
          <div style="display:flex;align-items: center;justify-content: space-between;">
          <el-form-item label="关键字查询">
          <el-input
              @keyup.enter.native="search"
              size="mini"
              clearable
              v-model="searchForm.keyword"
              placeholder="输入关键字"
              style="width: 90%"
            ></el-input>
        </el-form-item>
        <el-form-item label="状态查询">
          <el-select
              clearable
              size="mini"
              v-model="searchForm.applicationStatus"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, index) in [
                  { value: '', label: '全部' },
                  { value: true, label: '已审核' },
                  { value: false, label: '未审核' },
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        </div>
        <div class="btnList">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </div>
        </div>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="headerStyle"
        @row-click="rowClick"
      >
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="companyNumber" label="公司编号"></el-table-column>
        <el-table-column prop="sampleNumber" label="择样编号"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系方式"></el-table-column>
        <el-table-column prop="applicationStatus" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.applicationStatus" type="success">已审核</el-tag>
            <el-tag v-else>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicantsDateTime" label="申请时间" sortable>
        <template slot-scope="scope">
           {{ scope.row.applicantsDateTime.split('T')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
           <el-button size="mini" type="primary">明细</el-button>
           <el-popconfirm
              style="margin-left:10px;"
              title="确定要删除这条择样单吗？"
              @onConfirm="handleSampleDelete(scope.row)">
              <el-button size="mini" slot="reference" @click.stop type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
         <el-pagination
         ref="pageRef"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          :total="totalCount"
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
    <!-- 子订单列表dialog -->
    <el-dialog title="择样订单列表" :visible.sync="sampleListDialog" top="60px" destroy-on-close width="70%">
      <div class="childSearchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <div class="childSearchItem">
            <el-form-item label="关键字查询">
          <el-input
            clearable
            size="mini"
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择展厅">
          <el-select size="mini" style="width: 90%" v-model="formInline.hallNumber" clearable placeholder="请选择展厅">
            <el-option
              v-for="(item, index) in [{companyName: '全部', companyNumber: ''},...hallList]"
              :key="index"
              :label="item.companyName"
              :value="item.companyNumber">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态查询">
          <el-select
              clearable
              size="mini"
              v-model="formInline.openState"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, index) in [
                  { value: '', label: '全部' },
                  { value: true, label: '已审核' },
                  { value: false, label: '未审核' },
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
          </div>
        <el-form-item class="btnList">
          <el-button type="primary" style="margin-left:10px;" size="mini" @click="childSearch">查询</el-button>
          <el-button type="primary" size="mini" @click="subAuthSample(true)">批量审核</el-button>
        </el-form-item>
      </el-form>
    </div>
        <el-table
        :data="sampleList"
        row-key="id"
        border
        ref="sampleListTable"
        style="width: 100%"
        :header-cell-style="headerStyle"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="imgUrl" label="图片" align="center">
          <template slot-scope="scope">
            <el-image class="tableImg" :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]">
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="hallName" label="展厅名称" align="center"></el-table-column>
        <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="productNumber" label="产品编号" align="center"></el-table-column>
        <el-table-column prop="sampleNumber" label="择样编号" align="center"></el-table-column>
        <el-table-column prop="fa_no" label="出厂货号" align="center"></el-table-column>
        <el-table-column prop="createdOn" label="时间" sortable  align="center">
        <template slot-scope="scope">
           {{ scope.row.createdOn.split('T')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.openState" type="success">已审核</el-tag>
            <el-tag v-else>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
           <el-button type="primary" size="mini" @click="openAuthSample(scope.row)">审核</el-button>
           <el-popconfirm
           style="margin-left:10px;"
              title="确定要删除这条择样单吗？"
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
         ref="pageRef"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="samplePageSize"
          :current-page.sync="sampleCurrentPage"
          :total="sampleTotal"
          @current-change="sampleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </el-dialog>
     <!-- 审核择样dialog -->
    <el-dialog
      title="审核"
      :visible.sync="authSampleDialog"
      destroy-on-close
      v-if="authSampleDialog"
      width="50%"
    >
      <el-form
        :model="currentAuthRow"
        label-width="100px"
      >
        <el-form-item>
          <el-image class="formImg" :src="currentAuthRow.imgUrl" :preview-src-list="[currentAuthRow.imgUrl]">
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
          </el-image>
        </el-form-item>
        <el-form-item label="展厅名称：">
          <el-input v-model="currentAuthRow.hallName" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="currentAuthRow.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品编号：">
          <el-input v-model="currentAuthRow.productNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="择样编号：">
          <el-input v-model="currentAuthRow.sampleNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="出厂货号：">
          <el-input v-model="currentAuthRow.fa_no" disabled></el-input>
        </el-form-item>
      </el-form>
        <center>
          <el-button type="primary" @click="subAuthSample(false)">审核</el-button>
          <el-button @click="authSampleDialog = false">取消</el-button>
        </center>
    </el-dialog>
     </el-container>
</template>

<script>
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/oldFooter'
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      sampleTotal: 0,
      samplePageSize: 10,
      sampleCurrentPage: 1,
      formInline: {
        keyword: null,
        hallNumber: '',
        openState: null
      },
      currentAuthRow: {},
      authSampleDialog: false,
      currentRow: null,
      sampleListDialog: false,
      sampleList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      hallList: [],
      clientTypeList: [],
      searchForm: {
        keyword: '',
        applicationStatus: ''
      }
    }
  },
  methods: {
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 子列表搜索
    childSearch () {
      this.getCompanySamplelistByNumber()
    },
    // 审核
    async subAuthSample (flag) {
      let ids
      if (flag) {
        ids = this.$refs.sampleListTable.selection.map(val => val && val.id)
      } else {
        ids = [this.currentAuthRow.id]
      }
      console.log(ids)
      const res = await this.$http.post('/api/AuditCompanySamplelist', { idlist: ids })
      if (res.data.result.code === 200) {
        this.$message.success('审核成功')
        this.getCompanySamplelistByNumber()
        this.authSampleDialog = false
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 打开审核择样订单
    openAuthSample (row) {
      this.currentAuthRow = row
      this.authSampleDialog = true
    },
    // 删除详情
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteSamplelistdetail', { id: row.id })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getCompanySamplelistByNumber()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 表头类名
    headerStyle ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex) {
        return 'background-color:#1989fa;color:#fff;font-weight:400;'
      }
      var list = [
        { id: 0 }
      ]
    },
    // 列表查询
    search () {
      this.currentPage = 1
      this.getCompanySamplelistPage()
    },
    // 点击了某行
    rowClick (row) {
      this.companySamplePage = 1
      this.sampleTotal = 0
      this.sampleListDialog = true
      this.currentRow = row
      this.getCompanySamplelistByNumber()
    },
    // 获取子列表
    async getCompanySamplelistByNumber () {
      const fd = {
        sampleNumber: this.currentRow.sampleNumber,
        skipCount: this.sampleCurrentPage,
        maxResultCount: this.samplePageSize,
        keyword: this.formInline.keyword,
        hallNumber: this.formInline.hallNumber,
        openState: this.formInline.openState
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/CompanySamplelistByNumber', fd)
      if (res.data.result.code === 200) {
        this.sampleList = res.data.result.item.items
        this.sampleTotal = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 删除列表某行
    async handleSampleDelete (row) {
      const res = await this.$http.post('/api/DeleteCompanySamplelist', { id: row.id })
      if (res.data.result.code === 200) {
        this.getCompanySamplelistPage()
        this.$message.success('删除成功')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取列表
    async getCompanySamplelistPage () {
      const fd = {
        keyword: this.searchForm.keyword,
        applicationStatus: this.searchForm.applicationStatus,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/CompanySamplelistPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
        if (fd.hallNumber) this.$message.error(res.data.result.msg)
        else this.$message.error('请选择展厅')
      }
    },
    // 表格排序
    sortMethod (a, b) {
      return Number(a.handset) - Number(b.handset)
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getCompanySamplelistPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getCompanySamplelistPage()
    },
    // 切换子列表当前页
    sampleCurrentChange (page) {
      this.sampleCurrentPage = page
      this.getCompanySamplelistByNumber()
    },
    // 切换子列表当前页总条数
    handleSampleSizeChange (pageSize) {
      this.samplePageSize = pageSize
      if (this.sampleCurrentPage * pageSize > this.sampleTotal) return false
      this.getCompanySamplelistByNumber()
    }
  },
  watch: {
  },
  mounted () {
    // this.getOrgCompanyList()
    this.getOrgCompanyList()
    this.getCompanySamplelistPage()
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
  .el-form{
    .el-form-item{
      margin: 0;
    }
  }
}
.tableContent {
  padding: 20px 0;
}
.tableImg{
  width: 50px;
  height: 50px;
  img{
    width: 50px;
    height: 50px;
  }
}
.formImg{
  width: 100px;
  height: 100px;
  img{
    width: 100px;
    height: 100px;
  }
}
.childSearchBox{
  margin: 20px 0;
  .demo-form-inline{
    display: flex;
    justify-content: space-between;
    .childSearchItem{
      .el-form-item{
        @{deep} .el-form-item__content{
          width: 130px;
        }
      }
    }
  }
}
</style>
