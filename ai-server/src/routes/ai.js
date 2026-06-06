import { Router } from 'express'
import { generateOrderDraft } from '../services/orderDraftService.js'

const router = Router()

router.post('/order-draft', async (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  const context = req.body?.context || {}

  if (!text) {
    return res.status(400).json({
      code: 40000,
      message: '请输入陪诊需求后再生成建议',
    })
  }

  if (text.length > 300) {
    return res.status(400).json({
      code: 40001,
      message: '需求描述请控制在 300 字以内',
    })
  }

  try {
    const result = await generateOrderDraft({ text, context })

    return res.json({
      code: 10000,
      data: result,
    })
  } catch (error) {
    console.error('[ai-server] order draft error', error)

    const messageMap = {
      MISSING_API_KEY: 'AI 服务缺少 API Key 配置',
      EMPTY_TEXT: '请输入陪诊需求后再生成建议',
      REQUEST_TIMEOUT: 'AI 生成超时，请稍后重试',
      INVALID_JSON_RESULT: 'AI 返回结果格式异常，请稍后重试',
      EMPTY_MODEL_CONTENT: 'AI 暂未生成有效内容，请稍后重试',
    }

    const authFailed = /authentication fails|invalid api key|incorrect api key|unauthorized/i.test(
      error.message || '',
    )

    return res.status(500).json({
      code: 50000,
      message:
        messageMap[error.message]
        || (authFailed ? 'AI Key 校验失败，请检查 ai-server/.env 中的 Key、Base URL 和模型名' : null)
        || 'AI 生成失败，请稍后重试',
    })
  }
})

export default router
