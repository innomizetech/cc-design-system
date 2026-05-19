# XTND Design System

Enterprise design system for legal billing, matter management, and financial operations. Built for professionals who spend 6-8 hours daily in the product — optimized for speed of comprehension, keyboard efficiency, and information density.

**Live demo:** https://cc-design-system.netlify.app/ui_kit/

## Quick Start

```bash
git clone git@github.com:innomizetech/cc-design-system.git
cd cc-design-system
python3 -m http.server 8080
# Open http://localhost:8080/ui_kit/
```

No npm install. No build step. No dependencies.

## What's Inside

### Design Tokens (364 CSS variables)
Three-layer system: Brand → Semantic → Component. Supports dark mode, 3 density modes (compact/default/comfortable), and multi-tenant branding — all via token overrides, zero component changes.

### Component Library
- **Primitives** — Button, Badge, Input, Checkbox, Avatar, Chip, Tabs, Card, Segmented, KPI
- **Shell** — AppShell (sidebar/horizontal/stacked nav), TopBar, ModulePicker, Breadcrumbs
- **DataGrid** — Composable table system with sort, selection, search, chip filters, advanced filters, virtual scroll, row grouping, pagination, bulk actions, settings panel, fullscreen
- **Pages** — Dashboard, Invoice/Bill/Matter grids and details, Settings, User profile

### Detail Page Paradigms
Three layout patterns for detail pages:
1. **Tabs + Side Column** — multiple equal data categories + persistent summary
2. **Block Stacked** — hierarchical sections with line items
3. **CRM Two-Column** — browse left, edit right

### Icon System
80+ SVG icons in Phosphor style (thin stroke, 1.5px weight).

## Tech Stack

| What | How |
|------|-----|
| Components | React 18.3 (UMD from CDN) |
| JSX | Babel Standalone 7.29 (in-browser transpilation) |
| Styling | CSS custom properties, BEM-like naming (`x-` prefix) |
| Fonts | Inter (UI), JetBrains Mono (data), Source Serif 4 (reserved) |
| Build | None — static files served directly |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, workflow, and conventions.

Every PR gets an automatic Netlify deploy preview — reviewers can check changes live without running anything locally.

## For AI/LLM Contributors

See [CLAUDE.md](CLAUDE.md) for codebase guide and [AGENTS.md](AGENTS.md) for task-specific instructions.

## Documentation

- `docs/design-system.md` — Full design specification (14 parts)
- `docs/datagrid-toolbar.md` — DataGrid toolbar layout spec
