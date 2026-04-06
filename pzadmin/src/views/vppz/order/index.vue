<script setup>
import { onMounted, ref } from 'vue'
import { adminOrder, updateOrder } from '@/api/index.js'
import PanelHead from '@/components/panelHead.vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { InfoFilled } from '@element-plus/icons-vue'
const paginationData = ref({
  pageNum: 1,
  pageSize: 8,
})

const tableData = ref({
  list: [],
  total: 0,
})
const getListData = (params = {}) => {
  adminOrder({ ...paginationData.value, ...params }).then((result) => {
    const { list, total } = result.data.data
    tableData.value.list = list
    tableData.value.total = total
    console.log('table', tableData.value.list)
  })
}
const statusMap = (key) => {
  const obj = {
    已取消: 'info',
    待支付: 'warning',
    已完成: 'success',
  }
  return obj[key]
}

const handleSizeChange = (value) => {
  paginationData.value.pageSize = value
  getListData()
}
const handleCurrentChange = (value) => {
  paginationData.value.pageNum = value
  getListData()
}
const confirmEvent = (id) => {
  updateOrder({ id }).then((result) => {
    if (result.data.code === 10000) {
      getListData()
    }
  })
}

const searchForm = ref({
  out_trade_no: '',
})
const onSubmit = () => {
  getListData(searchForm.value)
}
const route = useRoute()
onMounted(() => {
  getListData()
})
</script>

<template>
  <panel-head :route="route"></panel-head>
  <div class="form">
    <el-form :inline="true" :model="searchForm">
      <el-form-item prop="out_trade_no">
        <el-input v-model="searchForm.out_trade_no" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item prop="out_trade_no">
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
    <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
    <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
    <el-table-column label="陪护师头像">
      <template #default="scope">
        <el-image style="width: 40px; height: 40px" :src="scope.row.companion.avatar"></el-image>
      </template>
    </el-table-column>
    <el-table-column label="陪护师手机号" width="120">
      <template #default="scope">
        {{ scope.row.companion.mobile }}
      </template>
    </el-table-column>
    <el-table-column prop="price" label="总价"></el-table-column>
    <el-table-column prop="paidPrice" label="已付金额"></el-table-column>
    <el-table-column label="下单时间" width="120">
      <template #default="scope">
        {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态">
      <template #default="scope">
        <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态"></el-table-column>
    <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
    <el-table-column label="操作" width="120" fixed="right">
      <template #default="scope">
        <el-popconfirm
          v-if="scope.row.trade_state === '待服务'"
          confirm-button-text="是"
          cancel-button-text="否"
          width="220"
          :icon="InfoFilled"
          icon-color="#626AEF"
          title="是否确认完成"
          @confirm="confirmEvent(scope.row.out_trade_no)"
        >
          <template #reference>
            <el-button type="primary" link>服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" link disabled>暂无服务</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      v-model:page-size="paginationData.pageSize"
      :page-sizes="[100, 200, 300, 400]"
      :background="false"
      layout="sizes, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      size="small"
    />
  </div>
</template>

<style lang="less" scoped>
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background: #fff;
}
</style>
