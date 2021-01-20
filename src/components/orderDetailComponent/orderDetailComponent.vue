<template>
<div class="wrapBox">
    <!-- 择样订单详情 -->
        <h3 class="infoListTitle">
          {{
            $store.state.userInfo.commparnyList[0].companyType === "Exhibition"
              ? options.toCompanyName
              : $store.state.userInfo.commparnyList[0].companyType === "Supplier"
              ? options.fromCompanyName
              : options.messageModel === '7'
              ? options.toCompanyName
              : options.fromCompanyName
          }}
        </h3>
        <div class="orderDetailState">
          <div class="title">
            {{
              $store.state.userInfo.commparnyList[0].companyType === "Exhibition"
                ? options.toCompanyName + "：" + options.messageTitle
                : $store.state.userInfo.commparnyList[0].companyType ==
                  "Supplier"
                ? options.fromCompanyName +
                  "：" +
                  options.messageTitle
                : options.messageModel === '7'
                ? options.toCompanyName + "：" + options.messageTitle
                : options.fromCompanyName +
                  "：" +
                  options.messageTitle
            }}
          </div>
          <!-- 订单详情状态 -->
          <el-tag
            :class="{ red: options.orderStatus === '0' }"
            :type="
              options.orderStatus === '9'
                ? 'success'
                : options.orderStatus === '1'
                ? 'danger'
                : options.orderStatus === '99'
                ? 'info'
                : ''
            "
            effect="dark"
          >
            <i
              :class="{
                wanchengIcon: options.orderStatus === '9',
                weichakanIcon: options.orderStatus === '0',
                weiquerenIcon: options.orderStatus === '1',
                yiquxiaoIcon: options.orderStatus === '99'
              }"
            ></i>
            {{ options | myState }}
          </el-tag>
        </div>
        <div
          class="mobile"
          v-show="
            $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
        >
          <p>
            <span class="title">客户名称：</span>
            {{ options.client_na }}
          </p>
          <p>
            <span class="title">消息时间：</span>
            {{
              options.createdOn && options.createdOn.replace(/T/, " ")
            }}
          </p>
          <p>
            <span class="title">本次代号：</span>
            {{ options.the_nu }}
          </p>
          <p class="remark">
            <span class="title">备注：</span>
            {{ options.pushContent }}
          </p>
          <div class="btns">
            <el-button
              v-if="options.orderType === 'OrderOffer'"
              round
              size="small"
              type="primary"
              @click="orderSend(options)"
              >立即沟通</el-button
            >
            <el-button
              round
              size="small"
              @click="configOrder(options)"
              v-show="
                !options.confirmStatus &&
                  (options.messageExt === '3' ||
                    options.messageExt === '5' ||
                    options.messageExt === '11')
              "
            >
              确认完成
            </el-button>
          </div>
        </div>
        <el-tabs
          type="border-card"
          v-if="
            $store.state.userInfo.commparnyList &&
              $store.state.userInfo.commparnyList[0] &&
              $store.state.userInfo.commparnyList[0].companyType === 'Supplier'
          "
          v-model="activeName"
          class="orderDetailTitle"
        >
          <el-tab-pane
            :label="'历史记录(' + orderDetailTotal + '条)'"
            name="first"
          >
            <div class="headerTitle">
              <div class="headerItem code"><i></i> 出厂货号</div>
              <div class="headerItem client"><i></i>客户</div>
              <div class="headerItem date"><i></i>时间</div>
            </div>
            <div class="historyReco">
              <li v-for="(item, i) in orderDetailList" :key="i">
                <div class="fa_no">{{ item.fa_no }}</div>
                <div class="client_na">{{ item.client_na }}</div>
                <div class="createdOn">
                  {{
                    item.createdOn && item.createdOn.replace(/T[\s\S]+/gi, "")
                  }}
                </div>
              </li>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="'当前记录(' + orderDetailTotal + '条)'"
            name="last"
          >
            <ul class="cureentReco">
              <li v-for="(item, i) in orderDetailList" :key="i">
                <div class="fa_no">
                  <i></i>
                  {{ item.fa_no }}
                </div>
                <div class="pr_na" v-if="item.messageExt === '0'">
                  {{ item.pr_na }}
                </div>
                <div class="btns" v-else-if="item.messageExt === '3'">
                  <el-button
                    @click="updateOrderConfirmStatus(item, 1)"
                    size="mini"
                    round
                    :class="{ activeGray: item.messageStatus === '1' }"
                    >不可带</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 0)"
                    size="mini"
                    round
                    :class="{
                      blueBtn: true,
                      activeBlue: item.messageStatus === '0'
                    }"
                    >可带</el-button
                  >
                </div>
                <div class="btns" v-else-if="item.messageExt === '5'">
                  <el-button
                    size="mini"
                    @click="updateOrderConfirmStatus(item, 1)"
                    round
                    :class="{ activeGray: item.messageStatus === '1' }"
                    >不可借</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 0)"
                    size="mini"
                    round
                    :class="{
                      orangeBtn: true,
                      activeOrange: item.messageStatus === '0'
                    }"
                    >可借</el-button
                  >
                </div>
                <div class="btns" v-else-if="item.messageExt === '11'">
                  <el-button
                    size="mini"
                    @click="updateOrderConfirmStatus(item, 2)"
                    round
                    :class="{ activeGray: item.messageStatus === '2' }"
                    >不可带</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 0)"
                    size="mini"
                    round
                    :class="{
                      blueBtn: true,
                      activeBlue: item.messageStatus === '0'
                    }"
                    >可带</el-button
                  >
                  <el-button
                    @click="updateOrderConfirmStatus(item, 1)"
                    size="mini"
                    round
                    :class="{
                      orangeBtn: true,
                      activeOrange: item.messageStatus === '1'
                    }"
                    >可借</el-button
                  >
                </div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <div
          v-else
          class="orderDetailTitle2"
          @scroll="orderDetailListShowTotal"
          v-infinite-scroll="orderDetailListScroll"
        >
          <div class="mobile">
            <p>
              <span class="title">客户名称：</span>
              {{ options.client_na }}
            </p>
            <p>
              <span class="title">消息时间：</span>
              {{
                options.createdOn &&
                  options.createdOn.replace(/T/, " ")
              }}
            </p>
            <p>
              <span class="title">本次代号：</span>
              {{ options.the_nu }}
            </p>
            <p class="remark">
              <span class="title">备注：</span>
              {{ options.pushContent }}
            </p>
            <div class="btns">
              <el-button
                v-if="options.orderType === 'OrderOffer'"
                round
                size="small"
                type="primary"
                @click="orderSend(options)"
                >立即沟通</el-button
              >
              <el-button
                round
                size="small"
                @click="configOrder(options)"
                v-show="
                  !options.confirmStatus &&
                    (options.messageExt === 3 ||
                      options.messageExt === 5 ||
                      options.messageExt === 11)
                "
              >
                确认完成
              </el-button>
            </div>
          </div>
          <el-card
            class="productItem"
            v-for="item in orderDetailList"
            :key="item.id"
          >
            <div class="context">
              <div class="left">
                <el-image
                  class="myImage"
                  :src="item.imgUrl && item.imgUrl[0]"
                  fit="contain"
                ></el-image>
              </div>
              <div class="right">
                <p>{{ item.pr_na }}</p>
                <p>货号：{{ item.co_nu }}</p>
                <p>包装：{{ item.ch_pa }}</p>
                <p>
                  样品规格：{{ item.pr_le }}X{{ item.pr_wi }}X{{
                    item.pr_hi
                  }}(CM)
                </p>
                <p>
                  外箱规格：{{ item.ou_le }}X{{ item.ou_wi }}X{{
                    item.ou_hi
                  }}(CM)
                </p>
                <p>装箱量：{{ item.in_en }}/{{ item.ou_lo }}(PCS)</p>
                <p>
                  体积/材积：{{ item.bulk_feet }}(CBM)/{{
                    item.bulk_stere
                  }}(CUFT)
                </p>
                <p>净重/毛重：{{ item.ne_we }}/{{ item.gr_we }}(kg)</p>
                <p>
                  参考单价：<span class="price">{{
                    item.cu_de + item.fa_pr.toFixed(2)
                  }}</span>
                </p>
              </div>
            </div>
            <div class="contact">
              <div class="laiyuan">
                来源于：<span>{{
                  $store.state.userInfo.commparnyList &&
                  $store.state.userInfo.commparnyList[0] &&
                  $store.state.userInfo.commparnyList[0].companyType ==
                    "Exhibition"
                    ? item.supplierName
                    : item.exhibitionName
                }}</span>
              </div>
              <el-button
                round
                size="mini"
                type="primary"
                @click="orderSend(undefined, item)"
                >立即沟通</el-button>
            </div>
          </el-card>
        </div>
        <div class="totalBox">
          <transition name="el-zoom-in-bottom">
            <div v-show="drawer" class="transition-box">
              <h3>合计：</h3>
              <div class="items">
                <p>
                  箱数/数量：<span
                    >{{
                      orderDetailTotalCount && orderDetailTotalCount.sumtAmount
                    }}/{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumAmountOu_lo
                    }}(个)</span
                  >
                </p>
                <p>
                  体积/材积：<span
                    >{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumBulk_stere
                    }}(CBM)/{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumBulk_feet
                    }}(cuft)</span
                  >
                </p>
              </div>
              <div class="items">
                <p>
                  毛重/净重：<span
                    >{{
                      orderDetailTotalCount && orderDetailTotalCount.sumGr_we
                    }}/{{
                      orderDetailTotalCount && orderDetailTotalCount.sumNe_we
                    }}(kg)</span
                  >
                </p>
                <p>
                  出厂价/总销售价：<span
                    >{{
                      orderDetailTotalCount &&
                        orderDetailTotalCount.sumAmountFa_pr
                    }}/{{
                      orderDetailTotalCount && orderDetailTotalCount.sumFa_pr_pr
                    }}</span
                  >
                </p>
              </div>
            </div>
          </transition>
        </div>
