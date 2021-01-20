<template>
  <div style="background-color:#2468a9;">
    <el-row style="height:60px;overflow: hidden;maxWidth:1200px;minWidth:1024px;margin:0 auto;" :gutter="0">
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
        <div class="grid-content bg-purple-light grid-content-top">
          <img @click="toHome" style="vertical-align:top;" src="~@/assets/images/bsLogo.png" alt />
        </div>
      </el-col>
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="grid-content bg-purple-light grid-content-top">
          <el-menu
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#2468a9"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true">
            <a style="color:#fff;cursor: pointer;" @click="toHome" class="hidden-md-and-down">小竹熊首页</a>
            <el-menu-item index="/meInfo/infoList">我的消息</el-menu-item>
            <el-menu-item index="/orderManage">订单管理</el-menu-item>
            <template v-for="(item, i) in menuList">
              <el-submenu :index="item.linkUrl" :key="i" v-if="item.children" popper-class="menuItems">
                <template slot="title">
                  <el-upload
                    :auto-upload="false"
                    v-if="item.linkUrl === '/productSearch'"
                    ref="uploadRef"
                    accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
                    class="upload-demo"
                    :action="baseAPI + '/api/File/SearchPicture'"
                    :headers="headers"
                    :data="{
                      companynumber:
                        $store.state.userInfo &&
                        $store.state.userInfo.commparnyList &&
                        $store.state.userInfo.commparnyList[0] &&
                        $store.state.userInfo.commparnyList[0].companyNumber
                    }"
                    :show-file-list="false"
                    :on-progress="showLoading"
                    :on-change="changeUpload"
                  >
                    <i class="el-icon-camera-solid imgSearch"></i>
                  </el-upload>
                  {{ item.name }}
                </template>
                <el-menu-item
                  popper-class="menuItems"
                  v-for="(child, index) in item.children"
                  :index="child.linkUrl"
                  :key="index"
                  >{{ child.name }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item :index="item.linkUrl" v-else :key="item.id">
                <template v-if="item.linkUrl === '/productSearch'">
                  <el-upload
                    :auto-upload="false"
                    ref="uploadRef"
                    accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
                    class="upload-demo"
                    :action="baseAPI + '/api/File/SearchPicture'"
                    :headers="headers"
                    :data="{
                      companynumber:
                        $store.state.userInfo &&
                        $store.state.userInfo.commparnyList &&
                        $store.state.userInfo.commparnyList[0] &&
                        $store.state.userInfo.commparnyList[0].companyNumber
                    }"
                    :show-file-list="false"
                    :on-progress="showLoading"
                    :on-change="changeUpload"
                  >
                    <i class="el-icon-camera-solid imgSearch"></i>
                  </el-upload>
                </template>
                {{ item.name }}
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" style="background-color: #2468a9;">
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#2468a9"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="4" popper-class="menuItems">
            <template slot="title">个人中心</template>
            <div class="menuItems">
              <el-menu-item index="/me">账号管理</el-menu-item>
              <li class="signOut" @click="SignOut">登出</li>
            </div>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
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
  components: {
    VueCropper: VueCropper
  },
  data () {
    return {
      baseImg: null,
      fileinfo: null,
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
      },
      picsList: [], // 页面显示的数组
      // 防止重复提交
      loading: false,
      // 显示裁剪框
      isShowCropper: false,
      activeIndex2: '1',
      dialogVisible: false,
      headers: {
        Utoken:
          this.$store.state.userInfo && this.$store.state.userInfo.accessToken
      },
      menuList: []
    }
  },
  methods: {
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
        // 将剪裁后base64的图片转化为file格式
        // let file = this.dataURLtoFile(
        //   data,this.fileinfo.uid

        // );
        // 上传
        try {
          const companynumber =
          this.$store.state.userInfo.commparnyList[0] &&
          this.$store.state.userInfo.commparnyList[0].companyNumber
          const fd = new FormData()
          fd.append('companynumber', companynumber)
          fd.append('file', file)
          const res = await this.$http.post('/api/File/SearchPicture', fd)
          this.cropperCancel()
          if (res.data.result.code === 200) {
            this.$store.commit('searchValues', res.data.result.object)
          } else {
            this.$store.commit('searchValues', null)
            this.$message.error(res.data.result.message)
          }
          this.$router.push('/searchIndex')
        } catch (error) {
          this.cropperCancel()
        }
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
      // return new File([u8arr], filename + "." + mime.split("/")[1], {
      //   type: mime
      // });
      // 转换成成blob对象
      // return new Blob([u8arr],{type:mime});
    },
    // 选取图片 限制图片大小
    changeUpload (file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 3
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 3MB!')
        this.option.img = ''
        this.$refs.uploadRef.value = ''
        return false
      }
      this.isShowCropper = true
      this.fileinfo = file
      // 选择成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(file.raw)
        this.baseImg = this.option.img = f
        this.dialogVisible = true
      })
    },
    // 图片搜索时太慢，显示loading
    showLoading () {
      this.$store.commit('updateAppLoading', true)
    },
    handleSelect (key, keyPath) {},
    // 登出
    SignOut () {
      this.$confirm('确定要退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$router.push({ name: 'Login', query: { id: 'signOut' } })
          // location =
          //   "http://127.0.0.1:8080/#/beforeIndex/login?id=signOut"
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登出'
          })
        })
    },
    // 关闭
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 去主页
    toHome (e) {
      const href = this.$router.resolve('/beforeIndex/home')
      window.open(href.href, '_blank')
      // window.open("http://127.0.0.1:8080/#/beforeIndex/home", "_blank");
    }
  },
  mounted () {
    this.menuList = this.$store.state.routers.map(val => {
      val.parent.children = val.children
      return val.parent
    })
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.grid-content-top {
  background-color: #2468a9;
  box-sizing: border-box;
  height: 60px;
  img {
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
}
.el-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .toHome {
    color: white;
    display: block;
    height: 60px;
    line-height: 60px;
    margin: 0;
    padding: 0 20px;
    box-sizing: border-box;
    &:hover {
      background-color: rgb(29, 83, 135);
    }
  }
}
.upload-demo {
  position: absolute;
  right: -30px;
  .imgSearch {
    color: black;
    font-size: 24px;
    &:hover {
      color: white;
    }
  }
}
ul.el-menu-demo.el-menu--horizontal.el-menu {
  width: 100%;
}
.grid-content.bg-purple-light.grid-content-top,
.grid-content.bg-purple.grid-content-top {
  height: 60px;
}
.menuItems {
  .signOut {
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    font-size: 14px;
    color: rgb(255, 255, 255);
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      background-color: rgb(29, 83, 135);
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
