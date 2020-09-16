<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>养殖生产</el-breadcrumb-item>
      <el-breadcrumb-item>加工信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-d-arrow-right"></i>
          <span>加工信息</span>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="processingDialogVisible = true"
            style="margin-left:850px"
            >添加工艺</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="returnPlant" style="margin-left:750px"
            >返回</el-button
          >
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="processingList" border stripe>
        >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="170px">
              <el-form-item label="工艺名称" class="down-label">
                <span>{{ props.row.processName }}</span>
              </el-form-item>
              <el-form-item label="负责人" class="down-label">
                <span>{{ props.row.responsible }}</span>
              </el-form-item>
              <el-form-item label="进行时间" class="down-label">
                <span>{{ props.row.onTime }}</span>
              </el-form-item>
              <el-form-item label="工艺步骤" class="down-label">
                <span>{{ props.row.step }}</span>
              </el-form-item>
              <el-form-item label="工艺描述" class="down-label">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="工艺图片" class="down-label">
                <div class="downBox">
                  <img :src="props.row.processPic" alt="" />
                  <span class="mask">
                    <span
                      class="mask-icon1"
                      @click="previewInfo(props.row.processPic)"
                      ><i class="el-icon-zoom-in"></i
                    ></span>
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="processName" label="工艺名称"></el-table-column>
        <el-table-column prop="responsible" label="责任人"></el-table-column>
        <el-table-column prop="onTime" label="进行时间"></el-table-column>
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
              @click="removeProcessingById(scope.row.id)"
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

    <!-- 添加的面板 -->
    <el-dialog
      title="添加工艺"
      :visible.sync="processingDialogVisible"
      width="25%"
      @close="processingDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="processingForm"
        :rules="processingFormRules"
        ref="processingFormRef"
        label-width="100px"
      >
        <el-form-item label="工艺名称" prop="processName">
          <el-input v-model="processingForm.processName"></el-input>
        </el-form-item>
        <el-form-item label="责任人" prop="responsible">
          <el-select v-model="processingForm.responsible" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进行时间" prop="onTime">
          <el-date-picker
            v-model="processingForm.onTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工艺图片">
          <!-- 回显 -->
          <div v-show="!!processingForm.processPic" class="avatar">
            <img :src="processingForm.processPic" />
            <span class="mask">
              <!-- 放大图片 -->
              <span
                class="mask-icon1"
                @click="preview(processingForm.processPic)"
                ><i class="el-icon-zoom-in"></i
              ></span>
              <!-- 删除图片 -->
              <span
                class="mask-icon2"
                @click="deleteImg(processingForm.processPic)"
                ><i class="el-icon-delete"></i
              ></span>
            </span>
          </div>
          <el-upload
            class="avatar-uploader"
            action="http://120.78.14.141:9011/processing/addPic"
            :show-file-list="false"
            :on-success="addSuccess"
            :before-upload="beforeAdd"
            v-show="!processingForm.processPic"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="工艺步骤" prop="step">
          <el-input type="textarea" v-model="processingForm.step"></el-input>
        </el-form-item>
        <el-form-item label="工艺描述" prop="description">
          <el-input
            type="textarea"
            v-model="processingForm.description"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="processingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProcessing">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改信息的面板 -->
    <el-dialog
      title="修改工艺信息"
      :visible.sync="aditDialogVisible"
      width="25%"
      @close="aditDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="130px"
      >
        <el-form-item label="工艺名称" prop="processName">
          <el-input v-model="editForm.processName"></el-input>
        </el-form-item>
        <el-form-item label="责任人" prop="responsible">
          <el-select v-model="editForm.responsible" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进行时间" prop="onTime">
          <el-date-picker
            v-model="editForm.onTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工艺图片">
          <!-- 回显 -->
          <div v-show="!!editForm.processPic" class="avatar">
            <img :src="editForm.processPic" />
            <span class="mask">
              <!-- 放大图片 -->
              <span class="mask-icon1" @click="preview(editForm.processPic)"
                ><i class="el-icon-zoom-in"></i
              ></span>
              <!-- 删除图片 -->
              <span class="mask-icon2" @click="deleteImg(editForm.processPic)"
                ><i class="el-icon-delete"></i
              ></span>
            </span>
          </div>
          <el-upload
            class="avatar-uploader"
            action="http://120.78.14.141:9011/processing/addPic"
            :show-file-list="false"
            :on-success="editSuccess"
            :before-upload="beforeAdd"
            v-show="!editForm.processPic"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="工艺步骤" prop="step">
          <el-input type="textarea" v-model="editForm.step"></el-input>
        </el-form-item>
        <el-form-item label="工艺描述" prop="description">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProcessingFarming"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 放大图片 -->
    <el-dialog :visible.sync="isPreview">
      <img :src="previewImg" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
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

      // 放大图片路径
      previewImg: '',

      // 人员信息
      personInfoList: [],

      // 控制添加面板的显示和隐藏
      processingDialogVisible: false,

      // 控制修改面板的显示和隐藏
      aditDialogVisible: false,

      // 控制放大面板的显示和隐藏
      isPreview: false,

      // 添加的验证规则对象
      processingFormRules: {
        processName: [
          { required: true, message: '请输入工艺名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '工艺名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        responsible: [
          { required: true, message: '请输入责任人', trigger: 'blur' }
        ],
        step: [{ required: true, message: '请输入工艺步骤', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入工艺描述', trigger: 'blur' }
        ],
        onTime: [{ required: true, message: '请输入进行时间', trigger: 'blur' }]
      },

      // 修改的验证规则对象
      editFormRules: {
        processName: [
          { required: true, message: '请输入工艺名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '工艺名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        responsible: [
          { required: true, message: '请输入责任人', trigger: 'blur' }
        ],
        step: [{ required: true, message: '请输入工艺步骤', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入工艺描述', trigger: 'blur' }
        ],
        onTime: [{ required: true, message: '请输入进行时间', trigger: 'blur' }]
      },

      // 列表数据
      processingList: [],

      // 添加表单数据
      processingForm: {
        processName: '',
        responsible: '',
        step: '',
        description: '',
        onTime: '',
        processPic: '',
        plantId: ''
      },

      // 查询到的工艺信息对象，用于修改工艺信息
      editForm: {}
    }
  },
  created() {
    this.getProcessingList()
    this.getPersonInfoList()
  },
  methods: {
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getProcessingList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getProcessingList()
    },

    //  返回
    returnPlant() {
      this.$router.push('/Plant')
    },

    // 查看资料放大图片
    previewInfo(src) {
      this.isPreview = true
      this.previewImg = src
    },

    // 放大图片
    preview(processPic) {
      this.isPreview = true
      this.previewImg = processPic
    },

    // 删除图片
    deleteImg(url) {
      this.processingForm.processPic = ''
      this.editForm.processPic = ''
      $.ajax({
        url: 'http://120.78.14.141:9011//processing/delPic',
        type: 'POST',
        data: {
          _method: 'DELETE',
          delUrl: url
        }
      })
      this.$message.success('图片删除成功！！')
    },

    // 添加图片上传成功函数
    addSuccess(res, file) {
      this.processingForm.processPic = res.data
    },

    // 修改图片上传成功函数
    editSuccess(res, file) {
      this.editForm.processPic = res.data
    },

    // 图片上传前判断
    beforeAdd(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },

    // 监听添加对话框的关闭事件,关闭时对表单进行重置
    processingDialogClosed() {
      this.$refs.processingFormRef.resetFields()
      this.processingForm.processPic = ''
    },

    // 监听修改对话框的关闭事件,关闭时对表单进行重置
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

    // 获取列表
    async getProcessingList() {
      const { data: res } = await this.$http.post(
        `/processing/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          plantId: this.$route.query.plantId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取加工信息列表失败！！')
      }
      this.processingList = res.data.rows
      this.total = res.data.total
    },

    // 点击按钮，添加工艺
    addProcessing() {
      // 先进行表单的预校验
      this.$refs.processingFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        console.log(this.processingForm.onTime)
        var date = new Date(this.processingForm.onTime)
        this.processingForm.onTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        console.log(this.processingForm.onTime)
        this.processingForm.plantId = this.$route.query.plantId
        const { data: res } = await this.$http.post(
          '/processing',
          this.processingForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('添加工艺失败！！')
        }
        this.$message.success('添加工艺成功!!')
        // 隐藏添加的对话框
        this.processingDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getProcessingList()
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/processing/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该工艺信息失败！！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.aditDialogVisible = true
    },

    // 修改信息并提交
    editProcessingFarming() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改信息的请求
        // 转化时间为标准形式
        if (this.editForm.onTime !== null) {
          var date = new Date(this.editForm.onTime)
          this.editForm.onTime = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        console.log(this.editForm)
        const { data: res } = await this.$http.put(
          '/processing/' + this.editForm.id,
          this.editForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新改加工信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        // 刷新列表
        this.getProcessingList()
        // 提示修改成功
        this.$message.success('更新该加工信息成功！！')
      })
    },

    // 根据删除
    async removeProcessingById(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该工艺信息, 是否继续?',
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
      const { data: res } = await this.$http.delete('/processing/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功！！')
      this.getProcessingList()
    }
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
  border-color: #409eff;
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
  .mask-icon1,
  .mask-icon2 {
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
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  border-radius: 6px;
}
.avatar:hover .mask-icon1 {
  display: block;
  position: absolute;
  top: 62px;
  left: 45px;
}
.avatar:hover .mask-icon2 {
  display: block;
  position: absolute;
  top: 62px;
  left: 95px;
}
.mask-icon1:hover,
.mask-icon2:hover {
  color: rgb(165, 163, 163);
}
</style>
