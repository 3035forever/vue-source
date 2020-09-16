<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加区域 -->
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-user"></i>
          <span>人员管理</span>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            style="margin-left:930px"
            >添加人员</el-button
          >
        </el-col>
      </el-row>

      <!-- 人员列表区域 -->
      <el-table :data="personInfoList" border stripe>
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="personName" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column
          prop="politicalStatus"
          label="政治面貌"
        ></el-table-column>
        <el-table-column prop="workType" label="工种类别"></el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
              @click="removePersonInfoById(scope.row.id)"
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

    <!-- 添加人员的对话框 -->
    <el-dialog
      title="添加人员"
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
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="addeForm.personName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addeForm.sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicalStatus">
          <el-select v-model="addeForm.politicalStatus" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工种类别" prop="workType">
          <el-input v-model="addeForm.workType"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="addeForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPersonInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改人员的对话框 -->
    <el-dialog
      title="修改人员"
      :visible.sync="aditDialogVisible"
      width="23%"
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
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="editForm.personName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicalStatus">
          <el-select v-model="editForm.politicalStatus" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工种类别" prop="workType">
          <el-input v-model="editForm.workType"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPersonInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义规则：（rule：规则， value：待校验的值，cb:回调函数）
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
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      baseId: this.defines.baseId,

      // 用于存放人员信息
      personInfoList: [],

      // 总条数
      total: 0,

      // 控制添加人员对话框的显示与隐藏
      addDialogVisible: false,

      // 控制修改人员对话框的显示和隐藏
      aditDialogVisible: false,

      // 添加人员的表单数据
      addeForm: {
        // 姓名
        personName: '',
        // 性别
        sex: '',
        // 政治面貌
        politicalStatus: '',
        // 工种类别
        workType: '',
        // 联系电话
        mobile: '',
        baseId: ''
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        personName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        politicalStatus: [
          { required: true, message: '请输入政治面貌', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkMobile, teigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请输入工种类别', trigger: 'blur' }
        ]
      },

      // 保存性别选项
      options: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      // 保存政治面貌
      options2: [
        {
          value: '党员',
          label: '党员'
        },
        {
          value: '共青团员',
          label: '共青团员'
        },
        {
          value: '群众',
          label: '群众'
        }
      ],

      // 查询到的人员信息对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        personName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '姓名的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        politicalStatus: [
          { required: true, message: '政治面貌', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkMobile, teigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请输入工种类别', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPersonInfoList()
  },
  methods: {
    // 获取人员信息
    async getPersonInfoList() {
      // console.log(this.baseId)
      const { data: res } = await this.$http.post(
        `/personinfo/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取人员列表失败！！')
      }
      this.personInfoList = res.data.rows
      this.total = res.data.total
    },

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getPersonInfoList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getPersonInfoList()
    },

    // 监听添加人员对话框的关闭事件,关闭时对表单进行重置
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addeFormRef.resetFields()
    },

    // 监听修改人员对话框的关闭事件
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 点击按钮，添加新人员
    addPersonInfo() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        this.addeForm.baseId = this.baseId
        const { data: res } = await this.$http.post(
          '/personinfo',
          this.addeForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('人员名称或电话号码重复！！请重新输入')
        }
        this.$message.success('添加人员成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getPersonInfoList()
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/personinfo/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询人员信息失败！！')
      }

      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 修改人员信息并提交
    editPersonInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          '/personinfo/' + this.editForm.id,
          {
            personName: this.editForm.personName,
            sex: this.editForm.sex,
            politicalStatus: this.editForm.politicalStatus,
            workType: this.editForm.workType,
            mobile: this.editForm.mobile,
            baseId: this.editForm.baseId
          }
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新人员信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新人员列表
        this.getPersonInfoList()
        // 提示修改成功
        this.$message.success('更新人员信息成功！！')
      })
    },

    // 根据人员id删除对应的人员信息
    async removePersonInfoById(id) {
      // 弹框询问用户是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该人员, 是否继续?',
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
      // 如果人员确认删除，则返回值为字符串 confirm
      // 如果人员取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/personinfo/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除人员失败')
      }
      this.$message.success('删除人员成功！！')
      this.getPersonInfoList()
    }
  }
}
</script>

<style lang="less" scoped></style>
