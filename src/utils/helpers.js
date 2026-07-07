export function uid(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function formatDueDate(isoDate) {
  if (!isoDate) return null
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

export function isOverdue(isoDate) {
  if (!isoDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${isoDate}T00:00:00`)
  return due < today
}
