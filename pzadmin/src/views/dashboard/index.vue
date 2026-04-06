<script setup>
import PanelHead from '@/components/panelHead.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import { report } from '@/api/index.js'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'

echarts.use([
  LineChart,
  CanvasRenderer,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
])

const route = useRoute()
const user = ref({
  ip: '',
  permission: '',
  user_img: '',
  user_name: '',
})
const typeList = ref([])
const imageMap = {
  待支付: '../../../public/images/dzf.png',
  待服务: '../../../public/images/dfw.png',
  已完成: '../../../public/images/ywc.png',
  已取消: '../../../public/images/yqx.png',
}
const colorMap = {
  待支付: 'rgb(255, 165, 0)',
  待服务: 'rgb(0, 200, 0)',
  已完成: 'rgb(0, 123, 255)',
  已取消: 'rgb(128, 128, 128)',
}
const types = ref([])
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: '#333',
  },
  legend: {},
  grid: {
    left: '20%',
  },
  // 提示框
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category', // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: '#17b3a3',
      },
    },
    axisLabel: {
      interval: 0,
      color: '#333',
    },
  },
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#17b3a3',
        },
      },
    },
  ],
  color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
  series: [],
})
const chartRef = ref()
onMounted(() => {
  report().then((result) => {
    if (result.data.code === 10000) {
      Object.assign(user.value, result.data.data.user)
      types.value = result.data.data.types
      console.log('types.value', types.value)
      typeList.value = result.data.data.typeList
      console.log('typeList.value', typeList.value)
      xOptions.xAxis.data = typeList.value.map((item) => item.date)
      xOptions.series = [
        {
          name: '订单数',
          data: typeList.value.map((item) => item.order_sum),
          type: 'line',
        },
      ]
      const chart = echarts.init(chartRef.value)
      chart.setOption(xOptions)
    }
  })
})
</script>

<template>
  <panel-head :route="route"></panel-head>
  <div class="container">
    <el-card style="width: 800px">
      <div class="top">
        <el-image class="userImage" :src="user.user_img"></el-image>
        <span>{{ user.user_name }}</span>
      </div>
      <div class="bottom">
        <div>当前权限：{{ user.permission }}</div>
        <div>登录的IP：{{ user.ip }}</div>
      </div>
    </el-card>

    <el-card style="width: 800px">
      <div class="orders">
        <div class="order" v-for="(item, index) in types" :key="index">
          <el-image
            class="typeImage"
            :src="imageMap[item.state]"
            :style="{ backgroundColor: colorMap[item.state] }"
          ></el-image>
          <div class="text">
            <div class="text1">{{ item.num }}</div>
            <div class="text2">{{ item.state }}</div>
          </div>
          <div></div>
        </div>
      </div>
    </el-card>
    <el-card style="width: 100%; margin-top: 10px">
      <div ref="chartRef" style="height: 400px"></div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .top {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;

    :deep(.userImage) {
      width: 150px;
      height: 150px;
    }
    span {
      font-size: 30px;
      font-weight: bolder;
    }
  }
  .bottom {
    margin-top: 20px;
    font-size: 17px;
    color: gray;
  }

  .orders {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .order {
      margin-top: 10px;
      width: 140px;
      height: 100px;
      margin-left: 100px;
      margin-right: 100px;
      display: flex;
      align-items: center;
      :deep(.typeImage) {
        width: 70px;
        height: 70px;
      }
      .text {
        margin-left: 10px;
        .text1 {
          font-size: 25px;
          font-weight: bolder;
        }
      }
    }
  }
}
</style>
