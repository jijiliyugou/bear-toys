/* eslint-disable vue/require-v-for-key */
<template>
  <div class="home">
    <div class="homeBox">
      <div class="downloadCode">
        <div class="downloadContent">
          <div style="flex: 1">
            <div class="left" v-show="$route.path === '/beforeIndex/login'">
              <el-image
                :src="require('@/assets/images/erpLogo.png')"
                fit="contain"
              ></el-image>
              <div class="welcome">欢迎登录</div>
            </div>
          </div>
          <div class="right">
            <div class="code">
              <el-image
                :src="require('@/assets/images/ErWeiMa.png')"
                fit="contain"
              ></el-image>
              <p class="text">小竹熊app下载</p>
            </div>
          </div>
        </div>
      </div>
      <div class="searchBox">
        <el-image
          class="searchImg"
          :src="require('@/assets/images/inputLogo.png')"
          fit="contain"
        ></el-image>
        <h1 class="title">小竹熊云科技</h1>
        <div class="inputBox">
          <el-input
            @keyup.enter.native="subSearch"
            clearable
            placeholder="请输入关键词/图片搜索"
            v-model="packingOptions.name"
          >
          </el-input>
          <div class="iconBox">
            <div class="uploadIcon">
              <i class="iconfont icon-tupian">
                <input
                  type="file"
                  ref="uploadRef"
                  @change="changeUpload"
                  class="fileInput"
                  accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
                />
              </i>
            </div>
            <button class="searchBtn" @click="subSearch">搜索</button>
          </div>
        </div>
        <button class="advanced" @click="showAdvanced">高级搜索</button>
      </div>
      <!-- 关键字 -->
      <div class="keywords" v-show="isAdvanced">
        <em>热词搜索：</em>
        <span
          @click="handlerHotKey(i, item.productName)"
          :class="{ item: true, active: keywordActive === i }"
          v-for="(item, i) in hotWords"
          :key="i"
        >
          {{ item.productName }}</span
        >
      </div>
      <!-- 高级搜索 -->
      <!-- <transition name="el-zoom-in-top"> -->
      <div class="searchAdvanced" v-show="!isAdvanced">
        <div class="box">
          <div class="left">
            <div class="item">
              价格区间：<el-input
                size="mini"
                @keyup.enter.native="subSearch"
                v-model="packingOptions.minPrice"
                placeholder="最低"
              ></el-input
              ><em>-</em
              ><el-input
                size="mini"
                v-model="packingOptions.maxPrice"
                @keyup.enter.native="subSearch"
                placeholder="最高"
              ></el-input>
              <div class="unit"></div>
            </div>
            <div class="item">
              产品规格：<el-input
                size="mini"
                @keyup.enter.native="subSearch"
                v-model="packingOptions.pr_le"
                placeholder="长"
              ></el-input
              ><em>-</em
              ><el-input
                @keyup.enter.native="subSearch"
                v-model="packingOptions.pr_wi"
                size="mini"
                placeholder="宽"
              ></el-input
              ><em>-</em
              ><el-input
                @keyup.enter.native="subSearch"
                v-model="packingOptions.pr_hi"
                size="mini"
                placeholder="高"
              ></el-input>
              <div class="unit">CM</div>
            </div>
            <div class="item">
              外箱规格：<el-input
                size="mini"
                @keyup.enter.native="subSearch"
                v-model="packingOptions.ou_le"
                placeholder="长"
              ></el-input
              ><em>-</em
              ><el-input
                @keyup.enter.native="subSearch"
                v-model="packingOptions.ou_wi"
                size="mini"
                placeholder="宽"
              ></el-input
              ><em>-</em
              ><el-input
                @keyup.enter.native="subSearch"
                v-model="packingOptions.ou_hi"
                size="mini"
                placeholder="高"
              ></el-input>
              <div class="unit">CM</div>
            </div>
            <div class="item">
              包装规格：<el-input
                size="mini"
                @keyup.enter.native="subSearch"
                v-model="packingOptions.in_le"
                placeholder="长"
              ></el-input
              ><em>-</em
              ><el-input
                @keyup.enter.native="subSearch"
                v-model="packingOptions.in_wi"
                size="mini"
                placeholder="宽"
              ></el-input
              ><em>-</em
              ><el-input
                @keyup.enter.native="subSearch"
                v-model="packingOptions.in_hi"
                size="mini"
                placeholder="高"
              ></el-input>
              <div class="unit">CM</div>
            </div>
          </div>
          <div class="right">
            <div class="item">
              出厂货号：<el-input
                size="mini"
                @keyup.enter.native="subSearch"
                v-model="packingOptions.fa_no"
                placeholder="请输入货号"
              ></el-input>
              <div class="unit"></div>
            </div>
            <div class="item">
              发布日期：<el-select
                v-model="packingDatetime"
                @change="getDateList"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="item baozhuang">
              包装方式：<el-select
                v-model="packingOptions.pa_nu"
                size="mini"
                placeholder="请选择"
                popper-class="baozhuang"
              >
                <el-option
                  v-for="(item, i) in packingList"
                  :key="i"
                  :label="item.ch_pa"
                  :value="item.pa_nu"
                >
                </el-option>
              </el-select>
            </div>
            <div class="item myImg">
              图<span style="opacity: 0">图片</span>片：
              <div style="flex: 1; marginleft: 10px">
                <el-radio v-model="packingOptions.isUpInsetImg" :label="true"
                  >是</el-radio
                >
                <el-radio v-model="packingOptions.isUpInsetImg" :label="false"
                  >否</el-radio
                >
              </div>
              <div class="unit"></div>
            </div>
          </div>
        </div>
        <div class="btnList">
          <el-button
            round
            style="backgroundcolor: #dddddd; width: 100px"
            @click="resetOptions"
            >重置</el-button
          >
          <el-button
            round
            type="primary"
            style="marginleft: 40px; width: 100px"
            @click="subSearch"
            >确定</el-button
          >
        </div>
      </div>
    </div>
    <!-- vueCropper 剪裁图片实现 -->
    <el-dialog
      title="图片剪裁"
      :visible.sync="isShowCropper"
      top="40px"
      destroy-on-close
      append-to-body
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :canScale="option.canScale"
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
    VueCropper
  },
  data () {
    return {
      productNumber: null,
      isProductDetail: false,
      packingList: [],
      dateList: [
        { label: '全部', value: '' },
        { label: '当天', value: 'today' },
        { label: '一周', value: 'lastOneWeek' },
        { label: '一个月', value: 'lastOneMonth' },
        { label: '三个月', value: 'lastThreeMonth' },
        { label: '六个月', value: 'lastHalfYear' }
      ],
      packingDatetime: null,
      packingOptions: {
        name: null,
        minPrice: null,
        maxPrice: null,
        fa_no: null,
        pa_nu: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        in_le: null,
        in_wi: null,
        in_hi: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      },
      isAdvanced: true,
      loading: false,
      isShowCropper: false,
      dialogVisible: false,
      baseImg: null,
      fileinfo: null,
      searchValue: '',
      hotWords: [],
      keywordActive: null,
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
  methods: {
    // 打开高级搜索
    showAdvanced () {
      this.isAdvanced = !this.isAdvanced
      if (this.packingList.length < 1) this.getProductChpaList()
    },
    // 詳情返回事件
    changeIsDetail (productDetail) {
      this.isProductDetail = false
      this.$refs.childrenProduct.productList.forEach((item) => {
        if (item.productNumber === this.productNumber) { item.isFavorite = productDetail.isFavorite }
      })
    },
    // 打開產品詳情
    showProductDetail (item) {
      if (!item.productNumber) {
        this.$message.error('该产品没有产品编号')
      } else {
        this.productNumber = item.productNumber
        this.isProductDetail = true
      }
    },
    // 點擊熱詞搜索
    handlerHotKey (i, name) {
      this.keywordActive = i
      this.packingOptions.name = name
      this.subSearch(true)
    },
    // 二次圖搜
    handlerCubeImgEvent (img) {
      this.isShowCropper = true
      this.option.img = img
    },
    // 提交搜索
    subSearch (flag) {
      if (flag !== true) this.keywordActive = null
      this.$store.commit('handlerBeforeSearchImg', null)
      this.$store.commit('handlerBeforeSearchImgPreview', null)
      this.$store.commit('handlerBeforeSearch', this.packingOptions)
      this.$router.push('/beforeIndex/product')
    },
    // 重置选项
    resetOptions () {
      this.packingDatetime = null
      this.packingOptions = {
        name: null,
        minPrice: null,
        maxPrice: null,
        fa_no: null,
        pa_nu: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        ou_le: null,
        ou_wi: null,
        ou_hi: null,
        in_le: null,
        in_wi: null,
        in_hi: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      }
      this.$store.commit('handlerBeforeSearch', this.packingOptions)
    },
    // 格式化时间
    formatTime (param) {
      const y = param.getFullYear()
      let m = param.getMonth() + 1
      let d = param.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    // 选择时间
    getDateList (code) {
      if (code) {
        const date = new Date()
        const endTime = this.formatTime(date)
        const date1 = Date.parse(date)
        let start = ''
        const oneDay = 1000 * 3600 * 24

        switch (code) {
          // 今天
          case 'today':
            start = new Date()
            break
          // 最近1周
          case 'lastOneWeek':
            start = date1 - oneDay * 7
            break
          // 最近1月
          case 'lastOneMonth':
            start = new Date()
            start.setMonth(start.getMonth() - 1)
            break
          // 最近3月
          case 'lastThreeMonth':
            start = new Date()
            start.setMonth(start.getMonth() - 3)
            break
          // 最近半年
          case 'lastHalfYear':
            start = date1 - oneDay * 183
            break
        }
        this.packingOptions.startTime =
          this.formatTime(new Date(start)) + 'T00:00:00'
        this.packingOptions.endTime = endTime + 'T23:59:59'
      } else {
        this.packingOptions.startTime = null
        this.packingOptions.endTime = null
      }
      console.log(this.packingOptions)
    },
    // 获取包装方式list
    async getProductChpaList () {
      const fd = {}
      const res = await this.$http.post('/api/GetProductChpaList', fd)
      if (res.data.result.code === 200) {
        this.packingList = res.data.result.item
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取搜索热词
    async getHotWord () {
      const res = await this.$http.post('/api/GetHotWord', {})
      if (res.data.result.code === 200) {
        this.hotWords = res.data.result.item
      } else {
        this.$message.error(res.data.result.item.message)
      }
    },
    // 选择图片搜索
    changeUpload (e) {
      this.fileinfo = e.target.files[0]
      const isLt5M = this.fileinfo.size / 1024 / 1024 < 3
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 3MB!')
        this.option.img = ''
        this.$refs.uploadRef.value = ''
        return false
      }
      this.isShowCropper = true
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(this.fileinfo)
        this.baseImg = this.option.img = f
        this.dialogVisible = true
      })
    },
    // 确定裁剪图片
    onCubeImg () {
      this.loading = true
      // 获取cropper的截图的 数据
      this.$refs.cropper.getCropBlob(async (file) => {
        const urlPreView = URL.createObjectURL(file)
        this.option.img = urlPreView
        this.$store.commit('handlerBeforeSearchImgPreview', {
          img: urlPreView,
          baseImg: this.baseImg
        })
        // 上传
        const companyNumber = this.$store.state.userInfo.commparnyList
          ? this.$store.state.userInfo.commparnyList[0].companyNumber
          : 'Tourist'
        const fd = new FormData()
        fd.append('companynumber', companyNumber)
        fd.append('file', file)
        try {
          const res = await this.$http.post('/api/File/SearchPicture', fd)
          if (res.data.result.code === 200) {
            this.cropperCancel()
            this.$store.commit(
              'handlerBeforeSearchImg',
              res.data.result.object
            )
            this.$router.push('/beforeIndex/product')
          } else {
            this.cropperCancel()
            this.$store.commit('handlerBeforeSearchImg', null)
            this.$message.error(res.data.result.message)
          }
        } catch (error) {
          this.cropperCancel()
        }
      })
    },
    // 取消裁剪
    cropperCancel () {
      this.$refs.cropper.clearCrop()
      this.isShowCropper = false
      this.loading = false
      this.option.img = ''
      this.$refs.uploadRef && (this.$refs.uploadRef.value = '')
    }
  },
  created () {
    this.getHotWord()
  },
  mounted () {}
}
</script>
<style lang="less" scoped>
@deep: ~">>>";
.home {
  flex: 1;
  .productDetailBox {
    max-width: 1200px;
    margin: 0 auto;
    height: calc(100%);
  }
  .homeBox {
    max-width: 1200px;
    margin: 0 auto;
    // height: calc(100%);
    position: relative;
    .downloadCode {
      width: 100%;
      background-color: #fff;
      .downloadContent {
        max-width: 1200px;
        overflow: visible;
        min-width: 1024px;
        height: 120px;
        margin: 0 auto;
        display: flex;
        .left,
        .right {
          flex: 1;
        }
        .left {
          display: flex;
          align-items: center;
          .el-image {
            width: 120px;
            height: 120px;
          }
          .welcome {
            font-size: 20px;
            color: #4077f9;
            margin-left: 50px;
            position: relative;
            vertical-align: top;
            &::before {
              display: block;
              position: absolute;
              content: "";
              width: 2px;
              height: 30px;
              background-color: #4077f9;
              left: -20px;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
        }
        .right {
          display: flex;
          justify-content: flex-end;
          .code {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .el-image {
              width: 80px;
              height: 80px;
            }
            .text {
              font-size: 12px;
              color: #797979;
            }
          }
        }
      }
    }
    .searchBox {
      width: 668px;
      margin: 0 auto;
      margin-top: 50px;
      position: relative;
      padding-top: 71px;
      display: flex;
      .searchImg {
        position: absolute;
        left: -50px;
        top: -2px;
        width: 230px;
        height: 80px;
        z-index: 1;
      }
      .title {
        color: #3872f8;
        position: absolute;
        font-size: 16px;
        left: 140px;
        top: 40px;
        font-weight: bold;
      }
      .inputBox {
        border-radius: 10px;
        border: 1px solid #3872f8;
        position: relative;
        display: flex;
        width: 548px;
        height: 52px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        font-size: 16px;
        @{deep} .el-input {
          input {
            border: none;
          }
        }
        .iconBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          .uploadIcon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #3872f8;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            .iconfont {
              font-size: 10px;
              .fileInput {
                position: absolute;
                left: 0;
                top: 0;
                width: 30px;
                height: 30px;
                font-size: 0;
                padding: 0;
                cursor: pointer;
                opacity: 0;
              }
            }
          }
          .searchBtn {
            margin: 0;
            padding: 0;
            margin-left: 14px;
            font-size: 16px;
            background-color: #3872f8;
            border: none;
            border-radius: 10px;
            color: #fff;
            width: 107px;
            height: 52px;
            box-sizing: border-box;
            outline: none;
            cursor: pointer;
          }
        }
      }
      .advanced {
        font-size: 16px;
        margin-left: 13px;
        background-color: #fff;
        border: 1px solid #3872f8;
        font-weight: 600;
        border-radius: 10px;
        color: #3872f8;
        width: 107px;
        height: 52px;
        outline: none;
        cursor: pointer;
      }
    }
    .keywords {
      width: 668px;
      margin: 0 auto;
      font-size: 14px;
      em {
        display: inline-block;
        margin-top: 10px;
      }
      .item {
        display: inline-block;
        padding-right: 20px;
        margin-top: 10px;
        color: #aaa;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
        &.active {
          color: red;
        }
      }
    }
    .searchAdvanced {
      width: 100%;
      font-size: 14px;
      padding: 20px 0;
      z-index: 1;
      left: 0;
      background-color: #fff;
      // box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
      .box {
        width: 668px;
        margin: 0 auto;
        display: flex;
        .left,
        .right {
          flex: 1;
          .item {
            margin-bottom: 20px;
            padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            @{deep} .el-input {
              flex: 1;
              input {
                border-radius: 28px;
              }
            }
            em {
              padding: 0 5px;
            }
            .unit {
              margin-left: 5px;
              width: 30px;
              color: red;
            }
          }
        }
        .right {
          .item {
            &.myImg {
              height: 28px;
              line-height: 28px;
              .el-radio {
                font-weight: 700;
              }
            }
          }
        }
      }
      .btnList {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
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
.baozhuang{
  .el-scrollbar{
    .el-select-dropdown__wrap{
      .el-scrollbar__view{
        .el-select-dropdown__item{
          width: 190px;
        }
      }
    }
  }
}
</style>
