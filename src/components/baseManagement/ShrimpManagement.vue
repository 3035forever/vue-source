<template>
  <div>
    <!-- ShrimpManagement -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>虾苗进货</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加区域 -->
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-s-help"></i>
          <span>虾苗进货</span>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            style="margin-left:930px"
            >添加虾苗</el-button
          >
        </el-col>
      </el-row>

      <!-- 虾苗列表区域 -->
      <el-table :data="ShrimpList" border stripe>
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          prop="shrimpBatchName"
          label="虾苗批次名称"
        ></el-table-column>
        <el-table-column
          prop="shrimpSpecies"
          label="虾苗品种"
        ></el-table-column>
        <el-table-column prop="shrimpOrigin" label="虾苗产地"></el-table-column>
        <el-table-column
          prop="shrimpSupplier"
          label="虾苗供应商"
        ></el-table-column>
        <el-table-column
          prop="shrimpNumber"
          label="虾苗数量/尾"
        ></el-table-column>
        <el-table-column
          prop="remainNumber"
          label="剩余数量/尾"
        ></el-table-column>
        <el-table-column prop="yield" label="产量kg"></el-table-column>
        <el-table-column prop="createBy" label="创建者"></el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="180px"
        ></el-table-column>
        <el-table-column label="操作" width="130px">
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

    <!-- 添加虾苗批次的对话框 -->
    <el-dialog
      title="添加客户"
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
        <el-form-item label="批次名称" prop="shrimpBatchName">
          <el-input v-model="addeForm.shrimpBatchName"></el-input>
        </el-form-item>
        <el-form-item label="虾苗品种" prop="shrimpSpecies">
          <el-select v-model="addeForm.shrimpSpecies" placeholder="请选择">
            <el-option
              v-for="item in ShrimpSpeciesList"
              :key="item.id"
              :value="item.kindName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="虾苗产地" prop="shrimpOrigin">
          <el-input v-model="addeForm.shrimpOrigin"></el-input>
        </el-form-item>
        <el-form-item label="虾苗供应商" prop="shrimpSupplier">
          <el-input v-model="addeForm.shrimpSupplier"></el-input>
        </el-form-item>
        <el-form-item label="虾苗数量/尾" prop="shrimpNumber">
          <el-input-number
            v-model="addeForm.shrimpNumber"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-select v-model="addeForm.createBy" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addShrimp">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改虾苗信息的对话框 -->
    <el-dialog
      title="修改虾苗信息"
      :visible.sync="aditDialogVisible"
      width="23%"
      @close="aditDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
        <el-form-item label="批次名称" prop="shrimpBatchName">
          <el-input v-model="editForm.shrimpBatchName"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" prop="createDate">
          <el-date-picker
            v-model="editForm.createDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
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
        <el-form-item label="虾苗总量/尾" prop="shrimpNumber">
          <el-input-number
            v-model="editForm.shrimpNumber"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="剩余数量kg" prop="remainNumber">
          <el-input-number
            v-model="editForm.remainNumber"
            controls-position="right"
            :min="0"
            :max="editForm.shrimpNumber"
          ></el-input-number>
        </el-form-item>
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
        <el-form-item label="产量kg" prop="yield">
          <el-input-number
            v-model="editForm.yield"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editShrimpInfo">确 定</el-button>
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

      // 用于存放人员信息
      personInfoList: [],

      // 虾苗列表
      ShrimpList: [],

      // 虾苗品种列表
      ShrimpSpeciesList: [],

      // 查询到的虾苗批次信息对象，用于修改信息
      editForm: {
        id: '',
        shrimpBatchName: '',
        shrimpSpecies: '',
        shrimpOrigin: '',
        shrimpSupplier: '',
        shrimpNumber: '',
        yield: 0,
        baseId: '',
        createBy: '',
        createDate: '',
        remainNumber: 0
      },

      // 添加虾苗批次的表单数据
      addeForm: {
        // 虾苗批次名称
        shrimpBatchName: '',
        // 虾苗品种
        shrimpSpecies: '',
        // 虾苗产地
        shrimpOrigin: '',
        // 虾苗供应商
        shrimpSupplier: '',
        // 虾苗数量
        shrimpNumber: '',
        // 基地编号
        baseId: '',
        // 创建者
        createBy: '',
        // 创建时间
        createDate: '',
        // 剩余数量
        remainNumber: ''
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        shrimpBatchName: [
          { required: true, message: '请输入虾苗批次名称', trigger: 'blur' },
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
          { required: true, message: '请输入虾苗供应商', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '虾苗供应商名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        shrimpNumber: [
          { required: true, message: '请输入虾苗数量', trigger: 'blur' }
        ],
        createBy: [{ required: true, message: '请输入创建者', trigger: 'blur' }]
      },

      // 修改表单的验证规则对象
      editFormRules: {
        shrimpBatchName: [
          { required: true, message: '请输入虾苗批次名称', trigger: 'blur' },
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
          { required: true, message: '请输入虾苗供应商', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '虾苗供应商名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        shrimpNumber: [
          { required: true, message: '请输入虾苗数量', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        yield: [{ required: true, message: '请输入产量', trigger: 'blur' }]
      },

      // 控制添加虾苗的开关
      addDialogVisible: false,

      // 控制修改虾苗信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },
      // 总条数
      total: 0
    }
  },
  created() {
    this.getShrimpList()
    this.getShrimpSpeciesList()
    this.getPersonInfoList()
  },
  methods: {
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

    // 获取虾苗列表
    async getShrimpList() {
      const { data: res } = await this.$http.post(
        `/shrimpManagement/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗列表失败！！')
      }
      this.ShrimpList = res.data.rows
      this.total = res.data.total
    },

    // 获取虾苗品种列表
    async getShrimpSpeciesList() {
      const { data: res } = await this.$http.get('/shrimpKind')
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗列表失败！！')
      }
      this.ShrimpSpeciesList = res.data
      console.log(this.ShrimpSpeciesList)
    },

    // 监听添加用户对话框的关闭事件,关闭时对表单进行重置
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addeFormRef.resetFields()
    },

    // 监听修改用户对话框的关闭事件
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

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

    // 点击按钮，添加虾苗信息
    addShrimp() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        // 调用添加用户接口
        this.addeForm.baseId = this.baseId
        var date = new Date()
        this.addeForm.createDate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const { data: res } = await this.$http.post(
          '/shrimpManagement',
          this.addeForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('批次名称重复！！')
        }
        this.$message.success('添加虾苗成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新用户列表
        this.getShrimpList()
      })
    },

    // 展示虾苗修改的对话框
    async showEditDialog(id) {
      // 调用根据ID查询用户信息接口
      const { data: res } = await this.$http.get('/shrimpManagement/' + id)
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('查询虾苗信息失败！！')
      }
      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 修改虾苗信息并提交
    editShrimpInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改用户信息的请求
        var date = new Date(this.editForm.createDate)
        this.editForm.createDate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        console.log(this.editForm.createDate)
        const { data: res } = await this.$http.put(
          '/shrimpManagement/' + this.editForm.id,
          {
            shrimpBatchName: this.editForm.shrimpBatchName,
            createDate: this.editForm.createDate,
            shrimpSpecies: this.editForm.shrimpSpecies,
            shrimpOrigin: this.editForm.shrimpOrigin,
            shrimpSupplier: this.editForm.shrimpSupplier,
            shrimpNumber: this.editForm.shrimpNumber,
            baseId: this.editForm.baseId,
            createBy: this.editForm.createBy,
            remainNumber: this.editForm.remainNumber,
            yield: this.editForm.yield
          }
        )
        if (res.code !== 20000) {
          return this.$message.error('更新客户信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新用户列表
        this.getShrimpList()
        // 提示修改成功
        this.$message.success('更新客户信息成功！！')
      })
    },

    // 根据id删除对应的虾苗信息
    async removeShrimpById(id) {
      // 弹框询问是否删除数据
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
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/shrimpManagement/' + id)
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('删除虾苗信息失败')
      }
      this.$message.success('删除虾苗信息成功！！')
      this.getShrimpList()
    }
  }
}
</script>

<style lang="less" scoped></style>
