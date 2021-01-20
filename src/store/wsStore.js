/**
 *  聊天 webSocket
 */
// 这里需要引入vuex
import store from '@/store'
const env = process.env.NODE_ENV
const wsConnection = {
  $ws: null,
  baseUrl: env === 'production' ? 'wss://impush.toysbear.com/ws?UserId=' : 'ws://139.9.71.135:8090/ws?UserId=',
  // baseUrl: env === 'production' ? 'ws://139.9.71.135:8090/ws?UserId=' : 'ws://139.9.71.135:8090/ws?UserId=',
  lockReturn: false,
  timeout: 280000,
  // timeout: 2000,
  timeoutID: null,
  timeoutNum: null,
  serverTimeoutObj: null,
  // 初始化webSocket长连接
  initWebSocket () {
    this.$ws = new WebSocket(this.baseUrl + store.state.wsId) // 写入地址 这里的地址可以在initWebSocket方法加入参数
    this.$ws.onopen = this.wsOpen
    this.$ws.onclose = this.wsClose
    this.$ws.onmessage = this.wsMsg
    this.$ws.onerror = this.wsError
  },
  // 打开websocket
  wsOpen (e) {
    // 开始websocket心跳
    wsConnection.startWsHeartbeat()
    console.log('全局WebSocket 连接成功')
  },
  wsClose (e) {
    console.log('全局WebSocket 退出成功')
  },
  wsMsg (msg) {
    // 每次接收到服务端消息后 重置websocket心跳
    wsConnection.resetHeartbeat()
    // 服务端发送来的消息存到vuex
    store.commit('setwsMsg', msg.data)
  },
  wsError (err) {
    console.log(err, '全局WebSocket 连接错误')
    wsConnection.reconnect()
  },
  // webSocket 数据发送
  wsSend (agentData) {
    this.$ws.send(agentData)
  },
  // 重启websocket
  reconnect () {
    const _this = this
    if (_this.lockReturn) return
    _this.initWebSocket()
    _this.lockReturn = false
    // _this.lockReturn = true;
    // _this.timeoutNum && clearTimeout(_this.timeoutNum);
    // _this.timeoutNum = setTimeout(function () {
    //   _this.initWebSocket();
    //   _this.lockReturn = false;
    // }, 1000);
  },
  startWsHeartbeat () {
    const _this = this
    _this.timeoutID && clearInterval(_this.timeoutID)
    _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj)
    _this.timeoutID = setInterval(function () {
      // 每280秒发送一次消息给服务器
      console.log('全局socket开始心跳')
      // 判断websocket当前状态 !== 1为断开状态
      if (_this.$ws.readyState !== 1) {
        _this.reconnect()
      } else {
        _this.wsSend('')
      }
    }, _this.timeout)
  },
  // 重置websocket心跳
  resetHeartbeat () {
    clearInterval(this.timeoutID)
    clearTimeout(this.serverTimeoutObj)
    this.startWsHeartbeat()
  }
}

export default wsConnection
