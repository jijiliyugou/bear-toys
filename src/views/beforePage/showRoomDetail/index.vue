<template>
  <div>
    <div class="titleImg">
      <img src="~@/assets/images/zhantingnav.png" alt />
      <h2 class="title">玩具展厅详情</h2>
    </div>
    <div class="showRoomTetailBox">
      <h2 class="contactTitleTxt">展厅简介：</h2>
      <div class="contactTitleLine"></div>
      <div class="titleText">
        <div class="left">
          <div class="text">
            新悦翔展厅位于澄海区登峰路中段,是一个面积已达上万平方米,集合高中低各类型产品的
            玩具展厅,本辰厅成立于2012年,原址位于澄海区文冠路尾,自2014年扩大规模,展厅地址搬
            迁至澄海区登峰路中段,悦判始终以“诚心服务,诚信经营”的宗旨为经营理念面向广大客商
            欢迎光临澄海新悦翔玩具展厅
          </div>
          <div class="mobile">
            <ul>
              <li>
                <div class="wraps">
                  <p class="el-icon-phone">
                    <span style="margin-left:5px;">联系方式：</span>
                  </p>
                  <p>{{ noticeData && noticeData.telephoneNumber }}</p>
                </div>
              </li>
              <li>
                <div class="wraps">
                  <p class="iconfont icon-QQ1">
                    <span style="margin-left:5px;">QQ：</span>
                  </p>
                  <p>{{ noticeData && noticeData.qq }}</p>
                </div>
              </li>
              <li>
                <div class="wraps">
                  <p class="el-icon-location">
                    <span style="margin-left:5px;">展厅位置：</span>
                  </p>
                  <p>{{ noticeData && noticeData.address }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="right">
          <el-image fit="contain" :src="noticeData && noticeData.companyLogo">
            <div slot="error" class="image-slot">
              <img
                class="errorImg"
                src="~@/assets/images/zanwutupian1.png"
                alt
              />
            </div>
          </el-image>
        </div>
      </div>
      <div class="map">
        <h2 class="contactTitleTxt">展厅地址：</h2>
        <div class="contactTitleLine"></div>
        <div class="mapItem" v-if="noticeData">
          <BMapComponent :addr="noticeData"></BMapComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BMapComponent from '@/components/map.vue'
export default {
  components: { BMapComponent },
  data () {
    return {
      noticeData: null
    }
  },
  methods: {
    async getCompanyByNumber () {
      const noticeNumber = this.$route.params.id
      const res = await this.$http.post('/api/CompanyByID', {
        companyNumber: noticeNumber
      })
      if (res.data.result.code === 200) {
        this.noticeData = res.data.result.item
      }
    }
  },
  mounted () {
    this.getCompanyByNumber()
  }
}
</script>

<style lang="less" scoped>
.showRoomTetailBox {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
}
.contactTitleTxt {
  margin-top: 30px;
  color: white;
  width: 169px;
  height: 60px;
  background-color: #165af7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.contactTitleLine {
  border-bottom: 1px solid #165af7;
}
.titleImg {
  width: 100%;
  height: 200px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .title {
    position: absolute;
    max-width: 1200px;
    min-width: 1024px;
    top: 50%;
    left: 50%;
    text-indent: 100px;
    font-size: 35px;
    color: #161718;
    font-weight: 400;
    transform: translate(-50%, -50%);
  }
}
.titleText {
  display: flex;
  height: 300px;
  color: #919191;
  font-size: 14px;
  margin-top: 10px;
  .left {
    flex: 1;
    .text {
      height: 150px;
      padding: 20px;
      box-sizing: border-box;
      text-indent: 2em;
      line-height: 30px;
    }
    .mobile {
      box-sizing: border-box;
      ul {
        display: flex;
        height: 150px;
        padding-bottom: 20px;
        box-sizing: border-box;
        align-items: flex-end;
        justify-content: space-around;
        li {
          width: 180px;
          height: 120px;
          background: rgba(240, 245, 255, 1);
          box-shadow: 0px 1px 4px 2px rgba(100, 146, 247, 0.19);
          text-align: center;
          position: relative;
          .wraps {
            position: absolute;
            width: 90%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-sizing: border-box;
            p {
              padding: 5px 0;
              color: #165af7;
              font-weight: 400;
              &:first-of-type {
                font-size: 14px;
                color: #6896ff;
              }
            }
          }
        }
      }
    }
  }
  .right {
    width: 500px;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    .el-image {
      width: 460px;
      height: 260px;
    }
    img {
      width: 460px;
      height: 260px;
    }
  }
}
.map {
  margin-bottom: 20px;
  h4.title {
    font-weight: 700;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .mapItem {
    height: 300px;
    width: 100%;
    margin-top: 20px;
    background-color: #ccc;
  }
}
</style>
