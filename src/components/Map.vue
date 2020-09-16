<template>
    <!--   定义地图显示容器   -->
    <div v-bind:id="specialId" style="width:90%;height:500px;" ></div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    receiptAddress: {
      type: String,
      default: ''
    },
    zoomSize: {
      type: Number,
      default: 16
    },
    specialId: {
      type: String,
      default: 'map'
    }
  },
  data() {
    return {
      // 地址
      address: '',
      // 维度
      lat: 39.916527,
      // 经度
      lng: 116.397128,
      // 用于创建一个地图
      map: undefined,
      // 标记
      mark: undefined,
      debounceLocationToAddr: undefined,
      // 经纬度转地址的转换器
      geocoderLocationToAddr: undefined,
      debounceAddrToLocation: undefined,
      geocoderAddrToLocation: undefined
    }
  },
  methods: {
    // 输入地址时触发事件
    onKeyDown() {
      // 防抖
      this.init()
      this.debounceAddrToLocation = 0
    },
    init() {
      this.address = this.receiptAddress
      var This = this
      // 获取地图显示容器
      This.map = new qq.maps.Map(document.getElementById(this.$props.specialId), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(this.lat, this.lng),
        // 地图缩放等级
        zoom: This.zoomSize
      })
      console.log(This.map)
      // 添加中心标记
      This.mark = new qq.maps.Marker({
        // map方法=>getCenter()：返回地图当前中心点地理坐标。
        position: This.map.getCenter(),
        map: This.map
      })
      // 经纬度转地址的防抖
      This.debounceLocationToAddr = 999
      This.geocoderLocationToAddr = new qq.maps.Geocoder() // 地址和经纬度的转换器
      setInterval(() => {
        // setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
        This.debounceLocationToAddr += 1
        if (This.debounceLocationToAddr === 2) {
          // (Geocoder)getAddress：根据指定的坐标进行解析。
          This.geocoderLocationToAddr.getAddress(This.map.getCenter())
          // (Geocoder)setComplete：设置检索成功后的回调函数
          This.geocoderLocationToAddr.setComplete(function(result) {
            console.log(result)
            This.address = result.detail.address
            This.$emit('outAddress', This.address)
            This.$emit('outLocation', This.lat, This.lng)
          })
          // (Geocoder)setError: 设置检索失败后的回调函数。
          This.geocoderLocationToAddr.setError(function() {
            console.log('解析不了呀')
          })
        }
      }, 500)
      // 地图中心改变时触发事件，保证标记处于视野中心
      qq.maps.event.addListener(This.map, 'center_changed', function() {
        This.mark.setPosition(This.map.getCenter())
        This.lat = This.map.getCenter().lat
        This.lng = This.map.getCenter().lng
        // 防抖
        This.debounceLocationToAddr = 0
      })
      // 地址转经纬度的防抖
      This.debounceAddrToLocation = 999
      This.geocoderAddrToLocation = new qq.maps.Geocoder() // 地址和经纬度的转换器
      setInterval(() => {
        This.debounceAddrToLocation += 1
        if (This.debounceAddrToLocation === 2) {
          This.geocoderAddrToLocation.getLocation(This.address)
          console.log(This.address)
          This.geocoderAddrToLocation.setComplete(function(result) {
            // setCenter:设置地图中心点坐标。
            This.map.setCenter(result.detail.location)
            // setPosition:设置标注位置。
            This.mark.setPosition(result.detail.location)
            This.lat = result.detail.location.lat
            This.lng = result.detail.location.lng
            console.log(This.lat, This.lng)
          })
          This.geocoderAddrToLocation.setError(function() {
            console.log('解析不了呀')
          })
        }
      }, 500)
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    receiptAddress: function(value) {
      this.address = value
    }
  }
}
</script>
<style scoped></style>
