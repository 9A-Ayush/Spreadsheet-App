<p align="center">
  <img src="https://novellum-filestore-mcp.s3.us-east-2.amazonaws.com/atxp:atxp_acct_SvsxVZXbKQdUth26yjiiQ/e981cefd-c38d-4cec-87ae-c8ebc18c5b9f.png" alt="Spreadsheet App Banner" width="600" />
</p>

<h1 align="center">📊 Spreadsheet App</h1>

<p align="center">
  A full-featured, browser-based spreadsheet application built with <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Vite</strong>.<br/>
  Supports formulas, sorting, filtering, keyboard shortcuts, clipboard operations, and persistent local storage — all running entirely in the client.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-usage-guide">Usage Guide</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

### 🧮 Core Spreadsheet
- **Dynamic Grid** — Configurable rows and columns with a responsive, scrollable layout
- **Cell Editing** — Click or double-click any cell to edit; press `Enter` to confirm, `Escape` to cancel
- **Active Cell Highlight** — Visual indicator for the currently selected cell
- **Range Selection** — Click and drag or `Shift+Click` to select a range of cells
- **Formula Bar** — Displays and allows editing of the current cell's raw value/formula

### 📐 Formulas & Computation
- **Formula Support** — Enter formulas starting with `=` (e.g., `=A1+B2`, `=SUM(A1:A10)`)
- **Built-in Functions:**

| Function | Description | Example |
|---|---|---|
| `SUM(range)` | Sum of values | `=SUM(A1:A10)` |
| `AVERAGE(range)` | Average of values | `=AVERAGE(B1:B20)` |
| `MIN(range)` | Minimum value | `=MIN(C1:C20)` |
| `MAX(range)` | Maximum value | `=MAX(C1:C20)` |
| `COUNT(range)` | Count of numeric values | `=COUNT(A1:A10)` |
| `IF(cond, t, f)` | Conditional logic | `=IF(A1>0, "Yes", "No")` |

- **Cell References** — Reference other cells directly (e.g., `=A1`, `=B2+C3`)
- **Automatic Recalculation** — Dependent cells update automatically when referenced cells change

### 🔃 Sorting & Filtering
- **Column Sorting** — Click column headers to sort ascending/descending
- **Column Filtering** — Filter rows by specific values in any column
- **Filter Dropdowns** — Interactive dropdown menus on column headers
- **Combined Sort + Filter** — Sort and filter work together seamlessly

### ⌨️ Clipboard & Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + C` | Copy selected cells |
| `Ctrl + V` | Paste from clipboard |
| `Ctrl + X` | Cut selected cells |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Delete` / `Backspace` | Clear selected cells |
| `Arrow Keys` | Navigate between cells |
| `Tab` | Move to next cell (right) |
| `Shift + Tab` | Move to previous cell (left) |
| `Enter` | Confirm edit / Move down |
| `Escape` | Cancel editing |

### 💾 Persistence
- **Auto-Save** — Debounced auto-save to `localStorage` after every change
- **Auto-Load** — Automatically restores your last session on page load
- **No Backend Required** — Everything runs 100% in the browser

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety |
| [Vite 6](https://vitejs.dev/) | Build tool & dev server |
| [useReducer](https://react.dev/reference/react/useReducer) | State management |
| [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) | Styling |
| [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | Client-side persistence |

---

## 📁 Project Structure

```
spreadsheet/
├── public/                          # Static assets
├── src/
│   ├── components/                  # React UI components
│   │   ├── Spreadsheet.tsx          # Main spreadsheet container
│   │   ├── Grid.tsx                 # Grid rendering with virtualized rows
│   │   ├── CellComponent.tsx        # Individual cell component
│   │   ├── HeaderCell.tsx           # Column header with sort/filter
│   │   ├── FilterDropdown.tsx       # Filter dropdown menu
│   │   ├── FormulaBar.tsx           # Formula bar for cell editing
│   │   └── Toolbar.tsx              # Toolbar with actions
│   │
│   ├── store/                       # State management
│   │   ├── types.ts                 # TypeScript types & interfaces
│   │   ├── actions.ts               # Action type definitions
│   │   └── reducer.ts               # Main reducer logic
│   │
│   ├── utils/                       # Utility / helper functions
│   │   ├── formula.ts               # Formula parsing & computation engine
│   │   ├── cellRefs.ts              # Cell reference helpers (A1 ↔ row/col)
│   │   ├── clipboard.ts             # Clipboard parsing & serialization
│   │   ├── filtering.ts             # Filter option extraction
│   │   ├── persistence.ts           # localStorage save/load
│   │   ├── selection.ts             # Selection detection utilities
│   │   └── visibleRows.ts           # Row visibility (sort + filter)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useKeyboardShortcuts.ts  # Keyboard event handling
│   │   └── useDebouncedPersistence.ts # Auto-save with debounce
│   │
│   ├── App.tsx                      # Root app component
│   ├── App.css                      # Global styles
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Base styles
│
├── index.html                       # HTML entry point
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Node-specific TS config
├── vite.config.ts                   # Vite configuration
├── eslint.config.js                 # ESLint configuration
├── package.json                     # Dependencies & scripts
└── README.md                        # You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/spreadsheet.git
cd spreadsheet

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

App will be available at **http://localhost:5173** 🚀

### Production Build

