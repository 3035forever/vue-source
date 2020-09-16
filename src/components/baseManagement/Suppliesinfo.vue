<template>
  <div id="supplies-info">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>农资来源</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要内容 -->
    <el-card>
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-folder"></i>
          <span>农资信息来源</span>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="showAdd" style="margin-left:933px">添加信息</el-button>
        </el-col>
      </el-row>
            <el-table
        :data="suppliesInfo"
        style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" label-width="170px">
            <el-form-item label="农资名称" class="down-label">
              <span>{{ props.row.suppliesName }}</span>
            </el-form-item>
            <el-form-item label="农资 ID" class="down-label">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="生产日期" class="down-label">
              <span>{{ props.row.productDate }}</span>
            </el-form-item>
            <el-form-item label="保质期" class="down-label">
              <span>{{ props.row.shelfDate }}</span>
            </el-form-item>
            <el-form-item label="检验人" class="down-label">
              <span>{{ props.row.inspector }}</span>
            </el-form-item>
            <el-form-item label="供应商名称" class="down-label">
              <span>{{ props.row.supplierName }}</span>
            </el-form-item>
            <el-form-item label="供应商地址" class="down-label">
              <span>{{ props.row.supplierAddr }}</span>
            </el-form-item>
            <el-form-item label="供应商电话" class="down-label">
              <span>{{ props.row.supplierPhone }}</span>
            </el-form-item>
            <el-form-item label="供应商生产许可证" class="down-label">
              <div class="downBox">
                <img :src="props.row.supplierLicense" alt="">
                <span class="mask">
                  <span class="mask-icon1" @click=previewInfo(props.row.supplierLicense)><i class="el-icon-zoom-in"></i></span>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="农资照片" class="down-label">
              <div class="downBox">
                <img :src="props.row.suppliesPic" alt="">
                <span class="mask">
                  <span class="mask-icon1" @click=previewInfo(props.row.suppliesPic)><i class="el-icon-zoom-in"></i></span>
                </span>
              </div>
            </el-form-item>
          </el-form>
        </template>
        </el-table-column>
        <el-table-column
          label="#"
          type="index"
          width="200">
        </el-table-column>
        <el-table-column
          label="农资名称"
          prop="suppliesName"
          width="247">
        </el-table-column>
        <el-table-column
          label="生产日期"
          prop="productDate"
          width="300">
        </el-table-column>
        <el-table-column
          label="保质期"
          prop="shelfDate"
          width="300">
        </el-table-column>
        <el-table-column label="操作" width="143">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 添加信息弹窗 -->
    <el-dialog title="添加农资来源信息" @close="addDialogClosed" :visible.sync="isShowAdd" :close-on-press-escape="false" :close-on-click-modal="false" width="60%">
      <el-form :model="addForm"
      :hide-required-asterisk="true"
      :rules="rules"
      ref="addForm"
      label-width="100px"
      label-position="left">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="农资名称" prop="suppliesName">
              <el-input placeholder="请输入农资名称" v-model="addForm.suppliesName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="生产日期" prop="productDate">
              <el-date-picker v-model="addForm.productDate" type="datetime" placeholder="选择生产日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="保质期" prop="shelfDate">
              <el-date-picker v-model="addForm.shelfDate" type="datetime" placeholder="选择保质期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="供应商" prop="supplierName">
              <el-input placeholder="请输入供应商名称" v-model="addForm.supplierName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="操作人" prop="inspector">
              <el-select v-model="addForm.inspector" placeholder="请选择">
                <el-option
                  v-for="item in personInfoList"
                  :key="item.personName"
                  :label="item.personName"
                  :value="item.personName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="供应商电话" prop="supplierPhone">
              <el-input placeholder="请输入供应商电话" v-model="addForm.supplierPhone" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="供应商地址" prop="supplierAddr">
              <el-input placeholder="请输入供应商地址" v-model="addForm.supplierAddr" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">供应商生产许可证</el-col>
          <el-col :span="5">
            <div class="avatarBox">
              <!-- 回显  -->
              <!-- !!()=>转布尔值 -->
              <div v-show="!!(addForm.supplierLicense)" class="avatar">
                <img :src="addForm.supplierLicense">
                <span class="mask">
                  <!-- 放大图片 -->
                  <span class="mask-icon1" @click="preview(0)"><i class="el-icon-zoom-in"></i></span>
                  <!-- 删除图片 -->
                  <span class="mask-icon2" @click="deleteImg(0,addForm.supplierLicense)"><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <el-upload
                  class="avatar-uploader"
                  action="http://106.75.154.40:9011/suppliesinfo/addPic"
                  :show-file-list="false"
                  :on-success="addSuccess"
                  :before-upload="beforeAdd"
                  v-show="!(addForm.supplierLicense)">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">农资照片</el-col>
          <el-col :span="5">
            <div class="avatarBox">
              <div v-show="!!(addForm.suppliesPic)" class="avatar">
                <img :src="addForm.suppliesPic">
                <span class="mask">
                  <span class="mask-icon1" @click="preview(1)"><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click="deleteImg(1,addForm.suppliesPic)"><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <el-upload
                  class="avatar-uploader"
                  action="http://106.75.154.40:9011/suppliesinfo/addPic"
                  :show-file-list="false"
                  :on-success="addSuccess1"
                  :before-upload="beforeAdd"
                  v-show="!(addForm.suppliesPic)">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-button @click="addSuppliesInfo">确定</el-button>
      <el-button @click="cancelAdd">取消</el-button>
    </el-dialog>
    <!-- 编辑信息对话框 -->
    <el-dialog title="添加农资来源信息" @close="editDialogClosed" :visible.sync="isShowEdit" :close-on-press-escape="false" :close-on-click-modal="false" width="60%">
      <el-form :model="editForm"
      :hide-required-asterisk="true"
      :rules="rules"
      ref="editForm"
      label-width="100px"
      label-position="left">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="农资名称" prop="suppliesName">
              <el-input placeholder="请输入农资名称" v-model="editForm.suppliesName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="生产日期" prop="productDate">
              <el-date-picker v-model="editForm.productDate" type="datetime" placeholder="选择生产日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="保质期" prop="shelfDate">
              <el-date-picker v-model="editForm.shelfDate" type="datetime" placeholder="选择保质期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="供应商" prop="supplierName">
              <el-input placeholder="请输入供应商名称" v-model="editForm.supplierName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="操作人" prop="inspector">
              <el-select v-model="editForm.inspector" placeholder="请选择">
                <el-option
                  v-for="item in personInfoList"
                  :key="item.personName"
                  :label="item.personName"
                  :value="item.personName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="供应商电话" prop="supplierPhone">
              <el-input placeholder="请输入供应商电话" v-model="editForm.supplierPhone" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="供应商地址" prop="supplierAddr">
              <el-input placeholder="请输入供应商地址" v-model="editForm.supplierAddr" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">供应商生产许可证</el-col>
          <el-col :span="5">
            <div class="avatarBox">
              <div v-show="!!(editForm.supplierLicense)" class="avatar">
                <img :src="editForm.supplierLicense">
                <span class="mask">
                  <span class="mask-icon1" @click="preview(2)"><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click="deleteImg(2,editForm.supplierLicense)"><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <el-upload
                  class="avatar-uploader"
                  action="http://106.75.154.40:9011/suppliesinfo/addPic"
                  :show-file-list="false"
                  :on-success="addSuccess2"
                  :before-upload="beforeAdd"
                  v-show="!(editForm.supplierLicense)">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">农资照片</el-col>
          <el-col :span="5">
            <div class="avatarBox">
              <div v-show="!!(editForm.suppliesPic)" class="avatar">
                <img :src="editForm.suppliesPic">
                <span class="mask">
                  <span class="mask-icon1" @click="preview(3)"><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click="deleteImg(3,editForm.suppliesPic)"><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <el-upload
                  class="avatar-uploader"
                  action="http://106.75.154.40:9011/suppliesinfo/addPic"
                  :show-file-list="false"
                  :on-success="addSuccess3"
                  :before-upload="beforeAdd"
                  v-show="!(editForm.suppliesPic)">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-button @click="editSuppliesInfo">确定</el-button>
      <el-button @click="cancelEdit">取消</el-button>
    </el-dialog>
    <!-- 放大图片 -->
    <el-dialog :visible.sync="isPreview">
      <img :src="previewImg" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Suppliesinfo',
  data() {
    return {
      // 分页
      pageInfo: {
        pagenum: 1,
        pagesize: 4
      },
      // 是否放大
      isPreview: false,
      // 放大图片路径
      previewImg: '',
      // 基地id
      baseId: this.defines.baseId,
      // 农资来源信息
      suppliesInfo: [],
      // 总条数
      total: 0,
      // 是否显示添加弹窗
      isShowAdd: false,
      // 是否显示编辑弹窗
      isShowEdit: false,
      // 用于存放人员信息
      personInfoList: [],
      // 添加信息表单
      addForm: {
        // 农资名称
        suppliesName: '',
        // 生产日期
        productDate: '',
        // 保质期
        shelfDate: '',
        // 检验人
        inspector: '',
        // 供应商名称
        supplierName: '',
        // 供应商地址
        supplierAddr: '',
        // 供应商电话
        supplierPhone: '',
        // 供应商生产许可证
        supplierLicense: '',
        // 农资照片
        suppliesPic: ''
      },
      // 修改信息弹窗
      editForm: {
        // 农资名称
        suppliesName: '',
        // 生产日期
        productDate: '',
        // 保质期
        shelfDate: '',
        // 检验人
        inspector: '',
        // 供应商名称
        supplierName: '',
        // 供应商地址
        supplierAddr: '',
        // 供应商电话
        supplierPhone: '',
        // 供应商生产许可证
        supplierLicense: '',
        // 农资照片
        suppliesPic: ''
      },
      // 修改id
      suppliesinfoId: '',
      // 检验规则
      rules: {
        suppliesName: [
          { required: true, message: '请输入农资名称', trigger: 'blur' }
        ],
        productDate: [
          { required: true, message: '请输入生产日期', trigger: 'blur' }
        ],
        shelfDate: [
          { required: true, message: '请输入保质期', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        inspector: [
          { required: true, message: '请输入检验人名称', trigger: 'blur' }
        ],
        supplierPhone: [
          { required: true, message: '请输入供应商电话', trigger: 'blur' },
          { min: 8, max: 11, message: '长度在 8 到 11 个字符', trigger: 'blur' }
        ],
        supplierAddr: [
          { required: true, message: '请输入供应商地址', trigger: 'blur' }
        ]
      }
    }
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
    // 确认修改信息
    editSuppliesInfo() {
      // 进行表单验证
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        // 生产日期转化
        var prodate = new Date(this.editForm.productDate)
        this.editForm.productDate = `${prodate.getFullYear()}-${prodate.getMonth() +
          1}-${prodate.getDate()} ${prodate.getHours()}:${prodate.getMinutes()}:${prodate.getSeconds()}`
        // 保质期转化
        var shelfdate = new Date(this.editForm.shelfDate)
        this.editForm.shelfDate = `${shelfdate.getFullYear()}-${shelfdate.getMonth() +
          1}-${shelfdate.getDate()} ${shelfdate.getHours()}:${shelfdate.getMinutes()}:${shelfdate.getSeconds()}`
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const { data: res } = await this.$http.put(`/suppliesinfo/${this.suppliesinfoId}`, this.editForm)
        if (res.code !== 20000) {
          loading.close()
          return this.$message.error('修改农资信息失败！！')
        }
        loading.close()
        this.$message.success('修改农资信息成功！！')
        this.getSuppliesInfo()
        this.isShowEdit = false
      })
    },
    // 修改农资信息
    handleEdit(row) {
      console.log(row)
      this.isShowEdit = true
      this.editForm.suppliesName = row.suppliesName
      this.editForm.productDate = row.productDate
      this.editForm.shelfDate = row.shelfDate
      this.editForm.inspector = row.inspector
      this.editForm.supplierName = row.supplierName
      this.editForm.supplierAddr = row.supplierAddr
      this.editForm.supplierPhone = row.supplierPhone
      this.editForm.supplierLicense = row.supplierLicense
      this.editForm.suppliesPic = row.suppliesPic
      this.editForm.baseId = this.baseId
      this.suppliesinfoId = row.id
    },
    // 删除农资信息
    async handleDelete(row) {
      // console.log(row)
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该农资信息, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `suppliesinfo/${row.id}`
      )
      if (res.code !== 20000) return this.$message.error('删除失败！！')
      this.$message.success('删除成功！！')
      this.deleteImg(0, row.supplierLicense)
      this.deleteImg(1, row.suppliesPic)
      this.getSuppliesInfo()
    },
    // 查看资料放大图片
    previewInfo(src) {
      this.isPreview = true
      this.previewImg = src
    },
    // 放大图片
    preview(num) {
      this.isPreview = true
      switch (num) {
        case 0:
          this.previewImg = this.addForm.supplierLicense
          break
        case 1:
          this.previewImg = this.addForm.suppliesPic
          break
        case 2:
          this.previewImg = this.editForm.supplierLicense
          break
        case 3:
          this.previewImg = this.editForm.suppliesPic
          break
      }
    },
    // 修改当前页数
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getSuppliesInfo()
    },
    // 修改当前条数/页
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getSuppliesInfo()
    },
    // 删除图片
    deleteImg(num, url) {
      if (num === 0) {
        this.addForm.supplierLicense = ''
      } else if (num === 1) {
        this.addForm.suppliesPic = ''
      } else if (num === 2) {
        this.editForm.supplierLicense = ''
      } else if (num === 3) {
        this.editForm.suppliesPic = ''
      }
      $.ajax({
        url: 'http://106.75.154.40:9011/suppliesinfo/delPic',
        type: 'POST',
        data: {
          _method: 'DELETE',
          delUrl: url
        },
        success: function(data) {
          console.log(data)
        }
      })
      this.$message.success('图片删除成功！！')
    },
    // 许可证图片上传成功函数
    addSuccess(res, file) {
      this.addForm.supplierLicense = res.data
    },
    // 农资图片上传成功函数
    addSuccess1(res, file) {
      this.addForm.suppliesPic = res.data
      this.$message.success('图片上传成功！！')
    },
    // 农资图片修改成功函数
    addSuccess2(res, file) {
      this.editForm.supplierLicense = res.data
      this.$message.success('图片修改成功！！')
    },
    // 农资图片修改成功函数
    addSuccess3(res, file) {
      this.editForm.suppliesPic = res.data
      this.$message.success('图片修改成功！！')
    },
    // 图片上传前判断
    beforeAdd(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 获取农资来源信息
    async getSuppliesInfo() {
      const { data: res } = await this.$http.post(
        `/suppliesinfo/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      if (res.code !== 20000) return this.$message.error('获取信息失败！！')
      console.log(res)
      this.total = res.data.total
      this.suppliesInfo = res.data.rows
    },
    // 显示添加信息弹窗
    showAdd() {
      this.isShowAdd = true
    },
    // 隐藏添加信息弹窗
    cancelAdd() {
      this.isShowAdd = false
    },
    // 取消修改信息
    cancelEdit() {
      this.isShowEdit = false
    },
    // 添加农资产品信息
    addSuppliesInfo() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 生产日期转化
        var prodate = new Date(this.addForm.productDate)
        this.addForm.productDate = `${prodate.getFullYear()}-${prodate.getMonth() +
          1}-${prodate.getDate()} ${prodate.getHours()}:${prodate.getMinutes()}:${prodate.getSeconds()}`
        // 保质期转化
        var shelfdate = new Date(this.addForm.shelfDate)
        this.addForm.shelfDate = `${shelfdate.getFullYear()}-${shelfdate.getMonth() +
          1}-${shelfdate.getDate()} ${shelfdate.getHours()}:${shelfdate.getMinutes()}:${shelfdate.getSeconds()}`
        this.addForm.baseId = this.baseId
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        console.log(this.addForm)
        const { data: res } = await this.$http.post('/suppliesinfo', this.addForm)
        if (res.code !== 20000) {
          loading.close()
          return this.$message.error('添加产品信息失败！！')
        }
        loading.close()
        this.$message.success('添加产品信息成功！！')
        // 刷新列表
        this.getSuppliesInfo()
        this.isShowAdd = false
      })
    },
    // 监听添加弹窗关闭事件
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addForm.resetFields()
      this.addForm.supplierLicense = ''
      this.addForm.suppliesPic = ''
    },
    // 监听添加弹窗关闭事件
    editDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.editForm.resetFields()
      this.editForm.supplierLicense = ''
      this.editForm.suppliesPic = ''
      this.suppliesinfoId = ''
    }
  },
  mounted() {
    this.getSuppliesInfo()
    this.getPersonInfoList()
  }
}
</script>

<style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatarBox {
      position: relative;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
    }
    .mask-icon1, .mask-icon2{
        display: none;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
    }
  }
  .avatar:hover .mask {
    position: absolute;
    width: 178px;
    height: 178px;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 10;
    border-radius: 6px;
  }
  .avatar:hover .mask-icon1{
    display: block;
    position:absolute;
    top: 62px;
    left:45px;
  }
  .avatar:hover .mask-icon2{
    display: block;
    position:absolute;
    top: 62px;
    left:95px;
  }
  .mask-icon1:hover, .mask-icon2:hover{
    color: rgb(165, 163, 163);
  }
</style>
