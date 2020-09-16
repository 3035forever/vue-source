<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>产品溯源</el-breadcrumb-item>
      <el-breadcrumb-item>物流信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-truck"></i>
          <span>物流信息</span>
        </el-col>
      </el-row>
      <!-- 订单信息列表区域 -->
      <el-table :data="logisticsList" border stripe>
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="出发">
          <el-table-column prop="departureAddr" label="地址"></el-table-column>
          <el-table-column prop="departureTime" label="时间"></el-table-column>
        </el-table-column>
        <el-table-column label="抵达">
          <el-table-column prop="arrivalAddr" label="地址"></el-table-column>
          <el-table-column prop="arrivalTime" label="时间"></el-table-column>
        </el-table-column>
        <!-- <el-table-column prop="createBy" label="创建者"></el-table-column> -->
        <el-table-column label="物流状态">
          <template slot-scope="scope">
            {{ scope.row.logisticsStatus === '1' ? '已到达' : '未到达' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id).then(() => {reload1(), reload2()})"
            ></el-button>
            <!-- 查看虾苗信息按钮 -->
            <el-tooltip
              effect="dark"
              content="订单信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-tickets"
                size="mini"
                @click="getOrderById(scope.row.orderId)"
              ></el-button>
            </el-tooltip>

            <!-- 查看物流信息 -->
            <el-tooltip
              effect="dark"
              content="定位"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location-information"
                size="mini"
                @click="
                  getLogisticsById(scope.row.adultShrimpId).then(() => init())
                "
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeLogisticsById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 展示订单信息 -->
    <el-dialog
      title="订单信息"
      :visible.sync="orderDialogVisible"
      width="30%"
      @close="orderDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form :model="orderForm" ref="orderFormRef" label-width="120px">
        <el-form-item label="客户名">
          <el-input v-model="orderForm.customerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户类型">
          <el-input v-model="orderForm.customerType" disabled></el-input>
        </el-form-item>
        <el-form-item label="金额/元">
          <el-input v-model="orderForm.money" disabled></el-input>
        </el-form-item>
        <el-form-item label="重量/kg">
          <el-input v-model="orderForm.weight" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="orderForm.createBy" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="orderForm.createDate"
            type="datetime"
            placeholder="选择日期时间"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="orderForm.receiptAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="虾苗批次名称">
          <el-input v-model="orderForm.shrimpBatchName" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流信息 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      width="50%"
    >
      <!-- 内容主题区 -->
      <div id="map"></div>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 修改物流信息 -->
    <el-dialog
      title="修改物流信息"
      :visible.sync="aditDialogVisible"
      width="35%"
      @close="aditDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="创建者" prop="createBy">
          <el-select v-model="editForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出发日期" prop="departureTime">
          <el-date-picker
            v-model="editForm.departureTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抵达日期" prop="arrivalTime">
          <el-date-picker
            v-model="editForm.arrivalTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发货地址" prop="departureAddr">
          <el-input v-model="editForm.departureAddr" @blur="reload1" @focus="hideShow(1)"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="arrivalAddr">
          <el-input v-model="editForm.arrivalAddr" @blur="reload2" @focus="hideShow(2)"></el-input>
        </el-form-item>
      </el-form>
      <Map style="height:442px;margin:auto;border-radius:4px;box-shadow:0 0 4px rgba(0,0,0,0.5)"
          v-show="isShowMap1"
          specialId="map1"
          :receiptAddress="editForm.departureAddr"
          @outLocation="outLoaction1"
          @outAddress="outAddressToBox1"
          ref="editMap1"/>
      <Map style="height:442px;margin:auto;border-radius:4px;box-shadow:0 0 4px rgba(0,0,0,0.5)"
          v-show="isShowMap2"
          specialId="map2"
          :receiptAddress="editForm.arrivalAddr"
          @outLoation="outLoaction2"
          @outAddress="outAddressToBox2"
          ref="editMap2"/>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLogisticsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Map from '../Map'
export default {
  components: {
    Map
  },
  data() {
    return {
      isShowMap1: true,
      isShowMap2: false,
      // 基地编号
      baseId: this.defines.baseId,

      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 总条数
      total: 0,

      // 控制订单信息对话框的显示和隐藏
      orderDialogVisible: false,

      // 控制修改信息对话框的显示和隐藏
      logisticsDialogVisible: false,

      // 控制物流信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 修改表单的验证规则
      // editFormRules: [],

      // 用于存放人员信息
      personInfoList: [],

      // 物流信息列表
      logisticsList: [],

      // 订单信息
      orderForm: {},

      // 物流信息byid
      logisticsForm: {},

      // 修改信息表
      editForm: {}

      // // 地图
      // // 出发位置
      // startPos: '',

      // // 抵达位置
      // endPos: '',

      // // 地图设置
      // map: '',

      // // 初始点信息窗口
      // infoWin1: '',

      // // 抵达点信息窗口
      // infoWin2: '',

      // // 初始点标
      // mark1: '',

      // // 抵达点标记
      // mark2: '',

      // // 折线区
      // polyline: ''
    }
  },
  created() {
    this.getlogisticsList()
    this.getPersonInfoList()
  },
  methods: {
    outLoaction1(lat, lng) {
      this.editForm.logisticsStartLongitude = lng
      this.editForm.logisticsStartLatitude = lat
    },
    outLoaction2(lat, lng) {
      this.editForm.logisticsArrivalLongitude = lng
      this.editForm.logisticsArrivalLatitude = lat
    },
    hideShow(num) {
      if (num === 1) {
        this.isShowMap1 = true
        this.isShowMap2 = false
      } else {
        this.isShowMap1 = false
        this.isShowMap2 = true
      }
    },
    // 接受地图返回的地址
    outAddressToBox1(data) {
      this.editForm.departureAddr = data
    },
    outAddressToBox2(data) {
      this.editForm.arrivalAddr = data
    },
    // 输入框失去焦点，刷新地图
    reload1() {
      this.$refs.editMap1.onKeyDown()
    },
    reload2() {
      this.$refs.editMap2.onKeyDown()
    },
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getlogisticsList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getlogisticsList()
    },

    // 监听定单信息对话框的关闭事件，关闭时重置
    orderDialogClosed() {
      this.$refs.orderFormRef.resetFields()
    },

    // 监听修改信息对话框的关闭事件，关闭时重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 获取人员信息
    async getPersonInfoList() {
      const { data: res } = await this.$http.post('/personinfo/search', {
        baseId: this.baseId
      })
      if (res.code !== 20000) {
        return this.$message.error('获取人员列表失败！！')
      }
      this.personInfoList = res.data
    },

    // 获取订单信息
    async getOrderById(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/order/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该订单信息失败！！')
      }
      this.orderForm = res.data
      this.orderDialogVisible = true
    },

    // 获取物流列表
    async getlogisticsList() {
      const { data: res } = await this.$http.post(
        `/logistics/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取物流信息列表失败！！')
      }
      this.logisticsList = res.data.rows
      this.total = res.data.total
      console.log(this.logisticsList)
    },

    // 定位的对话框
    async getLogisticsById(id) {
      // console.log(id)
      // 调用根据ID查询
      const { data: res } = await this.$http.get('/logistics/findForQR/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该物流信息失败！！')
      }
      // console.log(res)
      this.logisticsForm = res.data
      console.log(this.logisticsForm)
      this.logisticsDialogVisible = true
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/logistics/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该物流信息失败！！')
      }
      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editLogisticsInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 转化时间为标准形式
        if (this.editForm.departureTime !== null) {
          var date = new Date(this.editForm.departureTime)
          this.editForm.createDate = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        if (this.editForm.arrivalTime !== null) {
          var date1 = new Date(this.editForm.arrivalTime)
          this.editForm.createDate = `${date1.getFullYear()}-${date1.getMonth() +
            1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        }
        const { data: res } = await this.$http.put(
          `/logistics/${this.editForm.id}`,
          {
            id: this.editForm.id,
            departureAddr: this.editForm.departureAddr,
            logisticsStartLongitude: this.editForm.logisticsStartLongitude,
            logisticsStartLatitude: this.editForm.logisticsStartLatitude,
            arrivalAddr: this.editForm.arrivalAddr,
            logisticsArrivalLongitude: this.editForm.logisticsArrivalLongitude,
            logisticsArrivalLatitude: this.editForm.logisticsArrivalLatitude,
            departureTime: this.editForm.departureTime,
            arrivalTime: this.editForm.arrivalTime,
            adultShrimpId: this.editForm.adultShrimpId,
            createBy: this.editForm.createBy,
            logisticsStatus: this.editForm.logisticsStatus,
            orderId: this.editForm.orderId
          }
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新物流信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新列表
        this.getlogisticsList()
        // 提示修改成功
        this.$message.success('更新物流信息成功！！')
      })
    },

    // 根据id删除对应的信息
    async removeLogisticsById(id) {
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该物流信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        // .catch 用于捕获错误返回给confirmResult
      ).catch(err => {
        return err
      })
      // 如果确认删除，则返回值为字符串 confirm
      // 如果取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/logistics/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除物流信息失败！！')
      }
      this.$message.success('删除物流信息成功！！')
      this.getlogisticsList()
    },

    // 地图
    init() {
      var This = this
      // 经纬度设置
      This.startPos = new qq.maps.LatLng(
        This.logisticsForm.logisticsStartLatitude,
        This.logisticsForm.logisticsStartLongitude
      )
      This.endPos = new qq.maps.LatLng(
        This.logisticsForm.logisticsArrivalLatitude,
        This.logisticsForm.logisticsArrivalLongitude
      )
      // 开始画地图
      This.map = new qq.maps.Map(document.getElementById('map'), {
        // 地图的中心地理坐标，这里设为西安市。
        center: new qq.maps.LatLng(34.01, 108.41),
        zoom: 5
      })
      // InfoWindow表示信息窗口
      This.infoWin1 = new qq.maps.InfoWindow({
        map: This.map
      })
      This.infoWin2 = new qq.maps.InfoWindow({
        map: This.map
      })
      This.infoWin1.open()
      This.infoWin1.setContent(
        '<div style="width:200px;padding-top:10px;">' +
          '离开地址:' +
          This.logisticsForm.departureAddr +
          '<br/>离开时间:' +
          This.logisticsForm.departureTime +
          '</div>'
      )
      This.infoWin1.setPosition(This.startPos)
      This.infoWin2.open()
      This.infoWin2.setContent(
        '<div style="width:200px;padding-top:10px;">' +
          '抵达地址:' +
          This.logisticsForm.arrivalAddr +
          '<br/>抵达时间:' +
          This.logisticsForm.arrivalTime +
          '</div>'
      )
      This.infoWin2.setPosition(This.endPos)
      This.mark1 = new qq.maps.Marker({
        position: This.startPos,
        map: This.map
      })
      This.mark2 = new qq.maps.Marker({
        position: This.endPos,
        map: This.map
      })
      This.polyline = new qq.maps.Polyline({
        path: [This.startPos, This.endPos],
        strokeColor: '#39bf3e',
        strokeWeight: 4,
        map: This.map
      })
    }
  }
}
</script>

<style lang="less" scoped>
#map {
  width: 100%;
  height: 480px;
}
</style>
