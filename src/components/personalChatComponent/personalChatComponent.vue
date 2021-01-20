<template>
  <div class="wrapBox">
    <!-- 聊天窗口 -->
    <h3 class="infoListTitle">
      <span class="item"></span>
      <span class="item title">{{ signalROptions.toLinkName }}</span>
      <span class="item"><i class="el-icon-more" v-show="!signalROptions.isErp" @click="moreEvent"></i></span>
    </h3>
    <div
      class="isOrder"
      @click="isOrderShowEvent"
      v-if="
        isOrderShow &&
        $store.state.userInfo.commparnyList &&
        $store.state.userInfo.commparnyList[0] &&
        $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
      "
    >
      <div class="wenzitxt">
        <h4 style="font-weight: 500">
          {{ options && options.messageTitle }}
        </h4>
        <p>客户名称：{{ options && options.client_na }}</p>
        <p>备注：{{ options && options.pushContent }}</p>
      </div>
      <i class="guanbi el-icon-close" @click.stop="guanbiOrder"></i>
    </div>
    <div
      class="isOrder2"
      @click="isOrderShowEvent"
      v-else-if="
        isOrderShow &&
        $store.state.userInfo.commparnyList &&
        $store.state.userInfo.commparnyList[0] &&
        $store.state.userInfo.commparnyList[0].companyType !== 'Supplier'
      "
    >
      <div class="left">
        <el-image
          fit="contain"
          :src="orderItemOptions && orderItemOptions.imgUrl[0]"
        >
          <div slot="placeholder" class="image-slot">
            <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
          </div>
          <div slot="error" class="image-slot">
            <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
          </div>
        </el-image>
      </div>
      <div class="right">
        <h3>{{ orderItemOptions.pr_na }}</h3>
        <p>货号：{{ orderItemOptions.co_nu }}</p>
      </div>
      <i class="guanbi el-icon-close" @click.stop="guanbiOrder"></i>
    </div>
    <div
      class="liaotianList"
      ref="liaotianRef"
      @scroll="liaotianScroll"
      id="liaotianchuangkou"
    >
      <div class="liaotianWarp">
        <p
          style="
            textAlign: center;
            width: 100%;
            color: #b2c3da;
            padding: 10px;
            box-sizing: border-box;
          "
          v-show="loadText && chatHistoryTotal > 10"
        >
          <i class="el-icon-loading" v-show="loadText === '加载中...'"></i>
          {{ loadText }}
        </p>
        <template v-for="(item, i) in signalROptions.showmsg">
          <div :key="i" class="liaotianItens">
            <!-- 系统消息 -->
            <center v-if="item.messageType === 'SystemPrompt'">
              <center style="font-size: 12px; color: #ccc;margin:5px 0;">
                {{ item.createdOn && dateDiff(item.createdOn) }}
              </center>
                <p style="padding: 5px 20px;border-radius:20px;background-color:#d7d7d7;display: inline-block;font-size: 12px; color: #fff">{{item.content}}</p>
              </center>
            <div v-else-if="item.fromUserId === signalROptions.orgUserID">
              <center style="font-size: 12px; color: #ccc">
                {{ item.createdOn && dateDiff(item.createdOn) }}
              </center>
              <!-- 我的消息 -->
              <div class="myInfo">
                <div class="myAvatarImg">
                    <!-- :src="$store.state.userInfo.userInfo.userImage" -->
                  <el-image
                    class="img"
                    :src="signalROptions.orgUserImage"
                    fit="cover"
                  >
                    <div slot="placeholder" class="image-slot">
                      <img
                        class="errorImg"
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                    <div slot="error" class="image-slot">
                      <img
                        class="errorImg"
                        src="~@/assets/images/imgError.jpg"
                        alt
                      />
                    </div>
                  </el-image>
                </div>
                <div class="context">
                  <div
                    id="myContent"
                    @contextmenu.prevent.stop="openEditInfo($event, item.id)"
                  >
                    <!-- 文本 -->
                    <div class="youTextInfo" v-if="item.messageType === 'Text'">
                      <span class="msgTypeText">
                        <pre>{{ item.content }}</pre>
                      </span>
                    </div>
                    <!-- 分享链接 -->
                    <div
                      class="youTextInfo"
                      v-if="item.messageType === 'Product'"
                    >
                      <div class="msgTypeProduct">
                        <div class="liaotianerweima">
                          <template v-if="item.content">
                            <vue-qr
                              :text="item.content || item.attachment"
                              colorDark="#018e37"
                              colorLight="#fff"
                              :margin="0"
                              :size="50"
                            ></vue-qr>
                          </template>
                          <el-image
                            v-else
                            style="width: 50px; height: 50px"
                            :src="require('@/assets/images/imgError.jpg')"
                          >
                          </el-image>
                        </div>
                        <div class="right">
                          <div class="context">
                            {{ item.content || item.attachment }}
                          </div>
                          <a class="see" :href="item.content" target="_blank"><i class="el-icon-view"></i>查看详情</a>
                          <div class="copy" @click="copyLink(item.id)">
                            <i class="el-icon-link"></i>复制链接
                          </div>
                          <a
                            :href="item.content"
                            :id="item.id"
                            target="_blank"
                            style="position: fixed; top: 9999px; left: 9999px"
                            >{{ item.content }}</a
                          >
                        </div>
                      </div>
                    </div>
                    <!-- 视频 -->
                    <div
                      class="msgTypeVideo"
                      v-else-if="item.messageType === 'Video'"
                    >
                      <video
                        class="video-js vjs-default-skin vjs-big-play-centered"
                        controls
                        style="object-fit: contain"
                      >
                        <source
                          ref="videoPreview"
                          :src="item.attachment"
                          :type="'video/' + $_.last(item.attachment.split('.'))"
                        />
                      </video>
                    </div>
                    <!-- 图片 -->
                    <div
                      class="msgTypeImage"
                      v-else-if="item.messageType === 'Picture'"
                    >
                      <el-image
                        fit="contain"
                        :src="item.attachment"
                        :key="item.attachment"
                        :preview-src-list="[item.attachment]"
                      >
                        <div slot="error" class="image-slot">
                          <img
                            class="errorImg"
                            src="~@/assets/images/图片加载失败.png"
                            alt
                          />
                        </div>
                      </el-image>
                    </div>
                    <!-- 音频 -->
                    <div
                      v-else-if="item.messageType === 'Voice'"
                      @click="checkMsgTypeAudio(item)"
                      class="msgTypeAudio"
                    >
                      <img
                        v-show="!item.isOpen"
                        src="~@/assets/images/暂停.png"
                        alt
                      />
                      <img
                        v-show="item.isOpen"
                        src="~@/assets/images/播放.gif"
                        alt
                      />
                      <audio
                        :ref="'myAudio' + item.attachment"
                        :src="item.attachment"
                        @ended="ended"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                    <!-- file文件 -->
                    <a
                      v-else-if="item.messageType === 'file'"
                      :href="item.attachment"
                      :download="$_.last(item.attachment.split('/'))"
                      target="_blank"
                      class="msgTypeTXT"
                    >
                      <div class="title">附件：</div>
                      <p>{{ $_.last(item.attachment.split("/")) }}</p>
                    </a>
                    <!-- 即时语音功能 -->
                    <div
                      style="width: 285px; padding: 10px; color: #b2b2b2"
                      v-else-if="item.messageType === 'InstantVoice'"
                    >
                      <center>暂无即时语音功能</center>
                    </div>
                    <!-- 即时视频功能 -->
                    <div
                      style="width: 285px; padding: 10px; color: #b2b2b2"
                      v-else-if="item.messageType === 'TimeVideo'"
                    >
                      <center>暂无即时视频功能</center>
                    </div>
                  </div>
                  <!-- 打开操作消息 -->
                  <div class="myChehui" v-show="item.id === isChehui">
                    <div
                      class="item"
                      v-if="item.messageType === 'Text'"
                      @click="copyInfo(item)"
                    >
                      复制
                    </div>
                    <div
                      class="item"
                      v-if="item.messageType !== 'Voice'"
                      @click="forwardInfo(item)"
                    >
                      转发
                    </div>
                    <div class="item" @click="withdrawInfo(item)">撤回</div>
                    <div class="item" @click="deleteInfo(item)">删除</div>
                  </div>

                  <!-- 群发已读未读 | 单聊已读未读 -->
                  <template v-if="signalROptions.isGroup">
                    <div class="unRead" v-show="item.unreadCout">
                      {{ isShowReady(item) }}人未读
                    </div>
                    <div class="read" v-show="!item.unreadCout">全部已读</div>
                  </template>

                  <template v-else>
                    <div class="read" v-show="!item.unreadCout">已读</div>
                    <div class="unRead" v-show="isShowReady(item)">未读</div>
                  </template>
                </div>
              </div>
            </div>
            <div v-else>
              <center style="font-size: 12px; color: #ccc">
                {{ item.createdOn && dateDiff(item.createdOn) }}
              </center>
              <!-- 你的消息 -->
              <div class="youInfo">
                <div class="myAvatarImg">
                  <el-image class="img" :src="item.userImage" fit="cover">
                    <div
                      slot="placeholder"
                      class="image-slot"
                      style="
                        width: 100%;
                        height: 100%;
                        backgroundcolor: #165af7;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrap;
                      "
                    >
                      {{ item.linkName }}
                    </div>
                    <div
                      slot="error"
                      class="image-slot"
                      style="
                        width: 100%;
                        height: 100%;
                        backgroundcolor: #165af7;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrap;
                      "
                    >
                      {{ item.linkName }}
                    </div>
                  </el-image>
                </div>
                <div class="context">
                  <div class="youInfoName">{{ item.linkName }}</div>
                  <div
                    id="myContent"
                    @contextmenu.prevent.stop="openEditInfo($event, item.id)"
                  >
                    <!-- 文本 -->
                    <div class="youTextInfo" v-if="item.messageType === 'Text'">
                      <span class="msgTypeText">
                        <pre>{{ item.content }}</pre>
                      </span>
                    </div>
                    <!-- 分享链接 -->
                    <div
                      class="msgTypeProduct"
                      v-else-if="item.messageType === 'Product'"
                    >
                      <div class="liaotianerweima">
                        <template v-if="item.content">
                          <vue-qr
                            :text="item.content"
                            colorDark="#018e37"
                            colorLight="#fff"
                            :margin="0"
                            :size="50"
                          ></vue-qr>
                        </template>
                        <el-image
                          v-else
                          style="width: 50px; height: 50px"
                          :src="require('@/assets/images/imgError.jpg')"
                        >
                        </el-image>
                      </div>
                      <div class="right">
                        <div class="context">
                          {{ item.attachment || item.content }}
                        </div>
                        <a class="see" :href="item.content" target="_blank"
                          ><i class="el-icon-view"></i>查看详情</a
                        >
                        <div class="copy" @click="copyLink(item.id)">
                          <i class="el-icon-link"></i>复制链接
                        </div>
                        <a
                          :href="item.content"
                          :id="item.id"
                          target="_blank"
                          style="position: fixed; top: 9999px; left: 9999px"
                          >{{ item.content }}</a
                        >
                      </div>
                      <!-- <pre>{{ item.content }}</pre> -->
                    </div>
                    <!-- 视频 -->
                    <div
                      class="msgTypeVideo"
                      v-else-if="item.messageType === 'Video'"
                    >
                      <video
                        class="video-js vjs-default-skin vjs-big-play-centered"
                        controls
                        style="object-fit: cover"
                      >
                        <source
                          ref="videoPreview"
                          :src="item.attachment"
                          :type="'video/' + $_.last(item.attachment.split('.'))"
                        />
                      </video>
                    </div>
                    <!-- 图片 -->
                    <div
                      class="msgTypeImage"
                      v-else-if="item.messageType === 'Picture'"
                    >
                      <el-image
                        fit="contain"
                        :src="item.attachment"
                        :key="item.attachment"
                        :preview-src-list="[item.attachment]"
                      >
                        <div slot="error" class="image-slot">
                          <img
                            class="errorImg"
                            src="~@/assets/images/图片加载失败.png"
                            alt
                          />
                        </div>
                      </el-image>
                    </div>
                    <!-- 音频 -->
                    <div
                      v-else-if="item.messageType === 'Voice'"
                      @click="checkMsgTypeAudio(item)"
                      class="msgTypeAudio"
                    >
                      <img
                        v-show="!item.isOpen"
                        src="~@/assets/images/暂停.png"
                        alt
                      />
                      <img
                        v-show="item.isOpen"
                        src="~@/assets/images/播放.gif"
                        alt
                      />
                      <audio
                        :ref="'myAudio' + item.attachment"
                        :src="item.attachment"
                        @ended="ended"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                    <!-- file文件 -->
                    <!-- @click="openPreview(item)" -->
                    <a
                      v-else-if="item.messageType === 'file'"
                      :href="item.attachment"
                      :download="$_.last(item.attachment.split('/'))"
                      target="_blank"
                      class="msgTypeTXT"
                    >
                      <div class="title">附件：</div>
                      <p>{{ $_.last(item.attachment.split("/")) }}</p>
                    </a>
                    <!-- 即时语音功能 -->
                    <div
                      style="width: 250px; padding: 10px; color: #b2b2b2"
                      v-else-if="item.messageType === 'InstantVoice'"
                    >
                      <center>暂无即时语音功能</center>
                    </div>
                    <!-- 即时视频功能 -->
                    <div
                      style="width: 250px; padding: 10px; color: #b2b2b2"
                      v-else-if="item.messageType === 'TimeVideo'"
                    >
                      <center>暂无即时视频功能</center>
                    </div>
                  </div>
                  <div class="myChehui" v-show="item.id === isChehui">
                    <div
                      class="item"
                      v-if="item.messageType === 'Text'"
                      @click="copyInfo(item)"
                    >
                      复制
                    </div>
                    <div
                      class="item"
                      v-if="item.messageType !== 'Voice'"
                      @click="forwardInfo(item)"
                    >
                      转发
                    </div>
                    <div class="item" @click="deleteInfo(item)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="infoListSend">
      <div
        class="maikef el-icon-microphone"
        @click="recOpen(true)"
        v-show="!isShowRec"
      ></div>
      <div
        class="maikef iconfont icon-dakaijianpan"
        @click="recOpen(false)"
        v-show="isShowRec"
      ></div>
      <div
        class="sendValueInput"
        v-show="!isShowRec"
        @contextmenu.prevent.stop="OpenPaste"
      >
      <!-- type="textarea"
          :rows="2"
          resize="none"
          autocomplete="off" -->
        <el-input
          v-model="signalROptions.value"
          ref="sendMessageRef"
          class="sendValue"
          @keyup.native.prevent="sendMessage"
          :maxlength="globalJson.MessageRestriction && globalJson.MessageRestriction[6].itemCode"
        ></el-input>
        <div class="pasteIten" v-show="isPaste" @click="pasteInfo($event)">
          粘贴
        </div>
      </div>
      <el-button
        class="sendValueBtn"
        plain
        v-show="isShowRec"
        @click="showDeleteButton"
        :style="{ backgroundColor: sendRec ? '#fff' : '#ecf5ff' }"
      >
        <span v-show="sendRec">{{ sendRec }}</span>
        <img
          v-show="!sendRec"
          src="~@/assets/images/录音.gif"
          alt
          width="100%"
          style="vertical-align: top; height: 50px"
        />
      </el-button>

      <i class="iconfont icon-746bianjiqi_biaoqing"></i>
      <i class="iconfont el-icon-circle-plus-outline sendfiles">
        <input
          type="file"
          title
          ref="refFileInput"
          @change="changeFiless"
          class="fileInput"
          :accept="
            globalJson.MessageRestriction &&
            globalJson.MessageRestriction[2].itemCode +
              ',' +
              globalJson.MessageRestriction[3].itemCode +
              ',' +
              globalJson.MessageRestriction[4].itemCode +
              ',' +
              globalJson.MessageRestriction[0].itemCode
          "
        />
      </i>
      <div class="sendBtnBox">
        <transition name="show">
          <el-button
            class="sendBtn"
            @click="sendMessages"
            v-show="signalROptions.value"
            size="mini"
            >发送</el-button
          >
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueQr from 'vue-qr'
import Recorder from 'recorder-core/recorder.mp3.min'
export default {
  props: ['options', 'signalROptions', 'Json'],
  components: {
    VueQr
  },
  data () {
    return {
      globalJson: {},
      MessageUnreadCount: [],
      orderSampleFrom: null,
      chatHistoryCurrentPage: 1,
      chatHistoryPageSize: 15,
      chatHistoryTotal: 0,
      isChehui: null,
      sendRec: null,
      isPaste: null,
      isShowRec: false,
      isOrderShow: false,
      loadText: null,
      noScrollTop: false
    }
  },
  methods: {
    // 初始化消息立即沟通
    async showLiaotianr () {
      this.$store.commit('clearWsMsg')
      if (this.options) {
        this.signalROptions.isGroup = this.options.isGroup
        this.signalROptions.toLinkName = this.options.linkName || this.options.linkman
        this.signalROptions.toUserImage = this.options.userImage || this.signalROptions.toUserImage
        this.signalROptions.toUserID = this.options.toUserID || this.options.id
        this.signalROptions.toCompanyID = this.options.companyId || this.options.companyID
        this.signalROptions.groupNumber = this.options.groupNumber
        this.signalROptions.orderNumber = this.options.orderNumber
        this.signalROptions.msgType = 'Text'
        this.isOrderShow = this.options.isOrderShow || false
      }
      // 适配全局系统参数
      if (this.Json) {
        this.globalJson = (this.Json ? this.Json : this.$store.state.globalJson.Json)
      }
      console.log(this.options, this.signalROptions, 999)
      try {
        this.addChannel() // 加入深网频道
      } catch (error) {
        this.$message.warning('断线重连')
      }
      // 连接ws
      if (this.signalROptions.groupNumber) {
        if (this.$setWs.$ws) this.$setWs.$ws.close()
        this.$store.commit('setWsId', this.signalROptions.groupNumber)
        this.$setWs.initWebSocket()
        console.log(this.$setWs)
      }
      // 获取聊天记录
      const res = await this.getInstantMessageByNumber()
      if (res.data.result.code === 200) {
        this.signalROptions.showmsg = res.data.result.item.items
        this.chatHistoryTotal = res.data.result.item.totalCount
      } else {
        this.CompanyDetail = []
      }
      this.$root.eventHub.$emit('resetAllMessagesCount')
      this.$root.eventHub.$emit('resetData')
    },
    // 撤回消息
    async withdrawInfo (item) {
      try {
        const res = await this.$http.post('/api/UpdateWithdrawMessage', {
          id: item.id,
          isDelete: true,
          groupNumber: item.groupNumber,
          isWithdraw: true,
          companyID: item.companyId,
          fromUserID: item.fromUserId
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 转发消息
    forwardInfo (item) {
      console.log(item)
    },
    // 打开编辑聊天消息
    openEditInfo (e, id) {
      this.noScrollTop = true
      this.isPaste = null
      this.isChehui = id
      const x = e.layerX // 鼠标left位置
      const y = e.layerY // 鼠标top位置
      this.copyDOM = $(e.target).offsetParent()
      this.copyDOM
        .offsetParent()
        .children('.myChehui')
        .css({ left: x, top: y })
    },
    // 复制消息
    copyInfo (item) {
      switch (item.messageType) {
        case 'Text':
          this.copyContact()
          break
      }
    },
    // 复制文字方法
    copyContact (contat) {
      window.getSelection().removeAllRanges()
      const range = document.createRange()
      range.selectNode(this.copyDOM[0])
      this.copyText = this.copyDOM[0].innerText
      window.getSelection().addRange(range)
      try {
        const successful = document.execCommand('copy')
        if (successful) this.$message.success('复制成功')
        else this.$message.error('复制失败')
      } catch (error) {
        this.$message.error('复制失败')
      }
    },
    // 打开粘贴
    OpenPaste (e) {
      this.isChehui = null
      this.isPaste = true
      const x = e.layerX // 鼠标left位置
      const y = e.layerY // 鼠标top位置
      $(e.target)
        .offsetParent()
        .children('.pasteIten')
        .css({ left: x, top: y })
    },
    // 粘贴
    pasteInfo () {
      if (window.clipboardData) {
        this.signalROptions.value = window.clipboardData.getData('Text')
      } else {
        this.signalROptions.value = this.copyText
        // clipboardData.setData("Text", range.text);
        // document.all.pp.value = clipboardData.getData("Text");
      }
    },
    // 判断单聊群聊 查看明细
    moreEvent () {
      const option = this.$_.cloneDeepWith(this.signalROptions)
      option.componentName = 'chatSettingsComponent' // 单聊
      if (this.signalROptions.isGroup) { // 群聊
        option.componentName = 'chatInformationComponent'
      }
      this.$emit('openTwoView', option)
    },
    // 深网加入频道
    async addChannel () {
      if (!this.signalROptions.groupNumber) {
        return false
      }
      if (this.signalROptions.creatChannel) {
        this.signalROptions.creatChannel.leave()
      }
      try {
        // 创建频道
        this.signalROptions.creatChannel = this.signalROptions.client.createChannel(
          this.signalROptions.groupNumber // 此处传入频道 ID// 加入频道
        )
        const error = await this.signalROptions.creatChannel.join()
        if (error) {
          /* 加入频道失败的处理逻辑 */
          console.log('加入频道失败', error)
          this.$root.eventHub.$emit('resetLogin') // 重新登录
          this.$nextTick(() => this.addChannel())
        } else {
          /* 加入频道成功的处理逻辑 */
          console.log('加入频道成功')
          await this.getMembers()
        }
        // 接收频道消息
        this.signalROptions.creatChannel.on(
          'ChannelMessage',
          async ({ text }, senderId) => {
            // text 为收到的频道消息文本，senderId 为发送方的 User ID
            /* 远端用户收到消息的处理逻辑 */
            // this.$message.success("我收到了频道消息");
            console.log('我收到了频道消息啊哈哈哈哈')
            this.chatHistoryCurrentPage = 1
            const res = await this.getInstantMessageByNumber(
              this.signalROptions.groupNumber
            )
            if (res.data.result.code === 200) {
              this.signalROptions.showmsg = res.data.result.item.items
              this.chatHistoryTotal = res.data.result.item.totalCount
            } else {
              // 订单点击立即沟通拿不到groupNumber，所以没有聊天记录
              this.CompanyDetail = []
            }
            this.$root.eventHub.$emit('resetData')
          }
        )
      } catch (err) {
        this.$message.closeAll()
        this.$root.eventHub.$emit('resetRTM')
        this.$message.success('断线重连成功')
      }
    },
    // 根据GroupNumber 查询所有的聊天记录
    async getInstantMessageByNumber () {
      const fd = {
        skipCount: this.chatHistoryCurrentPage,
        maxResultCount: this.chatHistoryPageSize,
        groupNumber: this.signalROptions.groupNumber,
        ToCompanyId: this.signalROptions.toCompanyID,
        ToUserId: this.signalROptions.toUserID,
        isGroup: this.signalROptions.isGroup,
        orderNumber: this.signalROptions.orderNumber
      }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      return await this.$http.post('/api/GetInstantMessageByNumber', fd)
    },
    // 聊天窗口订单事件
    isOrderShowEvent () {
      var fd = this.$_.cloneDeepWith(this.options)
      fd.componentName = 'orderDetailComponent'
      this.$emit('openTwoView', fd)
    },
    // 深网获取群成员
    async getMembers () {
      this.signalROptions.channelMember = await this.signalROptions.creatChannel.getMembers()
      console.log(this.signalROptions.channelMember, 111)
    },
    // 深网退出频道
    signChannel () {
      this.signalROptions && this.signalROptions.creatChannel && this.signalROptions.creatChannel.leave()
    },
    // 即时通讯发消息
    async sendMessage (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.signalROptions.value += '\n' // 换行
      } else if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
        this.noScrollTop = false
        if (
          this.signalROptions.msgType === 'Text' &&
          !this.signalROptions.value
        ) {
          this.signalROptions.value = null
          this.$message.error('发送内容不能为空')
          return
        }
        // 判断是不是发送的链接http带头
        if (/^(http:\/\/)|(https:\/\/)|(www\.)/.test(this.signalROptions.value)) {
          this.signalROptions.msgType = 'Product'
          this.signalROptions.attachment = this.signalROptions.value
        }
        try {
          const res = await this.createMessageAccept()
          this.signalROptions.showmsg.push(res.data.result.item)
          this.signalROptions.value = ''

          if (res.data.result.code === 200) {
            this.signalROptions.groupNumber = res.data.result.item.groupNumber
            // 加入深网频道
            try {
              await this.getMembers()
            } catch (error) {
              await this.addChannel()
            }
            const re = await this.$http.post('/api/UpdateMessageMemberActivate', {
              GroupNumber: this.signalROptions.groupNumber,
              UIDList: this.signalROptions.channelMember
            })
            this.sendMsg(res.data.result.item) // 深网发消息
          }
          this.$root.eventHub.$emit('resetData')
        } catch (error) {
          this.$root.eventHub.$emit('resetRTM')
          this.$message.success('断线重连成功Two')
        }

        this.signalROptions.value = null
        this.signalROptions.attachment = null
        this.signalROptions.msgType = 'Text'
        this.$refs.refFileInput.value = ''
        e.preventDefault()
      }
    },
    // 个推送
    async GeSendPush (item, toUserID, number) {
      const obj = {
        callType: number,
        channelId: item.groupNumber,
        userAvatar: item.userImage,
        userId: toUserID,
        userName: item.linkName
      }
      try {
        const res = await this.$http.post('/api/GeSendPush', {
          UserId: toUserID,
          Title: '您有一条新的消息',
          Description: item.content || item.attachment,
          ExtraBody: item.content || item.attachment,
          ActionData: JSON.stringify(obj)
        })
        if (res.data.result.code === 200) {
          console.log('推送成功')
        } else {
          this.$message.error(res.data.result.message)
        }
      } catch (error) {
        console.log('推送失败')
      }
    },
    // 发送点对点或频道消息
    sendMsg (item) {
      // 加入频道成功后可发送频道消息
      if (item) {
        item.linkName = this.signalROptions.orgLinkName
        item.userImage = this.signalROptions.orgUserImage
        let toUserIDList = []
        for (let i = 0; i < item.toUserList.length; i++) {
          // 判断如果不在频道内
          if (
            !this.signalROptions.channelMember.includes(item.toUserList[i].uid)
          ) {
            // 如果不在频道内并且有uid
            if (item.toUserList[i].uid) {
              // 发送点对点消息
              console.log('发送了点对点')
              this.sendPeerToPeer(JSON.stringify(item), item.toUserList[i].uid)
            }
          } else {
            // 在频道内的
            toUserIDList.push(item.toUserList[i].toUserID)
          }
        }
        // 先去重 后去掉在频道内的
        const newobj = {}
        const arr = item.toUserList.reduce((preVal, curVal) => {
        /* eslint-disable */
          newobj[curVal.toUserID]
            ? ''
            : (newobj[curVal.toUserID] = preVal.push(curVal))
          return preVal
        }, [])
        // 发推送
        toUserIDList = JSON.stringify(toUserIDList)
        for (let i = 0; i < arr.length; i++) {
          if (!toUserIDList.includes(arr[i].toUserID)) {
            this.GeSendPush(item, arr[i].toUserID, 3)
          }
        }

        this.$root.eventHub.$emit('UpdateOrgPersonnel')
        // 在不在频道内都发频道消息
        this.signalROptions.creatChannel
          .sendMessage({ text: JSON.stringify(item) })
          .then(() => {
            /* 频道消息发送成功的处理逻辑 */
            console.log('频道消息发送成功')
          })
          .catch(error => {
            /* 频道消息发送失败的处理逻辑 */
            this.$message.error('频道消息发送失败')
          })
      }
    },
    // 发送点对点消息
    sendPeerToPeer (content, toUserID) {
      this.signalROptions.client
        .sendMessageToPeer(
          { text: content }, // 符合 RtmMessage 接口的参数对象
          toUserID // 远端用户 ID
        )
        .then(sendResult => {
          if (sendResult.hasPeerReceived) {
            /* 远端用户收到消息的处理逻辑 */
            this.$message.closeAll()
            console.log('远端用户收到我发送的消息')
          } else {
            /* 服务器已接收、但远端用户不可达的处理逻辑 */
            console.log('服务器已接收点对点消息、但远端用户不可达的处理')
          }
        })
        .catch(error => {
          console.log(error)
          /* 发送失败的处理逻辑 */
          this.$message.error('发送失败')
        })
    },
    // 即时通讯发消息
    async sendMessages () {
      this.noScrollTop = false
      if (
        this.signalROptions.msgType === 'Text' &&
        !this.signalROptions.value
      ) {
        this.signalROptions.value = null
        this.$message.error('发送内容不能为空')
        return
      }
      if (/^(http:\/\/)|(https:\/\/)|(www\.)/.test(this.signalROptions.value)) {
        this.signalROptions.msgType = 'Product'
        this.signalROptions.attachment = this.signalROptions.value
      }
      try {
        const res = await this.createMessageAccept()
        this.signalROptions.showmsg.push(res.data.result.item)
        this.signalROptions.value = ''
        if (res.data.result.code === 200) {
          this.signalROptions.groupNumber = res.data.result.item.groupNumber
          // 加入深网频道
          try {
            await this.getMembers()
          } catch (error) {
            await this.addChannel()
          }
          const re = await this.$http.post('/api/UpdateMessageMemberActivate', {
            GroupNumber: this.signalROptions.groupNumber,
            UIDList: this.signalROptions.channelMember
          })
          this.sendMsg(res.data.result.item) // 深网发消息
        }
        this.$root.eventHub.$emit('resetData')
      } catch (error) {
        this.$root.eventHub.$emit('resetLogin')
      }
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      this.signalROptions.msgType = 'Text'
      this.$refs.refFileInput.value = ''
    },
    // 创建 发送聊天
    async createMessageAccept () {
      const fd = {
        MessageType: this.signalROptions.msgType, // 消息类型；Text文字 Picture图片  Video视频 Voice语音  InstantVoice即时语音 TimeVideo即时视频
        Attachment: this.signalROptions.attachment, // 图片地址
        IsGroup: this.signalROptions.isGroup, // 是否是群聊；false点对点 true 群聊
        ToUserId: this.signalROptions.toUserID, // 接收人id
        ToCompanyId: this.signalROptions.toCompanyID, // 接收人公司id
        Content: this.signalROptions.value, // 文本内容
        Platform: 'PC', // 终端
        OrderNumber: this.signalROptions.orderNumber,
        GroupNumber: this.signalROptions.groupNumber
      }
      for (const key in fd) {
        if (!fd[key]) delete fd[key]
      }
      return await this.$http.post('/api/CreateMessageAccept', fd)
    },
    // 复制聊天窗口链接地址
    copyLink(id) {
      var link = document.getElementById(id)
      var range
      if (document.body.createTextRange) {
        range = document.body.createTextRange()
        range.moveToElementText(link)
        range.select()
      } else if (window.getSelection) {
        var selection = window.getSelection()
        range = document.createRange()
        console.log(range.text, range.htmlText);
        range.selectNodeContents(link)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        console.warn('none')
      }
      document.execCommand('Copy') // 执行浏览器复制命令
      // console.warn('none')
      this.$message.success('已复制好，可贴粘。')
    },
    // 点击预览二维码大图
    openErweima () {
      this.showErweimaViewer = true
    },
    // 点击关闭二维码大图
    closeErweimaViewer () {
      this.showErweimaViewer = false
    },
    // 选择发送文件
    async changeFiless (e) {
      this.signalROptions.value = null
      this.signalROptions.attachment = null
      const file = e.target.files && e.target.files[0]
      const type = this.$_.first(file.type.split('/'))
      switch (type) {
        case 'application':
          this.signalROptions.msgType = 'file'
          break
        case 'text':
          this.signalROptions.msgType = 'file'
          break
        case 'video':
          this.signalROptions.msgType = 'Video'
          break
        case 'image':
          this.signalROptions.msgType = 'Picture'
          break
      }
      const res = await this.upLoadFiles(file)
      if (res.data.result.code === 200) {
        this.signalROptions.attachment = res.data.result.object[0].filePath
        this.sendMessages()
      } else {
        this.$message.error('上传失败，请检查网络')
      }
    },
    // 上传文件
    async upLoadFiles (file) {
      const fd = new FormData()
      fd.append('fileType', this.signalROptions.msgType)
      fd.append('fileName', file.name)
      fd.append('file', file)
      return await this.$http.post('/api/File/MessageUploadFile', fd)
    },
    // 开始录音|录制完成发送语音
    showDeleteButton () {
      try {
        if (this.sendRec === '点击录制语音') {
          this.rec.start()
        } else {
          this.recEnd()
        }
      } catch (error) {
        this.$message.error('需要https才能实现这个功能')
      }

      this.sendRec = this.sendRec === '点击录制语音' ? null : '点击录制语音'
    },
    // 初始化录音功能
    initRec () {
      // 一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
      this.rec = Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16 // mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
      })
      this.rec.open()
    },
    // 选择录音
    recOpen (flag) {
      console.log(flag)
      this.isShowRec = flag
      this.sendRec = '点击录制语音'
      if (flag) {
        this.initRec()
        console.log(this.rec)
      } else this.rec.close()
    },
    // 结束录音
    recEnd () {
      const TestApi = '/api/File/MessageUploadFile' // 用来在控制台network中能看到请求数据，测试的请求结果无关紧要
      const _that = this
      this.rec.stop(
        function (blob, duration) {
          // 录音结束时拿到了blob文件对象，可以用FileReader读取出内容，或者用FormData上传
          const api = TestApi
          /** *方式二：使用FormData用multipart/form-data表单上传文件***/
          const form = new FormData()
          form.append('upfile', blob, 'recorder.mp3') // 和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.mp3
          _that.$http.post(api, form).then((result) => {
            if (result.data.result.code === 200) {
              _that.signalROptions.value = null
              _that.signalROptions.msgType = 'Voice'
              _that.signalROptions.attachment =
                result.data.result.object[0].filePath
              _that.sendMessages()
            } else {
              _that.$message.error('发送失败，请检查网络')
            }
          })
        },
        function (msg) {
          this.$message.error('录音失败:' + msg)
        }
      )
    },
    // 语音播放完事件
    ended () {
      this.audioItem.isOpen = false
      this.audioItem = null
      this.$nextTick(() => {
        this.noScrollTop = false
      })
    },
    // 点击听语音
    checkMsgTypeAudio (val) {
      this.noScrollTop = true
      if (!val.isOpen) {
        console.log(this.$refs['myAudio' + val.attachment][0])
        this.$refs['myAudio' + val.attachment][0].play()
        this.$set(val, 'isOpen', true)
        if (this.audioItem) {
          this.$refs['myAudio' + this.audioItem.attachment][0].pause()
          this.$refs['myAudio' + this.audioItem.attachment][0].load()
          this.audioItem.isOpen = false
          this.audioItem = null
        }
        this.audioItem = val
      } else {
        console.log(this.$refs['myAudio' + val.attachment][0])
        this.$refs['myAudio' + val.attachment][0].pause()
        this.$refs['myAudio' + val.attachment][0].load()
        this.$set(val, 'isOpen', false)
        this.audioItem = null
        this.$nextTick(() => {
          this.noScrollTop = false
        })
      }
    },
    // 聊天窗口列表事件
    guanbiOrder () {
      this.isOrderShow = false
    },
    // 聊天滚动查看历史记录
    async liaotianScroll (e) {
      const topJuli = e.target.scrollTop
      const warpHeight = $('.liaotianWarp').innerHeight()
      if (this.timeID) clearTimeout(this.timeID)
      this.timeID = setTimeout(async () => {
        if (topJuli === 0) {
          this.noScrollTop = true
          this.loadText = '加载中...'
          if (this.timeID) clearTimeout(this.timeID)
          this.timeID = setTimeout(async () => {
            if (this.signalROptions.showmsg.length >= this.chatHistoryTotal) {
              this.noScrollTop = true
              this.loadText = '没有更多聊天记录了'
              this.$nextTick(() => {
                this.noScrollTop = false
              })
              return false
            }
            this.chatHistoryCurrentPage++
            const res = await this.getInstantMessageByNumber()
            if (res.data.result.code === 200) {
              this.loadText = null
              const list = res.data.result.item.items
              for (let i = list.length - 1; i >= 0; i--) {
                this.signalROptions.showmsg.unshift(list[i])
              }
              this.chatHistoryTotal = res.data.result.item.totalCount
              this.$nextTick(() => {
                e.target.scrollTop =
                  $('.liaotianWarp')[0].offsetHeight - warpHeight

                this.noScrollTop = false
              })
            }
          }, 1000)
        }
      }, 500)
    },
    // 显示已读未读
    isShowReady (item) {
      if (this.MessageUnreadCount) {
        if (this.MessageUnreadCount.length) {
          for (let i = 0; i < this.MessageUnreadCount.length; i++) {
            if (this.MessageUnreadCount[i].MessageID === item.id) {
              item.unreadCout = this.MessageUnreadCount[i].Count
              return item.unreadCout
            }
          }
        } else {
          item.unreadCout = 0
        }
      } else {
        return item.unreadCout
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
    document.onclick = () => {
      this.isChehui = null
      this.isPaste = null
    }
    document.oncontextmenu = () => {
      this.isChehui = null
      this.isPaste = null
      return false
    }
  },
  mounted () {
    this.showLiaotianr()
  },
  computed: {
    updateLiaotian () {
      return this.signalROptions.showmsg
    },
    getWsMsg () {
      return this.$store.state.wsMsg
    },
  },
  watch: {
    // 监听订单长连接推送消息
    '$store.state.wsOrderMsg' (val) {
      this.orderSampleFrom = val
    },
    getWsMsg: function (data) {
      if (data) {
        data = JSON.parse(data)
      }
      if (
        data &&
        data.action === 'MessageUnreadCount' &&
        data.SendClientId === this.signalROptions.groupNumber
      ) {
        // 长连接接收到未读消息
        this.MessageUnreadCount = JSON.parse(data.content).UnreadCountList
        // 长连接接收到
        console.log('长连接接收到消息', this.MessageUnreadCount)
      }
    },
    // 聊天窗口滚动到底部
    updateLiaotian (msgList) {
      if (msgList && msgList.length && !this.noScrollTop) {
        $('#liaotianchuangkou')
          .stop()
          .animate(
            {
              scrollTop:
                $('#liaotianchuangkou')[0] &&
                $('#liaotianchuangkou')[0].scrollHeight +
                  $('#liaotianchuangkou')[0].offsetHeight
            },
            500
          )
      }
    }
  },
   beforeDestroy(){
    this.signChannel()
    this.$setWs.$ws && this.$setWs.$ws.close()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox {
  width: 100%;
  height: 827px;
  position: relative;
  .infoListTitle {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    padding: 0 10px;
    box-sizing: border-box;
    background: linear-gradient(#ccc, #fff, #a5b6c8, #7f90c5);
    .title{
      flex: 1;
      text-align: center;
    }
    .item {
      &:first-of-type{
        width: 19px;
      }
      &:last-of-type {
        width: 19px;
        text-align: right;
        i{
          cursor: pointer;
        }
      }
    }
  }
  .isOrder {
    position: absolute;
    width: 96%;
    left: 50%;
    top: 50px;
    transform: translate(-50%, 0);
    border: 1px solid #73add8;
    border-radius: 20px;
    background-color: rgba(230, 230, 230, 0.9);
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px;
    z-index: 1;
    cursor: pointer;
    .guanbi {
      display: block;
      width: 15px;
      height: 15px;
      border: 1px solid #ccc;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 15px;
      &:hover {
        color: #2c97ff;
        border-color: #2c97ff;
      }
    }
    .tupian {
      width: 60px;
      height: 60px;
      background-color: #ddd;
      border-radius: 20px;
      overflow: hidden;
      .el-image {
        width: 60px;
        height: 60px;
      }
    }
    .wenzitxt {
      flex: 1;
      color: #273d6c;
      padding: 0 20px 0 10px;
      h4 {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      p {
        color: black;
        font-size: 12px;
        margin-top: 3px;
      }
      &:last-of-type p {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .isOrder2 {
    position: absolute;
    width: 96%;
    left: 50%;
    top: 50px;
    transform: translate(-50%, 0);
    border: 1px solid #73add8;
    border-radius: 20px;
    background-color: rgba(230, 230, 230, 0.9);
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px;
    z-index: 1;
    cursor: pointer;
    .left {
      width: 80px;
      height: 80px;
      @{deep} .el-image {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        img {
          width: 80px;
          height: 80px;
          transition: all 1s;
        }
      }
    }
    .right {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h3 {
        color: #165af7;
      }
    }
    .guanbi {
      display: block;
      width: 15px;
      height: 15px;
      border: 1px solid #ccc;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 15px;
      &:hover {
        color: #2c97ff;
        border-color: #2c97ff;
      }
    }
  }
  .liaotianList {
    height: 715px;
    padding: 0 10px 10px 10px;
    font-size: 14px;
    box-sizing: border-box;
    /** 单独为横向和竖向设置滚动条 **/
    overflow-x: none;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .liaotianWarp {
      position: relative;
      .youInfo,
      .myInfo {
        min-height: 60px;
        box-sizing: border-box;
        align-items: center;
        padding: 10px 0;
        color: #555;
        letter-spacing: 1px;
        .context {
          position: relative;
          &::after {
            content: "";
            display: block;
            overflow: hidden;
            height: 0;
            clear: both;
          }
          #myContent {
            position: relative;
          }
          .myChehui {
            position: absolute;
            width: 75px;
            font-size: 12px;
            left: 0;
            top: 0;
            color: #000;
            // border-radius: 5px;
            background-color: #fff;
            box-sizing: border-box;
            z-index: 1;
            border: 1px solid #c4c4c4;
            box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
            cursor: pointer;
            .item {
              padding: 5px;
              text-align: center;
              &:hover {
                background-color: #e2e2e2;
              }
              // &:first-of-type {
              //   border-top-left-radius: 5px;
              //   border-top-right-radius: 5px;
              // }
              // &:last-of-type {
              //   border-bottom-left-radius: 5px;
              //   border-bottom-right-radius: 5px;
              // }
            }
          }
        }
      }
      .youInfo {
        .myAvatarImg {
          float: left;
          .el-image {
            transition: all 1s;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          &::after {
            content: "";
            display: block;
            height: 0;
            overflow: hidden;
            clear: both;
          }
        }
        .context {
          float: left;
          margin-left: 10px;
          max-width: 285px;
          .youInfoName {
            font-size: 14px;
            padding-bottom: 5px;
            color: #b2b2b2;
          }
          .youTextInfo {
            max-width: 282px;
            min-height: 32px;
            min-width: 32px;
            display: inline-block;
            box-sizing: border-box;
            background: linear-gradient(#fff, #d2d2d2, #d2d2d2, #aaa);
            border: 1px solid #d2d2d2;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            color: #000;
            border-radius: 10px;
            padding: 5px 10px;
            .msgTypeText {
              word-wrap: break-word;
              word-break: break-all;
              pre {
                line-height: 20px;
                white-space: pre-wrap; /* css3.0 */
                white-space: -moz-pre-wrap; /* Firefox */
                white-space: -pre-wrap; /* Opera 4-6 */
                white-space: -o-pre-wrap; /* Opera 7 */
                word-wrap: break-word; /* Internet Explorer 5.5+ */
              }
            }
            &::before {
              content: "";
              display: block;
              border-bottom: 9px solid transparent;
              border-right: 9px solid #d2d2d2;
              border-top: 9px solid transparent;
              position: absolute;
              left: -8px;
              top: 15px;
              transform: translate(0, -50%);
              width: 0;
              height: 0;
            }
          }
          .msgTypeVideo {
            width: 285px;
            height: 150px;
            left: 50px;
            top: -30px;
            .video-js {
              width: 100%;
              height: 100%;
            }
          }
          .msgTypeProduct {
            float: right;
            width: 285px;
            min-height: 90px;
            box-sizing: border-box;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(#f7f7f7, #fff);
            box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
            border: 1px solid #f7f7f7;
            color: #000;
            border-radius: 10px;
            padding: 5px 10px;
            &::after {
              clear: both;
              content: "";
              display: block;
              border-bottom: 9px solid transparent;
              border-right: 9px solid #f7f7f7;
              border-top: 9px solid transparent;
              position: absolute;
              left: -8px;
              top: 15px;
              transform: translate(0, -50%);
              width: 0;
              height: 0;
            }
            .liaotianerweima {
              width: 50px;
              height: 50px;
              border: 1px solid #dfe6f8;
            }
            // pre {
            //   line-height: 20px;
            //   white-space: pre-wrap; /* css3.0 */
            //   white-space: -moz-pre-wrap; /* Firefox */
            //   white-space: -pre-wrap; /* Opera 4-6 */
            //   white-space: -o-pre-wrap; /* Opera 7 */
            //   word-wrap: break-word; /* Internet Explorer 5.5+ */
            // }
            .right {
              flex: 1;
              position: relative;
              box-sizing: border-box;
              .context {
                width: 200px;
                margin-left: 10px;
                display: -webkit-box;
                overflow: hidden;
                white-space: normal !important;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .see,
              .copy {
                position: absolute;
                bottom: -20px;
                font-size: 12px;
                color: #165af7;
                cursor: pointer;
              }
              .see {
                right: 90px;
              }
              .copy {
                right: 10px;
              }
            }
          }
          .msgTypeImage {
            max-width: 150px;
            border: 1px solid #f0eeee;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            left: 50px;
            top: -30px;
            box-sizing: border-box;
            .el-image {
              width: 100%;
              height: 100%;
              position: static;
              vertical-align: middle;
            }
          }
          .msgTypeAudio {
            background: linear-gradient(#fff, #d2d2d2, #d2d2d2, #aaa);
            border: 1px solid #d2d2d2;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            display: flex;
            padding: 5px;
            border-radius: 20px;
            img {
              width: 150px;
              height: 20px;
              cursor: pointer;
            }
          }
          .msgTypeTXT {
            display: block;
            width: 285px;
            padding: 10px 20px;
            box-sizing: border-box;
            border: 1px solid #d2d2d2;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            max-height: 80px;
            border-radius: 9px;
            cursor: pointer;
            color: #298cf7;
            .title {
              font-size: 12px;
            }
            p {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              box-sizing: border-box;
              cursor: pointer;
            }
          }
        }
        &::after {
          content: "";
          display: block;
          height: 0;
          overflow: hidden;
          clear: both;
        }
      }
      .myInfo {
        .myAvatarImg {
          float: right;
          .el-image {
            transition: all 1s;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #165af7;
            color: #fff;
            .image-slot {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: left;
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .context {
          float: right;
          max-width: 285px;
          margin-right: 10px;
          .youTextInfo {
            .msgTypeText {
              float: right;
              max-width: 282px;
              min-height: 32px;
              min-width: 32px;
              box-sizing: border-box;
              position: relative;
              background: linear-gradient(#eafad8, #ade44d, #ade44d, #81c40d);
              box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
              border: 1px solid #ade44d;
              color: #000;
              border-radius: 10px;
              padding: 5px 10px;
              &::after {
                content: "";
                display: block;
                border-bottom: 9px solid transparent;
                border-left: 9px solid #bae973;
                border-top: 9px solid transparent;
                position: absolute;
                right: -8px;
                top: 15px;
                transform: translate(0, -50%);
                width: 0;
                height: 0;
              }
              pre {
                line-height: 20px;
                white-space: pre-wrap; /* css3.0 */
                white-space: -moz-pre-wrap; /* Firefox */
                white-space: -pre-wrap; /* Opera 4-6 */
                white-space: -o-pre-wrap; /* Opera 7 */
                word-wrap: break-word; /* Internet Explorer 5.5+ */
              }
            }
            &::after {
              content: "";
              display: block;
              overflow: hidden;
              width: 0;
              height: 0;
              clear: both;
            }
          }
          .msgTypeText {
            word-wrap: break-word;
            word-break: break-all;
            background: linear-gradient(#eafad8, #ade44d, #ade44d, #81c40d);
            box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
            border: 1px solid #ade44d;
            color: #000;
            border-radius: 10px;
            padding: 5px 10px;
            pre {
              line-height: 20px;
              white-space: pre-wrap; /* css3.0 */
              white-space: -moz-pre-wrap; /* Firefox */
              white-space: -pre-wrap; /* Opera 4-6 */
              white-space: -o-pre-wrap; /* Opera 7 */
              word-wrap: break-word; /* Internet Explorer 5.5+ */
            }
          }
          .msgTypeProduct {
            float: right;
            width: 285px;
            min-height: 90px;
            box-sizing: border-box;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(#f7f7f7, #fff);
            box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
            border: 1px solid #f7f7f7;
            color: #000;
            border-radius: 10px;
            padding: 5px 10px;
            &::after {
              content: "";
              display: block;
              border-bottom: 9px solid transparent;
              border-left: 9px solid #f7f7f7;
              border-top: 9px solid transparent;
              position: absolute;
              right: -8px;
              top: 15px;
              transform: translate(0, -50%);
              width: 0;
              height: 0;
              clear: both;
            }
            .liaotianerweima {
              width: 50px;
              height: 50px;
              border: 1px solid #dfe6f8;
            }
            // pre {
            //   line-height: 20px;
            //   white-space: pre-wrap; /* css3.0 */
            //   white-space: -moz-pre-wrap; /* Firefox */
            //   white-space: -pre-wrap; /* Opera 4-6 */
            //   white-space: -o-pre-wrap; /* Opera 7 */
            //   word-wrap: break-word; /* Internet Explorer 5.5+ */
            // }
            .right {
              flex: 1;
              position: relative;
              box-sizing: border-box;
              .context {
                width: 200px;
                margin-left: 10px;
                display: -webkit-box;
                overflow: hidden;
                white-space: normal !important;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .see,
              .copy {
                position: absolute;
                bottom: -20px;
                font-size: 12px;
                color: #165af7;
                cursor: pointer;
              }
              .see {
                right: 90px;
              }
              .copy {
                right: 10px;
              }
            }
          }
          .msgTypeVideo {
            width: 285;
            height: 150px;
            left: 50px;
            top: -30px;
            .video-js {
              width: 100%;
              height: 100%;
            }
          }
          .msgTypeImage {
            max-width: 150px;
            border: 1px solid #f0eeee;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            left: 50px;
            top: -30px;
            @{deep} .el-image {
              width: 100%;
              height: 100%;
              position: static;
              vertical-align: middle;
            }
          }
          .msgTypeAudio {
            background: linear-gradient(#fff, #d2d2d2, #d2d2d2, #aaa);
            border: 1px solid #d2d2d2;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            display: flex;
            padding: 5px;
            border-radius: 20px;
            img {
              width: 150px;
              height: 20px;
              cursor: pointer;
            }
          }
          .msgTypeTXT {
            display: block;
            width: 285px;
            padding: 10px 20px;
            box-sizing: border-box;
            border: 1px solid #d2d2d2;
            box-shadow: 0px 3px 9px 0px rgba(12, 44, 119, 0.2);
            max-height: 80px;
            border-radius: 9px;
            cursor: pointer;
            color: #298cf7;
            .title {
              font-size: 12px;
            }
            p {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              box-sizing: border-box;
              cursor: pointer;
            }
          }
          .unRead {
            color: #165af7;
            font-size: 12px;
            text-align: right;
          }
          .read {
            color: #c0c5c9;
            font-size: 12px;
            text-align: right;
          }
        }
        &::after {
          content: "";
          display: block;
          height: 0;
          overflow: hidden;
          clear: both;
        }
      }
    }
  }
  .infoListSend {
    height: 60px;
    background-color: #f6f6f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .sendBtnBox {
      overflow: hidden;
    }
    .maikef {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    @{deep} .sendValue {
      position: static;
      textarea {
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        padding: 5px;
      }
    }
    .sendValueInput {
      flex: 1;
      background-color: #fff;
      position: relative;
      .pasteIten {
        position: absolute;
        width: 75px;
        font-size: 12px;
        left: 0;
        top: 0;
        color: #000;
        border-radius: 3px;
        background-color: #fff;
        padding: 5px;
        text-align: center;
        z-index: 1;
        border: 1px solid #c4c4c4;
        box-sizing: border-box;
        box-shadow: 0px 3px 9px 0px rgba(1, 59, 199, 0.2);
        cursor: pointer;
        &:hover {
          background-color: #ecf5ff;
        }
      }
    }
    @{deep} .sendValueBtn {
      flex: 1;
      margin: 0;
      padding: 10px 10px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      vertical-align: top;
    }
    .iconfont {
      width: 40px;
      height: 40px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        cursor: pointer;
      }
      &:hover {
        color: #409eff;
      }
      &:last-of-type {
        justify-content: left;
        width: 30px;
      }
    }
    .sendfiles {
      position: relative;
      .fileInput {
        position: absolute;
        left: 0;
        top: 50%;
        width: 20px;
        height: 20px;
        font-size: 0;
        padding: 0;
        cursor: pointer;
        opacity: 0;
        transform: translate(0, -50%);
        border: 1px solid #000;
      }
    }
    @{deep} .sendBtn {
      margin-right: 10px;
    }
    @{deep} .show-enter-active,
    @{deep} .show-leave-active {
      transition: margin-right 0.5s;
    }
    @{deep} .show-enter {
      margin-right: -56px;
    }
    @{deep} .show-enter-to,
    .show-leave {
      margin-right: 10px;
    }
    @{deep} .show-leave-to {
      margin-right: -56px;
    }
  }
}
</style>
