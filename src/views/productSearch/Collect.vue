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
          clearable
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%;"
            @keyup.enter.native="search"
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
          <!-- <el-button type="primary" @click="batchExport">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <template v-if="!tableData || tableData.length === 0">
      <div class="zanwuchanpin"></div>
    </template>
    <div class="tableContent" v-else>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          label="选择"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="img" label="产品图片">
          <template slot-scope="scope">
            <el-image fit="contain" class="myImg" :src="scope.row.img" :preview-src-list="[scope.row.img && scope.row.img.replace(/_MiddlePic/gi, '_Photo')]">
                    <div
                      slot="placeholder"
                      class="errorImg"
                    >
                      <img
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                    <div
                      slot="error"
                      class="errorImg"
                    >
                      <img
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                  </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="co_nu" label="收藏货号"></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column label="来源">
           <template slot-scope="scope">
           {{ $store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyType ==
                    "Exhibition"
                    ? scope.row.supplierName
                    : scope.row.exhibitionName}}
          </template>
        </el-table-column>
        <el-table-column prop="isOpen" label="开放状态" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isOpen">开放</el-tag>
            <el-tag type="warning" v-else>待开放</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collecTime" sortable label="收藏时间" width="180">
          <template slot-scope="scope">
            {{
              scope.row.collecTime
                ? scope.row.collecTime.replace(/t/gi, " ")
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="参考单价" width="100">
          <template slot-scope="scope">
            <span style="color:#f56c6c">
              {{ scope.row.price ? scope.row.cu_de + scope.row.price.toFixed(2) : '???' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="!scope.row.isOpen"
              @click="handleEdit(scope.row)"
              >申请开放</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >取消收藏</el-button
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
          @current-change="handleCurrentChange"
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
      exportTable: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      formInline: {
        keyword: '',
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
    async getCollectList () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.formInline.keyword,
        startTime: this.formInline.dateTile && this.formInline.dateTile[0],
        endTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/ProductCollectionPage', fd)
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        this.tableData = res.data.result.item.items
      }
    },
    search () {
      this.currentPage = 1
      this.getCollectList()
    },
    // 导出
    batchExport () {
      console.log(this.exportTable)
    },
    handleSelectionChange (val) {
      this.exportTable = val
    },
    // 申请开放
    async handleEdit (row) {
      console.log(row)
      const res = await this.$http.post('/api/UpdateProductCollectionOpen', {
        ProductNumber: row.productNumber
      })
      console.log(res)
      if (res.data.result.code === 200) {
        this.$message.success('申请开放成功')
        this.getCollectList()
      }
    },
    // 删除收藏
    async handleDelete (row) {
      const res = await this.$http.post('/api/CreateProductCollection', {
        productNumber: row.productNumber
      })
      if (res.data.result.code === 200) {
        this.$message.success('取消收藏成功')
        this.getCollectList()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改当前页
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getCollectList()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getCollectList()
    }
  },
  mounted () {
    this.getCollectList()
  }
}
</script>

<style lang="less" scoped>
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
  .myImg{
    width:80px;
    height:80px;
    cursor: pointer;
    .errorImg{
      width:80px;
      height:80px;
      img {
        width:100%;
        height:100%;
      }
    }
  }
}
</style>
