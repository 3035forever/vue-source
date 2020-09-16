<template>
  <div id="lcode-web">
    <div id="head1">
      <span>物流信息</span>
    </div>
    <div id="main1">
      <div id="select1">
        <div class="option" @click="intoStore">
          <i class="el-icon-mobile"></i>
          <p>进入冷库</p>
        </div>
        <!-- intoStore -->
        <div class="option" @click="intoPro">
          <i class="el-icon-house"></i>
          <p>进入加工厂</p>
        </div>
        <div class="option" @click="deliverGoods">
          <i class="el-icon-truck"></i>
          <p>物流</p>
        </div>
        <!-- @click="makeTraCode" -->
        <div class="option" @click="intoOrigin">
          <i class="el-icon-c-scale-to-original"></i>
          <p>溯源二维码</p>
        </div>
      </div>
      <!-- 进入冷库入库信息弹窗 -->
      <div class="panel1" v-show="isShowAddSto">
        <el-form
          :model="addStorage"
          :rules="rules"
          ref="addStorage"
          label-width="92px"
          :hide-required-asterisk="true"
          style="padding:1em"
          label-position="left"
        >
          <el-form-item label="冷库名称" prop="storageName">
            <el-input v-model="addStorage.storageName" clearable></el-input>
          </el-form-item>
          <el-form-item label="冷库地址" prop="storageAddr">
            <el-input v-model="addStorage.storageAddr" @blur="reload" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址经度" prop="storagePositionLongitude">
            <el-input v-model="addStorage.storagePositionLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="地址纬度" prop="storagePositionLatitude">
            <el-input v-model="addStorage.storagePositionLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库时间"  prop="storageTime">
            <el-date-picker
              v-model="addStorage.storageTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="成虾编号">
            <el-input :value="addStorage.adultShrimpId" disabled></el-input>
          </el-form-item>
          <el-form-item label="冷库温度(℃)" prop="storageTemperature" clearable>
            <el-input v-model="addStorage.storageTemperature"></el-input>
          </el-form-item>
          <el-form-item label="操作员" prop="createBy" clearable>
            <el-input v-model="addStorage.createBy"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addIntoStorage">添加</el-button>
            <el-button @click="resetForm('addStorage')">重置</el-button>
          </el-form-item>
        </el-form>
        <Map
        style="display:none"
        specialId="map"
        :receiptAddress="addStorage.storageAddr"
        @outLocation="outLocation"
        ref="addStoMap"/>
      </div>
      <!-- 进入冷库编辑信息弹窗 -->
      <div class="panel1" v-show="isShowEditSto">
        <el-form
          :model="editStorage"
          :rules="rules"
          ref="editStorage"
          label-width="92px"
          :hide-required-asterisk="true"
          style="padding:1em"
          label-position="left"
        >
          <el-form-item label="冷库名称" prop="storageName">
            <el-input v-model="editStorage.storageName" clearable></el-input>
          </el-form-item>
          <el-form-item label="冷库地址" prop="storageAddr">
            <el-input v-model="editStorage.storageAddr" @blur="reload1" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址经度" prop="storagePositionLongitude">
            <el-input v-model="editStorage.storagePositionLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="地址纬度" prop="storagePositionLatitude">
            <el-input v-model="editStorage.storagePositionLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库时间"  prop="storageTime">
            <el-date-picker
              v-model="editStorage.storageTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <!-- 动态绑定验证规则，隐藏时不需要验证 -->
          <el-form-item label="出库时间"  prop="outboundTime" :rules="isShowOutTime ? [{ required: true, message: '请输入入库时间', trigger: 'blur' }] : []" v-show="isShowOutTime">
            <el-date-picker
              v-model="editStorage.outboundTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="成虾编号">
            <el-input :value="editStorage.adultShrimpId" disabled></el-input>
          </el-form-item>
          <el-form-item label="冷库温度(℃)" prop="storageTemperature" clearable>
            <el-input v-model="editStorage.storageTemperature"></el-input>
          </el-form-item>
          <el-form-item label="操作员" prop="createBy" clearable>
            <el-input v-model="editStorage.createBy"></el-input>
          </el-form-item>
          <div style="padding-left:71px">
            <el-button size="small" type="primary" @click="editIntoStorage">修改</el-button>
            <el-button size="small" type="info" v-show="isShowOutSto" @click="outStorage">出库</el-button>
            <el-button size="small" @click="resetForm('editStorage')">重置</el-button>
            <el-button size="small" type="danger" @click="deleteSto">删除</el-button>
          </div>
        </el-form>
        <Map
        style="display:none"
        specialId="map1"
        :receiptAddress="editStorage.storageAddr"
        @outLocation="outLocation1"
        ref="editStoMap"/>
      </div>
      <!-- 进入加工厂信息弹窗 -->
      <div class="panel1" v-show="isShowAddPro">
        <el-form
          :model="addPro"
          :rules="rulesPro"
          ref="addPro"
          label-width="90px"
          :hide-required-asterisk="true"
          style="padding:1em"
          label-position="left"
        >
          <el-form-item label="加工厂名称" prop="plantName">
            <el-input v-model="addPro.plantName" clearable></el-input>
          </el-form-item>
          <el-form-item label="加工厂地址" prop="plantAddress">
            <el-input v-model="addPro.plantAddress" @blur="reload2" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址经度" prop="plantPositionLongitude">
            <el-input v-model="addPro.plantPositionLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="地址纬度" prop="plantPositionLatitude">
            <el-input v-model="addPro.plantPositionLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="addPro.productName" clearable></el-input>
          </el-form-item>
          <el-form-item label="生产时间"  prop="productionTime">
            <el-date-picker
              v-model="addPro.productionTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="成虾编号">
            <el-input :value="addPro.adultShrimpId" disabled></el-input>
          </el-form-item>
          <el-form-item label="操作员" prop="createBy" clearable>
            <el-input v-model="addPro.createBy"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addIntoPro">添加</el-button>
            <el-button @click="resetForm('addPro')">重置</el-button>
          </el-form-item>
        </el-form>
        <Map
        style="display:none"
        specialId="map2"
        :receiptAddress="addPro.plantAddress"
        @outLocation="outLocation2"
        ref="addProMap"/>
      </div>
      <!-- 进入修改加工厂信息弹窗 -->
      <div class="panel1" v-show="isShowEditPro">
        <el-form
          :model="editPro"
          :rules="rulesPro"
          ref="editPro"
          label-width="82px"
          :hide-required-asterisk="true"
          style="padding:1em"
          label-position="left"
        >
          <el-form-item label="加工厂名称" prop="plantName">
            <el-input v-model="editPro.plantName" clearable></el-input>
          </el-form-item>
          <el-form-item label="加工厂地址" prop="plantAddress">
            <el-input v-model="editPro.plantAddress" @blur="reload3" clearable></el-input>
          </el-form-item>
          <el-form-item label="地址经度" prop="plantPositionLongitude">
            <el-input v-model="editPro.plantPositionLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="地址纬度" prop="plantPositionLatitude">
            <el-input v-model="editPro.plantPositionLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="editPro.productName" clearable></el-input>
          </el-form-item>
          <el-form-item label="生产时间"  prop="productionTime">
            <el-date-picker
              v-model="editPro.productionTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="成虾编号">
            <el-input :value="editPro.adultShrimpId" disabled></el-input>
          </el-form-item>
          <el-form-item label="操作员" prop="createBy">
            <el-input v-model="editPro.createBy" clearable></el-input>
          </el-form-item>
          <div style="padding-left:8.2pxpx">
            <el-button size="small" type="primary" @click="editIntoPro">修改</el-button>
            <el-button size="small" type="success" @click="showProduct">产品</el-button>
            <el-button size="small" type="info" @click="addProStep">工艺</el-button>
            <el-button size="small" @click="resetForm('editPro')">重置</el-button>
            <el-button size="small" @click="deletePro" type="danger">删除</el-button>
          </div>
        </el-form>
        <Map
        style="display:none"
        specialId="map3"
        :receiptAddress="editPro.plantAddress"
        @outLocation="outLocation3"
        ref="editProMap"/>
      </div>
      <!-- 展示物流页面 -->
      <div class="panel1" v-show="isShowDeliver">
        <div style="float:right;padding: 0.5em 0.5em 0 0">
          <el-button size="small" type="primary" @click="addDeliver = true">添加物流</el-button>
        </div>
        <el-table
          :data="deliverList"
          style="margin-top:0;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" label-width="80px">
                <el-form-item label="物流 ID" class="down-label">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="出发地址" class="down-label">
                  <span>{{ props.row.departureAddr }}</span>
                </el-form-item>
                <el-form-item label="出发地址经度" class="down-label">
                  <span>{{ props.row.logisticsStartLongitude }}</span>
                </el-form-item>
                <el-form-item label="出发地址纬度" class="down-label">
                  <span>{{ props.row.logisticsStartLatitude }}</span>
                </el-form-item>
                <el-form-item label="收货地址" class="down-label">
                  <span>{{ props.row.arrivalAddr }}</span>
                </el-form-item>
                <el-form-item label="收货地址经度" class="down-label">
                  <span>{{ props.row.logisticsArrivalLongitude }}</span>
                </el-form-item>
                <el-form-item label="收货地址纬度" class="down-label">
                  <span>{{ props.row.logisticsArrivalLatitude }}</span>
                </el-form-item>
                <el-form-item label="出发时间" class="down-label">
                  <span>{{ props.row.departureTime }}</span>
                </el-form-item>
                <el-form-item label="到达时间" class="down-label">
                  <span>{{ props.row.arrivalTime }}</span>
                </el-form-item>
                <el-form-item label="操作人" class="down-label">
                  <span>{{ props.row.createBy }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="物流 ID"
            prop="id">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog1(scope.row.id)"
              ></el-button>

              <!-- 删除按钮 -->
              <!-- type="danger": 红色警告按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeProcessingById1(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="pageInfo1.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="pageInfo1.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total1"
        >
        </el-pagination>
      </div>
      <!-- 修改物流信息的面板 -->
      <el-dialog
        title="修改物流信息"
        :visible.sync="editDeliver"
        width="98%"
        @close="editDeliverClosed"
      >
        <!-- 内容主题区 -->
        <el-form
          label-position="left"
          :hide-required-asterisk="true"
          :model="editDeliverForm"
          :rules="editDeliverFormRules"
          ref="editDeliverFormRef"
          label-width="5em"
        >
          <el-form-item label="出发地址" prop="departureAddr">
            <el-input v-model="editDeliverForm.departureAddr" @blur="reload6"></el-input>
          </el-form-item>
          <el-form-item label="出发地址经度" prop="logisticsStartLongitude">
            <el-input v-model="editDeliverForm.logisticsStartLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="出发地址纬度" prop="logisticsStartLatitude">
            <el-input v-model="editDeliverForm.logisticsStartLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="出发时间" prop="departureTime">
            <el-date-picker
              v-model="editDeliverForm.departureTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收货地址" prop="arrivalAddr">
            <el-input v-model="editDeliverForm.arrivalAddr" @blur="reload7"></el-input>
          </el-form-item>
          <el-form-item label="收货地址经度" prop="logisticsArrivalLongitude">
            <el-input v-model="editDeliverForm.logisticsArrivalLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="收货地址纬度" prop="logisticsArrivalLatitude">
            <el-input v-model="editDeliverForm.logisticsArrivalLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="收货时间" prop="arrivalTime">
            <el-date-picker
              v-model="editDeliverForm.arrivalTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人" prop="createBy">
            <el-input v-model="editDeliverForm.createBy"></el-input>
          </el-form-item>
        </el-form>
        <!-- 页脚 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDeliver = false">取 消</el-button>
          <el-button type="primary" @click="editDeliverFarming"
            >确 定</el-button>
        </span>
        <Map
        style="display:none"
        specialId="map6"
        :receiptAddress="editDeliverForm.departureAddr"
        @outLocation="outLocation6"
        ref="editDeliverMap1"/>
        <Map
        style="display:none"
        specialId="map7"
        :receiptAddress="editDeliverForm.arrivalAddr"
        @outLocation="outLocation7"
        ref="editDeliverMap2"/>
      </el-dialog>
      <!-- 溯源二维码页面 -->
      <div class="panel1" v-show="isShowOrigin">
        <div id="ocode" ref="ocode" style="margin:20px auto"></div>
        <p style="text-align:center;font-size:20px">溯源码 {{this.$route.query.id}}</p>
        <el-button type="primary" @click="toOcodeWeb">确 定</el-button>
      </div>
      <!-- 工艺信息界面 -->
      <div class="panel1" v-show="isShowAddProStep">
        <div style="float:right;padding: 0.5em 0.5em 0 0">
          <el-button size="small" type="primary" @click="processingDialogVisible = true">添加工艺</el-button>
          <el-button size="small" type="info" @click="backProduct">返回</el-button>
        </div>
        <el-table
          :data="processingList"
          style="margin-top:0;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" label-width="80px">
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
          <el-table-column
            label="工艺名称"
            prop="processName">
          </el-table-column>
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
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        >
        </el-pagination>
      </div>
      <!-- 添加产品界面 -->
      <div class="panel1" v-show="isShowAddProduct">
        <el-form v-model="proInfo" label-width="5em" style="padding:1em" label-position="left">
          <el-form-item label="产品名称">
            <el-input placeholder="请输入产品名称" v-model="temImgPath.productName" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品信息">
            <el-input placeholder="请输入产品信息" type="textarea" rows="5" v-model="temImgPath.productInfo"></el-input>
          </el-form-item>
          <el-form-item label="质检部门检验报告" label-width="140px">
            <div class="addBox">
              <div class="addBox-img" v-show="!!(temImgPath.inspection.path)">
                <img :src="temImgPath.inspection.path">
                <span class="mask">
                  <span class="mask-icon1" @click=preview(temImgPath.inspection.path)><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click=deleteImg1(0)><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <div class="addBox-icon" v-show="!(temImgPath.inspection.path)">
                <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {upImg(file,fileList,'inspection')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="质量管理体系认证书" label-width="140px">
            <div class="addBox">
              <div class="addBox-img" v-show="!!(temImgPath.quality.path)">
                <img :src="temImgPath.quality.path">
                <span class="mask">
                  <span class="mask-icon1" @click=preview(temImgPath.quality.path)><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click=deleteImg1(1)><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <div class="addBox-icon" v-show="!(temImgPath.quality.path)">
                <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {upImg(file,fileList,'quality')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="食品安全管理体系认证书" label-width="140px">
            <div class="addBox">
              <div class="addBox-img" v-show="!!(temImgPath.safety.path)">
                <img :src="temImgPath.safety.path">
                <span class="mask">
                  <span class="mask-icon1" @click=preview(temImgPath.safety.path)><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click=deleteImg1(2)><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <div class="addBox-icon" v-show="!(temImgPath.safety.path)">
                <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {upImg(file,fileList,'safety')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="产品生存许可证" label-width="140px">
            <div class="addBox">
              <div class="addBox-img" v-show="!!(temImgPath.licensePic.path)">
                <img :src="temImgPath.licensePic.path">
                <span class="mask">
                  <span class="mask-icon1" @click=preview(temImgPath.licensePic.path)><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click=deleteImg1(3)><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <div class="addBox-icon" v-show="!(temImgPath.licensePic.path)">
                <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {upImg(file,fileList,'licensePic')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="采用标准" label-width="140px">
            <div class="addBox">
              <div class="addBox-img" v-show="!!(temImgPath.standardPic.path)">
                <img :src="temImgPath.standardPic.path">
                <span class="mask">
                  <span class="mask-icon1" @click=preview(temImgPath.standardPic.path)><i class="el-icon-zoom-in"></i></span>
                  <span class="mask-icon2" @click=deleteImg1(4)><i class="el-icon-delete"></i></span>
                </span>
              </div>
              <div class="addBox-icon" v-show="!(temImgPath.standardPic.path)">
                <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {upImg(file,fileList,'standardPic')}">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <div style="margin-left:5em">
            <el-button size="small" type="primary" @click="addProInfo">确定</el-button>
          </div>
        </el-form>
      </div>
      <!-- 修改产品界面 -->
      <div class="panel1" v-show="isShowEditProduct">
        <el-form v-model="proInfo" label-width="5em" style="padding:1em" label-position="left">
        <el-form-item label="产品名称">
          <el-input placeholder="请输入产品名称" v-model="editPath.productName" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品信息">
          <el-input placeholder="请输入产品信息" type="textarea" rows="5" v-model="editPath.productInfo"></el-input>
        </el-form-item>
        <el-form-item label="质检部门检验报告" label-width="140px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!(editPath.inspection.path)">
              <img :src="editPath.inspection.path">
              <span class="mask">
                <span class="mask-icon3" @click=preview(editPath.inspection.path)><i class="el-icon-zoom-in"></i></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {editImg(file,fileList,'inspection')}">
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="质量管理体系认证书" label-width="140px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!(editPath.quality.path)">
              <img :src="editPath.quality.path">
              <span class="mask">
                <span class="mask-icon3" @click=preview(editPath.quality.path)><i class="el-icon-zoom-in"></i></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {editImg(file,fileList,'quality')}">
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="食品安全管理体系认证书" label-width="140px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!(editPath.safety.path)">
              <img :src="editPath.safety.path">
              <span class="mask">
                <span class="mask-icon3" @click=preview(editPath.safety.path)><i class="el-icon-zoom-in"></i></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {editImg(file,fileList,'safety')}">
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="产品生存许可证" label-width="140px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!(editPath.licensePic.path)">
              <img :src="editPath.licensePic.path">
              <span class="mask">
                <span class="mask-icon3" @click=preview(editPath.licensePic.path)><i class="el-icon-zoom-in"></i></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {editImg(file,fileList,'licensePic')}">
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="采用标准" label-width="140px">
          <div class="addBox">
            <div class="addBox-img" v-show="!!(editPath.standardPic.path)">
              <img :src="editPath.standardPic.path">
              <span class="mask">
                <span class="mask-icon3" @click=preview(editPath.standardPic.path)><i class="el-icon-zoom-in"></i></span>
              </span>
            </div>
            <div class="addBox-icon">
              <el-upload :show-file-list="false" action="none" :auto-upload="false" :on-change="function upchange(file,fileList) {editImg(file,fileList,'standardPic')}">
                <i class="el-icon-edit"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <div style="margin-left:5em">
          <el-button size="small" @click="editProInfo">修改</el-button>
          <el-button size="small" type="danger" @click="deleteProInfo">删除</el-button>
        </div>
      </el-form>
      </div>
      <!-- 添加物流的面板 -->
      <el-dialog
        title="添加物流"
        :visible.sync="addDeliver"
        width="98%"
        @close="addDeliverClosed"
      >
        <!-- 内容主体区 -->
        <el-form
          label-position="left"
          :hide-required-asterisk="true"
          :model="deliverForm"
          :rules="deliverFormRules"
          ref="deliverFormRef"
          label-width="7em"
        >
          <el-form-item label="出发地址" prop="departureAddr">
            <el-input v-model="deliverForm.departureAddr" @blur="reload4"></el-input>
          </el-form-item>
          <el-form-item label="出发地址经度" prop="logisticsStartLongitude">
            <el-input v-model="deliverForm.logisticsStartLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="出发地址纬度" prop="logisticsStartLatitude">
            <el-input v-model="deliverForm.logisticsStartLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="出发时间" prop="departureTime">
            <el-date-picker
              v-model="deliverForm.departureTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收货地址" prop="arrivalAddr">
            <el-input v-model="deliverForm.arrivalAddr" @blur="reload5"></el-input>
          </el-form-item>
          <el-form-item label="收货地址经度" prop="logisticsArrivalLongitude">
            <el-input v-model="deliverForm.logisticsArrivalLongitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="收货地址纬度" prop="logisticsArrivalLatitude">
            <el-input v-model="deliverForm.logisticsArrivalLatitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="操作人" prop="createBy">
            <el-input v-model="deliverForm.createBy"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDeliver = false">取 消</el-button>
          <el-button type="primary" @click="addToDeliver">确 定</el-button>
        </span>
        <Map
        style="display:none"
        specialId="map4"
        :receiptAddress="deliverForm.departureAddr"
        @outLocation="outLocation4"
        ref="addDeliverMap1"/>
        <Map
        style="display:none"
        specialId="map5"
        :receiptAddress="deliverForm.arrivalAddr"
        @outLocation="outLocation5"
        ref="addDeliverMap2"/>
      </el-dialog>
      <!-- 添加工艺的面板 -->
      <el-dialog
        title="添加工艺"
        :visible.sync="processingDialogVisible"
        width="98%"
        @close="processingDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form
          label-position="left"
          :hide-required-asterisk="true"
          :model="processingForm"
          :rules="processingFormRules"
          ref="processingFormRef"
          label-width="5em"
        >
          <el-form-item label="工艺名称" prop="processName">
            <el-input v-model="processingForm.processName"></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="responsible">
            <el-input v-model="processingForm.responsible"></el-input>
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
                  @click="deleteImg1(0)"
                  ><i class="el-icon-delete"></i
                ></span>
              </span>
            </div>
            <el-upload
              class="avatar-uploader"
              action="http://106.75.154.40:9011/processing/addPic"
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
        width="98%"
        @close="aditDialogClosed"
      >
        <!-- 内容主题区 -->
        <el-form
          label-position="left"
          :hide-required-asterisk="true"
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="5em"
        >
          <el-form-item label="工艺名称" prop="processName">
            <el-input v-model="editForm.processName"></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="responsible">
              <el-input v-model="editForm.responsible"></el-input>
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
              action="http://106.75.154.40:9011/processing/addPic"
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
      <el-dialog :visible.sync="isPreview" width="90%">
        <img :src="previewImg" alt="" class="previewImg" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import $ from 'jquery'
import Map from '../Map'
export default {
  name: 'LcodeWeb',
  components: {
    Map
  },
  data() {
    return {
      // 产品信息
      proInfo: [],
      // 是否已经入库
      alreadyintoSto: false,
      // 是否已经入工厂
      alreadyintoPro: false,
      // 是否已经有产品信息
      alreadyHasPro: false,
      // 是否显示冷库入库弹窗
      isShowAddSto: false,
      // 是否显示冷库编辑弹窗
      isShowEditSto: false,
      // 是否显示出库按钮,
      isShowOutSto: false,
      // 是否显示修改时间
      isShowOutTime: false,
      // 是否显示加工厂弹窗
      isShowAddPro: false,
      // 是否显示修改加工厂弹窗
      isShowEditPro: false,
      // 是否显示添加工艺弹窗
      isShowAddProStep: false,
      // 是否显示添加产品信息弹窗
      isShowAddProduct: false,
      // 是否显示修改产品信息弹窗
      isShowEditProduct: false,
      // 是否显示溯源二维码
      isShowOrigin: false,
      // 是否显示添加物流
      isShowDeliver: false,
      // 是否显示添加物流弹窗
      addDeliver: false,
      // 是否显示修改物流弹窗
      editDeliver: false,
      // 添加冷库弹窗
      addStorage: {
        storageName: '',
        storageAddr: '',
        storagePositionLongitude: '',
        storagePositionLatitude: '',
        storageTime: '',
        adultShrimpId: this.$route.query.id,
        storageTemperature: '',
        createBy: ''
      },
      // 修改冷库弹窗
      editStorage: {
        storageId: '',
        storageName: '',
        storageAddr: '',
        storagePositionLongitude: '',
        storagePositionLatitude: '',
        storageTime: '',
        adultShrimpId: this.$route.query.id,
        storageTemperature: '',
        createBy: '',
        outboundStatus: '',
        outboundTime: ''
      },
      // 添加工厂弹窗信息
      addPro: {
        plantName: '',
        plantAddress: '',
        plantPositionLongitude: '',
        plantPositionLatitude: '',
        productionTime: '',
        adultShrimpId: this.$route.query.id,
        productName: '',
        createBy: ''
      },
      // 修改工厂信息弹窗
      editPro: {
        plantId: '',
        plantName: '',
        plantAddress: '',
        plantPositionLongitude: '',
        plantPositionLatitude: '',
        productionTime: '',
        adultShrimpId: this.$route.query.id,
        productName: '',
        createBy: ''
      },
      // 添加产品信息
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
      // 修改产品信息
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
      // 进入冷库验证规则
      rules: {
        storageName: [
          { required: true, message: '请输入冷库名称', trigger: 'blur' }
        ],
        storageAddr: [
          { required: true, message: '请输入冷库地址', trigger: 'blur' }
        ],
        storageTemperature: [
          { required: true, message: '请输入冷库温度', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '请输入操作员名称', trigger: 'blur' }
        ],
        storagePositionLongitude: [
          { required: true, message: '无经度', trigger: 'blur' }
        ],
        storagePositionLatitude: [
          { required: true, message: '无纬度', trigger: 'blur' }
        ],
        storageTime: [
          { required: true, message: '请输入入库时间', trigger: 'blur' }
        ]
      },
      // 进入加工厂验证规则
      rulesPro: {
        plantName: [
          { required: true, message: '请输入加工厂名称', trigger: 'blur' }
        ],
        plantAddress: [
          { required: true, message: '请输入加工厂地址', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '请输入操作员', trigger: 'blur' }
        ],
        productionTime: [
          { required: true, message: '请输入生产时间', trigger: 'blur' }
        ]
      },
      // 放大图片路径
      previewImg: '',
      // 总条数
      total: 0,
      total1: 0,
      // 用于控制分页的当前页码和条数
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },
      // 用于控制分页的当前页码和条数
      pageInfo1: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },
      // 控制添加面板的显示和隐藏
      processingDialogVisible: false,
      // 控制修改面板的显示和隐藏
      aditDialogVisible: false,
      // 控制放大面板的显示和隐藏
      isPreview: false,
      // 添加工艺的验证规则对象
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
      // 添加工艺表单数据
      processingForm: {
        processName: '',
        responsible: '',
        step: '',
        description: '',
        onTime: '',
        processPic: '',
        plantId: ''
      },
      // 添加物流的验证规则对象
      deliverFormRules: {
        departureAddr: [
          { required: true, message: '请输入出发地址', trigger: 'blur' }
        ],
        arrivalAddr: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ],
        createBy: [{ required: true, message: '请输入操作人名称', trigger: 'blur' }],
        departureTime: [{ required: true, message: '请输入出发时间', trigger: 'blur' }],
        logisticsStartLongitude: [{ required: true, message: '请输入出发地址经度', trigger: 'blur' }],
        logisticsStartLatitude: [{ required: true, message: '请输入出发地址纬度', trigger: 'blur' }],
        logisticsArrivalLongitude: [{ required: true, message: '请输入收货地址经度', trigger: 'blur' }],
        logisticsArrivalLatitude: [{ required: true, message: '请输入收货地址纬度', trigger: 'blur' }]
      },
      // 修改物流的验证规则对象
      editDeliverFormRules: {
        departureAddr: [
          { required: true, message: '请输入出发地址', trigger: 'blur' }
        ],
        arrivalAddr: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ],
        createBy: [{ required: true, message: '请输入操作人名称', trigger: 'blur' }],
        departureTime: [{ required: true, message: '请输入出发时间', trigger: 'blur' }],
        arrivalTime: [{ required: true, message: '请输入收货时间', trigger: 'blur' }],
        logisticsStartLongitude: [{ required: true, message: '请输入出发地址经度', trigger: 'blur' }],
        logisticsStartLatitude: [{ required: true, message: '请输入出发地址纬度', trigger: 'blur' }],
        logisticsArrivalLongitude: [{ required: true, message: '请输入收货地址经度', trigger: 'blur' }],
        logisticsArrivalLatitude: [{ required: true, message: '请输入收货地址纬度', trigger: 'blur' }]
      },
      // 添加工艺表单数据
      deliverForm: {
        departureAddr: '',
        logisticsStartLongitude: '',
        logisticsStartLatitude: '',
        arrivalAddr: '',
        logisticsArrivalLongitude: '',
        logisticsArrivalLatitude: '',
        departureTime: '',
        adultShrimpId: '',
        createBy: ''
      },
      // 修改物流信息
      editDeliverForm: {},
      // 工艺信息列表数据
      processingList: [],
      // 物流信息
      deliverList: [],
      // 查询到的工艺信息对象，用于修改工艺信息
      editForm: {}
    }
  },
  methods: {
    // 获取物流信息
    async getDeliverInfo() {
      const { data: res } = await this.$http.post(
        `/logistics/search/${this.pageInfo1.pagenum}/${this.pageInfo1.pagesize}`,
        {
          adultShrimpId: this.$route.query.id
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取加工信息列表失败！！')
      }
      this.deliverList = res.data.rows
      this.total1 = res.data.total
    },
    // 删除产品信息
    deleteProInfo() {
      // console.log(row)
      this.$confirm('是否确认删除？', '提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: '放弃',
        confirmButtonText: '确认'
      }).then(async () => {
        const { data: res } = await this.$http.delete(
          `qualification/${this.editPro.qualificationId}`
        )
        if (res.code !== 20000) return this.$message.error('删除失败！！')
        this.$message.success('删除成功！！')
        this.alreadyHasPro = false
        this.editPro.qualificationId = undefined
        this.showProduct()
      }).catch(() => {
        this.$message.info('放弃操作')
      })
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
      // console.log(editInfo.get('inspection'))
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.post(`/qualification/${this.editPro.qualificationId}`, editInfo)
      if (res.code !== 20000) {
        loading.close()
        return this.$message.error('修改产品信息失败！！')
      }
      loading.close()
      this.$message.success('修改产品信息成功！！')
      // 刷新列表
      this.getProInfo()
    },
    // 获取产品信息
    async getProInfo() {
      console.log(this.editPro.qualificationId)
      if (this.editPro.qualificationId !== undefined && this.editPro.qualificationId !== null) {
        const { data: res } = await this.$http.post(
          '/qualification/search/',
          {
            id: this.editPro.qualificationId
          }
        )
        if (res.code !== 20000) return this.$message.error('获取产品信息失败！！')
        if (res.data.length !== 0) {
          this.editPath.productName = res.data[0].productName
          this.editPath.productInfo = res.data[0].productInfo
          this.editPath.inspection.path = res.data[0].inspectionReport
          this.editPath.quality.path = res.data[0].qualityCertificate
          this.editPath.safety.path = res.data[0].safetyCertificate
          this.editPath.licensePic.path = res.data[0].license
          this.editPath.standardPic.path = res.data[0].standard
          this.alreadyHasPro = true
        }
        console.log(this.proInfo)
      }
    },
    // 添加产品信息
    async addProInfo() {
      // 新创建一个formdata
      const addInfo = new FormData()
      console.log(this.editPro.plantId)
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
      addInfo.append('plantId', this.editPro.plantId)
      // addInfo.append('baseId', '1248910886228332544')
      // console.log(addInfo.get('inspection'))
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.post('/qualification/mobileAdd', addInfo)
      if (res.code !== 20000) {
        loading.close()
        return this.$message.error('添加产品信息失败！！')
      }
      loading.close()
      this.$message.success('添加产品信息成功！！')
      // 刷新列表
      this.getProInfo().then(() => {
        this.isShowAddProduct = false
        this.isShowEditProduct = true
      })
    },
    // 上传产品图片
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
    // 添加产品信息
    showProduct() {
      this.temImgPath.productName = this.editPro.productName
      this.editPath.productName = this.editPro.productName
      if (this.alreadyHasPro) {
        this.isShowEditProduct = true
        this.isShowAddProduct = false
        this.isShowAddSto = false
        this.isShowEditSto = false
        this.isShowAddPro = false
        this.isShowEditPro = false
      } else {
        this.isShowAddProduct = true
        this.isShowEditProduct = false
        this.isShowAddSto = false
        this.isShowEditSto = false
        this.isShowAddPro = false
        this.isShowEditPro = false
      }
    },
    // 删除冷库信息
    async deleteSto() {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该冷库信息, 是否继续?',
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
      const { data: res } = await this.$http.delete(`/storage/${this.editStorage.storageId}`)
      if (res.code !== 20000) this.$message.error('删除冷库信息失败！！')
      this.$message.success('删除冷库信息成功！！')
      this.judgeInfo().then(() => {
        // 将已经进入冷库的信息删除
        this.alreadyintoSto = false
        this.isShowEditSto = false
        this.resetForm('addStorage')
      })
    },
    // 删除加工厂信息
    async deletePro() {
      // 弹框询问是否删除数据
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
      ).catch(err => {
        return err
      })
      // 如果确认删除，则返回值为字符串 confirm
      // 如果取消了删除， 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        // this.$message.info: 灰色提示框
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`/plant/${this.editPro.plantId}`)
      if (res.code !== 20000) this.$message.error('删除加工厂信息失败！！')
      this.$message.success('删除加工厂信息成功！！')
      this.judgeInfoPro().then(() => {
        // 将已经进入加工厂的信息删除
        this.alreadyintoPro = false
        this.isShowEditPro = false
        this.resetForm('addPro')
      })
      // 删除加工厂，顺便把关联的工艺删除
      for (var i = 0; i < this.processingList.length; i++) {
        const { data: res } = await this.$http.delete(`/processing/${this.processingList[i].id}`)
      }
    },
    // 返回加工厂
    backProduct() {
      this.judgeInfoPro().then(() => {
        this.isShowAddProStep = false
      })
    },
    // 修改图片上传成功函数
    editSuccess(res, file) {
      this.editForm.processPic = res.data
    },
    // 监听修改对话框的关闭事件,关闭时对表单进行重置
    aditDialogClosed() {
      this.$refs.editFormRef.resetFields()
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
    // 修改物流信息并提交
    editDeliverFarming() {
      // 先进行表单的预验证
      this.$refs.editDeliverFormRef.validate(async valid => {
        if (!valid) return false
        // 正确，则会发起修改信息的请求
        // 转化时间为标准形式
        var date = new Date(this.editDeliverForm.departureTime)
        this.editDeliverForm.departureTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        var date1 = new Date(this.editDeliverForm.arrivalTime)
        this.editDeliverForm.arrivalTime = `${date1.getFullYear()}-${date1.getMonth() +
          1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        const { data: res } = await this.$http.put(
          '/logistics/' + this.editDeliverForm.id,
          this.editDeliverForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新该物流信息失败！！')
        }
        // 关闭对话框
        this.editDeliver = false
        // 刷新列表
        this.getDeliverInfo()
        // 提示修改成功
        this.$message.success('更新该物流信息成功！！')
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
    // 展示修改的对话框
    async showEditDialog1(id) {
      const { data: res } = await this.$http.get('/logistics/' + id)
      if (res.code !== 20000) {
        return this.$message.error('查询该物流信息失败！！')
      }
      this.editDeliverForm = res.data
      console.log(this.editDeliverForm)
      this.editDeliver = true
    },
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
    // 监听pagesize(每页显示条数)改变事件
    handleSizeChange1(newSize) {
      this.pageInfo1.pagesize = newSize
      this.getDeliverInfo()
    },
    // 监听页码值改变的事件
    handleCurrentChange1(newPage) {
      this.pageInfo1.pagenum = newPage
      this.getDeliverInfo()
    },
    // 监听添加对话框的关闭事件,关闭时对表单进行重置
    processingDialogClosed() {
      this.$refs.processingFormRef.resetFields()
      this.processingForm.processPic = ''
    },
    // 监听添加对话框的关闭事件,关闭时对表单进行重置
    addDeliverClosed() {
      this.$refs.deliverFormRef.resetFields()
    },
    // 监听添加对话框的关闭事件,关闭时对表单进行重置
    editDeliverClosed() {
      this.$refs.editDeliverFormRef.resetFields()
    },
    // 根据删除工艺
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
    },
    // 根据删除物流
    async removeProcessingById1(id) {
      // 弹框询问是否删除数据
      // 前提：在elementUI中挂载confirm
      // （提示消息，标题文本，｛确认按钮的文本，取消按钮的文本，提示的类型｝）
      const confirmResult = await this.$confirm(
        '此操作将永久删除该物流信息, 是否继续?',
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
      const { data: res } = await this.$http.delete('/logistics/' + id)
      if (res.code !== 20000) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功！！')
      this.getDeliverInfo()
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
        this.processingForm.plantId = this.editPro.plantId
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
    // 添加物流
    addToDeliver() {
      // 先进行表单的预校验
      this.$refs.deliverFormRef.validate(async valid => {
        // 表单自身方法：validate：进行表单预验证，放回验证结果，用valid接收
        if (!valid) return false
        var date = new Date(this.deliverForm.departureTime)
        this.deliverForm.departureTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.deliverForm.adultShrimpId = this.$route.query.id
        const { data: res } = await this.$http.post(
          '/logistics',
          this.deliverForm
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('添加物流失败！！')
        }
        this.$message.success('添加物流成功!!')
        // 隐藏添加的对话框
        this.addDeliver = false
        // 成功后新增，需要刷新列表
        this.getDeliverInfo()
      })
    },
    // 工艺信息获取列表
    async getProcessingList() {
      const { data: res } = await this.$http.post(
        `/processing/search/${this.pageInfo.pagenum}/${this.pageInfo.pagesize}`,
        {
          plantId: this.editPro.plantId
        }
      )
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('获取加工信息列表失败！！')
      }
      this.processingList = res.data.rows
      this.total = res.data.total
    },
    // 图片上传前判断
    beforeAdd(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 删除图片
    deleteImg(url) {
      this.processingForm.processPic = ''
      this.editForm.processPic = ''
      $.ajax({
        url: 'http://106.75.154.40:9011//processing/delPic',
        type: 'POST',
        data: {
          _method: 'DELETE',
          delUrl: url
        }
      })
      this.$message.success('图片删除成功！！')
    },
    // 产品信息删除图片，回显路径置空
    deleteImg1(num) {
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
    // 添加图片上传成功函数
    addSuccess(res, file) {
      this.processingForm.processPic = res.data
    },
    // 放大图片
    preview(processPic) {
      this.isPreview = true
      this.previewImg = processPic
    },
    // 查看资料放大图片
    previewInfo(src) {
      this.isPreview = true
      this.previewImg = src
    },
    // 添加冷库关联地图
    reload() {
      this.$refs.addStoMap.onKeyDown()
    },
    outLocation(lat, lng) {
      this.addStorage.storagePositionLongitude = lng
      this.addStorage.storagePositionLatitude = lat
    },
    // 修改冷库关联地图
    reload1() {
      this.$refs.editStoMap.onKeyDown()
    },
    outLocation1(lat, lng) {
      this.editStorage.storagePositionLongitude = lng
      this.editStorage.storagePositionLatitude = lat
    },
    // 添加加工厂关联地图
    reload2() {
      this.$refs.addProMap.onKeyDown()
    },
    outLocation2(lat, lng) {
      this.addPro.plantPositionLongitude = lng
      this.addPro.plantPositionLatitude = lat
    },
    // 修改加工厂关联地图
    reload3() {
      this.$refs.editProMap.onKeyDown()
    },
    outLocation3(lat, lng) {
      this.editPro.plantPositionLongitude = lng
      this.editPro.plantPositionLatitude = lat
    },
    // 添加物流信息关联地图
    reload4() {
      this.$refs.addDeliverMap1.onKeyDown()
    },
    outLocation4(lat, lng) {
      this.deliverForm.logisticsStartLongitude = lng
      this.deliverForm.logisticsStartLatitude = lat
    },
    reload5() {
      this.$refs.addDeliverMap2.onKeyDown()
    },
    outLocation5(lat, lng) {
      this.deliverForm.logisticsArrivalLongitude = lng
      this.deliverForm.logisticsArrivalLatitude = lat
    },
    reload6() {
      this.$refs.editDeliverMap1.onKeyDown()
    },
    outLocation6(lat, lng) {
      this.editDeliverForm.logisticsArrivalLongitude = lng
      this.editDeliverForm.logisticsArrivalLatitude = lat
    },
    reload7() {
      this.$refs.editDeliverMap2.onKeyDown()
    },
    outLocation7(lat, lng) {
      this.editDeliverForm.logisticsArrivalLongitude = lng
      this.editDeliverForm.logisticsArrivalLatitude = lat
    },
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
    // 点击冷库icon，切换界面
    intoStore() {
      // 如果已经入库的，点击冷库icon就会进入修改页面，不会进入添加页面
      if (this.alreadyintoSto) {
        this.isShowEditSto = true
        this.isShowAddSto = false
        this.isShowAddPro = false
        this.isShowEditPro = false
        this.isShowAddProStep = false
        this.isShowAddProduct = false
        this.isShowEditProduct = false
        this.isShowOrigin = false
        this.isShowDeliver = false
      } else {
        this.isShowEditSto = false
        this.isShowAddSto = true
        this.isShowAddPro = false
        this.isShowEditPro = false
        this.isShowAddProStep = false
        this.isShowAddProduct = false
        this.isShowEditProduct = false
        this.isShowOrigin = false
        this.isShowDeliver = false
      }
    },
    // 点击加工厂icon，切换界面
    intoPro() {
      // 如果已经进入加工厂，点击加工厂icon会进入修改页面，不会就进入添加页面
      if (this.alreadyintoPro) {
        this.isShowEditPro = true
        this.isShowAddPro = false
        this.isShowAddSto = false
        this.isShowEditSto = false
        this.isShowAddProStep = false
        this.isShowAddProduct = false
        this.isShowEditProduct = false
        this.isShowOrigin = false
        this.isShowDeliver = false
      } else {
        this.isShowEditPro = false
        this.isShowAddPro = true
        this.isShowAddSto = false
        this.isShowEditSto = false
        this.isShowAddProStep = false
        this.isShowAddProduct = false
        this.isShowEditProduct = false
        this.isShowOrigin = false
        this.isShowDeliver = false
      }
    },
    // 点击物流icon，切换界面
    deliverGoods() {
      this.isShowEditPro = false
      this.isShowAddPro = false
      this.isShowAddSto = false
      this.isShowEditSto = false
      this.isShowAddProStep = false
      this.isShowAddProduct = false
      this.isShowEditProduct = false
      this.isShowOrigin = false
      this.isShowDeliver = true
      this.getDeliverInfo()
    },
    // 点击溯源二维码，切换界面
    intoOrigin() {
      this.isShowOrigin = true
      this.isShowEditPro = false
      this.isShowAddPro = false
      this.isShowAddSto = false
      this.isShowEditSto = false
      this.isShowAddProStep = false
      this.isShowAddProduct = false
      this.isShowEditProduct = false
      this.isShowDeliver = false
      this.$refs.ocode.innerHTML = ''
      this.$nextTick(() => {
        this.createocode()
      })
    },
    // 前往判断是否溯源收货页面
    toOcodeWeb() {
      this.$router.push({
        path: '/IsArriveOcode',
        query: { id: this.$route.query.id }
      })
    },
    // 生成溯源二维码
    createocode() {
      new QRCode('ocode', {
        width: 250,
        height: 250
      }).makeCode('http://120.78.14.141:9010/#/IsArriveOcode?id=' + this.$route.query.id)
    },
    // 入库
    addIntoStorage() {
      this.$refs.addStorage.validate(async (valid) => {
        if (!valid) return false
        // 日期转换
        var prodate = new Date(this.addStorage.storageTime)
        this.addStorage.storageTime = `${prodate.getFullYear()}-${prodate.getMonth() +
          1}-${prodate.getDate()} ${prodate.getHours()}:${prodate.getMinutes()}:${prodate.getSeconds()}`
        console.log(this.addStorage)
        const { data: res } = await this.$http.post('/storage', {
          storageName: this.addStorage.storageName,
          storageAddr: this.addStorage.storageAddr,
          storagePositionLongitude: this.addStorage
            .storagePositionLongitude,
          storagePositionLatitude: this.addStorage.storagePositionLatitude,
          storageTime: this.addStorage.storageTime,
          storageTemperature: this.addStorage.storageTemperature,
          createBy: this.addStorage.createBy,
          adultShrimpId: this.addStorage.adultShrimpId
        })
        if (res.code !== 20000) return this.$message.error('入库失败！！')
        this.isShowAddSto = false
        this.isShowEditSto = true
        this.$message.success('入库成功！！')
        // 刷新修改列表
        this.judgeInfo()
      })
    },
    // 判断是否有入库数据，无则添加，有则修改
    async judgeInfo() {
      const { data: res } = await this.$http.post('/storage/search', {
        adultShrimpId: this.$route.query.id
      })
      if (res.code !== 20000) return this.$message.error('获取信息失败！！')
      if (res.data.length <= 0) this.isShowAddSto = true
      else {
        this.alreadyintoSto = true
        this.isShowEditSto = true
        this.editStorage.storageId = res.data[0].id
        this.editStorage.storageName = res.data[0].storageName
        this.editStorage.storageAddr = res.data[0].storageAddr
        this.editStorage.storagePositionLongitude = res.data[0].storagePositionLongitude
        this.editStorage.storagePositionLatitude = res.data[0].storagePositionLatitude
        this.editStorage.storageTime = res.data[0].storageTime
        this.editStorage.storageTemperature = res.data[0].storageTemperature
        this.editStorage.createBy = res.data[0].createBy
        this.editStorage.outboundStatus = res.data[0].outboundStatus
        if (this.editStorage.outboundStatus === '0') this.isShowOutSto = true
        else {
          this.isShowOutTime = true
          this.editStorage.outboundTime = res.data[0].outboundTime
        }
        console.log(this.editStorage)
      }
    },
    // 出库
    async outStorage() {
      var date = new Date()
      this.editStorage.outboundTime = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      const { data: res } = await this.$http.put('/storage/outStorage', {
        adultShrimpId: this.editStorage.adultShrimpId,
        outboundTime: this.editStorage.outboundTime
      })
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error('出库失败！！')
      }
      this.$message.success('出库成功！！')
      this.isShowOutSto = false
      this.isShowOutTime = true
      // 更新信息
      this.judgeInfo()
    },
    // 修改入库信息
    editIntoStorage() {
      // 先进行表单的预验证
      this.$refs.editStorage.validate(async valid => {
        if (!valid) return false
        var date = new Date(this.editStorage.storageTime)
        this.editStorage.storageTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        // 不出库的话，出库时间为空，不予以转换
        if (this.editStorage.outboundTime !== '') {
          var date1 = new Date(this.editStorage.outboundTime)
          this.editStorage.outboundTime = `${date1.getFullYear()}-${date1.getMonth() +
            1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`
        }
        const { data: res } = await this.$http.put(
          '/storage/' + this.editStorage.storageId,
          this.editStorage
        )
        console.log(res)
        if (res.code !== 20000) {
          return this.$message.error('更新冷库信息失败！！')
        }
        // 提示修改成功
        this.$message.success('更新冷库信息成功！！')
        // 更新信息
        this.judgeInfo()
      })
    },
    // 进入工厂
    addIntoPro() {
      this.$refs.addPro.validate(async (valid) => {
        if (!valid) return false
        // 日期转换
        var prodate = new Date(this.addPro.productionTime)
        this.addPro.productionTime = `${prodate.getFullYear()}-${prodate.getMonth() +
          1}-${prodate.getDate()} ${prodate.getHours()}:${prodate.getMinutes()}:${prodate.getSeconds()}`
        console.log(this.addPro)
        const { data: res } = await this.$http.post('/plant', {
          plantName: this.addPro.plantName,
          plantAddress: this.addPro.plantAddress,
          plantPositionLongitude: this.addPro.plantPositionLongitude,
          plantPositionLatitude: this.addPro.plantPositionLatitude,
          productionTime: this.addPro.productionTime,
          productName: this.addPro.productName,
          createBy: this.addPro.createBy,
          adultShrimpId: this.addPro.adultShrimpId
        })
        if (res.code !== 20000) return this.$message.error('添加加工厂失败！！')
        this.isShowAddPro = false
        this.isShowEditPro = true
        this.$message.success('添加加工厂成功！！')
        // 刷新修改列表
        this.judgeInfoPro()
      })
    },
    // 判断加工厂信息，判断有无加工厂信息，有就显示修改，无就显示添加
    async judgeInfoPro() {
      const { data: res } = await this.$http.post('/plant/search', {
        adultShrimpId: this.$route.query.id
      })
      if (res.code !== 20000) return this.$message.error('获取信息失败！！')
      if (res.data.length <= 0) this.isShowAddPro = true
      else {
        this.alreadyintoPro = true
        this.isShowEditPro = true
        this.editPro.plantId = res.data[0].id
        this.editPro.plantName = res.data[0].plantName
        this.editPro.plantAddress = res.data[0].plantAddress
        this.editPro.plantPositionLongitude = res.data[0].plantPositionLongitude
        this.editPro.plantPositionLatitude = res.data[0].plantPositionLatitude
        this.editPro.productionTime = res.data[0].productionTime
        this.editPro.productName = res.data[0].productName
        this.editPro.createBy = res.data[0].createBy
        this.editPro.qualificationId = res.data[0].qualificationId
        console.log(this.editPro)
      }
    },
    // 修改加工厂信息
    editIntoPro() {
      // 先进行表单的预验证
      this.$refs.editPro.validate(async valid => {
        if (!valid) return false
        var date = new Date(this.editPro.productionTime)
        this.editPro.productionTime = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const { data: res } = await this.$http.post(
          '/plant/' + this.editPro.plantId,
          this.editPro
        )
        console.log('修改后的加工厂' + res)
        if (res.code !== 20000) {
          return this.$message.error('更新加工厂信息失败！！')
        }
        // 提示修改成功
        this.$message.success('更新加工厂信息成功！！')
        // 更新信息
        this.judgeInfoPro()
      })
    },
    // 添加工艺
    addProStep() {
      this.isShowAddProStep = true
      this.isShowEditPro = false
      this.isShowAddPro = false
      this.getProcessingList()
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  created() {
    this.changeLStatus()
    this.judgeInfo()
    this.judgeInfoPro().then(() => {
      this.isShowAddPro = false
      this.isShowEditPro = false
      console.log(this.editPro)
      this.getProInfo()
    })
  }
}
</script>

<style lang="less" scoped>
#ocode{
  height: 250px;
  width: 250px;
  padding:5px;
  border: 1px solid rgb(161, 161, 161);
  border-radius: 6px;
}
#lcode-web {
  background-color: rgb(252, 244, 244);
  min-height: 100%;
  width: 100%;
}

#head1 {
  height: 3.6em;
  font-size: 1.5em;
  background-color: rgb(45, 130, 255);
  color: #fff;
  text-align: center;
  line-height: 3em;
}
#main1 {
  width: 100%;
  position: relative;
  top: -0.9em;
  // background-color: rgb(252, 244, 244);
}
.panel1 {
  width: 96%;
  background-color: #fff;
  margin: 1.2em auto 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(255, 251, 251);
  border-radius: 6px;
}
#select1 {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  // position: absolute;
  // top: 4.5em;
  // left: 1em;
  width: 97%;
  margin: auto;
  display: flex;
  // border: 1px solid black;
  border-radius: 6px;
  .option {
    flex: 1;
    text-align: center;
    i {
      font-size: 3em;
      // border: 1px solid black;
      margin-top: 0.4em;
      color: rgb(119, 119, 255);
      cursor: pointer;
    }
    p {
      color: rgb(87, 84, 84);
      font-size: 1.1em;
    }
    i:hover {
      color:rgba(0, 0, 0, 0.3);
    }
    i:active {
      color:rgba(0, 0, 0, 0.6);
    }
  }
}
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
  .addBox {
    display: flex;
    flex-wrap: wrap;
  }
  .addBox-img {
    border: 1px solid rgb(70, 69, 69);
    border-radius: 4px;
    padding: 5px;
    width: 176px;
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
    width: 188px;
    height: 162px;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 10;
    border-radius: 4px;
  }
  .addBox-img .mask-icon1, .addBox-img .mask-icon2, .addBox-img .mask-icon3{
    display: none;
    color: #fff;
    font-size: 30px;
    cursor: pointer;
  }
  .addBox-img:hover .mask-icon1{
    display: block;
    position:absolute;
    top: 62px;
    left:55px;
  }
  .addBox-img:hover .mask-icon3{
    display: block;
    position:absolute;
    top: 62px;
    left:75px;
  }
  .mask-icon1:hover, .mask-icon2:hover, .mask-icon3:hover{
    color: rgb(165, 163, 163);
  }
  .addBox-img:hover .mask-icon2{
    display: block;
    position:absolute;
    top: 62px;
    left:100px;
  }
</style>
