<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>养殖生产</el-breadcrumb-item>
      <el-breadcrumb-item>冷库</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-mobile"></i>
          <span>冷库</span>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="storageList" border stripe>
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="storageName" label="冷库名称"></el-table-column>
        <el-table-column prop="storageAddr" label="冷库地址"></el-table-column>
        <el-table-column
          prop="storageTemperature"
          label="冷库温度(℃)"
        ></el-table-column>
        <el-table-column
          prop="storageTime"
          label="入库时间"
          width="100"
        ></el-table-column>
        <el-table-column label="出库状态">
          <template slot-scope="scope">
            {{ scope.row.outboundStatus === '1' ? '已出库' : '未出库' }}
          </template>
        </el-table-column>
        <el-table-column label="出库时间" width="100">
          <template slot-scope="scope">
            {{ scope.row.outboundStatus === '1' ? scope.row.outboundTime : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 出库按钮 -->
            <el-tooltip
              effect="dark"
              content="出库"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-caret-top"
                size="mini"
                @click="outStorage(scope.row.adultShrimpId)"
                v-show="scope.row.outboundStatus === '1' ? false : true"
              ></el-button>
            </el-tooltip>

            <!-- 进入加工厂按钮 -->
            <el-tooltip
              effect="dark"
              content="入加工厂"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-house"
                size="mini"
                @click="plant(scope.row.adultShrimpId)"
                v-show="scope.row.outboundStatus === '1' ? true : false"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeStorageById(scope.row.id)"
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

    <!-- 修改冷库的对话框 -->
    <el-dialog
      title="修改冷库信息"
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
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
        <el-form-item label="冷库名称" prop="storageName">
          <el-input v-model="editForm.storageName"></el-input>
        </el-form-item>
        <el-form-item label="操作者" prop="createBy">
          <el-select v-model="editForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冷库温度(℃)" prop="storageTemperature">
          <el-input-number
            v-model="editForm.storageTemperature"
            controls-position="right"
            :min="-273"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="入库时间" prop="storageTime">
          <el-date-picker
            v-model="editForm.storageTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="冷库状态" prop="outboundStatus">
          <el-select v-model="editForm.outboundStatus" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="出库时间" prop="outboundTime">
          <el-date-picker
            v-model="editForm.outboundTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStorageInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 进入加工厂的对话框 -->
    <el-dialog
      title="进入加工厂"
      :visible.sync="plantDialogVisible"
      width="25%"
      @close="plantDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="plantForm"
        :rules="plantFormRules"
        ref="plantFormRef"
        label-width="120px"
      >
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
        <el-form-item label="厂家名称" prop="plantName">
          <el-input v-model="plantForm.plantName"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-select v-model="plantForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产时间" prop="productionTime">
          <el-date-picker
            v-model="plantForm.productionTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品名称" prop="qualificationId">
          <el-select v-model="plantForm.qualificationId" placeholder="请选择">
            <el-option
              v-for="item in qualificationList"
              :key="item.id"
              :label="item.productName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="plantDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="plantInfo">确 定</el-button>
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

      //  出库时间
      outboundTime: '',

      // 控制修改信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 控制进入加工厂信息对话框的显示和隐藏
      plantDialogVisible: false,

      // 保存冷库状态选项·
      options: [
        {
          value: '0',
          label: '未出库'
        },
        {
          value: '1',
          label: '已出库'
        }
      ],

      // 用于存放人员信息
      personInfoList: [],

      // 修改信息对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        storageName: [
          { required: true, message: '请输入冷库名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '冷库名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        storageTemperature: [
          { required: true, message: '请输入冷库温度', trigger: 'blur' }
        ],
        outboundStatus: [
          { required: true, message: '请选择冷库状态', trigger: 'blur' }
        ],
        storageTime: [
          { required: true, message: '请输入入库时间', trigger: 'blur' }
        ]
      },

      // 加工厂表单的验证规则对象
      plantFormRules: {
        plantName: [
          { required: true, message: '请输入厂家名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '厂家名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        createBy: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        qualificationId: [
          { required: true, message: '请选择产品名称', trigger: 'blur' }
        ],
        productionTime: [
          { required: true, message: '请输入生产时间', trigger: 'blur' }
        ]
      },

      // 冷库信息列表
      storageList: [],

      // 产品信息
      qualificationList: [],

      // 存放进入加工厂的表单信息
      plantForm: {
        plantName: '',
        plantAddress: '',
        plantPositionLongitude: '',
        plantPositionLatitude: '',
        productionTime: '',
        adultShrimpId: '',
        productName: '',
        createBy: '',
        createDate: '',
        baseId: '',
        qualificationId: ''
      }
    }
  },
  created() {
    this.getStorageList()
    this.getPersonInfoList()
    this.getQualificationList()
  },
  methods: {
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getStorageList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getStorageList()
    },

    // 监听修改对话框的关闭事件，关闭时重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 监听加工厂的面板的关闭事件，关闭时重置
    plantDialogClosed() {
      this.$refs.plantFormRef.resetFields()
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

    // 获取产品名称信息
    async getQualificationList() {
      const { data: res } = await this.$http.post('/qualification/search', {
        baseId: this.baseId
      })
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取产品信息失败！！')
      }
      this.qualificationList = res.data
    },

    // 获取冷库列表
    async getStorageList() {
      const { data: res } = await this.$http.post(
        `/storage/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取冷库信息列表失败！！')
      }
      this.storageList = res.data.rows
      this.total = res.data.total
    },

    // 出库
    async outStorage(id) {
      var date = new Date()
      this.outboundTime = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      console.log(id)
      const { data: res } = await this.$http.put('/storage/outStorage', {
        adultShrimpId: id,
        outboundTime: this.outboundTime
      })
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('出库失败！！')
      }
      this.$message.success('出库成功！！')
      this.getStorageList()
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/storage/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询冷库信息失败！！')
      }
      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 展示进入加工厂的对话框
    plant(id) {
      this.plantForm.adultShrimpId = id
      this.plantForm.baseId = this.baseId
      this.plantDialogVisible = true
    },

    // 修改信息并提交
    editStorageInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        if (this.editForm.storageTime !== null) {
          var date = new Date(this.editForm.storageTime)
          this.editForm.storageTime = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        if (this.editForm.outboundTime !== null) {
          var date1 = new Date(this.editForm.outboundTime)
          this.editForm.outboundTime = `${date1.getFullYear()}-${date1.getMonth() +
            1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        }

        const { data: res } = await this.$http.put(
          '/storage/' + this.editForm.id,
          this.editForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新冷库信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新用户列表
        this.getStorageList()
        // 提示修改成功
        this.$message.success('更新冷库信息成功！！')
      })
    },

    // 获取基地地址
    async getBaseAddress(id) {
      const { data: res } = await this.$http.get('/base/' + id)
      if (res.code !== 20000) {
        return this.$message.error('获取基地地址失败！！')
      }
      this.plantForm.plantAddress = res.data.baseAddr
      this.plantForm.plantPositionLongitude = res.data.basePositionLongitude
      this.plantForm.plantPositionLatitude = res.data.basePositionLatitude
    },

    // 提交加工厂信息
    plantInfo() {
      // 先进行表单的预验证
      var This = this
      this.$refs.plantFormRef.validate(async valid => {
        if (!valid) return false
        var date = new Date()
        this.plantForm.createDate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        if (this.plantForm.productionTime !== null) {
          var date1 = new Date(this.plantForm.productionTime)
          this.plantForm.productionTime = `${date1.getFullYear()}-${date1.getMonth() +
            1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        }
        this.getBaseAddress(this.plantForm.baseId)
          .then(async () => {
            const { data: res } = await this.$http.get(
              '/qualification/' + This.plantForm.qualificationId
            )
            This.plantForm.productName = res.data.productName
          })
          .then(async () => {
            const { data: res } = await this.$http.post(
              '/plant',
              this.plantForm
            )
            console.log(res)
            if (res.code !== 20000) {
              return this.$message.error('进入加工厂失败！！')
            }
            // 关闭对话框
            this.plantDialogVisible = false
            // 刷新用户列表
            this.getStorageList()
            // 提示修改成功
            this.$message.success('进入加工厂成功！！')
          })
      })
    },

    // 根据id删除
    async removeStorageById(id) {
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该冷库信息, 是否继续?',
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
      console.log(id)
      const { data: res } = await this.$http.delete('/storage/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除冷库信息失败')
      }
      this.$message.success('删除冷库信息成功！！')
      this.getStorageList()
    }
  }
}
</script>

<style lang="less" scoped></style>
