# XTND Design System Specification

XTND is an enterprise application platform for legal billing, matter management, and financial operations. This design system governs the visual language, interaction patterns, and architectural decisions for all modules in the product suite.

This is an **application design system** — not a marketing website. Every decision optimizes for daily use by professionals who spend 6-8 hours in the product. Speed of comprehension, keyboard efficiency, and information density take priority over first-impression aesthetics.

---

## Part 1: Design Principles

### 1. Professional Calm
Enterprise software must fade into the background of work. No visual noise — no gradients, decorative shadows, or playful animations. Visual weight signals importance: if everything is bold, nothing is. The interface should feel like a well-organized desk, not a dashboard demo.

### 2. Density is a Tool
Users process hundreds of records daily. The UI provides three density modes — compact, default, comfortable — not as a preference but as a contextual tool. Compact for scanning invoices. Comfortable for reviewing a single document. The system adapts spacing, typography, and component sizing across all three modes through a single attribute change.

### 3. Semantic Over Literal
Every color, spacing value, and font size is referenced by meaning, not value. Components ask for `--fg-2` (secondary text), not `#6b7280`. This indirection enables:
- Dark mode without touching component code
- Multi-tenant brand customization
- Density scaling through token overrides
- Future theme variations (high contrast, color-blind safe)

### 4. Composition Over Configuration
Complex interfaces are assembled from small, reusable primitives. A data grid is not a monolith — it's a table + toolbar slot + filter components + pagination + bulk bar, each independently useful. This means:
- Any page can compose its own toolbar without forking a component
- Filters work outside grids (in search pages, dashboards)
- Detail drawers wrap any content, not just grid rows

### 5. Accessibility is Structural
WCAG AAA is not a checklist applied at the end. It's embedded in the architecture:
- Contrast ratios are baked into the color scale — no alias can produce a failing pair
- Focus indicators survive `all: unset` via global specificity rules
- Touch targets meet 44px in comfortable density
- `prefers-reduced-motion` disables all animation by default
- Semantic HTML is the floor, not the ceiling

### 6. Scale-Ready Architecture
The system is designed for a growing product suite with 6+ modules, 50+ entities, and teams contributing simultaneously:
- Token-based theming prevents one-off overrides
- Navigation adapts to module count (overflow → "More" menu)
- Page patterns are entity-agnostic — the same paradigm works for invoices, matters, users, and roles
- Multi-tenant brand layer allows per-customer customization without forking CSS

---

## Part 2: Information Architecture

### Module System
XTND is a suite of modules, each focused on a domain:

| Module | Domain | Icon |
|--------|--------|------|
| Willow | Billing console (invoices, review workflows) | matter |
| Banyan | Matter management (intake, budgets, timekeepers) | building |
| Heartwood | General ledger (trust, receivables, financial) | ledger |
| Sycamore | Vendor portal (bill submission, ebilling) | vendor |
| Cedar | Compliance (conflict checks, audit trails) | approval |
| Aspen | Analytics (realization, leakage, performance) | report |

Users switch modules via the module picker in the topbar. Each module defines its own navigation items but shares the same shell, components, and design language.

### Navigation Hierarchy
Four levels of navigation, each with a clear purpose:

| Level | Component | Purpose |
|-------|-----------|---------|
| **L1: Module** | Module picker (topbar) | Switch between product modules |
| **L2: Section** | Sidebar / Horizontal nav / Stacked nav | Navigate between entity types within a module |
| **L3: View** | Tabs within a page | Switch between views of the same data (list filters, detail tabs) |
| **L4: Context** | Side panel tabs / Context rail | Supplementary info for the current entity |

### Navigation Modes
Three interchangeable navigation layouts, switchable per user preference:

**Sidebar (default):** Vertical nav on the left. Best for deep hierarchies. Supports collapsible groups, nested children, count badges, and collapsed icon-only mode with auto-expand on hover.

**Horizontal:** Full-width nav bar below the topbar. Best for shallow hierarchies with fewer items. Supports dropdown children on hover and "More" overflow menu when items exceed viewport width. Flyout sub-menus for nested children.

**Stacked:** Two-column nav — icon rail (primary sections) + secondary panel (children of selected section). Best for dense navigation with many items per section.

