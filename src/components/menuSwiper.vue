<template>
  <div class="carouselWrap">
    <div class="carousels">
      <el-carousel
        ref="carousel"
        :interval="2000"
        direction="vertical"
        @change="changeIndex"
        indicator-position="none"
        @setActiveItem="setActiveItem"
      >
        <el-carousel-item v-for="(item, i) in dataList" :key="i">
          <el-image
            fit="contain"
            :src="item.companyLogo"
            @click.native="
              $router.push({
                name: 'ShowRoomDetail',
                params: { id: item.companyNumber }
              })
            "
          >
            <div slot="placeholder" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div slot="error" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
          </el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="mySidebar">
      <li
        :class="{ active: activeIndex === i }"
        v-for="(item, i) in dataList"
        :key="i"
        @click="setActiveItem(i)"
      >
        <span>
          <i class="el-icon-caret-left" v-show="activeIndex === i"></i>
          {{ item.companyName }}
        </span>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  props: ['dataList'],
  data () {
    return {
      activeIndex: 0
    }
  },
  methods: {
    changeIndex (i) {
      this.activeIndex = i
    },
    setActiveItem (i) {
      this.$refs.carousel.setActiveItem(i)
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.carouselWrap {
  width: 100%;
  display: flex;
  .carousels {
    flex: 1;
    box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
    /deep/ .el-carousel {
      width: 100%;
      height: 500px;
      /deep/ .el-carousel__container {
        width: 100%;
        height: 100%;
        /deep/ .el-image {
          width: 100%;
          height: 500px;
          text-align: center;
          cursor: pointer;
          img {
            width: 100%;
            height: 500px;
            transition: all 1s;
          }
        }
      }
    }
    &:hover {
      box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
      /deep/ .el-image {
        img {
          -webkit-transform: scale(1.1);
          -moz-transform: scale(1.1);
          -ms-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
  }
  .mySidebar {
    height: 500px;
    width: 240px;
    background-color: #e4f3ff;
    color: rgb(77, 77, 77);
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      box-sizing: border-box;
      padding: 0px 20px 0px 30px;
      height: 62.5px;
      line-height: 62.5px;
      cursor: pointer;
      font-size: 18px;
      span {
        position: relative;
        i {
          position: absolute;
          left: -20px;
          top: 4px;
        }
      }

      &.active {
        color: #165af7;
        background-color: #c1e3ff;
      }
    }
  }
}
.errorImg{
   object-fit: contain;
}
</style>
