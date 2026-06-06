function toCleanString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback
}

function toCleanList(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback
  }

  return [...new Set(value.map((item) => toCleanString(item)).filter(Boolean))]
}

export default function normalizeAiResult(result = {}, text = '') {
  const serviceType = toCleanString(result.serviceType, '就医陪同')
  const demandDraft = toCleanString(
    result.demandDraft,
    text ? `需要协助到院就医。原始需求：${text}` : '需要协助到院就医。',
  )

  const materials = toCleanList(result.materials, ['身份证', '医保卡'])
  const riskTips = toCleanList(result.riskTips, ['请提前确认就诊时间、院区位置和随身证件'])

  return {
    serviceType,
    demandDraft,
    materials: materials.length ? materials : ['身份证', '医保卡'],
    riskTips: riskTips.length ? riskTips : ['请提前确认就诊时间、院区位置和随身证件'],
  }
}
