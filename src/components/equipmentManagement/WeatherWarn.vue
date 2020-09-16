<template>
  <div>
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-s-custom"></i>
          <span>气象预警阀值</span>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAdd()" style="margin-left:900px">添加阀值</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="back()" style="margin-left:800px">返回</el-button>
        </el-col>
      </el-row>

      <!-- 预警列表区域 -->
      <el-table :data="warningList" border stripe>
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="channelName" label="通道的名称"></el-table-column>
        <el-table-column prop="maxValue" label="最大值"></el-table-column>
        <el-table-column prop="minValue" label="最小值"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
         <el-table-column prop="updateDate" label="添加时间">
          <template slot-scope="scope">
            {{scope.row.updateDate | checkTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
            style="margin-right:10px;"
            v-model="scope.row.isUse"
            active-value='1'
            inactive-value='0'
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启动"
            inactive-text="关闭"
            @change="switchFun(scope.row.id)"
            >
            </el-switch>
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <!-- type="danger": 红色警告按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeWarningById(scope.row.id)"
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
      title="气象预警"
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
         <el-form-item label="通道的名称">
            <el-select v-model="addeForm.channelName" placeholder="请选择通道的名称">
                <el-option
                v-for="item in equipmentOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="addeForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="最大值" prop="maxValue">
          <el-input v-model="addeForm.maxValue"></el-input>
        </el-form-item>
        <el-form-item label="最小值" prop="minValue">
          <el-input v-model="addeForm.minValue"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否启用" prop="isUse">
          <el-input v-model="addeForm.remarks"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="是否启用" prop="isUse">
        <template slot-scope="scope">
            <el-switch
            style="display: block"
            v-model="addeForm.isUse"
            active-value='1'
            inactive-value='0'
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启动"
            inactive-text="关闭"
            @change="switchFormFun(scope.row.id)"
            class="formSwitchClass"
            >
            </el-switch>
          </template>
        </el-form-item> -->
        <el-form-item label="更新时间">
          <el-date-picker v-model="addeForm.updateDate" type="datetime" placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addwarning">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      title="修改气象信息"
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
        <el-form-item label="通道的名称">
            <el-select v-model="editForm.channelName" placeholder="请选择通道的名称">
                <el-option
                v-for="item in equipmentOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="editForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="最大值" prop="maxValue">
          <el-input v-model="editForm.maxValue"></el-input>
        </el-form-item>
        <el-form-item label="最小值" prop="minValue">
          <el-input v-model="editForm.minValue"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否启用" prop="isUse">
        <template slot-scope="scope">
            <el-switch
            style="display: block"
            v-model="editForm.isUse"
            active-value='1'
            inactive-value='0'
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启动"
            inactive-text="关闭"
            @change="switchFormFun(scope.row.id)"
            class="formSwitchClass"
            >
            </el-switch>
          </template>
        </el-form-item> -->
        <el-form-item label="更新时间">
          <el-date-picker v-model="editForm.updateDate" type="datetime" placeholder="选择更新时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editwarningInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
    // 气象设备的：电能，光照，风速，风向，气温，湿度，雨量，土温，土湿
      equipmentOptions: [
        {
          value: '电能'
        },
        {
          value: '光照'
        },
        {
          value: '风速'
        },
        {
          value: '风向'
        },
        {
          value: '气温'
        },
        {
          value: '湿度'
        },
        {
          value: '雨量'
        },
        {
          value: '土温'
        },
        {
          value: '土湿'
        }
      ],
      equipmentId: '',
      baseUrl: 'http://106.75.154.40:9004',
      // 基地编号
      // baseId: '1248910886228332544',
      // typeId: '0',
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 总条数
      total: 0,

      // 用于存放预警信息
      warningList: [],

      // 控制添加预警对话框的显示与隐藏
      addDialogVisible: false,

      // 控制修改预警信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 添加表单数据
      addeForm: {
        channelName: '',
        unit: '',
        maxValue: '',
        minValue: '',
        isUse: '0',
        updateDate: ''
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        channelName: [
          { required: true, message: '请输入通道的名称', trigger: 'blur' }
        ],
        maxValue: [
          { required: true, message: '请输入数字', trigger: 'blur' }
        ],
        minValue: [
          { required: true, message: '请输入数字', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },

      // 查询到的预警信息对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        channelName: [
          { required: true, message: '请输入通道的名称', trigger: 'blur' }
        ],
        maxValue: [
          { required: true, message: '请输入数字', trigger: 'blur' }
        ],
        minValue: [
          { required: true, message: '请输入数字', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.equipmentId = this.$route.query.id
    this.getwarningList()
  },
  created() {
    // this.getwarningList()
  },
  methods: {
    // 监听switch改变
    async switchFun(id) {
      const { data: oldRes } = await this.$http.get(`${this.baseUrl}/warning/${id}`)
      if (oldRes.code !== 20000) {
        return this.$message.error('查询预警信息失败！！')
      }
      this.editForm = oldRes.data
      this.editForm.isUse = this.editForm.isUse === '1' ? '0' : '1'
      const { data: res } = await this.$http.put(
        `${this.baseUrl}/warning/${this.editForm.id}`,
        this.editForm
      )
      if (res.code !== 20000) {
        return this.$message.error('更新预警信息失败！！')
      }
      // 关闭对话框
      this.aditDialogVisible = false
      // 刷新用户列表
      this.getwarningList()
      // 提示修改成功
      this.$message.success('更新预警信息成功！！')
    },
    back() {
      this.$router.push('/Weather')
    },
    showAdd() {
      this.addDialogVisible = true
      // setTimeout(() => {
      //   this.reload1()
      // }, 10)
    },
    // 获取预警信息
    async getwarningList() {
      const { data: res } = await this.$http.post(
        `${this.baseUrl}/warning/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`, {
          equipmentId: this.equipmentId
        }
      )
      console.log(res)
      if (!res) {
        return this.$message.error('获取预警列表失败！！')
      }
      this.warningList = res.data.rows
      this.total = res.data.total
    },

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getwarningList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getwarningList()
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
    checkTime(date) {
      if (!date) return ''
      date = date.toString()
      const d = new Date(date)
      const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      const times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
      return times
    },
    // 点击按钮，添加
    addwarning() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        this.addeForm.equipmentId = this.equipmentId
        this.addeForm.updateDate = this.checkTime(this.addeForm.updateDate)
        const { data: res } = await this.$http.post(`${this.baseUrl}/warning`, this.addeForm)
        if (res.code !== 20000) {
          return this.$message.error('预警名重复请重新输入！！')
        }
        this.$message.success('添加预警成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getwarningList()
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`${this.baseUrl}/warning/${id}`)
      if (res.code !== 20000) {
        return this.$message.error('查询预警信息失败！！')
      }
      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editwarningInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          `${this.baseUrl}/warning/${this.editForm.id}`,
          {
            id: this.editForm.id,
            equipmentId: this.editForm.equipmentId,
            channelName: this.editForm.channelName,
            unit: this.editForm.unit,
            maxValue: this.editForm.maxValue,
            minValue: this.editForm.minValue,
            isUse: this.editForm.isUse,
            baseName: this.editForm.baseName,
            updateDate: this.editForm.updateDate
          }
        )
        if (res.code !== 20000) {
          return this.$message.error('更新预警信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新用户列表
        this.getwarningList()
        // 提示修改成功
        this.$message.success('更新预警信息成功！！')
      })
    },

    // 根据删除
    async removeWarningById(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该预警, 是否继续?',
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
      const { data: res } = await this.$http.delete(`${this.baseUrl}/warning/${id}`)
      if (res.code !== 20000) {
        return this.$message.error('删除预警失败')
      }
      this.$message.success('删除预警成功')
      this.getwarningList()
    }
  }
}
</script>

<style lang="less" scoped>
.formSwitchClass{
  line-height: 25px;
}
</style>
