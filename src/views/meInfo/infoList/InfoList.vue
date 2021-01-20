<template>
  <div class="towenWarp">
    <div class="gongyingshang" v-if="companyType.type === 'Supplier'">
      <div class="tuwen" @click="openOrder('sales')">
        <el-avatar
          class="avatar"
          :size="50"
          :src="require('@/assets/images/zeyang.png')"
        ></el-avatar>
        <div class="text">
          <p style="margin-left:20px;">公司业务</p>
          <p style="margin-left:20px;">
            您有 {{ companyType.sales.count }} 个销售订单
          </p>
        </div>
        <div class="number" v-show="companyType.sales.count > 0">
          <el-badge :value="companyType.sales.count" class="item"></el-badge>
          <span class="date">{{ dateDiff(companyType.sales.time) }}</span>
        </div>
      </div>
      <div class="tuwen" @click="openOrder('hall')">
        <el-avatar
          class="avatar"
          :size="50"
          :src="require('@/assets/images/daibaojia.png')"
        ></el-avatar>
        <div class="text">
          <p style="margin-left:20px;">展厅业务</p>
          <p style="margin-left:20px;">
            您有{{ companyType.hall.count }}个订单需要报价
          </p>
        </div>
        <div class="number" v-show="companyType.hall.count > 0">
          <el-badge :value="companyType.hall.count" class="item"></el-badge>
          <span class="date">{{ dateDiff(companyType.hall.time) }}</span>
        </div>
      </div>
    </div>
    <div class="gongyingshang" v-else-if="companyType.type === 'Exhibition'">
      <div class="tuwen" @click="openOrder('hall')">
        <el-avatar
          class="avatar"
          :size="50"
          :src="require('@/assets/images/zeyang1.png')"
        ></el-avatar>
        <div class="text">
          <p style="margin-left:20px;">展厅业务</p>
          <p style="margin-left:20px;">
            您有{{ companyType.hall.count }}个择样订单需要处理
          </p>
        </div>
        <div class="number" v-show="companyType.hall.count > 0">
          <el-badge :value="companyType.hall.count" class="item"></el-badge>
          <span class="date">{{ dateDiff(companyType.hall.time) }}</span>
        </div>
      </div>
      <div class="tuwen" @click="openOrder('supplier')">
        <el-avatar
          class="avatar"
          :size="50"
          :src="require('@/assets/images/daibaojia.png')"
        ></el-avatar>
        <div class="text">
          <p style="margin-left:20px;">厂商业务</p>
          <p style="margin-left:20px;">
            您有{{ companyType.supplier.count }}个订单需要报价
          </p>
        </div>
        <div class="number" v-show="companyType.supplier.count > 0">
          <el-badge :value="companyType.supplier.count" class="item"></el-badge>
          <span class="date">{{ dateDiff(companyType.supplier.time) }}</span>
        </div>
      </div>
    </div>
    <div class="gongyingshang" v-else>
      <div class="tuwen" @click="openOrder('hall')">
        <el-avatar
          class="avatar"
          :size="50"
          :src="require('@/assets/images/zeyang1.png')"
        ></el-avatar>
        <div class="text">
          <p style="margin-left:20px;">展厅业务</p>
          <p style="margin-left:20px;">
            您有{{ companyType.hall.count }}个择样订单需要处理
          </p>
        </div>
        <div class="number" v-show="companyType.hall.count > 0">
          <el-badge :value="companyType.hall.count" class="item"></el-badge>
          <span class="date">{{ dateDiff(companyType.hall.time) }}</span>
        </div>
      </div>
      <div class="tuwen" @click="openOrder('supplier')">
        <el-avatar
          class="avatar"
          fit="contain"
          :size="50"
          :src="require('@/assets/images/zeyang.png')"
        ></el-avatar>
        <div class="text">
          <p style="margin-left:20px;">厂商业务</p>
          <p style="margin-left:20px;">
            您有{{ companyType.supplier.count }}个销售订单通知
          </p>
        </div>
        <div class="number" v-show="companyType.supplier.count > 0">
          <el-badge :value="companyType.supplier.count" class="item"></el-badge>
          <span class="date">{{ dateDiff(companyType.supplier.time) }}</span>
        </div>
      </div>
    </div>
    <!-- 公司订单消息list -->
    <div
      class="tuwen"
      @click="openOrderCompanyList(item)"
      v-for="item in orderCompanyList"
      :key="item.client_nu"
    >
      <el-image class="img" :src="item.companyLogo" fit="cover">
        <div
          slot="error"
          class="image-slot"
          style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
        >
          {{ item.client_na }}
        </div>
      </el-image>
      <div class="text">
        <p style="margin-left:20px;">{{ item.client_na }}</p>
        <p style="margin-left:20px;">{{ item.client_nu }}</p>
      </div>
      <div class="number">
        <el-badge :value="item.count" v-show="item.count"></el-badge>
        <span class="date">{{ dateDiff(item.latesTime) }}</span>
      </div>
    </div>
    <!-- 聊天消息list -->
    <div
      class="tuwen"
      @click="openLiaotiao(item)"
      v-for="(item, i) in infoList"
      :key="i"
    >
      <el-image class="img" :src="item.userImage" fit="cover">
        <div
          slot="error"
          class="image-slot"
          style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;text-align:left;white-space: nowrap;"
        >
          {{ item.linkName }}
        </div>
      </el-image>
      <div class="text">
        <p style="margin-left:20px;">{{ item.linkName }}</p>
        <p style="margin-left:20px;">{{ item | messageFilter }}</p>
      </div>
      <div class="number">
        <el-badge :value="item.unreadCout || ''" class="item"></el-badge>
        <span class="date">{{ dateDiff(item.createdOn) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      allCount: 0,
      ws: null,
      wsBaseUrl: process.env.NODE_ENV === 'production' ? ('wss://impush.toysbear.com/ws?UserId=' + this.$store.state.userInfo.userInfo.id) : ('ws://139.9.71.135:8090/ws?UserId=' + this.$store.state.userInfo.userInfo.id),
      lockReturn: false,
      timeout: 280000,
      // timeout: 1000,
      timeoutID: null,
      timeoutNum: null,
      serverTimeoutObj: null,
      orderCompanyList: [],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      infoList: [],
      companyType: {
        type: this.$store.state.userInfo.commparnyList[0].companyType,
        hall: {
          time: '',
          count: 0
        },
        sales: {
          time: '',
          count: 0
        },
        supplier: {
          time: '',
          count: 0
        }
      }
    }
  },
  methods: {
    // 初始化 webSocket
    initWebSocket () {
      if (typeof WebSocket === 'undefined') {
        this.$message.error('您的浏览器不支持WebSocket')
      } else {
        // 初始化weosocket
        this.ws = new WebSocket(this.wsBaseUrl)
        // 监听webSocket连接
        this.ws.onopen = this.websocketonopen
        // 监听webSocket错误信息
        this.ws.onerror = this.websocketonerror
        // 监听webSocket消息
        this.ws.onmessage = this.websocketonmessage
        // 监听webSocket退出
        this.ws.onclose = this.websocketclose
      }
    },
    // webSocket 连接成功
    websocketonopen () {
      // 开始websocket心跳
      this.startWsHeartbeat()
      console.log('订单WebSocket连接成功')
    },
    // webSocket 连接错误
    websocketonerror (e) {
      console.log(e, '订单WebSocket连接发生错误')
    },
    // webSocket 数据接收
    websocketonmessage (e) {
      // 每次接收到服务端消息后 重置websocket心跳
      this.resetHeartbeat()
      const redata = JSON.parse(e.data)
      console.log('订单WebSocket接收到数据', redata)
      if (redata.action === 'OrderUnreadCount') {
        this.getOrderMessageCount()
        this.$store.commit('setWsOrderMsg', JSON.parse(redata.content))
      }
    },
    // webSocket 数据发送
    websocketsend (agentData) {
      this.ws.send(agentData)
    },
    // 关闭 webSocket
    websocketclose (e) {
      console.log(e, '订单退出websocket了')
    },
    // webSocket 心跳
    startWsHeartbeat () {
      this.timeoutID && clearInterval(this.timeoutID)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutID = setInterval(() => {
        console.log('订单socket开始心跳')
        // 判断websocket当前状态
        if (this.ws.readyState !== 1) {
          this.reconnect()
        } else {
          this.websocketsend('')
        }
      }, this.timeout)
    },
    // 重启websocket
    reconnect () {
      console.log(this.lockReturn)
      if (this.lockReturn) return
      this.lockReturn = true
      this.timeoutNum && clearTimeout(this.timeoutNum)
      this.timeoutNum = setTimeout(() => {
        this.initWebSocket()
        this.lockReturn = false
      }, 2000)
    },
    // 重置websocket心跳
    resetHeartbeat () {
      this.lockReturn = false
      clearInterval(this.timeoutID)
      clearTimeout(this.serverTimeoutObj)
      this.startWsHeartbeat()
    },
    // 打开公司排号
    openOrderCompanyList (item) {
      item.componentName = 'companyNumberComponent'
      console.log(item)
      this.$emit('openOneView', item)
    },
    // 打开聊天界面
    openLiaotiao (item) {
      this.$emit('openOneView', {
        ...item,
        componentName: 'personalChatComponent'
      })
      this.getOrderMessageCount()
    },
    // 打开公司订单列表
    openOrder (item) {
      console.log(item)
      this.$emit('openOneView', {
        companyType: item,
        componentName: 'companyBusinessComponent'
      })
    },
    // 获取订单通知数量
    async getOrderMessageCount () {
      const res = await this.$http.post('/api/GetOrderMessageCount', {})
      if (res.data.result.code === 200) {
        const list = res.data.result.item.result
        for (let i = 0; i < list.length; i++) {
          this.allCount += list[i].count
          if (list[i].sampleFrom === 'HALL') {
            this.companyType.hall.count = list[i].count
            this.companyType.hall.time = list[i].latesTime
          } else if (list[i].sampleFrom === 'SALES') {
            this.companyType.sales.count = list[i].count
            this.companyType.sales.time = list[i].latesTime
          } else if (list[i].sampleFrom === 'SUPPLIER') {
            this.companyType.supplier.count = list[i].count
            this.companyType.supplier.time = list[i].latesTime
          }
        }
        // this.$emit('orderInfoCount', allCount)
      }
    },
    // 获取消息列表
    async getInfoList () {
      try {
        const res = await this.$http.post('/api/MessageAcceptPage', {
          skipCount: this.currentPage,
          maxResultCount: this.pageSize
        })
        if (res.data.result.code === 200) {
          this.infoList = res.data.result.item.items
          this.total = res.data.result.item.totalCount
        }
      } catch (error) {
        // this.$message.closeAll();
        this.$message.error(
          '请求/api/MessageAcceptPage 时出错，报500，请联系管理员'
        )
        this.infoList = []
        this.total = 0
      }
    },
    // 获取消息公司列表
    async getOrderCompanyList () {
      const res = await this.$http.post('/api/GetOrderCompanyList', {})
      if (res.data.result.code === 200) {
        this.orderCompanyList = res.data.result.item.items
        for (let i = 0; i < this.orderCompanyList.length; i++) {
          this.allCount += this.orderCompanyList[i].count
        }
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
  filters: {
    messageFilter (item) {
      let msg
      switch (item.msgType) {
        case 'Text':
        case 'Product':
        case 'SystemPrompt':
          msg = item.content
          break
        case 'Video':
          msg = '[视频]'
          break
        case 'Picture':
          msg = '[图片]'
          break
        case 'Voice':
          msg = '[语音]'
          break
        case 'file':
          msg = '[文件]'
          break
        case 'InstantVoice':
          msg = '[即时语音]'
          break
        case 'TimeVideo':
          msg = '[即时视频]'
          break
      }
      return msg
    }
  },
  mounted () {
    this.$store.commit('clearWsOrderMsg')
    this.initWebSocket()
    this.getInfoList()
    this.getOrderCompanyList()
    this.getOrderMessageCount()
    this.$root.eventHub.$on('resetData', () => {
      this.getInfoList()
    })
  },
  watch: {
    allCount (val) {
      if (val) this.$emit('orderInfoCount', val)
    }
  },
  beforeDestroy () {
    this.ws.close()
    this.lockReturn = true
    this.timeoutID && clearInterval(this.timeoutID)
    this.timeoutNum && clearTimeout(this.timeoutNum)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.$root.eventHub.$off('resetData')
    this.$root.eventHub.$off('resetCompany')
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.towenWarp {
  height: 765px;
  overflow: auto;
  position: relative;
  &::-webkit-scrollbar {
    width: 0; /* 滚动条宽度， width：对应竖滚动条的宽度  height：对应横滚动条的高度*/
  }
  .tuwen {
    display: flex;
    line-height: 30px;
    align-items: center;
    margin: 10px;
    font-size: 14px;
    cursor: pointer;
    @{deep} .img {
      transition: all 1s;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #165af7;
      color: white;
      @{deep} .iconfont {
        font-size: 30px;
      }
    }
    @{deep} .avatar {
      transition: all 1s;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .text {
      width: 230px;
      box-sizing: border-box;
      p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:last-child {
          color: #ccc;
        }
      }
    }
    .number {
      flex: 1;
      height: 60px;
      text-align: right;
      line-height: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 0;
      .date {
        font-size: 12px;
        color: #ccc;
      }
    }
    &:hover {
      .img,
      .avatar {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
      }
    }
  }
}
</style>
