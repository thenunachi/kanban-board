import { useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './Column'

export default function Board({
  board,
  matchesFilter,
  isFiltering,
  search,
  onClearFilters,
  onMoveTask,
  onAddTask,
  onEditTask,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onSortColumn,
}) {
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const commitNewColumn = () => {
    const trimmed = newColumnTitle.trim()
    if (trimmed) onAddColumn(trimmed)
    setNewColumnTitle('')
    setIsAddingColumn(false)
  }

  const visibleCount = isFiltering
    ? Object.values(board.tasks).filter(matchesFilter).length
    : Object.keys(board.tasks).length

  return (
    <DragDropContext onDragEnd={onMoveTask}>
      <div className="flex h-full flex-col">
        {isFiltering && visibleCount === 0 && (
          <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 sm:mx-6">
            <p className="text-sm text-amber-800">
              No tasks match
              {search.trim() ? (
                <>
                  {' '}
                  <span className="font-semibold">“{search.trim()}”</span>
                </>
              ) : (
                ' the selected filter'
              )}
              . Try a different search or priority.
            </p>
            <button
              onClick={onClearFilters}
              className="shrink-0 rounded-md bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-200"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="flex min-h-0 flex-1 items-start gap-4 overflow-x-auto p-4 sm:p-6">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId]
            const tasks = column.taskIds
              .map((taskId) => board.tasks[taskId])
              .filter((task) => task && matchesFilter(task))
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                isFiltering={isFiltering}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onRenameColumn={onRenameColumn}
                onDeleteColumn={onDeleteColumn}
                onSortColumn={onSortColumn}
              />
            )
          })}

          {isAddingColumn ? (
            <div className="w-72 shrink-0 rounded-xl bg-slate-100/80 p-3 shadow-sm ring-1 ring-slate-200">
              <input
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitNewColumn()
                  if (e.key === 'Escape') {
                    setNewColumnTitle('')
                    setIsAddingColumn(false)
                  }
                }}
                placeholder="Column name…"
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={commitNewColumn}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Add column
                </button>
                <button
                  onClick={() => {
                    setNewColumnTitle('')
                    setIsAddingColumn(false)
                  }}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="flex w-72 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-400 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-500"
            >
              <span className="text-base leading-none">+</span> Add column
            </button>
          )}
        </div>
      </div>
    </DragDropContext>
  )
}
