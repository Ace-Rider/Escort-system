<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { Check, Clock, Delete, InfoFilled, Plus } from '@element-plus/icons-vue'
import { companion, photoList, companionList, deleteCompanion } from '@/api/index.js'
import { ElMessage } from 'element-plus'
import PanelHead from '@/components/panelHead.vue'
import { useRoute } from 'vue-router'

const dialogFormVisible = ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
}
const formRef = ref()
const form = ref({
  id: '',
  mobile: '',
  active: 1,
  age: 28,
  avatar: '',
  name: '',
  sex: '',
})
const rules = ref({
  name: [{ required: true, trigger: 'blur', message: '请填写昵称' }],
  avatar: [{ required: true, message: '请选择头像 ' }],
  sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
  mobile: [{ required: true, trigger: 'blue', message: '请填写手机号' }],
})
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form.value).then((result) => {
        console.log(result)
        if (result.data.code === 10000) {
          beforeClose()
          getListData()
        } else {
          ElMessage.error(result.message)
        }
      })
    } else {
      console.log('error')
    }
  })
}
const open = (rowData = {}) => {
  dialogFormVisible.value = true
  nextTick(() => {
    if (rowData) {
      Object.assign(form.value, rowData)
    }
  })
}

const dialogImageVisible = ref(false)
const beforeImgClose = () => {
  dialogImageVisible.value = false
}
const fileList = ref([])
const selectIndex = ref(0)
const confirmImage = () => {
  form.value.avatar = fileList.value[selectIndex.value].url
  dialogImageVisible.value = false
}
onMounted(() => {
  photoList().then((result) => {
    fileList.value = result.data.data
  })
  getListData()
})

const paginationData = ref({
  pageNum: 1,
  pageSize: 10,
})

const tableData = ref({
  list: [],
  total: 0,
})

const getListData = () => {
  companionList(paginationData.value).then((result) => {
    const { list, total } = result.data.data
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

const selectTableData = ref([])
const handleSelectionChange = (value) => {
  selectTableData.value = value.map((item) => ({ id: item.id }))
  console.log(selectTableData.value)
}
const confirmEvent = () => {
  if (!selectTableData.value.length) {
    return ElMessage.warning('请至少选中一个删除')
  }
  deleteCompanion({ id: selectTableData.value }).then((result) => {
    if (result.data.code === 10000) {
      getListData()
    }
  })
}
const route = useRoute()
</script>

<template>
  <panel-head :route="route"></panel-head>
  <div class="btns">
    <el-button type="primary" :icon="Plus" @click="open(null)">添加</el-button>
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      width="220"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除"
      @confirm="confirmEvent"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger" size="default">删除</el-button>
      </template>
    </el-popconfirm>
  </div>

  <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column label="头像">
      <template #default="scope">
        <el-image style="width: 50px; height: 50px" :src="scope.row.avatar"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === '1' ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? '正常' : '失效'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <el-icon><Clock /></el-icon>
        <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
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

  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="陪护师添加"
    width="500px"
  >
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImageVisible = true"
          >点击上传</el-button
        >
        <el-image v-else :src="form.avatar" style="width: 100px; height: 100px"></el-image>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50"></el-input-number>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="1">生效</el-radio>
          <el-radio :value="0">失效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogImageVisible"
    :before-close="beforeImgClose"
    title="选择图片"
    width="506"
  >
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <div v-if="selectIndex === index" class="select">
          <el-icon color="white"><Check /></el-icon>
        </div>
        <el-image style="width: 148px; height: 148px" :src="item.url"></el-image>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImageVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.btns {
  padding: 10px 0 10px 10px;
  background-color: white;
}
</style>
