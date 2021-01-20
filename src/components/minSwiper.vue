<template>
  <div class="swiperBox">
    <div
      class="iconleft iconfont icon-dajiantouzuo iconJiantou"
      v-show="showArrow"
      @click="clickLeft"
    ></div>
    <div id="swiper">
      <ul class="imgBox" @mouseenter="enter" @mouseleave="leave">
        <li
          v-for="(item, index) in list"
          :key="index"
          :data-id="item.productNumber"
          @click="toProductDetail(item.productNumber)"
          class="imgDiv"
        >
          <el-image fit="contain" :src="item.img">
            <div slot="placeholder" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
            <div slot="error" class="image-slot">
              <img class="errorImg" src="~@/assets/images/imgError.jpg" alt />
            </div>
          </el-image>
          <div class="item-content">
            <p class="item-title">{{ item.name }}</p>
            <div class="item-detail line-2">{{ item.number }}</div>
            <p class="item-price">
              <span>{{
                item.cu_de + (item.price === 0 ? "???" : item.price.toFixed(2))
              }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="iconright iconfont icon-dajiantouyou iconJiantou"
      @click="clickRight"
      v-show="showArrow"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    speed: Number,
    direction: String,
    dataList: Array,
    isShow: Boolean
  },
  data () {
    return {
      timer: null,
      theSpeed: this.speed,
      imgWidth: 195,
      theDirection: this.direction,
      list: this.dataList.concat(this.dataList),
      showArrow: null
    }
  },
  created () {},
  mounted () {
    this.move()
  },
  watch: {
    dataList: {
      handler (value) {
        this.list = value
      },
      deep: true
    },
    isShow: {
      handler (value) {
        this.showArrow = value
      }
    }
  },
  methods: {
    toProductDetail (number) {
      const href = this.$router.resolve({
        name: 'ProductDetail',
        params: { id: number }
      })
      window.open(href.href, '_blank')
    },
    //   左边
    clickLeft () {
      this.theDirection = 'left'
    },
    // 右边
    clickRight () {
      this.theDirection = 'right'
    },
    // 移入
    enter () {
      this.timer = clearInterval(this.timer)
    },
    // 移出
    leave () {
      this.move()
    },

    move () {
      var imgBox = document.getElementsByClassName('imgBox')[0]
      var imgDiv = document.getElementsByClassName('imgDiv')
      const that = this
      function autoScroll () {
        if (imgBox.offsetLeft < -(imgBox.offsetWidth / 2)) {
          // 向左滚动
          imgBox.style.left = 0
        }
        if (imgBox.offsetLeft > 0) {
          // 向右滚动
          imgBox.style.left = -(imgBox.offsetWidth / 2) + 'px'
        }
        if (that.theDirection === 'left') {
          that.theSpeed = -Math.abs(that.theSpeed)
        } else {
          that.theSpeed = Math.abs(that.theSpeed)
        }
        imgBox.style.left = imgBox.offsetLeft + that.theSpeed + 'px'
      }
      clearInterval(this.timer)
      this.timer = setInterval(autoScroll, 30) // 全局变量 ，保存返回的定时器
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>
<style scoped lang="less">
@deep: ~">>>";
.swiperBox {
  height: 200px;
  width: 95%;
  margin: 0 auto;
  position: relative;
  .iconleft {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 50%;
    left: -3.5%;
    font-size: 30px;
    cursor: pointer;
    transform: translate(0, -50%);
  }
  .iconright {
    position: absolute;
    top: 50%;
    right: -3.5%;
    width: 30px;
    height: 30px;
    font-size: 30px;
    cursor: pointer;
    transform: translate(0, -50%);
  }
}

.swiperBox #swiper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.swiperBox #swiper .imgBox {
  height: 200px;
  padding: 10px 0;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.swiperBox #swiper .imgBox .imgDiv {
  width: 120px;
  height: 180px;
  font-size: 12px;
  margin-left: 15px;
  cursor: pointer;
  box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.1);
  border-bottom: 1px solid #e0e0e0;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .item-content {
    flex: 1;
    padding: 5px 10px;
    font-size: 12px;
    box-shadow: inset 0px 2px 3px -1px #e0e0e0;
    box-sizing: border-box;
    p {
      line-height: 18px;
    }
  }
  @{deep} .el-image {
    flex-shrink: 0;
    img {
      transition: all 1s;
      width: 120px;
      height: 120px;
    }
  }
  &:hover {
    box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
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
.item-price {
  span {
    font-size: 14px;
    color: #ff4400;
  }
}
.item-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
