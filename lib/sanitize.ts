const MAX_FIELD_LENGTH = 500

const SUSPICIOUS_PATTERNS = [
  /ignore\s+(as|the|todas?\s+as)\s+instru[çc][õo]es/gi,
  /ignore\s+(previous|prior|above)\s+instructions/gi,
  /you\s+are\s+now/gi,
  /\bSYSTEM\s*:/gi,
  /\bASSISTANT\s*:/gi,
  /\bUSER\s*:/gi,
  /```[\s\S]*```/g,
  /<\/?(?:script|system|prompt|instruction)[^>]*>/gi,
  /\[\s*INST\s*\]/gi,
  /\b(?:jailbreak|bypass|override)\b/gi,
]

function sanitizeField(value: string, maxLength = MAX_FIELD_LENGTH): string {
  if (!value || typeof value !== 'string') return ''

  let clean = value.slice(0, maxLength).trim()

  for (const pattern of SUSPICIOUS_PATTERNS) {
    clean = clean.replace(pattern, '[removido]')
  }

  return clean
}

export function sanitizeFormData(dados: Record<string, unknown>): Record<string, unknown> {
  const textFields = [
    'cargo_atual', 'area', 'cargo_objetivo', 'motivacao',
    'habilidades', 'gaps', 'entrevistas', 'contexto',
  ]

  const sanitized = { ...dados }

  for (const field of textFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeField(sanitized[field] as string)
    }
  }

  return sanitized
}
