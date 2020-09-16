<template>
  <div class="single_live">
    <div class="choose" style="position:relative;">
      <el-select
        v-model="value"
        placeholder="请选择设备"
        @change="handleItemChange"
        @visible-change="getMonitors"
        style="width:85%"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="handleFlash" style="width:15%;position:absolute;top:0;right:0;">刷新</el-button>
    </div>
    <div class="frame">
      <iframe
        style="background:rgba(0,0,0,0.2);"
        :src="videoUrl"
        width="100%"
        height="90%"
        frameborder="no"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      videoUrl: '',
      options: [],
      value: '',
      postBody: {
        id: '',
        deviceSerial: '',
        validateCode: '',
      },
      baseId: this.defines.baseId,
    }
  },
  methods: {
    // 发送请求，获取该设备的信息
    async handleItemChange() {
      console.log(this.value)
      let { data: res } = await axios.get(
        `http://120.79.63.74:9004/monitor/${this.value}`
      )
      // console.log(res)
      if (res.code === 20000) {
        res = res.data
        this.postBody = res
        this.videoUrl = res.vedioUrl
        // console.log(res.vedioUrl)
      } else {
        this.$message.error(res.message)
      }
    },
    // 点击选择框是获取监控设备
    async getMonitors() {
      // console.log(this.defines.baseId)
      if (this.options.length === 0) {
        let { data: res } = await axios.post(
          `http://120.79.63.74:9004/monitor/${this.baseId}`
        )
        // let { data: res } = await axios.post(
        //   `http://120.79.63.74:9004/monitor/1248910886228332544`
        // )
        // console.log(res)
        if (res.code === 20000) {
          res = res.data
          this.options = []
          res.forEach((item) => {
            this.options.push({
              value: item.id,
              label: item.monitoringLocation
            })
          })
        } else {
          this.$message.error(res.message)
        }
      }
    },
    // 当视频过期时，点击刷新
    async handleFlash() {
      // console.log(this.postBody)
      let res = await axios.post(
        `http://120.79.63.74:9004/monitor/update`,
        this.postBody
      )
      // console.log(res)
      res = res.data
      if (res.code == 20000) {
        res = res.data
        this.videoUrl = res.vedioUrl
        // console.log(this.videoUrl)
        this.$message.success('刷新成功')
      } else {
        this.$message.error('刷新失败')
      }
    },
  },
  async created() {
  },
}
</script>