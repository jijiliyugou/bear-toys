<template>
  <div>
    <div class="wanjuquanTop">
      <h4>玩具圈 <span v-if="findCount" style="color:#f56c6c;">{{findCount}}</span></h4>
      <el-badge :hidden="findCount===0" :value="findCount" @click.native="openInfoList">
        <div class="infoList"></div>
      </el-badge>
    </div>
    <ul
      class="findListAll"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    >
      <li v-for="(item, i) in findList" :key="i">
        <div class="topLayout">
          <div class="img" @click="openTopLayout(item.bearNotice.id, item)">
            <el-image
              :src="item.userInfo && item.userInfo.image"
              class="findImage"
              fit="cover"
            >
              <div
                slot="error"
                class="image-slot"
                style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
              >
                {{ item.userInfo && item.userInfo.niceName }}
              </div>
            </el-image>
            <div class="sendMsg" v-show="active === item.bearNotice.id">
              <p align="center" style="padding:10px 0;">是否发送消息？</p>
              <center>
                <el-button size="mini" class="btns">不了，谢谢</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  class="btns"
                  @click="showSendChuang(item)"
                  >发 送</el-button
                >
              </center>
            </div>
          </div>

          <div class="title">
            <div class="left">
              <p>{{ item.userInfo && item.userInfo.niceName }}</p>
            </div>
            <div class="right">
              <i class="jubaoIcon">
                <img :src="gongsiIcon[item.bearNotice.noticeType]" alt />
              </i>
              <div class="gengduo" @click="show3Active(i)"></div>
              <transition name="el-zoom-in-top">
                <div class="jubaoBox" v-show="showActive === i">
                  <p @click="pingbiEvent(item)">
                    <i class="pingbi"></i>
                    <span>屏蔽</span>
                  </p>
                  <p @click="openjubaoEvent(item)">
                    <i class="jubao"></i>
                    举报
                  </p>
                </div>
              </transition>
            </div>
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
        <template v-else-if="item.imgList.length > 0">
          <div class="imgComtent">
            <el-image
              v-for="(val, i) in item.imgList.split(',')"
              class="img"
              :key="i"
              :src="val"
              alt
              :preview-src-list="item.imgList.split(',')"
            ></el-image>
          </div>
        </template>
        <div class="dateInDelet">
          <span></span>
        </div>
        <div class="likeWarp">
          <div class="attrs">{{ dateDiff(item.bearNotice.publishDate) }}</div>
          <div class="like">
            <span @click="dianZan(item)">
              <i class="iconfont icon-love_icon" v-show="!item.isLike"></i>
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
              <span style="cursor: pointer;" @click="openReplyComment(item1)">{{
                item1.userName
              }}</span>
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
      </li>
      <center
        style="padding:10px 0;background-color:#eeeeed;margin:10px 0 0 0;position: relative;"
      >
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
        <!-- <div
          class="huidaodingbu el-icon-caret-top"
          @click="toTop"
          v-show="findList.length > 9"
        ></div> -->
      </center>
    </ul>
    <!-- 回到顶部 -->
    <el-backtop target=".findListAll" :right="1200" :bottom="100"></el-backtop>
    <!-- 评论 -->
    <el-dialog :title="pinglunTitle" :visible.sync="dialogPinglun" destroy-on-close width="30%">
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
    <!-- 举报 -->
    <el-dialog title="举报" :visible.sync="dialogjubao" destroy-on-close width="30%">
      <ul class="selectJubaoInfo">
        <li
          v-for="(item, i) in ['政治敏感', '欺诈骗钱', '其他']"
          :key="i"
          @click="checkJubaoInfo($event, item)"
          :class="{ active: jubaoActive === item }"
        >
          {{ item }}
        </li>
        <el-button
          type="primary"
          round
          style="width:100%;height:50px;"
          @click="jubaoEvent"
          >确 定</el-button
        >
      </ul>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    findCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      jubaoItem: null,
      jubaoActive: null,
      selectJubaoValue: null,
      dialogjubao: false,
      gongsiIcon: {
        Ordinary: require('@/assets/images/公.png'),
        Purchase: require('@/assets/images/采.png'),
        Supply: require('@/assets/images/供.png')
      },
      showActive: null,
      active: null,
      replyToUserName: '',
      pinglunTitle: '',
      huifuPinglun: '',
      pinglunForm: '',
      pinglunValue: '',
      dialogPinglun: false,
      currentPage: 1,
      loading: false,
      pageSize: 10,
      total: null,
      findList: []
    }
  },
  computed: {
    noMore () {
      return this.findList.length >= this.total
    },
    busy () {
      return this.loading || this.noMore
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  mounted () {
    this.getDataList()
    this.$emit('openOneView', {
      componentName: 'myAnnouncementComponent'
    })
    this.$root.eventHub.$on('UpdateFind', async () => {
      this.currentPage = 1
      this.getDataList()
    })
  },
  beforeDestroy () {
    this.$root.eventHub.$off('UpdateFind')
  },
  methods: {
    show3Active (i) {
      this.showActive === i ? (this.showActive = null) : (this.showActive = i)
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
        this.currentPage = 1
        this.pageSize = this.findList.length >= 100 ? 10 : this.findList.length
        this.getDataList()
        this.dialogPinglun = false
        this.$message.success('评论成功')
      }
      this.pinglunValue = ''
      this.pinglunTitle = ''
    },
    // 打开评论
    openPinglun (value) {
      this.pinglunTitle = '评论'
      this.dialogPinglun = true
      this.pinglunForm = value
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
      }
    },
    openInfoList () {
      console.log('openInfoList')
    },
    // 下拉加载
    loadMore () {
      this.loading = true
      setTimeout(async () => {
        this.currentPage++
        this.pageSize = 10
        await this.getDataList(true)
        this.loading = false
      }, 500)
    },
    // 获取公告列表
    async getDataList (flag) {
      const res = await this.$http.post('/api/BearNoticePage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      })
      if (res.data.result.code === 200) {
        this.$emit('getNoticeUnreadTotal')
        if (flag) {
          this.findList = this.findList.concat(
            res.data.result.item.result.items
          )
        } else {
          this.findList = res.data.result.item.result.items
          this.loading = false
        }
        this.total = res.data.result.item.result.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 公告打开聊天窗户
    showSendChuang (item) {
      this.$emit('showFindLiaotian', {
        item: item.userInfo
      })
    },
    // 点击打开公告聊天
    openTopLayout (bearNoticeId, item) {
      console.log(item.userInfo.userId, this.$store.state.userInfo.userInfo.id)
      if (
        item.userInfo.userId ===
        (this.$store.state.userInfo.userInfo &&
          this.$store.state.userInfo.userInfo.id)
      ) {
        this.active = null
        this.$message.error('不能给自己发消息哦')
        return false
      }
      this.$emit('cancelSendGonggao')
      this.active && this.active === bearNoticeId
        ? (this.active = null)
        : (this.active = bearNoticeId)
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
    },
    // 屏蔽公告
    async pingbiEvent (item) {
      const res = await this.$http.post('/api/CreateMessageReport', {
        messageID: item.bearNotice.id,
        reportState: true,
        reportType: 'Shield'
      })
      if (res.data.result.code === 200) {
        this.$message.success('屏蔽公告成功')
        this.getDataList()
      } else {
        this.$message.error('屏蔽公告失败，请检查网路')
      }
      this.showActive = null
    },
    // 打开举报公告
    openjubaoEvent (item) {
      this.dialogjubao = true
      this.jubaoActive = null
      this.selectJubaoValue = null
      this.jubaoItem = item
    },
    // 举报
    async jubaoEvent () {
      if (!this.selectJubaoValue) {
        this.$message.error('请选择举报原因')
        return
      }
      const res = await this.$http.post('/api/CreateMessageReport', {
        messageID: this.jubaoItem.bearNotice.id,
        reportState: false,
        reportType: 'Report',
        reportRemark: this.selectJubaoValue
      })
      if (res.data.result.code === 200) {
        this.$message.success('举报公告成功')
        this.getDataList()
        this.dialogjubao = false
        this.showActive = null
      } else {
        this.$message.error('举报公告失败，请检查网路')
      }
    },
    // 点击选择举报信息
    checkJubaoInfo (e, item) {
      this.jubaoActive = item
      this.selectJubaoValue = e.target.innerText
    }
  }
}
</script>

<style lang="less" scoped>
.wanjuquanTop {
  height: 50px;
  width: 100%;
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  h4 {
    font-size: 18px;
    font-weight: 500;
  }
  .el-badge {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
    background: url("~@/assets/images/xiaoxi.png") no-repeat center;
    background-size: contain;
  }
}
.findListAll {
  height: 719px;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
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
  li > .topLayout {
    display: flex;
    align-items: center;
    vertical-align: top;
    padding: 5px;
    .img {
      cursor: pointer;
      position: relative;
      .findImage {
        width: 40px;
        transition: all 1s;
        height: 40px;
        background-color: #165af7;
        color: white;
        border-radius: 50%;
      }
      &:hover {
        .findImage {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
      .sendMsg {
        position: absolute;
        left: -2px;
        width: 162px;
        height: 70px;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        word-break: break-all;
        z-index: 1;
        font-size: 12px;
        .btns {
          transform: scale(0.7);
        }
      }
    }
    .title {
      margin-left: 10px;
      flex: 1;
      color: #48639f;
      display: flex;
      justify-content: space-between;
      .left {
      }
      .right {
        display: flex;
        justify-content: space-between;
        position: relative;
        .jubaoIcon {
          width: 20px;
          height: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .gengduo {
          width: 35px;
          height: 20px;
          background-color: #f6f6f6;
          border-radius: 5px;
          margin-left: 10px;
          cursor: pointer;
          &::after {
            content: "";
            display: inline-block;
            vertical-align: middle;
            width: 5px;
            height: 5px;
            background-color: #415888;
            border-radius: 50%;
            margin-left: 5px;
            margin-bottom: 2px;
          }
          &::before {
            content: "";
            display: inline-block;
            vertical-align: middle;
            width: 5px;
            height: 5px;
            background-color: #415888;
            border-radius: 50%;
            margin-left: 28%;
            margin-bottom: 2px;
          }
        }
        .jubaoBox {
          background-color: #4c4c4c;
          width: 100px;
          height: 80px;
          position: absolute;
          bottom: -95px;
          left: -40px;
          border-radius: 5px;
          z-index: 1;
          color: white;
          p {
            padding: 5px 0;
            line-height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            &:last-child {
              border-top: 2px solid rgb(12, 11, 11);
            }
            &:hover {
              background-color: #767676;
              cursor: pointer;
            }
            .pingbi {
              background: url("~@/assets/images/pingbi1.png") no-repeat center;
            }
            .jubao {
              background: url("~@/assets/images/jubao1.png") no-repeat center;
            }
            .pingbi,
            .jubao {
              display: inline-block;
              vertical-align: top;
              width: 20px;
              height: 20px;
              margin-right: 15px;
              background-size: contain;
            }
          }
          &::before {
            content: "";
            display: block;
            height: 0;
            width: 0;
            border-right: 10px solid transparent;
            border-left: 10px solid transparent;
            border-bottom: 10px #4c4c4c solid;
            position: absolute;
            left: 76px;
            top: -10px;
          }
        }
      }
    }
    i {
      float: right;
    }
  }
  .content {
    margin-left: 50px;
    margin-bottom: 5px;
    width: 300px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .img {
      width: 90px;
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
  .dateInDelet {
    margin-left: 50px;
    font-size: 12px;
    color: #ccc;
  }
  .likeWarp {
    color: #ccc;
    display: flex;
    justify-content: space-between;
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
.selectJubaoInfo {
  li {
    height: 100px;
    border-bottom: 1px solid #ccc;
    font-size: 20px;
    display: flex;
    align-items: center;
    text-indent: 50px;
    cursor: pointer;
    &:last-of-type {
      border: none;
    }
    &.active {
      color: red;
    }
  }
}
</style>