### Navigation Overflow
When navigation items exceed available space (horizontal mode):
- Show first N items that fit
- Remaining items go into a "More" dropdown
- "More" button highlights when any overflow item is active
- Nested items render as flyout sub-menus (hover to open, 80ms open delay, 200ms close delay)

---

## Part 3: Page Patterns

### List Pages
Every entity type has a list page following this structure:

```
Page Header (description, primary actions)
  Tab strip (status filters: Active / Draft / All)
    Data grid (toolbar + table + pagination)
```

The data grid provides: search, chip filters, advanced filter modal, sort, column visibility, row grouping, selection, bulk actions, pagination, settings panel, and fullscreen mode.

**Filter initialization:** Grids can start with pre-applied filters (e.g., Status = Active) via the `useGridFilters` hook, with state serialized to URL params for deep linking.

### Detail Pages — Three Paradigms

Detail pages follow one of three layout paradigms. The paradigm is chosen based on the entity's information architecture, not aesthetic preference.

#### Paradigm 1: Tab + Side Column
**When to use:** Entities with multiple data categories AND a persistent summary sidebar (invoices, matters, users, roles).

```
┌─────────────────────────────────────────────────────────┐
│ [←] Breadcrumb > Entity Name                      [< >] │
│ Title  · Status  · Key metadata                Actions  │
├──────────────────────────────┬──────────────────────────┤
│ [Tab1] [Tab2] [Tab3]         │ [Summary] [Comments] [»] │
├──────────────────────────────┤                          │
│                              │  CLIENT                  │
│  Tab content area            │  Morris Pine Chandler    │
│  (scrolls independently)     │                          │
│                              │  MATTER                  │
│                              │  Patent Litigation       │
│                              │                          │
│                              │  PERIOD     CURRENCY     │
│                              │  Apr 1-15   USD          │
└──────────────────────────────┴──────────────────────────┘
```

Structure:
- Header spans full width (breadcrumb + back arrow, title, status, actions)
- Two-column body: left (tabs + content, `flex: 1`) + right (side panel, fixed width, resizable)
- Tabs sit **inside the left column**, not above both columns
- Side panel: resizable via drag handle, collapsible to icon strip, tabs for Summary / Comments / History
- Collapse icon: panel icon (`panelClose`), not a chevron
- Side panel stretches to viewport height (`min-height: calc(100vh - topbar - 200px)`)

#### Paradigm 2: Block Stacked
**When to use:** Entities with distinct content sections that work best as vertically stacked cards (vendor bills with line items, user profiles with activity logs).

```
┌─────────────────────────────────────────────────────────┐
│ [←] Breadcrumb > Entity Name                      [< >] │
│ Title  · Status  · Key metadata                Actions  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Summary Card                                        │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Line Items Card (with internal grid)                │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Attachments Card                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                              Context rail [💬] [📋] [⏱] │
└─────────────────────────────────────────────────────────┘
```

Structure:
- Header spans full width
- Content area: vertically stacked cards, each with its own header + body
- Context rail: fixed icon strip on the right edge (Comments, Audit, People)
- Side panel: overlay drawer triggered from context rail, resizable
- Page scrolls as a whole — no internal scroll containers (except grids)

#### Paradigm 3: CRM Two-Column
**When to use:** Entities with a natural split between browsing content (left) and structured details (right). Best for vendor bills, CRM contacts, and entities where the right panel is always visible.

```
┌─────────────────────────────────────────────────────────┐
│ [←] Breadcrumb > Entity Name                      [< >] │
│ Title  · Status  · Amount                       Actions │
├──────────────────────────────┬──────────────────────────┤
│ [Overview] [Activity] [Lines]│ [Details] [Comments]  [»]│
├──────────────────────────────┤                          │
│                              │  EDIT STYLE              │
│  Tab content area            │  [Per field] [All]       │
│  (page background)           │                          │
│                              │  ▾ Bill Details          │
│                              │    Status: Pending       │
│                              │    Payment: Net 30       │
│                              │                          │
│                              │  (surface background)    │
└──────────────────────────────┴──────────────────────────┘
```

Structure:
- Header: page background (dark in dark mode), no surface card
- Tab strip: surface background (lighter gray), sits in the left column
- Left content: page background, tab content with section headers
- Right panel: surface background, resizable, collapsible, with its own tabs
- The CRM layout emphasizes the right panel as a persistent editing surface

#### Choosing a Paradigm

