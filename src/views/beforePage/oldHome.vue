/* eslint-disable vue/require-v-for-key */
<template>
  <div class="home">
    <menuSwiper :dataList="showroomSwiperList"></menuSwiper>
    <div class="swiperWrap" v-if="list && list.length">
      <div class="title">
        <h3>
          新品推荐
          <span>显示最新产品</span>
          <span class="More" @click="$router.push('/beforeIndex/product')">
            更多
            <i class="iconfont icon-bofang"></i>
          </span>
        </h3>
      </div>
      <div class="mySwiper" @mouseenter="boxEnter" @mouseleave="boxleave">
        <swiper
          v-cloak
          :dataList="list"
          :speed="2"
          :direction="direction"
          :isShow="isShow"
        ></swiper>
      </div>
    </div>
    <!-- 公告 -->
    <div class="announcement">
      <ul class="noticeItens">
        <template v-for="(item, i) in NoticeObj">
          <li
            class="items"
            :key="i"
            v-if="item.children && item.children.length  !==  0"
          >
            <div class="title">
              <h3>
                {{ item.title }}
                <span class="More" @click="$router.push(item.path)">
                  更多
                  <i class="iconfont icon-bofang"></i>
                </span>
              </h3>
            </div>
            <ol class="myOl">
              <li
                v-for="Notice in item.children"
                :key="Notice.bearNotice.id"
                @click="
                  $router.push({
                    name: 'noticeDetail',
                    params: { id: Notice.bearNotice.noticeNumber }
                  })
                "
              >
                <span class="title">公告：{{ Notice.bearNotice.notice }}</span>
                <span class="date">
                  <template v-if="Notice.bearNotice.publishDate">
                    {{
                      Notice.bearNotice.publishDate.replace(/t[\s\S]+/gi, " ")
                    }}
                  </template>
                  <a>查看</a>
                </span>
              </li>
            </ol>
          </li>
        </template>
        <template v-for="item in (3-NoticeObj.length%3)">
          <div class="buwei" v-if="NoticeObj.length%3 > 0" :key="item"></div>
        </template>
      </ul>
    </div>
    <div class="recommend">
      <div class="title">
        <h3>
          推荐采购商
          <span class="More" @click="$router.push('/beforeIndex/buyers')">
            更多
            <i class="iconfont icon-bofang"></i>
          </span>
        </h3>
      </div>
      <ol>
        <li
          v-for="item in RecommendedSales"
          @click="
            $router.push({
              name: 'companyDetail',
              params: { id: item.companyNumber }
            })
          "
          :key="item.id"
        >
          <el-image fit="contain" :src="item.companyLogo">
            <div slot="placeholder" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div slot="error" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
          </el-image>
          <p>{{ item.companyName }}</p>
        </li>
        <li class="Placeholder"></li>
        <li class="Placeholder"></li>
        <li class="Placeholder"></li>
      </ol>
    </div>
    <div class="recommend">
      <div class="title">
        <h3>
          推荐供应商
          <span class="More" @click="$router.push('/beforeIndex/supplier')">
            更多
            <i class="iconfont icon-bofang"></i>
          </span>
        </h3>
      </div>
      <ol>
        <li
          v-for="item in RecommendedSupply"
          @click="
            $router.push({
              name: 'companyDetail',
              params: { id: item.companyNumber }
            })
          "
          :key="item.id"
        >
          <el-image fit="contain" :src="item.companyLogo">
            <div slot="placeholder" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div slot="error" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
          </el-image>
          <p>{{ item.companyName }}</p>
        </li>
        <li class="Placeholder"></li>
        <li class="Placeholder"></li>
        <li class="Placeholder"></li>
      </ol>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import swiper from '@/components/beforeSwiper'
