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
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="companyType" label="公司类型">
          <template slot-scope="scope">
            <template v-for="(item, i) in companyTypeList">
              <el-tag :key="i" :type="tags[i]" v-if="scope.row.companyType === item.itemCode">{{item.itemText}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="contactsMan" label="联系人"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系方式"></el-table-column>
        <el-table-column prop="address" label="公司地址"></el-table-column>
        <el-table-column prop="qq" label="QQ"></el-table-column>
        <el-table-column prop="auditState" label="审核状态">
          <template slot-scope="scope">
            <template v-for="(item, i) in userAuditTypeList">
              <el-tag :type="tagss[item.itemCode]" :key="i" v-if="scope.row.auditState == item.itemCode">{{item.itemText}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="拒绝原因">
          <template slot-scope="scope">
            <template v-for="(item, i) in offAuditTypeList">
              <span :key="i" v-if="scope.row.remark == item.itemCode">{{item.itemText}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdOn"
          label="创建日期"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.createdOn && scope.row.createdOn.split("T")[0] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              style="margin-right:10px;"
              size="mini"
              type="primary"
              @click="openEdit(scope.row)"
              >审核</el-button
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
    <!-- 审核 -->
    <el-dialog :title="versionTitle" :visible.sync="versionDialog" v-if="versionDialog" width="50%">
      <el-form
        ref="addVersionForm"
        label-width="100px"
        :model="itemData"
      >
        <el-form-item label="公司名称：" prop="companyName">
          <el-input v-model="itemData.companyName" disabled></el-input>
        </el-form-item>
        <div class="items">
          <el-form-item label="公司类型：" prop="companyType">
          <el-select v-model="itemData.companyType" disabled placeholder="请选择">
            <el-option
              v-for="item in companyTypeList"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人：" prop="contactsMan">
          <el-input v-model="itemData.contactsMan" disabled></el-input>
        </el-form-item>
        </div>
        <el-form-item label="联系方式：" prop="phoneNumber">
          <el-input v-model="itemData.phoneNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司地址：" prop="address">
          <el-input v-model="itemData.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="Q Q：" prop="qq">
          <el-input v-model="itemData.qq" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建日期：" prop="createdOn">
          <el-input v-model="itemData.createdOn.split('T')[0]" disabled></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="handleEdit(1)">通 过</el-button>
            <!-- <el-button type="danger" @click="handleEdit(2)">拒 绝</el-button> -->
            <el-popover
            style="marginLeft:20px;"
              placement="right"
              width="150"
              trigger="click">
                <el-select
                clearable
                @change="handleEdit(2)"
                v-model="itemData.remark"
                placeholder="请选择拒绝原因"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in offAuditTypeList"
                  :key="index"
                  :label="item.itemText"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
              <el-button slot="reference" type="danger">拒 绝</el-button>
            </el-popover>
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
      offAuditTypeList: [],
      userAuditTypeList: [],
      companyTypeList: [],
      tags: ['', 'success', 'warning', 'danger', 'info'],
      tagss: ['', 'success', 'danger'],
      isUpLoad: false,
      versionDialog: false,
      versionTitle: '审核',
      itemData: {
        companyName: null,
        companyType: null,
        address: null,
        contactsMan: null,
        phoneNumber: null,
        remark: null,
        qq: null
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      // addVersionRules: {
      //   platForm: [
      //     { required: true, message: '请选择手机平台', trigger: 'change' }
      //   ],
      //   vesion: [
      //     { required: true, message: '请输入版本号', trigger: 'blur' },
      //     { min: 1, max: 9999, message: '请输入版本号', trigger: 'blur' }
      //   ],
      //   fileUrl: [
      //     { required: true, message: '请输入链接地址', trigger: 'blur' },
      //     { min: 1, max: 9999, message: '请输入链接地址', trigger: 'blur' }
      //   ]
      // },
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
      this.getCompanyAuditPage()
    },
    // 获取所有公司
    async getCompanyAuditPage () {
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
      const res = await this.$http.post('/api/GetCompanyAuditPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getCompanyAuditPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getCompanyAuditPage()
    },
    // 打开审核窗口
    openEdit (row) {
      this.itemData = row
      this.versionDialog = true
    },
    // 提交审核
    async handleEdit (state) {
      const fd = this.$_.cloneDeepWith(this.itemData)
      fd.auditState = state
      if (state === 1) fd.remark = null
      const res = await this.$http.post('/api/AuditCompany', fd)
      if (res.data.result.code === 200) {
        this.getCompanyAuditPage()
        this.versionDialog = false
        this.$message.success('审核成功')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取公司类型列表
    async getCompanyTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        switch (type) {
          case 'CompanyType':
            this.companyTypeList = res.data.result.item
            break
          case 'userAuditType':
            this.userAuditTypeList = res.data.result.item
            break
          case 'offAuditType':
            this.offAuditTypeList = res.data.result.item
            break
        }
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  watch: {
  },
  mounted () {
    this.getCompanyAuditPage()
  },
  created () {
    this.getCompanyTypeList('CompanyType')
    this.getCompanyTypeList('userAuditType')
    this.getCompanyTypeList('offAuditType')
  }
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
.items{
  display: flex;
  justify-content: space-between;
}
</style>