| Consideration | P1 Tab + Side Column | P2 Block Stacked | P3 CRM Two-Column |
|---------------|---------------------|-------------------|---------------------|
| Content structure | Multiple equal categories | Hierarchical sections | Browse left, edit right |
| Side panel usage | Summary/context reference | Overlay only (context rail) | Always visible, editable |
| Information density | High (tabbed content) | Medium (stacked cards) | High (dual-panel) |
| Entity examples | Invoice, Matter, User, Role | Invoice (full-width), User (simple) | Vendor Bill, CRM Contact |
| Edit pattern | Inline or drawer | Section-level edit buttons | Per-field inline edit |

### Detail Navigation
All detail pages include:
- **Back button**: `[←]` icon (nav-arrows style) before the breadcrumb, navigates to list
- **Prev/Next arrows**: `[< >]` on the right, cycle through records
- **Breadcrumb**: module → entity type → current item

### Detail Access Modes
How a detail page opens from a list is configurable per page:

| Mode | Behavior | When to use |
|------|----------|-------------|
| `page` | Full page navigation, breadcrumb updates | Deep review, editing, multi-tab workflows |
| `drawer` | Full-width bottom-up drawer over the list | Quick preview, scan-and-act workflows |

The drawer slides up from the bottom, covers the content area below the topbar. The list stays in the background. Close via back arrow, × button, scrim click, or Escape.

---

## Part 4: Data Grid System

The data grid is the primary interface for working with records. It's a composable system, not a single component.

### Architecture

```
useGridFilters (hook)     — filter state, URL sync, apply logic
  ├── GridSearchInput     — search field
  ├── ChipFilterBar       — active filter chips + add filter
  └── AdvancedFilterModal — field + operator + value builder

DataGrid (core)           — table rendering, selection, sort, scroll
  ├── toolbar slot        — any content (filters, actions, search)
  ├── footer slot         — pagination or custom footer
  └── bulkBar slot        — floating or inline bulk actions

GridActions               — quick buttons + more dropdown + refresh + fullscreen
GridSettingsPanel         — column visibility + density + behavior
GridSelect                — custom dropdown (replaces native select)
BulkActionBar             — floating or toolbar bulk actions
DataGridPagination        — page navigation + page size
GridFullscreen            — viewport overlay
DetailDrawer              — bottom-up preview drawer
```

### Toolbar Layout
Two zones separated by a flex spacer:

**Filter zone (left):** Search → Chip filters (max 3 visible, "+N more" collapse) → Advanced filter trigger → Clear all

**Action zone (right):** Group-by selector → Record count → Quick actions → More menu → Refresh → Fullscreen → Settings

### Filter Tiers
Three filter modes, composable per grid:

1. **Search**: Full-text search across all fields
2. **Chip filters**: Field-specific filters with inline edit popovers (multiselect, text, range, date range). Values truncated: show first 2 items + "+N" suffix
3. **Advanced filter**: Centered modal with field + operator + value condition rows. Add/remove conditions. Apply/Cancel.

Filter state managed by `useGridFilters` hook:
- Applies search → chip filters → advanced conditions in sequence
- Serializes to URL params (`?dg.status=Active&dg.q=chen`)
- Hydrates from URL on mount (deep linking)
- Formats chip display values consistently

### Grid Settings
Centered modal with two tabs:

**Columns tab:** Search columns, "show only visible" toggle, column list with drag handle + label + key + visibility checkbox + eye icon.

**Settings tab:** Fit window height (toggle), row mode/density (segmented), fixed header (toggle).

### Bulk Actions
When rows are selected, a floating bar appears at bottom center:

```
[✓] 3 selected  |  [Edit] [Export] [Delete]  |  [×]
```

Dark bar (inverts in dark mode), slides up with animation. Configurable per grid: `mode='floating'` (default) or `mode='toolbar'` (inline in toolbar).

---

## Part 5: Token System

### Three-Layer Architecture

```
Layer 1: Brand Scales       → Raw HSL triplets, tenant-overridable
Layer 2: Semantic Aliases   → Composed values, theme-aware (dark mode flips here)
Layer 3: Component Tokens   → Density-aware, component-specific
```

364 total tokens across all three layers and three density levels.

### Brand Layer
Bare HSL triplets for alpha composition downstream:

