<template>
<!-- 添加好友 -->
  <div class="wrapBox">
    <div class="topLayout">
      <span></span>
      <span class="title">新的好友</span>
      <span class="add"><span @click="openTwoView({componentName: 'addFriendComponent'})">添加好友</span></span>
    </div>
    <div class="searchBox">
      <div class="inputBox">
        <el-input
          class="searchInput"
          prefix-icon="iconfont icon-sousuo"
          v-model="search"
          clearable
          placeholder="请输入关键词"
        >
        </el-input>
        <el-button type="primary" round>搜索</el-button>
      </div>
    </div>
    <div class="contentList">
      <!-- 好友item -->
      <div class="itemBox" v-for="(item, i) in friendList" :key="i" @click="lookFindApply({...item,componentName: 'friendApplicationComponent',code:1})">
        <div class="left">
          <el-image
            fit="contain"
            :src="item.userImage"
            lazy
          >
            <div
              slot="placeholder"
              class="image-slot"
              style="width: 40px; height: 40px; margin: 0 auto"
            >
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width: 40px; height: 40px; margin: 0 auto"
            >
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
          </el-image>
          <div class="middle">
          <div class="name">{{ item.userName }}</div>
          <div class="company">{{ item.content }}</div>
        </div>
        </div>
        <div class="right">
          <el-button
            size="mini"
            type="primary"
            @click.stop.native="acceptEvent({...item,componentName: 'friendApplicationComponent',code:2})"
            round
            v-if="item.state !== 2"
            >接受</el-button>
            <el-button
            size="mini"
            style="backgroundColor:#ccc;borderColor:#ccc;"
            type="primary"
            disabled
            round
            v-else
            >已添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      search: null,
      friendList: []
    }
  },
  methods: {
    // 接受事件
    async acceptEvent (item) {
      console.log(item)
      const res = await this.$http.post('/api/CreateFriendAddressBook', { applyId: item.id })
      if (res.data.result.code === 200) {
        this.$message.success('添加好友成功')
        this.$root.eventHub.$emit('resetMyFriends')
        await this.getFriendApplyPage()
        this.$emit('openTwoView', item)
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 查看好友申请明细
    async lookFindApply (item) {
      if (item.state === 2) {
        const fd = { ...item, componentName: 'friendApplicationComponent', code: 2 }
        this.$emit('openTwoView', fd)
      } else {
        this.$emit('openTwoView', item)
      }
    },
    // 打开三级窗口
    async openTwoView (item) {
      this.$emit('openTwoView', item)
    },
    // 获取新的好友列表
    async getFriendApplyPage () {
      const res = await this.$http.post('/api/GetFriendApplyPage', { maxResultCount: this.pageSize, skipCount: this.currentPage })
      if (res.data.result.code === 200) {
        this.friendList = res.data.result.item.items
        this.total = res.data.result.item.totalCount
      }
    }
  },
  created () {},
  mounted () {
    this.getFriendApplyPage()
    this.$root.eventHub.$on('resetNewFriends', () => {
      this.currentPage = 1
      this.getFriendApplyPage()
    })
  },
  beforeDestroy () {
    this.$root.eventHub.$off('resetNewFriends')
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox {
  width: 100%;
  height: 827px;
  box-sizing: border-box;
  .topLayout{
      color: #333;
      height: 50px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      box-sizing: border-box;
      span{
        flex: 1;
        &.title {
          text-align: center;
        }
        &.add {
          text-align: right;
          font-size: 12px;
          color: #666;
          cursor: pointer;
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
    height: calc(100% - 113px);
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .itemBox {
      height: 60px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
          .el-image {
            width: 40px;
            height: 40px;
            img {
              width: 40px;
              height: 40px;
            }
          }
        .middle{
          margin-left: 10px;
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          box-sizing: border-box;
        .name {
          width: 200px;
          color: #1b1b1b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .company {
          width: 200px;
          font-size: 12px;
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
        }
      }
    }
  }
}
</style>
