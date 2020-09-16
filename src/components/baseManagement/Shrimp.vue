<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>虾苗信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-s-order"></i>
          <span>虾苗信息</span>
        </el-col>
      </el-row>
      <!-- 虾苗信息列表区域 -->
      <el-table :data="shrimpList" border stripe>
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          prop="shrimpBatchName"
          label="虾苗批次名称"
          width="110px"
        ></el-table-column>
        <el-table-column
          prop="shrimpSpecies"
          label="虾苗品种"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="seedlingTime"
          label="放苗时间"
          width="100px"
        ></el-table-column>
        <el-table-column label="捕捞状态">
          <template slot-scope="scope">
            {{ scope.row.fishingStatus === '1' ? '已捕捞' : '未捕捞' }}
          </template>
        </el-table-column>
        <el-table-column prop="fishingTime" label="捕捞时间" width="100px">
          <template slot-scope="scope">
            {{ scope.row.fishingStatus === '1' ? scope.row.fishingTime : '' }}
          </template>
        </el-table-column>
        <el-table-column label="捕捞审核人" width="110px">
          <template slot-scope="scope">
            {{ scope.row.fishingStatus === '1' ? scope.row.createBy : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="inputNum" label="投放尾数/尾" width="80">
        </el-table-column>
        <el-table-column label="产量kg" width="80">
          <template slot-scope="scope">
            {{ scope.row.fishingStatus === '1' ? scope.row.yield : '' }}
          </template>
        </el-table-column>
        <el-table-column label="剩余量/kg" width="90">
          <template slot-scope="scope">
            {{
              scope.row.fishingStatus === '1' ? scope.row.remain : ''
            }} </template
          >kg
        </el-table-column>
        <el-table-column label="规格(尾/kg)" width="100">
          <template slot-scope="scope">
            {{ scope.row.fishingStatus === '1' ? scope.row.specification : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="shrimpOrigin"
          label="虾苗产地"
          width="108"
        ></el-table-column>
        <el-table-column
          prop="shrimpSupplier"
          label="虾苗供应商"
          width="100px"
        ></el-table-column>
        <el-table-column label="操作" width="240px" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 订单按钮 -->
            <el-tooltip
              effect="dark"
              content="下订单"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-order"
                size="mini"
                v-show="scope.row.fishingStatus == 1 ? true : false"
                @click="orderById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 入库按钮 -->
            <el-tooltip
              effect="dark"
              content="进入冷库"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-mobile"
                size="mini"
                v-show="scope.row.fishingStatus == 1 ? true : false"
                @click="storageById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeShrimpById(scope.row.id)"
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

    <!-- 修改虾苗信息的对话框 -->
    <el-dialog
      title="修改虾苗信息"
      :visible.sync="aditDialogVisible"
      width="25%"
      @close="aditDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="虾苗批次名称" prop="shrimpBatchName">
          <el-input v-model="editForm.shrimpBatchName"></el-input>
        </el-form-item>
        <el-form-item label="虾苗品种" prop="shrimpSpecies">
          <el-select v-model="editForm.shrimpSpecies" placeholder="请选择">
            <el-option
              v-for="item in ShrimpSpeciesList"
              :key="item.id"
              :value="item.kindName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="虾苗产地" prop="shrimpOrigin">
          <el-input v-model="editForm.shrimpOrigin"></el-input>
        </el-form-item>
        <el-form-item label="虾苗供应商" prop="shrimpSupplier">
          <el-input v-model="editForm.shrimpSupplier"></el-input>
        </el-form-item>
        <el-form-item label="放苗时间" prop="seedlingTime">
          <el-date-picker
            v-model="editForm.seedlingTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="捕捞状态"
          prop="fishingStatus"
          v-show="editForm.fishingStatus == 1 ? true : false"
        >
          <el-select v-model="editForm.fishingStatus" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="捕捞时间"
          prop="fishingTime"
          v-show="editForm.fishingStatus == 1 ? true : false"
        >
          <el-date-picker
            v-model="editForm.fishingTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="（捕捞）审核人"
          prop="createBy"
          v-show="editForm.fishingStatus == 1 ? true : false"
        >
          <el-select v-model="editForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="投放尾数/尾"
          prop="inputNum"
          v-show="editForm.fishingStatus == 1 ? true : false"
        >
          <el-input-number
            v-model="editForm.inputNum"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="产量kg"
          prop="yield"
          v-show="editForm.fishingStatus == 1 ? true : false"
        >
          <el-input-number
            v-model="editForm.yield"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格（尾/kg）" prop="specification">
          <el-select v-model="editForm.specification" placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.id"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="剩余量kg"
          prop="remain"
          v-show="editForm.fishingStatus == 1 ? true : false"
        >
          <el-input-number
            v-model="editForm.remain"
            controls-position="right"
            :min="0"
            :max="editForm.yield"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShrimpInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 订单信息的对话框 -->
    <el-dialog
      title="订单信息"
      :visible.sync="orderDialogVisible"
      width="30%"
      @close="orderDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="orderForm"
        :rules="orderFormRules"
        ref="orderFormRef"
        label-width="120px"
      >
        <el-form-item label="客户名称" prop="customerId">
          <el-select v-model="orderForm.customerId" placeholder="请选择">
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.customerName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额/元" prop="money">
          <el-input-number
            v-model="orderForm.money"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量/kg" prop="weight">
          <el-input-number
            v-model="orderForm.weight"
            controls-position="right"
            :min="0"
            :max="orderForm.remain"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="操作者" prop="createBy">
          <el-select v-model="orderForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrderInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 入库信息的对话框 -->
    <el-dialog
      title="进入冷库"
      :visible.sync="storageDialogVisible"
      width="25%"
      @close="storageDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="storageForm"
        :rules="storageFormRules"
        ref="storageFormRef"
        label-width="120px"
      >
        <el-form-item label="冷库名称" prop="storageName">
          <el-input v-model="storageForm.storageName"></el-input>
        </el-form-item>
        <el-form-item label="剩余量(kg)" prop="remain">
          <el-input v-model="storageForm.remain" disabled></el-input>
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input-number
            v-model="storageForm.weight"
            controls-position="right"
            :min="0"
            :max="storageForm.remain"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="冷库温度(℃)" prop="storageTemperature">
          <el-input-number
            v-model="storageForm.storageTemperature"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="操作者" prop="createBy">
          <el-select v-model="storageForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="storageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStorageInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
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

      // 控制修改虾苗信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 控制下订单对话框的显示和隐藏
      orderDialogVisible: false,

      // 控制入库对话框的显示和隐藏
      storageDialogVisible: false,

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
        shrimpSpecies: [
          { required: true, message: '请输入虾苗品种', trigger: 'blur' }
        ],
        shrimpOrigin: [
          { required: true, message: '请输入虾苗产地', trigger: 'blur' }
        ],
        shrimpSupplier: [
          { required: true, message: '请输入供货商名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '供货商名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ]
      },

      // 订单信息的验证规则对象
      orderFormRules: {
        customerId: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        createBy: [
          { required: true, message: '请输入操作者名称', trigger: 'blur' }
        ]
      },

      // 冷库信息的验证规则对象
      storageFormRules: {
        storageName: [
          { required: true, message: '请输入冷库名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '冷库名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        storageTemperature: [
          { required: true, message: '请输入冷库温度', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '请输入操作者名称', trigger: 'blur' }
        ]
      },

      // 保存投放状态选项·
      options: [
        {
          value: '0',
          label: '未捕捞'
        },
        {
          value: '1',
          label: '已捕捞'
        }
      ],

      // 保存捕捞规格
      options3: [
        {
          value: '60以上'
        },
        {
          value: '50~60'
        },
        {
          value: '30~40'
        },
        {
          value: '20~10'
        },
        {
          value: '10~0'
        }
      ],

      // 用于存放客户信息
      customerList: [],

      // 用于存放人员信息
      personInfoList: [],

      // 虾苗品种列表
      ShrimpSpeciesList: [],

      // 存放虾苗信息
      shrimpList: [],

      // 查询到的用户信息对象
      editForm: {},

      // 存放订单信息表
      orderForm: {
        // 客户id
        customerId: '',
        // 客户名
        customerName: '',
        // 客户类型
        customerType: '',
        money: 0,
        // 虾苗编号（默认）
        shrimpId: '',
        // 重量
        weight: 0,
        // 创建者
        createBy: '',
        // 创建日期
        createDate: '',
        // 收货地址
        receiptAddress: '',
        // 经度，暂时先固定
        addressLongitude: '18',
        // 纬度， 暂时先固定
        addressLatitude: '116',
        baseId: '',
        // 批次名称（默认）
        shrimpBatchName: '',
        // 虾苗剩余数量
        remain: 0
      },

      // 存放冷库信息表
      storageForm: {
        storageName: '',
        storageAddr: '',
        storagePositionLongitude: '',
        storagePositionLatitude: '',
        storageTime: '',
        storageTemperature: '',
        createBy: '',
        baseId: '',
        shrimpId: '',
        weight: 0,
        remain: 0
      }
    }
  },
  created() {
    this.getShrimpList()
    this.getShrimpSpeciesList()
    this.getPersonInfoList()
    this.getCustomerist()
  },
  methods: {
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getShrimpList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getShrimpList()
    },

    // 监听修改虾苗信息对话框的关闭事件，关闭时重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 监听订单信息对话框的关闭事件，关闭时重置
    orderDialogClosed() {
      this.$refs.orderFormRef.resetFields()
    },

    // 监听入库对话框的关闭事件，关闭时重置
    storageDialogClosed() {
      this.$refs.storageFormRef.resetFields()
    },

    // 获取客户信息
    async getCustomerist() {
      const { data: res } = await this.$http.post('/customer/search', {
        baseId: this.baseId
      })
      if (res.code !== 20000) {
        return this.$message.error('获取客户列表失败！！')
      }
      this.customerList = res.data
      console.log(this.customerList)
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

    // 获取基地地址
    async getBaseAddress(id) {
      const { data: res } = await this.$http.get('/base/' + id)
      if (res.code !== 20000) {
        return this.$message.error('获取基地地址失败！！')
      }
      this.storageForm.storageAddr = res.data.baseAddr
      this.storageForm.storagePositionLongitude = res.data.basePositionLongitude
      this.storageForm.storagePositionLatitude = res.data.basePositionLatitude
    },

    // 获取虾苗品种列表
    async getShrimpSpeciesList() {
      const { data: res } = await this.$http.get('/shrimpKind')
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗列表失败！！')
      }
      this.ShrimpSpeciesList = res.data
    },

    // 获取虾苗信息
    async getShrimpList() {
      const { data: res } = await this.$http.post(
        `/shrimp/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗信息列表失败！！')
      }
      this.shrimpList = res.data.rows
      this.total = res.data.total
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/shrimp/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该虾苗信息失败！！')
      }
      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 通过用户id获取客户信息
    async getCustomerById(id) {
      // 调用根据ID查询客户信息接口
      const { data: res } = await this.$http.get('/customer/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询客户信息失败！！')
      }
      this.orderForm.customerName = res.data.customerName
      this.orderForm.customerType = res.data.customerType
      this.orderForm.receiptAddress = res.data.receiptAddress
      this.orderForm.addressLongitude = res.data.addressLongitude
      this.orderForm.addressLatitude = res.data.addressLatitude
    },

    // 展示下订单的对话框
    async orderById(id) {
      const { data: res } = await this.$http.get('/shrimp/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该虾苗信息失败！！')
      }
      this.orderForm.shrimpId = res.data.id
      this.orderForm.shrimpBatchName = res.data.shrimpBatchName
      this.orderForm.baseId = res.data.baseId
      this.orderForm.remain = res.data.remain
      this.orderDialogVisible = true
    },

    // 展示入库的对话框
    async storageById(id) {
      const { data: res } = await this.$http.get('/shrimp/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该虾苗信息失败！！')
      }
      this.storageForm.shrimpId = res.data.id
      this.storageForm.baseId = res.data.baseId
      this.storageForm.remain = res.data.remain
      this.storageDialogVisible = true
    },

    // 提交入库信息并提交
    addStorageInfo() {
      // 先进行表单的预验证
      this.$refs.storageFormRef.validate(valid => {
        if (!valid) return false
        // 正确，则会发起提交订单的请求
        this.getBaseAddress(this.storageForm.baseId).then(async () => {
          console.log(this.storageForm)
          var date = new Date()
          this.storageForm.storageTime = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          console.log(this.storageForm)
          const { data: res } = await this.$http.post(
            `/storage/baseIn?shrimpId=${this.storageForm.shrimpId}&weight=${this.storageForm.weight}`,
            {
              storageName: this.storageForm.storageName,
              storageAddr: this.storageForm.storageAddr,
              storagePositionLongitude: this.storageForm
                .storagePositionLongitude,
              storagePositionLatitude: this.storageForm.storagePositionLatitude,
              storageTime: this.storageForm.storageTime,
              storageTemperature: this.storageForm.storageTemperature,
              createBy: this.storageForm.createBy,
              baseId: this.storageForm.baseId
            }
          )
          if (res.code !== 20000) {
            return this.$message.error('提交入库信息失败！！')
          }
          // 关闭对话框
          this.storageDialogVisible = false
          // 刷新虾苗信息列表
          this.getShrimpList()
          // 提示成功
          this.$message.success('入库成功！！')
        })
      })
    },

    // 提交订单信息并提交
    addOrderInfo() {
      // 先进行表单的预验证
      this.$refs.orderFormRef.validate(valid => {
        if (!valid) return false
        // 正确，则会发起提交订单的请求
        this.getCustomerById(this.orderForm.customerId).then(async () => {
          console.log(this.orderForm)
          var date = new Date()
          this.orderForm.createDate = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          const { data: res } = await this.$http.post('/order', {
            customerName: this.orderForm.customerName,
            customerType: this.orderForm.customerType,
            money: this.orderForm.money,
            shrimpId: this.orderForm.shrimpId,
            weight: this.orderForm.weight,
            createBy: this.orderForm.createBy,
            createDate: this.orderForm.createDate,
            receiptAddress: this.orderForm.receiptAddress,
            addressLongitude: this.orderForm.addressLongitude,
            addressLatitude: this.orderForm.addressLatitude,
            baseId: this.orderForm.baseId,
            shrimpBatchName: this.orderForm.shrimpBatchName
          })
          if (res.code !== 20000) {
            return this.$message.error('提交订单信息失败！！')
          }
          // 关闭对话框
          this.orderDialogVisible = false
          // 刷新虾苗信息列表
          this.getShrimpList()
          // 提示成功
          this.$message.success('提交订单成功！！')
        })
      })
    },

    // 修改用户信息并提交
    editShrimpInfo() {
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
        if (this.editForm.fishingTime !== null) {
          var date2 = new Date(this.editForm.fishingTime)
          this.editForm.fishingTime = `${date2.getFullYear()}-${date2.getMonth() +
            1}-${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`
        }
        if (this.editForm.seedlingTime !== null) {
          var date3 = new Date(this.editForm.seedlingTime)
          this.editForm.seedlingTime = `${date3.getFullYear()}-${date3.getMonth() +
            1}-${date3.getDate()} ${date3.getHours()}:${date3.getMinutes()}:${date3.getSeconds()}`
        }
        const { data: res } = await this.$http.put(
          '/shrimp/' + this.editForm.id,
          {
            shrimpBatchName: this.editForm.shrimpBatchName,
            shrimpSpecies: this.editForm.shrimpSpecies,
            shrimpOrigin: this.editForm.shrimpOrigin,
            shrimpSupplier: this.editForm.shrimpSupplier,
            seedlingTime: this.editForm.seedlingTime,
            fishingStatus: this.editForm.fishingStatus,
            fishingTime: this.editForm.fishingTime,
            pondId: this.editForm.pondId,
            baseId: this.editForm.baseId,
            createBy: this.editForm.createBy,
            createDate: this.editForm.createDate,
            inputNum: this.editForm.inputNum,
            yield: this.editForm.yield,
            remain: this.editForm.remain,
            specification: this.editForm.specification
          }
        )
        console.log(this.editForm)
        if (res.code !== 20000) {
          return this.$message.error('更新该虾苗信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新用户列表
        this.getShrimpList()
        // 提示修改成功
        this.$message.success('更新该虾苗信息成功！！')
      })
    },

    // 根据id删除对应的虾苗信息
    async removeShrimpById(id) {
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该虾苗信息, 是否继续?',
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
      const { data: res } = await this.$http.delete('/shrimp/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除虾苗信息失败')
      }
      this.$message.success('删虾苗信息成功！！')
      this.getShrimpList()
    }
  }
}
</script>

<style lang="less" scoped></style>
