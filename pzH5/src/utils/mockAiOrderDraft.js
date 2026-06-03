function hasKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

function unique(list) {
  return [...new Set(list)]
}

function buildContextText(context = {}) {
  return [
    context.hospitalName,
    context.visitTime,
    context.companionName,
    context.serviceName,
  ]
    .filter(Boolean)
    .join(' ')
}

function getSceneProfile(fullText) {
  const departments = [
    { label: '心内科', keywords: ['心内科', '心脏', '胸闷', '心慌'] },
    { label: '肿瘤科', keywords: ['肿瘤科', '肿瘤', '放疗', '化疗'] },
    { label: '骨科', keywords: ['骨科', '骨折', '膝盖', '腰腿', '关节'] },
  ]

  const people = [
    { label: '孕妇', keywords: ['孕妇', '怀孕', '产检'] },
    { label: '儿童', keywords: ['儿童', '小孩', '孩子', '儿科'] },
    { label: '老人', keywords: ['老人', '长辈', '老年'] },
  ]

  const actions = [
    { label: '挂号', keywords: ['挂号', '预约'] },
    { label: '缴费', keywords: ['缴费', '付款'] },
    { label: '取报告', keywords: ['取报告', '拿报告', '报告'] },
    { label: '检查', keywords: ['检查', '检验', '抽血', '空腹', '拍片'] },
    { label: '取药', keywords: ['取药', '拿药', '开药'] },
    { label: '看诊', keywords: ['看诊', '就诊', '问诊', '复诊', '初诊'] },
  ]

  const department = departments.find((item) => hasKeyword(fullText, item.keywords))?.label || ''
  const person = people.find((item) => hasKeyword(fullText, item.keywords))?.label || ''
  const matchedActions = actions.filter((item) => hasKeyword(fullText, item.keywords)).map((item) => item.label)

  return {
    department,
    person,
    actions: unique(matchedActions),
  }
}

function getServiceType(profile) {
  if (profile.actions.length >= 3 || profile.actions.includes('检查')) {
    return '全程陪诊'
  }
  if (profile.actions.includes('取药') && profile.actions.length === 1) {
    return '取药陪同'
  }
  if (profile.actions.includes('挂号') && profile.actions.length <= 2) {
    return '挂号协助'
  }
  return '就医陪同'
}

function getMaterials(text, profile) {
  const materials = ['身份证', '医保卡']

  if (hasKeyword(text, ['首次', '第一次', '初诊'])) {
    materials.push('既往病历')
  }
  if (hasKeyword(text, ['复诊', '检查', '取报告'])) {
    materials.push('检查报告')
  }
  if (profile.person === '老人') {
    materials.push('紧急联系人电话')
  }
  if (profile.person === '儿童') {
    materials.push('监护人证件')
  }
  if (profile.person === '孕妇') {
    materials.push('产检资料')
  }
  if (profile.department === '心内科') {
    materials.push('近期心电图或超声报告')
  }
  if (profile.department === '肿瘤科') {
    materials.push('病理资料和近期影像报告')
  }
  if (profile.department === '骨科') {
    materials.push('影像片或检查结果')
  }

  return unique(materials)
}

function getRiskTips(text, profile, context) {
  const riskTips = []

  if (hasKeyword(text, ['首次', '第一次', '初诊'])) {
    riskTips.push('首次就诊建议提前到院，预留更多时间')
  }
  if (profile.person === '老人') {
    riskTips.push('老人出行建议全程陪同，注意途中休息与安全')
  }
  if (profile.person === '儿童') {
    riskTips.push('儿童就诊通常需要监护人陪同，请提前准备证件')
  }
  if (profile.person === '孕妇') {
    riskTips.push('孕妇就诊请避免久站排队，必要时优先选择有人陪同')
  }
  if (profile.actions.includes('检查')) {
    riskTips.push('如涉及检查项目，请提前确认是否需要空腹或提前签到')
  }
  if (profile.actions.includes('取报告')) {
    riskTips.push('取报告前建议确认报告出具时间，避免二次往返')
  }
  if (context.visitTime) {
    riskTips.push(`已选择就诊时间：${context.visitTime}，请留意当天交通和排队情况`)
  }
  if (context.hospitalName) {
    riskTips.push(`已选择医院：${context.hospitalName}，请确认院区和科室位置`)
  }
  if (!riskTips.length) {
    riskTips.push('请提前确认医院位置、就诊时间和随身证件')
  }

  return unique(riskTips)
}

function getDemandDraft(text, profile, serviceType, context) {
  const segments = []

  if (profile.person) {
    segments.push(`服务对象为${profile.person}`)
  }
  if (hasKeyword(text, ['首次', '第一次', '初诊'])) {
    segments.push('属于首次就诊')
  }
  if (hasKeyword(text, ['复诊'])) {
    segments.push('本次为复诊安排')
  }
  if (profile.department) {
    segments.push(`目标科室为${profile.department}`)
  }

  segments.push(`需要协助完成${serviceType}`)

  if (profile.actions.length) {
    segments.push(`重点事项包含${profile.actions.join('、')}`)
  }
  if (context.hospitalName) {
    segments.push(`计划前往${context.hospitalName}`)
  }
  if (context.visitTime) {
    segments.push(`就诊时间为${context.visitTime}`)
  }
  if (context.companionName) {
    segments.push(`意向陪诊员为${context.companionName}`)
  }

  return `${segments.join('，')}。原始需求：${text}`
}

export default function mockAiOrderDraft(payload = {}) {
  const text = (payload.text || '').trim()
  const context = payload.context || {}
  const fullText = `${text} ${buildContextText(context)}`.trim()
  const profile = getSceneProfile(fullText)
  const serviceType = getServiceType(profile)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 10000,
          data: {
            serviceType,
            demandDraft: getDemandDraft(text || '需要陪同到院就诊', profile, serviceType, context),
            materials: getMaterials(fullText, profile),
            riskTips: getRiskTips(text, profile, context),
          },
        },
      })
    }, 700)
  })
}
