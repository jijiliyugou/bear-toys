<template>
  <el-container class="productSearchIndex">
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <!-- 搜索头部 -->
    <div class="searchBox">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="searchForm.keyword"
            clearable
            placeholder="输入关键字"
            style="width: 90%;"
            @keyup.enter.native="search"
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
          <el-button type="primary" @click="openAddNewProd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template v-if="!dataList || dataList.length === 0">
      <div class="zanwuchanpin"></div>
    </template>
    <!-- 列表 -->
    <div class="tableContent" v-else>
      <el-table
        :data="dataList"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="number" label="产品编号"></el-table-column>
        <el-table-column prop="exhibitionName" label="公司"></el-table-column>
        <el-table-column prop="isOpen" label="开放状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOpen">开放</el-tag>
            <el-tag v-else>待开放</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collecTime" label="时间">
          <template slot-scope="scope">
            {{
              scope.row.collecTime && scope.row.collecTime.replace(/t/i, " ")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="底价">
          <template slot-scope="scope">
            <span style="color:red;">
              {{ scope.row.cu_de + scope.row.amount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleShenhe(scope.row)"
              >审核</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
         <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 30, 60]"
              background
              :total="totalCount"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="currentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
      </center>
    </div>
   </div>
    <!-- 新增新品推荐 -->
    <!-- 授权dialog -->
    <el-dialog
      :title="editNewProdTitle"
      destroy-on-close
      :visible.sync="showEditNewProd"
      width="30%"
    >
      <el-form label-width="100px" :model="editNewProd">
        <el-form-item label="新品名称" prop="arrivalsName">
          <el-input v-model.number="editNewProd.arrivalsName"></el-input>
        </el-form-item>
        <el-form-item label="新品货号" prop="productData">
          <el-input
            v-model.number="editNewProd.productData"
            placeholder="请输入P0396434,P0396435类型的货号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleEditProd">提 交</el-button>
          <el-button type="danger" @click="showEditNewProd = false"
            >取 消</el-button
          >
        </el-form-item>
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
      editNewProd: {
        arrivalsName: null,
        companyID: this.$store.state.userInfo.commparnyList[0].commparnyId,
        userID: this.$store.state.userInfo.userInfo.id,
        productData: null,
        auditStatus: '0',
        isDelete: false
      },
      editNewProdTitle: '新增新品推荐',
      showEditNewProd: false,
      searchForm: {
        dateTile: null,
        keyword: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 100,
      dataList: [],
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
    // 删除
    handleDelete (index, row) {
      console.log(index, row)
    },
    // 审核
    handleShenhe (row) {
      console.log(row)
    },
    // 获取新品推荐
    async getNewArrivalsPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        AuditStatus: 0,
        keyword: this.searchForm.keyword,
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/GetNewArrivalsPage', fd)
      if (res.data.result.code === 200) {
        this.dataList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 打开新增
    openAddNewProd () {
      this.editNewProdTitle = '新增新品推荐'
      this.editNewProd = {
        arrivalsName: null,
        companyID: this.$store.state.userInfo.commparnyList[0].commparnyId,
        userID: this.$store.state.userInfo.userInfo.id,
        productData: null,
        auditStatus: '0',
        isDelete: false
      }
      this.showEditNewProd = true
    },
    // 新增/编辑
    async handleEditProd () {
      console.log(this.editNewProd)
      const res = await this.$http.post(
        '/api/CreateNewArrivals',
        this.editNewProd
      )
      if (res.data.result.code === 200) {
        this.$message.success('新增新品成功')
        this.getNewArrivalsPage()
        this.showEditNewProd = false
      }
    },
    // 查询
    search () {
      this.currentPage = 1
      this.getNewArrivalsPage()
    },
    handleEdit (row) {
      this.editNewProdTitle = '编辑新品推荐'
      // console.log(row.exhibitionName,row.productNumber);
      this.editNewProd.arrivalsName = row.exhibitionName
      this.editNewProd.productData = row.productNumber
      this.showEditNewProd = true
    },
    // 修改当前页
    currentChange (page) {
      this.currentPage = page
      this.getNewArrivalsPage()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getNewArrivalsPage()
    }
  },
  mounted () {
    this.getNewArrivalsPage()
  }
}
</script>

<style lang="less" scoped>
.searchBox {
  margin-top: 50px;
  box-sizing: border-box;
  .btnList {
    float: right;
  }
  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    overflow: hidden;
    clear: both;
  }
}
.tableContent {
  margin-top: 20px;
  box-sizing: border-box;
}
</style>
