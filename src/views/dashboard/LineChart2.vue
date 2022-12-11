<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ time,finish, refund,buy } = {}) {
      this.chart.setOption({
        title:{
          text:'订单状态统计图',
          textStyle: {
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'bold',
            color:'black'
          },
          x:'5%'
        },
        xAxis: {
          data: time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['已完成', '已退款','已购买']
        },
        series: [{
          name: '已完成',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: finish,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '已退款',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FFFF00',
              lineStyle: {
                color: '#FFFF00',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: refund,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
          {
            name: '已购买',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#00FF00',
                lineStyle: {
                  color: '#00FF00',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: buy,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
  }
}
</script>
