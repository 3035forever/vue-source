<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的基地</el-breadcrumb-item>
      <el-breadcrumb-item>实况监控</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row
      style="margin-bottom:20px;border-bottom:1px solid rgb(194, 192, 192);font-size:14px;font-weight:bold;color: #555555;line-height: 40px;"
    >
      <i class="el-icon-s-data" style="margin: 0 5px 0 10px;"></i>
      <span>实况监控</span>
    </el-row>
    <div class="live_monitor">
      <div style="width:80%;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="单格显示" name="first" class="first_card">
            <SingleLive />
          </el-tab-pane>
          <el-tab-pane label="双格显示" name="second" class="second_card">
            <SingleLive /><SingleLive />
          </el-tab-pane>
          <el-tab-pane label="四格显示" name="third" class="third_card">
            <SingleLive /><SingleLive /><SingleLive /><SingleLive />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>

import SingleLive from './liveMonitor/SingleLive'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    SingleLive
  },
  methods: {
    // tab切换
    handleClick(tab, e) {
      console.log(tab.index)
    }
  }
}
</script>
<style lang="less">
.live_monitor {
  width: 100%;
  display: flex;
  justify-content: center;
  .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
  #pane-first{
    .single_live .frame{
      height: 500px;
      width: 100%;
    }
  }
  #pane-second{
    width: 100%;
    height: 500px;
    display: flex;
    .single_live{
      width: 45%;
      height: 100%;
      margin-left: 10px;
      .frame{
        width: 100%;
        height: 100%;
      }
    }
  }
  #pane-third{
    width: 100%;
    height: 800px;
    display: flex;
    flex-wrap: wrap;
    .single_live{
        width: 45%;
        height: 40%;
        margin: 20px 10px 0 10px;
      .frame{
          width: 100%;
          height: 100%;
      }
    }
  }
}
</style>
