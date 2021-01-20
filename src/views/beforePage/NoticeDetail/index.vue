<template>
  <div class="noticeDetailBox">
    <div class="Graphic">
      <div class="left" v-if="noticeData.video">
        <video
          width="100%"
          height="100%"
          class="video-js vjs-default-skin vjs-big-play-centered"
          controls
          style="object-fit:cover"
        >
          <source :src="noticeData.video" type="video/mp4" />
        </video>
      </div>
      <div class="left" v-else>
        <div class="swiperList">
          <el-carousel
            trigger="click"
            :interval="2000"
            ref="carousel"
            @change="changeIndex"
            indicator-position="none"
          >
            <template v-if="noticeData.imgList && noticeData.imgList.length > 0">
              <el-carousel-item
                v-for="(item, i) in noticeData.imgList"
                :key="i"
              >
                <el-image
                  fit="contain"
                  style="cursor: pointer;"
                  :src="item"
                  :key="i"
                  @click="openImg(i)"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/zanwutupian1.png"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/zanwutupian1.png"
                      alt
                    />
                  </div>
                </el-image>
              </el-carousel-item>
            </template>
            <template v-else>
              <el-carousel-item>
                <el-image fit="contain" src="~@/assets/images/zanwutupian1.png" @click="openImg">
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/zanwutupian1.png"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/zanwutupian1.png"
                      alt
                    />
                  </div>
                </el-image>
              </el-carousel-item>
            </template>
          </el-carousel>
          <el-image-viewer
                    v-if="showViewer"
                    :on-close="closeViewer"
                    :url-list="viewerImgList" />
        </div>
        <el-dialog class="el-dialog-div" :visible.sync="dialogImgUpload" :center="true" destroy-on-close>
            <img style="object-fit:contain;width:100%;" :src="imgUrl" alt />
        </el-dialog>
        <!-- 小幻灯片 -->
        <div
          class="jiantou"
          @mouseenter="hoverActive = true"
          @mouseleave="hoverActive = false"
        >
          <div class="jiantouLeft" v-show="hoverActive" @click="leftmove"></div>
          <div class="imgItems">
            <ul class="imgItemWarp" ref="modulelist">
              <li
                class="imgItem"
                @click="$refs.carousel.setActiveItem(i)"
                v-for="(item, i) in noticeData.imgList"
                :key="i"
              >
                <el-image
                  fit="contain"
                  :class="{ static: true, active: activeIndex === i }"
                  :src="item"
                >
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/zanwutupian1.png"
                      alt
                    />
                  </div>
                </el-image>
              </li>
            </ul>
          </div>
          <div
            class="jiantouRight"
            v-show="hoverActive"
            @click="rightmove"
          ></div>
        </div>
      </div>
      <!-- 产品内容 -->
      <div class="right">
        <!-- <p class="login">
          供应商信息只有以采购商登录可见
          <a href="#">去登录</a>
        </p>-->
        <div class="createDate">
          发布时间：
          <span>
            {{
              noticeData.bearNotice &&
                noticeData.bearNotice.publishDate | publishDate
            }}
          </span>
        </div>
        <div class="textareaContent">
          <p>{{ noticeData.bearNotice && noticeData.bearNotice.notice }}</p>
        </div>
      </div>
    </div>
    <div class="contact">
      <div class="contactTitleTxt">联系方式</div>
      <div class="contactTitleLine"></div>
      <h2 class="companyName">
        {{ noticeData.companyInfo && noticeData.companyInfo.companyName }}
      </h2>
      <div class="tableInfo">
        <ul v-if="noticeData.companyInfo">
          <li class="infoItem">
            <div class="title el-icon-office-building">
              <span>公司名：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.companyName }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-user">
              <span>联系人：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.contactsMan }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-mobile-phone">
              <span>移动电话：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.phoneNumber }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-message">
              <span>电子邮箱：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.e_mail }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-phone-outline">
              <span>联系电话：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.telephoneNumber }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-printer">
              <span>传真号：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.fax }}</div>
          </li>

          <li class="infoItem">
            <div class="title iconfont icon-QQ3">
              <span>QQ号：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.qq }}</div>
          </li>
          <li class="infoItem">
            <div class="title el-icon-map-location">
              <span>公司地址：</span>
            </div>
            <div class="text">{{ noticeData.companyInfo.address }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: { ElImageViewer },
  data () {
    return {
      isHoverImg: false,
      showViewer: false,
      viewerImgList: [],
      dialogImgUpload: false,
      imgUrl: null,
      activeIndex: 0,
      hoverActive: false,
      myMargin: 0,
      noticeData: {}
    }
  },
  methods: {
    // 点击关闭预览大图
    closeViewer () {
      // 移除事件
      $('.el-image-viewer__btn').unbind('mouseenter')
      $('.el-image-viewer__btn').unbind('mouseleave')
      $('.el-image-viewer__img').unbind('mouseleave')
      $('.el-image-viewer__img').unbind('mouseleave')
      this.showViewer = false
    },
    // 点击显示预览大图da
    openImg (index) {
      this.showViewer = true
      const tempImgList = this.noticeData.imgList.map(val => {
        if (val) return val
      })
      const temp = []
      for (let i = 0; i < index; i++) {
        temp.push(tempImgList.shift())
      }
      this.viewerImgList = tempImgList.concat(temp)
      this.$nextTick(() => {
        $('.el-image-viewer__btn').mouseenter(() => {
          this.isHoverImg = true
        })
        $('.el-image-viewer__btn').mouseleave(() => {
          this.isHoverImg = false
        })
      })
    },
    // 轮播图轮播
    changeIndex (index) {
      this.activeIndex = index
      if (this.showViewer) {
        this.$nextTick(() => {
          $('.el-image-viewer__img').mouseenter((e) => {
            this.isHoverImg = true
          })
          $('.el-image-viewer__img').mouseleave((e) => {
            this.isHoverImg = false
          })
        })
        console.log(this.isHoverImg)
        if (!this.isHoverImg) {
          const tempImgList = this.noticeData.imgList.map(val => {
            if (val) return val
          })
          const temp = []
          for (let i = 0; i < index; i++) {
            temp.push(tempImgList.shift())
          }
          this.viewerImgList = tempImgList.concat(temp)
        }
      }
    },
    leftmove () {
      const _that = this
      if (this.myMargin < 0) {
        this.myMargin += 1
        $(this.$refs.modulelist).animate({
          marginLeft: _that.myMargin * 120 + 'px'
        })
      }
    },
    rightmove () {
      if (this.noticeData.imgList.length < 5) {
        return false
      }
      const _that = this
      if (this.myMargin > -(this.noticeData.imgList.length + this.myMargin)) {
        this.myMargin -= 1
        $(this.$refs.modulelist).animate({
          marginLeft: _that.myMargin * 120 + 'px'
        })
      }
    },
    // 公告byId
    async getNoticeByID () {
      const noticeNumber = this.$route.params.id
      const res = await this.$http.post('/api/GetBearNoticeByNumber', {
        noticeNumber
      })
      console.log(res)
      if (res.data.result.code === 200) {
        this.noticeData = res.data.result.item
      }
    }
  },
  filters: {
    publishDate (val) {
      return val && val.replace(/t/i, ' ')
    }
  },
  mounted () {
    this.getNoticeByID()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.noticeDetailBox {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
}
.Graphic {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left {
    width: 600px;

    .video-js {
      width: 100%;
      height: 450px;
    }
    .swiperList {
      width: 100%;
      height: 450px;
      border: 1px solid #ededed;
      cursor: pointer;
      @{deep} .el-carousel__container {
        height: 450px !important;
        width: 100%;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
      @{deep} .el-image-viewer__wrapper {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
    }
    .jiantou {
      position: relative;
      .jiantouLeft {
        position: absolute;
        width: 30px;
        height: 30px;
        background: url("~@/assets/images/箭头_arrow594.png") no-repeat center;
        background-size: 100%;
        left: 0;
        top: 50%;
        margin-top: -15px;
        border-radius: 50%;
        cursor: pointer;
      }
      .jiantouRight {
        position: absolute;
        width: 30px;
        height: 30px;
        cursor: pointer;
        background: url("~@/assets/images/箭头_arrow594 拷贝.png") no-repeat
          center;
        background-size: 100%;
        right: 0;
        top: 50%;
        margin-top: -15px;
        border-radius: 50%;
      }
      .imgItems {
        width: 90%;
        margin: 0 auto;
        margin-top: 10px;
        box-sizing: border-box;
        overflow: hidden;
        opacity: 0.6;
        &.active {
          opacity: 1;
        }
        .imgItemWarp {
          display: inline;
          white-space: nowrap;
          .imgItem {
            height: 100px;
            width: 100px;
            margin-right: 20px;
            display: inline-block;
            white-space: nowrap;
            cursor: pointer;
            .el-image {
              width: 100px;
              height: 100px;
              border: 2px solid transparent;
              opacity: 0.3;
              &.active {
                box-shadow: 0px 3px 10px 0px rgba(4, 0, 0, 0.19);
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    position: relative;
    .login {
      padding: 5px 20px;
      font-size: 12px;
      margin-bottom: 10px;
      color: #444444;
      background-color: #e2ebff;
      a {
        color: #165af7;
        margin-left: 20px;
      }
    }
    .createDate {
      padding: 0px 20px;
      color: #aaa;
      font-size: 12px;
    }
    .textareaContent {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      padding: 20px 40px;
      left: 0;
      right: 0;
      bottom: 0;
      top: 52px;
      text-indent: 32px;
      p {
        line-height: 30px;
      }
    }
  }
}
.contact {
  margin-top: 20px;
  margin-bottom: 50px;
  .contactTitleTxt {
    color: white;
    width: 169px;
    height: 60px;
    background-color: #165af7;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contactTitleLine {
    border-bottom: 1px solid #aaa;
  }
  .companyName {
    padding: 34px 0;
    font-weight: 400;
  }
  .tableInfo {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .infoItem {
        width: 49%;
        display: flex;
        align-items: center;

        height: 50px;
        margin-bottom: 20px;
        border: 1px solid rgba(206, 214, 212, 1);
        .title {
          padding-left: 35px;
          width: 200px;
          height: 100%;
          display: flex;
          align-items: center;
          font-weight: 400;
          border-right: 1px solid rgba(206, 214, 212, 1);
          background: rgba(247, 247, 247, 1);
          span {
            margin-left: 10px;
          }
        }
        .text {
          margin-left: 35px;
        }
      }
    }
  }
}
</style>
