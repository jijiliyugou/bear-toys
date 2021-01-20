// export default { // 深网配置
//   value: null,
//   attachment: null,
//   addId: '5de91f02f12c41c2b276c9accb4679c7',
//   userName: store.state.userInfo.userInfo.linkman,
//   token: '',
//   loginState: null,
//   showmsg: [],
//   orderNumber: null,
//   creatChannel: null,
//   groupNumber: '',
//   toCompanyID: null,
//   toUserID: null,
//   name: '',
//   uid: store.state.userInfo.userInfo.id,
//   client: {},
//   channelMember: []
// }
import AgoraRTM from 'agora-rtm-sdk'
class RMT {
  constructor ({ addId, isGroup, isErp, linkName, orgLinkName, orgCompanyID, uid, orgUserID, orgUserImage, userImage, msgType, value, attachment, token, loginState, showmsg, orderNumber, creatChannel, groupNumber, toCompanyID, toUserID, client, channelMember }) {
    this.addId = addId || '5de91f02f12c41c2b276c9accb4679c7'
    this.isGroup = isGroup || false // 是否群聊
    this.msgType = msgType || 'Text' // 消息类型默认文本
    this.value = value || '' // 发送的消息内容
    this.attachment = attachment // 发送的消息文件图片语音等内容
    this.token = token
    this.uid = uid
    this.isErp = isErp || false
    this.loginState = loginState
    this.showmsg = showmsg // 聊天信息集合
    this.orderNumber = orderNumber
    this.creatChannel = creatChannel
    this.groupNumber = groupNumber // 聊条产生的groupNumber
    this.toLinkName = linkName || '' // 接收人名字
    this.toUserImage = userImage || null // 接收人头像
    this.toCompanyID = toCompanyID // 接收人公司id
    this.toUserID = toUserID // 接收人id
    this.orgCompanyID = orgCompanyID // 发送人公司id
    this.orgUserID = orgUserID // 发送人id
    this.orgLinkName = orgLinkName // 发送人名字
    this.orgUserImage = orgUserImage // 发送人头像
    this.client = client
    this.channelMember = channelMember
    this.AgoraRTM = AgoraRTM
  }

  // 深网登录
  login (uid, userName, callback) {
    this.userName = userName
    // 登入 RTM 之前，调用 AgoraRTM.createInstance 方法创建一个 RtmClient 实例。
    this.client = this.AgoraRTM.createInstance(this.addId)
    // 通过监听 RtmClient 上的 ConnectionStateChanged 事件可以获得 SDK 连接状态改变的通知
    this.client.on(
      'ConnectionStateChanged',
      (newState, reason) => {
        this.loginState = newState
      }
    )
    // 登录
    this.client
      .login({
        token: this.token,
        uid: uid
      })
      .then(() => {
        console.log('AgoraRTM客户端登录成功')
      })
      .catch(err => {
        console.log('AgoraRTM客户端登录失败', err)
      })
    // 监听 client 上的事件 MessageFromPeer 接收点对点消息
    this.client.on(
      'MessageFromPeer',
      ({ text }, peerId, messageProps) => {
        // text 为消息文本，peerId 是消息发送方 User ID
        console.log('我收到了点对点', 123)
        callback()
        /* 收到点对点消息的处理逻辑 */
      }
    )
    // 监听对方是否在线
    this.client.on('PeersOnlineStatusChanged', status => {
      console.log(status)
    })
  }

  // 深网登出
  signOut () {
    if (this.client) {
      this.client.logout()
      console.log('退出頻道成功')
    }
  }
}

export default RMT
