# List Page Pattern — Global Filters + Stats + Grid

Standard three-layer layout for entity list pages (Invoices, Vendor Bills, Matters, etc.).

## Structure

```
+------------------------------------------------------------------+
| LAYER 1: Global Filters                                          |
|  [Date range ▾]  [Client ▾]  [Entity-specific filter ▾]  [Reset]|
+------------------------------------------------------------------+
| LAYER 2: Stats Cards                                             |
|  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            |
|  │ Pending  │ │Reviewing │ │ Approval │ │Completed │            |
|  │    12    │ │     7    │ │     3    │ │    45    │            |
|  │ $142.8K  │ │  $89.2K  │ │  $34.1K  │ │ $512.6K │            |
|  └──────────┘ └──────────┘ └──────────┘ └──────────┘            |
+------------------------------------------------------------------+
| LAYER 3: Grid                                                    |
|  [Search...] [Status ▾] [Chips...] [+ Filter]    [Settings] [⋯] |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │ DataGrid with rows, sort, select, pagination              │  |
|  └────────────────────────────────────────────────────────────┘  |
+------------------------------------------------------------------+
```

## Layer 1 — Global Filters

- Scopes **everything** on the page: stats cards + grid rows.
- Filters are entity-specific:
  - **Invoices**: Date range, Client, Matter, Assignee
  - **Vendor Bills**: Date range, Vendor, Period
  - **Matters**: Date range, Client, Practice area, Status
- Changing a global filter re-computes stats and re-filters the grid.
- "Reset" clears all global filters back to defaults.

### Filter Control Types

| Type | When to use | Example |
|------|-------------|---------|
| **Date range picker** | Date-based scoping (from/to) | Received date, Due date |
| **Select** (dropdown) | Many options, entity lookups | Vendor, Client, Matter |
| **Quick select** (inline pills) | 2-3 mutually exclusive options | Period (All / Mar / Q1), Type (All / Fees / Expenses) |

Quick select uses the `Segmented` primitive — inline button group, no dropdown.
Reserve dropdowns for fields with 4+ options.

## Layer 2 — Stats Cards

- Show **aggregated counts and totals** from the globally-filtered dataset.
- Each card represents a status bucket or workflow stage.
- Cards are **clickable** — clicking one pre-filters the grid to that status.
- Active card is visually highlighted; clicking again deselects (shows all).
- Values update live when global filters change.
- Card content: label, count, optional monetary total.

### Example — Invoices

| Card | Status filter applied |
|------|----------------------|
| Pending | `status = submitted` |
| Reviewing | `status = in_review` |
| Pending Approval | `status = approved` (awaiting final) |
| Completed | `status = paid, closed` |

### Example — Vendor Bills

| Card | Status filter applied |
|------|----------------------|
| Draft | `status = draft` |
| Under Review | `status = under_review` |
| Exception | `status = exception, over_cap` |
| Processed | `status = processed, closed` |

## Layer 3 — Grid (DataGrid)

- Has its own **secondary filters** in the toolbar:
  - Search input (text match across visible columns)
  - Column-specific chip filters
  - Advanced filter modal
- These filters are **additive**: Global filters + Stats card selection + Grid filters all compose.
- Toolbar also has: bulk actions, column settings, export.
- Pagination at the bottom.

## Data Flow

```
Global Filters (Layer 1)
    │
    ├──► Stats Cards (Layer 2) — aggregates from filtered dataset
    │        │
    │        └──► Card click sets a status pre-filter
    │
    └──► Grid (Layer 3) — rows from filtered dataset
             │
             └──► Grid toolbar filters further narrow rows
```

## Filter Composition Rule

```
visibleRows = allRows
  .filter(globalFilters)     // Layer 1
  .filter(statsCardFilter)   // Layer 2 (if a card is selected)
  .filter(gridToolbarFilter) // Layer 3 (search, chips, advanced)
```

## Design Notes

- Stats cards use the same `Card` / `KPI` primitives from the design system.
- Global filter bar sits in a sticky/fixed region below the page header.
- Cards should be compact — one row of 3-5 cards, not wrapping.
- On narrow viewports, cards scroll horizontally.
- Grid toolbar is part of `DataGridToolbar` — no changes needed there.
- Active stats card uses `--bg-accent-subtle` background + `--border-focus` border.