| Scale | Range | Purpose |
|-------|-------|---------|
| Neutral | 0–950 | Cool slate, backgrounds, text, borders |
| Primary | 50–950 | Teal, brand accent, links, active states |
| Accent | 50–950 | Coral, secondary accent, highlights |
| Success | 50–950 | Green, approved, active, complete |
| Warning | 50–950 | Amber, pending, expiring, attention |
| Error | 50–950 | Red, rejected, error, danger |
| Info | 50–950 | Blue, informational, in review |

### Semantic Layer
Components reference these exclusively. Dark mode overrides happen at this layer only.

| Category | Tokens |
|----------|--------|
| Foreground | `--fg-1` (primary), `--fg-2` (secondary), `--fg-3` (tertiary), `--fg-4` (decorative), `--fg-inverse`, `--fg-accent` |
| Background | `--bg-page`, `--bg-surface`, `--bg-sunken`, `--bg-hover`, `--bg-pressed`, `--bg-selected` |
| Border | `--border-subtle`, `--border`, `--border-strong`, `--border-focus` |
| Status | `--success-*`, `--warn-*`, `--danger-*`, `--info-*` (50, 500, 700 for each) |

### Component Layer
Density-aware values that change across compact / default / comfortable:

| Category | Example Tokens |
|----------|---------------|
| Layout | `--topbar-h`, `--horiznav-h`, `--sidebar-w` |
| Interactive | `--btn-h`, `--input-h`, `--chip-h`, `--row-h` |
| Spacing | `--sp-page-x/y`, `--sp-section`, `--sp-group`, `--sp-inline` |
| Component | `--card-pad`, `--drawer-pad`, `--field-gap`, `--btn-pad-x` |

---

## Part 6: Typography

### Font Stack

| Role | Family | Fallback |
|------|--------|----------|
| Display | Poppins | Inter, system-ui |
| Body | Inter | system-ui, sans-serif |
| Monospace | JetBrains Mono | ui-monospace, Menlo |

### Scale

| Token | Size | Use |
|-------|------|-----|
| `--fs-xs` | 12px | Badge counts, overlines, helper text |
| `--fs-sm` | 13px | Captions, toolbar labels, compact body |
| `--fs-md` / `--fs-base` | 14px | Default body text |
| `--fs-lg` | 16px | Sub-headings, card titles |
| `--fs-xl` | 18px | Section headings |
| `--fs-2xl` | 22px | Page titles |
| `--fs-3xl` | 28px | H1 headings |
| `--fs-4xl` | 36px | Display 2 |
| `--fs-5xl` | 48px | Display 1 |

### Rules
- Minimum body text: 13px (compact), 14px (default/comfortable)
- No text below 12px except decorative badge counts
- `tabular-nums` on all numeric columns and financial data
- Headings use `--lh-tight` (1.2), body uses `--lh-normal` (1.5)
- Overlines: uppercase, `--tracking-caps` (0.08em), semibold

---

## Part 7: Color & Theming

### Contrast Requirements (WCAG AAA)

| Usage | Minimum Ratio | Token |
|-------|--------------|-------|
| Primary text on surface | 12:1 | `--fg-1` |
| Secondary text | 8:1 | `--fg-2` |
| Tertiary / labels | 7:1 | `--fg-3` |
| Decorative only | 4.6:1 | `--fg-4` (not for readable text) |
| Status badge text on tint | 7:1 | `--success-700` on `--success-50`, etc. |
| Link text | 7:1 | `--fg-accent` |

### Dark Mode
Applied via `[data-theme='dark']` on `:root`.

Rules:
1. Override semantic aliases only — brand scales stay unchanged
2. Invert neutral scale (`--n-0` ↔ `--n-900`)
3. Brighten primary accent (300-level for links instead of 600-level)
4. Increase shadow opacity (×1.5 for all elevation shadows)
5. Status colors: swap 50/950 backgrounds, 700/100 text
6. Floating bulk bar: light bar on dark page (scoped CSS custom properties)
7. Set `color-scheme: dark` for native form control styling

### Multi-Tenant Branding
Brand overrides via `[data-brand]` attribute:
- Override primary HSL triplets at brand layer
- Semantic aliases auto-derive from brand scales
- Components never reference brand values directly

---

## Part 8: Spacing & Density

### Base Grid
4px base unit. All spacing tokens are multiples: `--sp-0` (0) through `--sp-16` (64px).

### Density Modes

