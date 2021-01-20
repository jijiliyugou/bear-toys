<template>
  <div
    id="app"
    class="rootApp"
    v-cloak
    v-loading="$store.state.AppLoading"
    element-loading-spinner
    element-loading-background="rgba(200, 200, 200, 0.5)"
    @mousewheel="mousewheel"
  >
    <router-view v-cloak />
    <el-backtop target=".rootApp" :bottom="50" :right="150">
      <div style="display:flex;flexWrap:wrap;alignContent:flex-start;justifyContent:center; alignItems:center;">
          <i class="el-icon-caret-top" style="marginTop:-5px;"></i>
          <span style="fontSize:12px;marginTop:-5px;">
            顶部
          </span>
      </div>
    </el-backtop>
  </div>
</template>
<script>
import { getMenuFuc } from '@/router/index'
// import Footer from '@/components/Footer'
export default {
  // components: { Footer },
  data () {
    return {
      appHeight: document.documentElement.clientHeight,
      options: {
        // 二维码配置
        url: 'https://www.toysbear.com/app_download.html',
        icon: require('@/assets/images/logo.png')
      }
    }
  },
  methods: {
    mousewheel (e) {
      if (this.$store.state.AppLoading) e.preventDefault()
    },
    prohibit () {
      // console.log(document.oncontextmenu)
      // 禁用鼠标右击、F12
      document.oncontextmenu = function () {
        return false
      }
      document.onkeydown = function (e) {
        if (
          e.ctrlKey &&
          (e.keyCode === 73 ||
            e.keyCode === 74 ||
            e.keyCode === 80 ||
            e.keyCode === 83 ||
            e.keyCode === 85 ||
            e.keyCode === 117)
        ) {
          return false
        }
        if (e.keyCode === 18 || e.keyCode === 123) {
          return false
        }
      }
    }
  },
  async created () {
    await getMenuFuc()
    this.prohibit()
  },
  mounted () {
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
[v-cloak] {
  display: none;
}
@{deep} .el-loading-spinner .circular {
  width: 100px;
  height: 100px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}
@{deep} .el-loading-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
@{deep} .el-loading-spinner {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url("~@/assets/images/loadding.gif") no-repeat center center;
  background-size: 200px 200px;
  width: 100%;
  height: 100%;
}
</style>
