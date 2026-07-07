import { PRIORITIES } from '../utils/constants'

export default function PriorityBadge({ priority }) {
  const config = PRIORITIES[priority] ?? PRIORITIES.medium
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${config.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  )
}
