import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_BOARD, PRIORITY_ORDER, STORAGE_KEY } from '../utils/constants'
import { uid } from '../utils/helpers'

function compareTasks(a, b, by) {
  if (by === 'priority') {
    // High first
    return PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority)
  }
  // Due date: soonest first, undated tasks last
  if (!a.dueDate && !b.dueDate) return 0
  if (!a.dueDate) return 1
  if (!b.dueDate) return -1
  return a.dueDate.localeCompare(b.dueDate)
}

export function useBoard() {
  const [board, setBoard] = useLocalStorage(STORAGE_KEY, DEFAULT_BOARD)

  const addTask = (columnId, { title, description, priority, dueDate }) => {
    const id = uid('task')
    setBoard((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [id]: {
          id,
          title,
          description,
          priority,
          dueDate,
          createdAt: new Date().toISOString(),
        },
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          taskIds: [...prev.columns[columnId].taskIds, id],
        },
      },
    }))
  }

  const updateTask = (taskId, updates) => {
    setBoard((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { ...prev.tasks[taskId], ...updates },
      },
    }))
  }

  const deleteTask = (taskId) => {
    setBoard((prev) => {
      const tasks = { ...prev.tasks }
      delete tasks[taskId]
      const columns = Object.fromEntries(
        Object.entries(prev.columns).map(([id, col]) => [
          id,
          col.taskIds.includes(taskId)
            ? { ...col, taskIds: col.taskIds.filter((tid) => tid !== taskId) }
            : col,
        ]),
      )
      return { ...prev, tasks, columns }
    })
  }

  const moveTask = ({ source, destination, draggableId }) => {
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    setBoard((prev) => {
      const startCol = prev.columns[source.droppableId]
      const endCol = prev.columns[destination.droppableId]

      if (startCol.id === endCol.id) {
        const taskIds = [...startCol.taskIds]
        taskIds.splice(source.index, 1)
        taskIds.splice(destination.index, 0, draggableId)
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [startCol.id]: { ...startCol, taskIds },
          },
        }
      }

      const startIds = [...startCol.taskIds]
      startIds.splice(source.index, 1)
      const endIds = [...endCol.taskIds]
      endIds.splice(destination.index, 0, draggableId)
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [startCol.id]: { ...startCol, taskIds: startIds },
          [endCol.id]: { ...endCol, taskIds: endIds },
        },
      }
    })
  }

  const addColumn = (title) => {
    const id = uid('col')
    setBoard((prev) => ({
      ...prev,
      columns: { ...prev.columns, [id]: { id, title, taskIds: [] } },
      columnOrder: [...prev.columnOrder, id],
    }))
  }

  const renameColumn = (columnId, title) => {
    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...prev.columns[columnId], title },
      },
    }))
  }

  const deleteColumn = (columnId) => {
    setBoard((prev) => {
      const tasks = { ...prev.tasks }
      for (const taskId of prev.columns[columnId].taskIds) {
        delete tasks[taskId]
      }
      const columns = { ...prev.columns }
      delete columns[columnId]
      return {
        ...prev,
        tasks,
        columns,
        columnOrder: prev.columnOrder.filter((id) => id !== columnId),
      }
    })
  }

  const sortColumn = (columnId, by) => {
    setBoard((prev) => {
      const column = prev.columns[columnId]
      const taskIds = [...column.taskIds].sort((a, b) =>
        compareTasks(prev.tasks[a], prev.tasks[b], by),
      )
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: { ...column, taskIds },
        },
      }
    })
  }

  const resetBoard = () => setBoard(structuredClone(DEFAULT_BOARD))

  return {
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
  }
}
