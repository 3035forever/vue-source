<template>
  <div id="ocode-web">
    <div id="head2">
      <span>溯源信息</span>
    </div>
    <div id="main2">
      <div class="heading">
        <div class="title">
          <p>快速查询</p>
        </div>
        <div id="select1">
          <div class="option" @click="iconbase">
            <i class="el-icon-office-building"></i>
            <p>基地信息</p>
          </div>
          <!-- intoStore -->
          <div class="option" @click="iconshrimp">
            <i class="el-icon-s-order"></i>
            <p>虾苗来源</p>
          </div>
          <div class="option" @click="iconfarm">
            <i class="el-icon-folder"></i>
            <p>投料信息</p>
          </div>
          <div class="option" @click="iconplant">
            <i class="el-icon-house"></i>
            <p>加工信息</p>
          </div>
          <div class="option" @click="iconsto">
            <i class="el-icon-mobile"></i>
            <p>冷库信息</p>
          </div>
          <div class="option" @click="iconDeliver">
            <i class="el-icon-truck"></i>
            <p>物流信息</p>
          </div>
        </div>
      </div>
      <!-- 基地信息 -->
      <div class="panel2 baseinfo" v-show="isShowBase">
        <el-row class="head">
          <el-col>基地信息</el-col>
        </el-row>
        <el-carousel height="200px" indicator-position="none" class="imgBox1">
          <el-carousel-item trigger="click" v-for="item in picSet" :key="item">
            <img :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
        <el-row class="boby">
          <el-col :span="6" class="label">基地名称：</el-col>
          <el-col :span="18" class="content">{{this.base.baseName}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">法人姓名：</el-col>
          <el-col :span="18" class="content">{{this.base.createBy}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">基地地址：</el-col>
          <el-col :span="18" class="content">{{this.base.baseAddr}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">创建时间：</el-col>
          <el-col :span="18" class="content">{{this.base.createDate}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">注册资金：</el-col>
          <el-col :span="18" class="content">{{this.base.funds}} 万元</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="9" class="label">营业执照注册号：</el-col>
          <el-col :span="15" class="content">{{this.base.registNumber}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">营业范围：</el-col>
          <el-col :span="18" class="content">{{this.base.scope}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">基地简介：</el-col>
          <el-col :span="18" class="content">{{this.base.baseIntroduction}}</el-col>
        </el-row>
      </div>
      <!-- 虾苗来源 -->
      <div class="panel2" v-show="isShowRouse">
        <el-row class="head">
          <el-col>虾苗来源</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="8" class="label">虾苗批次名称：</el-col>
          <el-col :span="16" class="content">{{this.shrimp.shrimpBatchName}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">虾苗品种：</el-col>
          <el-col :span="18" class="content">{{this.shrimp.shrimpSpecies}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">虾苗产地：</el-col>
          <el-col :span="18" class="content">{{this.shrimp.shrimpOrigin}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="7" class="label">虾苗供货商：</el-col>
          <el-col :span="17" class="content">{{this.shrimp.shrimpSupplier}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">放苗时间：</el-col>
          <el-col :span="18" class="content">{{this.shrimp.seedlingTime}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">捕捞时间：</el-col>
          <el-col :span="18" class="content">{{this.shrimp.fishingTime}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="8" class="label">(捕捞)审核人：</el-col>
          <el-col :span="16" class="content">{{this.shrimp.createBy}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">对虾规格：</el-col>
          <el-col :span="18" class="content">{{this.shrimp.specification}} 尾/kg</el-col>
        </el-row>
      </div>
      <!-- 投料信息 -->
      <div class="panel2" v-show="isShowFarm">
        <el-row class="head">
          <el-col>投料信息</el-col>
        </el-row>
        <el-table
          :data="shrimpFarmings"
          style="margin-top:0;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" label-width="85px">
                <el-form-item label="农资名称" class="down-label">
                  <span>{{ props.row.suppliesName }}</span>
                </el-form-item>
                <el-form-item label="农资类型" class="down-label">
                  <span>{{ props.row.applyType }}</span>
                </el-form-item>
                <el-form-item label="使用人" class="down-label">
                  <span>{{ props.row.applicator }}</span>
                </el-form-item>
                <el-form-item label="使用时间" class="down-label">
                  <span>{{ props.row.applyTime }}</span>
                </el-form-item>
                <el-form-item label="投放量" class="down-label">
                  <span>{{ props.row.deliveryVolume }} kg</span>
                </el-form-item>
                <el-form-item  tem label="农资来源id" class="down-label">
                  <span>{{ props.row.suppliesInfoId }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="农资名称"
            prop="suppliesName">
          </el-table-column>
          <el-table-column
            label="使用人"
            prop="applicator">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                size="mini"
                @click="showSupplies(scope.row.suppliesInfoId)"
              >农资来源</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 加工厂信息 -->
      <div class="panel2" v-show="isShowPlant">
        <el-row class="head">
          <el-col>加工信息</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="7" class="label">加工厂名称：</el-col>
          <el-col :span="17" class="content">{{plantInfo.plantName}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="7" class="label">加工厂地址：</el-col>
          <el-col :span="17" class="content">{{plantInfo.plantAddress}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">生产时间：</el-col>
          <el-col :span="18" class="content">{{plantInfo.productionTime}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">操作员：</el-col>
          <el-col :span="18" class="content">{{plantInfo.createBy}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">产品名称：</el-col>
          <el-col :span="18" class="content">{{plantInfo.productName}}</el-col>
        </el-row>
        <div v-show="isShowProduct">
          <el-row class="boby">
            <el-col :span="6" class="label">产品简介</el-col>
            <el-col :span="18" class="content">{{qualificationInfo.productInfo}}</el-col>
          </el-row>
          <el-row class="boby">
            <el-col :span="6" class="label">质检部门检验报告：</el-col>
            <el-col :span="18" class="content">
              <img class="proImg" @click="preview(qualificationInfo.inspectionReport)" :src="qualificationInfo.inspectionReport" alt="">
            </el-col>
          </el-row>
          <el-row class="boby">
            <el-col :span="6" class="label">质量管理体系认证书：</el-col>
              <img class="proImg" @click="preview(qualificationInfo.qualityCertificate)" :src="qualificationInfo.qualityCertificate" alt="">
          </el-row>
          <el-row class="boby">
            <el-col :span="6" class="label">食品安全管理体系认证书：</el-col>
              <img class="proImg" @click="preview(qualificationInfo.safetyCertificate)" :src="qualificationInfo.safetyCertificate" alt="">
          </el-row>
          <el-row class="boby">
            <el-col :span="6" class="label">产品生产许可证：</el-col>
              <img class="proImg" @click="preview(qualificationInfo.license)" :src="qualificationInfo.license" alt="">
          </el-row>
          <el-row class="boby">
            <el-col :span="6" class="label">采用标准：</el-col>
              <img class="proImg" @click="preview(qualificationInfo.standard)" :src="qualificationInfo.standard" alt="">
          </el-row>
        </div>
      </div>
      <!-- 冷库信息 -->
      <div class="panel2" v-show="isShowSto">
        <el-row class="head">
          <el-col>冷库信息</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">冷库名称：</el-col>
          <el-col :span="18" class="content">{{this.storageInfo.storageName}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">冷库地址：</el-col>
          <el-col :span="18" class="content">{{this.storageInfo.storageAddr}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">入库时间：</el-col>
          <el-col :span="18" class="content">{{this.storageInfo.storageTime}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">出库时间：</el-col>
          <el-col :span="18" class="content">{{this.storageInfo.outboundTime}}</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">冷库温度：</el-col>
          <el-col :span="18" class="content">{{this.storageInfo.storageTemperature}} ℃</el-col>
        </el-row>
        <el-row class="boby">
          <el-col :span="6" class="label">检验人：</el-col>
          <el-col :span="18" class="content">{{this.storageInfo.createBy}}</el-col>
        </el-row>
      </div>
      <!-- 物流信息 -->
      <div class="panel2" v-show="isShowDeliver">
        <el-row class="head">
          <el-col>物流信息</el-col>
        </el-row>
        <el-table
          :data="deliverInfo"
          style="margin-top:0;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" label-width="85px">
                <el-form-item label="物流 ID" class="down-label">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="出发地点" class="down-label">
                  <span>{{ props.row.departureAddr }}</span>
                </el-form-item>
                <el-form-item label="收货地点" class="down-label">
                  <span>{{ props.row.arrivalAddr }}</span>
                </el-form-item>
                <el-form-item label="出发时间" class="down-label">
                  <span>{{ props.row.departureTime }}</span>
                </el-form-item>
                <el-form-item label="收货时间" class="down-label">
                  <span>{{ props.row.arrivalTime }}</span>
                </el-form-item>
                <el-form-item  tem label="操作人" class="down-label">
                  <span>{{ props.row.createBy }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="出发地点"
            prop="departureAddr">
          </el-table-column>
          <el-table-column
            label="收货地点"
            prop="arrivalAddr">
          </el-table-column>
        </el-table>
      </div>
      <!-- 农资来源信息 -->
      <el-dialog class="suppleInfo" title="农资信息" :visible.sync="isShowSupplies" width="98%">
        <el-form>
          <el-form-item label="农资名称：">
            {{suppliesInfo.suppliesName}}
          </el-form-item>
          <el-form-item label="生产日期：">
            {{suppliesInfo.productDate}}
          </el-form-item>
          <el-form-item label="到期时间：">
            {{suppliesInfo.shelfDate}}
          </el-form-item>
          <el-form-item label="检验人：">
            {{suppliesInfo.inspector}}
          </el-form-item>
          <el-form-item label="供应商：">
            {{suppliesInfo.supplierName}}
          </el-form-item>
          <el-form-item label="供应商地址：">
            {{suppliesInfo.supplierAddr}}
          </el-form-item>
          <el-form-item label="供应商电话：">
            {{suppliesInfo.supplierPhone}}
          </el-form-item>
          <el-form-item label="供应商生产许可证：">
            <img @click="preview(suppliesInfo.supplierLicense)" :src="suppliesInfo.supplierLicense">
          </el-form-item>
          <el-form-item label="农资名称：">
            <img @click="preview(suppliesInfo.suppliesPic)" :src="suppliesInfo.suppliesPic">
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 放大图片 -->
      <el-dialog :visible.sync="isPreview" width="90%">
        <img :src="previewImg" alt="" class="previewImg" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OcodeWeb',
  data() {
    return {
      // 是否显示基地信息
      isShowBase: true,
      // 是否显示虾苗来源
      isShowRouse: false,
      // 是否显示投料信息来源
      isShowFarm: false,
      // 是否显示农资来源信息
      isShowSupplies: false,
      // 是否显示加工厂信息
      isShowPlant: false,
      // 是否显示冷库信息
      isShowSto: false,
      // 是否显示产品信息
      isShowProduct: false,
      // 是否显示物流信息
      isShowDeliver: false,
      // 是否显示放大弹窗
      isPreview: false,
      // 放大弹窗图片路径
      previewImg: '',
      // 基地信息
      base: {},
      // 虾苗来源
      shrimp: {},
      // 投料信息
      shrimpFarmings: [],
      // 农资来源信息
      suppliesInfo: {},
      // 加工厂id
      plantId: '',
      // 冷库id
      storageId: '',
      // 加工厂信息
      plantInfo: {},
      // 冷库信息
      storageInfo: {},
      // 物流信息
      deliverInfo: [],
      // 产品信息
      qualificationInfo: {},
      // 基地图片
      picSet: []
    }
  },
  methods: {
    // 确认收货，物流信息更改为已抵达
    async changeLStatus() {
      const { data: res } = await this.$http.put(
        `/logistics/arrive/${this.$route.query.id}`
      )
      if (res.code !== 20000) {
        return this.$message.error('确认收货失败！！')
      }
      this.$message.success('成功进入操作页面！！')
    },
    // 获取该溯源码信息
    async getAdultShrimpInfo() {
      console.log(this.$route.query.id)
      const { data: res } = await this.$http.get(`/adultShrimp/traceability/${this.$route.query.id}`)
      if (res.code !== 20000) return this.$message.error('获取信息失败！！')
      // console.log(res)
      this.base = res.data.base
      this.shrimp = res.data.shrimp
      this.shrimpFarmings = res.data.shrimpFarmings
      this.plantId = res.data.adultShrimp.plantId
      this.storageId = res.data.adultShrimp.storageId
      this.deliverInfo = res.data.others.logistics
      // 将基地图片字符串分成数字
      this.picSet = res.data.base.basePic.split(';')
      // console.log(this.plantId)
    },
    // 农资来源信息
    async showSupplies(id) {
      this.isShowSupplies = true
      const { data: res } = await this.$http.get('/suppliesinfo/' + id)
      if (res.code !== 20000) return this.$$message.error('获取信息失败！！')
      this.suppliesInfo = res.data
    },
    // 查找加工厂信息
    async getPlantInfo() {
      // console.log(this.plantId)
      if (this.plantId !== null && this.plantId !== '') {
        const { data: res } = await this.$http.get(`/plant/${this.plantId}`)
        // console.log(res)
        this.plantInfo = res.data
      }
    },
    // 查找加工厂产品信息
    async getProduct() {
      console.log(this.plantInfo.qualificationInfo)
      if (this.plantInfo.qualificationId !== null) {
        const { data: res } = await this.$http.get(`/qualification/${this.plantInfo.qualificationId}`)
        // console.log(res)
        this.qualificationInfo = res.data
        this.isShowProduct = true
      }
    },
    // 查找冷库信息
    async getStoInfo() {
      if (this.storageId !== null && this.storageId !== '') {
        const { data: res } = await this.$http.get(`/storage/${this.storageId}`)
        this.storageInfo = res.data
        if (this.storageInfo.outboundTime === null) this.storageInfo.outboundTime = '未出库'
      }
    },
    // 放大图片
    preview(url) {
      this.isPreview = true
      this.previewImg = url
    },
    // 点击icon，切换界面
    iconbase() {
      this.isShowBase = true
      this.isShowRouse = false
      this.isShowFarm = false
      this.isShowPlant = false
      this.isShowSto = false
      this.isShowDeliver = false
    },
    // 点击icon，切换界面
    iconshrimp() {
      this.isShowBase = false
      this.isShowRouse = true
      this.isShowFarm = false
      this.isShowPlant = false
      this.isShowSto = false
      this.isShowDeliver = false
    },
    // 点击icon，切换界面
    iconfarm() {
      this.isShowBase = false
      this.isShowRouse = false
      this.isShowFarm = true
      this.isShowPlant = false
      this.isShowSto = false
      this.isShowDeliver = false
    },
    // 点击icon，切换界面
    iconplant() {
      if (this.plantId !== null && this.plantId !== '') {
        this.isShowBase = false
        this.isShowRouse = false
        this.isShowFarm = false
        this.isShowPlant = true
        this.isShowSto = false
        this.isShowDeliver = false
      } else this.$message.error('无加工厂信息！！')
    },
    // 点击icon，切换界面
    iconsto() {
      if (this.storageId !== null && this.storageId !== '') {
        this.isShowBase = false
        this.isShowRouse = false
        this.isShowFarm = false
        this.isShowPlant = false
        this.isShowSto = true
        this.isShowDeliver = false
      } else this.$message.error('无冷库信息！！')
    },
    // 点击icon，切换界面
    iconDeliver() {
      if (this.deliverInfo.length > 0) {
        this.isShowDeliver = true
        this.isShowBase = false
        this.isShowRouse = false
        this.isShowFarm = false
        this.isShowPlant = false
        this.isShowSto = false
      } else this.$message.error('无物流信息！')
    }
  },
  created() {
    this.changeLStatus()
    this.getAdultShrimpInfo().then(() => {
      this.getPlantInfo().then(() => this.getProduct())
      this.getStoInfo()
    })
  }
}
</script>

<style lang="less" scoped>
  #ocode-web {
    width: 100%;
    min-height: 100%;
    background-color: rgb(252, 244, 244);
  }
  #head2 {
    height: 3.6em;
    font-size: 1.5em;
    background-color: rgb(45, 130, 255);
    color: #fff;
    text-align: center;
    line-height: 3em;
  }
  #main2 {
    width: 100%;
    position: relative;
    top: -2em;
  }
  .heading {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    margin: 0 auto;
    width: 97%;
    background-color: #fff;
    .title {
      height: 3em;
      line-height: 3em;
      &::before {
        content: '';
        position: absolute;
        left: 0.9em;
        top: 0.5em;
        width: 1em;
        height: 2em;
        border-radius: 4px;
        background-color: rgb(45, 130, 255);
      }
      p {
        font-size: 1.3em;
        color: rgb(46, 38, 38);
        margin-left: 1.8em;
      }
    }
  }
  #select1 {
    display: flex;
    flex-wrap: wrap;
    .option {
      // flex: 1;
      width: 33%;
      text-align: center;
      i {
        font-size: 2.5em;
        // border: 1px solid black;
        margin-top: 0.4em;
        color: rgb(119, 119, 255);
        cursor: pointer;
      }
      p {
        color: rgb(87, 84, 84);
        font-size: 1em;
      }
      i:hover {
        color:rgba(0, 0, 0, 0.3);
      }
      i:active {
        color:rgba(0, 0, 0, 0.6);
      }
    }
  }
  .panel2 {
    width: 97%;
    background-color: #fff;
    margin: 1.2em auto 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border: 1px solid rgb(255, 251, 251);
    border-radius: 6px;
    color:rgb(124, 124, 124);
    .head {
      color: rgb(46, 38, 38);
      font-size: 1.2em;
      padding-left: 0.5em;
    }
    .label {
      color: rgb(46, 38, 38);
    }
    .content {
      font-size: 0.93em;
    }
    .boby {
      padding:0 0.5em;
    }
  }
  .baseinfo {
    .imgBox1 {
      margin: 0 auto 0.5em;
      border:1px solid rgb(182, 181, 181);
      border-radius: 6px;
      width: 98%;
      img {
        width:100%;
        height: 100%;
      }
    }
  }
  .suppleInfo {
    img {
      width: 150px;
      border: 1px solid black;
      border-radius: 4px;
      padding: 2px;
      margin-top:15px;
    }
  }
  .proImg {
    width: 200px;
    height: 120px;
    margin-left:20px;
    margin-top:12px;
    border: 1px solid rgb(97, 95, 95);
    padding: 5px;
    border-radius: 6px;
  }
</style>
