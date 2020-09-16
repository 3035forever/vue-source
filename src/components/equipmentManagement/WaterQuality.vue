<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>水质设备</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-s-custom"></i>
          <span>水质设备</span>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAdd()" style="margin-left:930px">添加设备</el-button>
        </el-col>
      </el-row>

      <!-- 设备列表区域 -->
      <el-table :data="equipmentList" border stripe>
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="equipmentName" label="设备名称"></el-table-column>
        <el-table-column prop="equipmentId" label="设备编号"></el-table-column>
        <el-table-column prop="baseName" label="基地名称"></el-table-column>
        <!-- <el-table-column prop="manufactorId" label="设备厂家"></el-table-column> -->
        <el-table-column prop="updateTime" label="添加时间"></el-table-column>
        <el-table-column prop="poodId" label="池塘编号"></el-table-column>
        <el-table-column prop="remarks" label="备注信息"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip class="item" effect="dark" content="修改设备信息" placement="bottom-start">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            </el-tooltip>
            <!-- 设置阀值 -->
            <el-tooltip class="item" effect="dark" content="修改设备阀值" placement="bottom-start">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="small"
              @click="showEditWarning(scope.row.equipmentId)"
            ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <!-- type="danger": 红色警告按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeEquipmentById(scope.row.id)"
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
      title="水质设备"
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
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="addeForm.equipmentName"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentId">
          <el-input v-model="addeForm.equipmentId"></el-input>
        </el-form-item>
        <el-form-item label="基地名称" prop="baseName">
          <el-input v-model="addeForm.baseName"></el-input>
        </el-form-item>
        <el-form-item label="选择池塘" prop="customerType">
          <el-select v-model="editForm.poodId" placeholder="请选择">
            <el-option
              v-for="item in pondList"
              :key="item.id"
              :label="item.pondName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="添加时间">
          <el-date-picker v-model="addeForm.updateTime" type="datetime" placeholder="选择时间"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="addeForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      title="修改水质信息"
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
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="editForm.equipmentName"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentId">
          <el-input v-model="editForm.equipmentId"></el-input>
        </el-form-item>
        <el-form-item label="基地名称" prop="baseName">
          <el-input v-model="editForm.baseName"></el-input>
        </el-form-item>
        <el-form-item label="选择池塘" prop="customerType">
          <el-select v-model="editForm.poodId" placeholder="请选择">
            <el-option
              v-for="item in pondList"
              :key="item.id"
              :label="item.pondName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="添加时间">
          <el-date-picker v-model="editForm.updateTime" type="datetime" placeholder="选择时间"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="editForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEquipmentInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pondList: [],
      // 基地编号
      baseId: this.defines.baseId,
      typeId: '1',
      baseUrl: 'http://106.75.154.40:9004',
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 总条数
      total: 0,

      // 用于存放设备信息
      equipmentList: [],

      // 控制添加设备对话框的显示与隐藏
      addDialogVisible: false,

      // 控制修改设备信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 添加表单数据
      addeForm: {
        id: '',
        typeId: '',
        poodId: '',
        equipmentName: '',
        equipmentId: '',
        baseId: '',
        baseName: '',
        remarks: ''
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        equipmentId: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        baseName: [
          { required: true, message: '请输入基地名称', trigger: 'blur' }
        ],
        poodId: [
          { required: true, message: '请选择池塘', trigger: 'blur' }
        ]
      },

      // 查询到的设备信息对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        equipment_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        equipmentId: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        baseName: [
          { required: true, message: '请输入基地名称', trigger: 'blur' }
        ],
        poodId: [
          { required: true, message: '请选择池塘', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getequipmentList()
    this.getPondList()
  },
  methods: {
    showEditWarning(id) {
      this.$router.push({
        path: '/WaterQualityWarn',
        query: {
          id: id
        }
      })
    },
    showAdd() {
      this.addDialogVisible = true
      // setTimeout(() => {
      //   this.reload1()
      // }, 10)
    },
    // 获取池塘
    async getPondList() {
      const { data: res } = await this.$http.post(
        '/pond/search', {
          baseId: this.baseId
        }
      )
      if (res.code !== 20000) {
        return this.$message.error('获取设备列表失败！！')
      }
      this.pondList = res.data
      console.log(this.pondList)
    },
    // 获取设备信息
    async getequipmentList() {
      // +
      const { data: res } = await this.$http.get(
        `${this.baseUrl}/equipment/findAllByBaseId/${this.baseId}/${this.typeId}/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`
      )
      // const { data: res } = await this.$http.get(
      //   'http://localhost:3000/findAllByBaseId'
      // )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取设备列表失败！！')
      }
      // 处理null
      const rows = res.data.content
      // console.log(rows)
      for (let i = 0; i < rows.length; i++) {
        for (const key in rows[i]) {
          if (rows[i][key] == null || rows[i][key] === 'null' || rows[i][key] === 'NULL') {
            rows[i][key] = ''
          }
        }
      }
      this.equipmentList = rows
      this.total = res.data.totalElements
    },

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getequipmentList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getequipmentList()
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
    async addEquipment() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        this.addeForm.baseId = this.baseId
        this.addeForm.typeId = this.typeId
        const { data: res } = await this.$http.post(`${this.baseUrl}/equipment`, this.addeForm)
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('设备名重复请重新输入！！')
        }
        this.$message.success('添加设备成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getequipmentList()
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`${this.baseUrl}/equipment/${id}`)
      if (res.code !== 20000) {
        return this.$message.error('查询设备信息失败！！')
      }
      const data = res.data
      for (const key in data) {
        if (data[key] == null || data[key] === 'null' || data[key] === 'NULL') {
          data[key] = ''
        }
      }
      console.log(res.data)
      this.editForm = res.data
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editEquipmentInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          `${this.baseUrl}/equipment/${this.editForm.id}`,
          {
            equipmentName: this.editForm.equipmentName,
            equipmentId: this.editForm.equipmentId,
            typeId: this.editForm.typeId,
            poodId: this.editForm.poodId,
            baseId: this.editForm.baseId,
            baseName: this.editForm.baseName,
            remarks: this.editForm.remarks
          }
        )
        // console.log(res)
        // if (res.code !== 20000) {
        //   return this.$message.error('更新设备信息失败！！')
        // }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新用户列表
        this.getequipmentList()
        // 提示修改成功
        this.$message.success('更新设备信息成功！！')
      })
    },

    // 根据删除
    async removeEquipmentById(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该设备, 是否继续?',
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
      const { data: res } = await this.$http.delete(`${this.baseUrl}/equipment/${id}`)
      if (res.code !== 20000) {
        return this.$message.error('删除设备失败')
      }
      this.$message.success('删除设备成功')
      this.getequipmentList()
    }
  }
}
</script>

<style lang="less" scoped></style>
