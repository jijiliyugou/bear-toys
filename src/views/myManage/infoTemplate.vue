<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
    <!-- 搜索 -->
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
        <el-form-item label="展厅查询">
          <el-select
          clearable
            v-model="searchForm.hallNumber"
            placeholder="请选择展厅"
            style="width: 90%;"
          >
            <el-option
              v-for="(item, i) in [{companyName: '全部', companyNumber: ''}, ...hallList]"
              :key="i"
              :label="item.companyName"
              :value="item.companyNumber"
            ></el-option>
          </el-select>
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
        :header-cell-style="headerStyle"
      >
        <el-table-column prop="templateNumber" label="模板编号"></el-table-column>
        <el-table-column prop="templateName" label="模板名称"></el-table-column>
        <el-table-column prop="hallName" label="展厅"></el-table-column>
        <el-table-column prop="messageModel" label="消息类型">
          <template slot-scope="scope">
            <el-tag effect="plain">{{ scope.row.messageModel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="messageTitle" label="推送标题"></el-table-column>
        <el-table-column prop="pushContent" label="推送内容"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              title="确定要删除这条信息吗？"
              @onConfirm="handlerDelete(scope.row)"
            >
              <el-button size="mini" type="danger" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <center style="margin-top:20px;">
         <el-pagination
         ref="pageRef"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          :total="totalCount"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- 新增消息模板dialog -->
    <el-dialog
      :title="infoOptions.title"
      :visible.sync="infoOptions.addInfoTemplateDialog"
      v-if="infoOptions.addInfoTemplateDialog"
      destroy-on-close
      class="infoDialog"
    >
        <!-- :rules="addProductRules" -->
      <el-form
        class="addInfoDialog"
        :model="addInfoForm"
        ref="addInfoRulesForm"
        :rules="addRules"
        label-width="100px"
      >
        <el-form-item label="模板编号：" v-show="infoOptions.title === '编辑消息模板'">
          <el-input disabled v-model="addInfoForm.templateNumber"></el-input>
        </el-form-item>
        <el-form-item label="模板名称：" prop="templateName">
          <el-input v-model="addInfoForm.templateName"></el-input>
        </el-form-item>
        <div class="formItems">
          <el-form-item label="展厅：" prop="hallNumber">
            <el-select v-model="addInfoForm.hallNumber" @change="changeHallNumber" placeholder="请选择">
              <el-option v-for="(item, i) in hallList"
                :key="i"
                :label="item.companyName"
                :value="item.companyNumber">
              </el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="消息类型：" prop="messageExt">
            <el-select v-model="addInfoForm.messageExt" @change="changeMessageExt" placeholder="请选择">
              <el-option v-for="(item, i) in configList"
                :key="i"
                :label="item.itemText"
                :value="item.itemCode">
              </el-option>
              </el-select>
            </el-form-item>
        </div>
        <el-form-item label="推送标题：" prop="messageTitle">
          <el-input v-model="addInfoForm.messageTitle"></el-input>
        </el-form-item>
         <el-form-item label="推送内容：" prop="pushContent">
           <el-input
            type="textarea"
            v-model="addInfoForm.pushContent"
            :maxlength="
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            "
          ></el-input>
          <p class="textareaLength">
            最多可输入
            <span>{{
              $store.state.globalJson.Json.UserRestrictions[0].itemCode
            }}</span
            > 字，当前输入
            <span>
              {{ addInfoForm.remark ? addInfoForm.remark.length : 0 }} </span>，还可输入
            <span>{{
              $store.state.globalJson.Json.UserRestrictions[0].itemCode -
              (addInfoForm.pushContent ? addInfoForm.pushContent.length : 0)
            }}</span> 字
          </p>
         </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" @click="subAddInfoTemp">确认</el-button>
        <el-button @click="infoOptions.addInfoTemplateDialog = false"
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
// 获取重复手机号封装
import bsTop from '@/components/BsTop'
import bsFooter from '@/components/oldFooter'
export default {
  components: { bsTop, bsFooter },
  data () {
    return {
      addInfoForm: {
        templateNumber: null,
        messageExt: null,
        messageModel: null,
        templateName: null,
        hallNumber: null,
        hallName: null,
        messageTitle: null,
        pushContent: null,
        id: null
      },
      infoOptions: {
        title: '新增消息模板',
        addInfoTemplateDialog: false
      },
      configList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      hallList: [],
      searchForm: {
        keyword: '',
        hallNumber: ''
      },
      addRules: {
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        messageExt: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ],
        hallNumber: [
          { required: true, message: '请选择展厅', trigger: 'change' }
        ],
        messageTitle: [
          { required: true, message: '请输入推送标题', trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请输入推送标题', trigger: 'blur' }
        ]
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
        console.log(this.configList)
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 删除消息模板
    async handlerDelete (row) {
      row.isDelete = true
      const res = await this.$http.post('/api/UpdateSampleTemplate', row)
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getSampleTemplatePage()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 打开编辑
    openEdit (row) {
      this.infoOptions.title = '编辑消息模板'
      this.infoOptions.addInfoTemplateDialog = true
      for (const key in row) {
        this.addInfoForm[key] = row[key]
      }
    },
    // 选择了展厅
    changeHallNumber (companyNumber) {
      const selectedValue = this.hallList.find(item => item.companyNumber === companyNumber)
      this.addInfoForm.hallName = selectedValue.companyName
    },
    // 选择了消息类型
    changeMessageExt (itemCode) {
      const selectedValue = this.configList.find(item => item.itemCode === itemCode)
      this.addInfoForm.messageModel = selectedValue.itemText
      console.log(this.addInfoForm)
    },
    // 提交新增编辑消息模板
    async subAddInfoTemp () {
      this.$refs.addInfoRulesForm.validate(async valid => {
        if (valid) {
          let url = '/api/CreateSampleTemplate'
          if (this.infoOptions.title === '编辑消息模板') {
            url = '/api/UpdateSampleTemplate'
          }
          const res = await this.$http.post(url, this.addInfoForm)
          if (res.data.result.code === 200) {
            this.$message.success(this.infoOptions.title + '成功')
            this.getSampleTemplatePage()
            this.infoOptions.addInfoTemplateDialog = false
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    },
    // 打开新增界面
    openAdd () {
      this.infoOptions.title = '新增消息模板'
      this.infoOptions.addInfoTemplateDialog = true
      this.addInfoForm = {
        templateNumber: null,
        messageExt: null,
        messageModel: null,
        templateName: null,
        hallNumber: null,
        hallName: null,
        messageTitle: null,
        pushContent: null
      }
    },
    // 表头类名
    headerStyle ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex) {
        return 'background-color:#1989fa;color:#fff;font-weight:400;'
      }
      var list = [
        { id: 0 }
      ]
    },
    // 点击未安装电话列表
    searchPhone (phone) {
      // this.searchForm.keyword = phone
      // this.search()
      this.$message.error('这是假数据哦，接口正在开发中......')
    },
    // 列表查询
    search () {
      this.currentPage = 1
      this.getSampleTemplatePage()
    },
    // 获取公司类型
    // async getClientTypeList () {
    //   const res = await this.$http.post('/api/ServiceConfigurationList', {
    //     basisParameters: 'CompanyType'
    //   })
    //   if (res.data.result.code === 200) {
    //     this.clientTypeList = res.data.result.item
    //   } else {
    //     this.$message.error(res.data.result.msg)
    //   }
    // },
    // 获取展厅列表
    async getOrgCompanyList () {
      const res = await this.$http.post('/api/OrgCompanyList', { companyType: 'Exhibition' })
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item
        this.getSampleTemplatePage()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取消息模板列表
    async getSampleTemplatePage () {
      const fd = {
        keyword: this.searchForm.keyword,
        hallNumber: this.searchForm.hallNumber,
        templateName: this.searchForm.companyType,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/SampleTemplatePage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
        if (fd.hallNumber) this.$message.error(res.data.result.msg)
        else this.$message.error('请选择展厅')
      }
    },
    // 表格排序
    sortMethod (a, b) {
      return Number(a.handset) - Number(b.handset)
    },
    // 切换当前页
    currentChange (page) {
      this.currentPage = page
      this.getSampleTemplatePage()
    },
    // 切换当前页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getSampleTemplatePage()
    },
    // 初始化饼状图
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.querySelector('.statisticsContent'))
      myChart.on('click', function (params) {
        console.log(params.data)
      })
      // 绘制图表
      const options = {
        title: {
          text: '手机数据统计',
          subtext: '重复手机统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#f56c6c', '#5fadff'],
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['重复手机号', '正常手机号']
        },
        series: [
          {
            name: '手机数据统计',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 100, name: '重复手机号' },
              { value: 310, name: '正常手机号' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      myChart.setOption(options)
    }
  },
  watch: {
  },
  mounted () {
    this.getOrgCompanyList()
    this.getSystemConfig('MessageModel')
    // this.getClientTypeList()
    // this.drawLine()
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
  .statistics{
    width: 50%;
    margin-left: 5px;
    border: 1px solid #ebeef5;
    padding: 5px;
    display: flex;
    .statisticsTitle{
      min-width: 100px;
      padding: 5px;
      color: #000;
      font-weight: 600;
    }
    .statisticsContent{
      flex: 1;
    }
  }
  .addInfoDialog{
    .formItems{
        .el-select{
            width: 100%;
        }
    }
    .textareaLength{
            span {
                color: #ff6600;
            }
        }
  }
// }
// .demo-form-inline{
//   .el-form-item{
    // @{deep} .el-form-item__content{
    //   width: 130px;
    // }
    // &:last-of-type{
    //   @{deep} .el-form-item__content{
    //   width: 70px;
    // }
    // }
//   }
// }
</style>
