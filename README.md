# Kanban Board

A Trello-style Kanban board built with **React**, **Vite**, and **Tailwind CSS**. All data lives in your browser's localStorage — no backend, no API keys.

## Features

- **Columns** — starts with *To Do / In Progress / Done*; add your own, rename with a double-click, delete with confirmation.
- **Tasks** — title, description, priority tag (Low / Medium / High), and due date. Overdue tasks are flagged in red.
- **Drag & drop** — move cards between columns or reorder within one, powered by [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd).
- **Search & filter** — live search by title/description plus priority filter chips, with a clear "no results" banner. Drag & drop pauses while filtering to prevent accidental misordering.
- **Sorting** — sort any column by due date (soonest first) or priority (high first) from the column header menu.
- **Validation** — required title and no past due dates on new tasks, with inline error messages.
- **Persistence** — the whole board survives refresh via localStorage. A *Reset board* button restores the sample data.

## Getting started

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── App.jsx                    # Layout, search/filter state, modal orchestration
├── components/
│   ├── Board.jsx              # DragDropContext, columns row, add-column UI
│   ├── Column.jsx             # Droppable column: rename, delete, sort menu
│   ├── TaskCard.jsx           # Draggable card with priority badge & due date
│   ├── TaskModal.jsx          # Create/edit form with validation
│   ├── SearchFilterBar.jsx    # Search input + priority filter chips
│   └── PriorityBadge.jsx      # Colored priority tag
├── hooks/
│   ├── useBoard.js            # All board state + actions (single source of truth)
│   └── useLocalStorage.js     # Generic localStorage persistence hook
└── utils/
    ├── constants.js           # Priorities, seed data, storage key
    └── helpers.js             # id generation, date formatting, overdue check
```

## Data model

State is normalized for cheap, immutable updates:

```js
{
  tasks:       { "task-1": { id, title, description, priority, dueDate, createdAt } },
  columns:     { "col-todo": { id, title, taskIds: ["task-1"] } },
  columnOrder: ["col-todo", "col-doing", "col-done"]
}
```

Moving a card only touches `taskIds` arrays; the task objects never move.

## Tech stack

- [React 19](https://react.dev/) — functional components + hooks
- [Vite](https://vite.dev/) — dev server & build
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) — drag & drop
