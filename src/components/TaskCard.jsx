import { Draggable } from '@hello-pangea/dnd'
import PriorityBadge from './PriorityBadge'
import { formatDueDate, isOverdue } from '../utils/helpers'

export default function TaskCard({ task, index, isDragDisabled, onEdit }) {
  const dueLabel = formatDueDate(task.dueDate)
  const overdue = isOverdue(task.dueDate)

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(task.id)}
          className={`group cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
            snapshot.isDragging
              ? 'rotate-2 border-indigo-300 shadow-lg ring-2 ring-indigo-400/50'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-800">{task.title}</h3>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">
              {task.description}
            </p>
          )}

          {dueLabel && (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs ${
                overdue ? 'font-medium text-rose-600' : 'text-slate-400'
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 5.25h15a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75Z"
                />
              </svg>
              {dueLabel}
              {overdue && <span>· overdue</span>}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
