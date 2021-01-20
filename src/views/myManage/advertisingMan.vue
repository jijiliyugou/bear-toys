<template>
  <el-container class="productSearchIndex">
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="overflow:visible;">
    <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
      <div class="searchBox">
      <el-form :inline="true" :model="formInline" class="searchForms">
        <div class="filterForm">
            <el-form-item label="关键字查询">
            <el-input size="small"
              v-model="formInline.keyword"
              clearable
              placeholder="输入关键字"
              style="width: 90%;"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型查询">
            <el-select
            size="small"
              clearable
              v-model="formInline.adType"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, i) in adTypeList"
                :key="i"
                :label="item.enumName"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告位置查询">
            <el-select
            size="small"
              clearable
              v-model="formInline.adPosition"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, i) in adPositionList"
                :key="i"
                :label="item.enumName"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端查询">
            <el-select
            @clear="clearSelect"
            size="small"
              clearable
              v-model="formInline.platform"
              placeholder="请选择"
              style="width: 90%"
            >
              <el-option
                v-for="(item, i) in [{label: '全部', value: 'all'}, ...platFormList]"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btnList">
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button type="primary" size="small" @click="openAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableContent" v-if="tableData && tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="collecTable" :default-sort = "{prop: 'createdOn', order: 'descending'}">
        <el-table-column prop="img" label="广告图片">
          <template slot-scope="scope">
            <el-image
              fit="contain"
              class="myImage"
              :src="scope.row.img"
              :preview-src-list="[scope.row.img]"
            >
              <div slot="placeholder" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="adTitle" label="广告标题"></el-table-column>
        <el-table-column prop="adType" label="广告类型">
          <template slot-scope="scope">
            <template v-for="(item, i) in adTypeList">
              <el-tag disable-transitions :key="i" v-if="scope.row.adType === item.enumValue" :type="btnTypes[item.enumValue]">{{item.enumName}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="adType" label="广告位置">
          <template slot-scope="scope">
            <template v-for="(item, i) in adPositionList">
              <el-tag disable-transitions :key="i" v-if="scope.row.adPosition === item.enumValue" :type="btnTypes[item.enumValue]" effect="plain">{{item.enumName}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="公司类型">
          <template slot-scope="scope">
            <template v-for="(item, i) in clientTypeList">
              <el-tag disable-transitions :key="i" v-if="scope.row.roleName === item.itemCode" :type="btnTypes[i]" effect="plain">{{item.itemText}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="终端"></el-table-column>
        <el-table-column prop="link" label="广告地址"></el-table-column>
        <el-table-column prop="createdOn" label="时间" sortable>
          <template slot-scope="scope">
            {{ scope.row.createdOn && scope.row.createdOn.split('T')[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              title="确定要删除这条广告吗？"
              @onConfirm="handleDelete(scope.row)"
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
    <div class="zanwuxinxi" v-else></div>
    </div>
    <!-- 新增广告弹框 -->
    <el-dialog
    top="5vh"
    :title="dialogTitle"
      :visible.sync="showDialog"
      v-if="showDialog"
      lock-scroll
      :before-close="handleClose"
      class="addAdvertisingDialog"
      width="60%">
      <el-form :model="formDatas" :rules="addRules" ref="adverForm">
        <div class="formItems">
            <el-form-item label="广告类型：" prop="adType" :label-width="formLabelWidth">
              <el-select v-model="formDatas.adType" placeholder="请选择广告类型">
                <el-option v-for="(item, i) in adTypeList" :key="i" :label="item.enumName" :value="item.enumValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司类型：" prop="roleName" :label-width="formLabelWidth">
              <el-select v-model="formDatas.roleName" placeholder="请选择类型">
                <el-option v-for="(item, i) in clientTypeList" :key="i" :label="item.itemText" :value="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告终端：" prop="platform" :label-width="formLabelWidth">
              <el-select v-model="formDatas.platform" placeholder="请选择终端">
                <el-option v-for="(item, i) in platFormList" :key="i" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告位置：" prop="adPosition" :label-width="formLabelWidth">
              <el-select v-model="formDatas.adPosition" placeholder="请选择位置">
                <el-option v-for="(item, i) in adPositionList" :key="i" :label="item.enumName" :value="item.enumValue"></el-option>
              </el-select>
            </el-form-item>
        </div>
        <el-form-item label="广告标题：" prop="adTitle" :label-width="formLabelWidth">
          <el-input v-model="formDatas.adTitle" placeholder="请输入广告标题"></el-input>
        </el-form-item>
        <el-form-item label="广告内容：" v-if="formDatas.adType === 1" :prop="formDatas.adType === 1 && 'content'" :label-width="formLabelWidth">
          <quill-editor ref="myQuillEditor" v-model="formDatas.content" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
        </el-form-item>
        <el-form-item label="广告图片：" v-else :prop="formDatas.adType === 0 && 'img'" :label-width="formLabelWidth">
          <div style="border:1px solid #DCDFE6;padding:10px;border-radius:5px;">
            <el-upload
            class="uploadImg"
              action="/api/File/InsertPic"
              :http-request="successUpload"
              :on-change="changeUpload"
              :auto-upload="false"
              list-type="picture-card"
              :accept="globalJson[0].itemCode+','+globalJson[3].itemCode"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="editImages">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogImgVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
        <el-form-item label="广告链接：" :label-width="formLabelWidth">
          <el-input v-model="formDatas.link" placeholder="请输入广告链接"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" :label-width="formLabelWidth">
          <el-input v-model="formDatas.sort" placeholder="请输入广告排序"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="formDatas.remark" placeholder="请输入广告备注"></el-input>
        </el-form-item>
      </el-form>
      <center>
        <el-button type="primary" @click="subAddAdForm">保存</el-button>
        <el-button type="danger" @click="closeDialog">关闭</el-button>
      </center>
      <el-upload
      style="width:0;height:0;overflow: hidden;"
      class="uploadQuill"
      action="/api/File/InsertPic"
      :http-request="successUpload"
      :on-change="changeUploadQuill"
      :auto-upload="false"
      list-type="picture-card"
      :accept="globalJson[0].itemCode+','+globalJson[3].itemCode"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="editImages">
      <i class="el-icon-plus"></i>
      </el-upload>
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
// 这里引入修改过的video模块并注册
import Quill from 'quill'
import Video from '@/quill/video'
Quill.register(Video, true)
export default {
  components: { bsTop, bsFooter },
  data () {
    // 富文本配置
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['image'],
      ['video'],
      ['clean'] // remove formatting button
    ]
    return {
      globalJson: this.$store.state.globalJson.Json.NoticeRestrictions,
      mediaType: null,
      clientTypeList: [],
      btnTypes: ['primary', 'success', 'danger', 'warning', 'info'],
      urlHeader: process.env.NODE_ENV === 'production' ? 'http://img.toysbear.com/' : 'http://139.9.71.135:8087/',
      adTypeList: [],
      editImages: [],
      platFormList: [{ label: 'PC', value: 'PC' }, { label: 'iOS', value: 'iOS' }, { label: 'Android', value: 'Android' }],
      adPositionList: [],
      dialogImageUrl: null,
      dialogImgVisible: false,
      formLabelWidth: '100px',
      showDialog: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      dialogTitle: '新增广告',
      formDatas: {
        adType: 1,
        roleName: null,
        adPosition: null,
        platform: null,
        adTitle: null,
        content: null,
        img: null,
        link: null,
        sort: null,
        remark: null
      },
      formInline: {
        keyword: '',
        platform: 'all',
        adPosition: null,
        adType: null

      },
      editorOption: {
        placeholder: '请输入广告内容',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // eslint-disable-next-line quote-props
              'image': function (value) {
                console.log(document.querySelector('.uploadQuill input').click())
              },
              // eslint-disable-next-line quote-props
              'video': function (value) {
                console.log(document.querySelector('.uploadQuill input').click())
              }
            }
          }
        }
      },
      addRules: {
        adType: [
          { required: true, message: '请选择广告类型', trigger: 'change' }
        ],
        adPosition: [
          { required: true, message: '请选择广告位置', trigger: 'change' }
        ],
        platform: [
          { required: true, message: '请选择广告终端', trigger: 'change' }
        ],
        adTitle: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { min: 1, max: 99, message: '请输入 1-99 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '广告内容为必填项', trigger: 'blur' }
        ],
        img: [
          {
            required: true,
            validator: (rule, value, cb) => {
              if (value) {
                cb()
              } else {
                this.$message.error('请选择广告logo')
                cb(new Error('请选择广告logo'))
              }
            }
          }
        ],
        sort: [
          { required: true, message: '请输入广告排序', trigger: 'blur' },
          {
            validator: (rule, value, cb) => {
              if (/^\d+$/.test(value)) {
                cb()
              } else {
                cb(new Error('请输入数字'))
              }
            }
          }
        ]
      },
      tableData: []
    }
  },
  methods: {
    // 选择视频
    onEditorChange () { },
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
    // 清空终端下拉事件
    clearSelect () {
      this.formInline.platform = 'all'
    },
    // 打开编辑
    openEdit (row) {
      this.formDatas = {
        adType: null,
        roleName: null,
        adPosition: null,
        platform: null,
        adTitle: null,
        content: null,
        img: null,
        link: null,
        sort: null,
        remark: null
      }
      this.dialogTitle = '编辑广告'
      this.editImages = []
      for (const key in this.formDatas) {
        this.formDatas[key] = row[key]
      }
      this.formDatas.img && (this.editImages[0] = { url: this.formDatas.img })
      this.formDatas.id = row.id
      this.showDialog = true
    },
    // 删除
    async handleDelete (row) {
      const res = await this.$http.post('/api/DeleteAdvertisement', row)
      if (res.data.result.code === 200) {
        this.$message.success('删除广告成功')
        this.getAdvertisementPage()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 上传广告图片
    async successUpload (file) {
      const fd = new FormData()
      fd.append('BusinessType', 'Ad')
      fd.append('file', file)
      return await this.$http.post('/api/File/InsertPic', fd)
    },
    // 提交新增广告
    subAddAdForm () {
      this.$refs.adverForm.validate(async valid => {
        if (valid) {
          const url = (this.dialogTitle === '新增广告') ? '/api/CreateAdvertisement' : '/api/UpdateAdvertisement'
          const res = await this.$http.post(url, this.formDatas)
          if (res.data.result.code === 200) {
            const msg = (this.dialogTitle === '新增广告') ? '新增广告成功' : '编辑广告成功'
            this.$message.success(msg)
            this.getAdvertisementPage()
            this.showDialog = false
          } else {
            this.$message.error(res.data.result.msg)
          }
        }
      })
    },
    // 获取广告类型
    async getAdTypeList () {
      const res = await this.$http.post('/api/GetAdTypeList')
      if (res.data.result.code === 200) {
        this.adTypeList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取广告位置
    async getAdPositionList () {
      const res = await this.$http.post('/api/GetAdPositionList')
      if (res.data.result.code === 200) {
        this.adPositionList = res.data.result.item
        console.log(this.adPositionList)
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 富文本选图
    async changeUploadQuill (file, fileList) {
      const list = file.name.split('.')
      if (this.globalJson[0].itemCode.includes(list[list.length - 1].toUpperCase())) {
        if (file.size > this.globalJson[5].itemCode) {
          this.$message.error(
            '上传图片大小不能超过 ' +
              this.globalJson[5].itemCode / 1024 / 1024 +
              'MB'
          )
          fileList.pop()
          return false
        }
      } else if (this.globalJson[3].itemCode.includes(list[list.length - 1].toUpperCase())) {
        if (file.size > this.globalJson[1].itemCode) {
          this.$message.error(
            '上传视频大小不能超过 ' +
              this.globalJson[1].itemCode / 1024 / 1024 +
              'MB'
          )
          fileList.pop()
          return false
        }
      }
      try {
        const res = await this.successUpload(file.raw)
        if (res.data.result.code === 200) {
          const result = this.urlHeader + res.data.result.object[0].filePath
          const quill = this.$refs.myQuillEditor.quill
          console.log(result)
          // 获取光标所在位置
          const pos = quill.selection.savedRange.index
          // 插入图片到光标位置 | 插入视频到光标位置
          if (this.globalJson[0].itemCode.includes(list[list.length - 1].toUpperCase())) {
            quill.insertEmbed(pos, 'image', result)
          } else {
            quill.insertEmbed(pos, 'video', result)
          }
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error(res.data.result.msg)
          fileList.pop()
        }
      } catch (error) {
        console.log(error)
        fileList.pop()
      }
    },
    // 选择图片校验大小
    async changeUpload (file, fileList) {
      if (this.globalJson[0].itemCode.includes(file.raw.type.split('/')[1].toUpperCase())) {
        if (file.size > this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode) {
          this.$message.error(
            '上传图片大小不能超过 ' +
            this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode / 1024 / 1024 +
            'MB'
          )
          fileList.pop()
          return false
        }
      } else if (this.globalJson[3].itemCode.includes(file.raw.type.split('/')[1].toUpperCase())) {
        if (file.size > this.$store.state.globalJson.Json.NoticeRestrictions[1].itemCode) {
          this.$message.error(
            '上传图片大小不能超过 ' +
            this.$store.state.globalJson.Json.NoticeRestrictions[1].itemCode / 1024 / 1024 +
            'MB'
          )
          fileList.pop()
          return false
        }
      }
      if (fileList.length > 1) {
        fileList.shift()
      }
      try {
        const res = await this.successUpload(file.raw)
        if (res.data.result.code === 200) {
          this.formDatas.img = res.data.result.object[0].filePath
        } else {
          this.$message.error(res.data.result.msg)
          fileList.pop()
        }
      } catch (error) {
        console.log(error)
        fileList.pop()
      }
    },
    // 查看大图
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogImgVisible = true
    },
    handleRemove (file, fileList) {
      this.formDatas.img = null
    },
    // 关闭弹框前要干啥
    closeDialog () {
      this.showDialog = false
    },
    // 关闭弹框前要干啥
    handleClose () {
      this.showDialog = false
    },
    // 打开新增广告
    openAdd () {
      this.dialogTitle = '新增广告'
      this.formDatas = {
        adType: 1,
        adPosition: null,
        platform: null,
        adTitle: null,
        content: null,
        img: null,
        link: null,
        sort: null,
        remark: null
      }
      this.editImages = []
      this.showDialog = true
    },
    // 获取广告列表
    async getAdvertisementPage () {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        adType: this.formInline.adType,
        keyword: this.formInline.keyword,
        platform: this.formInline.platform,
        adPosition: this.formInline.adPosition
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === '') {
          delete fd[key]
        }
      }
      const res = await this.$http.post('/api/GetAdvertisementPage', fd)
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        this.tableData = res.data.result.item.items
      }
    },
    search () {
      this.currentPage = 1
      this.getAdvertisementPage()
    },
    // 分页
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getAdvertisementPage()
    },
    // 分页条数
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return false
      this.getAdvertisementPage()
    }
  },
  mounted () {
    this.getAdTypeList()
    this.getAdPositionList()
    this.getAdvertisementPage()
    this.getClientTypeList('CompanyType')
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.ql-video{
  width: 100%;
  height: 300px;
}
.searchForms{
  display: flex;
  justify-content: space-between;
}
.addAdvertisingDialog{
  .formItems{
    display: flex;
    justify-content: space-between;
  }
}
@{deep} .ql-container{
  height: 300px;
  .ql-editor{
    height: 300px;
  }
}
@{deep} .el-upload-list__item {
  transition: none !important;
}
.tableContent{
  .myImage{
    width: 80px;
    height: 80px;
    img {
       width: 100%;
       height: 100%;
    }
  }
}
.filterForm{
  @{deep} .el-form-item__content {
    width: 150px;
  }
}
</style>
