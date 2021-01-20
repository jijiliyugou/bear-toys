<template>
  <div style="width: 100%; height: 100%; overflow: hidden">
    <div
    id="allmap"
    style="width: 100%; height: 100%; overflow: hidden"
  ></div>
  <!-- <div v-show="showNav" id="viewDiv" style="width: 100%; height: 100%; overflow: hidden">
    <iframe frameborder="0" name="Iframe1" :src="mapAttr" width="100%" height="104%">
      <head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
      </head>
      <body>您的浏览器不支持嵌入式框架，或者当前配置为不显示嵌入式框架。</body>
    </iframe>
  </div> -->
  </div>
</template>
<script>
import BMap from 'BMap'
export default {
  props: ['addr'],
  data () {
    return {
      mapAttr: null,
      showNav: false,
      zoom: 11
    }
  },
  mounted () {
    this.BaiduMap()
  },
  methods: {
    toAddr () {
      console.log(1234)
    },
    BaiduMap () {
      const _that = this
      /** 地图初始化 start */
      this.$nextTick(() => {
        var map = new BMap.Map('allmap') // 创建Map实例
        // 创建地址解析器实例
        var geoc = new BMap.Geocoder()
        var myCity = _that.addr.address ? ((_that.addr.address.split('市')[0] + '市').split('省')[1]) : '汕头市'
        geoc.getPoint(_that.addr.address,
          function (point) {
            if (point) {
              map.centerAndZoom(point, 17)
              map.addOverlay(new BMap.Marker(point))
              /** 添加控件 */
              map.addControl(new BMap.NavigationControl())
              map.addControl(new BMap.ScaleControl())
              map.addControl(
                new BMap.OverviewMapControl({
                  isOpen: true,
                  anchor: BMAP_ANCHOR_BOTTOM_RIGHT
                })
              )
              map.addControl(new BMap.MapTypeControl())
              var myicon = new BMap.Icon(
                'https://api.map.baidu.com/img/markers.png', // 百度图片
                new BMap.Size(23, 25), // 视窗大小 // 视窗大小
                {
                  offset: new BMap.Size(11, 25), // 指定定位位置
                  imageOffset: new BMap.Size(0, 0 - 11 * 25) // 设置图片偏移
                }
              )
              var marker = new BMap.Marker(point, { icon: myicon })
              map.addEventListener('click', (event) => {
                point = event.point
              })
              map.clearOverlays() // 清除地图上所有覆盖物
              // 把标注添加到地图上
              map.addOverlay(marker)
              marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
              geoc.getLocation(point, function (re) {
                var cityObj = re.addressComponents
                map.setCurrentCity(cityObj.city || myCity) // 设置地图显示的城市 此项是必须设置的
              })
              map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
              window.openMap = function () {
                // _that.showNav = true
                // document.getElementById('viewDiv').innerHTML = '<object type="text/html" codebase="https" data=' + 'https://api.map.baidu.com/marker?location=' + point.lat + ',' + point.lng + '&title=' + _that.addr.companyName + '&content=' + _that.addr.address + '&output=html&src=' + _that.addr.companyName + ' width="100%" height="102%"></object>'
                // _that.mapAttr = 'https://api.map.baidu.com/marker?location=' + point.lat + ',' + point.lng + '&title=' + _that.addr.companyName + '&content=' + _that.addr.address + '&output=html&src=webapp.baidu.openAPIdemo'
                _that.mapAttr = 'https://api.map.baidu.com/geocoder?address=' + _that.addr.address + '&title=' + _that.addr.companyName + '&content=' + _that.addr.address + '&output=html&src=webapp.baidu.openAPIdemo'
                window.open(_that.mapAttr)
              }
              var content =
                "<img style='width:100px;height:100px;float:right;margin-left:5px;vertical-align:top;' src='" +
                _that.addr.companyLogo +
                "' />" +
                '<table>'
              // content =
              //   content +
              //   '<tr><td style="padding:5px 0 0 0 ;"> 公司简称：' +
              //   _that.addr.companyNickName +
              //   '</td></tr>'
              content =
                content +
                '<tr style="line-height: 30px;"><td style="padding:5px 0 0 0 ;"> 公司地址：' +
                _that.addr.address +
                '</td></tr>'
              content =
                content +
                '<tr style="line-height:30px;color:#175bf7;"><td><span style="cursor: pointer;" onclick="window.openMap()">查看路线>>></span>' +
                '</td></tr>'
              content += '</table>'
              var opts = {
                width: 350, // 信息窗口宽度
                title: _that.addr.companyName // 信息窗口标题
              }
              var infowindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
              map.openInfoWindow(infowindow, map.getCenter())
              marker.addEventListener('click', function () {
                this.openInfoWindow(infowindow, map.getCenter())
              })
            } else {
              _that.$message.error('您选择地址没有解析到结果!')
            }
          },
          myCity
        )
      })
    }
  }
}
</script>
<style scpoed lang="less">
/* 去掉地图左下角的百度LOGO */
#allmap {
  font-size: 14px;
      .anchorBL{
        display:none;
    }
    .BMap_bubble_title{
        color:black;
        font-size:13px;
        font-weight: bold;
        text-align:left;
    }
    .BMap_pop div:nth-child(1){
        border-radius:10px 0 0 0;
    }
    .BMap_pop div:nth-child(3){
        border-radius:0 10px 0 0;background:#ABABAB;
    }
    .BMap_pop div:nth-child(3) div{
        border-radius:10px;
    }
    .BMap_pop div:nth-child(5){
        border-radius:0 0 0 10px;
    }
    .BMap_pop div:nth-child(5) div{
        border-radius:10px;
    }
    .BMap_pop div:nth-child(7){
        border-radius:0 0 10px 0 ;
    }
    .BMap_bubble_title{
      font-size: 18px;
    }
}
</style>
