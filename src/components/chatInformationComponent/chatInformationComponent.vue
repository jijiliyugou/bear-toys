<template>
<div class="wrapBox">
  <div class="topLayout">聊天信息 <span v-if="totalCount > 0">{{totalCount}}</span></div>
  <div class="groupMembers">
    <div class="title">群成员</div>
    <ul class="items">
      <li class="item" v-for="(item, i) in groupList" :key="i">
        <div class="userImg">
          <el-image
            :size="50"
            :src="item.userImage"
            lazy
          >
            <div
              slot="placeholder"
              class="image-slot"
              style="width: 50px; height: 50px; margin: 0 auto"
            >
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width: 50px; height: 50px; margin: 0 auto"
            >
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
          </el-image>
        </div>
        <p class="name">{{ item.linkman }}</p>
      </li>
      <li class="item" v-if="myInfo && myInfo.groupLeader">
        <div class="userImg">
          <i class="el-image plusIcon" @click="addNewMembers"></i>
        </div>
        <p class="name"></p>
      </li>
      <li class="item" v-if="myInfo && myInfo.groupLeader">
        <div class="userImg">
          <i class="el-image removeIcon" @click="removeMembers"></i>
        </div>
        <p class="name"></p>
      </li>
      <li class="block"></li>
      <li class="block"></li>
      <li class="block"></li>
      <li class="block"></li>
    </ul>
  </div>
  <div class="lookGroupMembers">
    <span class="item" @click="openGroupList">查看全部群成员<i class="el-icon-arrow-right"></i></span>
  </div>
  <div class="lookSee">
    <p class="item" @click="openCheckChatRecord">
      <span>查找聊天记录</span>
      <i class="el-icon-arrow-right right"></i></p>
    <p class="item" @click="openEditGroupName" v-if="myInfo && myInfo.groupLeader">
      <span>群聊名称</span>
      <span class="right">{{ groupObject.linkName }}<i class="el-icon-arrow-right right"></i></span>
    </p>
    <p class="item" @click="openEditNickname">
      <span>我在本群的昵称</span>
      <span class="right">{{ groupNickName }}<i class="el-icon-arrow-right right"></i></span></p>
  </div>
  <el-popconfirm
    class="deleteBtn"
    title="是否退出群组？"
    @onConfirm="deleteCement">
    <div slot="reference" class="deleteOut">
      <span>删除并退出</span>
    </div>
  </el-popconfirm>
  <!-- 查看聊天记录 -->
  <el-dialog
  title="查看聊天记录"
  :visible.sync="checkChatDialog"
  class="seeCheckChat"
  top="60px"
  width="40%">
  <div class="checkboxMsgType">
    <el-radio-group v-model="msgType" size="small" @change="changeMsgType">
      <el-radio :label="item.value" border v-for="(item, i) in msgTypeList" :key="i">{{ item.label }}</el-radio>
    </el-radio-group>
  </div>
  <!-- 动态组件 -->
  <component :is="dynamicComponent" :options="options"></component>
</el-dialog>
  <!-- 修改群名称 -->
  <el-dialog
  title="修改群名称"
  :visible.sync="editGroupNameDialog"
  width="30%">
  <el-input
  placeholder="请输入群名称"
  v-model="modifyGroupName"
  clearable>
</el-input>
  <center slot="footer" class="dialog-footer">
    <el-button @click="editGroupNameDialog = false">取 消</el-button>
    <el-button type="primary" @click="subGroupName">确 定</el-button>
  </center>
</el-dialog>
  <!-- 修改我在群里的群昵称 -->
  <el-dialog
  title="修改群昵称"
  :visible.sync="editNicknameDialog"
  width="30%">
  <el-input
  placeholder="请输入群昵称"
  v-model="modifyGroupNickname"
  clearable>
</el-input>
  <center slot="footer" class="dialog-footer">
    <el-button @click="editNicknameDialog = false">取 消</el-button>
    <el-button type="primary" @click="subGroupNickname">确 定</el-button>
  </center>
</el-dialog>
</div>
</template>

