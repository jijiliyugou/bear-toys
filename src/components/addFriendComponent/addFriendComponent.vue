<template>
<!-- 添加好友 -->
  <div class="wrapBox">
    <div class="topLayout">添加好友</div>
    <div class="searchBox">
      <div class="inputBox">
        <el-input
          class="searchInput"
          prefix-icon="iconfont icon-sousuo"
          v-model="search"
          @keyup.enter.native="getUserByPhoneOrNamePage"
          clearable
          placeholder="请输入完整号码搜索用户"
        >
        </el-input>
        <el-button type="primary" @click="getUserByPhoneOrNamePage" round>搜索</el-button>
      </div>
    </div>
    <div class="contentList">
      <!-- 好友item -->
      <div class="itemBox" v-for="(item, i) in friendList" :key="i">
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
          <div class="name">{{item.linkman}}</div>
          <div class="company">{{ item.companyName }}</div>
        </div>
        </div>
        <div class="right">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="openAddFriend(item)"
            round
            >添加</el-button
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
      search: null,
      pageSize: 20,
      currentPage: 1,
      totalCount: 0,
      friendList: []
    }
  },
  methods: {
    async getUserByPhoneOrNamePage () {
      const res = await this.$http.post('/api/GetUserByPhoneOrNamePage', {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage,
        keyWord: this.search
      })
      if (res.data.result.code === 200) {
        this.friendList = res.data.result.item.items
        this.totalCount = res.data.result.item.totalCount
      }
    },
    openAddFriend (item) {
      this.$emit('openTwoView', {
        componentName: 'friendVerificationComponent',
        ...item,
        source: '搜索'
      })
    }
  },
  created () {},
  mounted () {
    this.getUserByPhoneOrNamePage()
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
