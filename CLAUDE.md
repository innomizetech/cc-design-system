# XTND Design System — AI/LLM Guide

## What This Is

XTND is an enterprise design system for legal billing, matter management, and financial operations. It's a **static prototype** — no build step, no npm, no bundler. React components are transpiled in-browser via Babel Standalone.

## Tech Stack

- **React 18.3.1** (UMD from CDN)
- **Babel Standalone 7.29.0** (in-browser JSX transpilation)
- **CSS custom properties** (364 design tokens, 3-layer system)
- **No package.json, no node_modules, no build command**

## How to Run

The user runs the local server themselves. **Do NOT start a dev server from AI/agent tools.**

```bash
python3 -m http.server 8080
# Open http://localhost:8080/ui_kit/
```

## Project Structure

```
├── colors_and_type.css       # Design tokens (brand → semantic → component)
├── components.css            # Component styles (all .x- prefixed)
├── fonts/                    # Inter, JetBrains Mono, Source Serif 4 (woff2)
├── docs/                     # Design specs (design-system.md, datagrid-toolbar.md)
├── ui_kit/
│   ├── index.html            # App entry — loads all scripts, renders root
│   ├── Icon.jsx              # 80+ SVG icons (Phosphor style)
│   ├── Primitives.jsx        # Button, Badge, Input, Checkbox, Avatar, Chip, Tabs, Card, etc.
│   ├── AppShell.jsx          # Layout grid, navigation, module system
│   ├── Dashboard.jsx         # KPI dashboard
│   ├── InvoiceGrid.jsx       # Invoice list page
│   ├── InvoiceDetail.jsx     # Invoice detail (legacy)
│   ├── InvoiceDetailP1.jsx   # Invoice detail (Paradigm 1: Tabs + Side Column)
│   ├── VendorBillGrid.jsx    # Bill list page
│   ├── VendorBillDetail.jsx  # Bill detail (Paradigm 2: Block Stacked)
│   ├── VendorBillDetailV2.jsx # Bill detail (Paradigm 3: CRM Two-Column)
│   ├── MatterGrid.jsx        # Matter list page
│   ├── MatterDetail.jsx      # Matter detail page
│   ├── Settings.jsx          # Admin settings hub
│   ├── UserPages.jsx         # Profile & user settings
│   ├── SharedDetailComponents.jsx # Reusable detail page parts
│   ├── SidePanel.jsx         # Resizable right panel
│   ├── NotificationsDrawer.jsx # Notification overlay
│   ├── ParadigmShowcase.jsx  # Detail paradigm demos
│   └── data-grid/            # DataGrid component system
│       ├── data-grid.css     # Grid-specific styles
│       ├── DataGrid.jsx      # Core table (sort, select, virtual scroll, grouping)
│       ├── DataGridToolbar.jsx # Toolbar: actions, settings panel, GridSelect
│       ├── DataGridFilters.jsx # Search input, chip filters, advanced modal
│       ├── DataGridBulkBar.jsx # Bulk action bar (floating/inline)
│       ├── DataGridPagination.jsx # Page nav + page size
│       ├── useGridFilters.jsx # Filter state hook with URL sync
│       └── DataGridDemo.jsx  # Full grid showcase + Invoices page
```

## Critical: How Globals Work

There is **no module system**. Every file exports to `window` via:

```jsx
Object.assign(window, { ComponentName, helperFn });
```

Other files access these as bare globals. The `/* global React, Button, Icon */` comment at the top of each file is an ESLint hint — it does NOT import anything.

### Babel Standalone Gotcha

Babel Standalone transpiles `const` → `var`. Top-level `var` goes on `window`. This means:

**DO NOT** create a local variable with the same name as a cross-file global:
```jsx
// BAD — overwrites window.GridSearchInput, causes infinite recursion
const GridSearchInput = (props) => React.createElement(window.GridSearchInput, props);
```

**DO** use a Proxy for lazy window access:
```jsx
const _W = new Proxy({}, { get: (_, k) => window[k] });
// Then use <_W.GridSearchInput ... /> in JSX
```

This pattern is already used in `DataGridDemo.jsx`, `DataGridFilters.jsx`, and `DataGridPagination.jsx`.

## Script Loading Order

Scripts in `ui_kit/index.html` load sequentially. Dependencies must come first:

1. React + ReactDOM (CDN)
2. Babel Standalone
3. Icon.jsx → Primitives.jsx (foundation)
4. data-grid/* (utility hooks → core → toolbar → filters → bulk → pagination → demo)
5. Shell components (SidePanel, NotificationsDrawer, AppShell)
6. Domain pages (Invoices, Bills, Matters, Settings, Users)
7. Inline `<script type="text/babel">` at bottom (App root)

When adding a new file, add the `<script>` tag in index.html **after** its dependencies.

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| CSS classes | `x-` prefix, BEM-like | `.x-btn--primary`, `.x-grid__header` |
| State classes | `is-` prefix | `.is-active`, `.is-collapsed` |
| CSS variables | Semantic names | `--fg-2`, `--bg-surface`, `--sp-4` |
| Components | PascalCase | `DataGrid`, `ChipFilterBar` |
| Utilities | camelCase | `fmtMoney`, `cls` |
| Constants | UPPER_SNAKE | `DEMO_ROWS`, `NAV_ITEMS` |
| Files | PascalCase.jsx | `InvoiceGrid.jsx` |

## CSS Token System (3 layers)

1. **Brand** — raw HSL values: `--n-500`, `--primary-600`, `--error-400`
2. **Semantic** — meaning-based aliases: `--fg-1`, `--bg-surface`, `--border-focus`
3. **Component** — sizing/spacing: `--btn-h`, `--row-h`, `--card-pad`

Dark mode flips semantic layer only. Density modes override component layer. Never reference brand tokens in components — always use semantic.

## Component Patterns

**Primitives** — minimal, class-driven:
```jsx
const Button = ({ variant = 'secondary', size, icon, children, className, ...rest }) => (
  <button className={cls('x-btn', `x-btn--${variant}`, size && `x-btn--${size}`, className)} {...rest}>
    {icon && <Icon name={icon} />}
    {children}
  </button>
);
```

**Composition via slots** — DataGrid accepts toolbar, footer, bulkBar as JSX:
```jsx
<DataGrid
  columns={...} rows={...}
  toolbar={<> <GridSearchInput .../> <ChipFilterBar .../> </>}
  footer={<DataGridPagination .../>}
  bulkBar={<BulkActionBar .../>}
/>
```

## Key Design Rules

- **No gradients, decorative shadows, or playful animations** — professional calm
- **WCAG AAA contrast** baked into color scale
- **3 density modes**: compact (28px rows), default (36px), comfortable (44px)
- `prefers-reduced-motion: reduce` supported
- All interactive elements must have visible focus indicators
- Z-index scale: 1-10 internals, 30-40 floats, 45-50 chrome, 80-85 modals, 100 fullscreen

## Don't

- Don't start dev servers — the user handles that. Ask them to run it if testing is needed
- Don't add npm/package.json/build tools — this is intentionally zero-build
- Don't use ES module imports/exports — use `Object.assign(window, {...})`
- Don't reference brand tokens (`--n-500`) in components — use semantic (`--fg-2`)
- Don't create wrapper functions with same name as existing globals (Babel `var` hoisting)
- Don't add dependencies beyond React and Babel Standalone
