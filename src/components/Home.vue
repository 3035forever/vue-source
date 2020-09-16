<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="">
        <span>对虾溯源云平台</span>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse-transition="false"
          :collapse="isCollapse"
          router
          :default-active="activePath"
        >
          <!-- unique-opened:是否只保持一个子菜单的展开 -->
          <!-- collapse：是否水平折叠收起菜单 -->
          <!-- collapse-transition:是否开启折叠动画 -->
          <!-- router:是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
          <!-- default-active:当前激活菜单的 index -->
          <!-- 我的基地 -->
          <el-submenu index="1">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-office-building"></i>
              <!-- 文本 -->
              <span>我的基地</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/DigitalBase" @click="saveNavState('/DigitalBase')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-data"></i>
                <!-- 文本 -->
                <span>数字基地</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/LiveMonitor" @click="saveNavState('/LiveMonitor')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-stopwatch"></i>
                <!-- 文本 -->
                <span>实况监控</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Environment" @click="saveNavState('/Environment')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-cloudy-and-sunny"></i>
                <!-- 文本 -->
                <span>环境监测</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 对虾管理 -->
          <el-submenu index="2">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-school"></i>
              <!-- 文本 -->
              <span>对虾管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/Customer" @click="saveNavState('/Customer')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-custom"></i>
                <!-- 文本 -->
                <span>客户管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/PersonInfo" @click="saveNavState('/PersonInfo')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-user"></i>
                <!-- 文本 -->
                <span>人员管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Pond" @click="saveNavState('/Pond')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-receiving"></i>
                <!-- 文本 -->
                <span>池塘管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Supplies" @click="saveNavState('/Supplies')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-grape"></i>
                <!-- 文本 -->
                <span>农资管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/ShrimpManagement" @click="saveNavState('/ShrimpManagement')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-help"></i>
                <!-- 文本 -->
                <span>虾苗进货</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Shrimp" @click="saveNavState('/Shrimp')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-order"></i>
                <!-- 文本 -->
                <span>虾苗信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Suppliesinfo" @click="saveNavState('/Suppliesinfo')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-folder"></i>
                <!-- 文本 -->
                <span>农资来源</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 设备管理 -->
          <el-submenu index="3">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-crop"></i>
              <!-- 文本 -->
              <span>设备管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/MonitorEquipment" @click="saveNavState('/MonitorEquipment')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-platform"></i>
                <!-- 文本 -->
                <span>监控设备</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Weather" @click="saveNavState('/Weather')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-wind-power"></i>
                <!-- 文本 -->
                <span>气象设备</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/WaterQuality" @click="saveNavState('/WaterQuality')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-odometer"></i>
                <!-- 文本 -->
                <span>水质设备</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 养殖生产 -->
          <el-submenu index="4">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-film"></i>
              <!-- 文本 -->
              <span>养殖生产</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/Storage" @click="saveNavState('/Storage')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-mobile"></i>
                <!-- 文本 -->
                <span>冷库</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Plant" @click="saveNavState('/Plant')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-house"></i>
                <!-- 文本 -->
                <span>加工厂</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/ProductInfo" @click="saveNavState('/ProductInfo')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-notebook-1"></i>
                <!-- 文本 -->
                <span>产品信息</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 产品溯源 -->
          <el-submenu index="5">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-c-scale-to-original"></i>
              <!-- 文本 -->
              <span>产品溯源</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/Order" @click="saveNavState('/Order')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-document"></i>
                <!-- 文本 -->
                <span>订单管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/Logistics" @click="saveNavState('/Logistics')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-truck"></i>
                <!-- 文本 -->
                <span>物流信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/lujing" @click="saveNavState('/lujing')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-collection"></i>
                <!-- 文本 -->
                <span>溯源</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 系统设置 -->
          <el-submenu index="6">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-setting"></i>
              <!-- 文本 -->
              <span>系统设置</span>
            </template>
            <!-- 二级菜单 -->
             <el-menu-item index="/Baseinfo" @click="saveNavState('/BaseInfo')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-document-copy"></i>
                <!-- 文本 -->
                <span>基地信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/lujing" @click="saveNavState('/lujing')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-lock"></i>
                <!-- 文本 -->
                <span>修改密码</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/lujing" @click="saveNavState('/lujing')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-grid"></i>
                <!-- 文本 -->
                <span>权限管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '/DigitalBase'
    }
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  // 撑满全屏
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  // 左右贴边对齐
  justify-content: space-between;
  // 去掉左内边距
  padding-left: 0;
  // y轴居中对齐
  align-items: center;
  //文本颜色
  color: #fff;
  //字体大小
  font-size: 24px;
  > div {
    display: flex;
    // y轴居中对齐
    align-items: center;
    span {
      // 图标与字体距离
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  // 字体大小
  font-size: 10px;
  // 行高
  line-height: 24px;
  // 字体颜色
  color: #fff;
  // 水平居中
  text-align: center;
  // 字间距离
  letter-spacing: 0.2em;
  // 进过鼠标为小手
  cursor: pointer;
}
</style>
