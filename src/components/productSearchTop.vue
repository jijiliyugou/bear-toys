<template>
  <div class="bsSearchTopBox">
    <div class="bsSearch">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        v-model="$store.state.searchValue"
        style="width:300px;"
        @keyup.enter.native="toSearchIndex"
      >
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          accept=".jpg, .jpeg, .png, .ico, .bmp, , .JPG, .JPEG, .PNG, .ICO, .BMP"
          slot="suffix"
          class="upload-demo"
          :action="baseAPI + '/api/File/SearchPicture'"
          :data="{
            companynumber:
              this.$store.state.userInfo &&
              this.$store.state.userInfo.commparnyList &&
              this.$store.state.userInfo.commparnyList[0].companyNumber
          }"
          :headers="headers"
          :show-file-list="false"
          :on-success="successUpload"
          :on-progress="showLoading"
          :on-change="changeUpload"
        >
        <i @click.stop.prevent="clearSearch" v-show="$store.state.searchValue" class="el-input__icon el-icon-circle-close el-input__clear"></i>
          <i class="el-input__icon el-icon-camera-solid myCamera"></i>
        </el-upload>
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="toSearchIndex"
        >查询产品</el-button
      >
      <el-button
        type="primary"
        v-show="!showColl"
        icon="el-icon-star-off"
        @click="$router.push({ path: '/collect' })"
        >我的收藏夹</el-button
      >
    </div>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="isShowCropper" top="0px" destroy-on-close append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :canScale='option.canScale'
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :mode="option.mode"
          ></vueCropper>
        </div>
      </div>
      <center slot="footer" class="dialog-footer">
        <el-button type="info" @click="cropperCancel">取 消</el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-left"
          @click="$refs.cropper.rotateLeft()"
          >左 旋 转</el-button
        >
        <el-button
          type="primary"
          class="el-icon-refresh-right"
          @click="$refs.cropper.rotateRight()"
          >右 旋 转</el-button
        >
        <el-button type="success" @click="onCubeImg" :loading="loading"
          >确认</el-button
        >
      </center>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  props: {
    showColl: Boolean,
    parentEl: String
  },
  components: {
    VueCropper: VueCropper
  },
  data () {
    return {
      baseImg: null,
      loading: false,
      fileinfo: null,
      isShowCropper: false,
      headers: {
        Utoken:
          this.$store.state.userInfo && this.$store.state.userInfo.accessToken
      },
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        full: false, // 是否输出原图比例的截图
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 1000, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [2, 1], // 截图框的宽高比例
        canMove: true, // 图片是否可移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    }
  },
  computed: {
  },
  methods: {
    // 清空搜索框
    clearSearch () {
      this.$store.commit('searchTxtValues', null)
    },
    // 确定裁剪图片
    onCubeImg () {
      this.loading = true
      this.$store.commit('searchTxtValues', null)
      this.showLoading()
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropBlob(async file => {
        const urlPreView = window.URL.createObjectURL(file)
        this.option.img = urlPreView
        this.$store.commit('handlerBeforeSearchImgPreview', { img: urlPreView, baseImg: this.baseImg })
        // 上传
        const companynumber =
          this.$store.state.userInfo &&
          this.$store.state.userInfo.commparnyList &&
          this.$store.state.userInfo.commparnyList[0] &&
          this.$store.state.userInfo.commparnyList[0].companyNumber
        const fd = new FormData()
        fd.append('companynumber', companynumber)
        fd.append('file', file)
        const res = await this.$http.post('/api/File/SearchPicture', fd)
        this.cropperCancel()
        if (res.data.result.code === 200) {
          if (this.parentEl === 'hotRecommend') {
            this.$store.commit('handlerhotSearchImg', res.data.result.object)
            this.$root.eventHub.$emit('toHotRecommend')
          } else {
            this.$store.commit('searchValues', res.data.result.object)
            this.$root.eventHub.$emit('toSearchIndex')
          }
        } else {
          this.$store.commit('clearSearch')
          this.$message.error(res.data.result.message)
        }
        this.$router.push('/' + this.parentEl)
        this.$store.commit('updateAppLoading', false)
      })
    },
    // 取消裁剪
    cropperCancel () {
      this.$refs.cropper.clearCrop()
      this.isShowCropper = false
      this.option.img = ''
      this.loading = false
      this.$refs.uploadRef.value = ''
    },
    // 将base64转换为文件对象
    dataURLtoFile (dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      // 转换成file对象
      return new File([u8arr], filename + '.' + mime.split('/')[1], {
        type: mime
      })
      // 转换成成blob对象
      // return new Blob([u8arr],{type:mime});
    },
    // 选取图片 限制图片大小
    changeUpload (file, fileList) {
      this.$store.commit('searchTxtValues', '')
      const isLt5M = file.size / 1024 / 1024 < 3
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 3MB!')
        this.option.img = ''
        this.$refs.uploadRef.value = ''
        return false
      }
      this.isShowCropper = true
      this.fileinfo = file
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(file.raw)
        this.baseImg = this.option.img = f
        this.dialogVisible = true
      })
    },
    toSearchIndex () {
      if (this.parentEl === 'hotRecommend') {
        this.$root.eventHub.$emit('toHotRecommend')
      } else {
        this.$root.eventHub.$emit('toSearchIndex')
      }
      this.$router.push({ name: this.parentEl || 'searchIndex' })
    },
    // 图片搜索时太慢，显示loading
    showLoading () {
      this.$store.commit('updateAppLoading', true)
    },
    successUpload (response, file, fileList) {
      if (response.result.code === 200) {
        this.$store.commit('searchValues', response.result.object)
      } else {
        this.$store.commit('searchValues', [])
      }
      this.$router.push({ name: (this.parentEl || 'searchIndex') })
      this.$store.commit('updateAppLoading', false)
    }
  }
}
</script>

<style lang="less" scoped>
.bsSearchTopBox{
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .bsSearch {
  text-align: center;
  margin: 30px 0;
  .myCamera {
    color: black;
    font-size: 22px;
    cursor: pointer;
  }
  .el-input__clear{
    vertical-align: top;
  }
  }
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
