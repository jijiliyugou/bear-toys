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
            v-model="formInline.keyword"
            placeholder="输入关键字"
            style="width: 90%"
            @keyup.enter.native="search"
            clearable
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
          <el-button type="primary" @click="openAdd(undefined)"
            >新增类目</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table :data="allCateList" ref="cateListRef" :indent="20" style="width: 100%" row-key="id" @row-click="clickTableRow">
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="ename" label="英文名称"></el-table-column>
        <el-table-column
          align="center"
          prop="number"
          label="编号"
        ></el-table-column>
        <el-table-column label="级别">
          <template slot-scope="scope">
            <el-tag :type="scope.row.level === 0 ? '' : 'danger'">{{
              scope.row.level === 0
                ? "一级类目"
                : "二级类目"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="success"
              @click="openAdd(scope.row, true)"
              :disabled="scope.row.level === 1"
              >新增子级</el-button
            >
            <el-button
              size="mini"
              style="margin-right: 10px"
              type="primary"
              @click="openAdd(scope.row)"
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
          :page-size="pageSize"
          :total="totalCount"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- 新增类目dialog -->
    <el-dialog
      :title="cateDialogOptions.cateDialogTitle + '类目'"
      :visible.sync="cateDialogOptions.openCateDialog"
      destroy-on-close
      width="30%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRulesForm"
        label-width="100px"
      >
        <el-form-item label="中文名称" prop="name">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="addCateForm.ename"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="addCateForm.number"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addCateForm.orders"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addcates">确认</el-button>
          <el-button @click="cateDialogOptions.openCateDialog = false"
            >取消</el-button
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
      addCateFormItem: null,
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      allCateList: [],
      formInline: {
        // 查询角色表单
        keyword: '',
        dateTile: null
      },
      cateDialogOptions: {
        cateDialogTitle: '新增',
        openCateDialog: false
      },
      addCateForm: {
        parentID: 0,
        name: '',
        ename: '',
        number: '',
        level: 0,
        orders: 0
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
      addCateRules: {
        name: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        number: [{ required: true, message: '请输入编号', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击行
    clickTableRow (row) {
      const $table = this.$refs.cateListRef
      this.allCateList.map((item) => {
        if (row.id !== item.id) $table.toggleRowExpansion(item, false)
      })
      $table.toggleRowExpansion(row)
    },
    // 删除类目
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteProductCategory', {
        id: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除类目成功')
        this.getCategoryPage()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取类目列表
    async getCategoryPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.formInline.keyword,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/ProductCategoryPage', fd)
      if (res.data.result.code === 200) {
        this.allCateList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改当前页
    currentChange (page) {
      this.currentPage = page
      this.getCategoryPage()
    },
    // 修改当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getCategoryPage()
    },
    search () {
      this.currentPage = 1
      this.getCategoryPage()
    },
    // 打开父级新增类目列表窗口
    openAdd (row, flag) {
      if (row && !flag) {
        for (const key in this.addCateForm) {
          this.addCateForm[key] = row[key]
        }
        this.addCateForm.level = row.level
        this.addCateFormItem = row || null
        this.cateDialogOptions.cateDialogTitle = '编辑'
        this.cateDialogOptions.openCateDialog = true
      } else if (row && flag) {
        this.addCateForm = {
          parentID: row.id,
          name: '',
          ename: '',
          number: '',
          level: row.level + 1,
          orders: 0
        }
        this.addCateForm.parentID = row.id
        this.addCateFormItem = row || null
        this.cateDialogOptions.cateDialogTitle = '新增'
        this.cateDialogOptions.openCateDialog = true
      } else {
        this.addCateForm = {
          parentID: 0,
          name: '',
          ename: '',
          number: '',
          level: 0,
          orders: 0
        }
        this.addCateFormItem = row || null
        this.cateDialogOptions.cateDialogTitle = '新增'
        this.cateDialogOptions.openCateDialog = true
      }
    },
    // 确认新增
    async addcates () {
      this.$refs.addCateRulesForm.validate(async (valid) => {
        if (valid) {
          let api, msg, obj
          if (this.cateDialogOptions.cateDialogTitle === '新增') {
            api = '/api/CreateProductCategory'
            msg = '新增成功'
            obj = this.addCateForm
          } else {
            api = '/api/UpdateProductCategory'
            msg = '编辑成功'
            obj = {
              ...this.addCateForm,
              id: this.addCateFormItem.id
            }
          }
          const res = await this.$http.post(api, obj)
          if (res.data.result.code === 200) {
            this.$message.success(msg)
            this.getCategoryPage()
            this.cateDialogOptions.openCateDialog = false
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    }
  },
  created () {},
  mounted () {
    this.getCategoryPage()
  }
}
</script>
<style scoped lang='less'>
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent{
  padding-bottom: 20px;
}
</style>