import menuSwiper from '@/components/menuSwiper'
export default {
  name: 'Home',
  components: {
    swiper,
    menuSwiper
  },
  data () {
    return {
      isShow: false,
      currentPage: 1,
      pageSize: 20,
      direction: 'left',
      list: [],
      showroomSwiperList: [],
      NoticeObj: [
        {
          title: '供应商公告',
          path: '/beforeIndex/purchaseInfo',
          children: null
        },
        { title: '展厅公告', path: '/beforeIndex/exhibition', children: null },
        { title: '公司公告', path: '/beforeIndex/findSamInfo', children: null }
      ],
      RecommendedSales: [], // 展厅
      RecommendedSupply: [] // 供应商
    }
  },
  methods: {
    // 获取所有 展厅 供应商 公司
    async getAll (skipCount, maxResultCount, companyType) {
      const res = await this.$http.post('/api/CompanyManagementPage ', {
        skipCount,
        maxResultCount,
        companyType
      })
      if (res.data.result.code === 200) {
        return res.data.result.item.items
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取新品推荐
    async getNewArrivalsPage () {
      const res = await this.$http.post('/api/GetNewArrivalsPage', {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        AuditStatus: 0
      })
      if (res.data.result.code === 200) {
        this.list = res.data.result.item.items
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    // 获取公告
    async getNoticeList (currentPage, pageSize, type) {
      const res = await this.$http.post('/api/BearNoticePage', {
        skipCount: currentPage,
        maxResultCount: pageSize,
        noticeType: type
      })
      if (res.data.result.code === 200) {
        return res.data.result.item.result.items
      } else {
        this.$message.error(res.data.result.msg)
      }
    },
    boxEnter () {
      this.isShow = true
    },
    boxleave () {
      this.isShow = false
    }
  },
  created () {},
  async mounted () {
    this.getNewArrivalsPage() // 新品推荐
    this.showroomSwiperList = await this.getAll(1, 8, 'Exhibition') // 获取展厅轮播
    this.RecommendedSales = await this.getAll(1, 12, 'Sales') // 推荐公司
    this.RecommendedSupply = await this.getAll(1, 12, 'Supplier') // 获取推荐供应商
    this.NoticeObj[0].children = await this.getNoticeList(1, 8, 'Supply') // 获取供应商公告
    this.NoticeObj[1].children = await this.getNoticeList(1, 8, 'Purchase') // 获取展厅公告
    this.NoticeObj[2].children = await this.getNoticeList(1, 8, 'Ordinary') // 获取公司公告
  }
}
</script>
<style lang="less" scoped>
.home {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
  .swiperWrap {
    .title {
      h3 {
        padding: 20px 0;
        span {
          color: #999;
          font-size: 12px;
          margin-left: 10px;
          &.More {
            color: #999;
            font-size: 12px;
            float: right;
            display: flex;
            align-items: center;
            cursor: pointer;
            i {
              margin-left: 5px;
            }
            &:hover {
              color: #165af7;
            }
          }
        }
      }
    }
    .mySwiper {
      border: 1px solid #ccc;
    }
  }
  .announcement {
    margin: 20px 0;
    .noticeItens {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &:after{
        content: '';
        width: 390px;
      }
      .buwei{
        content: '';
        width: 390px;
      }
      li.items {
        width: 390px;
        font-size: 14px;
        box-sizing: border-box;
        .title {
          h3 {
            padding: 10px;
            .More {
              color: #999;
              font-size: 12px;
              float: right;
              display: flex;
              align-items: center;
              font-weight: normal;
              cursor: pointer;
              i {
                margin-left: 5px;
              }
              &:hover {
                color: #165af7;
              }
            }
          }
        }
        ol.myOl {
          border: 1px solid #ccc;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            cursor: pointer;
            &:last-child {
              border-bottom: none;
            }
            .title {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .date {
              padding: 5px;
              width: 105px;
              font-size: 12px;
              a {
                margin-left: 10px;
                color: #2845e1;
                cursor: pointer;
              }
            }
            &:hover {
              background-color: #e4f3ff;
              color: #2845e1;
              a,
              .title {
                color: #2845e1;
              }
            }
          }
        }
      }
    }
  }
  .recommend {
    .title {
      h3 {
        padding: 20px 0;
        .More {
          color: #999;
          font-size: 12px;
          float: right;
          display: flex;
          align-items: center;
          font-weight: normal;
          cursor: pointer;
          i {
            margin-left: 5px;
          }
          &:hover {
            color: #165af7;
          }
        }
      }
    }
    ol {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      font-size: 12px;
      color: #999;
      &::after {
        content: "";
        width: 180px;
      }
      li {
        width: 180px;
        text-align: center;
        cursor: pointer;
        border-radius: 0.2em;
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
        margin-bottom: 20px;
        /deep/ .el-image {
          width: 180px;
          height: 180px;
          /deep/ img {
            width: 180px;
            height: 180px;
            transition: all 1s;
          }
        }
        p {
          padding: 20px 0;
          height: 16px;
          box-shadow: inset 0 2px 3px -1px #e0e0e0;
        }
        &:hover {
          box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
          /deep/ .el-image {
            /deep/ img {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
        }
      }
      .Placeholder {
        width: 180px;
        margin-bottom: 20px;
        opacity: 0;
        cursor: default;
      }
    }
  }
  h3 {
    font-weight: 600;
    padding: 10px 0;
  }
}
</style>
