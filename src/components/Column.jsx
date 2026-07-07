import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

export default function Column({
  column,
  tasks,
  isFiltering,
  onAddTask,
  onEditTask,
  onRenameColumn,
  onDeleteColumn,
  onSortColumn,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(column.title)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)

  const handleSort = (by) => {
    onSortColumn(column.id, by)
    setSortMenuOpen(false)
  }

  const commitTitle = () => {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed)
    } else {
      setTitleDraft(column.title)
    }
    setIsEditingTitle(false)
  }

  const handleDelete = () => {
    const count = column.taskIds.length
    if (
      count === 0 ||
      window.confirm(
        `Delete "${column.title}" and its ${count} task${count === 1 ? '' : 's'}?`,
      )
    ) {
      onDeleteColumn(column.id)
    }
  }

  return (
    <section className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-slate-100/80 shadow-sm ring-1 ring-slate-200">
      <header className="group flex items-center gap-2 px-3 pt-3 pb-2">
        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle()
              if (e.key === 'Escape') {
                setTitleDraft(column.title)
                setIsEditingTitle(false)
              }
            }}
            className="w-full rounded-md border border-indigo-300 bg-white px-2 py-0.5 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        ) : (
          <>
            <h2
              onDoubleClick={() => setIsEditingTitle(true)}
              title="Double-click to rename"
              className="truncate text-sm font-semibold text-slate-700"
            >
              {column.title}
            </h2>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
              {tasks.length}
            </span>
            <div
              className={`relative ml-auto flex items-center transition-opacity group-hover:opacity-100 ${
                sortMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={() => setSortMenuOpen((open) => !open)}
                title="Sort tasks"
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                  />
                </svg>
              </button>
              {sortMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortMenuOpen(false)}
                  />
                  <div className="absolute top-7 right-0 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => handleSort('dueDate')}
                      className="block w-full px-3 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Sort by due date
                    </button>
                    <button
                      onClick={() => handleSort('priority')}
                      className="block w-full px-3 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Sort by priority
                    </button>
                  </div>
                </>
              )}
              <button
                onClick={handleDelete}
                title="Delete column"
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-500"
              >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              </button>
            </div>
          </>
        )}
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-[60px] flex-1 flex-col gap-2 overflow-y-auto px-3 pb-2 transition-colors ${
              snapshot.isDraggingOver ? 'rounded-lg bg-indigo-50/70' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                isDragDisabled={isFiltering}
                onEdit={onEditTask}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="py-4 text-center text-xs text-slate-400">
                {isFiltering ? 'No matching tasks' : 'Drop tasks here'}
              </p>
            )}
          </div>
        )}
      </Droppable>

      <footer className="px-3 pb-3">
        <button
          onClick={() => onAddTask(column.id)}
          className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
        >
          <span className="text-base leading-none">+</span> Add task
        </button>
      </footer>
    </section>
  )
}
