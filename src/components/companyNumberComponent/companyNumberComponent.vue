<template>
<div class="wrapBox">
    <!-- 点击对应公司展示我的排号 -->
        <h3 class="infoListTitle" style="background-color: #fff;">
          {{ options.client_na }}
          <span style="margin-left:20px;font-size:14px;">
            (共
            <strong style="color:red;">{{ ERPOrderOptions.total }}</strong> 条)
          </span>
        </h3>
        <div
          class="xinde"
          v-show="orderSampleFrom && orderSampleFrom.SampleFrom.toLowerCase() === (options.sampleFrom.toLowerCase())">
          <span
            class="xindeInfo"
            @click="resetCompanyList"
            >您有新的消息通知</span
          >
        </div>
        <template
          v-if="
              options.sampleFrom.toLowerCase() === 'hall' &&
              $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
        >
          <div class="meCode" @click="openRowMeCode">
            <div class="meCodeContent">
              <el-image
                class="meCodeImg"
                :src="options.companyLogo"
                fit="cover"
              >
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ options.client_na }}
                </div>
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ options.client_na }}
                </div>
              </el-image>
              <div class="codeTitle">我的排号:</div>
              <div class="code">{{ personalNumber.arr_nu }}</div>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div
            class="productList"
            v-if="
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
            "
          >
            <span
              :class="{
                productIten: true,
                active: showSampleSelection === 'choosingHistoryComponent'
              }"
              @click="openSampleList('choosingHistoryComponent')"
            >
              <i class="historyIcon"></i>历史择样
            </span>
            <span
              :class="{
                productIten: true,
                active: showSampleSelection === 'sampleSelectionRankingComponent'
              }"
              @click="openSampleList('sampleSelectionRankingComponent')"
            >
              <i class="rankingIcon"></i>择样排行
            </span>
            <span
              :class="{
                productIten: true,
                active: showSampleSelection === 'myProductComponent'
              }"
              @click="openSampleList('myProductComponent')"
            >
              <i class="myProductIcon"></i>我的产品
            </span>
          </div>
        </template>
        <div class="infoOrderList" v-infinite-scroll="orderLoad" infinite-scroll-disabled="disabled">
          <template v-if="ERPOrderOptions.ERPOrderList.length">
            <div v-for="(item, i) in ERPOrderOptions.ERPOrderList" :key="i">
              <center>
                <span class="date">{{
                  item.createdOn && item.createdOn.replace(/T/, " ")
                }}</span>
              </center>
              <div class="infoOrder" @click="openTwoView(item)">
                <div class="orderState">
                  <div class="title">
                    {{
                      $store.state.userInfo.commparnyList[0].companyType ==
                      "Exhibition"
                        ? item.toCompanyName + "：" + item.messageTitle
                        : $store.state.userInfo.commparnyList[0].companyType ==
                          "Supplier"
                        ? item.fromCompanyName + "：" + item.messageTitle
                        : item.messageModel === '7'
                        ? item.toCompanyName + "：" + item.messageTitle
                        : item.fromCompanyName + "：" + item.messageTitle
                    }}
                  </div>
                  <el-tag
                    :class="{ red: item.orderStatus === '0' }"
                    :type="
                      item.orderStatus === '9'
                        ? 'success'
                        : item.orderStatus === '1'
                        ? 'danger'
                        : item.orderStatus === '99'
                        ? 'info'
                        : ''
                    "
                    effect="dark"
                  >
                    <i
                      :class="{
                        wanchengIcon: item.orderStatus === '9',
                        weichakanIcon: item.orderStatus === '0',
                        weiquerenIcon: item.orderStatus === '1',
                        yiquxiaoIcon: item.orderStatus === '99'
                      }"
                    ></i>
                    {{ item | myState }}
                  </el-tag>
                </div>
                <div class="txtWrap">
                  <p>
                    <span class="title">客户名称：</span>
                    {{ item.client_na }}
                  </p>
                  <p>
                    <span class="title">消息时间：</span>
                    {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
                  </p>
                  <p>
                    <span class="title">本次代号：</span>
                    {{ item.the_nu }}
                  </p>
                  <p class="remark">
                    <span class="title">备注：</span>
                    {{ item.pushContent }}
                  </p>
                </div>
                <div class="btnList">
                  <div class="box" v-if="item.orderType === 'Sample'">
                    <el-button round size="mini">查看详情</el-button>
                  </div>
                  <div class="box" v-else-if="item.orderType === 'OrderOffer'">
                    <el-button
                      type="success"
                      round
                      size="mini"
                      v-show="
                        !item.confirmStatus &&
                          (item.messageExt === '3' ||
                            item.messageExt === '5' ||
                            item.messageExt === '11')
                      "
                      @click.stop="configOrder(item)"
                      >确认完成</el-button
                    >
                    <el-button round size="mini">查看详情</el-button>
                    <el-button
                      type="primary"
                      round
                      size="mini"
                      @click.stop="orderSend(item)"
                      >立即沟通</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <center style="padding-top:10px;">
              <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </div>
</div>
</template>

<script>
export default {
  props: ['options'],
  data () {
    return {
      loading: false,
      currentNumberPageSize: 10,
      currentNumberCurrentPage: 0,
      orderSampleFrom: null,
      showSampleSelection: null,
      orderCurrentPage: 1,
      orderPageSize: 20,
      personalNumber: {
        arr_nu: null,
        historyNumbers: []
      },
      ERPOrderOptions: {
        ERPOrderList: [],
        total: 0
      }
    }
  },
  methods: {
    // 打开 历史择样|择样排行|我的产品 列表
    async openSampleList (val) {
      var fd = this.$_.cloneDeepWith(this.options)
      fd.componentName = val
      this.showSampleSelection = val
      this.$emit('openTwoView', fd)
    },
    // 打开三级窗口订单详情
    openTwoView (item) {
      const fd = {
        ...item,
        componentName: 'orderDetailComponent'
      }
      this.showSampleSelection = null
      this.$emit('openTwoView', fd)
    },
    // 下拉加载更多订单
    async orderLoad () {
      if (
        this.ERPOrderOptions.ERPOrderList.length < this.ERPOrderOptions.total
      ) {
        this.orderCurrentPage++
        const res = await this.getERPOrderListByPage()
        if (res.data.result.code === 200) {
          this.ERPOrderOptions.ERPOrderList = this.ERPOrderOptions.ERPOrderList.concat(
            res.data.result.item.items
          )
          this.ERPOrderOptions.total = res.data.result.item.totalCount
        }
      }
    },
    // 打开页面订单获取数据
    async getOrderList () {
      const re = await this.getPersonalNumber()
      if (re.data.result.code === 200) {
        this.personalNumber = re.data.result.item
      }
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 查询订单业务通知
    async getERPOrderListByPage () {
      const fd = {
        companyNumber: this.options.companyNumber,
        isToCompany: this.options.isToCompany,
        skipCount: this.orderCurrentPage,
        maxResultCount: this.orderPageSize,
        readStatus: '-1',
        sampleFrom: this.options.companyType
      }
      return await this.$http.post('/api/GetERPOrderListByPage', fd)
    },
    // 点击您有新的消息
    async resetCompanyList () {
      this.$store.commit('clearWsOrderMsg')
      // 刷新列表
      this.orderCurrentPage = 1
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 点击订单|订单详情立即沟通
    async orderSend (item) {
      this.showSampleSelection = null
      this.$store.commit('clearWsMsg')
      this.MessageUnreadCount = null
      this.orderItemsOptions = item
      const res = await this.$http.post('/api/GetPersonnelListByERPOrderNumber', {
        orderNumber: item ? item.orderNumber : this.orderOptions.orderNumber
      })
      if (res.data.result.code === 200) {
        if (res.data.result.item.length < 1) {
          this.$message.error('该用户未注册')
          return false
        } else {
          const fd = {
            linkName: res.data.result.item[0].companyName,
            isGroup: true,
            isOrderShow: true,
            toUserID: '',
            toCompanyID: '',
            ...item,
            componentName: 'personalChatComponent'
          }
          this.$emit('openTwoView', fd)
          console.log(fd, this.options, item)
        }
      }
    },
    // 获取排号
    async getPersonalNumber () {
      return await this.$http.post('/api/PersonalNumber', {
        companyNumber: this.options.client_nu
      })
    },
    // 打开我的排号详情
    async openRowMeCode () {
      this.showSampleSelection = null
      var fd = this.$_.cloneDeepWith(this.options)
      fd.componentName = 'rowNumberDetails'
      this.$emit('openTwoView', fd)
    }
  },
  created () {

  },
  async mounted () {
    this.getOrderList()
    this.$root.eventHub.$on('resetGetERPOrderListByPage', () => {
      this.orderCurrentPage = 1
      this.getOrderList()
    })
  },
  computed: {
    noMore () {
      return this.ERPOrderOptions.ERPOrderList.length >= this.ERPOrderOptions.total
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  filters: {
    myState (val) {
      let msg
      switch (val.orderStatus) {
        case '0':
          msg = '未查看'
          break
        case '1':
          msg = '未确认'
          break
        case '99':
          msg = '已取消'
          break
        case '9':
          msg = '已完成'
          break
      }
      return msg
    }
  },
  watch: {
    // 监听订单长连接推送消息
    '$store.state.wsOrderMsg' (val) {
      console.log(val)
      this.orderSampleFrom = val
    }
  },
  beforeDestroy () {
    this.$root.eventHub.$off('resetGetERPOrderListByPage')
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
  height: 825px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-direction: column;
  .infoListTitle {
    min-height: 50px !important;
    background-color: #f6f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
  }
  .xinde {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-top:1px solid #ccc;
    text-align:center;
    .xindeInfo{
      border-radius: 30px;
      background-color:#f8f8f8;
      color:#00b94b;
      padding:8px 30px;
      cursor: pointer;
    }
  }
  .meCode {
    width: 100%;
    height: 100px;
    background-color: #f6f9ff;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    cursor: pointer;
    .meCodeImg {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #165af7;
      color: #fff;
    }
    .meCodeContent {
      flex: 1;
      height: 100px;
      display: flex;
      align-items: center;
      .codeTitle {
        margin: 0 10px;
      }
      .code {
        font-size: 30px;
        color: #165af8;
        font-weight: bold;
      }
    }
    &:hover .el-icon-arrow-right {
      color: #165af8;
    }
  }
  .productList {
        height: 70px;
        width: 100%;
        box-sizing: border-box;
        background-color: #f6f9ff;
        border-top: 10px solid #f3f3f3;
        border-bottom: 10px solid #f3f3f3;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .productIten {
          font-size: 14px;
          width: 33%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:nth-of-type(2) {
            position: relative;
            &::before,
            &::after {
              content: "";
              position: absolute;
              width: 2px;
              height: 20px;
              background-color: #b6caf2;
            }
            &::before {
              left: -2px;
            }
            &::after {
              right: -2px;
            }
          }
          .historyIcon,
          .rankingIcon,
          .myProductIcon {
            width: 16px;
            height: 16px;
            background-color: #ccc;
            margin-right: 5px;
          }
          .historyIcon {
            background: url("~@/assets/images/历史.png") no-repeat center;
            background-size: contain;
          }
          .rankingIcon {
            background: url("~@/assets/images/排行.png") no-repeat center;
            background-size: contain;
          }
          .myProductIcon {
            background: url("~@/assets/images/产品.png") no-repeat center;
            background-size: contain;
          }
          &.active {
            background-color: #fff;
          }
        }
  }
  .infoOrderList {
        flex: 1;
        overflow: auto;
        padding: 0 10px 10px 10px;
        font-size: 14px;
        box-sizing: border-box;
        background-color: #f5f5f5;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        div {
          center {
            margin: 20px 0;
            .date {
              height: 24px;
              width: 156px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #dadada;
              color: #ffffff;
            }
          }
        }
        .infoOrder {
          background-color: #fff;
          box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.14);
          border-radius: 10px;
          margin-top: 10px;
          padding: 0 10px;
          .orderState {
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-tag {
              display: flex;
              align-items: center;
              &.red {
                background-color: #f4382e;
                border-color: #f4382e;
              }
              .weiquerenIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/未确认.png") no-repeat center;
                background-size: contain;
              }
              .yiquxiaoIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/已取消.png") no-repeat center;
                background-size: contain;
              }
              .wanchengIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/完成.png") no-repeat center;
                background-size: contain;
              }
              .weichakanIcon {
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url("~@/assets/images/未查看.png") no-repeat center;
                background-size: contain;
              }
            }
          }
          .txtWrap {
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
            p {
              padding-top: 5px;
              &.remark {
                display: -webkit-box;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: pre-line;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
              }
              .title {
                color: #a0a0a0;
              }
            }
          }
          .btnList {
            padding: 10px 0;
            .box {
              float: right;
              button.el-button.el-button--default.el-button--mini.is-round {
                border-color: #66b1ff;
                color: #66b1ff;
              }
            }
            &::after {
              content: "";
              display: block;
              width: 0;
              height: 0;
              overflow: hidden;
              clear: both;
            }
          }
        }
      }
}
</style>
