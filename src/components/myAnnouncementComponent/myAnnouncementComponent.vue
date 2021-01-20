<template>
<div class="wrapBox">
<div class="sendFind">
  <div
    class="sendFindItem"
    @click="openTwoView(item.type)"
    v-for="item in titleList"
    :key="item.id"
  >
    <div class="iconImg">
      <img :src="item.path" :key="item.path" alt />
    </div>
    <div class="txt">{{ item.text }}</div>
  </div>
</div>
<div
  class="findItems"
  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="disabled"
>
  <div class="findItem" v-for="(item, i) in dataList" :key="i">
    <template v-if="item">
      <div class="topLayout">
        <div class="img">
          <el-image
            :src="item.userInfo.image"
            class="findImage"
            fit="cover"
          >
            <div
              slot="error"
              class="image-slot"
              style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
            >
              {{ item.userInfo.niceName }}
            </div>
          </el-image>
        </div>
        <div class="title">
          <p>{{ item.userInfo.niceName }}</p>
        </div>
      </div>
      <p class="ContentText">
        <em>{{ item.bearNotice.notice }}</em>
      </p>
      <div class="imgComtent" v-if="item.video">
        <div class="demo1-video">
          <video
            width="100%"
            height="100%"
            class="video-js vjs-default-skin vjs-big-play-centered"
            controls
            style="object-fit:contain"
          >
            <source :src="item.video" type="video/mp4" />
          </video>
        </div>
      </div>
      <template v-else-if="item.imgList.length > 1">
        <div class="imgComtent">
          <el-image
            v-for="(val, index) in item.imgList.split(',')"
            :key="index"
            class="img"
            :src="val"
            alt
            :preview-src-list="item.imgList.split(',')"
          ></el-image>
        </div>
      </template>
      <div class="dateInDelet">
        <div>
          <span>{{ dateDiff(item.bearNotice.publishDate) }}</span>
          <el-popconfirm
            class="deleteBtn"
            title="确定要删除这条公告吗？"
            @onConfirm="deleteCement(item, i)"
          >
            <span slot="reference">删除</span>
          </el-popconfirm>
        </div>

        <div class="like">
          <span @click="dianZan(item)">
            <i
              class="iconfont icon-love_icon"
              v-show="!item.isLike"
            ></i>
            <i
              class="iconfont icon-aixin"
              v-show="item.isLike"
              style="color:#fb6055;"
            ></i>
            <em>{{ item.bearNotice.upvoteTotal }}</em>
          </span>
          <span class="pinglun" @click="openPinglun(item)">
            <i class="iconfont icon-xiaoxi1"></i>
            <em>{{ item.bearNotice.review }}</em>
          </span>
        </div>
      </div>
      <!-- 评论 -->
      <div class="reply" v-if="item.noticeInteraction.length > 0">
        <template v-for="(item1, i) in item.noticeInteraction">
          <p :key="i">
            <span
              style="cursor: pointer;"
              @click="openReplyComment(item1)"
              >{{ item1.userName }}</span
            >
            <em v-if="item1.replyToUserName">
              回复
              <span
                @click="openReplyComment(item1, item1.replyToUserName)"
                style="padding-right:5px;cursor: pointer;"
                >{{ item1.replyToUserName }}</span
              >
            </em>
            ：{{ item1.comment }}
          </p>
        </template>
      </div>
    </template>
  </div>
  <center
    style="padding:10px 0;background-color:#eeeeed;margin:10px 0 0 0;position: relative;"
  >
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
    <!-- <div
      class="huidaodingbu el-icon-caret-top"
      v-show="dataList.length > 9"
      @click="toTop"
    ></div> -->
  </center>
