<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>监控设备</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-s-custom"></i>
          <span>设备管理</span>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAdd()" style="margin-left:930px">添加设备</el-button>
        </el-col>
      </el-row>

      <!-- 设备列表区域 -->
      <el-table :data="deviceList" border stripe>
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="baseName" label="基地名称"></el-table-column>
        <el-table-column prop="monitoringLocation" label="摄像头监控位置"></el-table-column>
        <el-table-column prop="createBy" label="创建者"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="deviceSerial" label="设备序列号"></el-table-column>
        <el-table-column prop="validateCode" label="设备验证码"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="溯源开关">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-switch
              v-model="scope.row.switch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeCode(scope.row.id,scope.row.statusCode)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="删除">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <!-- type="danger": 红色警告按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeDeviceById(scope.row.id)"
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

    <!-- 添加的对话框 -->
    <el-dialog title="添加设备" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addeForm" :rules="addeFormRules" ref="addeFormRef" label-width="120px">
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
        <el-form-item label="基地名称" prop="baseName">
          <el-input v-model="addeForm.baseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="摄像头监控位置" prop="monitoringLocation">
          <el-input v-model="addeForm.monitoringLocation"></el-input>
        </el-form-item>
        <el-form-item label="设备序列号" prop="deviceSerial">
          <el-input v-model="addeForm.deviceSerial"></el-input>
        </el-form-item>
        <el-form-item label="设备验证码" prop="validateCode">
          <el-input v-model="addeForm.validateCode"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDevice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4,
      },

      // 总条数
      total: 1,

      // 用于存放设备信息
      deviceList: [],

      // 控制添加设备对话框的显示与隐藏
      addDialogVisible: false,

      // 控制修改设备信息对话框的显示和隐藏
      editDialogVisible: false,

      // 添加表单数据
      addeForm: {
        baseId: this.defines.baseId,
        baseName: '',
        monitoringLocation: '',
        createBy: '',
        deviceSerial: '',
        validateCode: '',
        statusCode: '1',
      },

      // 添加表单的验证规则对象
      addeFormRules: {
        monitoringLocation: [
          { required: true, message: '请输入位置', trigger: 'blur' },
        ],
        deviceSerial: [
          { required: true, message: '请输入序列号', trigger: 'blur' },
        ],
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getBaseName()
    this.getDeviceList(this.pageInfo.pagenum, this.pageInfo.pagesize)
  },
  methods: {
    async changeCode(id, status) {
      status == 1 ? (status = 0) : (status = 1);
      let { data: res } = await axios.get(
        `http://120.79.63.74:9004/monitor/modify/${id}/${status}`
      )
      if (res.code != 20000) {
        this.$message.error(res.message)
      }
      this.getDeviceList()
    },
    // 打开添加设备对话框
    showAdd() {
      this.addDialogVisible = true
    },
    // 设置添加对话框的options
    async getBaseName() {
      let { data: res } = await axios.get(
        `http://120.78.14.141:9011/base/${this.addeForm.baseId}`
      )
      if (res.code == 20000) {
        res = res.data
        this.addeForm.baseName = res.baseName
        this.addeForm.createBy = res.createBy
      } else {
        this.$message.error(res.message)
      }
    },
    // 获取该基地的所有设备信息(等梓涵师兄接口做好)
    async getDeviceList() {
      let { data: res } = await axios.post(
        `http://120.79.63.74:9004/monitor/${this.defines.baseId}/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`
      )
      if (res.code == 20000) {
        res = res.data
        this.deviceList = res.rows
        this.deviceList.forEach((item, index, deviceList) => {
          switch (parseInt(item.statusCode)) {
            case 0:
              deviceList[index].status = '停用'
              deviceList[index].switch = false
              break
            case 1:
              deviceList[index].status = '启用'
              deviceList[index].switch = true
              break
          }
          deviceList[index].createDate = this.formatTime(item.createDate)
        })
        this.total = res.total
      } else {
        this.$message.error(res.message)
      }
    },

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getDeviceList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getDeviceList()
    },

    // 监听添加对话框的关闭事件,关闭时对表单进行重置
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addeFormRef.resetFields()
    },

    // 点击按钮，添加
    addDevice() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async (valid) => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加设备的网络请求
        const { data: res } = await axios.post(
          'http://120.79.63.74:9004/monitor/add',
          this.addeForm
        )
        if (res.code !== 20000) {
          return this.$message.error(res.message)
        }
        this.$message.success('添加设备成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getDeviceList()
      })
    },

    // 根据删除
    async removeDeviceById(id) {
      console.log(id)
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该设备, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
        // .catch 用于捕获错误返回给confirmResult
      ).catch((err) => {
        return err
      })
      // 如果确认删除，则返回值为字符串 confirm
      // 如果取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await axios.delete(
        `http://120.79.63.74:9004/monitor/${id}`
      )
      if (res.code !== 20000) {
        return this.$message.error('删除设备失败')
      }
      this.$message.success('删除设备成功！！')
      this.getDeviceList()
    },
    // 格式化时间
    formatTime(date) {
      //date是传入的时间
      const d = new Date(date)
      const month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      const times =
        d.getFullYear() +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        min +
        ':' +
        sec
      return times
    },
  },
}
</script>

<style lang="less" scoped></style>
