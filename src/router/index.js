import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Customer from '../components/baseManagement/Customer.vue'
import PersonInfo from '../components/baseManagement/PersonInfo.vue'
import Map from '../components/Map.vue'
import Supplies from '../components/baseManagement/Supplies.vue'
import ShrimpManagement from '../components/baseManagement/ShrimpManagement.vue'
import Pond from '../components/baseManagement/Pond.vue'
import Shrimp from '../components/baseManagement/Shrimp.vue'
import Order from '../components/productOrgin/Order.vue'
import Logistics from '../components/productOrgin/Logistics.vue'
import BaseInfo from '../components/systemSettings/BaseInfo'
import DigitalBase from '../components/myBase/DigitalBase'
import ProductInfo from '../components/cultureProduction/ProductInfo.vue'
import PondInfo from '../components/baseManagement/PondInfo.vue'
import Storage from '../components/cultureProduction/Storage.vue'
import Suppliesinfo from '../components/baseManagement/Suppliesinfo'
import Plant from '../components/cultureProduction/Plant.vue'
import Processing from '../components/cultureProduction/Processing.vue'
import LcodeWeb from '../components/productOrgin/LcodeWeb'
import IsArriveLcode from '../components/productOrgin/IsArriveLcode'
import IsArriveOcode from '../components/productOrgin/IsArriveOcode'
import OcodeWeb from '../components/productOrgin/OcodeWeb'

import Environment from '../components/myBase/environment/Environment'
import Weather from '../components/equipmentManagement/Weather'
import WaterQuality from '../components/equipmentManagement/WaterQuality'
import WeatherWarn from '../components/equipmentManagement/WeatherWarn'
import WaterQualityWarn from '../components/equipmentManagement/WaterQualityWarn'

import MonitorEquipment from '../components/equipmentManagement/MonitorEquipment'
import LiveMonitor from '../components/myBase/LiveMonitor'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/DigitalBase'
  },
  {
    path: '/map',
    component: Map
  },
  {
    path: '/home',
    component: Home,
    redirect: '/DigitalBase',
    children: [
      {
        // 数据基地
        path: '/DigitalBase',
        component: DigitalBase
      },
      {
        // 实况监控
        path: '/LiveMonitor',
        component: LiveMonitor
      },
      {
        // 监控设备
        path: '/MonitorEquipment',
        component: MonitorEquipment
      },
      {
        // 客户信息
        path: '/Customer',
        component: Customer
      },
      {
        // 人员信息
        path: '/PersonInfo',
        component: PersonInfo
      },
      {
        // 农资
        path: '/Supplies',
        component: Supplies
      },
      {
        // 虾苗进货
        path: '/ShrimpManagement',
        component: ShrimpManagement
      },
      {
        // 基地信息
        path: '/Baseinfo',
        component: BaseInfo
      },
      {
        // 池塘
        path: '/Pond',
        component: Pond
      },
      {
        // 虾苗信息
        path: '/Shrimp',
        component: Shrimp
      },
      {
        // 产品信息
        path: '/ProductInfo',
        component: ProductInfo
      },
      {
        // 订单
        path: '/Order',
        component: Order
      },
      {
        // 物流
        path: '/Logistics',
        component: Logistics
      },
      {
        // 池塘信息
        path: '/Pond/PondInfo',
        component: PondInfo
      },
      {
        // 冷库
        path: '/Storage',
        component: Storage
      },
      {
        // 农资来源信息
        path: '/Suppliesinfo',
        component: Suppliesinfo
      },
      {
        // 加工厂
        path: '/Plant',
        component: Plant
      },
      {
        // 加工信息
        path: '/Plant/Processing',
        component: Processing
      }, {
        // 环境监测
        path: '/Environment',
        component: Environment
      },
      {
        // 气象信息
        path: '/Weather',
        component: Weather
      },
      {
        // 设置s水质阀值
        path: '/WaterQualityWarn',
        component: WaterQualityWarn
      },
      {
        // 设置环境阀值
        path: '/WeatherWarn',
        component: WeatherWarn
      },
      {
        // 水质信息
        path: '/WaterQuality',
        component: WaterQuality
      }
    ]
  },
  {
    path: '/LcodeWeb',
    component: LcodeWeb
  },
  {
    path: '/OcodeWeb',
    component: OcodeWeb
  },
  {
    // 是否确认收货
    path: '/IsArriveLcode',
    component: IsArriveLcode
  },
  {
    path: '/IsArriveOcode',
    component: IsArriveOcode
  }
]

const router = new VueRouter({
  routes
})

// 解决路由访问重复时报错问题：
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