| Token | Compact | Default | Comfortable |
|-------|---------|---------|-------------|
| `--row-h` | 28px | 36px | 44px |
| `--btn-h` | 28px | 32px | 36px |
| `--input-h` | 28px | 32px | 36px |
| `--sp-page-x` | 16px | 24px | 32px |
| `--sp-section` | 10px | 16px | 24px |
| `--sp-group` | 8px | 12px | 16px |
| `--sp-inline` | 6px | 8px | 10px |
| `--fs-base` | 13px | 14px | 14px |
| `--topbar-h` | 48px | 56px | 64px |
| `--sidebar-w` | 200px | 232px | 260px |

Applied via `[data-density]` on `:root`. All components inherit automatically.

### Spacing Rules
- Never hardcode spacing — use tokens
- Toolbar gap: `--sp-1` horizontal, `--sp-inline` row-gap
- All toolbar elements use `--btn-h-sm` height for alignment
- Card padding: `--card-pad`
- Form field gap: `--field-gap`
- Page padding: `--sp-page-x` horizontal, `--sp-page-y` vertical

---

## Part 9: Interaction & Motion

### Interaction States

| State | Treatment |
|-------|-----------|
| Hover | `--bg-hover` (4% opacity overlay), `--dur-fast` transition |
| Pressed | `--bg-pressed` (7% opacity), `translateY(0.5px)` |
| Selected | `--bg-selected` + 2px left accent bar |
| Focus | 2px solid `--border-focus` outline, 2px offset |
| Disabled | 50% opacity, `cursor: not-allowed` |
| Active nav | `--bg-selected` + accent bar + medium weight |

### Focus Management
- Global rule: all `button`, `a`, `input`, `select`, `textarea`, `[role="button"]`, `[role="tab"]`, `[tabindex]` elements get `outline: 2px solid var(--border-focus)` on `:focus-visible`
- Uses `!important` to survive `all: unset`
- All `<button>` elements must have `type="button"` unless submitting forms

### Motion

| Token | Duration | Use |
|-------|----------|-----|
| `--dur-fast` | 120ms | Hover, micro-interactions |
| `--dur-base` | 180ms | Panel transitions, modals |
| `--dur-slow` | 240ms | Page-level animations |

Easing: `--ease-out` for enters, `--ease-in-out` for sustained transitions.

`@media (prefers-reduced-motion: reduce)` collapses all animation/transition to 0.01ms.

`@media (prefers-contrast: more)` boosts border contrast and focus ring opacity.

---

## Part 10: Component Inventory

### Primitives
| Component | Variants | Purpose |
|-----------|----------|---------|
| Button | primary, accent, secondary, ghost, danger × sm/default/lg | Actions |
| IconButton | sm/default, any variant | Icon-only actions |
| Badge | neutral, success, warn, danger, info, accent, outline + dot | Status indicators |
| Input | default + error + disabled | Text input |
| Textarea | default | Multi-line input |
| Checkbox | default + indeterminate | Selection |
| Toggle | on/off | Boolean setting |
| Avatar | sm/md/lg + color-hashed from name | User identity |
| Segmented | N options | Mode switcher |
| Chip | active/inactive + removable | Filter tags |
| Tabs | N items with icons + counts | View switcher |
| Card | standard + collapsible | Content container |
| KPI | label + value + delta | Metric display |
| Divider | horizontal + vertical | Visual separator |
| DetailDrawer | full-width bottom-up | Quick preview overlay |
| GridSelect | label + placeholder + dynamic direction | Custom dropdown |

### Shell Components
| Component | Purpose |
|-----------|---------|
| AppShell | Grid layout: topbar + sidebar/horizontal/stacked nav + main |
| Sidebar | Vertical nav with groups, nested items, collapsed mode |
| HorizontalNav | Tab-style nav with dropdown children, overflow "More" menu |
| StackedNav | Icon rail + secondary panel |
| ModulePicker | Module switching dropdown |
| Breadcrumbs | Navigation trail |
| PageNav | Back button + breadcrumb + prev/next arrows |
| NotificationsDrawer | Right-slide overlay for notifications |
| SidePanel | Resizable overlay panel for context (comments, audit) |

