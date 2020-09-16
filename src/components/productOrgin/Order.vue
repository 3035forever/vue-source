<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>产品溯源</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-document"></i>
          <span>订单管理</span>
        </el-col>
      </el-row>

      <!-- 订单信息列表区域 -->
      <el-table :data="OrderList" border stripe>
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <!-- <el-table-column
          prop="logisticsId"
          label="物流编号"
          width="180"
        ></el-table-column> -->

        <el-table-column
          prop="customerName"
          label="客户名"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="customerType"
          label="客户类型"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="money"
          label="金额/元"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量/kg"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="createBy"
          label="创建者"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="receiptAddress"
          label="收货地址"
        ></el-table-column>
        <el-table-column label="二维码" width="150">
          <template slot-scope="scope">
            <!-- 物流二维码按钮 -->
            <el-button
              type="primary"
              size="mini"
              @click="logisticsOrcode(scope.row.adultShrimpId)"
            >物流</el-button>
            <!-- 溯源二维码按钮 -->
            <el-button
              type="info"
              size="mini"
              @click="originOrcode(scope.row.adultShrimpId)"
            >溯源</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 查看虾苗信息按钮 -->
            <el-tooltip
              effect="dark"
              content="虾苗信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-tickets"
                size="mini"
                @click="getShrimpById(scope.row.shrimpId)"
              ></el-button>
            </el-tooltip>

            <!-- 查看物流信息 -->
            <el-tooltip
              effect="dark"
              content="物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-truck"
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
              @click="removeOrderById(scope.row.id)"
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

    <!-- 修改订单信息的对话框 -->
    <el-dialog
      title="修改虾苗信息"
      :visible.sync="aditDialogVisible"
      width="30%"
      @close="aditDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="客户名" prop="customerName">
          <el-input v-model="editForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
          <el-select v-model="editForm.customerType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额/元" prop="money">
          <el-input-number
            v-model="editForm.money"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量/kg" prop="weight">
          <el-input-number
            v-model="editForm.weight"
            controls-position="right"
            :min="0"
            :max="remain + constWeight"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="操作人" prop="createBy">
          <el-select v-model="editForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期" prop="createDate">
          <el-date-picker
            v-model="editForm.createDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiptAddress">
          <el-input v-model="editForm.receiptAddress"></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示虾苗信息 -->
    <el-dialog
      title="虾苗信息"
      :visible.sync="shrimpDialogVisible"
      width="30%"
      @close="shrimpDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form :model="shrimpForm" ref="shrimpFormRef" label-width="120px">
        <el-form-item label="虾苗批次名称" prop="shrimpBatchName">
          <el-input v-model="shrimpForm.shrimpBatchName" disabled></el-input>
        </el-form-item>
        <el-form-item label="虾苗品种" prop="shrimpSpecies">
          <el-input v-model="shrimpForm.shrimpSpecies" disabled></el-input>
        </el-form-item>
        <el-form-item label="虾苗产地" prop="shrimpOrigin">
          <el-input v-model="shrimpForm.shrimpOrigin" disabled></el-input>
        </el-form-item>
        <el-form-item label="虾苗供应商" prop="shrimpSupplier">
          <el-input v-model="shrimpForm.shrimpSupplier" disabled></el-input>
        </el-form-item>
        <el-form-item label="放苗时间" prop="seedlingTime">
          <el-date-picker
            v-model="shrimpForm.seedlingTime"
            type="datetime"
            placeholder="选择日期时间"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="捕捞时间" prop="fishingTime">
          <el-date-picker
            v-model="shrimpForm.fishingTime"
            type="datetime"
            placeholder="选择日期时间"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="（捕捞）审核人" prop="createBy">
          <el-input v-model="shrimpForm.createBy" disabled></el-input>
        </el-form-item>
        <el-form-item label="投放尾数/尾" prop="inputNum">
          <el-input v-model="shrimpForm.inputNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="产量kg" prop="yield">
          <el-input v-model="shrimpForm.yield" disabled></el-input>
        </el-form-item>
        <el-form-item label="剩余量kg" prop="remain">
          <el-input v-model="shrimpForm.remain" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="shrimpDialogVisible = false">取 消</el-button>
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

    <!-- 物流二维码 -->
    <el-dialog title="物流二维码" width="30%" :visible.sync="isShowLCode" @close="closeCode(1)">
      <div id="lcode" ref="lcode" style="margin:auto"></div>
      <p style="text-align:center;font-size:20px">溯源码 {{adultShrimpId}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowLCode = false">取 消</el-button>
        <el-button type="primary" @click="toLcodeWeb(adultShrimpId)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 溯源二维码 -->
    <el-dialog title="溯源二维码" width="30%" :visible.sync="isShowOCode" @close="closeCode(2)">
      <div id="ocode" ref="ocode" style="margin:auto"></div>
      <p style="text-align:center;font-size:20px">溯源码 {{adultShrimpId}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowOCode = false">取 消</el-button>
        <el-button type="primary" @click="toOcodeWeb(adultShrimpId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      // 基地编号
      baseId: this.defines.baseId,
      // 是否显示物流二维码页面
      isShowLCode: false,
      // 是否显示溯源二维码页面
      isShowOCode: false,
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 总条数
      total: 0,

      // 控制修改订单信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 控制虾苗信息对话框的显示和隐藏
      shrimpDialogVisible: false,

      // 控制物流信息对话框的显示和隐藏
      logisticsDialogVisible: false,

      //   保存重量，用于修改
      constWeight: 0,

      // 保存虾苗剩余量
      remain: 0,

      // 修改表单的验证规则对象
      editFormRules: {
        shrimpBatchName: [
          { required: true, message: '请输入批次名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '虾苗批次名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        customerName: [
          { required: true, message: '请输入客户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '客户名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        createDate: [
          { required: true, message: '请输入创建日期', trigger: 'blur' }
        ],
        receiptAddress: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ]
      },

      // 保存客户类型选项·
      options: [
        {
          value: '个人',
          label: '个人'
        },
        {
          value: '企业',
          label: '企业'
        }
      ],

      // 用于存放人员信息
      personInfoList: [],

      // 订单列表
      OrderList: [],

      // 虾苗信息
      shrimpForm: {},

      // 修改：查询到的订单信息
      editForm: {},

      // 物流：查询到的物流信息
      logisticsForm: {},

      // 地图
      // 出发位置
      startPos: '',

      // 抵达位置
      endPos: '',

      // 地图设置
      map: '',

      // 初始点信息窗口
      infoWin1: '',

      // 抵达点信息窗口
      infoWin2: '',

      // 初始点标
      mark1: '',

      // 抵达点标记
      mark2: '',

      // 折线区
      polyline: '',

      // 当前点击订单的城虾id
      adultShrimpId: ''
    }
  },
  created() {
    this.getOrderList()
    this.getPersonInfoList()
  },
  methods: {
    // 物流二维码弹窗
    logisticsOrcode(adultShrimpId) {
      this.isShowLCode = true
      this.adultShrimpId = adultShrimpId
      this.$nextTick(() => {
        this.createlcode()
      })
    },
    // 溯源二维码弹窗
    originOrcode(adultShrimpId) {
      this.isShowOCode = true
      this.adultShrimpId = adultShrimpId
      this.$nextTick(() => {
        this.createocode()
      })
    },
    // 前往判断是否收货页面
    toLcodeWeb(id) {
      this.$router.push({
        path: '/IsArriveLcode',
        query: { id: id }
      })
    },
    // 前往判断是否收货页面
    toOcodeWeb(id) {
      this.$router.push({
        path: '/IsArriveOcode',
        query: { id: id }
      })
    },
    // 生成物流二维码
    createlcode() {
      new QRCode('lcode', {
        width: 250,
        height: 250
      }).makeCode('http://120.78.14.141:9010/#/IsArriveLcode?id=' + this.adultShrimpId)
    },
    // 生成溯源二维码
    createocode() {
      new QRCode('ocode', {
        width: 250,
        height: 250
      }).makeCode('http://120.78.14.141:9010/#/IsArriveOcode?id=' + this.adultShrimpId)
    },
    // 关闭弹框,清除已经生成的二维码
    closeCode (num) {
      if (num === 1) this.$refs.lcode.innerHTML = ''
      else if (num === 2) this.$refs.ocode.innerHTML = ''
    },
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getOrderList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getOrderList()
    },

    // 监听修改订单信息对话框的关闭事件，关闭时重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 监听修改虾苗信息对话框的关闭事件，关闭时重置
    shrimpDialogClosed() {
      this.$refs.shrimpFormRef.resetFields()
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
    async getOrderList() {
      const { data: res } = await this.$http.post(
        `/order/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      // console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗订单列表失败！！')
      }
      this.OrderList = res.data.rows
      this.total = res.data.total
    },

    // 获取虾苗信息
    async getShrimpById(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/shrimp/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该虾苗信息失败！！')
      }
      this.shrimpForm = res.data
      this.shrimpDialogVisible = true
    },

    // 获取虾苗剩余量
    async getShrimpRemainById(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/shrimp/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该虾苗剩余量失败！！')
      }
      this.remain = res.data.remain
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/order/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该订单信息失败！！')
      }
      this.editForm = res.data
      this.getShrimpRemainById(this.editForm.shrimpId)
      this.constWeight = res.data.weight
      // console.log(this.editForm)
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editOrderInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改用户信息的请求
        // 转化时间为标准形式
        if (this.editForm.createDate !== null) {
          var date = new Date(this.editForm.createDate)
          this.editForm.createDate = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        const { data: res } = await this.$http.post(
          `/order/${this.editForm.id}?oldNum=${this.constWeight}`,
          {
            customerName: this.editForm.customerName,
            customerType: this.editForm.customerType,
            money: this.editForm.money,
            shrimpId: this.editForm.shrimpId,
            weight: this.editForm.weight,
            createBy: this.editForm.createBy,
            createDate: this.editForm.createDate,
            receiptAddress: this.editForm.receiptAddress,
            addressLongitude: this.editForm.addressLongitude,
            addressLatitude: this.editForm.addressLatitude,
            baseId: this.editForm.baseId,
            shrimpBatchName: this.editForm.shrimpBatchName,
            logisticsId: this.editForm.logisticsId,
            adultShrimpId: this.editForm.adultShrimpId
          }
        )
        // console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新该虾苗订单信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新列表
        this.getOrderList()
        // 提示修改成功
        this.$message.success('更新该虾苗订单信息成功！！')
      })
    },

    // 展示物流信息的对话框
    async getLogisticsById(id) {
      // 调用根据ID查询
      const { data: res } = await this.$http.get('/logistics/findForQR/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该物流信息失败！！')
      }
      // console.log(res)
      this.logisticsForm = res.data
      this.logisticsDialogVisible = true
    },

    // 根据id删除对应的订单信息
    async removeOrderById(id) {
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该订单信息, 是否继续?',
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
      const { data: res } = await this.$http.delete('/order/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除订单信息失败')
      }
      this.$message.success('删除订单信息成功！！')
      this.getOrderList()
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
        zoom: 4
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
#lcode, #ocode{
  height: 250px;
  width: 250px;
  padding:5px;
  border: 1px solid rgb(161, 161, 161);
  border-radius: 6px;
}
#map {
  width: 100%;
  height: 480px;
}
</style>
