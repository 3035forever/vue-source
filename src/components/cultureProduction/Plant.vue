<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>养殖生产</el-breadcrumb-item>
      <el-breadcrumb-item>加工厂</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题区域 -->
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-house"></i>
          <span>加工厂</span>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="plantList" border stripe>
        >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="adultShrimpId" label="溯源码" width="180"></el-table-column>
        <el-table-column prop="plantName" label="厂家名称"></el-table-column>
        <el-table-column prop="plantAddress" label="厂家地址"></el-table-column>
        <el-table-column
          prop="productionTime"
          label="生产时间"
          width="100"
        ></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="createBy" label="创建者"></el-table-column>
        <el-table-column
          prop="productionTime"
          label="创建时间"
          width="100"
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <!-- 查看加工信息按钮 -->
            <el-tooltip
              effect="dark"
              content="加工信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-d-arrow-right"
                size="mini"
                @click="processing(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removePlantById(scope.row.id)"
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
        <el-form-item label="厂家名称" prop="plantName">
          <el-input v-model="editForm.plantName"></el-input>
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
        <!-- <el-form-item label="创建时间" prop="createDate">
          <el-date-picker
            v-model="editForm.createDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item> -->

        <el-form-item label="生产时间" prop="productionTime">
          <el-date-picker
            v-model="editForm.productionTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品名称" prop="qualificationId">
          <el-select v-model="editForm.qualificationId" placeholder="请选择">
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
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPlantInfo">确 定</el-button>
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

      // 控制修改信息对话框的显示和隐藏
      aditDialogVisible: false,

      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },

      // 总条数
      total: 0,

      // 修改表单的验证规则对象
      editFormRules: {
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

      // 用于存放人员信息
      personInfoList: [],

      // 产品信息
      qualificationList: [],

      // 加工厂信息列表
      plantList: [],

      // 修改对象
      editForm: {}
    }
  },
  created() {
    this.getPlantList()
    this.getPersonInfoList()
    this.getQualificationList()
  },
  methods: {
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getPlantList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getPlantList()
    },

    // 监听修改对话框的关闭事件，关闭时重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
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

    // 获取产品信息
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

    // 获取产品名称（id）
    async getProductName(id) {
      const { data: res } = await this.$http.get('/qualification/' + id)
      this.editForm.productName = res.data.productName
    },

    // 获取列表
    async getPlantList() {
      const { data: res } = await this.$http.post(
        `/plant/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取加工厂信息列表失败！！')
      }
      this.plantList = res.data.rows
      this.total = res.data.total
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/plant/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询加工厂信息失败！！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editPlantInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        if (this.editForm.productionTime !== null) {
          var date = new Date(this.editForm.productionTime)
          this.editForm.productionTime = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        // if (this.editForm.createDate !== null) {
        //   var date1 = new Date(this.editForm.createDate)
        //   this.editForm.createDate = `${date1.getFullYear()}-${date1.getMonth() +
        //     1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        // }
        this.getProductName(this.editForm.qualificationId).then(async () => {
          const { data: res } = await this.$http.post(
            '/plant/' + this.editForm.id,
            this.editForm
          )
          console.log(res)
          if (res.code !== 20000) {
            return this.$message.error('更新加工厂信息失败！！')
          }
          // 关闭对话框
          this.aditDialogVisible = false
          // 刷新用户列表
          this.getPlantList()
          // 提示修改成功
          this.$message.success('更新加工厂信息成功！！')
        })
      })
    },

    // 根据id删除
    async removePlantById(id) {
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该加工厂信息, 是否继续?',
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
      const { data: res } = await this.$http.delete('/plant/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除加工厂信息失败')
      }
      this.$message.success('删除加工厂息成功！！')
      this.getPlantList()
    },

    // 点击加工按钮，跳转页面
    async processing(id) {
      this.$router.push({
        path: '/Plant/Processing',
        query: { plantId: id }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
