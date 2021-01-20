
<template>
<div class="wrapBox">
        <h3 class="infoListTitle" style="background-color: #fff;">
          {{ options.companyType | ERPOrderTitle }}
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
            >您有新的消息通知 </span>
        </div>
        <div class="infoOrderList" v-infinite-scroll="orderLoad" infinite-scroll-disabled="disabled">
          <template
            v-if="
              ERPOrderOptions.ERPOrderList &&
                ERPOrderOptions.ERPOrderList.length
            "
          >
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
        <!-- 确认订单 -->
    <el-dialog
      title="确认提示"
      :visible.sync="queRenDialog"
      width="30%"
    >
      <center class="querenDialog">
        <h3 class="title">{{ options.client_na }}</h3>
        <p class="titleText">需要带走或借走所有样品？</p>
        <template>
          <div class="btns" v-if="options.messageExt === 3">
            <el-button
              @click="UpdateERPOrderStatus('1')"
              size="medium"
              round
              :class="{ activeGray: options.messageStatus === 1 }"
              >不可带</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('0')"
              size="medium"
              round
              :class="{
                blueBtn: true,
                activeBlue: options.messageStatus === 0
              }"
              >可带</el-button
            >
          </div>
          <div class="btns" v-else-if="options.messageExt === 5">
            <el-button
              size="medium"
              @click="UpdateERPOrderStatus('1')"
              round
              :class="{ activeGray: options.messageStatus === 1 }"
              >不可借</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('0')"
              size="medium"
              round
              :class="{
                orangeBtn: true,
                activeOrange: options.messageStatus === 0
              }"
              >可借</el-button
            >
          </div>
          <div class="btns" v-else-if="options.messageExt === 11">
            <el-button
              size="medium"
              @click="UpdateERPOrderStatus('2')"
              round
              :class="{ activeGray: options.messageStatus === 2 }"
              >不可带</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('0')"
              size="medium"
              round
              :class="{
                blueBtn: true,
                activeBlue: options.messageStatus === 0
              }"
              >可带</el-button
            >
            <el-button
              @click="UpdateERPOrderStatus('1')"
              size="medium"
              round
              :class="{
                orangeBtn: true,
                activeOrange: options.messageStatus === 1
              }"
              >可借</el-button
            >
          </div>
        </template>
        <p style="padding-top:20px;">
          <i
            style="width:16px;height:16px;backgroundColor:#709AFA;display:inline-block;border-radius:50%;color:white;vertical-align: middle;"
            >!</i
          >
          此次操作将确认所有货号状态
        </p>
      </center>
    </el-dialog>
</div>
</template>

<script>
export default {
  props: ['options'],
  data () {
    return {
      loading: false,
      orderCurrentPage: 1,
      orderPageSize: 20,
      orderSampleFrom: null,
      queRenDialog: false,
      showTypeOptions: {
        showType: null,
        sampleFrom: null,
        showLiaotianType: null,
        showOrderDetail: false,
        isShowOrderDetail: true
      },
      ERPOrderOptions: {
        ERPOrderList: [],
        total: 0
      }
    }
  },
  methods: {
    // 打开三级窗口订单详情
    openTwoView (item) {
      const fd = {
        ...item,
        componentName: 'orderDetailComponent'
      }
      this.$emit('openTwoView', fd)
    },
    // 确认订单列表修改订单状态
    async UpdateERPOrderStatus (messageStatus) {
      const res = await this.$http.post('/api/UpdateERPOrderStatus', {
        erpOrderID: this.options.erpOrderID,
        messageStatus: messageStatus,
        statusType: 'ConfirmStatus'
      })
      if (res && res.data.result.code === 200) {
        this.$message.success('确认订单完成')
        // 重新获取订单列表
        this.orderCurrentPage = 1
        const re = await this.getERPOrderListByPage()
        if (re.data.result.code === 200) {
          this.ERPOrderOptions.ERPOrderList = re.data.result.item.items
          console.log(re.data.result.item.items)
          this.ERPOrderOptions.total = re.data.result.item.totalCount
          for (let i = 0; i < this.ERPOrderOptions.ERPOrderList.length; i++) {
            if (
              this.ERPOrderOptions.ERPOrderList[i].erpOrderID ===
              this.orderOptions.erpOrderID
            ) {
              this.options = this.ERPOrderOptions.ERPOrderList[i]
            }
          }
        }

        this.queRenDialog = false
      } else {
        this.$message.success('确认订单失败，请检查网络')
      }
    },
    // 下拉加载更多订单
    async orderLoad () {
      console.log(this.ERPOrderOptions.ERPOrderList, this.ERPOrderOptions.total)
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
    // 查询订单业务通知
    async getERPOrderListByPage () {
      const fd = {
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
    // 打开页面获取数据
    async getOrderList () {
      const res = await this.getERPOrderListByPage()
      if (res.data.result.code === 200) {
        this.ERPOrderOptions.ERPOrderList = res.data.result.item.items
        this.ERPOrderOptions.total = res.data.result.item.totalCount
      }
    },
    // 确认订单
    async configOrder (val) {
      this.orderOptions = val
      this.queRenDialog = true
    },
    // 点击订单|订单详情立即沟通
    async orderSend (item) {
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
            toUserID: '',
            toCompanyID: '',
            ...item,
            componentName: 'personalChatComponent'
          }
          this.$emit('openTwoView', fd)
          console.log(fd, this.options, item)
        }
      }
    }
  },
  created () {

  },
  mounted () {
    this.getOrderList()
    this.$root.eventHub.$on('resetGetERPOrderListByPage', () => {
      this.orderCurrentPage = 1
      this.getOrderList()
    })
    console.log(this.options)
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
    },
    ERPOrderTitle (val) {
      let type
      switch (val) {
        case 'SUPPLIER':
        case 'supplier':
          type = '厂商业务列表'
          break
        case 'SALES':
        case 'sales':
          type = '公司业务列表'
          break
        case 'HALL':
        case 'hall':
          type = '展厅业务列表'
          break
      }
      return type
    }
  },
  watch: {
    // 监听订单长连接推送消息
    '$store.state.wsOrderMsg' (val) {
      console.log(val)
      this.orderSampleFrom = val
    }
  },
  computed: {
    noMore () {
      return this.ERPOrderOptions.ERPOrderList.length >= this.ERPOrderOptions.total
    },
    disabled () {
      return this.loading || this.noMore
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
.querenDialog {
  font-size: 16px;
  .title {
    color: #165af7;
    font-weight: bold;
  }
  .titleText,
  .title {
    padding-bottom: 20px;
    color: black;
  }
  .btns {
    .blueBtn {
      color: #165af7;
      border-color: #165af7;
      &.activeBlue {
        background-color: #165af7;
        color: white;
      }
    }
    .orangeBtn {
      color: #f56024;
      border-color: #f56024;
      &.activeOrange {
        background-color: #f56024;
        color: white;
      }
    }
    .activeGray {
      background-color: #5a5a5a;
      color: white;
    }
  }
}

</style>
