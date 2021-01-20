<template>
<div class="page">
   <div class="wrap" v-if="groupMessageList.length">
    <ul class="wrapBox">
        <div class="bigItem" v-for="(item, i) in groupMessageList" :key="i">
          <li class="item">
          <el-image class="img" :src="item.userImage" :preview-src-list="[item.userImage]">
            <div slot="error" class="image-slot">
              <img src="~@/assets/images/imgError.jpg" alt="">
            </div>
          </el-image>
          <div class="name">{{ item.linkName }}</div>
          <div class="date">{{ item.createdOn && item.createdOn.replace(/T/, ' ') }}</div>
        </li>
        <div class="linkBox">
          <div class="left">
            <el-image class="img" :src="require('../../assets/images/linkIcon.png')" :preview-src-list="[item.userImage]">
            <div slot="error" class="image-slot">
              <img src="~@/assets/images/imgError.jpg" alt="">
            </div>
          </el-image>
          </div>
          <div class="right" @click="openLink(item)">
            <p>{{item.content}}</p>
            <p>{{item.attachment}}</p>
          </div>
        </div>
        </div>
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
      currentPage: 1
    }
  },
  methods: {
    // 打开链接
    openLink (link) {
      window.open(link.content)
    },
    // 修改页容量
    handleSizeChange (size) {
      this.pageSize = size
    },
    // 修改当前页
    handleCurrentChange (page) {
      this.currentPage = page
    },
    // 查看群聊天记录
    async getInstantMessageByNumber () {
      const res = await this.$http.post('/api/GetInstantMessageByNumber', { msgType: 'Product', skipCount: this.currentPage, maxResultCount: this.pageSize, groupNumber: this.options.groupNumber })
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
  .wrapBox{
    max-height: 700px;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .bigItem{
      width: 100%;
      .item{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          box-sizing: border-box;
          color: #999999;
        .img{
          width: 50px;
          height: 50px;
          border-radius: 25px;
          img{
            width: 100%;
          }
        }
        .name{
          margin-left: 10px;
          flex: 1;
        }
        .date{
          font-size: 12px;
        }
      }
      .linkBox{
        display: flex;
        padding: 0 10px;
        .left {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background-color: #F5F5F5;
          .img{
            width: 30px;
            height: 30px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .right{
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0 10px;
          cursor: pointer;
          p{
            flex: 1;
            display: flex;
            align-items: center;
            &:last-of-type{
              color: #165AF8;
            }
          }
        }
      }
    }
  }
  .myPagination{
    padding: 10px;
    overflow-y: hidden;
    overflow-x: auto;
  }
</style>
