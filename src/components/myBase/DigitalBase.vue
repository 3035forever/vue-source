<template>
  <div id="digitalbase">
    <iframe
      id="receivePage"
      src="http://www.hanqy.top/Shrimp/xiaindex/showBase.html"
      hidden="hidden"
    ></iframe>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的基地</el-breadcrumb-item>
      <el-breadcrumb-item>数字基地</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cardBody">
      <el-row class="globalHeader" style="margin-bottom:20px">
        <i class="el-icon-s-data"></i>
        <span>数字基地</span>
      </el-row>
      <el-row justify="space-around" type="flex">
        <el-col :span="6">
          <el-card shadow="always">
            <el-carousel height="180px" indicator-position="outside">
              <el-carousel-item v-for="item in picSets" :key="item">
                <el-image :src="item"></el-image>
              </el-carousel-item>
            </el-carousel>
            <el-row class="baseInformation">
              <p>
                <i class="el-icon-office-building"></i>
                {{baseInfoForm.baseName}}
              </p>
              <p>
                <i class="el-icon-user"></i>
                {{baseInfoForm.createBy}}
              </p>
              <p>
                <i class="el-icon-map-location"></i>
                {{baseInfoForm.baseAddr}}
              </p>
              <p>
                <i class="el-icon-pie-chart"></i>
                池塘总面积：{{pondInfo.volume}}m²
              </p>
              <p>
                <i class="el-icon-data-line"></i>
                池塘数量：{{pondInfo.pondNum}}
              </p>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="11">
          <el-card shadow="always">
            <Map :receiptAddress="this.baseInfoForm.baseAddr" :zoomSize="17" ref="digitalMap" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <WeatherCard :weatherIndex="this.weatherInfo.weatherIndex" />
            <div class="content">
              <div class="content-left">
                <span>{{this.weatherInfo.temperature}}</span>
                <span style="fontSize: 20px">℃</span>
              </div>
              <div class="content-right">
                <p>{{this.weatherInfo.cityName}}</p>
                <p>{{this.weatherInfo.date[0]}}</p>
                <p
                  style="font-size:20px;font-weight:bold;padding-top:3px"
                >{{this.weatherInfo.weather}}</p>
              </div>
              <div class="content-bottom">
                <p>湿度：{{this.weatherInfo.humidity}}</p>
                <p>{{this.weatherInfo.windDir}}</p>
                <p>风力：{{this.weatherInfo.windSpeed}}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import WeatherCard from './weather/WeatherCard'