```bash
# Create an optimized build
npm run build

# Preview the build locally
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📦 Available Scripts

| Script | Command | Description |
|---|---|---|
| dev | `npm run dev` | Start Vite development server with HMR |
| build | `npm run build` | TypeScript check + production build |
| preview | `npm run preview` | Preview the production build locally |
| lint | `npm run lint` | Run ESLint across the codebase |

---

## 📖 Usage Guide

### Basic Editing
1. Click any cell to select it
2. Start typing to enter a value (or press `F2` to edit)
3. Press `Enter` to confirm or `Escape` to cancel
4. Use `Arrow Keys` to navigate between cells

### Working with Formulas

Start any cell value with `=` to create a formula:

```
=A1 + B1                    → Add two cells
=A1 * 2 + B1 / 3            → Arithmetic operations
=SUM(A1:A100)                → Sum a range
=AVERAGE(B1:B50)             → Average a range
=IF(A1 > 10, "High", "Low") → Conditional logic
=MAX(C1:C20) - MIN(C1:C20)  → Spread calculation
```

### Sorting Data
- Click a column header → sorts ascending ↑
- Click again → sorts descending ↓
- Click a third time → removes the sort

### Filtering Data
1. Click the filter icon (`▼`) on any column header
2. Check/uncheck values in the dropdown
3. Click **Apply** to filter visible rows
4. Click **Clear** to remove the filter

### Copy & Paste
- Select a range → `Ctrl+C` → navigate to target → `Ctrl+V`
- Works with external applications (Excel, Google Sheets, etc.)
- Paste multi-cell data from other spreadsheets directly

---

## 🏗️ Architecture

### State Management

The app uses React's `useReducer` for predictable, centralized state:

```
User Action → dispatch(action) → reducer(state, action) → newState → Re-render
```

### Core State Shape

```typescript
interface SpreadsheetState {
  cells: Record<string, CellData>;      // All cell data keyed by "row,col"
  rows: number;                          // Total row count
  cols: number;                          // Total column count
  activeCell: ActiveCell | null;         // Currently focused cell
  selection: Selection | null;           // Current range selection
  sortColumn: number | null;             // Column being sorted
  sortDirection: SortDirection;          // "asc" | "desc" | null
  filters: Record<number, Set<string>>; // Active column filters
}
```

### Data Flow

```
┌─────────────────┐
│   User Input     │
│ (click, type,    │
│  keyboard, etc.) │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐     ┌─────────────────┐
│    Dispatch      │────▶│     Reducer     │
│  (action)        │     │  (pure function) │
└─────────────────┘     └───────┬─────────┘
                                │
                         ┌──────▼──────┐
                         │  New State   │
                         └──────┬──────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
   ┌──────▼──────┐     ┌───────▼───────┐     ┌──────▼───────┐
   │ computeAll  │     │ getVisible    │     │  Auto-Save   │
   │ Cells()     │     │ Rows()        │     │  (debounced) │
   │ (formulas)  │     │ (sort+filter) │     │  localStorage│
   └──────┬──────┘     └───────┬───────┘     └──────────────┘
          │                     │
   ┌──────▼─────────────────────▼──────┐
   │          Render Grid              │
   │   (visible rows × columns)        │
   └───────────────────────────────────┘
```

### Computation Pipeline

```
Raw Cell Value → Is Formula? → Parse → Resolve Cell Refs → Evaluate → Display Value
                    │
                    └─ No → Display raw value directly
```

---

## ⚙️ Configuration

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
```

### Grid Size

Modify default grid dimensions in `Spreadsheet.tsx`:

```typescript
const DEFAULT_ROWS = 100;   // Number of rows
const DEFAULT_COLS = 26;    // Number of columns (A-Z)
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>❌ Vite can't resolve imports / "Does the file exist?"</strong></summary>

If your project is in OneDrive, the "Files On-Demand" feature can prevent Vite/Node.js from reading files.

```bash
# Option 1: Move project out of OneDrive
xcopy /E /I "C:\Users\you\OneDrive\Desktop\spreadsheet" "C:\Dev\spreadsheet"
cd C:\Dev\spreadsheet
npm install && npm run dev

# Option 2: Force files to stay local
# Right-click src/utils/ → "Always keep on this device"
```

Clear Vite cache:

```bash
rmdir /s /q node_modules\.vite
npm run dev
```
</details>

<details>
<summary><strong>❌ Blank screen / white page</strong></summary>

- Open DevTools (`F12`) → check **Console** tab for errors
- Ensure you ran `npm install` before `npm run dev`
- Full reset:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```
</details>

<details>
<summary><strong>❌ LocalStorage issues / stale data</strong></summary>

Open browser console (`F12`) and run:

```javascript
localStorage.removeItem('spreadsheet-data');
location.reload();
```
</details>

<details>
<summary><strong>❌ Port 5173 already in use</strong></summary>

```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or just use a different port
npx vite --port 3000
```
</details>

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Guidelines
- ✅ Use TypeScript for all new files
- ✅ Follow existing patterns (actions + reducer)
- ✅ Keep utility functions pure (no side effects)
- ✅ Add proper type annotations to all exports
- ✅ Test your changes before submitting

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Lightning-fast build tool
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- Inspired by Google Sheets and Microsoft Excel

---

<p align="center">
  <strong>Built with ❤️ using React + TypeScript + Vite</strong>
</p>

<p align="center">
  <a href="#-spreadsheet-app">⬆ Back to top</a>
</p>
