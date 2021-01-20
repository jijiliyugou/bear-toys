<template>
    <!-- 发起群聊 -->
  <div class="wrapBox">
    <div class="topLayout">群成员 <span v-if="personList.length > 0">({{ personList.length }})</span></div>
    <!-- 发起群聊 -->
    <div class="searchBox">
      <div class="inputBox">
        <el-input
          class="searchInput"
          prefix-icon="iconfont icon-sousuo"
          v-model="keyWord"
          @keyup.enter.native="search"
          clearable
          placeholder="请输入关键词">
        </el-input>
        <el-button type="primary" @click="search" round>搜索</el-button>
      </div>
    </div>
    <!-- 下拉列表 -->
    <div class="contentList">
      <!-- 群item -->
      <div class="itemBox" v-for="(item, i) in personList" :key="i" @click="openPerson(item)">
          <div class="left">
            <el-image
            fit="contain"
            :src="item.userImage"
            lazy>
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
          </div>
          <div class="middle">
            <div class="name">{{item.linkman}}</div>
            <div class="company">{{item.companyName}}</div>
          </div>
          <div class="right" v-if="item.groupLeader">
            群主
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
      personList: this.$_.cloneDeep(this.options.personnels),
      keyWord: ''
    }
  },
  methods: {
    // 打开个人资料
    openPerson (item) {
      console.log(item)
    },
    // 本地搜索
    search () {
      this.personList = this.options.personnels.filter(val => val.linkman.includes(this.keyWord))
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
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      justify-content: space-between;
      box-sizing: border-box;
      .left{
        .el-image {
          width: 40px;
          height: 40px;
          img {
            width: 40px;
            height: 40px;
          }
        }
      }
      .middle{
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 5px;
        .name {
          color: #1b1b1b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .company {
          font-size: 12px;
          color: #ccc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
         }
      }
      .right{
        color: #165AF8;
        font-size: 12px;
      }
    }
  }
}
</style>
