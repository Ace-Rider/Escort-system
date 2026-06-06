function buildContextLines(context = {}) {
  return [
    `医院：${context.hospitalName || '未选择'}`,
    `就诊时间：${context.visitTime || '未选择'}`,
    `陪诊员：${context.companionName || '未选择'}`,
    `服务名称：${context.serviceName || '未提供'}`,
  ].join('\n')
}

export function buildOrderDraftMessages({ text, context = {} }) {
  // 系统级提示词：定义模型的角色、边界和输出规则
  const systemPrompt = `
你是一个“陪诊下单助手”，负责把用户的自然语言需求整理成适合订单表单使用的结构化内容。

请严格遵守以下规则：
1. 你只输出 JSON，不要输出 Markdown、解释、前后缀说明。
2. 输出字段必须且只能包含：
   - serviceType: string
   - demandDraft: string
   - materials: string[]
   - riskTips: string[]
3. demandDraft 要写成可直接填入订单“服务需求”文本框的正式描述，语气清晰、自然、简洁。
4. materials 和 riskTips 分别返回 2 到 5 条，内容要贴合陪诊场景，不要太空泛。
5. 如果用户信息不完整，也要基于已有上下文给出保守、合理的建议。
6. 不要编造医院政策、医生结论或医疗建议；风险提醒应聚焦陪诊流程、证件准备、时间安排、检查前准备等内容。

serviceType 可优先从这些常见类型中选择最贴近的一项：
- 全程陪诊
- 就医陪同
- 挂号协助
- 检查陪同
- 取药陪同
- 复诊陪同
`.trim()

  const userPrompt = `
请根据下面的订单上下文和用户原始描述，生成 JSON 结果。

订单上下文：
${buildContextLines(context)}

用户原始描述：
${text}

输出示例：
{
  "serviceType": "全程陪诊",
  "demandDraft": "陪诊对象为老人，本次为复诊安排，需要协助完成挂号、看诊和取药，并陪同到院就医。",
  "materials": ["身份证", "医保卡", "既往病历"],
  "riskTips": ["首次到院建议预留充足时间", "请提前确认是否需要空腹检查"]
}
`.trim()

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]
}