<script>
import textGroupChatRecordingComponent from '@/components/textGroupChatRecordingComponent/textGroupChatRecordingComponent'
import mediaGroupChatRecordingComponent from '@/components/mediaGroupChatRecordingComponent/mediaGroupChatRecordingComponent'
import linkGroupChatRecordingComponent from '@/components/linkGroupChatRecordingComponent/linkGroupChatRecordingComponent'
export default {
  components: {
    textGroupChatRecordingComponent,
    linkGroupChatRecordingComponent,
    mediaGroupChatRecordingComponent
  },
  props: ['options'],
  data () {
    return {
      groupList: [],
      dynamicComponent: 'textGroupChatRecordingComponent',
      msgType: 'Text',
      msgTypeList: [{
        value: 'Text',
        label: '文本搜索'
      },
      {
        value: 'imgorvideo',
        label: '图片/视频搜索'
      }, {
        value: 'Product',
        label: '链接搜索'
      }],
      groupObject: {}, // 群资料
      myInfo: null, // 我的群资料
      groupNickName: null, // 我的群昵称
      totalCount: 0,
      checkChatDialog: false,
      modifyGroupNickname: null,
      modifyGroupName: null,
      userInfo: this.$store.state.userInfo.userInfo,
      editGroupNameDialog: false,
      editNicknameDialog: false
    }
  },
  methods: {
    // 查看全部群成员
    openGroupList () {
      this.groupObject.componentName = 'seeGroupMembersComponent'
      this.$emit('openTwoView', this.groupObject)
    },
    // 删除成员
    removeMembers () {
      const fd = this.$_.cloneDeep(this.options)
      fd.componentName = 'removeMembersComponent'
      this.$emit('openTwoView', fd)
    },
    // 添加新成员
    addNewMembers () {
      const fd = this.$_.cloneDeep(this.options)
      fd.componentName = 'addNewMembersComponent'
      this.$emit('openTwoView', fd)
    },
    // 切换搜索聊天记录类型
    changeMsgType () {
      this.dynamicComponent = null
      switch (this.msgType) {
        case 'Text':
          this.dynamicComponent = 'textGroupChatRecordingComponent'
          break
        case 'imgorvideo':
          this.dynamicComponent = 'mediaGroupChatRecordingComponent'
          break
        case 'Product':
          this.dynamicComponent = 'linkGroupChatRecordingComponent'
          break
      }
    },
    // 修改我在群里的群昵称
    async subGroupNickname () {
      const res = await this.$http.post('/api/UpdateMessageMemberNickName', { nickName: this.modifyGroupNickname, groupNumber: this.options.groupNumber })
      if (res.data.result.code === 200) {
        this.editNicknameDialog = false
        this.getGroupUserByGroupNumber()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改群名称
    async subGroupName () {
      const res = await this.$http.post('/api/UpdateGroupAccept', { linkName: this.modifyGroupName, groupNumber: this.options.groupNumber })
      if (res.data.result.code === 200) {
        this.editGroupNameDialog = false
        this.getGroupUserByGroupNumber()
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 打开查看聊天记录
    openCheckChatRecord () {
      this.checkChatDialog = true
    },
    // 打开修改群名称
    openEditGroupName () {
      this.modifyGroupName = this.groupObject.linkName
      this.editGroupNameDialog = true
    },
    // 打开修改群昵称
    openEditNickname () {
      this.modifyGroupNickname = this.groupNickName
      this.editNicknameDialog = true
    },
    // 退出群聊
    deleteCement () {
      console.log('退出了群聊')
    },
    // 获取群成员
    async getGroupUserByGroupNumber () {
      const res = await this.$http.post('/api/GetGroupUserByGroupNumber', { groupNumber: this.options.groupNumber })
      if (res.data.result.code === 200) {
        this.groupObject = res.data.result.item
        for (let i = 0; i < this.groupObject.personnels.length; i++) {
          if (this.groupObject.personnels[i].id === this.userInfo.id) {
            this.myInfo = this.groupObject.personnels[i]
            this.groupNickName = this.groupObject.personnels[i].nickName
          }
        }
        if (this.groupObject.personnels.length > 13) {
          this.groupList = this.groupObject.personnels.slice(0, 13)
          console.log(this.groupList)
        } else {
          this.groupList = this.groupObject.personnels
        }
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {

  },
  mounted () {
    console.log(this.options)
    this.getGroupUserByGroupNumber()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
  height: 825px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-direction: column;
  color: #333;
  background-color: #F5F5F5;
  .topLayout {
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }
  .groupMembers{
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #fff;
    .title{
      color: #1b1b1b;
      height: 50px;
      display: flex;
      align-items: center;
    }
    .items{
      width: 100%;
      max-height: 240px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      justify-content: space-between;
      .block{
        width: 60px;
        margin: 5px;
      }
      .item{
        width: 65px;
        height: 80px;
        box-sizing: border-box;
        .userImg{
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          .el-image{
            width: 50px;
            height: 50px;
            border-radius: 25px;
            cursor: pointer;
            img{
              width: 50px;
              height: 50px;
            }
          }
          .plusIcon{
            background: url('~@/assets/images/plusIcon.png') no-repeat;
            background-size: contain;
          }
          .removeIcon{
            background: url('~@/assets/images/removeIcon.png') no-repeat;
            background-size: contain;
          }
        }
        .name{
          font-size: 14px;
          text-align: center;
          margin-top: 5px;
          overflow: hidden;/*超出部分隐藏*/
          white-space: nowrap;/*不换行*/
          text-overflow:ellipsis;/*超出部分文字以...显示*/
        }
      }
    }
  }
  .lookGroupMembers{
    text-align: center;
    background-color: #fff;
    padding-top: 10px;
    color: #999999;
    padding-bottom: 20px;
    font-size: 14px;
    .item{
      cursor: pointer;
      i {
        margin-left: 5px;
      }
    }
  }
  .lookSee{
    background-color: #fff;
    padding: 0 10px;
    margin: 20px 0;
    .item{
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      &:last-of-type{
        border-bottom: none;
      }
      .right{
        color: #666;
        font-size: 14px;
      }
    }
  }
  .deleteOut{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;
    color: #FF2B20;
  }
}
@{deep} .el-popconfirm__action{
  display: flex;
  justify-content: center;
}
.checkboxMsgType{
  padding: 10px;
}

  @{deep} .seeCheckChat{
    .el-dialog__body{
      padding: 0;
      margin: 0;
    }
  }
</style>
