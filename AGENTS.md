# Agent Instructions for XTND Design System

This file provides instructions for AI agents working on this codebase.

## Before You Start

Read `CLAUDE.md` first — it covers the tech stack, project structure, and critical gotchas (especially the Babel Standalone `const` → `var` issue).

## Common Tasks

### Adding a New Component

1. Create `ui_kit/YourComponent.jsx`
2. Use `/* global React, Icon, Button, ... */` at top for any cross-file dependencies
3. Export at bottom: `Object.assign(window, { YourComponent });`
4. Add `<script type="text/babel" src="YourComponent.jsx"></script>` in `ui_kit/index.html` — **after** dependencies, **before** any file that uses it
5. Style with CSS classes prefixed `x-yourcomponent` in `components.css` or a dedicated CSS file
6. Use semantic tokens (`--fg-1`, `--bg-surface`) not raw values

### Modifying an Existing Component

- Components export to `window` — changing a function signature affects all consumers
- Search for the component name across all `.jsx` files before changing its API
- The `/* global */` comments are documentation only — grep for actual usage

### Adding a New Page/Screen

1. Create `ui_kit/YourPage.jsx`, export to window
2. Add script tag in `index.html`
3. Add navigation entry in `AppShell.jsx` → `NAV_ITEMS`
4. Add breadcrumb mapping in the inline App component in `index.html`
5. Add screen rendering conditional: `{screen === 'your-page' && <YourPage />}`
6. Add screen to the "known screens" array (prevents "Coming soon" fallback)

### Working with the DataGrid

The grid is composable — don't modify `DataGrid.jsx` for page-specific behavior. Instead:

```jsx
<_W.DataGrid
  columns={[...]}
  rows={filteredRows}
  toolbar={
    <>
      <_W.GridSearchInput {...gf.searchProps} />
      <_W.ChipFilterBar {...gf.chipProps} />
      {/* Add your custom toolbar items here */}
    </>
  }
  footer={<_W.DataGridPagination ... />}
/>
```

Use `_W.useGridFilters(...)` for filter state. See `DataGridDemo.jsx` → `DemoCombined` for the full example.

### Cross-File References

Files that need components from other files MUST use the Proxy pattern:

```jsx
const _W = new Proxy({}, { get: (_, k) => window[k] });
// Use: <_W.DataGrid ... />, _W.useGridFilters(...)
```

**Never** shadow a global name with `const`/`let`/`var` at file top level.

### Adding CSS

- Use `x-` prefix for all class names
- Use BEM-like modifiers: `.x-component--variant`
- Use `is-` prefix for state: `.is-active`
- Reference semantic tokens, not brand tokens
- Support density: use `var(--row-h)`, `var(--btn-h)` for sizing
- Add to `components.css` for shared styles, or a component-specific `.css` file for complex components (like `data-grid/data-grid.css`)

## Testing Your Changes

**Do NOT start a dev server yourself.** Ask the user to run it and report results.

Tell the user:
1. Run `python3 -m http.server 8080` (if not already running)
2. Open `http://localhost:8080/ui_kit/`
3. Hard refresh (Cmd+Shift+R) — Babel standalone caches aggressively
4. Check browser console for errors
5. Test across screens: navigate sidebar items, open detail pages
6. Test dark mode: the theme toggle is in the topbar
7. Test density modes: settings gear icon on DataGrid pages

## Quality Checklist

- [ ] No console errors on page load
- [ ] No console errors when navigating to affected screens
- [ ] CSS uses semantic tokens, not hardcoded colors/sizes
- [ ] Component exports to `window` via `Object.assign`
- [ ] Script tag added in correct order in `index.html`
- [ ] Works in both light and dark themes
- [ ] Focus indicators visible on interactive elements
- [ ] No `var` shadowing of existing window globals
