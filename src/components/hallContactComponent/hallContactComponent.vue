<template>
<div class="wrapBox">
    <!-- 查看对应联系公司列表 -->
          <div class="mySearchs">
            <el-input
              class="searchInput"
              prefix-icon="iconfont icon-sousuo"
              clearable
              v-model="searchCompanyName"
              placeholder="请输入公司名称进行搜索"
              @keyup.enter.native="searchCompanyList"
            ></el-input>
          </div>
          <center
            style="margin-top:10px;font-size:14px;color:#383838;"
            v-show="showSearchCompanyCount"
          >
            搜索到
            <span style="color:red;">{{ companyListTotalCount }}</span> 个结果
          </center>
          <div class="listItems" v-if="companyListTotalCount" v-infinite-scroll="companyListLoad" infinite-scroll-disabled="companyLoadDisabled">
            <div class="itemsWrap">
              <div
              class="item"
              v-for="(item, i) in companyList"
              :key="i"
              @click="openCompanyDetail(item.companyId)"
            >
              <el-image class="myAvatar" :src="item.companyLogo" fit="cover">
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:left;white-space: nowrap;"
                >
                  {{ item.companyName }}
                </div>
              </el-image>
              <p>{{ item.companyName }}</p>
            </div>
            </div>
            <center class="inTheEnd" v-if="isInTheEnd">没有更多了呢</center>
          </div>
          <div v-else-if="showSearchCompanyCount" class="searchCompanyNoData">
            <p>暂无搜到联系人</p>
          </div>
          <div v-else class="companyNoData">
            <p>暂无联系人</p>
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
      searchCompanyName: '',
      showSearchCompanyCount: false,
      companyListTotalCount: 0,
      companyListPageSize: 20,
      companyListCurrentPage: 1,
      companyLoadDisabled: true,
      companyList: []
    }
  },
  methods: {
    // 搜索公司列表
    async searchCompanyList () {
      this.companyLoadDisabled = true
      $('.listItems').animate({ scrollTop: 0 })
      this.$nextTick(async () => {
        this.showSearchCompanyCount = false
        this.companyListCurrentPage = 1
        await this.getContactsCompanyListByID()
        this.showSearchCompanyCount = true
        this.showTypeOptions.showLiaotianType = null
        this.isGroupNumber = false
        this.active2 = null
      })
    },
    // 公司列表下拉加载更多
    async companyListLoad (val) {
      this.companyListCurrentPage++
      const res = await this.$http.post('/api/ContactsCompanyListByID', {
        companyID: this.options.id,
        oppositeRole: this.options.companyType,
        companyName: this.searchCompanyName,
        maxResultCount: this.companyListPageSize,
        skipCount: this.companyListCurrentPage
      })
      if (res.data.result.code === 200) {
        this.companyList = this.companyList.concat(res.data.result.item.items)
        this.companyListTotalCount = res.data.result.item.totalCount
        if (this.companyList.length >= this.companyListTotalCount) this.companyLoadDisabled = true
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取公司列表
    async getContactsCompanyListByID () {
      const res = await this.$http.post('/api/ContactsCompanyListByID', {
        companyID: this.options.id,
        oppositeRole: this.options.companyType,
        companyName: this.searchCompanyName,
        maxResultCount: this.companyListPageSize,
        skipCount: this.companyListCurrentPage
      })
      if (res.data.result.code === 200) {
        this.companyList = res.data.result.item.items
        this.companyListTotalCount = res.data.result.item.totalCount
        if (this.companyListTotalCount > this.companyListPageSize) this.companyLoadDisabled = false
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 点击对应公司列表查看详情
    async openCompanyDetail (id) {
      console.log(id)
    //   this.isGroupNumber = false
    //   this.showTypeOptions.showLiaotianType = null
    //   this.active2 = 4
    //   const res = await this.$http.post('api/OrgCompanyLableListByID', {
    //     CompanyId: id
    //   })
    //   if (res.data.result.code === 200) {
    //     this.CompanyDetail = res.data.result.item
    //     this.CompanyDetail.companyName =
    //       res.data.result.item.orgCompany.companyName
    //     this.CompanyDetail.companyLogo =
    //       res.data.result.item.orgCompany.companyLogo
    //     this.CompanyDetail.id = res.data.result.item.orgCompany.id
    //   }
    //   this.CompanyDetail.detailId = id
    }
  },
  created () {

  },
  mounted () {
    this.getContactsCompanyListByID()
  },
  computed: {
    isInTheEnd () {
      return this.companyList.length >= this.companyListTotalCount
    }
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox {
  width: 100%;
  height: 827px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  .mySearchs {
      margin-top: 20px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 0 20px;
      @{deep} .searchInput input.el-input__inner {
        border-radius: 20px;
        border: none;
        background-color: #eceeef;
      }
    }
    .listItems {
      flex: 1;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .itemsWrap{
        padding: 10px;
        padding-bottom: 0;
      }
      .inTheEnd{
        height: 40px;
        line-height: 40px;
        background-color: #eeeeed;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        .myAvatar {
          margin-right: 10px;
          width: 40px;
          height: 40px;
          background-color: #165af7;
          color: #fff;
          border-radius: 50%;
        }
      }
    }
    .companyNoData {
      width: 100%;
      height: 600px;
      background: url("~@/assets/images/tu.png") no-repeat center;
      position: relative;
      p {
        position: absolute;
        width: 100%;
        font-size: 20px;
        left: 0;
        font-weight: 500;
        color: #9a9a9a;
        text-align: center;
        top: 55%;
      }
    }
    .searchCompanyNoData {
      width: 100%;
      height: 600px;
      background: url("~@/assets/images/tu1.png") no-repeat center;
      position: relative;
      p {
        position: absolute;
        width: 100%;
        left: 0;
        font-weight: 500;
        color: #9a9a9a;
        text-align: center;
        top: 55%;
      }
    }
}
</style>