</div>
</template>

<script>
export default {
  props: {
    options: Object
  },
  data () {
    return {
      activeName: '',
      orderDetailTotal: 0,
      drawer: false,
      orderDetailTotalCount: null,
      orderDetailList: []
    }
  },
  methods: {
    // 确认订单详情修改订单状态
    async updateOrderConfirmStatus (item, messageStatus) {
      const res = await this.$http.post('/api/UpdateOrderConfirmStatus', {
        OfferDetailId: item.id,
        messageStatus: messageStatus
      })
      let re
      switch (res.data.result.code) {
        case 200:
          this.$message.success('修改订单成功')
          // if (res.data.result.item.confirmStatus) {
          // }
          re = await this.getOrderDetail(this.orderOptions) // 获取订单详情
          if (re.data.result.code === 200) {
            this.orderDetailList = re.data.result.item.items
            this.orderDetailTotal = re.data.result.item.totalCount
          }
          break
        case 400:
          this.$message.error(res.data.result.msg)
          break
      }
    },
    // 获取订单详情
    async getOrderDetail ({ orderType, erpOrderID, orderNumber, sampleNumber, messageExt }) {
      this.activeName = messageExt === '0' ? 'first' : 'last'
      if (orderType === 'Sample') {
        return await this.$http.post('/api/SampleOrderDetailPage', {
          SampleNumber: orderNumber,
          Id: erpOrderID,
          skipCount: this.orderDetailCurrentPage,
          maxResultCount: this.orderDetailPageSize
        })
      } else {
        return await this.$http.post('/api/OrderOfferDetailPage', {
          offerNumber: orderNumber,
          Id: erpOrderID,
          skipCount: this.orderDetailCurrentPage,
          maxResultCount: this.orderDetailPageSize
        })
      }
    },
    // 订单详情滚动事件
    async orderDetailListScroll () {
      if (this.orderDetailTotal <= this.orderDetailPageSize) return false
      else {
        this.orderDetailCurrentPage++
        const res = await this.getOrderDetail(this.options) // 获取订单详情
        if (res.data.result.code === 200) {
          this.orderDetailList = this.orderDetailList.concat(
            res.data.result.item.items
          )
          this.orderDetailTotal = res.data.result.item.totalCount
        }
      }
    },
    // 点击订单|订单详情立即沟通
    async orderSend (item) {
      console.log(item)
      this.$store.commit('clearWsMsg')
      const res = await this.$http.post('/api/GetPersonnelListByERPOrderNumber', {
        orderNumber: item.orderNumber
      })
      if (res.data.result.code === 200) {
        if (res.data.result.item.length < 1) {
          this.$message.error('该用户未注册')
          return false
        } else {
          console.log(res.data.result, this.options)
          const fd = {
            linkName: res.data.result.item[0].companyName,
            isGroup: true,
            isOrderShow: true,
            ...item,
            toUserID: '',
            companyId: '',
            componentName: 'personalChatComponent'
          }
          this.$emit('openTwoView', fd)
        }
      }
    },
    // 滚动显示总数
    orderDetailListShowTotal (e) {
      e.target.scrollTop ? (this.drawer = true) : (this.drawer = false)
    },
    // 获取订单详情合计
    async getOrderDetailTotal () {
      let res
      if (this.options.orderType === 'Sample') {
        res = await this.$http.post('/api/SampleOrderTotal', {
          SampleNumber: this.options.orderNumber
        })
      } else {
        res = await this.$http.post('/api/OrderOfferTotal', {
          offerNumber: this.options.orderNumber
        })
      }
      if (res.data.result.code === 200) {
        this.orderDetailTotalCount = res.data.result.item
      }
    }
  },
  created () {

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
  async mounted () {
    const res = await this.getOrderDetail(this.options)
    if (res.data.result.code === 200) {
      this.orderDetailList = res.data.result.item.items
      this.orderDetailTotal = res.data.result.item.totalCount
    }
    this.getOrderDetailTotal()
    this.$nextTick(() => this.$root.eventHub.$emit('resetGetERPOrderListByPage'))
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
    height: 827px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    .infoListTitle {
        height: 50px;
        background-color: #f6f6f6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
      }
    .orderDetailState {
        padding: 5px 10px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        border-bottom: 1px solid #e5e5e5;
        .text {
          font-weight: bold;
        }
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
    .mobile {
        box-sizing: border-box;
        padding: 5px 10px;
        font-size: 14px;
        p {
          line-height: 30px;
          .title {
            color: #a0a0a0;
          }
        }
        .btns {
          padding: 10px;
          @{deep} .el-button {
            float: right;
            margin-left: 10px;
          }
          &::after {
            content: "";
            clear: both;
            height: 0;
            line-height: 0;
            display: block;
            visibility: hidden;
          }
        }
      }
    @{deep} .orderDetailTitle {
        width: 100%;
        border: none;
        box-shadow: none;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .el-tabs__header{
          .el-tabs__nav-wrap{
            .el-tabs__nav-scroll{
              .el-tabs__nav{
                .el-tabs__item{
                  display:flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }
          }
        }
        .el-tabs__content{
          .el-tab-pane{
            width:100%;
            .headerTitle {
          width:100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding: 0 10px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(246, 245, 245, 1);
          box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          .headerItem {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            &.code {
              i {
                width: 18px;
                height: 18px;
                background: url("~@/assets/images/编号@2x.png") center no-repeat;
                background-size: contain;
                margin-right: 5px;
                border-radius: 50%;
              }
            }
            &.client {
              i {
                width: 18px;
                height: 18px;
                background: url("~@/assets/images/客户@2x.png") center no-repeat;
                background-size: contain;
                margin-right: 5px;
                border-radius: 50%;
              }
            }
            &.date {
              i {
                width: 18px;
                height: 18px;
                background: url("~@/assets/images/时间@2x.png") center no-repeat;
                background-size: contain;
                margin-right: 5px;
                border-radius: 50%;
              }
            }
          }
        }
          }
        }
      }
    .orderDetailTitle2 {
        flex: 1;
        overflow-x: none;
        overflow-y: auto;
        padding: 5px 5px 100px 5px;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          display: none;
        }
        .productItem {
          margin-top: 10px;
          font-size: 14px;
          @{deep} .el-card__body {
            padding: 10px 10px 0px 10px;
            box-sizing: border-box;
          }
          .context {
            display: flex;
            justify-content: space-between;
            .left {
              flex: 1;
              padding-bottom: 10px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              .myImage {
                width: 100%;
              }
            }
            .right {
              box-sizing: border-box;
              flex: 2;
              font-size: 13px;
              padding-left: 10px;
              padding-bottom: 10px;
              color: #626262;
              p {
                padding: 2px 0;
                &:first-of-type {
                  color: #000;
                  font-weight: 500;
                }
                .price {
                  color: #ff2000;
                }
              }
            }
          }
          .contact {
            height: 50px;
            display: flex;
            align-items: center;
            border-top: 1px solid #dcdcdc;
            justify-content: space-between;
            .laiyuan {
              color: #58b668;
            }
          }
        }
      }
    .totalBox {
      width: 100%;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      left: 0;
      .transition-box {
        background-color: #fff;
        h3 {
          font-weight: bold;
          font-size: 14px;
          padding: 10px 15px;
          border-bottom: 1px solid #dcdcdc;
        }
        .items {
          font-size: 13px;
          display: flex;
          padding: 5px 15px;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
}
@{deep} .el-tabs__header {
        border: 1px solid #dcdfe6;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
          0 0 6px 0 rgba(0, 0, 0, 0.04);
      }
      @{deep} .el-tabs__header,
      @{deep} .is-top,
      @{deep} .el-tabs__nav-scroll {
        height: 50px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f6f9ff;
        @{deep} .el-tabs__item {
          display: flex;
          justify-content: center;
          border: none;
        }
      }
@{deep} .el-tabs--border-card>.el-tabs__header
        .el-tabs__item.is-active {
        color: #409eff;
        background-color: #fff;
      }
      @{deep} .el-tabs--border-card > .el-tabs__content {
        display: flex;
        @{deep} .el-tab-pane {
          flex: 1;
          box-sizing: border-box;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }
      }
// 当前记录 样式
.cureentReco {
        width: 100%;
        box-sizing: border-box;
        border: none;
        font-size: 14px;
        color: black;
        overflow: auto;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          height: 60px;
          border-radius: 1px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:nth-of-type(odd) {
            background: rgba(229, 238, 255, 1);
            border: 1px solid rgba(246, 245, 245, 1);
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          }
          &:nth-of-type(even) {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(246, 245, 245, 1);
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          }
          &:first-of-type {
            margin-top: 0;
          }
          .fa_no {
            display: flex;
            align-items: center;
            i {
              width: 14px;
              height: 14px;
              background: url("~@/assets/images/编号.png") center no-repeat;
              background-size: contain;
              margin-right: 5px;
            }
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
      }
      // 历史记录 样式
.historyReco {
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        color: black;
        /** 单独为横向和竖向设置滚动条 **/
        overflow-x: none;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        li {
          height: 60px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(246, 245, 245, 1);
          box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          .fa_no,
          .createdOn,
          .client_na {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
</style>
