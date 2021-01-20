<template>
  <div class="buyersListBox">
    <template v-if="!Sales">
      <div class="zanwuxinxi"></div>
    </template>
    <template v-else>
      <div class="navBar">
        <div class="navBarTitle">
          公司信息
        </div>
      </div>
      <ul class="buyersList">
        <li
          class="buyersItem"
          @click="
            $router.push({
              name: 'companyDetail',
              params: { id: item.companyNumber, title: '公司联系方式'}
            })
          "
          v-for="item in Sales"
          :key="item.id"
        >
          <div class="myAvatars">
            <el-image
              style="width: 285px; height: 285px"
              fit="contain"
              :src="item.companyLogo"
            >
              <div slot="placeholder" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
              <div slot="error" class="image-slot">
                <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
              </div>
            </el-image>
          </div>
          <div class="text">
            <p>{{ item.companyName }}</p>
            <p>联系人：{{ item.contactsMan }}</p>
          </div>
        </li>
        <li class="pink"></li>
      </ul>
      <center style="margin:20px;">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          :page-sizes="[10, 30, 60, 100]"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="changePage"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Sales: null,
      currentPage: 1,
      pageSize: 60,
      totalCount: 0
    }
  },
  methods: {
    // 获取所有公司
    async getSalesList () {
      const res = await this.$http.post('/api/CompanyManagementPage ', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        companyType: 'Sales'
      })
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount
        this.Sales = res.data.result.item.items
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 用户管理分页事件
    changePage (currentPage) {
      this.currentPage = currentPage
      this.getSalesList()
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      if (this.currentPage * pageSize > this.totalCount) return
      this.getSalesList()
    }
  },
  mounted () {
    this.getSalesList() // 推荐公司
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.buyersListBox {
  min-height: 395px;
  .navBar {
    background: linear-gradient(#fff, #e8e8e8, #e8e8e8, #c5c5c5);
    .navBarTitle {
      height: 50px;
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      align-items: center;
    }
  }
  .buyersList {
    display: flex;
    max-width: 1200px;
    min-width: 1024px;
    margin: 0 auto;
    justify-content: space-between;
    text-align: justify;
    flex-wrap: wrap;
    &:after {
      content: "";
      width: 285px;
    }
    .pink {
      width: 285px;
    }
    .buyersItem {
      width: 285px;
      margin: 10px 0;
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
      cursor: pointer;
      .myAvatars {
        width: 100%;
        height: 285px;
        @{deep} .el-image {
          img {
            width: 100%;
            height: 285px;
            transition: all 1s;
          }
        }
      }
      .text {
        height: 80px;
        font-size: 18px;
        color: black;
        box-sizing: border-box;
        padding: 13px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: inset 0 2px 3px -1px #e0e0e0;
        p:last-of-type {
          font-size: 16px;
          color: #444444;
        }
      }
      &:hover {
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
        .myAvatars {
          @{deep} .el-image {
            img {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }
}
</style>
