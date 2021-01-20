<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <!-- 搜索 -->
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
        <div class="searchBox">
      <el-form :inline="true" :model="formInline" size="mini" class="searchForm">
          <div class="searchItem">
            <el-form-item label="关键查询：">
            <el-input
            clearable
              @keyup.enter.native="search"
              v-model="formInline.CompanyName"
              placeholder="输入关键字"
              style="width: 90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型查询：">
            <el-select
              clearable
              v-model="formInline.CompanyType"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="item in [
                  { itemCode: null, itemText: '全部' },
                  ...clientTypeList,
                ]"
                :key="item.itemCode"
                :label="item.itemText"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间查询：">
            <el-date-picker
              v-model="formInline.dateTile"
              width="50%"
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
          <div class="searchItem">
              <el-form-item class="btnList">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="openAddClient" :disabled="selectionList.length ? false : true">合并</el-button>
            </el-form-item>
          </div>
      </el-form>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        ref="tableRef"
        size="mini"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
      <el-table-column type="selection" label="选择" width="50" align="center">
        </el-table-column>
        <el-table-column prop="companyNumber" label="客户头像" width="80">
          <template slot-scope="scope">
            <el-image class="img" :src="scope.row.companyLogo" fit="cover" :preview-src-list="[scope.row.companyLogo]">
              <div
                slot="error"
                class="image-slot"
                style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color:#3872f8;
                  color:#fff;
                  padding:0 5px;
                  text-align:center;">
                <span style="display: -webkit-box;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: clip;
                  -webkit-box-orient: vertical;">{{ scope.row.companyName }}</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="companyNumber" label="客户编码"></el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <!-- <el-table-column prop="e_mail" label="邮箱"></el-table-column> -->
        <el-table-column prop="phoneNumber" label="联系电话" sortable></el-table-column>
        <el-table-column prop="integralTotal" label="积分" align="center" sortable></el-table-column>
        <el-table-column prop="companyType" label="公司类型" align="center">
          <template slot-scope="scope">
            <el-link :underline="false" v-if="scope.row.companyType === 'Sales'" type="success">销售公司</el-link>
            <el-link :underline="false" v-if="scope.row.companyType === 'Exhibition'" type="warning">展厅</el-link>
            <el-link :underline="false" v-if="scope.row.companyType === 'Supplier'" type="primary">供应商</el-link>
            <el-link :underline="false" v-if="scope.row.companyType === 'Admin'" type="danger">管理员</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="audit_state" label="审核状态" align="center">
          <template slot-scope="scope">
            <template v-for="(item, i) in userAuditTypeList">
              <el-tag :key="i" effect="plain" v-if="scope.row.audit_state === item.itemCode" :type="btnTypes[item.itemCode]">{{item.itemText}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="interiorAudit" label="内部审核" align="center">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.interiorAudit" type="success">已审核</el-tag>
              <el-tag v-else type='danger'>未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="新增日期"
          prop="createdOn"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.createdOn ? scope.row.createdOn.split(/T/)[0] : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click.stop="openUserMan(scope.row)"
              >绑定公司</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click.stop="openEmployeeMan(scope.row)"
              >员工管理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <center style="margin: 20px 0;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </center>
    </div>
    </div>
    <!-- <div style="maxWidth:1200px;minWidth:800px;margin:0 auto;">
    </div> -->
    <!-- 合并用户dialog -->
    <el-dialog title="合并" :visible.sync="mergeDialog" destroy-on-close width="50%">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>公司名称/编号：<span v-if="companyName">(选择合并到 <span style="color:#40aaff;">{{companyName.companyName || 'xxx'}}</span> 公司名下)</span></span>
            </div>
            <el-radio-group v-model="companyName" size="small">
                <div class="radioBox">
                    <el-radio v-for="(item, index) in selectionList" :key="index" :label="item" border>{{item.companyName}}/{{item.companyNumber}}</el-radio>
                </div>
            </el-radio-group>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>手机号：<span v-if="phone">(选择合并到 <span style="color:#40aaff;">{{phone.phoneNumber || 'xxx'}}</span> 手机号下)</span></span>
            </div>
            <el-radio-group v-model="phone" size="small">
                <div class="radioBox">
                    <el-radio v-for="(item, index) in selectionList" :key="index" :label="item" border>{{item.phoneNumber}}</el-radio>
                </div>
            </el-radio-group>
        </el-card>
        <center style="margin-top:20px;">
            <el-button type="primary" @click="subMerge">合 并</el-button>
            <el-button type="primary" @click="mergeDialog = false">取 消</el-button>
        </center>
    </el-dialog>
    <!-- 绑定公司dialog -->
    <el-dialog
      :title="UserManConfig.title"
      :visible.sync="UserManConfig.userManDialog"
      destroy-on-close
      width="70%"
    >
      <el-table
        :data="userManList"
        style="width: 100%; min-height: 300px"
        :default-sort="{ prop: 'createdOn', order: 'descending' }"
      >
        <el-table-column
          v-if="userManList.companyNumber"
          prop="companyNumber"
          label="公司编码"
        ></el-table-column>
        <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
        <el-table-column prop="client_nu" label="客户编号"></el-table-column>
        <el-table-column prop="client_na" label="客户名称"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column prop="handset" label="联系电话"></el-table-column>
        <el-table-column label="新增日期" prop="createdOn" sortable width="180">
          <template slot-scope="scope">
            {{
              scope.row.createdOn ? scope.row.createdOn.replace(/T/gi, " ") : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="关联"
          prop="companyNumber"
          width="50"
          align="center"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.companyNumber"
              style="color: #85ce61"
            ></i>
            <i class="el-icon-error" v-else style="color: #f581b0"></i>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="!scope.row.companyNumber"
              @click="Related(scope.row, 1)"
              >关联</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-else
              @click="Related(scope.row, 2)"
              >取消关联</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <center style="margin-top:20px;">
        <el-pagination
          layout="prev, pager, next"
          background
          :total="userManTotalCount"
          :page-size="userManPageSize"
          @current-change="userManCurrentChange"
        ></el-pagination>
      </center> -->
    </el-dialog>
    <!-- 员工管理dialog -->
    <el-dialog
      :title="employeeMan.title"
      :visible.sync="employeeMan.dialog"
      width="70%"
      :close-on-click-modal="true"
      destroy-on-close>
      <!-- 嵌套新增员工 -->
      <el-dialog
        width="50%"
        top="50px"
        :title="employeeMan.employeeTitle"
        :visible.sync="innerVisible"
        destroy-on-close
        append-to-body
      >
        <el-form
          :model="addEmployeeForm"
          ref="addEmployeeRef"
          :rules="addEmployeeRules"
        >
          <el-form-item label="员工头像" label-width="100px" prop="userImage">
            <el-upload
              :action="baseAPI + '/api/File/InsertPic'"
              list-type="picture-card"
              ref="upload"
              :auto-upload="false"
              :on-change="changeUpload"
              :on-preview="handlePicEmployeePreview"
              :http-request="successUpload"
              :file-list="editImages"
              accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogUpload" destroy-on-close :modal="false">
              <img width="100%" :src="LogoUrl" alt />
            </el-dialog>
          </el-form-item>

          <div class="flexLayout">
            <el-form-item
              label="员工账号"
              label-width="100px"
              prop="phoneNumber"
            >
              <el-input
                v-model="addEmployeeForm.phoneNumber"
                :disabled="employeeMan.employeeTitle === '员工编辑'"
              ></el-input>
            </el-form-item>
            <el-form-item label="昵称" label-width="100px" prop="linkman">
              <el-input v-model="addEmployeeForm.linkman"></el-input>
            </el-form-item>
            <!-- <el-form-item label="密码" v-if="employeeMan.employeeTitle === '编辑员工'" label-width="100px">
              <el-input v-model="addEmployeeForm.newPassword"></el-input>
            </el-form-item>-->
            <el-form-item
              label="密码"
              label-width="100px"
              :prop="employeeMan.employeeTitle === '员工编辑' ? '' : 'password'"
            >
              <el-input v-model="addEmployeeForm.password"></el-input>
            </el-form-item>
          </div>
          <div class="flexLayout">
            <el-form-item label="性别" label-width="100px" prop="sex">
              <el-radio-group v-model="addEmployeeForm.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否主账号" label-width="100px" prop="isMain">
              <el-radio-group v-model="addEmployeeForm.isMain">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否激活" label-width="100px" prop="enabled">
              <el-radio-group v-model="addEmployeeForm.enabled">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="生日" label-width="100px">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="addEmployeeForm.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" label-width="100px">
            <el-input
              type="textarea"
              v-model="addEmployeeForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <center>
          <el-button type="primary" @click="addEmployee"><i :class="{'el-icon-loading':isShowLoading}"></i> 保存</el-button>
          <el-button type="danger" @click="resetForm">取消</el-button>
        </center>
      </el-dialog>
      <div class="addBtn">
        <el-button type="primary" style="float: right" @click="openAddemployee"
          >新增</el-button
        >
      </div>
      <el-table
        :data="employeeList"
        style="width: 100%; font-size: 12px"
        :default-sort="{ prop: 'createdOn', order: 'descending' }"
      >
        <!-- v-loading="$store.state.vueElementLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" -->
        <el-table-column
          fixed
          prop="userImage"
          label="头像"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              shape="square"
              style="background-color: #165af7;width:50px;height:50px;color:#fff;"
              :src="scope.row.userImage"
              :key="scope.row.userImage"
              fit="cover"
            >
              <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding:0 5px;
                  text-align:center;">
                <span style="display: -webkit-box;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: clip;
                  -webkit-box-orient: vertical;">{{ scope.row.linkman }}</span>
                </div>
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width:100%;height:100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding:0 5px;
                  text-align:center;">
                <span style="display: -webkit-box;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: clip;
                  -webkit-box-orient: vertical;">{{ scope.row.linkman }}</span>
                </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
         fixed
          prop="phoneNumber"
          label="员工账号"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="linkman"
          label="昵称"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column
          prop="isMain"
          label="是否主账号"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.isMain ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="50" align="center">
          <template slot-scope="scope">{{
            scope.row.sex === 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="生日"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="enabled"
          label="是否激活"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.row.enabled ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="openBindEmployees(scope.row)"
              >绑定员工</el-button
            >
            <!-- <el-button size="mini" type="warning" @click="bindEmployees(scope.row,2)">解绑</el-button> -->
            <el-button
              size="mini"
              type="primary"
              @click="editEmployees(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm
              style="margin-left: 10px"
              title="确定要删除该员工吗？"
              @onConfirm="deleteEmployees(scope.row)"
            >
              <el-button size="mini" type="danger" slot="reference"
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
          :page-size="employeeMan.pageSize"
          :total="employeeMan.totalCount"
          :current-page.sync="employeeMan.currentPage"
          @current-change="employeeManCurrentChange"
          @size-change="employeeManSizeChange"
        ></el-pagination>
      </center>
      <!-- 嵌套员工关联dialog -->
      <el-dialog
        :title="relatedConfig.title"
        destroy-on-close
        :visible.sync="relatedConfig.relatedDialog"
        width="70%"
        append-to-body
      >
        <el-table
          :data="relatedConfig.relatedDataList"
          style="width: 100%; min-height: 300px"
          :default-sort="{ prop: 'createdOn', order: 'descending' }"
        >
          <el-table-column
            prop="client_acc_nu"
            label="员工账号"
          ></el-table-column>
          <el-table-column prop="client_nu" label="员工编号"></el-table-column>
          <el-table-column prop="hallNumber" label="展厅编号"></el-table-column>
          <el-table-column prop="linkman" label="联系人"></el-table-column>
          <el-table-column
            label="新增日期"
            prop="createdOn"
            sortable
            width="180"
          >
            <template slot-scope="scope">
              {{
                scope.row.createdOn
                  ? scope.row.createdOn.replace(/T/gi, " ")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="personnelNo"
            width="50"
            align="center"
          >
            <template slot-scope="scope">
              <i
                class="el-icon-success"
                v-if="scope.row.personnelNo"
                style="color: #85ce61"
              ></i>
              <i class="el-icon-error" v-else style="color: #f581b0"></i>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="!scope.row.personnelNo"
                @click="bindEmployee(scope.row, 1)"
                >绑定</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-else
                @click="bindEmployee(scope.row, 2)"
                >取消绑定</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <center
          style="margin-top:20px;"
          v-if="relatedConfig.relatedDataList.length > 10"
        >
          <el-pagination
            layout="prev, pager, next"
            background
            :total="relatedConfig.totalCount"
            :page-size="relatedConfig.pageSize"
            @current-change="relatedCurrentChange"
          ></el-pagination>
        </center> -->
      </el-dialog>
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
      clientTypeList: [],
      yearMonthDayList: [],
      relatedConfig: {
        title: '员工绑定',
        relatedDialog: false,
        relatedDataList: [],
        totalCount: 10,
        currentPage: 1,
        pageSize: 10,
        id: null,
        phoneNumber: null
      },
      isShowLoading: false,
      dialogUpload: false,
      LogoUrl: '',
      editImages: [],
      addEmployeeRules: {
        userImage: [
          { required: true, message: '请选择员工头像', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: '请输入员工账号', trigger: 'blur' },
          {
            pattern: /^1[2,3,4,5,6,7,8,9][0-9]{9}$/,
            message: '手机格式不正确',
            trigger: 'blur'
          }
        ],
        linkman: [
          { required: true, message: '请输入员工昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, max: 20, message: '最少输入6-20个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择员工性别', trigger: 'change' }],
        isMain: [
          { required: true, message: '请选择是否主账号', trigger: 'change' }
        ],
        enabled: [
          { required: true, message: '请选择是否激活', trigger: 'change' }
        ]
      },
      addEmployeeForm: {
        // 新增员工表单
        personnelNo: null,
        phoneNumber: '',
        password: '',
        sex: 1,
        isMain: false,
        enabled: false,
        remark: '',
        birthday: '',
        userImage: '',
        weCharUserJson: null,
        wecharName: null,
        wecharNo: null,
        wecharOpenID: null,
        linkman: null,
        CompanyId: null,
        newPassword: null // 编辑时的密码
      },
      innerVisible: false,
      userManList: [], // 绑定公司列表
      UserManConfig: {
        userManDialog: false,
        title: '用户管理',
        companyNumber: null
      },
      employeeList: [],
      employeeMan: {
        title: '员工管理',
        dialog: false,
        totalCount: 100,
        currentPage: 1,
        pageSize: 10,
        companyNumber: null,
        phoneNumber: null,
        id: null,
        employeeTitle: '新增员工'
      },
      companyName: null,
      phone: null,
      mergeDialog: false,
      btnTypes: ['primary', 'success', 'danger', 'warning', 'info'],
      tableData: [],
      selectionList: [],
      userAuditTypeList: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      formInline: {
        CompanyName: null,
        CompanyType: null,
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
      }
    }
  },
  methods: {
    // 提交合并
    async subMerge () {
      const fd = {
        companyNumber: this.companyName.companyNumber,
        mainPhone: this.phone.phoneNumber,
        mergeCompanyNumber: this.selectionList.map(val => val.companyNumber)
      }
      console.log(fd)
      const res = await this.$http.post('/api/MergeCompany', fd)
      if (res.data.result.code === 200) {
        this.currentPage = 1
        this.getClientList()
        this.mergeDialog = false
        this.companyName = null
        this.phone = null
        this.$message.success('合并成功')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 点击行触发，选中或不选中复选框
    handleRowClick (row, column, event) {
      this.$refs.tableRef.toggleRowSelection(row)
    },
    // 点击勾选框触发 选中或不选中复选框
    handleSelectionChange (selection) {
      this.selectionList = selection
      if (selection.length > 1) {
        const oneVal = selection[0]
        selection.forEach((val, index) => {
          if (oneVal.companyType !== val.companyType) this.$refs.tableRef.toggleRowSelection(val)
        })
      }
      this.selectionList = selection
    },
    // 取消新增员工
    resetForm () {
      this.innerVisible = false
    },
    // 打开新增员工
    openAddemployee () {
      this.isEdit = false
      this.employeeMan.employeeTitle = '新增员工'
      this.editImages = []
      this.addEmployeeForm = {
        personnelNo: null,
        phoneNumber: '',
        password: '',
        sex: 1,
        isMain: false,
        enabled: false,
        remark: '',
        birthday: '',
        userImage: '',
        weCharUserJson: null,
        wecharName: null,
        wecharNo: null,
        wecharOpenID: null,
        linkman: null,
        CompanyId: null,
        newPassword: null // 编辑时的密码
      }
      this.file = null
      this.getCurrentDate()
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.addEmployeeRef.clearValidate()
      })
    },
    // 员工管理分页
    employeeManCurrentChange (page) {
      this.employeeMan.currentPage = page
      this.getEmployeeList(this.employeeMan.id)
    },
    // 员工管理修改每页条数
    employeeManSizeChange (pageSize) {
      this.employeeMan.pageSize = pageSize
      if (this.employeeMan.currentPage * pageSize > this.employeeMan.totalCount) return false
      this.getEmployeeList(this.employeeMan.id)
    },
    // 打开绑定员工
    async openBindEmployees (row, code) {
      this.relatedConfig.id = row.id
      this.relatedConfig.phoneNumber = row.phoneNumber
      this.relatedConfig.relatedDialog = true
      this.getPersinnelList(row.phoneNumber)
    },
    // 删除员工
    async deleteEmployees (row) {
      const res = await this.$http.post('/api/DeleteCompanyUser', {
        OrgCompanyID: this.employeeMan.id,
        OrgPersonnelID: row.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.getEmployeeList(this.employeeMan.id)
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 打开编辑员工
    editEmployees (row) {
      this.isEdit = true
      this.editImages = []
      this.employeeMan.employeeTitle = '员工编辑'
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.addEmployeeRef.clearValidate()
      })
      for (const key in this.addEmployeeForm) {
        this.addEmployeeForm[key] = row[key]
      }
      this.addEmployeeForm.newPassword = row.password
      this.addEmployeeForm.password = null
      row.userImage && (this.editImages[0] = { url: row.userImage })
      this.addEmployeeForm.id = row.id
      this.addEmployeeForm.weCharUserJson = row.weCharUserJson
      this.addEmployeeForm.wecharName = row.wecharName
      this.addEmployeeForm.wecharNo = row.wecharNo
      this.addEmployeeForm.wecharOpenID = row.wecharOpenID
    },
    // 获取弹出员工列表
    async getPersinnelList (phoneNumber) {
      const res = await this.$http.post('/api/SearchPersinnel', {
        Client_acc_nu: phoneNumber,
        companyNumber: this.employeeMan.companyNumber
      })
      if (res.data.result.code === 200) {
        this.relatedConfig.relatedDataList = res.data.result.item
      }
    },
    // 获取当前日期
    getCurrentDate () {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      this.$set(this.addEmployeeForm, 'birthday', defaultDate)
    },
    // 打开绑定公司
    openUserMan (row) {
      this.UserManConfig.userManDialog = true
      this.UserManConfig.companyNumber = row.companyNumber
      this.UserManConfig.phoneNumber = row.phoneNumber
      this.getUserMan(row.companyNumber, row.companyType)
    },
    // 打开员工管理
    openEmployeeMan (row) {
      this.employeeList = []
      this.employeeMan.currentPage = 1
      this.employeeMan.companyNumber = row.companyNumber
      this.employeeMan.phoneNumber = row.phoneNumber
      this.employeeMan.id = row.id
      this.getEmployeeList(row.id)
      this.employeeMan.dialog = true
    },
    // 获取绑定公司列表
    async getUserMan (CompanyNumber, companyType) {
      const res = await this.$http.post('/api/SearchCompany', {
        CompanyNumber: CompanyNumber,
        companyType: companyType
      })
      if (res.data.result.code === 200) {
        this.userManList = res.data.result.item
      }
    },
    // 点击关联
    async Related (row, code) {
      if (code === 1) {
        const res = await this.$http.post('/api/BindCompany', {
          companyNumber: this.UserManConfig.companyNumber,
          CompanyType: row.companyType,
          id: row.id
        })
        console.log(res)
        if (res.data.result.code === 200) {
          this.$message.success('关联成功')
        } else {
          this.$message.error(res.data.result.msg)
        }
        this.getUserMan(this.UserManConfig.companyNumber, row.companyType)
      } else {
        const res = await this.$http.post('/api/BindCompany', {
          companyNumber: null,
          id: row.id
        })
        if (res.data.result.code === 200) {
          this.$message.success('取消关联成功')
        } else {
          this.$message.error(res.data.result.msg)
        }
        this.getUserMan(this.UserManConfig.companyNumber, row.companyType)
      }
    },
    // 新增员工
    async addEmployee () {
      this.addEmployeeForm.CompanyId = this.employeeMan.id
      const imgRes = await this.successUpload()
      if (imgRes.data.result.code === 200) {
        this.addEmployeeForm.userImage =
          imgRes.data.result.object[0] && imgRes.data.result.object[0].filePath
            ? imgRes.data.result.object[0].filePath
            : this.addEmployeeForm.userImage
      } else {
        this.$message.error(imgRes.data.result.message)
      }
      if (this.isEdit) {
        this.$refs.addEmployeeRef.validate(async (valid) => {
          if (valid) {
            this.isShowLoading = true
            this.addEmployeeForm.password = this.addEmployeeForm.password
              ? this.$md5('LitterBear' + this.addEmployeeForm.password)
              : this.addEmployeeForm.newPassword
            const res = await this.$http.post(
              '/api/UpdateOrgPersonnel',
              this.addEmployeeForm
            )
            if (res.data.result.code === 200) {
              this.getCurrentDate()
              this.innerVisible = false
              this.$message.closeAll()
              this.$message.success('员工编辑成功')
              this.getEmployeeList(this.employeeMan.id)
              this.isShowLoading = false
            } else {
              this.$message.error(res.data.result.msg)
              this.addEmployeeForm.password = null
              this.isShowLoading = false
            }
          }
        })
      } else {
        this.$refs.addEmployeeRef.validate(async (valid) => {
          if (valid) {
            this.addEmployeeForm.password = this.$md5(
              'LitterBear' + this.addEmployeeForm.password
            )
            const res = await this.$http.post(
              '/api/CreateOrgPersonnel',
              this.addEmployeeForm
            )
            if (res.data.result.code === 200) {
              this.getCurrentDate()
              this.innerVisible = false
              this.$message.success('员工编辑成功')
              this.getEmployeeList(this.employeeMan.id)
              this.isShowLoading = false
            } else {
              this.$message.error(res.data.result.msg)
              this.addEmployeeForm.password = ''
              this.isShowLoading = false
            }
          }
        })
      }
    },
    // 获取客户管理列表
    async getClientList () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        CompanyName: this.formInline.CompanyName,
        CompanyType: this.formInline.CompanyType,
        StartTime: this.formInline.dateTile && this.formInline.dateTile[0],
        EndTime: this.formInline.dateTile && this.formInline.dateTile[1]
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') delete fd[key]
      }
      const res = await this.$http.post('/api/CompanyManagementPage', fd)
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 员工管理预览头像
    handlePicEmployeePreview (file, fileList) {
      this.LogoUrl = file.url
    },
    // 上传头像
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
    // 选择头像
    changeUpload (file, fileList) {
      if (
        file.size >
        this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode
      ) {
        this.$message.error(
          '上传图片大小不能超过 ' +
            this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode / 1024 / 1024 +
            'MB'
        )
        fileList.pop()
        return false
      }
      if (file) {
        this.hide1Upload = true
      }
      this.file = file.raw
      this.fileList = fileList
      if (this.$_.size(fileList) > 1) {
        fileList.shift()
      }
    },
    // 打开合并
    openAddClient () {
      this.selectionList = this.$refs.tableRef.selection
      console.log(this.selectionList)
      this.mergeDialog = true
    },
    // 获取公司类型列表
    async getClientTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        switch (type) {
          case 'CompanyType':
            this.clientTypeList = res.data.result.item
            break
          case 'ExecutionWay':
            this.yearMonthDayList = res.data.result.item
            break
          case 'userAuditType':
            this.userAuditTypeList = res.data.result.item
            break
        }
      }
    },
    // 获取员工列表
    async getEmployeeList (id) {
      try {
        const res = await this.$http.post('/api/CompanyUserPage', {
          orgCompanyID: id,
          skipCount: this.employeeMan.currentPage,
          maxResultCount: this.employeeMan.pageSize
        })
        if (res.data.result.code === 200) {
          this.employeeList = res.data.result.item.items || []
          this.employeeMan.totalCount = res.data.result.item.totalCount
        } else {
          this.$message.error(res.data.result.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 客户管理列表调整每页几条
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getClientList()
    },
    // 客户管理列表分页
    currentChange (currentPage) {
      this.currentPage = currentPage
      this.getClientList()
    },
    // 查询
    search () {
      this.currentPage = 1
      this.getClientList()
    }
  },
  watch: {
  },
  mounted () {
    this.getClientList()
    this.getClientTypeList('userAuditType')
    this.getClientTypeList('CompanyType')
  },
  created () {}
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchForm{
    height: 100px;
    display: flex;
    align-content: center;
    justify-content: space-between;
    .searchItem{
        display: flex;
        align-items: center;
        .el-form-item{
            margin: 0;
        }
    }
}
.tableContent{
    .img{
        width: 60px;
        height: 60px;
    }
}
.el-radio{
    margin: 10px;
}
.el-date-editor{
  padding-left: 0;
  padding-right: 0;
}
</style>
