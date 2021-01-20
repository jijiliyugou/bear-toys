<template>
<div class="wrapBox">
    <div class="box">
      <div class="topLayout">
        <div class="left">
          <div class="logoImg">
            <el-image :src="require('@/assets/images/ab_logo.png')"  fit="fill"></el-image>
          </div>
          <div class="companyInfo">
            <div class="infoBox">
              <p class="infoName">悦翔展厅：择样单</p>
              <div class="floorBox">
                <p class="infoItem">客户名称：<span class="value">宏发外贸公司</span></p>
                <p class="infoItem">本次代号：<span class="value">91148</span></p>
                <p class="infoItem">择样时间：<span class="value">2020-2-19 12：30</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="rightItems">
            <p class="remarks">备<span style="opacity: 0;">备注</span>注:</p>
            <p class="value">(借样)货号123321,665252,21abc的产品，想要带走，如果不能带走能不能借几天归还。(借样)货号123321,665252,21abc的产品，想要带走，如果不能带走能不能借几天归还</p>
          </div>
        </div>
      </div>
      <div class="btnBox">
        <el-button type="primary">导出Excel</el-button>
      </div>
      <div class="tableBox">
        <el-table
          :data="tableData"
          border
          :header-cell-style="headerCellStyle"
          height="610"
          style="width: 100%; color:#333;">
          <el-table-column label="序号" width="57"  type="index" align="center"></el-table-column>
          <el-table-column
            prop="imageUrl"
            label="产品图片"
            align="center">
            <template slot-scope="scope">
              <el-image
              style="width: 75px; height: 55px"
              :src="scope.row.imageUrl"
              :preview-src-list="[scope.row.imageUrl]">
            </el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="产品名称"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            label="来源厂商">
          </el-table-column>
          <el-table-column
            prop="productNumber"
            align="center"
            label="出厂货号">
          </el-table-column>
          <el-table-column
            prop="price"
            align="center"
            label="出厂价格">
            <template slot-scope="scope">
              <span class="price">
                ￥{{scope.row.price}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price2"
            align="center"
            label="报出价格">
            <template slot-scope="scope">
              <span class="price2">
                ￥{{scope.row.price2}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <center style="margin-top:16px;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :total="totalCount"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      headerCellStyle: { backgroundColor: '#E5EEFF', color: '#333' },
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      tableData: [{
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }, {
        imageUrl: 'http://img.toysbear.com/ProductImgCutting//HS0000003/P0101765/P0101765_Photo.jpg',
        name: '实色拉线飞机',
        address: '汕头海潮玩具厂',
        productNumber: 'YS0046642',
        price: 17.3,
        price2: 20
      }]
    }
  },
  methods: {
    // 获取择样列表
    async getQuoteListBasicPage () {
      // eslint-disable-next-line camelcase
      const { the_nu, client_nu, hallNumber } = this.$route.query
      console.log(the_nu, client_nu, hallNumber)
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        the_nu: the_nu,
        client_nu: client_nu,
        hallNumber: hallNumber,
        keyWord: '',
        type: 0
      }
      const res = await this.$http.post('/api/GetQuoteListBasicPage', fd)
      if (res.data.result.code === 200) {
        this.$message.success(res.data.result.msg)
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 修改页容量
    handleSizeChange (page) {
      this.pageSize = page
    },
    // 修改当前页
    currentChange (page) {
      this.currentPage = page
    }
  },
  created () {

  },
  mounted () {
    this.getQuoteListBasicPage()
  }
}
</script>
<style scoped lang='less'>
@deep: ~">>>";
.wrapBox{
  width: 100%;
  height: 100vh;
  background: #F5F5F5;
  font-size: 14px;
  .box{
    padding-top: 16px;
    width: 1200px;
    margin: 0 auto;
    .topLayout{
      height: 152px;
      background-color: #fff;
      display: flex;
      .left{
        width: 513px;
        display: flex;
        .logoImg{
          width: 152px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .el-image{
            width: 120px;
            height: 120px;
          }
        }
        .companyInfo{
          flex: 1;
          box-sizing: border-box;
          padding: 0 8px;
          display: flex;
          align-items: center;
          .infoBox{
            height: 120px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .infoName{
              color: #000000;
              font-size: 18px;
              font-weight: 400;
            }
            .floorBox{
              .infoItem{
                color: #999999;
                margin-top: 8px;
                font-size: 14px;
                .value{
                  color: #333;
                }
              }
            }
          }
        }
      }
      .right{
        flex: 1;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 8px;
        .rightItems{
          display: flex;
          justify-content: space-between;
          .remarks{
            color: #999;
            width: 67px;
          }
          .value{
            color: #333;
            flex: 1;
          }
        }
      }
    }
    .btnBox{
      height: 79px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-button{
        width: 110px;
        height: 32px;
        background: linear-gradient(180deg, #2E6DFF 0%, #1654E3 100%);
        box-shadow: 0px 3px 10px rgba(24, 86, 229, 0.3);
        border-radius: 2px;
        color: #FFFFFF;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .tableBox{
      height: 610px;
      background-color: #fff;
      color: #1B1B1B;
      .price{
        color: #F4382E;
      }
      .price2{
        color: #165AF7;
      }
    }
  }
}
@{deep} th.gutter{
  width: 0;
  padding: 0;
  margin: 0;
  background-color: #E5EEFF;
}
</style>
