<template>
  <div class="login">
    <div class="formBox">
        <el-tabs v-model="activeName" class="loginFormLaout">
          <el-tab-pane label="扫码登录" name="erweima">
            <div class="qrcode">
              <vue-qr
                :text="options.url"
                :logoSrc="options.icon + '?cache'"
                colorLight="#fff"
                colorDark="#018e37"
                :margin="0"
                :size="260"
              ></vue-qr>
              <div class="refresh" v-show="showQrCode">
                <div class="refreshIcon" @click="getQrCodeUrl">
                  <i class="el-icon-refresh"></i>
                </div>
              </div>
            </div>
            <p class="qrText">
              {{ qrcodeTitle }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="短信登录" name="mobile">
            <el-form :model="loginforms" ref="mobileRef" class="smsLogin" :rules="mobileRules">
              <el-form-item prop="username">
                <el-input prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号" v-model="loginforms.username"></el-input>
              </el-form-item>
              <el-form-item prop="verifycode">
                <div class="countDownBox">
                  <el-input
                    placeholder="请输入验证码"
                    prefix-icon="el-icon-lock"
                    v-model="loginforms.verifycode"
                    class="verifycode"
                    @keyup.enter.native="handleCodeLogin"
                  ></el-input>
                  <div class="countDown">
                    <span v-show="show" @click="getCode">获取验证码</span>
                    <span v-show="!show" class="count">{{ count }} s</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleCodeLogin"
                  >登录</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import { getMenuFuc } from '@/router/index'
export default {
  components: {
    VueQr
  },
  data () {
    return {
      value: null,
      ws: null,
      wsBaseUrl: process.env.NODE_ENV === 'production' ? 'wss://impush.toysbear.com/ws?UserId=' : 'ws://139.9.71.135:8090/ws?UserId=',
      lang: 'zh-CN',
      qrTimer: null,
      randomCode: null,
      qrcodeTitle: '请用小竹熊 云科技App扫码登录',
      show: true,
      showQrCode: false,
      count: '',
      timer: null,
      activeName: 'mobile',
      search: '',
      options: {
        // 二维码配置
        url: ' ',
        icon: require('@/assets/images/logo.png')
      },
      loginforms: {
        username: null,
        verifycode: null
      },
      mobileRules: {
        username: [
          {
            required: true,
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/,
            message: '格式不正确',
            trigger: 'blur'
          }
        ],
        verifycode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, message: '验证码长度最少为4位', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    activeName (val) {
      if (val === 'erweima') {
        this.getQrCodeUrl()
      } else {
        clearInterval(this.qrTimer)
        this.ws && this.ws.close()
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
        // 正式
        this.ws = new WebSocket(this.wsBaseUrl + this.randomCode)
        // 测试
        // this.ws = new WebSocket(
        //   'ws://139.9.71.135:8090/ws?UserId=' + this.randomCode
        // )
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
      console.log('WebSocket连接成功')
    },
    // webSocket 连接错误
    websocketonerror (e) {
      console.log('WebSocket连接发生错误')
    },
    // webSocket 数据接收
    websocketonmessage (e) {
      const redata = JSON.parse(e.data)
      console.log(redata)
      if (redata.action === 'QrCodeLogin') {
        this.getUserConfirm()
        console.log('成功了')
      }
    },
    // webSocket 数据发送
    websocketsend (agentData) {
      this.ws.send(agentData)
    },
    // 关闭 webSocket
    websocketclose (e) {
      console.log(e, '退出websocket了')
    },

    // 获取系统参数
    async getClientTypeList (type) {
      const res = await this.$http.post('/api/ServiceConfigurationList', {
        basisParameters: type
      })
      if (res.data.result.code === 200) {
        return res.data.result.item
      }
    },
    // 监听结果
    async getUserConfirm () {
      const res = await this.$http.post('/api/UserConfirm', {
        RandomCode: this.randomCode
      })
      if (res.data.result.isLogin) {
        this.ws && this.ws.close()
        clearInterval(this.qrTimer)
        this.qrTimer = null
        this.$store.commit('setToken', res.data.result)
        this.$store.commit(
          'setComparnyId',
          res.data.result.commparnyList[0].commparnyId
        )
        await this.waitTime(1)
        // 二维码登录成功获取菜单
        try {
          const re = await this.$http.post('/api/GetUserRoleMenu', {})
          if (re.data.result.code === 200 && re.data.result.item) {
            this.$store.commit('handlerLogin', true)
            this.$store.commit(
              'setRouters',
              re.data.result.item.modulesList || []
            )
            await getMenuFuc()
            const Json = {}
            Json.MessageRestriction = await this.getClientTypeList(
              'MessageRestriction'
            )
            Json.UserRestrictions = await this.getClientTypeList(
              'UserRestrictions'
            )
            Json.NoticeRestrictions = await this.getClientTypeList(
              'NoticeRestrictions'
            )
            Json.CompanyRestrictions = await this.getClientTypeList(
              'CompanyRestrictions'
            )
            Json.PlatForm = await this.getClientTypeList('PlatForm')
            this.$store.commit('globalJson/setGlobalJson', Json)
            this.$router.push('/me')
          } else {
            this.$message.error(re.data.result.msg)
            this.$store.commit('removeLoginItems')
          }
        } catch (error) {
          this.$store.commit('updateAppLoading', false)
          this.$message.error('获取菜单失败，请检查该角色是否有公司类型')
        }
      }
    },
    // 获取二维码链接
    async getQrCodeUrl () {
      const res = await this.$http.post('/api/UserRandomCode', {})
      if (res.data.result.code === 200) {
        this.options.url = res.data.result.item.qrCode
        this.randomCode = res.data.result.item.randomCode
        // 开启长连接
        this.initWebSocket()
      }
      // const TIME_COUNT = 20
      const TIME_COUNT = 300
      if (!this.timer) {
        let count = TIME_COUNT
        this.showQrCode = false
        this.qrcodeTitle = '请用小竹熊 云科技App扫码登录'
        clearInterval(this.qrTimer)
        this.qrTimer = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count--
          } else {
            this.ws && this.ws.close()
            this.showQrCode = true
            this.qrcodeTitle = '二维码已失效，点击刷新'
            clearInterval(this.qrTimer)
            this.qrTimer = null
          }
        }, 1000)
      }
    },
    // 生成随机数
    randomNum (min, max) {
      max = max + 1
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 随机生成验证码字符串
    // makeCode (data, len) {
    //   for (let i = 0; i < len; i++) {
    //     this.identifyCode += data[this.randomNum(0, data.length - 1)]
    //   }
    // },
    /**
     * 等待几秒后执行
     * @param {number} s 等待时间，单位秒
     */
    async waitTime (s) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve()
        }, 1000 * s)
      })
    },
    // 验证码点击登录
    handleCodeLogin () {
      this.$refs.mobileRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post('/api/Authenticate', {
            userAccountOrUserMobile: this.loginforms.username,
            platForm: 'PC',
            loginType: 'VerificationCode',
            VerificationCode: this.loginforms.verifycode
          })
          if (res.data.result.isLogin) {
            this.$store.commit('setToken', res.data.result)
            if (res.data.result.commparnyList.length === 1) {
              // 一个角色
              this.$store.commit('setToken', res.data.result)
              this.$store.commit(
                'setComparnyId',
                res.data.result.commparnyList[0].commparnyId
              )
              await this.waitTime(1)
              // 获取系统参数
              const Json = {}
              Json.MessageRestriction = await this.getClientTypeList(
                'MessageRestriction'
              )
              Json.UserRestrictions = await this.getClientTypeList(
                'UserRestrictions'
              )
              Json.NoticeRestrictions = await this.getClientTypeList(
                'NoticeRestrictions'
              )
              Json.CompanyRestrictions = await this.getClientTypeList(
                'CompanyRestrictions'
              )
              Json.PlatForm = await this.getClientTypeList('PlatForm')
              Json.packageManage = await this.getClientTypeList(
                'packageManage'
              )
              this.$store.commit('globalJson/setGlobalJson', Json)
              const re = await this.$http.post('/api/GetUserRoleMenu', {})
              if (re.data.result.code === 200 && re.data.result.item) {
                this.$store.commit('handlerLogin', true)
                this.$store.commit(
                  'setRouters',
                  re.data.result.item.modulesList || []
                )
                await getMenuFuc()
              } else {
                this.$message.error(re.data.result.msg)
                this.$store.commit('removeLoginItems')
              }
              this.$router.push('/me')
            } else if (res.data.result.commparnyList.length > 1) {
              // 多个角色
              this.$store.commit('setToken', res.data.result)
              this.$router.push({
                name: 'LoginConfirm',
                params: res.data.result
              })
            }
          } else {
            this.$message.error(res.data.result.message)
          }
        }
      })
    },
    // 手机验证倒计时
    async getCode () {
      if (
        !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/.test(
          this.loginforms.username
        )
      ) {
        this.$message.error('请输入手机号')
        return
      }
      const res = await this.$http.post('/api/SendSMS', {
        PhoneNumber: this.loginforms.username,
        MessageType: 'SignIn'
      })
      if (res.data.result.code !== 200) {
        this.$message.error(res.data.result.message)
        return
      }
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  },
  created () {
    if (this.$route.query.id === 'signOut') {
      this.$store.commit('removeLoginItems')
    }
  },
  mounted () {
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.ws && this.ws.close()
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.login {
  flex: 1;
  background: url('~@/assets/images/homeBg.png') no-repeat center;
  background-size: 100% 100%;
  position: relative;
}
.formBox {
  width: 400px;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 7px 57px rgba(0, 72, 152, 0.2);
  position: absolute;
  left: 60%;
  top: 50%;
  padding: 20px;
  box-sizing: border-box;
  transform: translate(0, -50%);
  @{deep} .el-tabs__nav{
    width: 100%;
    display: flex;
    border: none;
    margin-bottom: 10px;
    .el-tabs__active-bar{
      opacity: 0;
    }
    .el-tabs__item{
      margin: 0;
      text-align: center;
      flex: 1;
      border-right: 1px solid #e4e7ed;
      &:last-of-type {
        border:none;
      }
    }
  }
}

.identifybox {
  float: right;
  margin-left: 10px;
}
.iconstyle {
  color: #409eff;
}
.verifycode {
  flex: 1;
}
.smsLogin{
  @{deep} .el-input{
    border-radius: 25px;
    input{
      height: 50px;
      font-size: 16px;
      padding: 0 10px 0 40px;
      border: none;
    }
    .el-input__icon{
      position: relative;
      &::before{
        left:0px;
        position: absolute;
        height: 100%;
        line-height:50px;
        font-size: 25px;
        color: #4a85fd;
      }
      &::after {
        content: '';
        width: 2px;
        height:25px;
        display: block;
        position: absolute;
        background-color: #dcdfe6;
        right: -5px;
        top: 50%;
        transform: translate(0,-50%);
      }
    }
  }
  .countDownBox {
    display: flex;
    justify-content: space-between;
    .countDown {
      display: flex;
      color: #fff;
      width: 120px;
      height: 48px;
      border-radius: 25px;
      margin-left: 10px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: #4a85fd;
    }
  }
  .el-button {
    width: 100%;
    height: 50px;
    margin: 0 auto;
    background-color: #4a85fd;
    border-radius: 25px;
  }
  @{deep} .el-form-item {
    margin: 40px 0;
    border-bottom: 2px solid #dcdfe6;
    &:last-of-type {
      border: none;
    }
    .el-form-item__label {
      height: 50px;
      line-height: 50px;
      padding: 0;
    }
  }
}
.qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260px;
  height: 260px;
  margin: 0 auto;
  position: relative;
  .refresh {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    .refreshIcon {
      width: 100px;
      height: 100px;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 50px;
    }
  }
}
.qrText {
  padding: 20px;
  font-size:14px;
  color:#4a85fd;
  text-align:center;
}
</style>
