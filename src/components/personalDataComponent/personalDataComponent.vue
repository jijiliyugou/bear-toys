<template>
<div class="wrapBox">
<!-- 查看个人资料 -->
        <div class="top"></div>
        <div class="bottom"></div>
        <div class="personalInfo" v-if="personalDetail">
          <div class="name">
            <div class="text">
              <p>{{ personalDetail.linkman }}</p>
            </div>
            <div class="img">
              <el-image
                :src="personalDetail && personalDetail.userImage"
                :size="80"
                @click.native="openEdit(personalDetail)"
                class="myAvatar"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ personalDetail.linkman }}
                </div>
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ personalDetail.linkman }}
                </div>
              </el-image>
            </div>
          </div>
          <div class="floor">
            <div class="title">性别：</div>
            <p>{{ personalDetail.sex === 1 ? "男" : "女" }}</p>
          </div>
          <div class="floor">
            <div class="title">生日：</div>
            <p v-if="personalDetail.birthday">
              {{ personalDetail.birthday.replace(/T[\s\S]*/gi, "") }}
            </p>
          </div>
          <div class="floor">
            <div class="title">电话：</div>
            <p>{{ personalDetail.phoneNumber }}</p>
          </div>
          <div class="floor">
            <div class="title myRemark" v-show="!isEditRemark">备注：
              <el-button class="subRemark" type="success" size="mini" icon="el-icon-edit" @click="ckeckEditUserRemark" plain>编辑</el-button>
            </div>
            <div class="title myRemark" v-show="isEditRemark">备注：
              <el-button class="subRemark" type="success" size="mini" icon="el-icon-check" @click="editUserRemark(personalDetail)" plain>保存</el-button>
            </div>
            <p v-show="personalDetail.remark || isEditRemark">
              <!-- <el-input type="textarea" :disabled="!isEditRemark" autosize class="companyRemark" v-model="personalDetail.remark" placeholder="请输入备注"></el-input> -->
              <el-input type="textarea" ref="myTextarea" autosize :disabled="!isEditRemark" class="companyRemark" v-model="personalDetail.remark" placeholder="请输入备注"></el-input>
            </p>
          </div>
          <center class="send">
            <el-button
            v-if="!personalDetail.isFriend"
              class="sendInfo"
              :style="{
                opacity:
                  personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
                    ? 0.7
                    : 1
              }"
              @click="addFriends"
              :disabled="
                personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
              "
              round
            >
              添加好友
            </el-button>
            <el-button
              class="sendInfo"
              :style="{
                opacity:
                  personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
                    ? 0.7
                    : 1
              }"
              @click="openTwoView"
              :disabled="
                personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
              "
              round
            >
              发 消 息
            </el-button>
            <el-popconfirm
            @onConfirm="confirmRemoveFriends"
            v-if="personalDetail.isFriend"
              title="是否确定删除好友?"
            >
            <el-button
            slot="reference"
            style="margin-top: 10px;"
              class="sendInfo danger"
              :style="{
                opacity:
                  personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
                    ? 0.7
                    : 1
              }"
              :disabled="
                personalDetail.id ==
                  ($store.state.userInfo.userInfo &&
                    $store.state.userInfo.userInfo.id)
              "
              round
            >
              删除好友
            </el-button>
          </el-popconfirm>
          </center>
        </div>
</div>
</template>

<script>
export default {
  props: {
    options: Object,
    default: {}
  },
  data () {
    return {
      personalDetail: null,
      isEditRemark: false
    }
  },
  methods: {
    // 添加好友
    addFriends () {
      this.$emit('openTwoView', {
        componentName: 'friendVerificationComponent',
        ...this.personalDetail,
        source: '同事'
      })
    },
    // 确认删除好友
    async confirmRemoveFriends () {
      const res = await this.$http.post('/api/DeleteFriendAddressBook', { friendCompanyId: this.personalDetail.companyId, friendUserId: this.personalDetail.id })
      console.log(res)
      if (res.data.result.code === 200 && res.data.result.item) {
        this.$message.success('删除好友成功')
        this.getPersonalDetail()
        this.$root.eventHub.$emit('UpdateOrgPersonnel')
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 打开修改个人信息详情页 打开第三个窗口
    openEdit (item) {
      if (this.userInfo.userInfo.id === item.id) {
        this.$emit('openTwoView', {
          componentName: 'editPersonalDataComponent',
          ...item
        })
      } else {
        this.$message.error('不能修改别人的资料哦')
      }
    },
    // 点击个人的立即沟通 打开第三个窗口
    openTwoView () {
      this.$emit('openTwoView', {
        componentName: 'personalChatComponent',
        ...this.personalDetail,
        isGroup: false
      })
    },
    // 给员工打备注
    async editUserRemark (item) {
      const result = await this.$http.post('/api/UpdateOrgPersonnel', item)
      if (result.data.result.code === 200) {
        this.getPersonalDetails(result.data.result.item.id)
        this.$message.success('修改成功')
        this.isEditRemark = false
      } else {
        this.$message.success('修改失败')
      }
    },
    // 备注
    ckeckEditUserRemark () {
      this.isEditRemark = true
      this.$nextTick(() => {
        this.$refs.myTextarea.focus()
      })
    },
    // 获取个人详情页
    async getPersonalDetail () {
      console.log(this.options)
      const res = await this.$http.post('/api/OrgPersonnelByID', {
        id: this.options.userId,
        companyId: this.options.companyId
      })
      if (res.data.result.code === 200) {
        this.personalDetail = res.data.result.item
        this.datas = JSON.parse(JSON.stringify(res.data.result.item))
      }
    }
  },
  created () {

  },
  mounted () {
    this.getPersonalDetail()
    this.$root.eventHub.$on('UpdateOrgPersonnel', () => {
      this.getPersonalDetail()
    })
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  beforeDestroy () {
    this.$root.eventHub.$off('UpdateOrgPersonnel')
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
  width: 100%;
  height: 827px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .top {
    width: 100%;
    background-color: #165af7;
  }
  .bottom {
    width: 100%;
    background-color: #eeeeed;
  }
  .personalInfo {
    position: absolute;
    top: 50px;
    width: 95%;
    // height: 700px;
    background-color: #fff;
    border-radius: 10px;
    padding: 30px 10px 30px 10px;
    box-sizing: border-box;
    .name {
      height: 80px;
      margin-top: 10px;
      display: flex;
      .text {
        flex: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-self: center;
        p {
          font-size: 18px;
          width: 100%;
          font-weight: 500;
        }
        span {
          color: #4679f8;
        }
      }
      .img {
        flex: 1;
        @{deep} .myAvatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          background-color: #165af7;
        }
      }
    }
    .floor {
      .companyRemark {
         @{deep} .el-textarea__inner {
          resize: none;
          box-sizing: border-box;
          padding-left:0;
          padding-right:0;
          font-size:16px;
          font-family: "Microsoft Yahei";
          background-color: #fff;
          border-color: #fff;
          color: #000;
         }
      }
      .title {
        color: #7e7e81;
        font-size: 14px;
        margin: 10px 0;
      }
      .myRemark{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      p {
        padding-bottom: 10px;
      }
    }
    .send {
      margin-top: 20px;
      .sendInfo {
        background-color: #165af7;
        border: none;
        color: #fff;
        width: 80%;
        margin: 0;
        margin-top: 10px;
        &:first-of-type {
          margin: 0;
        }
        .sendIcon {
          font-size: 16px;
          vertical-align: middle;
        }
      }
      .danger{
          background-color: #F5F5F5;
          border: none;
          color: #FF2B20;
        }
    }
  }
}
</style>
