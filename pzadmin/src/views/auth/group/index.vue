<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { menuList, userGetMenu, userSetMenu } from '@/api/index.js'
import PanelHead from '@/components/panelHead.vue'
import { useRoute } from 'vue-router'


const dialogFormVisible = ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
  treeRef.value.setCheckedKeys(defaultKeys)
}

const form = ref({
  name: '',
  permissions: '',
  id: '',
})

const permissionData = ref([])
const defaultKeys = [4, 5]
const treeRef = ref()

onMounted(() => {
  userGetMenu().then((res) => {
    console.log('res', res.data.data)
    permissionData.value = res.data.data
  })
  getListData()
})

const rules = ref({
  name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }],
})

const formRef = ref()
const confirm = async (formEl) => {
  if (!formEl) {
    return
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permission = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({ name: form.value.name, permissions: permission, id: form.value.id }).then(
        (result) => {
          console.log(result)
          getListData()
          dialogFormVisible.value = false
        },
      )
    } else {
      console.log('error', fields)
    }
  })
}
const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
})

const tableData = ref({
  list: [],
  total: 0,
})

const getListData = () => {
  menuList(paginationData.value).then((result) => {
    console.log(result)
    const { list, total } = result.data.data
    console.log(list)
    console.log(total)
    tableData.value.list = list
    tableData.value.total = total
  })
}

const handleSizeChange = (value) => {
  paginationData.value.pageSize = value
  getListData()
}
const handleCurrentChange = (value) => {
  paginationData.value.pageNum = value
  getListData()
}

const open = (rowData = {}) => {
  dialogFormVisible.value = true
  // 弹窗打开Form是异步的
  nextTick(() => {
    if (rowData) {
      Object.assign(form.value, {
        id: rowData.id,
        name: rowData.name,
        permissions: rowData.permissions,
      })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}
const route = useRoute()
</script>

<template>
  <div>
    <panel-head :route="route"></panel-head>
    <div class="btn">
      <el-button icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    </div>

    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="昵称"></el-table-column>
      <el-table-column prop="permissionName" width="500" label="菜单权限"></el-table-column>
      <el-table-column #default="scope">
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

    <el-dialog
      v-model="dialogFormVisible"
      :before-close="beforeClose"
      title="添加权限"
      width="500px"
    >
      <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
        <el-form-item prop="id" v-show="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree
            :data="permissionData"
            style="max-width: 600px"
            node-key="id"
            show-checkbox
            :default-checked-keys="defaultKeys"
            ref="treeRef"
            :default-expanded-keys="[2]"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.btn {
  padding: 10px 0 10px 10px;
  background-color: white;
}
</style>
