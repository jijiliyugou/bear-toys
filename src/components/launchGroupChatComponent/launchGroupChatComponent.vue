<template>
  <!-- 发起群聊 -->
  <div class="wrapBox">
    <div class="topLayout">发起群聊 <span v-if="totalCount > 0">({{totalCount}})</span></div>
    <!-- 发起群聊 -->
    <div class="searchBox">
      <div class="inputBox">
        <el-input
          class="searchInput"
          prefix-icon="iconfont icon-sousuo"
          v-model="keyWord"
          @keyup.enter.native="search"
          clearable
          placeholder="请输入小竹熊名称">
        </el-input>
        <el-button type="primary" @click="search" round>搜索</el-button>
      </div>
    </div>
    <el-checkbox-group
      class="myCheckBox"
      ref="multipleTable"
      v-model="selectUsers"
    >
      <div class="item" v-for="(item, i) in friendsList" :key="i">
        <el-checkbox :label="item">
          <el-image class="img" :src="item.userImage" fit="cover">
            <div
              slot="error"
              class="image-slot"
              style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: left;
                white-space: nowrap;
              "
            >
              {{ item.remarkName?item.remarkName:item.userName }}
            </div>
          </el-image>
          {{ item.remarkName?item.remarkName:item.userName }}
        </el-checkbox>
        <div class="companyName">
          {{ item.remarkName?item.remarkName:item.companyName }}
        </div>
      </div>
    </el-checkbox-group>
    <div class="footer">
      <div class="footerBox">
        <div class="totalCount">
          <span v-show="selectUsers.length"
            >已选择：{{ selectUsers.length }} 人</span
          >
        </div>
        <div class="footerBtn">
          <el-button type="info" @click="submitGroup" :disabled="selectUsers.length < 1" :class="{ active: selectUsers.length }" round
            >完成
            <span v-show="selectUsers.length"
              >({{ selectUsers.length }})</span
            ></el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyWord: '',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      selectUsers: [],
      friendsList: []
    }
  },
  methods: {
    // 完成发起群聊
    async submitGroup () {
      const groupUsers = this.selectUsers.map(v => ({ userId: v.friendPersonnelId, companyId: v.friendCompanyId }))
      // 发起群聊
      const res = await this.$http.post('/api/EstablishGroup', { groupUsers: groupUsers })
      if (res.data.result.code === 200) {
        console.log(res.data.result.item)
        const fd = {
          isGroup: res.data.result.item.isGroup,
          groupNumber: res.data.result.item.groupNumber,
          linkName: res.data.result.item.linkName,
          companyID: res.data.result.item.companyID,
          componentName: 'personalChatComponent'
        }
        this.$emit('openTwoView', fd)
      } else {
        this.$message.error(res.data.result.msg)
      }
      // } else { // 添加群成员
      //   console.log(this.options, groupUsers)
      //   const fd = {
      //     groupNumber: this.options.groupNumber,
      //     groupUsers: groupUsers
      //   }
      //   const res = await this.$http.post('/api/CreateMessageMember', fd)
      //   if (res.data.result.code === 200) {
      //     console.log(res.data.result.item)
      //     const data = {
      //       isGroup: true,
      //       groupNumber: this.options.groupNumber,
      //       linkName: this.options.linkName,
      //       companyID: res.data.result.item.companyID,
      //       componentName: 'personalChatComponent'
      //     }
      //     this.$emit('openTwoView', data)
      //   } else {
      //     this.$message.error(res.data.result.msg)
      //   }
      // }
    },
    // 发送群聊点击后半部分公司事件
    driveCheckbox (item) {
      const list = this.$refs.multipleTable.value
      let flag = false
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === item.id) {
          flag = true
          this.selectUsers.pop()
        }
      }
      if (!flag) {
        this.selectUsers.push(item)
        console.log(this.selectUsers)
      }
    },
    // 搜索
    search () {
      this.currentPage = 1
      this.getFriendAddressBooksPage()
    },
    // 获取好友列表
    async getFriendAddressBooksPage () {
      const res = await this.$http.post('/api/GetFriendAddressBooksPage', { maxResultCount: this.pageSize, skipCount: this.currentPage, keyWord: this.keyWord })
      if (res.data.result.code === 200) {
        this.friendsList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    }
  },
  created () {},
  mounted () {
    this.getFriendAddressBooksPage()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox {
  width: 100%;
  height: 827px;
  .topLayout {
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid #f5f5f5;
  }
  .searchBox {
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 10px;
    height: 60px;
    display: flex;
    align-items: center;
    .inputBox {
      flex: 1;
      background: #f5f5f5;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      @{deep} .searchInput {
        input.el-input__inner {
          background-color: transparent;
          border: none;
        }
      }
      .el-button {
        background-color: #165af7;
      }
    }
  }
  .contentList {
    width: 100%;
    height: calc(100% - 110px);
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .itemBox {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .icon {
          width: 40px;
          .el-image {
            width: 40px;
            height: 40px;
            img {
              width: 40px;
              height: 40px;
            }
          }
        }
        .nameBox {
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            color: #1b1b1b;
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .company {
            font-size: 12px;
            width: 200px;
            color: #165af8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .right {
        .el-button {
          background-color: #165af8;
          width: 80px;
        }
      }
    }
  }
  .footer {
    height: 60px;
    padding: 5px 10px;
    box-sizing: border-box;
    .footerBox {
      height: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .totalCount {
        font-size: 12px;
        color: #165af8;
        flex: 1;
      }
      .footerBtn {
        .el-button {
          color: #999;
          background-color: #f5f5f5;
          border: none;
          &.active {
            background-color: #165af8;
            color: #fff;
          }
        }
      }
    }
  }
  .myCheckBox {
    height: calc(100% - 171px);
    overflow: auto;
    .item {
      height: 60px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @{deep} .el-checkbox {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 20px;
        .el-checkbox__input {
          border-radius: 50%;
        }
        .el-checkbox__label,
        .el-checkbox__input {
          display: flex;
          font-size: 16px;
          color: #1b1b1b;
          align-items: center;
          .el-image {
            transition: all 0.5s;
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 50%;
            background-color: #165af7;
            color: white;
          }
        }
        &:hover {
          @{deep} .el-image {
            -webkit-transform: scale(1.1);
            -moz-transform: scale(1.1);
            -ms-transform: scale(1.1);
            transform: scale(1.1);
          }
        }
        .el-checkbox__label,
        .is-checkbox,
        .el-checkbox__inner {
          display: flex;
          align-items: center;
          border-radius: 50%;
        }
      }
      .companyName {
        font-size: 12px;
        height: 40px;
        line-height: 40px;
        width: 100px;
        color: #666666;
        text-align: right;
        padding-right: 20px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .line {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: #999;
  }
  @{deep} .roleConText {
    font-size: 16px;
    .el-textarea__inner {
      border: none;
      outline: none;
      padding: 5px 10px;
    }
  }
  @{deep} .cateFriends {
    width: 100%;
    font-size: 16px;
    input {
      border: none;
      outline: none;
    }
  }
}
</style>