</div>
<!-- 回到顶部 -->
<el-backtop target=".findItems" :right="800" :bottom="100"></el-backtop>
<!-- 评论 -->
    <el-dialog :title="pinglunTitle" :visible.sync="dialogPinglun" width="30%">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="评论内容">
          <el-input v-model="pinglunValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPinglun = false">取 消</el-button>
        <el-button type="primary" @click="addComment">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      pinglunTitle: '',
      pinglunValue: null,
      pinglunForm: null,
      dialogPinglun: false,
      userInfo: this.$store.state.userInfo,
      loading: false,
      currentPage: 1,
      pageSize: 20,
      dataList: [],
      titleList: [
        {
          id: 1,
          text: '普通公告',
          type: 'Ordinary',
          path: require('@/assets/images/gonggao1.png')
        },
        {
          id: 2,
          text: '采购公告',
          type: 'Purchase',
          path: require('@/assets/images/gonggao2.png')
        },
        {
          id: 3,
          text: '供应公告',
          type: 'Supply',
          path: require('@/assets/images/gonggao3.png')
        }
      ]
    }
  },
  methods: {
    // 打开发布公告第三窗口
    openTwoView (item) {
      this.$emit('openTwoView', {
        componentName: 'sendNoticeComponent',
        type: item
      })
    },
    // 打开评论
    openPinglun (value) {
      this.pinglunTitle = '评论'
      this.dialogPinglun = true
      this.pinglunForm = value
    },
    // 评论
    async addComment () {
      let data
      if (this.pinglunTitle === '回复评论') {
        data = {
          noticeNumber: this.huifuPinglun.noticeNumber,
          interactionType: 'Reply',
          userName: this.userInfo.userInfo.linkman,
          comment: this.pinglunValue,
          replyCompanyID: this.replyToUserName
            ? this.huifuPinglun.replyCompanyID
            : this.huifuPinglun.companyID,
          replyToUser: this.replyToUserName
            ? this.huifuPinglun.replyToUser
            : this.huifuPinglun.createdBy,
          replyToUserName: this.replyToUserName || this.huifuPinglun.userName
        }
      } else {
        data = {
          noticeNumber: this.pinglunForm.bearNotice.noticeNumber,
          companyID: this.userInfo.userInfo.id,
          userName: this.userInfo.userInfo.linkman,
          interactionType: 'Comment',
          comment: this.pinglunValue
        }
      }
      const res = await this.$http.post('/api/CreateNoticeInteraction', data)
      if (res.data.result.code === 200) {
        this.skipCount = 1
        this.maxResultCount =
          this.dataList.length >= 100 ? 10 : this.dataList.length
        this.getDataList()
        // 重新调用子路由查看公告
        this.$root.eventHub.$emit('UpdateFind')
        this.dialogPinglun = false
        this.$message.success('评论成功')
      }
      this.pinglunValue = ''
      this.pinglunTitle = ''
    },
    // 下拉加载
    loadMore () {
      this.loading = true
      setTimeout(async () => {
        this.currentPage++
        this.pageSize = 20
        await this.getDataList(true)
        this.loading = false
      }, 500)
    },
    // 打开回复评论
    async openReplyComment (val, replyToUserName) {
      if (
        val.createdBy ===
        (this.$store.state.userInfo.userInfo &&
          this.$store.state.userInfo.userInfo.id)
      ) {
        this.$message.error('不能回复自己哦')
        return false
      }
      this.pinglunTitle = '回复评论'
      this.dialogPinglun = true
      this.huifuPinglun = val
      this.replyToUserName = replyToUserName
    },
    // 点赞
    async dianZan (val) {
      const res = await this.$http.post('/api/UpdateBearNotice', {
        noticeNumber: val.bearNotice.noticeNumber,
        NoticeType: 'Upvote',
        id: val.bearNotice.id
      })
      if (res.data.result.code === 200) {
        if (res.data.result.item.collectTotal) {
          this.$message.success('点赞成功')
        } else {
          this.$message.warning('取消点赞成功')
        }
        val.isLike = !val.isLike
        val.isLike
          ? val.bearNotice.upvoteTotal++
          : val.bearNotice.upvoteTotal--
        this.$root.eventHub.$emit('UpdateFind')
      }
    },
    // 删除公告
    async deleteCement (val, i) {
      const res = await this.$http.post('/api/DeleteBearBotice', {
        id: val.bearNotice.id
      })
      if (res.data.result.code === 200) {
        this.$message.success('删除成功')
        this.dataList.splice(i, 1)
        // 重新调用子路由查看公告
        this.$root.eventHub.$emit('UpdateFind')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 回到顶部事件
    // async toTop () {
    //   let top = $('.findItems').scrollTop()
    //   // 实现滚动效果
    //   const _that = this
    //   const timeTop = setInterval(() => {
    //     $('.findItems').scrollTop((top -= 20))
    //     if (top <= 0) {
    //       clearInterval(timeTop)
    //     }
    //   }, 1)
    //   this.skipCount = 1
    //   this.maxResultCount = 10
    //   this.dataList = this.dataList.slice(0, 10)
    //   $('.findItems').animate({ scrollTop: 0 })
    // },
    // 获取我发布的公告
    async getDataList (flag) {
      const res = await this.$http.post('/api/BearNoticePage', {
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        publisher: this.userInfo.userInfo.id
      })
      if (res.data.result.code === 200) {
        if (flag) {
          this.dataList = this.dataList.concat(
            res.data.result.item.result.items
          )
        } else {
          this.dataList = res.data.result.item.result.items
          this.loading = false
        }
        this.total = res.data.result.item.result.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    /*
     * 时间戳显示为多少分钟前，多少天前的处理
     * console.log(dateDiff(1411111111111));  // 2014年09月19日
     */
    dateDiff (time) {
      let timestamp = Number(new Date(time))
      const arrTimestamp = (timestamp + '').split('')
      for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
          arrTimestamp[start] = '0'
        }
      }
      timestamp = arrTimestamp.join('') * 1

      var minute = 1000 * 60
      var hour = minute * 60
      var day = hour * 24
      var halfamonth = day * 15
      var month = day * 30
      var now = new Date().getTime()
      var diffValue = now - timestamp

      // 如果本地时间反而小于变量时间
      if (diffValue < 0) {
        return '不久前'
      }

      // 计算差异时间的量级
      var monthC = diffValue / month
      var weekC = diffValue / (7 * day)
      var dayC = diffValue / day
      var hourC = diffValue / hour
      var minC = diffValue / minute

      // 数值补0方法
      var zero = function (value) {
        if (value < 10) {
          return '0' + value
        }
        return value
      }

      // 使用
      if (monthC > 12) {
        // 超过1年，直接显示年月日
        return (function () {
          var date = new Date(timestamp)
          return (
            date.getFullYear() +
            '年' +
            zero(date.getMonth() + 1) +
            '月' +
            zero(date.getDate()) +
            '日'
          )
        })()
      } else if (monthC >= 1) {
        return parseInt(monthC) + '月前'
      } else if (weekC >= 1) {
        return parseInt(weekC) + '周前'
      } else if (dayC >= 1) {
        return parseInt(dayC) + '天前'
      } else if (hourC >= 1) {
        return parseInt(hourC) + '小时前'
      } else if (minC >= 1) {
        return parseInt(minC) + '分钟前'
      }
      return '刚刚'
    }
  },
  created () {

  },
  mounted () {
    this.$root.eventHub.$on('UpdateFind', async () => {
      this.currentPage = 1
      this.getDataList()
    })
  },
  beforeDestroy () {
    this.$root.eventHub.$off('UpdateFind')
  },
  computed: {
    noMore () {
      return this.dataList.length >= this.total
    },
    disabled () {
      return this.loading || this.noMore
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox {
  width: 100%;
  height: 827px;
  position: relative;
  box-sizing: border-box;
  .sendFind {
    width: 100%;
    height: 100px;
    background-color: #f6f6f6;
    border-radius: 0 0 20px 20px;
    display: flex;
    justify-content: space-between;
    .sendFindItem {
      width: 33.333%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      align-self: center;
      text-align: center;
      cursor: pointer;
      .iconImg {
        width: 100%;
        img {
          transition: all 1s;
          border-radius: 50%;
        }
      }
      .txt {
        width: 100%;
      }
      &:hover {
        .iconImg {
          img {
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
          }
        }
      }
    }
  }
  .findItems {
    width: 100%;
    height: 725px;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .findItem {
      width: 100% !important ;
      border: none !important ;

      .topLayout {
        display: flex;
        align-items: center;
        vertical-align: top;
        padding: 5px;
        .img {
          .findImage {
            width: 40px;
            height: 40px;
            background-color: #165af7;
            color: white;
            border-radius: 50%;
          }
        }
        .title {
          margin-left: 10px;
          color: #48639f;
          span {
            color: #ccc;
            font-size: 12px;
          }
        }
        i {
          float: right;
        }
      }
      .imgComtent {
        margin-left: 50px;
        margin-bottom: 5px;
        width: 300px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &::after {
          content: "";
          width: 30%;
        }
        .img {
          width: 30%;
          height: 90px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
      .ContentText {
        margin-left: 50px;
        margin-bottom: 10px;

        display: flex;
        em {
          flex: 5;
        }
        span {
          flex: 1;
          color: #48639f;
          font-size: 12px;
          cursor: pointer;
          text-align: center;
        }
      }
      .dateInDelet {
        margin-left: 50px;
        font-size: 12px;
        color: #ccc;
        display: flex;
        justify-content: space-between;
        .deleteBtn {
          margin-left: 20px;
          cursor: pointer;
          color: #48639f;
        }
        .attrs {
          margin-left: 50px;
          font-size: 14px;
        }
        .like {
          float: right;
          span {
            margin-right: 30px;
            cursor: pointer;
            i {
              font-size: 18px;
            }
            em {
              font-size: 16px;
              margin-left: 10px;
            }
          }
          .pinglun {
            position: relative;
            .pinglunOptions {
              position: absolute;
              width: 100px;
              height: 50px;
              border: 1px solid #000;
              border-radius: 10px;
            }
          }
        }
      }
      .reply {
        background-color: #eeeeed;
        margin-left: 50px;
        width: 300px;
        box-sizing: border-box;
        padding: 5px;
        border-radius: 5px;
        font-size: 12px;
        span {
          color: #48639f;
        }
      }
    }
    // 回到顶部
    .huidaodingbu {
      position: absolute;
      top: -47px;
      right: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: #409eff;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.22);
      cursor: pointer;
      &:hover {
        background-color: #f2f6fc;
      }
    }
  }
}
</style>
