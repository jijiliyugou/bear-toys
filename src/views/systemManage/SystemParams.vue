<template>
<el-container>
  <el-header style="padding:0;">
    <bsTop></bsTop>
  </el-header>
  <el-main>
    <div class="blockBox">
          <!-- 父表格 -->
      <div class="tableBox">
        <div class="searchBox">
          <el-form :inline="true" :model="searchTableOne" class="demo-form-inline">
            <el-form-item>
              <el-input
              clearable
                @keyup.enter.native="searchOne"
                v-model="searchTableOne.keyword"
                placeholder="输入关键字查询"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button type="primary" @click="searchOne">搜索</el-button>
            <el-button type="primary" @click="openAddA">新增</el-button>
          </div>
        </div>
        <el-table
        :header-cell-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        :header-row-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        highlight-current-row
        stripe
        @current-change="handleCurrentChange"
        :data="tableDataOne"
        border
        height="700px"
        class="tableOne"
        >
        <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center">
      </el-table-column>
        <el-table-column
        align="center"
          prop="basisExplainName"
          label="名称">
        </el-table-column>
        <el-table-column
        align="center"
          prop="basisExplainCode"
          label="参数">
        </el-table-column>
        <el-table-column
        align="center"
        width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click.stop="openFatherEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              title="确定要删除该参数名吗？"
              @onConfirm="deleteA(scope.row)"
            >
              <el-button size="mini" type="danger" @click.stop slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增编辑系统参数 A 弹窗 -->
    <el-dialog
      :title="systemDialogTitleA"
      :visible.sync="systemDialogA"
      v-if="systemDialogA"
      width="50%"
    >
          <el-form
            ref="formNameRefA"
            :model="addCateA"
            :rules="rulesFormName"
            label-width="100px"
          >
            <el-form-item label="名称" prop="basisExplainName">
              <el-input v-model="addCateA.basisExplainName"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="basisExplainCode">
              <el-input v-model="addCateA.basisExplainCode"></el-input>
            </el-form-item>
            <center>
              <el-button type="primary" @click="subSystemA">确认</el-button>
              <el-button @click="systemDialogA = false">取消</el-button>
            </center>
          </el-form>
    </el-dialog>
    </div>
      <!-- 子表格 -->
      <div class="tableBoxTwo">
        <div class="searchBox">
          <el-form :inline="true" :model="searchTableOne" class="demo-form-inline">
            <el-form-item>
              <el-input
              clearable
                @keyup.enter.native="searchTwo"
                v-model="searchTableTwo.keyword"
                placeholder="输入关键字查询"
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button type="primary"  @click="searchTwo">搜索</el-button>
            <el-button type="primary" @click="openAddB" :disabled="!addSystemB.basisParameters">新增</el-button>
          </div>
        </div>
        <el-table
        :header-cell-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        :header-row-style="{ backgroundColor: '#8bc4ff', color: '#fff' }"
        empty-text="请选择左边类目"
        class="tableTwo"
        stripe
        :data="tableDataTwo"
        height="700px"
        border>
        <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center">
      </el-table-column>
        <el-table-column
         align="center"
          prop="itemText"
          label="名称">
        </el-table-column>
        <el-table-column
         align="center"
          prop="itemCode"
          label="参数">
        </el-table-column>
        <el-table-column
         align="center"
          prop="parameter"
          label="参数值">
        </el-table-column>
        <el-table-column
        align="center"
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
       align="center"
       width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click.stop="openChildrenEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 10px"
              title="确定要删除该系统参数吗？"
              @onConfirm="deleteB(scope.row)"
            >
              <el-button size="mini" type="danger" @click.stop slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
        </template>
      </el-table-column>
      </el-table>
      <!-- 新增编辑系统参数 B 弹窗 -->
    <el-dialog
      :title="systemDialogTitleB"
      :visible.sync="systemDialogB"
      v-if="systemDialogB"
      width="50%"
    >
          <el-form
            ref="formNameRefB"
            :model="addSystemB"
            :rules="rulesSystemForm"
            label-width="100px"
          >
            <el-form-item label="类别：" prop="basisParameters">
              <el-input v-model="addSystemB.basisParameters" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称：" prop="itemText">
              <el-input v-model="addSystemB.itemText"></el-input>
            </el-form-item>
            <el-form-item label="参数：" prop="itemCode">
              <el-input v-model="addSystemB.itemCode"></el-input>
            </el-form-item>
            <el-form-item label="参数值：" prop="parameter">
              <el-input v-model="addSystemB.parameter"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="orderIndex">
              <el-input
                type="number"
                v-model="addSystemB.orderIndex"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述：">
              <el-input
                type="textarea"
                v-model="addSystemB.remark"
                maxlength="500"
              ></el-input>
              <p class="textareaLength">
                最多可输入
                <span>500</span>
                字，当前输入
                <span>{{
                  (addSystemB.remark && addSystemB.remark.length) || 0
                }}</span>
                字，还可输入
                <span>
                  {{ 500 - (addSystemB.remark && addSystemB.remark.length) }}
                </span>
                字
              </p>
            </el-form-item>
            <center>
                <el-button type="primary" @click="subSystemB">确认</el-button>
                <el-button @click="systemDialogB = false">取消</el-button>
              </center>
          </el-form>
        </el-dialog>
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
      addSystemB: {
        basisParameters: null,
        parameter: null,
        itemText: null,
        itemCode: null,
        orderIndex: null,
        remark: null
      },
      addCateA: {
        basisExplainName: null,
        basisExplainCode: null
      },
      rulesSystemForm: {
        basisParameters: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ],
        parameter: [
          { required: true, message: '请输入参数值', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        itemText: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        itemCode: [
          { required: true, message: '请输入参数', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        orderIndex: [
          { required: true, message: '排序为必填项' },
          {
            min: 1,
            max: 100,
            validator (r, v, b) {
              /^[\d]*$/.test(v) ? b() : b(new Error('请填写数字'))
            },
            message: '长度在 1 到 100 个字符'
          }
        ]
      },
      rulesFormName: {
        basisExplainName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        basisExplainCode: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      systemDialogTitleB: '新增系统参数',
      systemDialogB: false,
      systemDialogTitleA: '新增系统参数名',
      systemDialogA: false,
      tableDataOne: null,
      tableDataTwo: null,
      searchTableOne: {
        keyword: ''
      },
      searchTableTwo: {
        keyword: ''
      }
    }
  },
  methods: {
    // 删除B表
    async deleteB (row) {
      row.isDelete = true
      const res = await this.$http.post('/api/DeleteServiceConfiguration', row)
      if (res.data.result.code === 200) {
        this.getChildrenSysList()
        this.$message.success('删除数据成功')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 提交B表
    subSystemB () {
      this.$refs.formNameRefB.validate(async valid => {
        if (valid) {
          let sysUrl = '/api/CreateServiceConfiguration'
          let msg = '新增参数成功'
          if (this.systemDialogTitleB === '编辑系统参数') {
            sysUrl = '/api/UpdateServiceConfiguration'
            msg = '编辑参数成功'
          }
          const res = await this.$http.post(sysUrl, this.addSystemB)
          if (res.data.result.code === 200) {
            this.$message.success(msg)
            this.getChildrenSysList()
            this.systemDialogB = false
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    },
    // 搜索B表
    searchTwo () {
      this.getChildrenSysList()
    },
    // 打开编辑B表
    openChildrenEdit (row) {
      this.systemDialogTitleB = '编辑系统参数'
      this.addSystemB = this.$_.cloneDeep(row)
      this.systemDialogB = true
    },
    // 打开新增B表
    openAddB () {
      this.systemDialogTitleB = '新增系统参数'
      this.addSystemB.parameter = null
      this.addSystemB.itemText = null
      this.addSystemB.itemCode = null
      this.addSystemB.orderIndex = null
      this.addSystemB.remark = null
      this.systemDialogB = true
    },
    // 打开新增A表
    openAddA () {
      this.systemDialogTitleA = '新增系统参数名'
      this.addCateA = {
        basisExplainName: null,
        basisExplainCode: null
      }
      this.systemDialogA = true
    },
    // 打开编辑A表
    openFatherEdit (row) {
      this.systemDialogTitleA = '编辑系统参数名'
      this.addCateA = row
      this.systemDialogA = true
    },
    // 提交A表
    subSystemA () {
      this.$refs.formNameRefA.validate(async valid => {
        if (valid) {
          let url = '/api/CreateServiceConfigurationName'
          let msg = '添加类别成功'
          if (this.systemDialogTitleA === '编辑系统参数名') url = '/api/UpdateServiceConfigurationName'
          if (this.systemDialogTitleA === '编辑系统参数名') msg = '编辑类别成功'
          const res = await this.$http.post(url, this.addCateA)
          if (res.data.result.code === 200) {
            this.$message.success(msg)
            this.getServiceConfigurationNameList()
            this.systemDialogA = false
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    },
    // 删除A表
    async deleteA (row) {
      row.isDelete = true
      const res = await this.$http.post('/api/DeleteServiceConfigurationName', row)
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getServiceConfigurationNameList()
      } else this.$message.error(res.data.result.msg)
    },
    // 搜索A表
    searchOne () {
      this.getServiceConfigurationNameList()
    },
    // 点击A表显示A表下的B表
    handleCurrentChange (row) {
      if (row) {
        this.addSystemB.basisParameters = row.basisExplainCode
        this.getChildrenSysList()
      }
    },
    // 获取B表系统参数列表
    async getChildrenSysList () {
      const res = await this.$http.post('/api/ServiceConfigurationList', { keyword: this.searchTableTwo.keyword, basisParameters: this.addSystemB.basisParameters })
      if (res.data.result.code === 200) {
        this.tableDataTwo = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取A表系统参数列表
    async getServiceConfigurationNameList () {
      const res = await this.$http.post('/api/ServiceConfigurationNameList', { basisExplainName: this.searchTableOne.keyword })
      if (res.data.result.code === 200) {
        this.tableDataOne = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {
    this.getServiceConfigurationNameList()
    // this.getChildrenSysList()
  },
  mounted () {
  },
  watch: {
    filterTextOne (val) {
      this.$refs.treeOne.filter(val)
    },
    filterTextTwo (val) {
      this.$refs.treeTwo.filter(val)
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.el-main{
  padding:0 20px;
  overflow:visible;
    .blockBox{
      min-width: 1024px;
      max-width: 1200px;
      box-sizing: border-box;
      margin:0 auto;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tableBox{
        flex: 1;
        .searchBox{
          border: 1px solid #ebeef5;
          display: flex;
          padding: 10px 5px;
          justify-content: space-between;
          .el-form{
            .el-form-item {
              margin: 0;
            }
          }
        }
        .textareaLength{
          span {
            color: tomato;
          }
        }
      }
      .tableBoxTwo{
        flex: 2;
        .searchBox{
          border: 1px solid #ebeef5;
          display: flex;
          padding: 10px 5px;
          justify-content: space-between;
          .el-form{
            .el-form-item {
              margin: 0;
            }
          }
        }
        .textareaLength{
          span {
            color: tomato;
          }
        }
      }
    }
}
@{deep} .el-table th, @{deep} .el-table tr {
  background-color: transparent;
}
</style>
