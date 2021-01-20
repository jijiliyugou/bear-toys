<template>
  <div class="showRoom">
    <template v-if="!showroomList">
      <div class="zanwuxinxi"></div>
    </template>
    <template v-else>
      <menuSwiper :dataList="showroomSwiperList"></menuSwiper>
      <ul class="showRoomList">
        <li
          class="showRoomItem"
          v-for="item in showroomList"
          :key="item.id"
          @click="
            $router.push({
              name: 'ShowRoomDetail',
              params: { id: item.companyNumber }
            })
          "
        >
          <div class="img">
            <el-image
              style="width: 360px; height: 360px"
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
          <p>{{ item.companyName }}</p>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import menuSwiper from '@/components/menuSwiper'
export default {
  name: 'Home',
  components: {
    menuSwiper
  },
  data () {
    return {
      showroomSwiperList: [],
      showroomList: null
    }
  },
  methods: {
    // 获取展厅轮播
    async getShowroomSwiper (currentPage, pageSize, type) {
      const res = await this.$http.post('/api/CompanyManagementPage', {
        skipCount: currentPage,
        maxResultCount: pageSize,
        companyType: type
      })
      if (res.data.result.code === 200) {
        return res.data.result.item.items
      }
    }
  },
  async mounted () {
    this.showroomSwiperList = await this.getShowroomSwiper(1, 8, 'Exhibition')
    this.showroomList = await this.getShowroomSwiper(1, 10, 'Exhibition')
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.showRoom {
  max-width: 1200px;
  min-width: 1024px;
  margin: 0 auto;
  .showRoomList {
    margin-top: 5px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    text-align: justify;
    &:after {
      content: "";
      width: 360px;
      border: 1px solid transparent;
    }
    .showRoomItem {
      width: 360px;
      text-align: center;
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
      margin: 30px 0;
      cursor: pointer;
      .img {
        @{deep} .el-image {
          img {
            width: 360px;
            height: 360px;
            transition: all 1s;
          }
        }
      }
      p {
        padding: 20px 0;
        box-shadow: inset 0 2px 3px -1px #e0e0e0;
      }
      &:hover {
        box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
        .img {
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
