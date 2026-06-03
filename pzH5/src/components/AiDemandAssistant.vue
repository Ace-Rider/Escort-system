<script setup>
import { computed, ref, watch } from 'vue'
import { showToast } from 'vant'
import api from '@/api/index.js'

const props = defineProps({
  context: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['apply'])

const promptText = ref('')
const loading = ref(false)
const errorMessage = ref('')
const result = ref(null)
const resultStale = ref(false)
const riskConfirmed = ref(false)
const isInputEmpty = computed(() => !promptText.value.trim())

const contextSummary = computed(() =>
  [
    props.context.hospitalName && `医院：${props.context.hospitalName}`,
    props.context.visitTime && `时间：${props.context.visitTime}`,
    props.context.companionName && `陪诊员：${props.context.companionName}`,
  ].filter(Boolean),
)

watch(promptText, () => {
  errorMessage.value = ''
  if (result.value) {
    resultStale.value = true
  }
})

watch(
  () => props.context,
  () => {
    if (result.value) {
      resultStale.value = true
    }
  },
  { deep: true },
)

const generateSuggestion = async () => {
  const text = promptText.value.trim()

  if (!text) {
    errorMessage.value = '先简单描述一下陪诊需求，再让 AI 帮你整理'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.aiOrderDraft({
      text,
      context: props.context,
    })
    const data = response.data?.data

    if (!data) {
      errorMessage.value = '暂未生成建议，请换一种描述试试'
      result.value = null
      return
    }

    result.value = data
    resultStale.value = false
    riskConfirmed.value = false
  } catch {
    errorMessage.value = '生成失败，请稍后重试'
    result.value = null
  } finally {
    loading.value = false
  }
}

const copyDemand = async () => {
  if (!result.value?.demandDraft) {
    return
  }

  try {
    await navigator.clipboard.writeText(result.value.demandDraft)
    showToast({
      message: '需求草稿已复制',
      position: 'middle',
    })
  } catch {
    showToast({
      message: '复制失败，请手动复制',
      position: 'middle',
    })
  }
}

const applySuggestion = () => {
  if (!result.value) {
    return
  }

  if (resultStale.value) {
    showToast({
      message: '描述或上下文已变更，请重新生成建议',
      position: 'middle',
    })
    return
  }

  if (!riskConfirmed.value) {
    showToast({
      message: '请先确认已知晓风险提醒',
      position: 'middle',
    })
    return
  }

  emit('apply', result.value)
}
</script>

<template>
  <van-cell-group class="ai-card" inset>
    <div class="ai-header">
      <div class="ai-title">AI 帮你整理陪诊需求</div>
      <div class="ai-subtitle">输入一句话，快速生成更完整的服务需求</div>
    </div>

    <div v-if="contextSummary.length" class="context-list">
      <span v-for="item in contextSummary" :key="item" class="context-item">
        {{ item }}
      </span>
    </div>

    <van-field
      v-model="promptText"
      type="textarea"
      rows="3"
      autosize
      maxlength="120"
      show-word-limit
      :class="{ 'field-error': errorMessage && isInputEmpty }"
      placeholder="比如：老人第一次去医院复诊，需要陪同挂号、看诊和取药。"
    />

    <div v-if="errorMessage && isInputEmpty" class="inline-tip">
      {{ errorMessage }}
    </div>

    <div class="ai-actions">
      <van-button type="primary" block :loading="loading" @click="generateSuggestion">
        生成建议
      </van-button>
    </div>

    <div v-if="errorMessage" class="ai-error">
      {{ errorMessage }}
    </div>

    <div v-if="resultStale" class="ai-warning">
      当前描述或已选信息有变化，建议重新生成后再使用。
    </div>

    <div v-if="result" class="ai-result">
      <div class="result-row">
        <span class="result-label">推荐服务</span>
        <span class="result-value highlight">{{ result.serviceType }}</span>
      </div>

      <div class="result-block">
        <div class="result-label">需求草稿</div>
        <div class="result-text">{{ result.demandDraft }}</div>
      </div>

      <div class="result-block">
        <div class="result-label">准备材料</div>
        <div class="tag-list">
          <span v-for="item in result.materials" :key="item" class="tag-item">
            {{ item }}
          </span>
        </div>
      </div>

      <div class="result-block">
        <div class="result-label">风险提醒</div>
        <div class="tip-list">
          <div v-for="item in result.riskTips" :key="item" class="tip-item">
            {{ item }}
          </div>
        </div>
      </div>

      <div class="risk-check">
        <van-checkbox v-model="riskConfirmed">我已知晓以上风险提醒</van-checkbox>
      </div>

      <div class="result-actions">
        <van-button plain type="primary" size="small" @click="copyDemand">复制需求</van-button>
        <van-button plain type="primary" size="small" @click="generateSuggestion">
          重新编辑后再生成
        </van-button>
        <van-button
          type="primary"
          size="small"
          :disabled="resultStale || !riskConfirmed"
          @click="applySuggestion"
        >
          一键填入
        </van-button>
      </div>
    </div>
  </van-cell-group>
</template>

<style lang="less" scoped>
.ai-card {
  width: 95%;
  margin: 10px auto;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(22, 119, 255, 0.08);
}

.ai-header {
  padding: 14px 16px 8px;
  background: linear-gradient(135deg, #f3f8ff 0%, #eefaf7 100%);
}

.ai-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2a37;
}

.ai-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #5b6573;
}

.context-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px 0;
}

.context-item {
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 12px;
}

.ai-actions {
  padding: 0 16px 16px;
}

.inline-tip {
  margin: 8px 16px 0;
  padding-left: 12px;
  position: relative;
  color: #d97706;
  font-size: 12px;
  line-height: 1.5;
}

.inline-tip::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #f59e0b;
}

.ai-error,
.ai-warning {
  margin: 0 16px 16px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
}

.ai-error {
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
  color: #c2410c;
}

.ai-warning {
  background-color: #fff7e6;
  color: #d48806;
}

.ai-result {
  margin: 0 16px 16px;
  padding: 14px;
  border-radius: 12px;
  background-color: #f7fafc;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-block {
  margin-top: 14px;
}

.result-label {
  font-size: 13px;
  font-weight: 700;
  color: #4b5563;
}

.result-value {
  font-size: 14px;
  color: #1f2a37;
}

.highlight {
  color: #1677ff;
}

.result-text {
  margin-top: 6px;
  line-height: 1.6;
  color: #1f2a37;
  font-size: 14px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag-item {
  padding: 5px 10px;
  border-radius: 999px;
  background-color: #e8f3ff;
  color: #1677ff;
  font-size: 12px;
}

.tip-list {
  margin-top: 8px;
}

.tip-item {
  position: relative;
  padding-left: 12px;
  margin-top: 6px;
  line-height: 1.5;
  color: #5b6573;
  font-size: 13px;
}

.tip-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #36b37e;
}

.risk-check {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

:deep(.field-error .van-field__control) {
  color: #1f2937;
}
</style>
