import { useEffect, useState } from 'react'
import { PRIORITIES, PRIORITY_ORDER } from '../utils/constants'

const EMPTY_FORM = { title: '', description: '', priority: 'medium', dueDate: '' }

// Today as YYYY-MM-DD in the user's local timezone
const todayISO = () => new Date().toLocaleDateString('en-CA')

export default function TaskModal({ mode, task, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() =>
    task
      ? {
          title: task.title,
          description: task.description ?? '',
          priority: task.priority,
          dueDate: task.dueDate ?? '',
        }
      : EMPTY_FORM,
  )

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const [errors, setErrors] = useState({})

  const setField = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear the field's error as soon as the user starts fixing it
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) {
      next.title = 'Please enter a title'
    }
    if (mode === 'create' && form.dueDate && form.dueDate < todayISO()) {
      next.dueDate = "Due date can't be in the past"
    }
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    })
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {mode === 'create' ? 'New task' : 'Edit task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              autoFocus
              value={form.title}
              onChange={setField('title')}
              placeholder="What needs doing?"
              aria-invalid={Boolean(errors.title)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-400/30'
                  : 'border-slate-300 focus:border-indigo-400 focus:ring-indigo-400/30'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={setField('description')}
              rows={3}
              placeholder="Add more detail…"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={setField('priority')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              >
                {PRIORITY_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {PRIORITIES[key].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={setField('dueDate')}
                min={mode === 'create' ? todayISO() : undefined}
                aria-invalid={Boolean(errors.dueDate)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                  errors.dueDate
                    ? 'border-rose-400 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-400/30'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-indigo-400/30'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {mode === 'edit' ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {mode === 'create' ? 'Add task' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
