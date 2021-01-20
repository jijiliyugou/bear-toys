<template>
  <div id="allmap" style="width: 100%; height: 100%; overflow: hidden"></div>
</template>
<script>
import BMap from 'BMap'
export default {
  props: ['address', 'isMapClick'],
  data () {
    return {
      zoom: 11,
      attrs: this.attr,
      restaurants: [],
      attr: this.address || '汕头市',
      map: null
    }
  },
  mounted () {
    this.BaiduMap()
    this.$emit('attrItems', this.attr)
  },
  methods: {
    resetMap (val) {
      const _that = this
      var geoc = new BMap.Geocoder()
      geoc.getPoint(
        val,
        function (point) {
          if (point) {
            _that.map.clearOverlays() // 清除地图上所有覆盖物
            _that.map.centerAndZoom(point, 16)
            _that.map.addOverlay(new BMap.Marker(point))
          } else {
            _that.$message.error('您选择地址没有解析到结果!')
          }
        },
        '深圳市'
      )
    },
    BaiduMap () {
      const _that = this
      this.$nextTick(() => {
        /** 地图初始化 start */
        var map = new BMap.Map('allmap') // 创建Map实例
        this.map = map
        // 百度地图API功能
        var Geolo = new BMap.Geolocation()
        // 创建地址解析器实例
        var geoc = new BMap.Geocoder()
        geoc.getPoint(
          _that.attr,
          function (point) {
            if (point) {
              map.centerAndZoom(point, 16)
              map.addOverlay(new BMap.Marker(point))
            } else {
              this.$message.error('您选择地址没有解析到结果!')
            }
          },
          '深圳市'
        )
        // 点击地图获取地址
        map.addEventListener('click', function (e) {
          if (_that.isMapClick === '审核') return false
          var pt = e.point
          map.clearOverlays() // 清除地图上所有覆盖物
          map.centerAndZoom(pt, 16)
          map.addOverlay(new BMap.Marker(pt))
          geoc.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents
            _that.$emit(
              'clickMap',
              addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber
            )
          })
        })
        // 输入地址关联地图智能搜索
        var ac = new BMap.Autocomplete({
          // 建立一个自动完成的对象
          input: 'suggestId',
          location: map,
          onSearchComplete: (e) => {
            if (e) _that.$emit('attrItems', e.Hr)
          }
        })
        ac.setInputValue(this.address)
      })
    }
  }
}
</script>
<style scpoed lang="less">
/* 去掉地图左下角的百度LOGO */
.anchorBL {
  display: none;
}
</style>
