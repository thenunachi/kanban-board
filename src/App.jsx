import { useCallback, useMemo, useState } from 'react'
import { useBoard } from './hooks/useBoard'
import Board from './components/Board'
import SearchFilterBar from './components/SearchFilterBar'
import TaskModal from './components/TaskModal'

export default function App() {
  const {
    board,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    renameColumn,
    deleteColumn,
    sortColumn,
    resetBoard,
  } = useBoard()

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  // null | { mode: 'create', columnId } | { mode: 'edit', taskId }
  const [modal, setModal] = useState(null)

  const normalizedSearch = search.trim().toLowerCase()
  const isFiltering = normalizedSearch !== '' || priorityFilter !== 'all'

  const matchesFilter = useCallback(
    (task) => {
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false
      }
      if (normalizedSearch) {
        const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase()
        return haystack.includes(normalizedSearch)
      }
      return true
    },
    [normalizedSearch, priorityFilter],
  )

  const taskCount = useMemo(
    () => Object.keys(board.tasks).length,
    [board.tasks],
  )

  const openCreateModal = (columnId) => setModal({ mode: 'create', columnId })
  const openEditModal = (taskId) => setModal({ mode: 'edit', taskId })
  const closeModal = () => setModal(null)

  const handleSave = (data) => {
    if (modal.mode === 'create') {
      addTask(modal.columnId, data)
    } else {
      updateTask(modal.taskId, data)
    }
    closeModal()
  }

  const handleDelete = () => {
    deleteTask(modal.taskId)
    closeModal()
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Kanban
          </h1>
          <span className="text-xs text-slate-400">
            {taskCount} task{taskCount === 1 ? '' : 's'}
          </span>
        </div>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          isFiltering={isFiltering}
        />
        <button
          onClick={() => {
            if (
              window.confirm(
                'Reset the board? All tasks and columns will be replaced with the sample data.',
              )
            ) {
              resetBoard()
            }
          }}
          className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        >
          Reset board
        </button>
      </header>

      <main className="min-h-0 flex-1">
        <Board
          board={board}
          matchesFilter={matchesFilter}
          isFiltering={isFiltering}
          search={search}
          onClearFilters={() => {
            setSearch('')
            setPriorityFilter('all')
          }}
          onMoveTask={moveTask}
          onAddTask={openCreateModal}
          onEditTask={openEditModal}
          onAddColumn={addColumn}
          onRenameColumn={renameColumn}
          onDeleteColumn={deleteColumn}
          onSortColumn={sortColumn}
        />
      </main>

      {modal && (
        <TaskModal
          key={modal.mode === 'edit' ? modal.taskId : 'create'}
          mode={modal.mode}
          task={modal.mode === 'edit' ? board.tasks[modal.taskId] : null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
