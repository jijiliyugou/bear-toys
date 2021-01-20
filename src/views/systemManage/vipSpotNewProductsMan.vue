<template>
  <el-container>
    <div class="testBox"></div>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="max-width: 1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="类型查询：">
          <el-select
            clearable
            v-model="formInline.typeId"
            placeholder="请选择"
            style="width: 90%"
          >
            <el-option
              v-for="item in typeIds"
              :key="item.itemCode"
              :label="item.itemText"
              :value="item.itemCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btnList">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table
        :data="SMSInfoList"
        style="width: 100%">
        <el-table-column class="productImg" label="产品图片" prop="img" width="80">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.row.img" fit="cover" :preview-src-list="[scope.row.img && scope.row.img.replace(/_MiddlePic/gi, '_Photo')]">
              <div
                slot="placeholder"
                class="image-slot"
                style="width: 50px; height: 50px; margin: 0 auto"
              >
                <img class="errorImg" src="~@/assets/images/ab_logo.png" alt />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 50px; height: 50px; margin: 0 auto"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/ab_logo.png"
                  alt
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="产品名称"
        ></el-table-column>
        <el-table-column prop="productNumber" label="产品编号" align="center"></el-table-column>
        <el-table-column
          prop="ma_na"
          align="center"
          label="来源厂商"
        ></el-table-column>
        <el-table-column
          prop="ma_nu"
          label="出厂货号"
          align="center"
        ></el-table-column>
        <el-table-column
          sortable
          prop="price"
          label="价格"
          align="center"
        >
          <template slot-scope="scope"><span style="color:#f00">{{ scope.row.cu_de }} {{ scope.row.price }}</span></template>
        </el-table-column>
        <el-table-column prop="createdOn" label="新增时间" sortable align="center">
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
      typeIds: [
        {
          itemCode: 1,
          itemText: 'VIP'
        },
        {
          itemCode: 2,
          itemText: '新品'
        },
        {
          itemCode: 3,
          itemText: '现货'
        }
      ],
      formInline: {
        // 搜索表单
        keyword: null,
        typeId: 1
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
      this.getProductsByTypePage()
    },
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getProductsByTypePage()
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProductsByTypePage()
    },
    // 获取下载统计列表
    async getProductsByTypePage () {
      const fd = { skipCount: this.currentPage, maxResultCount: this.pageSize, typeId: this.formInline.typeId }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/GetProductsByTypePage', fd)
      if (res.data.result.code === 200) {
        this.SMSInfoList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.message)
      }
    }
  },
  created () {
    this.getProductsByTypePage()
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
  .el-image{
    width: 50px;
    height: 50px;
    img{
      width: 50px;
      height: 50px;
    }
  }
}
</style>
