<template>
  <el-container class="productSearchIndex">
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="关键字查询">
          <el-input
            v-model="formInline.keyword"
            clearable
            placeholder="输入关键字"
            style="width: 90%;"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司类型" prop="companyType">
          <el-select
            v-model="companyType"
            placeholder="请选择"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in [
                { label: '展厅', value: 'Exhibition' },
                { label: '公司', value: 'Sales' },
                { label: '供应商', value: 'Supplier' }
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
    <div class="tableContent" v-if="tableData && tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="collecTable">
        <el-table-column prop="companyLogo" label="公司图片">
          <template slot-scope="scope">
            <el-image
              fit="contain"
              class="myImage"
              :src="scope.row.companyLogo"
              :preview-src-list="[scope.row.companyLogo]"
            >
              <div slot="placeholder" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
        <el-table-column
          prop="companyNumber"
          label="公司编号"
        ></el-table-column>
        <el-table-column prop="createdOn" label="时间">
          <template slot-scope="scope">
            {{ scope.row.createdOn && scope.row.createdOn.replace(/T/gi, " ") }}
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
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
      </center>
    </div>
    <div class="zanwuxinxi" v-else></div>
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
      companyType: 'Exhibition',
      exportTable: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      formInline: {
        keyword: '',
        dateTile: null
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
      tableData: []
    }
  },
  methods: {
    async getContactsCompanyListByID () {
      const fd = {
        keyword: this.formInline.keyword,
        skipCount: this.currentPage,
        OppositeRole: this.companyType,
        maxResultCount: this.pageSize,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/ContactsCompanyListByID', fd)
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        this.tableData = res.data.result.item.items
      }
    },
    search () {
      this.currentPage = 1
      this.getContactsCompanyListByID()
    },
    addData () {},
    // 禁选
    disableSelect (row, i) {
      return row.isOpen
    },
    // 导出
    batchExport () {
      console.log(this.exportTable)
    },
    // 分页
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getContactsCompanyListByID()
    },
    // 分页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return
      this.getContactsCompanyListByID()
    }
  },
  mounted () {
    this.getContactsCompanyListByID()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  box-sizing: border-box;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
  box-sizing: border-box;
  @{deep} .myImage {
    width: 80px;
    height: 80px;
    img{
      width: 80px;
      height: 80px;
    }
  }
}
</style>
