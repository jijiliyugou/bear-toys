<template>
<div class="wrapBox">
     <!-- 好友申请 -->
        <div class="topLayout">
          <span></span>
          <span>好友申请</span>
          <span></span>
        </div>
        <div class="topBox">
          <div class="nameBox">
          <el-image fit="contain" :src="option.userImage" lazy>
            <div
              slot="placeholder"
              class="image-slot"
              style="width:40px;height:40px;margin:0 auto;background-color:#165af8;color:#fff;text-align:center;">
              {{ option.userName }}
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width:40px;height:40px;margin:0 auto"
            >
              <img
                class="errorImg"
                src="~@/assets/images/imgError.jpg"
                alt
              />
            </div>
          </el-image>
          <div class="name">
            {{ option.userName }}
          </div>
        </div>
        <div class="infoContent" v-if="option.code && option.code === 1">
          <span class="name">{{ option.userName }}</span>:
          <span class="info">{{ option.content }}</span>
        </div>
        </div>
        <div class="remarksBox">
          <div class="remark">
            <el-input v-model="remarkName" placeholder="备注"></el-input>
          </div>
          <div class="isLookMyFind">
            <span>允许对方查看我的玩具圈</span>
            <span>
              <el-switch
                v-model="checkMyToyCircle"
                active-color="#165AF7"
                inactive-color="#f5f5f5">
              </el-switch>
            </span>
          </div>
        </div>
        <div class="source">
          <span>来源</span>
          <span class="isAdd">对方通过{{ option.source }}添加</span>
        </div>
         <div class="sub" @click="subAddFriend">
          <span v-if="option.code && option.code === 1">接受</span>
          <span v-else>发消息</span>
        </div>
</div>
</template>

<script>
export default {
  props: {
    options: Object
  },
  data () {
    return {
      remarkName: '',
      checkMyToyCircle: false,
      option: this.options
    }
  },
  methods: {
    // 接受申请
    async subAddFriend () {
      if (this.option.code === 1) {
        const res = await this.$http.post('/api/CreateFriendAddressBook', { applyId: this.option.id, remarkName: this.remarkName, checkMyToyCircle: this.checkMyToyCircle })
        if (res.data.result.code === 200) {
          this.$root.eventHub.$emit('resetNewFriends')
          this.$message.success('添加好友成功')
        } else {
          this.$message.error(res.data.result.msg)
        }
      } else { // 发消息
        const res = await this.$http.post('/api/UpdateFriendAddressBook', { friendPersonnelId: this.option.senderPersonnelId, friendCompanyId: this.option.senderCompanyId, remarkName: this.remarkName, checkMyToyCircle: this.checkMyToyCircle })
        if (res.data.result.code === 200) {
          console.log(this.option)
        } else {
          this.$message.error(res.data.result.msg)
        }
        const fd = {
          isGroup: false,
          linkName: this.option.userName,
          companyId: this.option.senderCompanyId,
          toUserID: this.option.senderPersonnelId,
          componentName: 'personalChatComponent'
        }
        this.$emit('openTwoView', fd)
      }
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
    width: 100%;
    height: 827px;
    color: #333;
    box-sizing: border-box;
      .topLayout{
        padding: 0 10px;
        display: flex;
        line-height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;
        align-items: center;
        justify-content: space-between;
        span{
          flex: 1;
          &:nth-of-type(2){
            text-align: center;
          }
          &:nth-of-type(3) {
            text-align: right;
            font-size: 12px;
            color: #666666;
            span{
              cursor: pointer;
            }
          }
        }
      }
      .newFriendsContentWrap{
        height: calc(100% - 60px);
        .line{
        height: 20px;
        background-color: #f5f5f5;
      }
      .contentTitle{
        padding: 10px;
        font-size: 14px;
      }
      .contentListTwo{
        width: 100%;
        height: calc(100% - 90px);
        overflow-x: hidden;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .item{
          height: 60px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          border: none;
          width: 100%;
          box-sizing: border-box;
          .el-image{
            width: 40px;
            height: 40px;
            img{
              width: 40px;
              height: 40px;
            }
          }
          .name{
            color: #1b1b1b;
            margin-left: 10px;
          }
          .count{
            color: #999999;
          }
        }
      }
      .contentList{
        width: 100%;
        height: calc(100% - 90px);
        overflow-x: hidden;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .itemBox{
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          .left{
            flex: 1;
            display: flex;
            align-items: center;
            .icon{
              width: 40px;
              .el-image{
                width: 40px;
                height: 40px;
                img{
                  width: 40px;
                  height: 40px;
                }
              }
            }
            .nameBox{
              height: 40px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .name{
                color: #1B1B1B;
                width: 200px;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
              }
              .company{
                font-size: 12px;
                width: 200px;
                color: #165AF8;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
              }
            }
          }
          .right{
            .el-button{
              background-color: #165af8;
              width: 80px;
            }
            .text{
              display: block;
              font-size: 14px;
              width: 80px;
              text-align: center;
              color: #999999;
            }
          }
        }
      }
      .searchBox {
        background-color: #fff;
        box-sizing: border-box;
        padding: 0 10px;
        height: 60px;
        display: flex;
        align-items: center;
        .inputBox{
          flex: 1;
          background: #F5F5F5;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          @{deep} .searchInput{
            input.el-input__inner {
              background-color: transparent;
              border: none;
            }
          }
          .el-button{
            background-color: #165AF7;
          }
        }
      }
      .footer{
        height: 40px;
        background-color: #fff;
      }
      }
        background: #F5F5F5;
        .topBox{
            background-color:#fff;
            padding-bottom:10px;
            .nameBox{
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            .el-image{
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
            }
            .name {
              max-width: 300px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow:ellipsis;
            }
          }
          .infoContent{
            margin: 10px;
            margin-bottom: 0;
            padding: 10px;
            background-color: #F2F2F2;
            border-radius: 5px;
            .name{
              color: #999999;
              height: 100%;
            }
            .info{
              color: #666666;
            }
          }
        }
        .remarksBox {
          margin-top: 20px;
          height: 120px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          .remark,.isLookMyFind{
            flex: 1;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 10px;
            @{deep} .el-input{
              border: none;
              input{
                border: none;
                padding: 0;
              }
            }
          }
          .isLookMyFind{
            border-top: 1px solid #f5f5f5;
            justify-content: space-between;
          }
        }
        .source{
          margin-top: 20px;
          height: 60px;
          display: flex;
          box-sizing: border-box;
          padding: 0 10px;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;
          .isAdd{
            font-size: 12px;
            color: #999;
          }
        }
        .sub{
          margin-top: 20px;
          height: 60px;
          color: #6C96F8;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          cursor: pointer;
        }
    }
</style>
