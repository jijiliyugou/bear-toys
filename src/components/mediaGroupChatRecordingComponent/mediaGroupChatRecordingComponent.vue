<template>
<div>
  <div class="wrap" v-if="groupMessageList.length">
    <ul class="wrapBox">
        <li class="item" v-for="(item, i) in groupMessageList" :key="i">
          <el-image class="img" :src="item.attachment" :preview-src-list="[item.attachment]" v-if="item.messageType === 'Picture'">
            <div slot="error" class="image-slot">
              <img src="~@/assets/images/imgError.jpg" alt="">
            </div>
          </el-image>
          <video v-else controls class="video-js" style="object-fit:cover">
            <source ref="videoPreview" :src="item.attachment" type="video/ogg"/>
          </video>
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
      currentPage: 1
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
    // 查看群聊天记录
    async getInstantMessageByNumber () {
      const res = await this.$http.post('/api/GetInstantMessageByNumber', { msgType: 'imgorvideo', skipCount: this.currentPage, maxResultCount: this.pageSize, groupNumber: this.options.groupNumber })
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
    display: flex;
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
      .item{
        width: 25%;
        margin: 10px;
        img{
          width: 100%;
        }
        .video-js{
          width: 100%;
        }
      }
  }
  .myPagination{
      padding: 10px;
      overflow-y: hidden;
      overflow-x: auto;
    }
</style>