import Map from '../Map'
export default {
  name: 'DigitalBase',
  components: {
    Map,
    WeatherCard
  },
  data() {
    return {
      baseId: this.defines.baseId,
      key: 'pwft87o59d5qillf',
      baseInfoForm: {
        baseName: '',
        baseIntroduction: '',
        baseAddr: '',
        basePositionLongitude: '',
        basePositionLatitude: '',
        createBy: '',
        createDate: '',
        registNumber: '',
        funds: 0,
        scope: '',
        basePic: ''
      },
      weatherInfo: {
        cityName: '',
        temperature: '',
        humidity: '',
        weather: '',
        date: [],
        windDir: '',
        windSpeed: '',
        weatherIndex: ''
      },
      picSets: [],
      pondInfo: {
        volume: 0,
        pondNum: 0
      }
    }
  },
  methods: {
    async getBaseInfo() {
      console.log(this.defines.baseId)
      const { data: res } = await this.$http.get(`/base/${this.baseId}`)
      console.log(res)
      this.baseInfoForm.baseName = res.data.baseName
      this.baseInfoForm.baseIntroduction = res.data.baseIntroduction
      this.baseInfoForm.baseAddr = res.data.baseAddr
      this.baseInfoForm.basePositionLongitude = res.data.basePositionLongitude
      this.baseInfoForm.basePositionLatitude = res.data.basePositionLatitude
      this.baseInfoForm.createBy = res.data.createBy
      this.baseInfoForm.createDate = res.data.createDate
      this.baseInfoForm.registNumber = res.data.registNumber
      this.baseInfoForm.funds = res.data.funds
      this.baseInfoForm.scope = res.data.scope
      this.baseInfoForm.basePic = res.data.basePic
      this.address = res.data.baseAddr
      this.lat = res.data.basePositionLatitude
      this.lng = res.data.basePositionLongitude
      if (res.data.basePic !== '') this.picSets = res.data.basePic.split(';')
    },
    async getPondInfo() {
      const { data: res } = await this.$http.get(`/pond/volume/${this.baseId}`)
      this.pondInfo.volume = res.volume
      this.pondInfo.pondNum = res.pondNum
    },
    // 获取天气信息
    getWeather() {
      var This = this
      axios
        .get('http://api.yytianqi.com/observe', {
          params: {
            city:
              (this.baseInfoForm.basePositionLatitude += 0) +
              ',' +
              (this.baseInfoForm.basePositionLongitude += 0),
            key: this.key
          }
        })
        .then(function (res) {
          console.log(res)
          // 城市名称
          This.weatherInfo.cityName = res.data.data.cityName
          // 更新事件
          This.weatherInfo.date = res.data.data.lastUpdate.split(' ')
          // 温度
          This.weatherInfo.temperature = res.data.data.qw
          // 气象编号
          This.weatherInfo.weatherIndex = res.data.data.numtq
          // 湿度
          This.weatherInfo.humidity = res.data.data.sd
          // 气象名称
          This.weatherInfo.weather = res.data.data.tq
          // 风向
          This.weatherInfo.windDir = res.data.data.fx
          // 风力
          This.weatherInfo.windSpeed = res.data.data.fl
        })
    }
  },
  mounted() {
    // var This = this
    // // 请求数据
    // window.onload = function () {
    //   window.frames[0].postMessage('', 'http://www.hanqy.top')
    //   if (location.href.indexOf('#') === -1) {
    //     location.href = location.href + '#'
    //     location.reload()
    //   }
    // }
    // // 接收数据
    // window.addEventListener(
    //   'message',
    //   function (e) {
    //     console.log(e.data)
    //     // alert(e.data)
    //   },
    //   false
    // )

    if (this.defines.baseId !== '') {
      this.getBaseInfo()
      this.getPondInfo()
      setTimeout(() => {
        this.$refs.digitalMap.onKeyDown()
      }, 500)
      setTimeout(() => {
        this.getWeather()
      }, 500)
    } else {
      var This = this
      window.onload = function() {
        window.frames[0].postMessage('', 'http://www.hanqy.top')
        if (location.href.indexOf('#') === -1) {
          location.href = location.href + '#'
          location.reload()
        }
      }
      window.addEventListener('message', function(e) {
        This.defines.setBaseId(e.data)
        console.log(This.defines.baseId)
        This.baseId = This.defines.baseId
      }, false)

      setTimeout(() => {
        this.getBaseInfo()
        this.getPondInfo()
        setTimeout(() => {
          this.$refs.digitalMap.onKeyDown()
        }, 500)
        setTimeout(() => {
          this.getWeather()
        }, 500)
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
.weather-card {
  border: 1px solid black;
}
.content {
  color: rgb(90, 88, 88);
  height: 200px;
  width: 90%;
  margin: 0 auto;
  // background-color: #e6e0e0;
  background-color: #cce2ff;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid rgb(0, 0, 0);
}
// 天气字体样式
// 气温
.content-left {
  font-size: 70px;
  // width: 50%;
  flex: 1;
  height: 60px;
  // background-color: red;
  padding: 35px 0 0 20px;
}
.content-right {
  // width: 36%;
  flex: 1;
  // background-color: red;
  height: 80px;
  padding: 10px 10px 0 10px;
}
.content-right p {
  color: rgb(128, 125, 125);
  // text-align: center;
  height: 25px;
  margin: 0;
}
.content-bottom {
  flex: 1;
  // width: 100%;
  // height: 100px;
  // background-color: blue;
}
.content-bottom p {
  color: rgb(128, 125, 125);
  // text-align: center;
  padding-left: 135px;
  height: 25px;
  margin: 0;
}
.el-carousel__item .el-image {
  width: 100%;
  height: 180px;
}
.el-carousel__item {
  border-radius: 4px;
  border: 1px solid rgb(179, 176, 176);
}
.el-carousel {
  border-radius: 4px;
  padding: 2px;
}
.baseInformation {
  margin: 0;
}
.baseInformation i {
  color: rgb(45, 46, 46);
  font-size: 18px;
  margin-right: 10px;
}
.baseInformation p {
  color: #6f7074;
  font-size: 14px;
  margin: 0;
}
#map {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(212, 197, 197);
  border-radius: 4px;
}
.cardBody {
  width: 100%;
}
.globalHeader {
  background-color: #eaedf1;
}
</style>
