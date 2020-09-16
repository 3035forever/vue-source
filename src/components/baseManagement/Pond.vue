<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>对虾管理</el-breadcrumb-item>
      <el-breadcrumb-item>池塘管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加池塘，建议卡区域 -->
      <el-row
        class="globalHeader"
        style="margin-bottom:20px;padding-bottom:45px"
      >
        <el-col :span="4">
          <i class="el-icon-receiving"></i>
          <span>池塘管理</span>
        </el-col>
        <el-col :span="4">
          <el-button
            type="info"
            @click="addDialogVisible = true"
            style="margin-left:930px"
            >添加池塘</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button
            type="success"
            @click="kindDialogVisible = true"
            style="margin-left:600px"
            >养殖建议卡</el-button
          >
        </el-col>
      </el-row>

      <!-- 池塘列表区域 -->
      <div class="bigBox">
        <div
          style="padding: 5px;margin-bottom: 10px;"
          v-for="item in pondList"
          :key="item.id"
          class="pondBody"
        >
          <table class="child">
            <tbody>
              <tr>
                <!-- 池塘名称显示区域 -->
                <td colspan="2" style="height: 30px">
                  <div style="color: #000; font-size: 20px;">
                    {{ item.pondName }}
                  </div>
                </td>
              </tr>
              <tr>
                <!-- 池塘图片显示区域 -->
                <td class="imgBox">
                  <img
                    src="../../assets/pond.jpg"
                    style="cursor: pointer"
                    @click="pondFInfo(item.id)"
                  />
                </td>
                <!-- 池塘信息显示区域 -->
                <td class="infoBox">
                  <p>池塘面积(m²)：{{ item.pondVolume }}</p>
                  <p v-show="item.deliveryStatus == 1 ? true : false">
                    投放尾数/尾：{{ item.inputNum }}
                  </p>
                  <p v-show="item.deliveryStatus == 1 ? true : false">
                    投放时间：{{ item.createDate }}
                  </p>
                  <p v-show="item.deliveryStatus == 1 ? true : false">
                    捕捞时间：{{ item.catchDate }}
                  </p>
                  <p v-show="item.deliveryStatus == 1 ? false : true">
                    投放状态：未投放
                  </p>
                </td>
              </tr>
              <tr class="btnBox">
                <td class="blank"></td>
                <td class="btnGround">
                  <!-- 捕捞按钮 -->
                  <el-tooltip
                    effect="dark"
                    content="捕捞"
                    placement="left"
                    :enterable="false"
                  >
                    <el-button
                      v-show="item.deliveryStatus == 1 ? true : false"
                      type="success"
                      icon="el-icon-wind-power"
                      size="mini"
                      @click="catchPondById(item.id)"
                    ></el-button>
                  </el-tooltip>
                  <!-- 投料按钮 -->
                  <el-tooltip
                    effect="dark"
                    content="投料"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      v-show="item.deliveryStatus == 1 ? true : false"
                      type="warning"
                      icon="el-icon-caret-bottom"
                      size="mini"
                      @click="farmPondById(item.id)"
                    ></el-button>
                  </el-tooltip>
                  <!-- 投苗按钮 -->
                  <el-tooltip
                    effect="dark"
                    content="投苗"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      v-show="item.deliveryStatus == 1 ? false : true"
                      type="success"
                      icon="el-icon-arrow-down"
                      size="mini"
                      @click="drogPondById(item.id)"
                    ></el-button>
                  </el-tooltip>
                  <!-- 修改按钮 -->
                  <el-button
                    type="info"
                    icon="el-icon-edit"
                    size="mini"
                    @click="
                      showEditDialog(item.id), getremainNumber(item.shrimpId)
                    "
                  ></el-button>
                  <!-- 删除按钮 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removePondById(item.id)"
                  ></el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[6, 9, 12, 16]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加池塘的面板 -->
    <el-dialog
      title="添加池塘"
      :visible.sync="addDialogVisible"
      width="21%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addeForm"
        :rules="addeFormRules"
        ref="addeFormRef"
        label-width="100px"
      >
        <el-form-item label="池塘名称" prop="pondName">
          <el-input v-model="addeForm.pondName"></el-input>
        </el-form-item>
        <el-form-item label="池塘面积m²" prop="pondVolume">
          <el-input-number
            v-model="addeForm.pondVolume"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPond">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改池塘的面板 -->
    <el-dialog
      title="修改池塘信息"
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
        <!-- ref:引用，指向本身，用于使用自身的方法 -->
        <el-form-item label="池塘名称" prop="pondName">
          <el-input v-model="editForm.pondName"></el-input>
        </el-form-item>
        <el-form-item label="池塘面积m²" prop="pondVolume">
          <el-input-number
            v-model="editForm.pondVolume"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="批次名称"
          prop="shrimpId"
          v-show="editForm.deliveryStatus == 1 ? true : false"
        >
          <el-select
            v-model="editForm.shrimpId"
            placeholder="请选择"
            @change="getremainNumber(editForm.shrimpId)"
          >
            <el-option
              v-for="item in shrimpManagement"
              :key="item.id"
              :label="item.shrimpBatchName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="该批次剩余尾数/尾"
          v-show="editForm.deliveryStatus == 1 ? true : false"
        >
          <el-input v-model="remainNumber" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="投放尾数/尾"
          prop="inputNum"
          v-show="editForm.deliveryStatus == 1 ? true : false"
        >
          <el-input-number
            v-model="editForm.inputNum"
            controls-position="right"
            :min="0"
            :max="remainNumber + constNum"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="投放时间"
          prop="createDate"
          v-show="editForm.deliveryStatus == 1 ? true : false"
        >
          <el-date-picker
            v-model="editForm.createDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 修改投放状态 -->
        <el-form-item
          label="投放状态"
          prop="deliveryStatus"
          v-show="editForm.deliveryStatus == 1 ? true : false"
        >
          <el-select
            v-model="editForm.deliveryStatus"
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="捕捞时间"
          prop="catchDate"
          v-show="editForm.deliveryStatus == 1 ? true : false"
        >
          <el-date-picker
            v-model="editForm.catchDate"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPondInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 投苗的面板 -->
    <el-dialog
      title="投苗"
      :visible.sync="drogDialogVisible"
      width="23%"
      @close="drogDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="drogForm"
        :rules="drogFormRules"
        ref="drogFormRef"
        label-width="100px"
      >
        <el-form-item label="批次名称" prop="shrimpId">
          <el-select
            v-model="drogForm.shrimpId"
            placeholder="请选择"
            @change="getremainNumber(drogForm.shrimpId)"
          >
            <el-option
              v-for="item in shrimpManagement"
              :key="item.id"
              :label="item.shrimpBatchName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余尾数/尾">
          <el-input v-model="remainNumber" disabled></el-input>
        </el-form-item>

        <el-form-item label="投放尾数/尾" prop="inputNum">
          <el-input-number
            v-model="drogForm.inputNum"
            controls-position="right"
            :min="1"
            :max="remainNumber"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="drogDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dropPond">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 投料的面板 -->
    <el-dialog
      title="投料"
      :visible.sync="farmDialogVisible"
      width="25%"
      @close="farmDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="farmForm"
        :rules="farmFormRules"
        ref="farmFormRef"
        label-width="100px"
      >
        <el-form-item label="农资名称" prop="suppliesInfoId">
          <el-select v-model="farmForm.suppliesInfoId" placeholder="请选择">
            <el-option
              v-for="item in suppliesName"
              :key="item.id"
              :label="item.suppliesName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作人" prop="applicator">
          <el-select v-model="farmForm.applicator" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作类别" prop="applyType">
          <el-select v-model="farmForm.applyType" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="投放量kg" prop="deliveryVolume">
          <el-input-number
            v-model="farmForm.deliveryVolume"
            controls-position="right"
            :min="0.01"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="farmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="farmPond">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 捕捞的面板 -->
    <el-dialog
      title="捕捞"
      :visible.sync="catchDialogVisible"
      width="25%"
      @close="catchDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="catchForm"
        :rules="catchFormRules"
        ref="catchFormRef"
        label-width="120px"
      >
        <el-form-item label="操作人" prop="people">
          <el-select v-model="catchForm.people" placeholder="请选择">
            <el-option
              v-for="item in personInfoList"
              :key="item.id"
              :value="item.personName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格（尾/kg）" prop="specification">
          <el-select v-model="catchForm.specification" placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.id"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产量kg" prop="yield">
          <el-input-number
            v-model="catchForm.yield"
            controls-position="right"
            :min="0.01"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="catchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="catchPond">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 建议卡：池塘信息输入的面板 -->
    <el-dialog
      title="池塘信息输入"
      :visible.sync="kindDialogVisible"
      width="21%"
      @close="kindDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="kindForm"
        :rules="kindFormRules"
        ref="kindFormRef"
        label-width="100px"
      >
        <el-form-item label="虾的品种" prop="kindName">
          <el-select v-model="kindForm.shrimpKindId" placeholder="请选择">
            <el-option
              v-for="item in ShrimpSpeciesList"
              :key="item.id"
              :label="item.kindName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="池塘面积m²" prop="pondVolume">
          <el-input-number
            v-model="kindForm.pondVolume"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="水深/m" prop="pondDeep">
          <el-input-number
            v-model="kindForm.pondDeep"
            controls-position="right"
            :min="0"
            :max="5"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="养殖方式">
          <el-select v-model="kindForm.shrimpMethod" placeholder="请选择">
            <el-option
              v-for="item in options4"
              :key="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="kindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="kindPond">确认</el-button>
      </span>
    </el-dialog>

    <!-- 建议卡信息面板 -->
    <el-dialog
      title="池塘信息输入"
      :visible.sync="suggestDialogVisible"
      width="55%"
    >
      <table class="dididi">
        <thead>
          <tr>
            <th>虾的品种</th>
            <th>盐度(%)</th>
            <th>最小投放尾数(尾)</th>
            <th>Ph值</th>
            <th>池塘面积(m²)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ suggest.kindName }}</td>
            <td>{{ suggest.salinity }}</td>
            <td>
              {{ suggest.minDensity * suggest.pondDeep * suggest.pondVolume }}
            </td>
            <td>{{ suggest.ph }}</td>
            <td>{{ suggest.pondVolume }}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>氨氮值(mg/L)</th>
            <th>适宜水温(℃)</th>
            <th>最大投放尾数(尾)</th>
            <th>溶解氧(mg/L)</th>
            <th>池塘深度(m)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ suggest.ammoniaValue }}</td>
            <td>
              {{ suggest.waterTemperature }}
            </td>
            <td>
              {{ suggest.maxDensity * suggest.pondDeep * suggest.pondVolume }}
            </td>
            <td>{{ suggest.dissolvedOxygen }}</td>
            <td>{{ suggest.pondDeep }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="suggestDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 基地编码
      baseId: this.defines.baseId,

      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 6
      },

      // 总条数
      total: 0,

      // 对应id虾苗总数
      remainNumber: 0,

      // 目前虾苗量
      constNum: '',

      // 保存投放状态选项·
      options: [
        {
          value: '0',
          label: '未投放'
        },
        {
          value: '1',
          label: '已投放'
        }
      ],

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

      // 保存捕捞规格
      options3: [
        {
          value: '60以上'
        },
        {
          value: '50~60'
        },
        {
          value: '30~40'
        },
        {
          value: '20~10'
        },
        {
          value: '10~0'
        }
      ],

      // 保存虾的养殖方式
      options4: [
        {
          value: '工厂流水养殖'
        },
        {
          value: '外塘传统养殖'
        },
        {
          value: '大棚温室养殖'
        },
        {
          value: '稻虾套养模式'
        }
      ],

      // 池塘列表
      pondList: [],

      // 虾苗品种列表
      ShrimpSpeciesList: [],

      // 用于获取虾苗编号
      shrimpManagement: [],

      // 用于获取农资名称
      suppliesName: [],

      // 用于存放人员信息
      personInfoList: [],

      // 添加池塘的表单数据
      addeForm: {
        pondName: '',
        pondVolume: '',
        baseId: ''
      },

      // 投苗表单数据
      drogForm: {
        id: '',
        shrimpId: '',
        baseId: '',
        inputNum: '',
        createDate: ''
      },

      // 投料表单数据
      farmForm: {
        suppliesName: '',
        applyTime: '',
        pondId: '',
        applicator: '',
        applyType: '',
        deliveryVolume: '',
        suppliesInfoId: ''
      },

      // 捕捞表单数据
      catchForm: {
        id: '',
        shrimpId: '',
        catchDate: '',
        people: '',
        yield: '',
        specification: ''
      },

      // 查询到的池塘信息对象，用于修改池塘信息
      editForm: {
        id: '',
        pondName: '',
        baseId: '',
        shrimpId: '',
        pondVolume: 0,
        inputNum: 0,
        createDate: null,
        deliveryStatus: '',
        catchDate: null
      },

      // 建议卡信息输入表单
      kindForm: {
        pondVolume: 0,
        pondDeep: 0,
        shrimpKindId: '',
        shrimpMethod: ''
      },

      // 查询到的建议卡信息
      suggest: {
        id: 'string',
        kindName: 'string',
        minDensity: 'string',
        maxDensity: 'string',
        waterTemperature: 0,
        salinity: 0,
        ph: 0,
        ammoniaValue: 0,
        dissolvedOxygen: 0,
        pondVolume: 0,
        pondDeep: 0
      },

      // 控制添加池塘面板的显示与隐藏
      addDialogVisible: false,

      // 控制修改池塘面板的显示和隐藏
      aditDialogVisible: false,

      // 控制投苗面板的显示和隐藏
      drogDialogVisible: false,

      // 控制投料面板的显示和隐藏
      farmDialogVisible: false,

      // 控制捕捞面板的显示和隐藏
      catchDialogVisible: false,

      // 控制建议卡:池塘信息输入面板的显示和隐藏
      kindDialogVisible: false,

      // 控制建议卡面板的显示和隐藏
      suggestDialogVisible: false,

      // 添加表单的验证规则对象
      addeFormRules: {
        pondName: [
          { required: true, message: '请输入池塘名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '池塘名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        pondVolume: [
          { required: true, message: '请输入池塘面积', trigger: 'blur' }
        ]
      },

      // 投苗表单的验证规则对象
      drogFormRules: {
        shrimpId: [
          { required: true, message: '请输入虾苗批次名称', trigger: 'blur' }
        ],
        inputNum: [
          { required: true, message: '请输入投放尾数', trigger: 'blur' }
        ]
      },

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

      // 捕捞表单的验证规则对象
      catchFormRules: {
        people: [{ required: true, message: '请输入操作员', trigger: 'blur' }],
        specification: [{ required: true, message: '请输入捕捞规格', trigger: 'blur' }],
        yield: [{ required: true, message: '请输入产量', trigger: 'blur' }]
      },

      // 修改表单的验证规则对象
      editFormRules: {
        pondName: [
          { required: true, message: '请输入池塘名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '池塘名称的长度在2~10个字符之间',
            trigger: 'blur'
          }
        ],
        pondVolume: [
          { required: true, message: '请输入池塘面积', trigger: 'blur' }
        ],
        deliveryStatus: [
          { required: true, message: '请输入投放状态', trigger: 'blur' }
        ]
      },

      // 建议卡的信息输入的验证规则对象
      kindFormRules: {
        kindName: [
          { required: true, message: '请输入虾的品种', trigger: 'blur' }
        ],
        pondVolume: [
          { required: true, message: '请输入池塘面积', trigger: 'blur' }
        ],
        pondDeep: [
          { required: true, message: '请输入池塘深度', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPondList()
    this.getshrimpId()
    this.getPersonInfoList()
    this.getShrimpSpeciesList()
    this.getsuppliesName()
  },
  methods: {
    // 获取虾苗品种列表
    async getShrimpSpeciesList() {
      const { data: res } = await this.$http.get('/shrimpKind')
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗列表失败！！')
      }
      this.ShrimpSpeciesList = res.data
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

    // 获取池塘列表
    async getPondList() {
      const { data: res } = await this.$http.post(
        `/pond/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          baseId: this.baseId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取池塘列表失败！！')
      }
      this.pondList = res.data.rows
      this.total = res.data.total
    },

    // 获取对应id虾苗剩余数
    async getremainNumber(id) {
      const { data: res } = await this.$http.get('/shrimpManagement/' + id)
      this.remainNumber = res.data.remainNumber
    },

    // 获取对应id农资名称
    async getSuppliesName(id) {
      const { data: res } = await this.$http.get('/suppliesinfo/' + id)
      this.farmForm.suppliesName = res.data.suppliesName
    },

    // 获取虾苗编号(批次名称)
    async getshrimpId() {
      const { data: res } = await this.$http.post('/shrimpManagement/search', {
        baseId: this.baseId
      })
      if (res.code !== 20000) {
        return this.$message.error('获取虾苗批次名称失败！！')
      }
      this.shrimpManagement = res.data
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

    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getPondList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getPondList()
    },

    // 监听添加鱼塘对话框的关闭事件,关闭时对表单进行重置
    addDialogClosed() {
      // 表单方法：resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addeFormRef.resetFields()
    },

    // 监听修改对话框的关闭事件,关闭时对表单进行重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.remainNumber = 0
    },

    // 监听投苗对话框的关闭事件,关闭时对表单进行重置
    drogDialogClosed() {
      this.$refs.drogFormRef.resetFields()
      this.remainNumber = 0
    },

    // 监听投料对话框的关闭事件,关闭时对表单进行重置
    farmDialogClosed() {
      this.$refs.farmFormRef.resetFields()
    },

    // 监听捕捞对话框的关闭事件,关闭时对表单进行重置
    catchDialogClosed() {
      this.$refs.catchFormRef.resetFields()
    },

    // 监听建议卡对话框的关闭事件,关闭时对表单进行重置
    kindDialogClosed() {
      this.$refs.kindFormRef.resetFields()
      this.kindForm.shrimpMethod = ''
      this.kindForm.shrimpKindId = ''
    },

    // 点击按钮，添加池塘
    addPond() {
      // 先进行表单的预校验
      this.$refs.addeFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加的网络请求
        // 调用添加用户接口
        this.addeForm.baseId = this.baseId
        const { data: res } = await this.$http.post('/pond', this.addeForm)
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('添加池塘失败！！')
        }
        this.$message.success('添加池塘成功!!')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 成功后新增，需要刷新列表
        this.getPondList()
      })
    },

    // 点击按钮，投放虾苗
    dropPond() {
      // 先进行表单的预校验
      this.$refs.drogFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        var date = new Date()
        this.drogForm.createDate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.drogForm.baseId = this.baseId
        const { data: res } = await this.$http.put('/pond/drop', this.drogForm)
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('投苗失败！！')
        }
        this.$message.success('投苗成功!!')
        // 隐藏添加的对话框
        this.drogDialogVisible = false
        this.drogForm.shrimpId = ''
        // 成功后新增，需要刷新池塘列表
        this.getPondList()
      })
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
          this.getPondList()
        })
      })
    },

    // 点击按钮，捕捞产品
    catchPond() {
      // 先进行表单的预校验
      this.$refs.catchFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        var date = new Date()
        this.catchForm.catchDate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        // 字符转化为数字
        this.catchForm.yield -= 0
        console.log(this.catchForm)
        const { data: res } = await this.$http.put(
          `/pond/catch/${this.catchForm.yield}/${this.catchForm.people}?specification=${this.catchForm.specification}`,
          {
            id: this.catchForm.id,
            shrimpId: this.catchForm.shrimpId,
            catchDate: this.catchForm.catchDate
          }
        )
        if (res.code !== 20000) {
          return this.$message.error('捕捞失败！！')
        }
        this.$message.success('捕捞成功!!')
        // 隐藏添加的对话框
        this.catchDialogVisible = false
        // 成功后新增，需要刷新池塘列表
        this.getPondList()
      })
    },

    // 展示修改的对话框
    async showEditDialog(id) {
      // 调用根据ID查询池塘信息接口
      const { data: res } = await this.$http.get('/pond/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询池塘信息失败！！')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.constNum = this.editForm.inputNum
      this.aditDialogVisible = true
    },

    // 通过按钮获取池塘id，用于虾苗投放
    async drogPondById(id) {
      // 调用根据ID查询池塘信息接口
      console.log(id)
      const { data: res } = await this.$http.get('/pond/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询池塘信息失败！！')
      }
      this.drogForm.id = res.data.id
      this.drogDialogVisible = true
    },

    // 通过按钮获取池塘id，用于虾苗投料
    async farmPondById(id) {
      // 调用根据ID查询池塘信息接口
      const { data: res } = await this.$http.get('/pond/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询池塘信息失败！！')
      }
      this.farmForm.pondId = res.data.id
      this.farmDialogVisible = true
    },

    // 通过按钮获取池塘id，用于虾苗捕捞
    async catchPondById(id) {
      // 调用根据ID查询池塘信息接口
      const { data: res } = await this.$http.get('/pond/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询池塘信息失败！！')
      }
      this.catchForm.id = res.data.id
      this.catchForm.shrimpId = res.data.shrimpId
      this.catchDialogVisible = true
    },

    // 修改池塘信息并提交
    editPondInfo() {
      // 先进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改信息的请求
        // 转化时间为标准形式
        if (this.editForm.createDate !== null) {
          var date = new Date(this.editForm.createDate)
          this.editForm.createDate = `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        if (this.editForm.catchDate !== null) {
          var date2 = new Date(this.editForm.catchDate)
          this.editForm.catchDate = `${date2.getFullYear()}-${date2.getMonth() +
            1}-${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`
        }
        console.log(this.editForm)
        const { data: res } = await this.$http.put(
          '/pond/' + this.editForm.id,
          {
            id: this.editForm.id,
            pondName: this.editForm.pondName,
            baseId: this.editForm.baseId,
            shrimpId: this.editForm.shrimpId,
            pondVolume: this.editForm.pondVolume,
            inputNum: this.editForm.inputNum,
            createDate: this.editForm.createDate,
            deliveryStatus: this.editForm.deliveryStatus,
            catchDate: this.editForm.catchDate
          }
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新池塘信息失败！！')
        }
        // 关闭对话框
        this.aditDialogVisible = false
        this.remainNumber = 0
        // 刷新列表
        this.getPondList()
        // 提示修改成功
        this.$message.success('更新池塘信息成功！！')
      })
    },

    // 根据id删除对应的池塘信息
    async removePondById(id) {
      // 弹框询问用户是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该池塘, 是否继续?',
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
      const { data: res } = await this.$http.delete('/pond/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除池塘失败')
      }
      this.$message.success('删除池塘成功！！')
      this.getPondList()
    },

    // 点击图片，跳转页面
    async pondFInfo(id) {
      // 调用根据ID查询池塘信息接口
      const { data: res } = await this.$http.get('/pond/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询池塘信息失败！！')
      }
      this.$router.push({
        path: '/Pond/PondInfo',
        query: { pondId: res.data.id }
      })
    },

    // 通过按钮获取池塘id，用于虾苗捕捞
    async getSuggestById(id) {
      const { data: res } = await this.$http.get('/shrimpKind/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询建议卡信息失败！！')
      }
      this.suggest = res.data
      this.suggest.minDensity -= 0
      this.suggest.maxDensity -= 0
    },

    // 建议卡：点击确认关闭对话框，显示建议卡内容
    kindPond() {
      this.getSuggestById(this.kindForm.shrimpKindId).then(() => {
        this.suggest.pondDeep = this.kindForm.pondDeep
        this.suggest.pondVolume = this.kindForm.pondVolume
        // 关闭对话框
        this.kindDialogVisible = false
        this.suggestDialogVisible = true
      })
    }
  }
}
</script>

<style lang="less">
.bigBox {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}
.bigBox p {
  color: #636e7b;
  // border: 1px solid black;
  margin: 5px 0;
}
.infoBox {
  padding-left: 20px;
}
.imgBox {
  width: 120px;
  height: 120px;
}
.imgBox img {
  border: 1px solid rgb(175, 172, 172);
  padding: 5px;
  border-radius: 100%;
  width: 100%;
  height: 100%;
}
.pondBody {
  border: 1px solid rgb(179, 179, 179);
  width: 31.5%;
  margin-left: 10px;
  border-radius: 4px;
}
.btnBox {
  border: 1px solid black;
  height: 10px;
  width: 100%;
}
.btnBox .blank {
  width: 120px;
}
.btnBox .btnGround {
  padding-left: 50px;
}
.dididi {
  border-collapse: collapse;
  border: 1px solid #c6e2ff;
  border-radius: 4px;
  width: 95%;
  td,
  th {
    border: 1px solid #b4b5b6;
    padding: 10px;
    text-align: center;
  }
  th {
    color: rgb(116, 114, 114);
  }
}
</style>
