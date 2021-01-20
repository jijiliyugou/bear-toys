<template>
  <!-- 发起群聊 -->
  <div class="wrapBox">
    <div class="topLayout">选择群成员<span v-if="friendsList.length">({{friendsList.length}})</span></div>
    <!-- 发起群聊 -->
    <!-- <div class="searchBox">
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
    </div> -->
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
              {{ item.nickName?item.nickName:item.linkman }}
            </div>
          </el-image>
          {{ item.nickName?item.nickName:item.linkman }}
          <span class="qunzhu" v-if="item.groupLeader">群主</span>
        </el-checkbox>
        <div class="companyName">
         {{ item.nickName?item.nickName:item.linkman }}
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
            >移除
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
  props: ['options'],
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
    // 提交移除群成员
    async submitGroup () {
      const groupUsers = this.selectUsers.map(v => ({ userId: v.id, companyId: v.companyId }))
      // 添加新成员
      console.log(this.options, groupUsers)
      const fd = {
        groupNumber: this.options.groupNumber,
        delType: 0,
        groupUsers: groupUsers
      }
      const res = await this.$http.post('/api/DeleteMessageMember', fd)
      if (res.data.result.code === 200) {
        this.$root.eventHub.$emit('resetGroupList')
        const data = {
          isGroup: true,
          groupNumber: this.options.groupNumber,
          linkName: this.options.linkName,
          componentName: 'personalChatComponent'
        }
        this.$emit('openTwoView', data)
      } else {
        this.$message.error(res.data.result.msg)
      }
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
      this.getGroupUserByGroupNumber()
    },
    // 获取群成员列表
    async getGroupUserByGroupNumber () {
      const res = await this.$http.post('/api/GetGroupUserByGroupNumber', { groupNumber: this.options.groupNumber })
      if (res.data.result.code === 200) {
        this.friendsList = res.data.result.item.personnels
      }
    }
  },
  created () {},
  mounted () {
    this.getGroupUserByGroupNumber()
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
    height: calc(100% - 111px);
    overflow: auto;
    .qunzhu{
        font-size: 12px;
        color: #999;
        margin-left: 5px;
        transform: scale(0.8)
    }
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
