<template>
<div class="wrapBox">
<!-- 打开我的产品列表 -->
         <h3 class="infoListTitle" style="background-color: #fff;">我的产品</h3>
        <div class="myProductSearch">
          <div class="inputBox">
            <el-input v-model="myProductSearchValue" @keyup.native.enter="myProductSearchEvent" clearable placeholder="请输入搜索内容"></el-input>
            <el-button type="primary" @click="myProductSearchEvent" round>搜索</el-button>
          </div>
        </div>
        <div class="myProductSearchTotalCountBox"><p></p><p class="myTotalCount"><span>{{sampleSelectionTotalCount}}</span>条产品</p> <p class="more"><i @click="checkMoreEvent" class="checkCube" v-show="isCheckCube"></i><i @click="checkMoreEvent" class="checkList"  v-show="!isCheckCube"></i></p></div>
        <ul class="myProductWrapBody" v-infinite-scroll="addSampleSelectionList"
          infinite-scroll-disabled="activeAddSample">
          <template v-if="sampleSelectionList && sampleSelectionTotalCount">
            <!-- 方格类型 -->
            <div class="itemBox" v-if="isCheckCube">
              <li class="itemCube"  v-for="(item, i) in sampleSelectionList" :key="i">
              <div class="imgItem">
                <el-image
                  fit="contain"
                  :src="item.imageUrl"
                  :key="item.id"
                  :preview-src-list="[
                    item.imageUrl &&
                      item.imageUrl.replace(/_SmallPic/, '_Photo')
                  ]"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                </el-image>
              </div>
              <div class="context">
                <h3 class="contextItem">{{ item.name }}</h3>
                <p class="contextItem"> 出厂货号：{{ item.fa_no }}</p>
                <p class="contextItem">参考单价：<span class="price">{{ item.cu_de + item.price }}</span> </p>
              </div>
            </li>
            </div>
            <!-- 列表类型 -->
            <div class="itemBox" v-else>
              <li class="itemList"  v-for="(item, i) in sampleSelectionList" :key="i">
              <div class="imgItemLeft">
                <el-image
                  fit="contain"
                  :src="item.imageUrl"
                  :key="item.id"
                  :preview-src-list="[item.imageUrl]"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/imgError.jpg"
                      alt
                    />
                  </div>
                </el-image>
                <div class="date"><i></i> 2020-10-10</div>
              </div>
              <div class="context">
                <h3 class="contextItem productName">{{ item.name }}</h3>
                <p class="contextItem"> 出厂货号：{{ item.fa_no }}</p>
                <p class="contextItem"> 包装：{{ item.ch_pa }}</p>
                <p class="contextItem"> 样品规格：{{item.pr_le + " X " + item.pr_wi + " X " + item.pr_hi + "(CM)"}}</p>
                <p class="contextItem"> 外箱规格：{{ item.ou_le + " X " + item.ou_wi + " X " + item.ou_hi + "(CM)" }}(CM)</p>
                <p class="contextItem"> 装箱量：{{ item.in_en + "/" + item.ou_lo + "(PCS)" }}</p>
                <p class="contextItem"> 体积/材积：{{ item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)" }}</p>
                <p class="contextItem"> 毛重净重：{{ item.ne_we + "/" + item.gr_we + "(KG)" }}</p>
                <p class="contextItem"> 参考单价：<span class="price">{{ item.cu_de + item.price }}</span> </p>
              </div>
            </li>
            </div>
            <center
              style="padding:10px;backgroundColor:#f5f7fa;color:#aaa"
              v-show="showAddSampleTXT"
            >
              <i
                class="el-icon-loading"
                v-show="showAddSampleTXT === '加载中...'"
              ></i>
              {{ showAddSampleTXT }}
            </center>
          </template>
          <div v-else class="zanwushuju1"></div>
        </ul>
</div>
</template>

<script>
export default {
  props: ['options'],
  data () {
    return {
      sampleSelectionTotalCount: 0,
      myProductSearchValue: null,
      isCheckCube: true,
      mySampleSelectionCurrentPage: 1,
      sampleSelectionPageSize: 20,
      sampleSelectionList: []
    }
  },
  methods: {
    // 下拉加载更多
    async addSampleSelectionList () {
      this.mySampleSelectionCurrentPage++
      const res = await this.getSampleSelectionList()
      if (res.data.result.code === 200) {
        this.sampleSelectionList = this.sampleSelectionList.concat(res.data.result.item.items)
        this.sampleSelectionTotalCount = res.data.result.item.totalCount
      }
    },
    // 切换我的产品展示格式类型
    checkMoreEvent () {
      this.isCheckCube = !this.isCheckCube
    },
    // 获取 历史择样
    async getSampleSelectionList () {
      return await this.$http.post('/api/SupplierProduct', {
        companyNumber: this.options.client_nu,
        pageIndex: this.mySampleSelectionCurrentPage,
        pageSize: this.sampleSelectionPageSize,
        keyword: this.myProductSearchValue
      })
    },
    // 搜索我的产品
    async myProductSearchEvent () {
      const res = await this.getSampleSelectionList()
      if (res.data.result.code === 200) {
        this.sampleSelectionList = res.data.result.item.items
        this.sampleSelectionTotalCount = res.data.result.item.totalCount
      } else {
        this.$message.error(res.data.result.msg)
      }
    }
  },
  created () {

  },
  async mounted () {
    const res = await this.getSampleSelectionList()
    console.log(res)
    if (res.data.result.code === 200) {
      this.sampleSelectionList = res.data.result.item
      this.sampleSelectionTotalCount = res.data.result.item.totalCount
    }
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
  .myProductSearch {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .inputBox{
          width: 95%;
          height: 40px;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid #aaa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          @{deep} .el-input{
            border: none;
            .el-input__inner{
              border: none;
            }
          }
          .el-button{
            border: none;
            height: 100%;
            background-color: #165af7;
          }
        }
      }
      .myProductSearchTotalCountBox{
        padding: 10px 0;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          flex: 1;
          &.myTotalCount{
            text-align: center;
            span{
              color: #ff0000;
              margin-right: 5px;
            }
          }
          &.more{
            display: flex;
            justify-content: flex-end;
            margin-right: 10px;
            .checkList{
              width: 20px;
              height: 20px;
              display: block;
              background: url('~@/assets/images/格式化列表.png') no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
            .checkCube{
              width: 20px;
              height: 20px;
              display: block;
              background: url('~@/assets/images/liebiao2.png') no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
          }
        }
      }
.myProductWrapBody{
        font-size: 14px;
        border: none;
        height: 675px;
        width: 100%;
        overflow-x: none;
        overflow-y: scroll;
        justify-content: space-evenly;
        &::-webkit-scrollbar {
            display: none;
        }
        /** 单独为横向和竖向设置滚动条 **/
        .itemBox{
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: space-evenly;
          &::after{
            width: 46%;
            content: '';
            display: block;
          }
          .itemCube{
            width: 46%;
            height: 260px;
            margin: 5px 0;
            overflow: hidden;
            border: 1px solid #DCDCDC;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .imgItem{
              width: 100%;
              height: 175px;
              @{deep} .el-image{
                width: 100%;
                height: 100%;
                img{
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .context{
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              .contextItem{
                box-sizing: border-box;
                padding: 0 10px;
                .price {
                  color: #ff0000;
                }
              }
            }
          }
          .itemList {
            width: 100%;
            display: flex;
            justify-content: space-between;
            border-radius: 10px;
            margin: 5px 10px;
            overflow: hidden;
            cursor: pointer;
            height: 250px;
            .imgItemLeft{
              flex: 1;
              display: flex;
              align-items: center;
              position: relative;
              .el-image{
                width: 100%;
                img{
                  width: 100%;
                }
              }
              .date{
                position: absolute;
                width: 100%;
                bottom: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 0;
                color: #626262;
                i {
                  display: block;
                  margin-right: 5px;
                  width: 14px;
                  height: 14px;
                  background: url('~@/assets/images/时间.png') no-repeat center;
                  background-size: contain;
                }
              }
            }
            .context{
              flex: 2;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              color: #626262;
              .contextItem{
                box-sizing: border-box;
                padding-left: 5px;
                .price {
                  color: #ff0000;
                }
                &.productName {
                  color: #000;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
}
</style>
