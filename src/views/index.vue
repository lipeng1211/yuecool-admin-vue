<template>
  <div class="dashboard-editor-container">

<!--    <el-row :gutter="40" class="panel-group">-->
<!--       <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
<!--        <div class="card-panel" >-->
<!--          <div class="card-panel-icon-wrapper icon-people">-->
<!--            <svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
<!--          </div>-->
<!--          <div class="card-panel-description">-->
<!--            <div class="card-panel-text">-->
<!--              用户总数-->
<!--            </div>-->
<!--            <count-to :start-val="0" :end-val=this.userNum :duration="2600" class="card-panel-num" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
<!--        <div class="card-panel" >-->
<!--          <div class="card-panel-icon-wrapper icon-money">-->
<!--            <svg-icon icon-class="money" class-name="card-panel-icon" />-->
<!--          </div>-->
<!--          <div class="card-panel-description">-->
<!--            <div class="card-panel-text">-->
<!--              平台总流水-->
<!--            </div>-->
<!--            <count-to :start-val="0" :end-val=this.money :duration="3200" class="card-panel-num" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->


<!--      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
<!--        <div class="card-panel" >-->
<!--          <div class="card-panel-icon-wrapper icon-shopping">-->
<!--            <svg-icon icon-class="shopping" class-name="card-panel-icon" />-->
<!--          </div>-->
<!--          <div class="card-panel-description">-->
<!--            <div class="card-panel-text">-->
<!--              完成总课程数-->
<!--            </div>-->
<!--            <count-to :start-val="0" :end-val=this.courseNum :duration="3600" class="card-panel-num" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-row>
      <el-col>
        <div class="chart-wrapper" style="margin-bottom: 0px">时间范围
          <el-date-picker clearable size="small" style="width: 400px"
                          v-model="date"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          @blur="indexChartData"
                          placeholder="选择时间范围">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="registerList" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart2 :chart-data="orderList" />
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import LineChart2 from './dashboard/LineChart2'
import CountTo from 'vue-count-to'
import {getChartData} from "@/api/user/user";

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    LineChart2,
    CountTo
  },
  data() {
    return {
      registerList: null,
      orderList: null,
      date: null,
      choose:{
        start:null,
        end:null
      },
      userNum:0,
      profit:0,
      money:0,
      courseNum:0
    }
  },
  created() {
    this.indexChartData();
  },
  methods: {
    indexChartData(){
      if (this.date==null){
        this.choose.start=null;
        this.choose.end=null;
      }else {
        this.choose.start=this.date[0];
        this.choose.end=this.date[1];
      }
      /*
      getChartData(this.choose).then(response =>{
        this.userNum=response.data.userNum;
        this.money=response.data.money;
        this.courseNum=response.data.courseNum;
        this.registerList=response.data.registerList;
        this.orderList=response.data.orderList;
      })
      */
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
