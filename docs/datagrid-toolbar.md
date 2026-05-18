# DataGrid Toolbar — Design Spec

## Problem

When a grid has many active filters, quick actions, settings, and metadata, the toolbar becomes overcrowded. Filters wrap unpredictably, actions get pushed to a second row, and the hierarchy between "filtering data" and "acting on data" is lost.

## Layout Structure

The toolbar is divided into two distinct zones with clear spatial separation.

### Filter Zone (left)

Contains everything related to narrowing the dataset.

```
[🔍 Search] [chip] [chip] [chip] [+N more] [+ Add filter] [Advanced (N)] [Clear all]
```

Components in order:
1. **Search input** — always visible, fixed width
2. **Active filter chips** — show up to 3, then collapse
3. **"+ Add filter" button** — opens field picker popover
4. **Advanced filter trigger** — badge shows condition count, opens centered modal
5. **Clear all** — resets search + chips + advanced conditions

### Action Zone (right)

Contains everything related to acting on or configuring the grid.

```
[Group by ▾] [N items] [+ Add] [···] [↻] [⛶] [⚙]
```

Components in order:
1. **Group by selector** — optional, dropdown
2. **Record count** — "{N} items" label
3. **Quick actions** — 1-3 primary buttons (e.g. "Add employee")
4. **More actions** — overflow dropdown menu
5. **Refresh** — icon button with spinner state
6. **Fullscreen** — expand icon
7. **Settings** — gear icon, opens centered modal

### Separator

A flex spacer (`flex: 1`) separates the filter zone from the action zone. This pushes actions to the right edge regardless of how many filters are active.

## Chip Overflow

When more than 3 filter chips are active:

- Show the first 3 chips
- Collapse the rest into a **"+N more"** button
- Clicking "+N more" expands to show all chips
- Clicking again collapses back to 3

This prevents the filter zone from pushing actions off-screen or wrapping to multiple rows.

```
Few filters:    [Status: Active ×] [Dept: Eng ×] [+ Add filter]
Many filters:   [Status ×] [Dept ×] [Team ×] +2 more [+ Add filter]
Expanded:       [Status ×] [Dept ×] [Team ×] [Level ×] [Type ×] [Show less] [+ Add filter]
```

## Toolbar Modes

### `auto` (default)

Single row. Filter zone and action zone share one line. If content would overflow, chips collapse first ("+N more"), then the toolbar wraps to two rows as a fallback.

### `split`

Always two rows:
- **Row 1**: Filter zone (full width)
- **Row 2**: Action zone (full width)

Use `split` when the grid is known to have many filters or when the action zone is complex.

## Advanced Filter Modal

Opens as a **centered viewport modal** with scrim backdrop (same pattern as Grid Settings). Not a popover anchored to a button.

Content:
- Title: "Custom filtering"
- Condition rows: [Field ▾] [Operator ▾] [Value input] [×]
- "+ Add condition" button
- Footer: [Cancel] [Apply filter]

## Grid Settings Modal

Opens as a **centered viewport modal** with scrim backdrop.

Two tabs:
- **Columns**: search + "show only visible" toggle + column list (drag handle, name, key, visibility checkbox, eye icon)
- **Settings**: fit window height (toggle), row mode/density (segmented), fixed header (toggle)

## Component Heights

All toolbar elements use `--btn-h-sm` for consistent vertical alignment:

| Element | Height token |
|---------|-------------|
| Search input | `--btn-h-sm` |
| Filter chips | `--btn-h-sm` |
| Add filter button | `--btn-h-sm` |
| Ghost buttons | `--btn-h-sm` (via `size="sm"`) |
| Quick action buttons | `--btn-h-sm` (via `size="sm"`) |
| Group-by select | `--btn-h-sm` |
| Icon buttons | `--btn-h-sm` (via `size="sm"`) |

## Spacing

- Toolbar padding: `--toolbar-pad-y` / `--toolbar-pad-x`
- Gap between items: `--sp-1` (4px)
- Row gap when wrapping: `--sp-1`

## Z-index Layers

| Element | z-index |
|---------|---------|
| Grid wrap | `position: relative` (base) |
| Filter popovers | 50 |
| "Add filter" dropdown | 50 |
| Actions dropdown menu | 35 |
| Settings modal scrim | 80 |
| Settings modal | 85 |
| Advanced filter modal scrim | 80 |
| Advanced filter modal | 85 |
| Fullscreen overlay | 100 |
| Floating bulk bar | 60 |

## Bulk Actions

When rows are selected, a **floating bar** appears at the bottom center of the viewport. The toolbar does NOT change — filters and actions remain accessible during bulk selection.

The floating bar contains:
- Checkbox (toggle all)
- "{N} selected" count
- Action buttons (Edit, Export, Delete, etc.)
- Close button (deselect all)

## Responsive Behavior

At narrow widths:
1. Chips collapse earlier (show 2 instead of 3)
2. Quick action labels hide, showing icon-only
3. Group-by and count move into the "more" dropdown
4. Extreme narrow: filter zone stacks above action zone

## API

```jsx
<DataGrid
  toolbar={<>
    <GridSearchInput {...gf.searchProps} />
    <ChipFilterBar {...gf.chipProps} maxVisible={3} />
    <AdvancedFilterTrigger {...gf} />
    <div className="x-grid-toolbar__spacer" />
    <GridActions
      quickActions={[...]}
      moreActions={[...]}
      onRefresh={...}
      onFullscreen={...}
    />
  </>}
  settingsEnabled
  onColumnsChange={...}
  ...
/>
```

## References

- Linear: single bar, filter button opens builder, actions right-aligned
- Notion: two rows (title + actions / filter + sort + group)
- Airtable: two rows, filter chips wrap with "+N" collapse
- Jira: single bar, bulk actions in floating bar
- AG Grid: sidebar panel for filters + column management
- PatternFly / Helios: chip overflow with accordion collapse
