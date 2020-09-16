<template>
  <div id="isarrive-lcode">
    <p class="errorMes" v-show="isShowError">该操作需等待货物到达，即可进行</p>
  </div>
</template>

<script>
export default {
  name: 'IsArriveLcode',
  data() {
    return {
      isShowError: false
    }
  },
  methods: {
    // 判断是否确认收货
    async getLogisticsById(id) {
      // 调用根据ID查询
      const { data: res } = await this.$http.get('/logistics/findForQR/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该物流信息失败！！')
      }
      console.log(res)
      if (res.data !== null && res.data.logisticsStatus === '0') {
        this.$confirm('请确认是否收到货物', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '确认收货!'
          })
          this.$router.push({
            path: '/LcodeWeb',
            query: { id: id }
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '确认取消！'
          })
          this.isShowError = true
        })
      } else {
        this.$router.push({
          path: '/LcodeWeb',
          query: { id: id }
        })
      }
    }
  },
  created() {
    this.getLogisticsById(this.$route.query.id)
  }
}
</script>

<style lang="less" scoped>
  .errorMes {
    color: rgb(53, 52, 52);
    padding: 10px;
    font-size: 30px;
    width: 450px;
    margin: 100px auto;
    border: 2px dotted rgb(156, 155, 155);
    border-radius: 6px;
    text-align: center;
  }
</style>
