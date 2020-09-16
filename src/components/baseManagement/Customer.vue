<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-s-custom"></i>
          <span>客户管理</span>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAdd()" style="margin-left:930px">添加客户</el-button>
        </el-col>
      </el-row>

      <!-- 客户列表区域 -->
      <el-table :data="customerList" border stripe>
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="customerName" label="客户名"></el-table-column>
        <el-table-column prop="customerType" label="客户类型"></el-table-column>
        <el-table-column prop="contactPerson" label="联系人"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column
          prop="receiptAddress"
          label="收货地址"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id).then(() => reload2())"
            ></el-button>
            <!-- 删除按钮 -->
            <!-- type="danger": 红色警告按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeCustomerById(scope.row.id)"
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

    <!-- 添加的对话框 -->
    <el-dialog
      title="添加客户"
      :visible.sync="addDialogVisible"
      width="35%"
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
        <el-form-item label="客户名" prop="customerName">
          <el-input v-model="addeForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
          <el-select v-model="addeForm.customerType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="addeForm.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="addeForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addeForm.email"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiptAddress">
          <el-input v-model="addeForm.receiptAddress" @blur="reload1"></el-input>
        </el-form-item>
      </el-form>
      <Map style="height:442px;margin:auto;border-radius:4px;box-shadow:0 0 4px rgba(0,0,0,0.5)"
        specialId="map1"
        :receiptAddress="addeForm.receiptAddress"
        @outAddress="outAddressToBox1"
        @outLocation="outLocation1"
        ref="addMap"/>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      title="修改客户信息"
      :visible.sync="aditDialogVisible"
      width="35%"
      @close="aditDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
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
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="editForm.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiptAddress">
          <el-input v-model="editForm.receiptAddress" @blur="reload2"></el-input>
        </el-form-item>
      </el-form>
      <Map style="height:442px;margin:auto;border-radius:4px;box-shadow:0 0 4px rgba(0,0,0,0.5)"
        specialId="map2"
        :receiptAddress="editForm.receiptAddress"
        @outAddress="outAddressToBox2"
        @outLocation="outLocation2"
        ref="editMap"/>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCustomerInfo">确 定</el-button>
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
    // 自定义规则：（rule：规则， value：待校验的值，cb:回调函数）
    // 自定义验证邮箱规则，后在addeFormRules中使用
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱！！'))
    }
    // 自定义验证手机号规则，后在addeFormRules中使用
    var checkMobile = (rule, value, cb) => {
      // 先定义一个验证手机号的正则表达式
      const regMobile = /^1[34578]\d{9}$/
      // 合法： regMobile.test(value)进过测试后放回的值
      if (regMobile.test(value)) {
        return cb()
      }
      // 不合法
      cb(new Error('请输入合法的手机号'))
    }

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

      // 用于存放客户信息
      customerList: [],

      // 控制添加客户对话框的显示与隐藏
      addDialogVisible: false,

      // 控制修改客户信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 添加表单数据
      addeForm: {
        customerName: '',
        customerType: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
        receiptAddress: '',
        addressLongitude: '18',
        addressLatitude: '18',
        baseId: ''
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        customerName: [
          { required: true, message: '请输入客户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '客户名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        customerType: [
          { required: true, message: '请输入客户类型', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '客户类型的长度在2~6个字符之间',
            trigger: 'blur'
          }
        ],
        contactPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '联系人的长度在2~8个字符之间',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkMobile, teigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义校验规则用validator实现
          { validator: checkEmail, teigger: 'blur' }
        ],
        receiptAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
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

      // 查询到的用户信息对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        customerName: [
          { required: true, message: '请输入客户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '客户名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        customerType: [
          { required: true, message: '请输入客户类型', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '客户类型的长度在2~6个字符之间',
            trigger: 'blur'
          }
        ],
        contactPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '联系人的长度在2~8个字符之间',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkMobile, teigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义校验规则用validator实现
          { validator: checkEmail, teigger: 'blur' }
        ],
        receiptAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log(this.defines.baseId)
    this.getCustomerList()
  },
  methods: {
    showAdd() {
      this.addDialogVisible = true
      setTimeout(() => {
        this.reload1()
      }, 10)
    },
    outLocation2(lat, lng) {
      this.editForm.addressLongitude = lng
      this.editForm.addressLatitude = lat
    },
    outAddressToBox2(data) {
      this.editForm.receiptAddress = data
    },
    reload2() {
      this.$refs.editMap.onKeyDown()
    },
    outLocation1(lat, lng) {
      this.addeForm.addressLongitude = lng
      this.addeForm.addressLatitude = lat
    },
    outAddressToBox1(data) {
      this.addeForm.receiptAddress = data
    },
    reload1() {
      this.$refs.addMap.onKeyDown()
    },
    // 获取客户信息
    async getCustomerList() {
      console.log(this.baseId)
      const { data: res } = await this.$http.post(
        `/customer/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      if (res.code !== 20000) {
        return this.$message.error('获取客户列表失败！！')
      }
      console.log(res)
      this.customerList = res.data.rows
      this.total = res.data.total
    },

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getCustomerList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getCustomerList()
    },

    // 监听添加对话框的关闭事件,关闭时对表单进行重置
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addeFormRef.resetFields()
    },

    // 监听修改对话框的关闭事件，关闭时重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 点击按钮，添加
    addCustomer() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        this.addeForm.baseId = this.baseId
        const { data: res } = await this.$http.post('/customer', this.addeForm)
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('客户名重复请重新输入！！')
        }
        this.$message.success('添加客户成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getCustomerList()
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('/customer/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询客户信息失败！！')
      }

      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editCustomerInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          '/customer/' + this.editForm.id,
          {
            customerName: this.editForm.customerName,
            customerType: this.editForm.customerType,
            contactPerson: this.editForm.contactPerson,
            phoneNumber: this.editForm.phoneNumber,
            receiptAddress: this.editForm.receiptAddress,
            email: this.editForm.email,
            addressLongitude: this.editForm.addressLongitude,
            addressLatitude: this.editForm.addressLatitude,
            baseId: this.editForm.baseId
          }
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新客户信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新用户列表
        this.getCustomerList()
        // 提示修改成功
        this.$message.success('更新客户信息成功！！')
      })
    },

    // 根据删除
    async removeCustomerById(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该客户, 是否继续?',
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
      const { data: res } = await this.$http.delete('/customer/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除客户失败')
      }
      this.$message.success('删除客户成功！！')
      this.getCustomerList()
    }
  }
}
</script>

<style lang="less" scoped></style>
