<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>池塘信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-caret-bottom"></i>
          <span>该批次投料信息</span>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="farmDialogVisible = true" style="margin-left:880px">投料</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="returnFond" style="margin-left:750px">返回</el-button>
        </el-col>
      </el-row>

      <!-- 投料信息列表区域 -->
      <el-table :data="pondFList" border stripe>
        >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="applicator" label="投料人员"></el-table-column>
        <el-table-column prop="applyTime" label="投料时间"></el-table-column>
        <el-table-column prop="suppliesName" label="投料名称"></el-table-column>
        <el-table-column prop="applyType" label="投料类型"></el-table-column>
        <el-table-column prop="deliveryVolume" label="投放量(kg)"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <!-- 删除按钮 -->
            <!-- type="danger": 红色警告按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removePondFById(scope.row.id)"
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
      ></el-pagination>
    </el-card>

    <!-- 投料的面板 -->
    <el-dialog title="投料" :visible.sync="farmDialogVisible" width="25%" @close="farmDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="farmForm" :rules="farmFormRules" ref="farmFormRef" label-width="100px">
        <el-form-item label="农资名称" prop="suppliesInfoId">
          <el-select v-model="farmForm.suppliesInfoId" placeholder="请选择">
            <el-option
              v-for="item in suppliesName"
              :key="item.id"
              :label="item.suppliesName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作人" prop="applicator">
          <el-select v-model="farmForm.applicator" placeholder="请选择">
            <el-option v-for="item in personInfoList" :key="item.id" :value="item.personName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作类别" prop="applyType">
          <el-select v-model="farmForm.applyType" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投放量kg" prop="deliveryVolume">
          <el-input-number v-model="farmForm.deliveryVolume" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="farmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="farmPond">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改信息的面板 -->
    <el-dialog
      title="修改投料信息"
      :visible.sync="aditDialogVisible"
      width="25%"
      @close="aditDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="130px">
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
        <el-form-item label="农资名称" prop="suppliesName">
          <el-select v-model="editForm.suppliesInfoId" placeholder="请选择">
            <el-option
              v-for="item in suppliesName"
              :key="item.id"
              :label="item.suppliesName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投料时间" prop="applyTime">
          <el-date-picker v-model="editForm.applyTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="applicator">
          <el-select v-model="editForm.applicator" placeholder="请选择">
            <el-option v-for="item in personInfoList" :key="item.id" :value="item.personName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作类别" prop="applyType">
          <el-select v-model="editForm.applyType" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投放量kg" prop="deliveryVolume">
          <el-input-number v-model="editForm.deliveryVolume" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShrimpFarming">确 定</el-button>
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

      // 池塘id
      pondId: this.$route.query.pondId,

      // 用于获取农资名称
      suppliesName: [],

      // 控制投料面板的显示和隐藏
      farmDialogVisible: false,

      // 控制修改面板的显示和隐藏
      aditDialogVisible: false,

      // 投料表单的验证规则对象
      farmFormRules: {
        suppliesInfoId: [
          { required: true, message: '请输入农资名称', trigger: 'blur' }
        ],
        applicator: [
          { required: true, message: '请输入操作人', trigger: 'blur' }
        ],
        applyType: [
          { required: true, message: '请输入操作类别', trigger: 'blur' }
        ],
        deliveryVolume: [
          { required: true, message: '请输入投放量', trigger: 'blur' }
        ]
      },

      // 修改表单的验证规则对象
      editFormRules: {
        suppliesName: [
          { required: true, message: '请输入农资名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '农资名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        applicator: [
          { required: true, message: '请输入操作者', trigger: 'blur' }
        ],
        applyType: [
          { required: true, message: '请输入操作类别', trigger: 'blur' }
        ],
        deliveryVolume: [
          { required: true, message: '请输入投放量', trigger: 'blur' }
        ],
        applyTime: [
          { required: true, message: '请输入投料时间', trigger: 'blur' }
        ]
      },

      // 投料信息
      pondFList: [],

      // 用于存放人员信息
      personInfoList: [],

      // 保存投料的操作类别选项·
      options2: [
        {
          value: '饲料',
          label: '饲料'
        },
        {
          value: '渔药',
          label: '渔药'
        }
      ],

      // 查询到的池塘信息对象，用于修改池塘信息
      editForm: {},

      // 投料表单数据
      farmForm: {
        suppliesName: '',
        applyTime: '',
        pondId: '',
        applicator: '',
        applyType: '',
        deliveryVolume: '',
        suppliesInfoId: ''
      }
    }
  },
  created() {
    this.getPondFList()
    this.getPersonInfoList()
    this.getsuppliesName()
  },
  methods: {
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getPondFList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getPondFList()
    },

    // 返回池塘
    returnFond() {
      this.$router.push('/Pond')
    },

    // 监听投料对话框的关闭事件,关闭时对表单进行重置
    farmDialogClosed() {
      this.$refs.farmFormRef.resetFields()
    },

    // 监听修改对话框的关闭事件,关闭时对表单进行重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 获取农资信息
    async getsuppliesName() {
      const { data: res } = await this.$http.post('/suppliesinfo/search', {
        baseId: this.baseId
      })
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取农资名称失败！！')
      }
      this.suppliesName = res.data
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

    // 获取投料信息列表
    async getPondFList() {
      console.log(this.pondId)
      const { data: res } = await this.$http.post(
        `/shrimpFarming/pondF/${this.pondId}/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`
      )
      if (res.code !== 20000) {
        return this.$message.error('查询池塘投料信息失败！！')
      }
      console.log(res)
      this.pondFList = res.data.content
      console.log(this.pondFList)
      this.total = res.data.total
    },

    // 获取对应id农资名称
    async getSuppliesName(id) {
      const { data: res } = await this.$http.get('/suppliesinfo/' + id)
      this.farmForm.suppliesName = res.data.suppliesName
      this.editForm.suppliesName = res.data.suppliesName
    },

    // 点击按钮，投料
    farmPond() {
      // 先进行表单的预校验
      this.$refs.farmFormRef.validate(valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        var date = new Date()
        this.farmForm.applyTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.farmForm.deliveryVolume -= 0
        console.log(this.farmForm)
        this.farmForm.pondId = this.$route.query.pondId
        this.getSuppliesName(this.farmForm.suppliesInfoId).then(async () => {
          const { data: res } = await this.$http.post(
            '/shrimpFarming',
            this.farmForm
          )
          console.log(res)
          if (res.code !== 20000) {
            return this.$message.error('投料失败！！')
          }
          this.$message.success('投料成功!!')
          // 隐藏添加的对话框
          this.farmDialogVisible = false
          // 成功后新增，需要刷新池塘列表
          this.getPondFList()
        })
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/shrimpFarming/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该投料信息失败！！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editShrimpFarming() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改信息的请求
        // 转化时间为标准形式
        if (this.editForm.applyTime !== null) {
          var date = new Date(this.editForm.applyTime)
          this.editForm.applyTime = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        console.log(this.editForm)
        this.getSuppliesName(this.editForm.suppliesInfoId).then(async () => {
          const { data: res } = await this.$http.put(
            '/shrimpFarming/' + this.editForm.id,
            this.editForm
          )
          console.log(res)
          if (res.code !== 20000) {
            return this.$message.error('更新该投料信息失败！！')
          }
          // 关闭对话框
          this.aditDialogVisible = false
          // 刷新列表
          this.getPondFList()
          // 提示修改成功
          this.$message.success('更新该投料信息成功！！')
        })
      })
    },

    // 根据删除
    async removePondFById(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该投料记录, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      // 如果确认删除，则返回值为字符串 confirm
      // 如果取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/shrimpFarming/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功！！')
      this.getPondFList()
    }
  }
}
</script>

<style lang="less" scoped></style>
