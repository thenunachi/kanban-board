import { PRIORITIES, PRIORITY_ORDER } from '../utils/constants'

export default function SearchFilterBar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  isFiltering,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks…"
          className="w-56 rounded-lg border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-slate-200/70 p-1">
        <FilterChip
          label="All"
          active={priorityFilter === 'all'}
          onClick={() => onPriorityFilterChange('all')}
        />
        {PRIORITY_ORDER.map((key) => (
          <FilterChip
            key={key}
            label={PRIORITIES[key].label}
            active={priorityFilter === key}
            onClick={() => onPriorityFilterChange(key)}
          />
        ))}
      </div>

      {isFiltering && (
        <span className="text-xs text-slate-400 italic">
          Filtering — drag &amp; drop paused
        </span>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-white text-slate-800 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  )
}
