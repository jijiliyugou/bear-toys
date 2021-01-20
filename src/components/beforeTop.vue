<template>
  <div style="width:100%;">
    <div class="banner">
      <div class="bannerContent">
        <div class="left">
          <div class="contactType">
            <span>
              <i class="iconfont icon-dianhua"></i>热线电话：0754-89861122
            </span>
            <span>
              在线客服：
              <i class="qqBg" @click="toQQ"></i>
            </span>
          </div>
        </div>
        <div class="middle">
          小竹熊欢迎您
        </div>
        <div class="right">
          <div class="loginTitle">
            <!-- 未登录 -->
            <div class="myLogin" v-if="!isLogin">
                <button class="loginBtn" @click="toLogin">登录</button>
            </div>
            <!-- 已登录 -->
            <div class="user" v-else>
              <div class="infoList">
                <span @click="infoListEvent(1)"><i class="iconfont icon-ego-box"></i>我的产品</span>
                <span @click="infoListEvent(2)"><i class="iconfont icon-laba"></i>择样消息</span>
                <span @click="infoListEvent(3)"><i class="el-icon-bell"></i>我的消息</span>
                <span @click="infoListEvent(4)"><i class="el-icon-user-solid"></i>{{ userInfo.userInfo && userInfo.userInfo.linkman }}</span>
              </div>
              <a class="tuichu" width="20" @click="SignOut">退出</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  methods: {
    // 进登录页
    toLogin () {
      this.$router.push({ path: '/beforeIndex/login' })
    },
    errorHandler () {
      return true
    },
    // 消息列表点击事件
    infoListEvent (count) {
      let routeItem
      switch (count) {
        case 1:
          routeItem = '/myProduct'
          break
        case 2:
          routeItem = '/meInfo/infoList'
          break
        case 3:
          routeItem = '/meInfo/infoList'
          break
        case 4:
          routeItem = '/me'
          break
      }
      const href = this.$router.resolve(routeItem)
      window.open(href.href, '_blank')
      // window.open("http://127.0.0.1:8081/#/me", "_blank");
    },
    // 登出
    SignOut () {
      // this.dialogVisible = true;
      this.$confirm('确定要退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$router.push({ name: 'Login', query: { id: 'signOut' } })
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登出'
          })
        })
    },
    // 联系客服
    toQQ () {
      window.open('tencent://message/?uin=3300802838&Site=Sambow&Menu=yes', '_blank')
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    ...mapState(['userInfo'])
  },
  mounted () {
  }
  // beforeDestroy () {
  //   this.$store.commit('handlerBeforeSearchImgPreview', null)
  // }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/globalVariable.less";
@deep: ~">>>";
.banner {
  min-width: 1024px;
  width: 100%;
  overflow: visible;
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  .bannerContent {
    max-width: 1200px;
    overflow: visible;
    min-width: 1024px;
    margin: 0 auto;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
     color:#797979;
    .left,.right{
      flex:1;
    }
    .middle{
      text-align: center;
      color: #000;
      font-weight: 600;
      font-size: 20px;
    }
    .left {
      .contactType {
        font-size: 12px;
        display: flex;
        align-items: center;
        // text-indent: 2em;
        span {
          display: flex;
          align-items: center;
          &:last-of-type {
            margin-left: 50px;
          }
          i {
            margin-right: 10px;
            &.icon-dianhua {
              font-size: 18px;
            }
          }
          .qqBg {
            display: block;
            width: 16px;
            height: 16px;
            background: url("~@/assets/images/qq.png") center center;
            background-size: 90%;
            cursor: pointer;
          }
        }
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      .loginTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .myLogin {
          font-size: 12px;
          .loginBtn{
            color: #3872f8;
            border: 1px solid #3872f8;
            background-color: #fff;
            padding: 5px 30px;
            border-radius: 5px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            &:hover{
              background-color: #ecf5ff;
            }
          }
        }
        .user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          .infoList{
            display: flex;
            align-items: center;
            span{
              display: flex;
              align-items: center;
              margin-right: 20px;
              cursor: pointer;
              &:hover{
                color: #3872f8;
              }
              &:hover i{
                background-color: #3872f8;
              }
              i{
                width: 20px;
                height: 20px;
                background-color: #666666;
                border-radius: 50%;
                color: #fff;
                font-size: 16px;
                text-align: center;
                line-height: 20px;
                margin-right: 10px;
              }
            }
          }
          .tuichu {
            color:#797979;
            font-size: 12px;
            cursor: pointer;
            &:hover{
              color: #3872f8;
            }
          }
        }
      }
    }
  }
}

// .grid-content-top {
//   height: 110px;
//   display: flex;
//   align-items: center;
//   .logo {
//     width: 110px;
//     height: 110px;
//   }
//   @{deep} input.el-input--suffix, @{deep} input.el-input__inner {
//       border: none;
//     }
//   .top-center {
//     border-radius: 50px;
//     border: 1px solid #ccc;
//     overflow: hidden;
//     height: 40px;
//     width:100%;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin: 30px 0;
//     /deep/ .el-input-group__append, /deep/ .el-input-group__prepend, /deep/ .el-input {
//       border: none;
//     }
//     @{deep} .elInput{
//       border:none;
//       flex:1;
//     }
//     .subSearch{
//       background-color:#165af7;
//       color:#fff;
//       border:none;
//       border-radius: 0;
//       width:100px;
//       display:flex;
//       height:100%;
//       justify-content: center;
//       align-items: center;
//     }
//     .myCamera {
//       border:none;
//       margin-right: 10px;
//       font-size: 24px;
//       position: relative;
//       .fileInput {
//         position: absolute;
//         left: 0;
//         top: 0;
//         width: 24px;
//         height: 40px;
//         font-size: 0;
//         padding: 0;
//         cursor: pointer;
//         cursor: pointer;
//         opacity: 0;
//       }
//     }
//   }
// }
// .erwemas {
//   float: right;
// }

// .sidebar {
//   display: flex;
//   height: 100px;
//   align-items: center;
//   color: #fff;
//   ul {
//     flex: 1;
//     display: flex;
//     .li {
//       margin: 0 30px;
//       padding-bottom: 5px;
//       border-bottom: 2px solid transparent;
//       &:first-of-type {
//         margin-left: 0;
//       }
//     }
//     .router-link-active {
//       color: #165af7;
//       border-bottom-color: #165af7;
//     }
//   }
// }
// // 截图
// .cropper-content {
//   .cropper {
//     width: auto;
//     height: 500px;
//   }
// }
</style>
