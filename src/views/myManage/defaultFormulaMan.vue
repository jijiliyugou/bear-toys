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
              @keyup.enter.native="search"
              clearable
              v-model="searchForm.keyword"
              placeholder="输入关键字"
              style="width: 90%"
            ></el-input>
        </el-form-item>
        <el-form-item label="时间段搜索">
          <el-date-picker
            v-model="searchForm.dateTile"
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
        <el-table-column prop="name" label="模板名称"></el-table-column>
        <el-table-column prop="offerMethod" label="报价方式"></el-table-column>
        <el-table-column prop="cu_deName" label="币种"></el-table-column>
        <el-table-column prop="exchange" label="汇率"></el-table-column>
        <el-table-column prop="profit" label="利润"></el-table-column>
        <el-table-column prop="decimalPlaces" label="小数"></el-table-column>
        <el-table-column prop="rejectionMethod" label="取舍方式"></el-table-column>
        <el-table-column prop="size" label="尺码"></el-table-column>
        <el-table-column
          prop="createdOn"
          label="创建时间"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.createdOn && scope.row.createdOn.split("T")[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
              title="确定要删除这个模板吗？"
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
    <!-- <div style="maxWidth:1200px;minWidth:800px;margin:0 auto;">
    </div> -->
    <!-- 新增报价公式dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" v-if="showDialog" width="50%">
      <el-form
        ref="addDefaultFormRef"
        label-width="100px"
        :rules="defaultFormRules"
        :model="addDefaultForm"
        class="addDialogClass"
      >
      <el-form-item class="offerMethodClass" label="模板名称：" prop="offerMethod">
        <el-input placeholder="请输入内容" v-model="addDefaultForm.name" clearable></el-input>
      </el-form-item>
        <el-form-item class="offerMethodClass" label="报价方式：" prop="offerMethod">
          <el-select v-model="addDefaultForm.offerMethod" clearable placeholder="请选择">
            <template v-for="item in configList">
              <el-option
              v-if="item.itemText === 'OfferMethod'"
              :key="item.id"
              :label="item.itemCode"
              :value="item.itemCode">
            </el-option>
            </template>
          </el-select>
        </el-form-item>
        <div class="inputWrap">
          <div class="left">
          <el-form-item label="币种：" prop="cu_de">
          <el-select v-model="addDefaultForm.cu_de" @change="changeSelect" clearable placeholder="请选择">
            <template v-for="item in configList">
              <el-option
              v-if="item.itemText === 'Cu_de'"
              :key="item.id"
              :label="item.itemCode"
              :value="item.parameter">
            </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="汇率：" prop="exchange">
          <el-input v-model="addDefaultForm.exchange" :maxlength="String(addDefaultForm.exchange).includes('.') ? 7 : 6"></el-input>
        </el-form-item>
        <el-form-item label="利润：" prop="profit">
          <el-input v-model.number="addDefaultForm.profit" clearable  maxlength="6"><i slot="append">%</i></el-input>
        </el-form-item>
        </div>
        <div class="right">
        <el-form-item label="小数位数：" prop="decimalPlaces">
          <el-select v-model="addDefaultForm.decimalPlaces" clearable placeholder="请选择">
            <template v-for="item in configList">
              <el-option
              v-if="item.itemText === 'DecimalPlaces'"
              :key="item.id"
              :label="item.itemCode"
              :value="item.itemCode">
            </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="每车尺码：" prop="size">
          <el-select v-model="addDefaultForm.size" clearable placeholder="请选择">
            <template v-for="item in configList">
              <el-option
              v-if="item.itemText === 'Size'"
              :key="item.id"
              :label="item.itemCode"
              :value="item.itemCode">
            </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="取舍方式：" prop="rejectionMethod">
          <el-select v-model="addDefaultForm.rejectionMethod" clearable placeholder="请选择">
            <template v-for="item in configList">
              <el-option
              v-if="item.itemText === 'RejectionMethod'"
              :key="item.id"
              :label="item.itemCode"
              :value="item.itemCode">
            </el-option>
            </template>
          </el-select>
        </el-form-item>
        </div>
        </div>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addDefaultForm.remark">
          </el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="subDefaultForm">提 交</el-button>
            <el-button type="danger" @click="showDialog = false">取 消</el-button>
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
    const validateLength = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        var reg = /^-?\d{1,5}(?:\.?\d{1,5})?$/ // 小数点左边最高5位，小数点右边最多5位
        var reg1 = /^\d{1,6}$/
        if (/^[0-9]+\.?[0-9]*/.test(value)) {
          if (reg.test(value)) {
            if (String(value).includes('.')) {
              callback()
            } else {
              if (reg1.test(value)) {
                callback()
              } else {
                callback(new Error('只能输入1-6位数字'))
              }
            }
          } else {
            callback(new Error('小数点前后最多可1-5位数字'))
          }
        } else {
          callback(new Error('只能输入数字类型'))
        }
      }
    }
    return {
      showDialog: false,
      configList: [],
      dialogTitle: '新增公式',
      addDefaultForm: {
        name: null,
        remark: null,
        offerMethod: null,
        cu_de: null,
        cu_deName: null,
        exchange: null,
        decimalPlaces: null,
        profit: null,
        size: null,
        rejectionMethod: null
      },
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      defaultFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 200, message: '字数在 1-200 个字符之间', trigger: 'blur' }
        ],
        offerMethod: [
          { required: true, message: '请选择报价方式', trigger: 'change' }
        ],
        cu_de: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ],
        exchange: [
          { required: true, message: '请输入汇率', trigger: 'blur' },
          { validator: validateLength, trigger: 'blur' }
        ],
        decimalPlaces: [
          { required: true, message: '请选择小数位数', trigger: 'change' }
        ],
        profit: [
          { required: true, message: '请输入利润', trigger: 'blur' },
          { type: 'number', message: '利润必须为数字值', trigger: 'blur' }
        ],
        size: [
          { required: true, message: '请选择尺码', trigger: 'change' }
        ],
        rejectionMethod: [
          { required: true, message: '请选择取舍方式', trigger: 'change' }
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
        dateTile: null
      }
    }
  },
  methods: {
    // 获取系统配置
    async getSystemConfig (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        this.configList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 列表查询
    search () {
      this.currentPage = 1
      this.getProductOfferFormulaPage()
    },
    // 获取列表
    async getProductOfferFormulaPage () {
      const fd = {
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1],
        keyword: this.searchForm.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/ProductOfferFormulaPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getProductOfferFormulaPage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getProductOfferFormulaPage()
    },
    // 打开新增计算公式模板
    openAdd (row) {
      this.dialogTitle = '新增公式'
      this.addDefaultForm = {
        name: null,
        remark: null,
        offerMethod: null,
        cu_de: null,
        cu_deName: null,
        exchange: null,
        decimalPlaces: null,
        profit: null,
        size: null,
        rejectionMethod: null
      }
      this.showDialog = true
    },
    // 打开编辑计算公式模板
    openEdit (row) {
      this.dialogTitle = '编辑公式'
      this.addDefaultForm = row
      this.showDialog = true
    },
    // 提交
    async subDefaultForm () {
      this.$refs.addDefaultFormRef.validate(async valid => {
        if (valid) {
          console.log(this.addDefaultForm)
          let msg = '新增公式成功'
          let url = '/api/CreateProductOfferFormula'
          if (this.dialogTitle === '编辑公式') {
            msg = '编辑公式成功'
            url = '/api/UpdateProductOfferFormula'
          }
          const res = await this.$http.post(url, this.addDefaultForm)
          if (res.data.result.code === 200) {
            await this.getProductOfferFormulaPage()
            this.showDialog = false
            this.$message.success(msg)
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    },
    // 选择币别事件
    changeSelect (val) {
      const { itemCode } = this.configList.find(item => item.parameter === val)
      this.addDefaultForm.cu_deName = itemCode
    },
    // 删除
    async handleDelete (row) {
      console.log(row)
      const res = await this.$http.post('/api/DeleteProductOfferFormula', {
        isdelete: true,
        id: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getProductOfferFormulaPage()
      } else {
        this.$message.error('删除失败,请检查网络！')
      }
    }
  },
  watch: {
  },
  mounted () {
    this.getProductOfferFormulaPage()
    this.getSystemConfig('CompanyProductOffer')
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
.addDialogClass{
  .offerMethodClass{
    .el-select{
      width: 100%;
    }
  }
  .inputWrap{
  display: flex;
  justify-content: space-between;
  .left,.right{
    flex: 1;
    box-sizing: border-box;
      @{deep} .el-form-item__content {
       width: calc(100% - 100px);
       .el-select{
          width: 100%;
        }
      }
    }
    .left {
      padding-right: 10px;
    }
    .right {
      padding-left: 10px;
    }
  }
}
</style>
