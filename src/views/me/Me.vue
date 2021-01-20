<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
    <el-card class="wrap">
      <ul class="myInfo" v-if="meInfo">
        <li class="logo">
          <el-image
            :src="meInfo && meInfo.companyLogo"
            class="myAvatar"
            fit="cover"
          >
            <div
              slot="error"
              class="image-slot"
              style="width:100%;height:100%;backgroundColor:#165af7;color:#fff;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
            >
              {{ meInfo.companyName }}
            </div>
          </el-image>
          <input
            type="file"
            ref="uploadLogo"
            accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
            @change="changeLogo"
            class="uploadLogo"
          />
        </li>
        <li class="companyInfo">
          <p>
            <span class="title">公司名称：</span>
            <el-input
              type="text"
              placeholder="请输入公司名称"
              v-model="meInfo.companyName"
              maxlength="15"
              minlength="1"
            ></el-input>
          </p>
          <p>
            <span class="title">邮箱地址：</span>
            <el-input
              type="email"
              placeholder="请输入邮箱"
              v-model="meInfo.e_mail"
              maxlength="30"
              minlength="1"
              show-word-limit
            ></el-input>
          </p>
          <p>
            <span class="title">电话号码：</span>
            <el-input
              type="number"
              placeholder="请输入电话号码"
              v-model="meInfo.phoneNumber"
              oninput="if(value.length>14)value=value.slice(0,14)"
              show-word-limit
            ></el-input>
          </p>
          <p>
            <span class="title">联系地址：</span>
            <el-input
              type="textarea"
              placeholder="请输入联系地址"
              style="overflow-x:hidden;overflow-y:hidden;"
              autosize
              resize="none"
              v-model="meInfo.address"
              autocomplete="off"
              maxlength="99"
              minlength="1"
            ></el-input>
          </p>
        </li>
      </ul>
      <div class="employeeManage" v-if="meInfo">
        <p class="title">员工管理</p>
        <div class="employList">
          <li class="listItem" v-for="(item, i) in meInfo.personnels" :key="i">
            <el-image
              @click.native="openAddEmploee(1, item)"
              :src="item.userImage"
              class="myAvatar"
              fit="cover"
            >
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
              >
                {{ item.linkman }}
              </div>
            </el-image>
            <el-tag
              closable
              @click="openAddEmploee(1, item)"
              @close="deleteEmploee(item)"
              style
              >{{ item.linkman }}</el-tag
            >
          </li>
          <i @click="openAddEmploee" class="el-icon-circle-plus addIcon"></i>
        </div>
      </div>
      <center style="margin-top:50px;">
        <el-button type="primary" style="width:100px;" @click="editEmployee"
          >保存</el-button
        >
      </center>
    </el-card>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPassForm.dialogPass"
      destroy-on-close
      width="25%"
    >
      <el-form
        ref="passForm"
        :model="dialogPassForm"
        label-width="100px"
        :rules="passRules"
      >
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="dialogPassForm.pass"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="testPass">
          <el-input
            show-password
            type="password"
            v-model="dialogPassForm.testPass"
            :disabled="$_.size(dialogPassForm.pass) < 6"
          ></el-input>
        </el-form-item>
      </el-form>
      <center slot="footer" class="dialog-footer">
        <el-button @click="dialogPassForm.dialogPass = false">取 消</el-button>
        <el-button type="primary" @click="editPass">确 定</el-button>
      </center>
    </el-dialog>
    <!-- 嵌套新增员工 -->
    <el-dialog
      width="50%"
      :title="employeeTitle"
      :visible.sync="addEmployeeDialog"
      destroy-on-close
      append-to-body
    >
      <el-form :model="addEmployeeForm" ref="addEmployeeRef" :rules="addRules">
        <el-form-item label="员工头像" label-width="100px" prop="userImage">
          <el-upload
            :action="baseAPI + '/api/File/InsertPic'"
            list-type="picture-card"
            ref="upload"
            :auto-upload="false"
            :on-change="changeUpload"
            :on-preview="handlePictureCardPreview"
            :http-request="successUpload"
            :file-list="editImages"
            accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogUpload" destroy-on-close :modal="false">
            <img width="100%" :src="LogoUrl" alt />
          </el-dialog>
        </el-form-item>

        <div class="flexLayout">
          <el-form-item label="员工账号" label-width="100px" prop="phoneNumber">
            <el-input
              v-model="addEmployeeForm.phoneNumber"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" label-width="100px" prop="linkman">
            <el-input v-model="addEmployeeForm.linkman"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            v-if="employeeTitle === '编辑员工'"
            label-width="100px"
          >
            <el-input v-model="addEmployeeForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-else label-width="100px" prop="password">
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
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input type="textarea" v-model="addEmployeeForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" @click="addEmployee">保存</el-button>
        <el-button type="danger" @click="addEmployeeDialog = false"
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dialogPassForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isEdit: false,
      addEmployeeDialog: false,
      employeeTitle: '',
      editImages: [], // 编辑员工时的头像预览
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
        linkman: null,
        CompanyId: null,
        newPassword: null // 编辑时的密码
      },
      dialogPassForm: {
        dialogPass: false,
        pass: null,
        testPass: ''
      },
      logoFile: null,
      currentPage: 1,
      pageSize: 10,
      meInfo: null,
      fit: 'contain',
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      passRules: {
        // 修改密码验证规则
        pass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请输入最少6位数密码', trigger: 'blur' }
        ],
        testPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      addRules: {
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
          { min: 1, max: 15, message: '请输入1-15个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, max: 20, message: '最少输入6到20个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择员工性别', trigger: 'change' }],
        isMain: [
          { required: true, message: '请选择是否主账号', trigger: 'change' }
        ],
        enabled: [
          { required: true, message: '请选择是否激活', trigger: 'change' }
        ]
      },
      LogoUrl: '',
      dialogUpload: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    // 获取个人信息中的个人信息和员工列表
    async getCompanyUserList () {
      const res = await this.$http.post('/api/CompanyUserList', {
        orgCompanyID: this.userInfo.commparnyList[0].commparnyId
      })
      if (res.data.result.code === 200) {
        this.meInfo = res.data.result.item
      }
    },
    // 上传头像
    async uploadLogo () {
      const fb = new FormData()
      fb.append('BusinessType', 'Logo')
      fb.append('file', this.logoFile)
      return await this.$http.post('/api/File/InsertPic', fb)
    },
    // 保存修改
    async editEmployee () {
      this.$confirm('确定要保存以上的修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (/^blob:/.test(this.meInfo.companyLogo)) {
            const res = await this.uploadLogo(this.companyInfo)
            if (res.data.result.code === 200) {
              this.meInfo.companyLogo = res.data.result.object[0].filePath
            }
          }
          const res = await this.$http.post('/api/UpdateOrgCompany', this.meInfo)
          this.getCompanyUserList()
        })
        .catch(() => {
          this.$refs.uploadLogo.value = ''
          this.getCompanyUserList()
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        })
    },
    // 选择头像
    changeLogo (e) {
      this.logoFile = e.target.files[0]
      this.meInfo.companyLogo = URL.createObjectURL(this.logoFile)
    },
    // 修改密码
    editPass () {
      this.$refs.passForm.validate(async valid => {
        if (valid) {
          this.userInfo.userInfo.password = this.$md5(
            'LitterBear' + this.dialogPassForm.pass
          )
          const res = await this.$http.post(
            '/api/UpdateOrgPersonnel',
            this.userInfo.userInfo
          )
          if (res.data.result.code === 200) {
            this.dialogPassForm.dialogPass = false
            this.$message.success('修改密码成功')
          } else {
            this.$message.error('修改密码失败')
          }
        } else {
          return false
        }
      })
    },
    // 打开添加员工
    openAddEmploee (code, row) {
      console.log(row)
      this.editImages = []
      if (row) {
        this.isEdit = true
        this.employeeTitle = '编辑员工'
        for (const key in this.addEmployeeForm) {
          this.addEmployeeForm[key] = row[key]
        }
        row.userImage && (this.editImages[0] = { url: row.userImage })
        this.addEmployeeForm.id = row.id
        this.addEmployeeDialog = true
      } else {
        this.isEdit = false
        this.employeeTitle = '新增员工'
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
          linkman: null,
          CompanyId: null,
          newPassword: null // 编辑时的密码
        }
        this.getCurrentDate()
        this.addEmployeeDialog = true
      }
    },
    // 添加员工
    async addEmployee () {
      this.addEmployeeForm.CompanyId = this.meInfo.id
      const imgRes = await this.successUpload()
      if (imgRes.data.result.code === 200) {
        this.addEmployeeForm.userImage =
          imgRes.data.result.object[0] && imgRes.data.result.object[0].filePath
            ? imgRes.data.result.object[0].filePath
            : this.addEmployeeForm.userImage
      }

      if (this.isEdit) {
        this.$refs.addEmployeeRef.validate(async valid => {
          if (valid) {
            this.addEmployeeForm.password = this.addEmployeeForm.newPassword
              ? this.$md5('LitterBear' + this.addEmployeeForm.newPassword)
              : this.addEmployeeForm.password
            const res = await this.$http.post(
              '/api/UpdateOrgPersonnel',
              this.addEmployeeForm
            )
            if (res.data.result.code === 200) {
              this.addEmployeeDialog = false
              this.$message.success(this.employeeTitle + '成功')
              this.getCurrentDate()
              this.getCompanyUserList()
            } else {
              this.$message.error(res.data.result.msg)
              this.addEmployeeForm.password = ''
            }
          }
        })
      } else {
        this.$refs.addEmployeeRef.validate(async valid => {
          if (valid) {
            this.addEmployeeForm.password = this.$md5(
              'LitterBear' + this.addEmployeeForm.password
            )
            const res = await this.$http.post(
              '/api/CreateOrgPersonnel',
              this.addEmployeeForm
            )
            if (res.data.result.code === 200) {
              this.addEmployeeDialog = false
              this.$message.success('新增员工成功')
              this.getCurrentDate()
              this.getCompanyUserList()
            } else {
              this.$message.error(res.data.result.msg)
              this.addEmployeeForm.password = ''
            }
          }
        })
      }
    },
    errorHandler () {
      return true
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
    // 删除员工
    async deleteEmploee (row) {
      if (row.isMain) {
        this.$message.error('不能删除主账号')
        return
      }
      this.$confirm('确定要删除该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.post('/api/DeleteCompanyUser', {
            OrgCompanyID: this.meInfo.id,
            OrgPersonnelID: row.id
          })
          if (res.data.result.code === 200) {
            this.$message.success('删除成功')
            this.getCompanyUserList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 选择头像
    changeUpload (file, fileList) {
      this.file = file.raw
      this.fileList = fileList
      if (this.$_.size(fileList) > 1) {
        fileList.shift()
      }
    },
    // 预览头像
    handlePictureCardPreview (file, fileList) {
      this.LogoUrl = file.url
      this.dialogUpload = true
    },
    // 上传头像
    async successUpload () {
      const fd = new FormData()
      fd.append('BusinessType', 'Head')
      fd.append('file', this.file)
      return await this.$http.post('/api/File/InsertPic', fd)
    }
  },
  mounted () {
    this.getCompanyUserList()
    this.getCurrentDate()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.wrap {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .myInfo {
    display: flex;
    border: 1px solid #aaa;
    padding: 20px 50px;
    font-size: 14px;
    .logo {
      position: relative;
      .myAvatar {
        width: 100px;
        transition: all 1s;
        height: 100px;
        border-radius: 50%;
      }
      .uploadLogo {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        opacity: 0;
      }
      &:hover {
        @{deep} .myAvatar {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
    li {
      margin: 20px;
      &.companyInfo {
        flex: 1;
        font-size: 14px;
        font-family: "Microsoft Yahei";
        display:flex;
        flex-direction: column;
        p {
          display: flex;
          align-items: center;
          .title{
            min-width:70px;
          }
          @{deep} .el-input {
            font-size: 14px;
            input.el-input__inner {
              border: none;
              outline: none;
              -webkit-appearance: none;
              -moz-appearance: textfield;
              font-size: 14px;
              font-family: "Microsoft Yahei";
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
            input[type="number"] {
              -moz-appearance: textfield;
            }
          }
          @{deep} .el-textarea{
            .el-textarea__inner{
              border: none;
              outline: none;
              font-size: 14px;
              font-family: "Microsoft Yahei";
            }
          }
        }
      }
      .EditPass:hover {
        color: #5cb6ff;
      }
    }
  }
  .employeeManage {
    border: 1px solid #aaa;
    border-top: none;
    min-height: 200px;
    p.title {
      padding: 20px 5px;
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    .employList {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 0 20px;
      .listItem {
        display: flex;
        align-items: center;
        margin: 5px 10px;
        cursor: pointer;
        .myAvatar {
          transition: all 1s;
          width: 30px;
          height: 30px;
          background-color: #165af7;
          color: white;
          border-radius: 50%;
        }
        em {
          margin-left: 5px;
        }
        &:hover {
          @{deep} .myAvatar {
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
          }
        }
      }
      .addIcon {
        font-size: 30px;
        color: #aaa;
        margin: 5px 10px;
        cursor: pointer;
        &:hover {
          color: #5cb6ff;
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
  }
}
.flexLayout {
  display: flex;
  justify-content: space-between;
}
@{deep} .el-upload-list__item {
  // 上传组件动画效果
  transition: none !important;
}
</style>
