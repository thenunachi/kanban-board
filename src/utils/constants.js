export const PRIORITIES = {
  low: {
    label: 'Low',
    badgeClass: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
    dotClass: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-100 text-amber-700 ring-amber-600/20',
    dotClass: 'bg-amber-500',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-rose-100 text-rose-700 ring-rose-600/20',
    dotClass: 'bg-rose-500',
  },
}

export const PRIORITY_ORDER = ['low', 'medium', 'high']

export const STORAGE_KEY = 'kanban-board-v1'

export const DEFAULT_BOARD = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Design the landing page',
      description: 'Hero section, feature grid and pricing table.',
      priority: 'high',
      dueDate: '2026-07-10',
      createdAt: '2026-07-07T09:00:00.000Z',
    },
    'task-2': {
      id: 'task-2',
      title: 'Set up CI pipeline',
      description: 'Lint, test and build on every push.',
      priority: 'medium',
      dueDate: '2026-07-18',
      createdAt: '2026-07-07T09:05:00.000Z',
    },
    'task-3': {
      id: 'task-3',
      title: 'Write onboarding docs',
      description: '',
      priority: 'low',
      dueDate: null,
      createdAt: '2026-07-07T09:10:00.000Z',
    },
    'task-4': {
      id: 'task-4',
      title: 'Implement auth flow',
      description: 'Email + password with session persistence.',
      priority: 'high',
      dueDate: '2026-07-12',
      createdAt: '2026-07-07T09:15:00.000Z',
    },
    'task-5': {
      id: 'task-5',
      title: 'Pick a color palette',
      description: 'Settled on indigo + slate.',
      priority: 'low',
      dueDate: '2026-07-01',
      createdAt: '2026-07-07T09:20:00.000Z',
    },
  },
  columns: {
    'col-todo': {
      id: 'col-todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'col-doing': {
      id: 'col-doing',
      title: 'In Progress',
      taskIds: ['task-4'],
    },
    'col-done': {
      id: 'col-done',
      title: 'Done',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['col-todo', 'col-doing', 'col-done'],
}
