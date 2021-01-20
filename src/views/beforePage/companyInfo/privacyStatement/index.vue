<template>
  <div class="iframeBox">
    <iframe
      src="https://www.toysbear.com/privacy.html"
      style="pointer-events: none;"
      id="myiframe"
      frameborder="0"
      scrolling="no"
      @load="changeFrameHeight"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    changeFrameHeight () {
      $('#myiframe').height(9750)
    },
    // 回到顶部
    toTop () {
      $('#app').animate({ scrollTop: 0 })
    }
  },
  created () {},
  mounted () {
    this.$emit('editTitle', '隐私声明')
  }
}
</script>
<style scoped lang="less">
@deep: ~">>>";
.iframeBox {
  position: relative;
  width: 100%;
  height: 100%;
  .el-button {
    position: absolute;
    right: 0;
    bottom: 0;
    @{deep} i {
      -webkit-transform: scale(2);
      -moz-transform: scale(2);
      -ms-transform: scale(2);
      transform: scale(2);
    }
  }
}
</style>
