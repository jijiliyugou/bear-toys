<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <div>
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
              v-model="formInline.isEntry"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, index) in [
                  { value: '', label: '全部' },
                  { value: true, label: '已上架' },
                  { value: false, label: '未上架' },
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="时间段搜索">
          <el-date-picker
          size="mini"
          :clearable='false'
          :unlink-panels='true'
            v-model="formInline.dateTile"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        </div>
        <el-form-item class="btnList">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button type="primary" size="mini" @click="subAddProduct(true)">上架</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="productList" ref="multipleTable" style="width: 100%" row-key="id">
        <el-table-column type="selection" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column prop="hallName" label="展厅名称"></el-table-column>
        <el-table-column prop="pr_na" label="产品名称"></el-table-column>
        <el-table-column prop="co_nu" label="产品编号"></el-table-column>
        <el-table-column prop="fa_no" label="出厂货号"></el-table-column>
        <el-table-column prop="isEntry" label="上架状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isEntry">已上架</el-tag>
            <el-tag type="danger" v-else>未上架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="off_da" label="下架时间" sortable>
          <template slot-scope="scope">{{
            scope.row.off_da && scope.row.off_da.split("T")[0]
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="产品备注"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="primary"
              @click="handleEdit(scope.row)"
              >明细</el-button
            >
            <el-popconfirm
              title="确定要删除这条菜单吗？"
              @onConfirm="handleDelete(scope.row)"
            >
              <el-button size="mini" slot="reference" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- 上架产品dialog -->
    <el-dialog
      :title="productDialogOptions.productDialogTitle"
      :visible.sync="productDialogOptions.openProductDialog"
      destroy-on-close
      class="productDialog"
    >
      <el-form
        :inline="true"
        class="addProductDialog"
        :model="addProductForm"
        ref="addProductRulesForm"
        label-width="100px"
      >
          <el-form-item class="productName" label="产品名称：" prop="pr_na">
          <el-input v-model="addProductForm.pr_na" disabled></el-input>
        </el-form-item>
        <div class="formItems">
          <el-form-item label="出厂货号：" prop="fa_no">
          <el-input v-model="addProductForm.fa_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司编号：" prop="number">
          <el-input v-model="addProductForm.number" disabled></el-input>
        </el-form-item>
        </div>
       <div class="formItems">
        <el-form-item  label="产品分类：" prop="cl_nu">
          <el-input v-model="addProductForm.cl_na" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价：">
          <el-input v-model="addProductForm.fa_pr" disabled></el-input>
        </el-form-item>
       </div>
        <div class="formItems">
          <div class="formItemSan">
            <el-form-item label="装箱量：">
              <el-input v-model="addProductForm.in_en" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_lo" disabled></el-input
            ></el-form-item>
          </div>
           <div class="formItems">
             <el-form-item label="包装：">
            <el-input v-model="addProductForm.ch_pa" disabled></el-input>
          </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="外箱规格：">
              <el-input v-model="addProductForm.ou_le" disabled></el-input
              ><span class="itemX">X</span></el-form-item
            >
            <el-form-item
              ><el-input v-model="addProductForm.ou_wi" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_hi" disabled></el-input
            ></el-form-item>
          </div>
          <div>
            <el-form-item label="体积/材积：">
              <el-input v-model="addProductForm.bulk_stere" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.bulk_feet" disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="样品规格：">
              <el-input v-model="addProductForm.pr_le" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_wi" disabled></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_hi" disabled></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="毛重/净重：">
              <el-input v-model="addProductForm.ne_we" disabled></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.gr_we" disabled></el-input
            ></el-form-item>
          </div>
        </div>
         <el-form-item class="productName" label="产品说明：">
           <el-input
           disabled
            type="textarea"
            v-model="addProductForm.remark"
          ></el-input>
         </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" :disabled="addProductForm.isEntry" @click="subAddProduct(false)">上 架</el-button>
        <el-button @click="productDialogOptions.openProductDialog = false"
          >取 消</el-button
        >
      </center>
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
      hallList: [],
      cateId: null,
      dialogUpload: false,
      LogoUrl: '',
      categoryList: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      productList: [],
      formInline: {
        hallNumber: null,
        isEntry: '',
        keyword: '',
        dateTile: null
      },
      productDialogOptions: {
        productDialogTitle: '产品明细',
        openProductDialog: false
      },
      addProductForm: {
        pr_na: null,
        fa_no: null,
        number: null,
        cl_na: null,
        fa_pr: null,
        in_en: null,
        ou_lo: null,
        ch_pa: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        bulk_stere: null,
        bulk_feet: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        ne_we: null,
        gr_we: null,
        remark: null
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
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 禁选
    checkSelectable (row) {
      return row.maKeyGuid && !row.isEntry
    },
    // 搜索级联选择
    handleChange (val) {
      this.$refs.cateRef.panel.activePath = []
      this.$refs.cateRef.panel.syncActivePath()
      this.$refs.cateRef.dropDownVisible = false
    },
    // 级联选择
    changeCate (id) {
      id && (this.addProductForm.categoryName = this.$refs.addCateRef.getCheckedNodes()[0].label)
      this.$refs.addCateRef.panel.activePath = []
      this.$refs.addCateRef.panel.syncActivePath()
      this.$refs.addCateRef.dropDownVisible = false
    },
    // 上传产品图片
    async successUpload () {
      const fd = new FormData()
      fd.append('BusinessType', 'Logo')
      fd.append('file', this.file)
      if (!this.file) {
        return {
          data: {
            result: {
              code: 400,
              message: '请选择图片'
            }
          }
        }
      }
      return await this.$http.post('/api/File/InsertPic', fd)
    },
    // 递归分类
    traverseCateList (list) {
      if (list instanceof Array) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].children && list[i].children.length === 0) {
            delete list[i].children
          } else {
            this.traverseCateList(list[i].children)
          }
        }
      }
    },
    // 修改当前页
    currentChange (page) {
      this.currentPage = page
      this.getProductList()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProductList()
    },
    search () {
      this.currentPage = 1
      this.getProductList()
    },
    // 新增产品预览头像
    handlePicProductPreview (file, fileList) {
      this.LogoUrl = file.url
    },
    // 获取产品列表
    async getProductList () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.formInline.keyword,
        hallNumber: this.formInline.hallNumber,
        isEntry: this.formInline.isEntry,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/ProductBasic_OffPage', fd)
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items || []
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.item.msg)
      }
    },
    // 删除产品
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteProductBasic_Off', { id: row.id })
      if (res.data.result.code === 200) {
        this.$message.success('删除产品成功')
        this.getProductList()
      } else {
        this.$message.success(res.data.result.msg)
      }
    },
    // 打开编辑产品
    handleEdit (row) {
      this.addProductForm = row
      this.productDialogOptions.openProductDialog = true
    },
    // 确认上架
    async subAddProduct (flag) {
      let productIds = [this.addProductForm.id]
      if (flag) productIds = this.$refs.multipleTable.selection.map(val => val.id)
      if (productIds.length === 0) {
        this.$message.error('请选择产品')
        return false
      }
      const res = await this.$http.post('/api/UpdateProductBasic_Off', { productIds: productIds })
      if (res.data.result.code === 200) {
        this.$message.success('上架成功')
        this.getProductList()
        this.productDialogOptions.openProductDialog = false
      } else this.$message.error(res.data.result.msg)
    },
    // 获取一年的时间
    /* 获取过去时间，并传值给现在时间 */
    getPassYearFormatDate () {
      var nowDate = new Date()
      var date = new Date(nowDate)
      date.setDate(date.getDate() - 365)
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var formatDate = year + seperator1 + month + seperator1 + strDate + 'T00:00:00'
      this.getNowFormatDate(formatDate)
    },
    /* 获取现在时间，并接受过去时间的值 */
    getNowFormatDate (formatDate) {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var nowData = year + seperator1 + month + seperator1 + strDate + 'T23:59:59'
      this.formInline.dateTile = [formatDate, nowData] // 默认赋值一年时间
    }
  },
  created () {
    this.getPassYearFormatDate()
    this.getOrgCompanyList()
  },
  mounted () {
    this.getProductList()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .demo-form-inline{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-form-item{
    @{deep} .el-form-item__content{
      width: 130px;
    }
    &:last-of-type{
      @{deep} .el-form-item__content{
        width: 70px;
      }
    }
    &.btnList {
      float: right;
      width: 130px;
      @{deep} .el-form-item__content{
        display: flex;
      }
    }
  }
  @{deep} .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
    width: 250px;
  }
}
.addProductDialog {
  .el-image{
    width: 100px;
    height: 100px;
  }
  .formItems {
    display: flex;
    justify-content: space-between;
  }
  .productName {
    display: flex;
    @{deep} .el-form-item__content {
      flex: 1;
    }
  }
  .formItemSan {
    .el-input {
      width: 60px;
    }
    .laiyuan {
      width: 100%;
    }
    .itemX {
      margin-left: 10px;
    }
  }
}
.tableContent {
  margin-bottom: 20px;
  @{deep} .img {
    width: 50px;
    height: 50px;
  }
  img{
    width: 50px;
    height: 50px;
  }
}
.textareaLength {
  font-size: 12px;
  height: 30px;
  span {
    color: #ff6600;
  }
}

.productCu_de{
  @{deep} .el-input__inner {
    width: 70px;
  }
   @{deep} .el-select {
    width: 120px;
    .el-input__inner{
      width: 120px;
        text-align: center;
      }
    }
}
.productDialog {
    @{deep} .el-dialog {
      width: 40%;
    }
  }
@media screen and (max-width: 1700px) {
  .productDialog {
    @{deep} .el-dialog {
      width: 50%;
    }
  }
}
@media screen and (max-width: 1400px) {
  .productDialog {
    @{deep} .el-dialog {
      width: 60%;
    }
  }
}
</style>
