<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的基地</el-breadcrumb-item>
      <el-breadcrumb-item>环境监测</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-s-custom"></i>
          <span>环境预测</span>
        </el-col>
      </el-row>
      <el-form
          :model="forecaseForm"
          :rules="forecaseFormRules"
          ref="forecaseFormRef"
          label-width="100px"
        >
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-select v-model="forecaseForm.equipment" value-key="id" placeholder="请选择要预测的设备" @change="getForecaseEquipment">
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.equipmentName"
                :value="item">
              </el-option>
            </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检测项" prop="checkItemName">
            <el-select v-model="forecaseForm.checkItemName" placeholder="请选择检测项" @change="getCheckItemName">
              <el-option
                v-for="item in forecaseForm.typeId=='1'?pondCheckItemName:weatherCheckItemName"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="算法模型" prop="arithmetic">
            <el-select v-model="forecaseForm.arithmetic" placeholder="请选择算法模型" @change="getArithmetic">
              <el-option
                v-for="item in forecaseForm.typeId=='1'?pondarithmetic:weatherarithmetic"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开始日期" prop="startTime">
            <el-date-picker
              v-model="forecaseForm.startTime"
              align="right"
              type="date"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束日期" prop="endTime">
            <el-date-picker
              v-model="forecaseForm.endTime"
              align="right"
              type="date"
              placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="getForecastData" >查询</el-button>
          <el-button type="primary" @click="isShowChart = false" >关闭</el-button>
        </el-col>
      </el-row>
      </el-form>
      <!-- 图表 -->
        <el-alert
          title="预测到接下来一段时间内，当前通道值可能会超出或低于阀值，请及时做出相应处理"
          type="warning"
          effect="dark"
          v-if="isShowWarn">
        </el-alert>
      <div ref="chart" style="width:100%;height:372px;" v-show="isShowChart"></div>
    </el-card>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 标题添加区域 -->
      <el-row class="globalHeader" style="margin-bottom:20px;padding-bottom:45px">
        <el-col :span="4">
          <i class="el-icon-s-custom"></i>
          <span>设备查询</span>
        </el-col>
      </el-row>
      <el-form
          :model="searchForm"
          :rules="searchFormRules"
          ref="searchFormRef"
          label-width="100px"
        >
      <el-row >
        <el-col :span="6">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-select v-model="searchForm.equipment" value-key="id" placeholder="请选择要查询的设备" @change="getSearchEquipment">
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.equipmentName"
                :value="item">
              </el-option>
            </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始日期" prop="startTime">
            <el-date-picker
              v-model="searchForm.startTime"
              align="right"
              type="date"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束日期" prop="endTime">
            <el-date-picker
              v-model="searchForm.endTime"
              align="right"
              type="date"
              placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getSearchData" v-loading="isLoading" :disabled="isLoading">查询</el-button>
        </el-col>
      </el-row>
      </el-form>
      <!-- 设备列表区域 -->
      <el-table :data="searchEquipmentList" border stripe
      max-height='500'
      v-if="isShowSearchTable"
      >
        <!-- :data: 放入数据源 -->
        <!-- border： 加入边框线 -->
        <!-- type="index"： 索引列 -->
        >
        <el-table-column
        v-for="item in tableColumnList"
        :label="item.propName"
        :property="item.prop"
        :key="item.prop"
        align="center">
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeSeEquipmentById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data() {
    return {
      // 是否展示警告
      isShowWarn: false,
      // 查询按钮
      isLoading: false,
      // 是否展示预测图
      isShowChart: false,
      baseUrl: 'http://106.75.154.40:9004',
      // 初始化动态的搜索表头数组
      tableWeaterList: [
        {
          propName: '所属设备编号',
          prop: 'equipmentId'
        },
        {
          propName: '电能/mV',
          prop: 'electricEnergy'
        },
        {
          propName: '光照/Lux',
          prop: 'illumination'
        },
        {
          propName: '风速/m/s',
          prop: 'windSpeed'
        },
        {
          propName: '风向/度',
          prop: 'windDirect'
        },
        {
          propName: '气温/℃',
          prop: 'airTemperature'
        },
        {
          propName: '湿度/%',
          prop: 'humidity'
        },
        {
          propName: '雨量/mm',
          prop: 'rain'
        },
        {
          propName: '土温/℃',
          prop: 'soilTemperature'
        },
        {
          propName: '土湿/%',
          prop: 'soilMoisture'
        },
        {
          propName: '采集时间',
          prop: 'acquisitionTime'
        },
        {
          propName: '气象设备工作状态',
          prop: 'equipmentWorking'
        }
      ],
      tableWaterList: [
        {
          propName: '水质设备编号',
          prop: 'equipmentId'
        },
        {
          propName: '溶解氧',
          prop: 'dissolvedOxygen'
        },
        {
          propName: '水温',
          prop: 'water_temperature'
        },
        {
          propName: 'PH值',
          prop: 'phValue'
        },
        {
          propName: '氨氮',
          prop: 'ammoniaNitrogen'
        },
        {
          propName: '水位',
          prop: 'waterLevel'
        },
        {
          propName: '压力传感器状态',
          prop: 'pressureSensorStatus'
        },
        {
          propName: '浮球阀状态',
          prop: 'floatValveStatus'
        },
        {
          propName: '水质传感器工作状态',
          prop: 'waterQualityWorking'
        }
      ],
      // 搜索后的结果
      searchEquipmentList: [],
      isShowSearchTable: false,
      // 基地编号
      baseId: this.defines.baseId,
      typeId: '0',
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },
      // 总条数
      total: 0,
      // 数据间隔
      interval: '',
      // 用于存放设备信息
      equipmentList: [],
      // 预测的检测项
      // 气象设备的：电能，光照，风速，风向，气温，湿度，雨量，土温
      // 水质设备的：溶解氧、水温、pH、氨氮、电导率、浊度、高猛酸盐指数、总磷、总氮、叶绿素α、藻密度、水位
      pondCheckItemName: [
        {
          value: 'dissolvedOxygen',
          label: '溶解氧'
        },
        {
          value: 'waterTemperature',
          label: '水温'
        },
        {
          value: 'phValue',
          label: 'pH'
        },
        {
          value: 'ammoniaNitrogen',
          label: '氨氮'
        },
        {
          value: 'conductivity',
          label: '电导率'
        },
        {
          value: 'turbidity',
          label: '浊度'
        },
        {
          value: 'permanganateIndex',
          label: '高猛酸盐指数'
        },
        {
          value: 'phosphorus',
          label: '总磷'
        },
        {
          value: 'nitrogen',
          label: '总氮'
        },
        {
          value: 'chlorophyll',
          label: '叶绿素α'
        },
        {
          value: 'algalDensity',
          label: '藻密度'
        },
        {
          value: 'waterLevel',
          label: '水位'
        }
      ],
      weatherCheckItemName: [
        {
          value: 'electricEnergy',
          label: '电能'
        },
        {
          value: 'illumination',
          label: '光照'
        },
        {
          value: 'windSpeed',
          label: '风速'
        },
        {
          value: 'windDirect',
          label: '风向'
        },
        {
          value: 'airTemperature',
          label: '气温'
        },
        {
          value: 'humidity',
          label: '湿度'
        },
        {
          value: 'rain',
          label: '雨量'
        },
        {
          value: 'soilTemperature',
          label: '土温'
        },
        {
          value: 'soilMoisture',
          label: '土湿'
        }
      ],
      // 算法
      pondarithmetic: [
        {
          value: 'svm',
          label: 'svm'
        },
        {
          value: 'LR',
          label: 'LR'
        },
        {
          value: 'DT',
          label: 'DT'
        },
        {
          value: 'RF',
          label: 'RF'
        }
      ],
      weatherarithmetic: [
        {
          value: 'arima',
          label: 'arima'
        },
        {
          value: 'lstmrnn',
          label: 'lstmrnn'
        }
      ],

      // 区别水池还是天气
      typeIdFlag: '',
      // 需要预测的信息
      forecaseForm: {
        equipment: '',
        equipmentName: '',
        checkItemName: '',
        arithmetic: '',
        startTime: '',
        endTime: '',
        typeId: ''
      },
      // 需要查询的信息
      searchForm: {
        startTime: '',
        endTime: '',
        equipmentId: '',
        typeId: ''
      },
      // 添加表单的验证规则对象
      forecaseFormRules: {
        equipmentName: [
          { required: true, message: '请选择设备名称', trigger: 'blur' }
        ],
        checkItemName: [
          { required: true, message: '请选择检测项', trigger: 'blur' }
        ],
        arithmetic: [
          { required: true, message: '请选择算法', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      },
      searchFormRules: {
        equipmentName: [
          { required: true, message: '请选择设备名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getequipmentList()
  },
  computed: {
    tableColumnList: function () {
      return this.searchForm.typeId === '0' ? this.tableWeaterList : this.tableWaterList
    }
  },
  methods: {
    // 获得横坐标的周期长度
    getTimeLength(start, end) {
      const stamp = new Date(end).getTime() - new Date(start).getTime()
      let time = (stamp / 1000)
      if (time !== null && time !== '') {
        time = parseInt(time)
      }
      this.interval = this.forecaseForm.typeId === '1' ? 10 * 60 : 30 * 60
      const length = Math.floor(time / this.interval)
      return length
    },
    // 合成横坐标
    makeEchartXData(start, Timer, length) {
      const lists = []
      for (let j = 0; j < length; j++) {
        const seconds = Date.parse(start) // 标准时间转毫秒数
        const totals = j * Timer * 1000 + seconds // 固定时间间隔+开始时间的总毫秒数    分钟递增在*60 分小时 递增*60*60
        const res = new Date(totals).toString() // 毫秒数转字符串，截取，取值
        lists.push(this.checkTime(res))
      }
      // console.log(lists)
      return lists
    },
    // 画echart预测图
    makeEchart(xData, orgindata, predictdata) {
      const chart = this.$refs.chart
      chart.style.width = window.innerWidth - 200 + 'px'
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title: {
            text: '预测'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['实际值', '预测值']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData
            // data: ['2019-09-01 08:00:00', '2019-09-01 08:30:00', '2019-09-01 09:00:00', '2019-09-01 09:30:00', '2019-09-01 10:00:00', '2019-09-01 10:30:00', '2019-09-01 11:00:00', '2019-09-01 11:30:00', '2019-09-01 12:00:00', '2019-09-01 12:30:00', '2019-09-01 13:00:00', '2019-09-01 13:30:00', '2019-09-01 14:00:00', '2019-09-01 14:30:00', '2019-09-01 15:00:00', '2019-09-01 15:30:00', '2019-09-01 16:00:00', '2019-09-01 16:30:00', '2019-09-01 17:00:00', '2019-09-01 17:30:00', '2019-09-01 18:00:00', '2019-09-01 18:30:00', '2019-09-01 19:00:00', '2019-09-01 19:30:00', '2019-09-01 20:00:00', '2019-09-01 20:30:00', '2019-09-01 21:00:00', '2019-09-01 21:30:00', '2019-09-01 22:00:00', '2019-09-01 22:30:00', '2019-09-01 23:00:00', '2019-09-01 23:30:00', '2019-09-02 00:00:00', '2019-09-02 00:30:00', '2019-09-02 01:00:00', '2019-09-02 01:30:00', '2019-09-02 02:00:00', '2019-09-02 02:30:00', '2019-09-02 03:00:00', '2019-09-02 03:30:00', '2019-09-02 04:00:00', '2019-09-02 04:30:00', '2019-09-02 05:00:00', '2019-09-02 05:30:00', '2019-09-02 06:00:00', '2019-09-02 06:30:00', '2019-09-02 07:00:00', '2019-09-02 07:30:00', '2019-09-02 08:00:00', '2019-09-02 08:30:00', '2019-09-02 09:00:00', '2019-09-02 09:30:00', '2019-09-02 10:00:00', '2019-09-02 10:30:00', '2019-09-02 11:00:00', '2019-09-02 11:30:00', '2019-09-02 12:00:00', '2019-09-02 12:30:00', '2019-09-02 13:00:00', '2019-09-02 13:30:00', '2019-09-02 14:00:00', '2019-09-02 14:30:00', '2019-09-02 15:00:00', '2019-09-02 15:30:00', '2019-09-02 16:00:00', '2019-09-02 16:30:00', '2019-09-02 17:00:00', '2019-09-02 17:30:00', '2019-09-02 18:00:00', '2019-09-02 18:30:00', '2019-09-02 19:00:00', '2019-09-02 19:30:00', '2019-09-02 20:00:00', '2019-09-02 20:30:00', '2019-09-02 21:00:00', '2019-09-02 21:30:00', '2019-09-02 22:00:00', '2019-09-02 22:30:00', '2019-09-02 23:00:00', '2019-09-02 23:30:00', '2019-09-03 00:00:00', '2019-09-03 00:30:00', '2019-09-03 01:00:00', '2019-09-03 01:30:00', '2019-09-03 02:00:00', '2019-09-03 02:30:00', '2019-09-03 03:00:00', '2019-09-03 03:30:00', '2019-09-03 04:00:00', '2019-09-03 04:30:00', '2019-09-03 05:00:00', '2019-09-03 05:30:00', '2019-09-03 06:00:00', '2019-09-03 06:30:00', '2019-09-03 07:00:00', '2019-09-03 07:30:00', '2019-09-03 08:00:00', '2019-09-03 08:30:00', '2019-09-03 09:00:00', '2019-09-03 09:30:00']
          },
          yAxis: {
            type: 'value',
            // axisLabel: {
            //   formatter: '{value} '
            // }
            min: function(value) {
              return value.min
            }
          },
          series: [{
            name: '预测值',
            type: 'line',
            data: predictdata,
            scale: true,
            // data: [4128.4, 4135.7, 4147.4, 4131.3, 4156.2, 4156.2, 4122.5, 4115.2, 4148.9, 4147.4, 4147.4, 4144.5, 4144.5, 4141.6, 4140.1, 4140.1, 4138.6, 4135.7, 4134.2, 4135.7, 4144.5, 4163.5, 4178.2, 4182.6, 4181.1, 4154.7, 4160.6, 4165, 4154.7, 4160.6, 4165, 4153.3, 4151.8, 4182.6, 4153.3, 4154.7, 4153.3, 4156.2, 4150.3, 4181.1, 4137.2, 4137.2, 4151.8, 4134.2, 4143, 4166.5, 4135.7, 4128.4, 4132.8, 4159.1, 4129.8, 4119.6, 4128.4, 4151.8, 4119.6, 4147.4, 4147.4, 4146, 4144.5, 4144.5, 4141.6, 4141.6, 4138.6, 4137.2, 4135.7, 4135.7, 4134.2, 4140.1, 4157.7, 4181.1, 4182.6, 4181.1, 4172.3, 4156.2, 4160.6, 4181.1, 4157.7, 4181.1, 4172.3, 4153.3, 4153.3, 4182.6, 4151.8, 4184, 4162.1, 4184, 4147.4, 4178.2, 4138.6, 4140.1, 4153.3, 4134.2, 4132.8, 4167.9, 4144.5, 4129.8, 4125.4, 4160.6, 4122.5, 4128.4],
            markPoint: {
              data: [{
                type: 'max',
                name: '最大值'
              },
              {
                type: 'min',
                name: '最小值'
              }
              ]
            },
            markLine: {
              data: [{
                type: 'average',
                name: '平均值'
              }]
            }
          },
          {
            name: '实际值',
            type: 'line',
            data: orgindata,
            scale: true,
            // data: [4128.4, 4135.7, 4147.4, 4131.3, 4156.2, 4156.2, 4122.5, 4115.2, 4148.9, 4147.4, 4147.4, 4144.5, 4144.5, 4141.6, 4140.1, 4140.1, 4138.6, 4135.7, 4134.2, 4135.7, 4144.5, 4163.5, 4178.2, 4182.6, 4181.1, 4154.7, 4160.6, 4165, 4154.7, 4160.6, 4165, 4153.3, 4151.8, 4182.6, 4153.3, 4154.7, 4153.3, 4156.2, 4150.3, 4181.1, 4137.2, 4137.2, 4151.8, 4134.2, 4143, 4166.5, 4135.7, 4128.4, 4132.8, 4159.1, 4129.8, 4119.6, 4128.4, 4151.8, 4119.6, 4147.4, 4147.4, 4146, 4144.5, 4144.5, 4141.6, 4141.6, 4138.6, 4137.2, 4135.7, 4135.7, 4134.2, 4140.1, 4157.7, 4181.1, 4182.6, 4181.1, 4172.3, 4156.2, 4160.6, 4181.1, 4157.7, 4181.1, 4172.3, 4153.3, 4153.3, 4182.6, 4151.8, 4184, 4162.1, 4184, 4147.4, 4178.2, 4138.6, 4140.1, 4153.3, 4134.2, 4132.8, 4167.9, 4144.5, 4129.8, 4125.4, 4160.6, 4122.5, 4128.4],
            markPoint: {
              data: [{
                name: '最低',
                value: -2,
                xAxis: 1,
                yAxis: -1.5
              }]
            },
            markLine: {
              data: [{
                type: 'average',
                name: '平均值'
              },
              [{
                symbol: 'none',
                x: '90%',
                yAxis: 'max'
              },
              {
                symbol: 'circle',
                label: {
                  position: 'start',
                  formatter: '最大值'
                },
                type: 'max',
                name: '最高点'
              }]
              ]
            }
          }
          ]
        }
        myChart.setOption(option)
        window.addEventListener('resize', function () {
          chart.style.width = window.innerWidth - 200 + 'px'
          myChart.resize()
        })
      }
      // this.$on('hook:destroyed', () => {
      //   window.removeEventListener('resize', function () {
      //     myChart.resize()
      //   })
      // })
    },
    // 格式化时间
    checkTime(date) {
      if (!date) return ''
      date = date.toString()
      const d = new Date(date)
      const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
      const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      const times = d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
      return times
    },
    // 获取预测数据
    getForecaseEquipment(value) {
      this.isShowChart = false
      this.isShowWarn = false
      this.forecaseForm.typeId = value.typeId
      this.forecaseForm.equipmentName = value.equipmentName
      this.forecaseForm.checkItemName = ''
      this.forecaseForm.arithmetic = ''
    },
    // 获取表格
    getCheckItemName(value) {
      if (this.forecaseForm.typeId === '') {
        alert('请先选择设备')
        this.forecaseForm.checkItemName = ''
        return
      }
      this.forecaseForm.checkItemName = value
    },
    getArithmetic (value) {
      if (this.forecaseForm.typeId === '') {
        alert('请先选择设备')
        this.forecaseForm.checkItemName = ''
        return
      }
      this.forecaseForm.arithmetic = value
    },
    // 获取查询equipment的数据
    getSearchEquipment(value) {
      this.isShowSearchTable = false
      this.searchForm.typeId = value.typeId
      this.searchForm.equipmentName = value.equipmentName
    },
    async getSearchData(value) {
      this.isLoading = true
      this.$refs.searchFormRef.validate(async valid => {
        if (!valid) return false
        this.searchForm.startTime = this.checkTime(this.searchForm.startTime)
        this.searchForm.endTime = this.checkTime(this.searchForm.endTime)
        const flag = this.searchForm.typeId === '0' ? 'meteorologicalData' : 'waterData'
        console.log(this.searchForm)
        const { data: res } = await this.$http.post(`${this.baseUrl}/${flag}/search/1/500`, this.searchForm)
        this.$message.success('查询成功!!')
        if (res.code !== 20000) {
          this.isShowSearchTable = false
          this.isLoading = false
          return this.$message.error('查询失败！！')
        }
        const dataList = res.data.rows
        if (this.searchForm.typeId === '0') {
          for (const e of dataList) {
            if (e.equipmentWorking === '0') {
              e.equipmentWorking = '关闭'
            } else if (e.equipmentWorking === '1') {
              e.equipmentWorking = '工作中'
            } else if (e.equipmentWorking === '2') {
              e.equipmentWorking = '故障'
            }
          }
        } else {
          for (const e of dataList) {
            if (e.pressureSensorStatus === '0') {
              e.pressureSensorStatus = '关'
            } else if (e.pressureSensorStatus === '1') {
              e.pressureSensorStatus = '开'
            }
            if (e.floatValveStatus === '0') {
              e.floatValveStatus = '关'
            } else if (e.floatValveStatus === '1') {
              e.floatValveStatus = '开'
            }
            if (e.waterQualityWorking === '0') {
              e.waterQualityWorking = '关闭'
            } else if (e.waterQualityWorking === '1') {
              e.waterQualityWorking = '工作中'
            } else if (e.waterQualityWorking === '2') {
              e.waterQualityWorking = '故障'
            }
          }
        }
        this.isLoading = false
        this.isShowSearchTable = true
        this.searchEquipmentList = dataList
      })
    },
    // 请求预测
    async getForecastData() {
      // 先进行表单的预校验
      this.$refs.forecaseFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        // 成功后，可以发起添加用户的网络请求
        this.forecaseForm.startTime = this.checkTime(this.forecaseForm.startTime)
        this.forecaseForm.endTime = this.checkTime(this.forecaseForm.endTime)
        const flag = this.forecaseForm.typeId === '0' ? '' : '/water'
        const form = {
          equipmentId: this.forecaseForm.equipment.equipmentId,
          checkItemName: this.forecaseForm.checkItemName,
          startTime: this.forecaseForm.startTime,
          endTime: this.forecaseForm.endTime,
          typeId: this.forecaseForm.typeId
        }
        const { data: res } = await this.$http.post(`${this.baseUrl}/datarecord/forecast${flag}/${this.forecaseForm.arithmetic}/1/500`, form)
        console.log(res)
        if (res.code !== 200) {
          this.isShowChart = false
          return this.$message.error('预测失败！！')
        }
        if (res.data.orgindata.length === 0) {
          this.isShowChart = false
          return this.$message.error('查无数据')
        }
        this.$message.success('预测成功!!')
        this.isShowWarn = res.data.warn
        const length = this.getTimeLength(this.forecaseForm.startTime, this.forecaseForm.endTime)
        const xData = this.makeEchartXData(this.forecaseForm.startTime, this.interval, length)
        // 去除限制
        xData.length = 700
        res.data.predictdata = [...res.data.orgindata, ...res.data.predictdata]
        this.makeEchart(xData, res.data.orgindata, res.data.predictdata)
        this.isShowChart = true
      })
    },
    showEditWarning(id) {
      this.$router.push({
        path: '/WeatherWarn',
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
    // 获取设备信息
    async getequipmentList() {
      const { data: res } = await this.$http.post(
        `${this.baseUrl}/equipment/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`, {
          baseId: this.baseId,
          typedId: this.typedId
        })
      if (res.code !== 20000) {
        return this.$message.error('获取设备列表失败！！')
      }
      // 处理null
      const rows = res.data.rows
      // console.log(rows)
      for (let i = 0; i < rows.length; i++) {
        for (const key in rows[i]) {
          if (rows[i][key] == null || rows[i][key] === 'null' || rows[i][key] === 'NULL') {
            rows[i][key] = ''
          }
        }
      }
      this.equipmentList = rows
      this.total = res.data.total
      console.log(this.equipmentList)
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
    }
    // // 点击按钮，添加
    // async addEquipment() {
    //   // 先进行表单的预校验
    //   this.$refs.addeFormRef.validate(async valid => {
    //     // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
    //     if (!valid) return false
    //     // 成功后，可以发起添加用户的网络请求
    //     this.addeForm.baseId = this.baseId
    //     const { data: res } = await this.$http.post(`${this.baseUrl}/equipment`, this.addeForm)
    //     console.log(res)
    //     if (res.code !== 20000) {
    //       return this.$message.error('设备名重复请重新输入！！')
    //     }
    //     this.$message.success('添加设备成功!!')
    //     // 隐藏添加的对话框
    //     this.addDialogVisible = false
    //     // 成功后新增，需要刷新列表
    //     this.getequipmentList()
    //   })
    // },

    // 根据删除
    // async removeEquipmentById(id) {
    //   // 弹框询问是否删除数据
    //   // 前提：在elementUI中挂载confirm
    //   // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
    //   const confirmResult = await this.$confirm(
    //     '此操作将永久删除该设备, 是否继续?',
    //     '提示',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //     // .catch 用于捕获错误返回给confirmResult
    //   ).catch(err => {
    //     return err
    //   })
    //   // 如果确认删除，则返回值为字符串 confirm
    //   // 如果取消了删除， 则返回值为字符串 cancel
    //   if (confirmResult !== 'confirm') {
    //     // this.$message.info: 灰色提示框
    //     return this.$message.info('已取消删除')
    //   }
    //   const { data: res } = await this.$http.delete(`${this.baseUrl}/equipment/${id}`)
    //   if (res.code !== 20000) {
    //     return this.$message.error('删除设备失败')
    //   }
    //   this.$message.success('删除设备成功')
    //   this.getequipmentList()
    // }
  }
}
</script>

<style lang="less" scoped></style>
