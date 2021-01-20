<template>
<div class="msgTypeConBox">
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
  <div class="contenBox" v-if="groupMessageList.length">
    <ul class="wrap">
      <li class="item" v-for="(item, i) in groupMessageList" :key="i">
        <div class="left">
          <el-image class="img" :src="item.userImage">
            <div slot="error" class="image-slot">
              {{ item.linkName }}
            </div>
          </el-image>
        </div>
        <div class="middle">
          <div class="name">{{ item.linkName }}</div>
          <div class="text">{{ item.content }}</div>
        </div>
        <div class="right">{{ item.createdOn && item.createdOn.replace(/T/, ' ') }}</div>
      </li>
    </ul>
    <center class="myPagination">
      <el-pagination
        @size-change="handleSizeChange"
        size="mini"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </center>
  </div>
  <div v-else class="zanwuxinxi"></div>
  </div>
</template>

<script>
export default {
  props: ['options'],
  data () {
    return {
      total: 0,
      pageSize: 10,
      groupMessageList: [],
      currentPage: 1,
      keyWord: null
    }
  },
  methods: {
    // 修改页容量
    handleSizeChange (size) {
      this.pageSize = size
    },
    // 修改当前页
    handleCurrentChange (page) {
      this.currentPage = page
    },
    // 搜索聊天记录
    search () {
      this.currentPage = 1
      this.getInstantMessageByNumber()
    },
    // 查看群聊天记录
    async getInstantMessageByNumber () {
      const res = await this.$http.post('/api/GetInstantMessageByNumber', { msgType: 'Text', skipCount: this.currentPage, maxResultCount: this.pageSize, content: this.keyWord, groupNumber: this.options.groupNumber })
      if (res.data.result.code === 200) {
        this.groupMessageList = res.data.result.item.items
        this.total = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {

  },
  mounted () {
    this.getInstantMessageByNumber()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.msgTypeConBox{
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
  .contenBox{
    padding: 10px;
    .wrap{
      max-height: 600px;
      overflow-x: hidden;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .left{
          margin-right: 10px;
          @{deep} .img{
            width: 50px;
            height: 50px;
            border-radius: 25px;
            .image-slot{
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #165af7;
              color: #fff;
              white-space: nowrap;
            }
          }
        }
        .middle{
          flex: 1;
          overflow: hidden;/*超出部分隐藏*/
          white-space: nowrap;/*不换行*/
          text-overflow:ellipsis;/*超出部分文字以...显示*/
          .name{
            color: #1B1B1B;
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
            text-overflow:ellipsis;/*超出部分文字以...显示*/
          }
          .text{
            color: #999999;
            font-size: 14px;
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
            text-overflow:ellipsis;/*超出部分文字以...显示*/
          }
        }
        .right{
          margin-left: 10px;
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .myPagination{
      margin-top: 10px;
      overflow-y: hidden;
      overflow-x: auto;
    }
  }
}
</style>
