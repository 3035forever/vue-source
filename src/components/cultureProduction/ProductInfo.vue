<template>
  <div id="product-info">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>养殖生产</el-breadcrumb-item>
      <el-breadcrumb-item>产品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-notebook-1"></i>
          <span>产品信息</span>
        </el-col>
        <el-col :span="2" style="margin-left:905px">
          <el-button type="info" @click="showAdd">添加产品信息</el-button>
        </el-col>
      </el-row>
      <el-table :data="proInfo" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="170px">
              <el-form-item label="产品名称" class="down-label">
                <span>{{ props.row.productName }}</span>
              </el-form-item>
              <el-form-item label="产品 ID" class="down-label">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="产品描述" class="down-label">
                <span>{{ props.row.productInfo }}</span>
              </el-form-item>
              <el-form-item label="质检部门检验报告" class="down-label">
                <div class="downBox">
                  <img :src="props.row.inspectionReport" alt="" />
                  <span class="mask">
                    <span
                      class="mask-icon1"
                      @click="previewInfo(props.row.inspectionReport)"
                      ><i class="el-icon-zoom-in"></i
                    ></span>
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="质量管理体系认证书" class="down-label">
                <div class="downBox">
                  <img :src="props.row.qualityCertificate" alt="" />
                  <span class="mask">
                    <span
                      class="mask-icon1"
                      @click="previewInfo(props.row.qualityCertificate)"
                      ><i class="el-icon-zoom-in"></i
                    ></span>
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="食品安全管理体系认证书" class="down-label">
                <div class="downBox">
                  <img :src="props.row.safetyCertificate" alt="" />
                  <span class="mask">
                    <span
                      class="mask-icon1"
                      @click="previewInfo(props.row.safetyCertificate)"
                      ><i class="el-icon-zoom-in"></i
                    ></span>
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="产品生产许可证" class="down-label">
                <div class="downBox">
                  <img :src="props.row.license" alt="" />
                  <span class="mask">
                    <span
                      class="mask-icon1"
                      @click="previewInfo(props.row.license)"
                      ><i class="el-icon-zoom-in"></i
                    ></span>
                  </span>
                </div>
              </el-form-item>
              <el-form-item label="采用标准" class="down-label">
                <div class="downBox">
                  <img :src="props.row.standard" alt="" />
                  <span class="mask">
                    <span
                      class="mask-icon1"
                      @click="previewInfo(props.row.standard)"
                      ><i class="el-icon-zoom-in"></i
                    ></span>
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="260"> </el-table-column>
        <el-table-column label="产品 ID" prop="id" width="410">
        </el-table-column>
        <el-table-column label="产品名称" prop="productName" width="374">
        </el-table-column>
        <el-table-column label="操作" width="143">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
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
    <!-- 添加产品信息对话框 -->
    <el-dialog
      title="添加产品信息"
      :visible.sync="isShowAdd"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form v-model="proInfo" label-width="90px" label-position="left">
        <el-form-item label="产品名称">
          <el-input
            placeholder="请输入产品名称"
            style="width:50%"
            v-model="temImgPath.productName"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品信息">
          <el-input
            placeholder="请输入产品信息"
            type="textarea"
            rows="5"
            v-model="temImgPath.productInfo"
          ></el-input>
        </el-form-item>
        <el-form-item label="质检部门检验报告" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!temImgPath.inspection.path">
              <img :src="temImgPath.inspection.path" />
              <span class="mask">
                <span class="mask-icon1" @click="preview(0)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
                <span class="mask-icon2" @click="deleteImg(0)"
                  ><i class="el-icon-delete"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon" v-show="!temImgPath.inspection.path">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    upImg(file, fileList, 'inspection')
                  }
                "
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="质量管理体系认证书" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!temImgPath.quality.path">
              <img :src="temImgPath.quality.path" />
              <span class="mask">
                <span class="mask-icon1" @click="preview(1)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
                <span class="mask-icon2" @click="deleteImg(1)"
                  ><i class="el-icon-delete"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon" v-show="!temImgPath.quality.path">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    upImg(file, fileList, 'quality')
                  }
                "
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="食品安全管理体系认证书" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!temImgPath.safety.path">
              <img :src="temImgPath.safety.path" />
              <span class="mask">
                <span class="mask-icon1" @click="preview(2)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
                <span class="mask-icon2" @click="deleteImg(2)"
                  ><i class="el-icon-delete"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon" v-show="!temImgPath.safety.path">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    upImg(file, fileList, 'safety')
                  }
                "
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="产品生存许可证" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!temImgPath.licensePic.path">
              <img :src="temImgPath.licensePic.path" />
              <span class="mask">
                <span class="mask-icon1" @click="preview(3)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
                <span class="mask-icon2" @click="deleteImg(3)"
                  ><i class="el-icon-delete"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon" v-show="!temImgPath.licensePic.path">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    upImg(file, fileList, 'licensePic')
                  }
                "
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="采用标准" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!temImgPath.standardPic.path">
              <img :src="temImgPath.standardPic.path" />
              <span class="mask">
                <span class="mask-icon1" @click="preview(4)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
                <span class="mask-icon2" @click="deleteImg(4)"
                  ><i class="el-icon-delete"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon" v-show="!temImgPath.standardPic.path">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    upImg(file, fileList, 'standardPic')
                  }
                "
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="addProInfo">确定</el-button>
      <el-button @click="cancelAdd">取消</el-button>
    </el-dialog>
    <!-- 编辑信息对话框 -->
    <el-dialog
      title="编辑产品信息"
      :visible.sync="isShowEdit"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form v-model="proInfo" label-width="90px" label-position="left">
        <el-form-item label="产品名称">
          <el-input
            placeholder="请输入产品名称"
            style="width:50%"
            v-model="editPath.productName"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品信息">
          <el-input
            placeholder="请输入产品信息"
            type="textarea"
            rows="5"
            v-model="editPath.productInfo"
          ></el-input>
        </el-form-item>
        <el-form-item label="质检部门检验报告" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!editPath.inspection.path">
              <img :src="editPath.inspection.path" />
              <span class="mask">
                <span
                  class="mask-icon3"
                  @click="previewInfo(editPath.inspection.path)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    editImg(file, fileList, 'inspection')
                  }
                "
              >
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="质量管理体系认证书" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!editPath.quality.path">
              <img :src="editPath.quality.path" />
              <span class="mask">
                <span
                  class="mask-icon3"
                  @click="previewInfo(editPath.quality.path)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    editImg(file, fileList, 'quality')
                  }
                "
              >
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="食品安全管理体系认证书" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!editPath.safety.path">
              <img :src="editPath.safety.path" />
              <span class="mask">
                <span
                  class="mask-icon3"
                  @click="previewInfo(editPath.safety.path)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    editImg(file, fileList, 'safety')
                  }
                "
              >
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="产品生存许可证" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!editPath.licensePic.path">
              <img :src="editPath.licensePic.path" />
              <span class="mask">
                <span
                  class="mask-icon3"
                  @click="previewInfo(editPath.licensePic.path)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    editImg(file, fileList, 'licensePic')
                  }
                "
              >
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="采用标准" label-width="170px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!editPath.standardPic.path">
              <img :src="editPath.standardPic.path" />
              <span class="mask">
                <span
                  class="mask-icon3"
                  @click="previewInfo(editPath.standardPic.path)"
                  ><i class="el-icon-zoom-in"></i
                ></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload
                :show-file-list="false"
                action="none"
                :auto-upload="false"
                :on-change="
                  function upchange(file, fileList) {
                    editImg(file, fileList, 'standardPic')
                  }
                "
              >
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-button @click="editProInfo">确定</el-button>
      <el-button @click="cancelEdit">取消</el-button>
    </el-dialog>
    <!-- 放大图片 -->
    <el-dialog :visible.sync="isPreview">
      <img :src="previewImg" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProductInfo',
  data() {
    return {
      // 基地id
      baseId: this.defines.baseId,
      // 产品信息
      proInfo: [],
      // 总条数
      total: 0,
      // 是否显示产品信息对话框，默认false
      isShowAdd: false,
      // 是否放大图片
      isPreview: false,
      // 是否显示编辑信息
      isShowEdit: false,
      // 分页
      pageInfo: {
        pagenum: 1,
        pagesize: 4
      },
      // 回显图片路径
      temImgPath: {
        productName: '',
        productInfo: '',
        inspection: {
          file: null,
          path: ''
        },
        quality: {
          file: null,
          path: ''
        },
        safety: {
          file: null,
          path: ''
        },
        licensePic: {
          file: null,
          path: ''
        },
        standardPic: {
          file: null,
          path: ''
        }
      },
      // 编辑信息存储
      editPath: {
        productName: '',
        productInfo: '',
        inspection: {
          file: null,
          path: ''
        },
        quality: {
          file: null,
          path: ''
        },
        safety: {
          file: null,
          path: ''
        },
        licensePic: {
          file: null,
          path: ''
        },
        standardPic: {
          file: null,
          path: ''
        }
      },
      // 放大图片
      previewImg: '',
      // 当前点击编辑的产品信息id
      qulificationId: ''
    }
  },
  methods: {
    // 查看资料放大图片
    previewInfo(src) {
      this.isPreview = true
      this.previewImg = src
    },
    // 取消添加
    cancelAdd() {
      this.isShowAdd = false
      this.temImgPath.inspection.path = ''
      this.temImgPath.quality.path = ''
      this.temImgPath.safety.path = ''
      this.temImgPath.licensePic.path = ''
      this.temImgPath.standardPic.path = ''
    },
    // 删除图片
    deleteImg(num) {
      switch (num) {
        case 0:
          this.temImgPath.inspection.path = ''
          break
        case 1:
          this.temImgPath.quality.path = ''
          break
        case 2:
          this.temImgPath.safety.path = ''
          break
        case 3:
          this.temImgPath.licensePic.path = ''
          break
        case 4:
          this.temImgPath.standardPic.path = ''
          break
      }
    },
    // 放大图片
    preview(num) {
      this.isPreview = true
      switch (num) {
        case 0:
          this.previewImg = this.temImgPath.inspection.path
          break
        case 1:
          this.previewImg = this.temImgPath.quality.path
          break
        case 2:
          this.previewImg = this.temImgPath.safety.path
          break
        case 3:
          this.previewImg = this.temImgPath.licensePic.path
          break
        case 4:
          this.previewImg = this.temImgPath.standardPic.path
          break
      }
    },
    // 修改当前页数
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getProInfo()
    },
    // 修改当前条数/页
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getProInfo()
    },
    handleEdit(row) {
      console.log(row)
      this.isShowEdit = true
      this.editPath.productName = row.productName
      this.editPath.productInfo = row.productInfo
      this.editPath.inspection.path = row.inspectionReport
      this.editPath.quality.path = row.qualityCertificate
      this.editPath.safety.path = row.safetyCertificate
      this.editPath.licensePic.path = row.license
      this.editPath.standardPic.path = row.standard
      this.qualificationId = row.id
    },
    // 删除产品信息
    handleDelete(row) {
      // console.log(row)
      this.$confirm('是否确认删除？', '提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: '放弃',
        confirmButtonText: '确认'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `qualification/${row.id}`
          )
          if (res.code !== 20000) return this.$message.error('删除失败！！')
          this.$message.success('删除成功！！')
          this.getProInfo()
        })
        .catch(() => {
          this.$message.info('放弃操作')
        })
    },
    // 上传图片事先赋值
    upImg(file, fileList, name) {
      // 判断图片大小，不能超过2M
      if (file.size / 1024 / 1024 > 1.0) {
        this.$message.error('上传图片大小不能超过1.0MB！！')
      }
      // console.log(file)
      if (name === 'inspection') {
        this.temImgPath.inspection.file = file.raw
        this.temImgPath.inspection.path = URL.createObjectURL(file.raw)
      } else if (name === 'quality') {
        this.temImgPath.quality.file = file.raw
        this.temImgPath.quality.path = URL.createObjectURL(file.raw)
      } else if (name === 'safety') {
        this.temImgPath.safety.file = file.raw
        this.temImgPath.safety.path = URL.createObjectURL(file.raw)
      } else if (name === 'licensePic') {
        this.temImgPath.licensePic.file = file.raw
        this.temImgPath.licensePic.path = URL.createObjectURL(file.raw)
      } else if (name === 'standardPic') {
        this.temImgPath.standardPic.file = file.raw
        this.temImgPath.standardPic.path = URL.createObjectURL(file.raw)
      }
    },
    // 修改图片事先赋值
    editImg(file, fileList, name) {
      // 判断图片大小，不能超过2M
      if (file.size / 1024 / 1024 > 1.0) {
        this.$message.error('上传图片大小不能超过1.0MB！！')
      }
      if (name === 'inspection') {
        this.editPath.inspection.file = file.raw
        this.editPath.inspection.path = URL.createObjectURL(file.raw)
      } else if (name === 'quality') {
        this.editPath.quality.file = file.raw
        this.editPath.quality.path = URL.createObjectURL(file.raw)
      } else if (name === 'safety') {
        this.editPath.safety.file = file.raw
        this.editPath.safety.path = URL.createObjectURL(file.raw)
      } else if (name === 'licensePic') {
        this.editPath.licensePic.file = file.raw
        this.editPath.licensePic.path = URL.createObjectURL(file.raw)
      } else if (name === 'standardPic') {
        this.editPath.standardPic.file = file.raw
        this.editPath.standardPic.path = URL.createObjectURL(file.raw)
      }
    },
    // 取消修改信息
    cancelEdit() {
      this.isShowEdit = false
    },
    // 确认修改
    async editProInfo() {
      // 新创建一个formdata
      const editInfo = new FormData()
      // 往formdata加值
      // 加入产品信息名字
      editInfo.append('productName', this.editPath.productName)
      // 加入产品介绍
      editInfo.append('productInfo', this.editPath.productInfo)
      // 加入产品各种执照图片
      editInfo.append('inspection', this.editPath.inspection.file)
      editInfo.append('quality', this.editPath.quality.file)
      editInfo.append('safety', this.editPath.safety.file)
      editInfo.append('licensePic', this.editPath.licensePic.file)
      editInfo.append('standardPic', this.editPath.standardPic.file)
      editInfo.append('baseId', this.baseId)
      // console.log(editInfo.get('inspection'))
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.post(
        `/qualification/${this.qualificationId}`,
        editInfo
      )
      if (res.code !== 20000) {
        loading.close()
        return this.$message.error('修改产品信息失败！！')
      }
      loading.close()
      this.$message.success('修改产品信息成功！！')
      // 刷新列表
      this.getProInfo()
      this.isShowEdit = false
    },
    // 显示修改弹窗
    showAdd() {
      this.isShowAdd = true
      this.temImgPath.productName = ''
      this.temImgPath.productInfo = ''
      this.temImgPath.inspection.path = ''
      this.temImgPath.quality.path = ''
      this.temImgPath.safety.path = ''
      this.temImgPath.licensePic.path = ''
      this.temImgPath.standardPic.path = ''
    },
    // 添加产品信息
    async addProInfo() {
      // 新创建一个formdata
      const addInfo = new FormData()
      // 往formdata加值
      // 加入产品信息名字
      addInfo.append('productName', this.temImgPath.productName)
      // 加入产品介绍
      addInfo.append('productInfo', this.temImgPath.productInfo)
      // 加入产品各种执照图片
      addInfo.append('inspection', this.temImgPath.inspection.file)
      addInfo.append('quality', this.temImgPath.quality.file)
      addInfo.append('safety', this.temImgPath.safety.file)
      addInfo.append('licensePic', this.temImgPath.licensePic.file)
      addInfo.append('standardPic', this.temImgPath.standardPic.file)
      addInfo.append('baseId', this.baseId)
      // console.log(addInfo.get('inspection'))
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // const { data: res } = axios.post('http://106.75.154.40:9011/qualification',addInfo)
      const { data: res } = await this.$http.post('http://106.75.154.40:9011/qualification', addInfo)
      if (res.code !== 20000) {
        loading.close()
        return this.$message.error('添加产品信息失败！！')
      }
      loading.close()
      this.$message.success('添加产品信息成功！！')
      // 刷新列表
      this.getProInfo()
      this.isShowAdd = false
    },
    // 获取产品信息
    async getProInfo() {
      const { data: res } = await this.$http.post(
        `/qualification/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      if (res.code !== 20000) return this.$message.error('获取产品信息失败！！')
      console.log(res)
      this.total = res.data.total
      this.proInfo = res.data.rows
    }
  },
  mounted() {
    this.getProInfo()
  }
}
</script>

<style lang="less">
.addBox {
  display: flex;
  flex-wrap: wrap;
}
.addBox-img {
  border: 1px solid rgb(70, 69, 69);
  border-radius: 4px;
  padding: 5px;
  width: 250px;
  height: 150px;
}
.addBox-img img {
  width: 100%;
  height: 100%;
}
.addBox-icon {
  border: 1px dashed rgb(80, 80, 80);
  height: 40px;
  width: 40px;
  text-align: center;
  border-radius: 4px;
  margin-left: 20px;
}
.addBox-img:hover .mask {
  position: absolute;
  width: 262px;
  height: 162px;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  border-radius: 4px;
}
.addBox-img .mask-icon1,
.addBox-img .mask-icon2,
.addBox-img .mask-icon3 {
  display: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
.addBox-img:hover .mask-icon1 {
  display: block;
  position: absolute;
  top: 62px;
  left: 95px;
}
.addBox-img:hover .mask-icon3 {
  display: block;
  position: absolute;
  top: 62px;
  left: 115px;
}
.mask-icon1:hover,
.mask-icon2:hover,
.mask-icon3:hover {
  color: rgb(165, 163, 163);
}
.addBox-img:hover .mask-icon2 {
  display: block;
  position: absolute;
  top: 62px;
  right: 95px;
}
.down-label {
  .el-form-item__label {
    color: #99a9bf;
    font-weight: bold;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.downBox {
  border: 1px solid rgb(163, 162, 162);
  border-radius: 4px;
  padding: 5px;
  margin-top: 13px;
  width: 220px;
  height: 160px;
}
.downBox:hover .mask {
  position: absolute;
  width: 220px;
  height: 160px;
  top: 13px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  border-radius: 4px;
}
.downBox .mask-icon1 {
  display: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
.downBox:hover .mask-icon1 {
  display: block;
  position: absolute;
  top: 62px;
  left: 95px;
}
.previewImg {
  width: 100%;
  height: 100%;
}
</style>
