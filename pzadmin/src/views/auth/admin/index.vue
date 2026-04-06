<script setup>
import { autAdmin, menuSelectList, updateUser } from '@/api/index.js'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Clock } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import PanelHead from '@/components/panelHead.vue'

const tableData = ref({
  list: [],
  total: 0,
})
const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
})

const rules = ref({
  name: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
  permissions_id: [{ required: true, trigger: 'blur', message: '请选择菜单权限' }],
})

const options = ref([])
const permissionName = (id) => {
  const data = options.value.find((item) => item.id === id)
  return data ? data.name : '超级管理员'
}

const handleSizeChange = (value) => {
  paginationData.value.pageSize = value
  getListData()
}
const handleCurrentChange = (value) => {
  paginationData.value.pageNum = value
  getListData()
}

const dialogFormVisible = ref(false)

const form = ref({
  name: '',
  permissions_id: '',
})

const formRef = ref()
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form.value
      updateUser({ name: name, permissions_id: permissions_id }).then((result) => {
        if (result.data.code === 10000) {
          dialogFormVisible.value = false
          getListData()
        }
      })
    } else {
      console.log('error', fields)
    }
  })
}

const getListData = () => {
  autAdmin(paginationData.value).then((data) => {
    console.log('DATA', data)
    const { list, total } = data.data.data
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.value.list = list
    tableData.value.total = total
  })
}

const open = (rowData) => {
  dialogFormVisible.value = true
  Object.assign(form.value, {
    mobile: rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  })
}
const beforeClose = () => {
  dialogFormVisible.value = false
}

onMounted(() => {
  getListData()
  menuSelectList().then((result) => {
    console.log('ss', result)
    options.value = result.data.data
  })
})

const route = useRoute()
</script>

<template>
  <panel-head :route="route"></panel-head>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column prop="permission_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? '正常' : '失效'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column #default="scope" label="操作">
      <el-button type="primary" @click="open(scope.row)">编辑</el-button>
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

  <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="编辑" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item label="手机号" prop="mobile">
        <el-input disabled v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
