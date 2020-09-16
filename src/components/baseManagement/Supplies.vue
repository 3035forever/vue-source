<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>农资管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px;background-color:#eaedf1">
      <el-col :span="4">
        <i class="el-icon-grape"></i>
        <span>农资管理</span>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true" style="margin-left:965px">农资入库</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <el-tabs type="border-card">
      <!-- 入库记录 -->
      <el-tab-pane label="入库记录">

        <!-- 列表区域 -->
        <el-table :data="SuppliesInList" border stripe>
          <!-- :data: 放入数据源 -->
          <!-- border： 加入边框线 -->
          <!-- type="index"： 索引列 -->
          >
          <el-table-column type="index"> </el-table-column>
          <el-table-column
            prop="suppliesName"
            label="农资名称"
          ></el-table-column>
          <el-table-column
            prop="inTime"
            label="入库日期"
            width="180px"
          ></el-table-column>
          <el-table-column prop="inOperator" label="操作人"></el-table-column>
          <el-table-column prop="warehouse" label="仓库号"></el-table-column>
          <el-table-column
            prop="inNumber"
            label="入库数量(kg)"
          ></el-table-column>
          <el-table-column prop="remainNumber" label="剩余数量(kg)">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.remainNumber>20">{{scope.row.remainNumber}}</el-tag>
              <el-tag type="danger" v-else>{{scope.row.remainNumber}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="inEditDialog(scope.row.id)"
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
                icon="el-icon-upload2"
                size="mini"
                @click="deliveryDialog(scope.row.id)"
              ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <!-- type="danger": 红色警告按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeSuppliesInById(scope.row.id)"
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

        <!-- 农资入库的对话框 -->
        <el-dialog
          title="农资入库"
          :visible.sync="addDialogVisible"
          width="23%"
          @close="addDialogClosed"
        >
          <!-- 内容主体区 -->
          <el-form
            :model="addeForm"
            :rules="addeFormRules"
            ref="addeFormRef"
            label-width="100px"
          >
            <!-- ref:引用，指向本身，用于使用自身的方法 -->
            <el-form-item label="农资名称" prop="suppliesName">
              <el-input v-model="addeForm.suppliesName"></el-input>
            </el-form-item>
            <el-form-item label="操作人" prop="inOperator">
              <el-select v-model="addeForm.inOperator" placeholder="请选择">
                <el-option
                  v-for="item in personInfoList"
                  :key="item.personName"
                  :label="item.personName"
                  :value="item.personName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库号" prop="warehouse">
              <el-input v-model="addeForm.warehouse"></el-input>
            </el-form-item>
            <el-form-item label="入库数量kg" prop="inNumber">
              <el-input-number
                v-model="addeForm.inNumber"
                controls-position="right"
                :min="0.01"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addSuppliesIn">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 农资出库的对话框 -->
        <el-dialog
          title="农资出库"
          :visible.sync="deliveryDialogVisible"
          width="23%"
          @close="deliveryDialogClosed"
        >
          <!-- 内容主体区 -->
          <el-form
            :model="deliveryForm"
            :rules="deliveryFormRules"
            ref="deliveryFormRef"
            label-width="100px"
          >
            <!-- ref:引用，指向本身，用于使用自身的方法 -->
            <el-form-item label="农资名称" prop="suppliesName">
              <el-input v-model="deliveryForm.suppliesName" disabled></el-input>
            </el-form-item>
            <el-form-item label="操作人" prop="outOperator">
              <el-select
                v-model="deliveryForm.outOperator"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in personInfoList"
                  :key="item.personName"
                  :label="item.personName"
                  :value="item.personName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库号" prop="warehouse">
              <el-input v-model="deliveryForm.warehouse" disabled></el-input>
            </el-form-item>
            <el-form-item label="剩余数量kg" prop="remainNumber">
              <el-input v-model="deliveryForm.remainNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="出库数量kg" prop="outNumber">
              <el-input-number
                v-model="deliveryForm.outNumber"
                controls-position="right"
                :min="0.01"
                :max="deliveryForm.remainNumber"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="deliveryDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deliverySupplies"
              >确 定</el-button
            >
          </span>
        </el-dialog>

        <!-- 修改农资入库的对话框 -->
        <el-dialog
          title="修改农资入库"
          :visible.sync="inEditDialogVisible"
          width="23%"
          @close="inEditDialogClosed"
        >
          <!-- 内容主体区 -->
          <el-form
            :model="inEditForm"
            :rules="inEditFormRules"
            ref="inEditFormRef"
            label-width="100px"
          >
            <!-- ref:引用，指向本身，用于使用自身的方法 -->
            <el-form-item label="农资名称" prop="suppliesName">
              <el-input v-model="inEditForm.suppliesName"></el-input>
            </el-form-item>
            <el-form-item label="入库日期">
              <el-date-picker
                v-model="inEditForm.inTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="操作人" prop="inOperator">
              <el-select v-model="inEditForm.inOperator" placeholder="请选择">
                <el-option
                  v-for="item in personInfoList"
                  :key="item.personName"
                  :label="item.personName"
                  :value="item.personName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库号" prop="warehouse">
              <el-input v-model="inEditForm.warehouse"></el-input>
            </el-form-item>
            <el-form-item label="入库数量kg" prop="inNumber">
              <el-input-number
                v-model="inEditForm.inNumber"
                controls-position="right"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="剩余数量kg" prop="remainNumber">
              <el-input-number
                v-model="inEditForm.remainNumber"
                controls-position="right"
                :min="0"
                :max="inEditForm.inNumber"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="inEditDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="inEditSuppliesInfo"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>

      <!-- 出库记录 -->

      <el-tab-pane label="出库记录">
        <!-- 列表区域 -->
        <el-table :data="SuppliesOutList" border stripe>
          <!-- :data: 放入数据源 -->
          <!-- border： 加入边框线 -->
          <!-- type="index"： 索引列 -->
          >
          <el-table-column type="index"> </el-table-column>
          <el-table-column
            prop="suppliesName"
            label="农资名称"
          ></el-table-column>
          <el-table-column
            prop="outTime"
            label="出库日期"
            width="180px"
          ></el-table-column>
          <el-table-column prop="outOperator" label="操作员"></el-table-column>
          <el-table-column prop="warehouse" label="仓库号"></el-table-column>
          <el-table-column
            prop="outNumber"
            label="出库数量(kg)"
          ></el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="outEditDialog(scope.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <!-- type="danger": 红色警告按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removeSuppliesOutById(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="pageInfo2.pagenum"
          :page-sizes="[4, 6, 8, 10]"
          :page-size="pageInfo2.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2"
        >
        </el-pagination>

        <!-- 修改农资出库的对话框 -->
        <el-dialog
          title="修改农资出库"
          :visible.sync="outEditDialogVisible"
          width="25%"
          @close="outEditDialogClosed"
        >
          <!-- 内容主体区 -->
          <el-form
            :model="outEditForm"
            :rules="outEditFormRules"
            ref="outEditFormRef"
            label-width="120px"
          >
            <!-- ref:引用，指向本身，用于使用自身的方法 -->
            <el-form-item label="农资名称" prop="suppliesName">
              <el-input v-model="outEditForm.suppliesName"></el-input>
            </el-form-item>
            <el-form-item label="出库日期">
              <el-date-picker
                v-model="outEditForm.outTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="操作人" prop="outOperator">
              <el-select v-model="outEditForm.outOperator" placeholder="请选择">
                <el-option
                  v-for="item in personInfoList"
                  :key="item.personName"
                  :label="item.personName"
                  :value="item.personName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库号" prop="warehouse">
              <el-input v-model="outEditForm.warehouse"></el-input>
            </el-form-item>
            <el-form-item label="出库数量(kg)" prop="outNumber">
              <el-input-number
                v-model="outEditForm.outNumber"
                controls-position="right"
                :min="0"
                :max="constOutNumber + remainNumber"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="outEditDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="outEditSuppliesInfo"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRed: false,
      // 入库

      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 用于农资列表信息
      SuppliesInList: [],

      // 用于存放人员信息
      personInfoList: [],

      // 控制农资入库对话框的显示与隐藏
      addDialogVisible: false,

      // 控制农资出库对话框的显示与隐藏
      deliveryDialogVisible: false,

      // 控制修改农资出库对话框的显示与隐藏
      inEditDialogVisible: false,

      // 入库总条数
      total: 0,

      // 农资入库的表单数据
      addeForm: {
        suppliesName: '',
        inOperator: '',
        warehouse: '',
        inNumber: 0,
        inTime: '',
        baseId: ''
      },

      // 查询到的农资入库的表单数据
      inEditForm: {},

      // 农资出库的表单数据
      deliveryForm: {
        suppliesName: '',
        outTime: '',
        outOperator: '',
        warehouse: '',
        outNumber: '',
        baseId: '',
        suppliesInId: '',
        remainNumber: ''
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        suppliesName: [
          { required: true, message: '请输入农资名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '农资名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        inOperator: [
          { required: true, message: '请输入操作人', trigger: 'blur' }
        ],
        warehouse: [
          { required: true, message: '请输入仓库号', trigger: 'blur' }
        ],
        inNumber: [
          { required: true, message: '请输入入库数量', trigger: 'blur' }
        ]
      },

      // 农资出库的验证规则对象
      deliveryFormRules: {
        inOperator: [
          { required: true, message: '请输入操作员', trigger: 'blur' }
        ],
        outNumber: [
          { required: true, message: '请输入出库数量', trigger: 'blur' }
        ]
      },

      // 修改农资入库的验证规则对象
      inEditFormRules: {
        suppliesName: [
          { required: true, message: '请输入农资名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '客户名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        inOperator: [
          { required: true, message: '请输入操作人', trigger: 'blur' }
        ],
        warehouse: [
          { required: true, message: '请输入仓库号', trigger: 'blur' }
        ],
        inNumber: [
          { required: true, message: '请输入入库数量', trigger: 'blur' }
        ],
        remainNumber: [
          { required: true, message: '请输入剩余数量', trigger: 'blur' }
        ]
      },

      // 出库

      // 用于控制分页的当前页码和条数
      pageInfo2: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 出库总条数
      total2: 0,

      // 用于农资列表信息
      SuppliesOutList: [],

      // 通过id获取的出库表单
      outEditForm: {},

      // 控制修改农资出库对话框的显示与隐藏
      outEditDialogVisible: false,

      // 修改农资入库的验证规则对象
      outEditFormRules: {
        suppliesName: [
          { required: true, message: '请输入农资名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '客户名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        outOperator: [
          { required: true, message: '请输入操作人', trigger: 'blur' }
        ],
        warehouse: [
          { required: true, message: '请输入仓库号', trigger: 'blur' }
        ],
        outNumber: [
          { required: true, message: '请输入出库数量', trigger: 'blur' }
        ]
      },

      // 基地编号
      baseId: this.defines.baseId,

      // 由id获取出库数量
      constOutNumber: 0,

      // 获取剩余数量
      remainNumber: 0
    }
  },
  created() {
    this.getSuppliesInList()
    this.getSuppliesOutList()
    this.getPersonInfoList()
  },
  methods: {
    // 入库

    // 获取入库记录
    async getSuppliesInList() {
      const { data: res } = await this.$http.post(
        `/suppliesin/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      if (res.code !== 20000) {
        return this.$message.error('获取入库记录失败！！')
      }
      this.SuppliesInList = res.data.rows
      this.total = res.data.total
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

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getSuppliesInList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getSuppliesInList()
    },

    // 监听农资入库对话框的关闭事件,关闭时对表单进行重置
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addeFormRef.resetFields()
    },

    // 监听农资出库对话框的关闭事件，关闭时对表单进行重置
    deliveryDialogClosed() {
      this.$refs.deliveryFormRef.resetFields()
    },

    // 监听修改农资出库对话框的关闭事件，关闭时对表单进行重置
    inEditDialogClosed() {
      this.$refs.inEditFormRef.resetFields()
    },

    // 点击按钮，农资入库
    addSuppliesIn() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        // 调用添加用户接口
        var date = new Date()
        this.addeForm.inTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.addeForm.baseId = this.baseId
        const { data: res } = await this.$http.post(
          '/suppliesin',
          this.addeForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('农资入库失败！！')
        }
        this.$message.success('农资入库成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 刷新
        this.getSuppliesInList()
      })
    },

    // 农资出库的对话框
    async deliveryDialog(id) {
      // 调用根据ID查询农资信息接口
      const { data: res } = await this.$http.get('/suppliesin/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询农资信息失败！！')
      }
      console.log(res)
      this.deliveryForm.baseId = res.data.baseId
      this.deliveryForm.warehouse = res.data.warehouse
      this.deliveryForm.suppliesInId = res.data.id
      this.deliveryForm.suppliesName = res.data.suppliesName
      this.deliveryForm.remainNumber = res.data.remainNumber
      this.deliveryDialogVisible = true
    },

    // 提交农资出库信息
    deliverySupplies() {
      // 先进行表单的预验证
      this.$refs.deliveryFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改用户信息的请求

        // 添加网络时间
        var date = new Date()
        this.deliveryForm.outTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        const { data: res } = await this.$http.post('/suppliesout', {
          suppliesName: this.deliveryForm.suppliesName,
          outTime: this.deliveryForm.outTime,
          outOperator: this.deliveryForm.outOperator,
          warehouse: this.deliveryForm.warehouse,
          outNumber: this.deliveryForm.outNumber,
          baseId: this.deliveryForm.baseId,
          suppliesInId: this.deliveryForm.suppliesInId
        })
        if (res.code !== 20000) {
          return this.$message.error('农资出库失败！！')
        }
        // 关闭对话框
        this.deliveryDialogVisible = false
        // 刷新农资列表
        this.getSuppliesInList()
        // 刷新出库记录
        this.getSuppliesOutList()

        // 提示成功
        this.$message.success('农资出库成功！！')
      })
    },

    // 展示入库修改的对话框
    async inEditDialog(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/suppliesin/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询农资入库信息失败！！')
      }
      this.inEditForm = res.data
      console.log(this.remainNumber)
      this.inEditDialogVisible = true
    },

    // 修改入库信息并提交
    inEditSuppliesInfo() {
      // 先进行表单的预验证
      this.$refs.inEditFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改用户信息的请求
        var date = new Date(this.inEditForm.inTime)
        this.inEditForm.inTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const { data: res } = await this.$http.put(
          '/suppliesin/' + this.inEditForm.id,
          {
            suppliesName: this.inEditForm.suppliesName,
            inTime: this.inEditForm.inTime,
            inOperator: this.inEditForm.inOperator,
            warehouse: this.inEditForm.warehouse,
            inNumber: this.inEditForm.inNumber,
            baseId: this.inEditForm.baseId,
            remainNumber: this.inEditForm.remainNumber
          }
        )
        if (res.code !== 20000) {
          return this.$message.error('更新客户信息失败！！')
        }
        // 关闭对话框
        this.inEditDialogVisible = false
        // 刷新用户列表
        this.getSuppliesInList()
        // 提示修改成功
        this.$message.success('更新客户信息成功！！')
      })
    },

    // 根据农资id删除对应的入库信息
    async removeSuppliesInById(id) {
      // 弹框询问用户是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该记录, 是否继续?',
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
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/suppliesin/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除客户失败')
      }
      this.$message.success('删除客户成功！！')
      this.getSuppliesInList()
    },

    // 出库

    // 获取出库记录
    async getSuppliesOutList() {
      const { data: res } = await this.$http.post(
        `/suppliesout/search/${this.pageInfo2.pagenum}/${this.pageInfo2.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取入库记录失败！！')
      }
      this.SuppliesOutList = res.data.rows
      this.total2 = res.data.total
    },

    // 监听出库pagesize(每页显示条数)改变事件
    handleSizeChange2(newSize) {
      this.pageInfo2.pagesize = newSize
      this.getSuppliesOutList()
    },

    // 监听出库页码值改变的事件
    handleCurrentChange2(newPage) {
      this.pageInfo2.pagenum = newPage
      this.getSuppliesOutList()
    },

    // 监听修改农资出库对话框的关闭事件，关闭时对表单进行重置
    outEditDialogClosed() {
      this.$refs.outEditFormRef.resetFields()
    },

    // 展示修改的对话框
    async outEditDialog(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/suppliesout/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询农资出库信息失败！！')
      }
      this.outEditForm = res.data
      this.constOutNumber = this.outEditForm.outNumber
      this.outEditDialogVisible = true
      const { data: res2 } = await this.$http.get(
        '/suppliesin/' + this.outEditForm.suppliesInId
      )
      if (res2.code !== 20000) {
        return this.$message.error('查询农资剩余数量信息失败！！')
      }
      this.remainNumber = res2.data.remainNumber
      console.log(this.remainNumber)
      console.log(this.constOutNumber)
    },

    // 修改出库信息并提交
    outEditSuppliesInfo() {
      // 先进行表单的预验证
      this.$refs.outEditFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改用户信息的请求
        var date2 = new Date(this.outEditForm.outTime)
        this.outEditForm.outTime = `${date2.getFullYear()}-${date2.getMonth() +
          1}-${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`

        console.log(this.outEditForm.outTime)
        const { data: res } = await this.$http.put(
          '/suppliesout/' + this.outEditForm.id,
          {
            suppliesName: this.outEditForm.suppliesName,
            outTime: this.outEditForm.outTime,
            outOperator: this.outEditForm.outOperator,
            warehouse: this.outEditForm.warehouse,
            outNumber: this.outEditForm.outNumber,
            baseId: this.outEditForm.baseId,
            suppliesInId: this.outEditForm.suppliesInId
          }
        )
        if (res.code !== 20000) {
          return this.$message.error('更新出库记录失败！！')
        }
        // 关闭对话框
        this.outEditDialogVisible = false
        // 清空剩余数量数据
        this.remainNumber = 0
        // 刷新用户列表
        this.getSuppliesOutList()
        // 提示修改成功
        this.$message.success('更新出库记录成功！！')
      })
    },

    // 根据农资id删除对应的出库信息
    async removeSuppliesOutById(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该记录, 是否继续?',
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
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/suppliesout/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除客户失败')
      }
      this.$message.success('删除客户成功！！')
      this.getSuppliesOutList()
    }
  }
}
</script>

<style lang="less" scoped>
  .red{
    color: red;
  }
</style>
