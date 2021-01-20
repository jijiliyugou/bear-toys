<template>
  <el-container>
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
            size="mini"
            v-model="formInline.name"
            placeholder="输入关键字"
            style="width: 90%"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="类目查询">
          <el-cascader
          :show-all-levels="false"
          filterable
          size="mini"
          ref="cateRef"
          clearable
          style="width: 90%"
          v-model="formInline.categoryId"
          @change="handleChange"
          :options="[{ name: '全部', id: '' }, ...categoryList]" :props="{label: 'name',value: 'id',children: 'children',checkStrictly: true,emitPath: false}">
          </el-cascader>
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
        <el-form-item class="btnList">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button type="primary" size="mini" @click="openAdd">新增产品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="productList" style="width: 100%">
        <el-table-column class="productImg" label="产品图片" prop="img" width="80">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.row.img" fit="cover" :preview-src-list="[scope.row.img && scope.row.img.replace(/_MiddlePic/gi, '_Photo')]">
              <div
                slot="placeholder"
                class="image-slot"
                style="width: 50px; height: 50px; margin: 0 auto"
              >
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
              <div
                slot="error"
                class="image-slot"
                style="width: 50px; height: 50px; margin: 0 auto"
              >
                <img
                  class="errorImg"
                  src="~@/assets/images/imgError.jpg"
                  alt
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column prop="categoryName" label="产品类目"></el-table-column>
        <el-table-column
          prop="fa_no"
          label="出厂货号"
        ></el-table-column>
        <el-table-column prop="createdOn" label="发布时间" sortable>
          <template slot-scope="scope">{{
            scope.row.createdOn.replace(/t/gi, " ")
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="产品说明"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
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
    <!-- 新增产品dialog -->
    <el-dialog
      :title="productDialogOptions.productDialogTitle + '产品'"
      :visible.sync="productDialogOptions.openProductDialog"
      destroy-on-close
      class="productDialog"
    >
      <el-form
        :inline="true"
        class="addProductDialog"
        :model="addProductForm"
        :rules="addProductRules"
        ref="addProductRulesForm"
        label-width="100px"
      >
          <el-form-item label="产品图片：" prop="img" v-show="productDialogOptions.productDialogTitle === '编辑'">
            <el-image :src='addProductForm.img' :preview-src-list="[addProductForm.img && addProductForm.img.replace(/_MiddlePic/gi, '_Photo')]"></el-image>
        </el-form-item>
          <el-form-item class="productName" label="产品名称" prop="name">
          <el-input v-model="addProductForm.name"></el-input>
        </el-form-item>
        <!-- <el-form-item class="productName" label="产品图片" prop="img">
          <el-upload
              :action="baseAPI + '/api/File/InsertPic'"
              list-type="picture-card"
              ref="upload"
              :auto-upload="false"
              :on-preview="handlePicProductPreview"
              :http-request="successUpload"
              :limit="7"
              accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogUpload" destroy-on-close :modal="false">
              <img width="100%" :src="LogoUrl" alt />
            </el-dialog>
        </el-form-item> -->
        <div class="formItems">
          <el-form-item label="出厂货号：" prop="fa_no">
          <el-input v-model="addProductForm.fa_no"></el-input>
        </el-form-item>
          <el-form-item label="公司编号：" prop="number" v-show="productDialogOptions.productDialogTitle === '编辑'">
          <el-input v-model="addProductForm.number" disabled></el-input>
        </el-form-item>
        </div>
       <div class="formItems">
        <el-form-item  label="产品分类：" prop="categoryNumber">
          <el-cascader
          clearable
          filterable
          ref="addCateRef"
          :show-all-levels="false"
          v-model="addProductForm.categoryNumber"
          @change="changeCate"
          :options="categoryList" :props="{label: 'name',value: 'id',children: 'children',checkStrictly: true,emitPath: false}">
          </el-cascader>
        </el-form-item>
        <el-form-item label="单价：" class="productCu_de">
          <el-input v-model="addProductForm.price">
            <el-select v-model="addProductForm.cu_de" slot="append" placeholder="请选择">
            <el-option label="美元" value="$"></el-option>
            <el-option label="人民币" value="￥"></el-option>
            <el-option label="欧元" value="€"></el-option>
            <el-option label="英镑" value="￡"></el-option>
            <el-option label="新加坡元" value="S$"></el-option>
            <el-option label="日元" value="J￥"></el-option>
            <el-option label="阿根廷比索" value="ARS$"></el-option>
            <el-option label="越南盾" value="₫"></el-option>
            <el-option label="泰铢" value="৴"></el-option>
            <el-option label="其他" value="¤"></el-option>
          </el-select>
          </el-input>
          </el-form-item>
       </div>
        <div class="formItems">
          <div class="formItems">
             <el-form-item label="包装：">
            <el-input v-model="addProductForm.ch_pa"></el-input>
          </el-form-item>
          </div>
          <div class="formItemSan">
            <el-form-item label="装箱量：">
              <el-input v-model="addProductForm.in_en"></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_lo"></el-input
            ></el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="外箱规格：">
              <el-input v-model="addProductForm.ou_le"></el-input
              ><span class="itemX">X</span></el-form-item
            >
            <el-form-item
              ><el-input v-model="addProductForm.ou_wi"></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.ou_hi"></el-input
            ></el-form-item>
          </div>
          <div>
            <el-form-item label="体积/材积：">
              <el-input v-model="addProductForm.bulk_stere"></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.bulk_feet"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="formItems formItemSan">
          <div>
            <el-form-item label="样品规格：">
              <el-input v-model="addProductForm.pr_le"></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_wi"></el-input
              ><span class="itemX">X</span> </el-form-item
            ><el-form-item>
              <el-input v-model="addProductForm.pr_hi"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="毛重/净重：">
              <el-input v-model="addProductForm.ne_we"></el-input
              ><span class="itemX">/</span></el-form-item
            ><el-form-item
              ><el-input v-model="addProductForm.gr_we"></el-input
            ></el-form-item>
          </div>
        </div>
         <el-form-item class="productName" label="产品说明：">
           <el-input
            type="textarea"
            v-model="addProductForm.remark"
            :maxlength="
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            "
          ></el-input>
          <p class="textareaLength">
            最多可输入
            <span>{{
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            }}</span
            >字，当前输入
            <span>
              {{ addProductForm.remark ? addProductForm.remark.length : 0 }} </span>，还可输入
            <span>{{
              $store.state.globalJson.Json.UserRestrictions[0].itemCode -
              (addProductForm.remark && addProductForm.remark.length)
            }}</span>
          </p>
         </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" @click="subAddProduct">确认</el-button>
        <el-button @click="productDialogOptions.openProductDialog = false"
          >取消</el-button
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
      cateId: null,
      dialogUpload: false,
      LogoUrl: '',
      categoryList: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      productList: [],
      formInline: {
        categoryId: '',
        // 查询角色表单
        name: '',
        state: null,
        dateTile: null
      },
      productDialogOptions: {
        productDialogTitle: '新增',
        openProductDialog: false
      },
      addProductForm: {
        categoryName: '',
        categoryNumber: '',
        supplierId: this.$store.state.currentComparnyId,
        supplierNumber: this.$store.state.userInfo.commparnyList[0].companyNumber,
        name: '',
        number: null,
        price: null,
        img: '',
        productNumber: '',
        companyNumber: '',
        ch_pa: null,
        unit: null,
        cloud_platform_date: null,
        ma_nu: null,
        fa_no: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        in_en: null,
        ou_lo: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        cu_de: '￥',
        remark: '',
        ne_we: null,
        gr_we: null,
        bulk_feet: '',
        bulk_stere: null
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
      addProductRules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        categoryNumber: [
          { required: true, message: '请输选择类目', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
    // 获取产品分类列表
    async getProductCategoryList () {
      const res = await this.$http.post('/api/ProductCategoryList', {})
      if (res.data.result.code === 200) {
        this.traverseCateList(res.data.result.item)
        this.categoryList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
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
        name: this.formInline.name,
        categoryId: this.formInline.categoryId,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (!fd[key]) {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/BroductMessagePage', fd)
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items || []
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.item.msg)
      }
    },
    // 编辑产品
    async updateBearProduct () {
      const res = await this.$http.post(
        '/api/UpdateBearProduct',
        this.addProductForm
      )
      if (res.data.result.code === 200) {
        this.$message.success('编辑产品成功')
        this.productDialogOptions.openProductDialog = false
        this.getProductList()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 新增产品
    async createProduct () {
      const res = await this.$http.post('/api/CreateBearProduct', this.addProductForm)
      if (res.data.result.code === 200) {
        this.$message.success('新增产品成功')
        this.productDialogOptions.openProductDialog = false
        this.getProductList()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 删除产品
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteProductMessage', { productNumber: row.productNumber })
      if (res.data.result.code === 200) {
        this.$message.success('删除产品成功')
        this.getProductList()
      } else {
        this.$message.success(res.data.result.msg)
      }
    },
    // 打开编辑产品
    handleEdit (row) {
      // for (const key in this.addProductForm) {
      //   this.addProductForm[key] = row[key]
      // }
      // this.cateId = null
      // this.addProductForm.id = row.id
      this.addProductForm = row
      this.productDialogOptions.productDialogTitle = '编辑'
      this.productDialogOptions.openProductDialog = true
    },
    // 打开新增产品列表窗口
    openAdd () {
      this.addProductForm = {
        categoryName: '',
        categoryNumber: '',
        supplierId: this.$store.state.currentComparnyId,
        supplierNumber: this.$store.state.userInfo.commparnyList[0].companyNumber,
        name: '',
        img: '',
        price: null,
        number: null,
        productNumber: null,
        companyNumber: null,
        ch_pa: null,
        cloud_platform_date: null,
        unit: null,
        fa_no: null,
        ma_nu: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        in_en: null,
        ou_lo: null,
        ou_le: null,
        ou_wi: null,
        ne_we: null,
        gr_we: null,
        bulk_feet: '',
        ou_hi: null,
        remark: '',
        cu_de: '￥',
        bulk_stere: null
      }
      this.productDialogOptions.productDialogTitle = '新增'
      this.productDialogOptions.openProductDialog = true
    },
    // 确认新增产品
    subAddProduct () {
      this.$refs.addProductRulesForm.validate((valid) => {
        if (valid) {
          if (this.productDialogOptions.productDialogTitle === '新增') {
            this.createProduct()
          } else {
            this.updateBearProduct()
          }
        }
      })
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
  },
  mounted () {
    this.getProductCategoryList()
    this.getProductList()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
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