### Data Grid Components
| Component | Purpose |
|-----------|---------|
| DataGrid | Core table with selection, sort, virtual scroll, grouping |
| GridSearchInput | Search field with icon |
| ChipFilterBar | Active filter chips with inline editors |
| AdvancedFilterModal | Condition builder (field + operator + value) |
| BulkActionBar | Floating or inline bulk actions |
| DataGridPagination | Page nav + page size selector |
| GridActions | Quick actions + more dropdown + refresh + fullscreen |
| GridSettingsPanel | Column visibility + density + behavior settings |
| GridFullscreen | Viewport overlay wrapper |
| useGridFilters | Filter state hook with URL sync |

---

## Part 11: Scrollbar Policy

Custom thin scrollbars are scoped to **shell chrome only**:
- Sidebar, nav panels, side panels, notification drawer, popovers, settings panels

**Data grids, fullscreen mode, and main content use native browser scrollbars.** This ensures:
- Users can always find and use scrollbars in data-heavy contexts
- Platform-native behavior for accessibility tools
- No confusion between decorative and functional scroll areas

---

## Part 12: Z-Index Scale

| Range | Layer | Examples |
|-------|-------|---------|
| 1–10 | Component internals | Sticky thead, group row headers |
| 30–40 | Floating elements | Popovers, dropdown menus, action menus |
| 45–50 | Fixed chrome | Sidebar, context rail, topbar |
| 60 | Floating bulk bar | Bottom-center selection actions |
| 70–75 | Detail drawer | Bottom-up preview overlay |
| 80–85 | Modals + scrim | Settings panel, advanced filter modal |
| 100 | Fullscreen | Grid fullscreen overlay |
| 200 | Select menus | GridSelect dropdown (escapes any parent) |

---

## Part 13: Icon System

Thin-stroke, Phosphor-style. 24×24 viewBox, 1.6px stroke width, round caps and joins.

All icons render as inline SVG with `aria-hidden="true"` and `flex: none`.

| Size | Use |
|------|-----|
| 10px | Inline indicators (carets, sort arrows) |
| 12px | Small UI (badge dots, inline status) |
| 14px | Buttons, nav items, toolbar controls |
| 16px | Default (standalone icons) |
| 20px | Large nav mode, empty states |

80+ icons covering: navigation, actions, content, layout, status, financial.

---

## Part 14: Enterprise Considerations

### Performance
- Virtual scrolling for 10,000+ row datasets (render only visible rows)
- Debounced search input to avoid excessive re-renders
- `useMemo` on filtered/sorted rows to prevent unnecessary computation

### URL State
- Filter state serializes to URL search params for deep linking
- `urlKey` prefix prevents collision when multiple grids share a page
- `replaceState` (not `pushState`) to avoid polluting browser history

### Keyboard Navigation
- All interactive elements are focusable and keyboard-operable
- `Escape` closes modals, drawers, and dropdowns
- Tab order follows visual layout
- Data grid: checkbox toggle, sort header activation

### Multi-Module Scale
- Navigation adapts to module count — overflow items go to "More" menu
- Module picker supports 6+ modules with descriptions
- Sidebar supports 3-level nesting (section → group → item)
- Settings pages support sub-navigation with secondary sidebar

---

## File Structure

```
cc-design/
├── colors_and_type.css          364 tokens: colors, typography, spacing, density, theme
├── components.css               500+ component style rules
├── fonts/                       Inter, JetBrains Mono, Poppins (woff2)
├── docs/
│   ├── design-system.md         This document
│   └── datagrid-toolbar.md      DataGrid toolbar specification
└── ui_kit/
    ├── index.html               Main app entry point
    ├── Icon.jsx                  80+ SVG icons
    ├── Primitives.jsx            Core UI components
    ├── AppShell.jsx              Layout, navigation, module system
    ├── SharedDetailComponents.jsx Shared detail page utilities
    ├── InvoiceDetailP1.jsx       P1 reference implementation
    ├── ParadigmShowcase.jsx      All paradigm variants
    ├── data-grid/               Shared DataGrid system
    │   ├── data-grid.css
    │   ├── DataGrid.jsx
    │   ├── DataGridFilters.jsx
    │   ├── DataGridBulkBar.jsx
    │   ├── DataGridPagination.jsx
    │   ├── DataGridToolbar.jsx
    │   ├── useGridFilters.jsx
    │   └── DataGridDemo.jsx
    └── [domain pages]            Invoice, VendorBill, Matter, Settings grids
```
