/* global React, Icon, Checkbox, IconButton, GridSettingsPanel, cls */

// =========================================================================
// DataGrid — shared table primitive for the XTND design system.
// Handles: columns, selection, sort, sticky header, virtual scroll,
// header groups, row grouping. Toolbar/footer/bulk bar via slots.
// =========================================================================

const useControlled = (controlled, defaultVal) => {
  const [internal, setInternal] = React.useState(defaultVal);
  const isControlled = controlled !== undefined;
  return [
    isControlled ? controlled : internal,
    isControlled ? undefined : setInternal,
  ];
};

const DG_SortHeader = ({ label, sortKey, sort, onSort, align, width }) => {
  const active = sort && sort.key === sortKey;
  const toggle = () => {
    if (!onSort) return;
    const dir = active && sort.dir === 'asc' ? 'desc' : 'asc';
    onSort({ key: sortKey, dir });
  };
  const iconName = active
    ? sort.dir === 'asc'
      ? 'sortUp'
      : 'sortDown'
    : 'caretDown';
  return (
    <th
      className={cls('is-sortable', active && 'is-sorted')}
      onClick={toggle}
      style={{ width, textAlign: align, cursor: 'pointer' }}
    >
      {label}
      <span className="sort-icon">
        {active ? (sort.dir === 'asc' ? '▲' : '▼') : '▽'}
      </span>
    </th>
  );
};

const DataGrid = ({
  columns = [],
  rows = [],
  rowKey = 'id',
  emptyState,

  selectable = false,
  selected: selectedProp,
  onSelectionChange,
  defaultSelected,

  sort: sortProp,
  onSortChange,
  defaultSort,

  maxHeight,
  stickyHeader = true,
  virtualScroll = false,
  rowHeight = 36,
  overscan = 5,

  headerGroups,
  groupBy,
  groupLabel,
  defaultExpanded = 'all',

  onRowClick,
  rowClassName,

  toolbar,
  footer,
  bulkBar,

  // Settings panel (built-in)
  settingsEnabled = false,
  onColumnsChange,
  density,
  onDensityChange,
  fitWindow,
  onFitWindowChange,
  fixedHeader,
  onFixedHeaderChange,

  className,
}) => {
  const getRowId = typeof rowKey === 'function' ? rowKey : (r) => r[rowKey];
  const visibleCols = columns.filter((c) => c.visible !== false);

  // --- Selection ---
  const [selected, setSelectedInternal] = useControlled(
    selectedProp,
    defaultSelected || new Set(),
  );
  const updateSelection = (next) => {
    if (onSelectionChange) onSelectionChange(next);
    if (setSelectedInternal) setSelectedInternal(next);
  };
  const effectiveSelected =
    selectedProp !== undefined ? selectedProp : selected;

  const toggle = (id) => {
    const n = new Set(effectiveSelected);
    n.has(id) ? n.delete(id) : n.add(id);
    updateSelection(n);
  };
  const clearSelection = () => updateSelection(new Set());

  // --- Sort ---
  const [sort, setSortInternal] = useControlled(sortProp, defaultSort || null);
  const effectiveSort = sortProp !== undefined ? sortProp : sort;
  const handleSort = (s) => {
    if (onSortChange) onSortChange(s);
    if (setSortInternal) setSortInternal(s);
  };

  const sortedRows = React.useMemo(() => {
    if (!effectiveSort) return rows;
    return [...rows].sort((a, b) => {
      let A = a[effectiveSort.key],
        B = b[effectiveSort.key];
      if (A == null) A = '';
      if (B == null) B = '';
      if (A === B) return 0;
      return (A < B ? -1 : 1) * (effectiveSort.dir === 'asc' ? 1 : -1);
    });
  }, [rows, effectiveSort]);

  // --- Row grouping ---
  const [expanded, setExpanded] = React.useState(() =>
    defaultExpanded === 'all' ? null : new Set(defaultExpanded || []),
  );
  const isGroupExpanded = (key) => expanded === null || expanded.has(key);
  const toggleGroup = (key) => {
    if (expanded === null) {
      const allKeys = groups.map((g) => g.key);
      const next = new Set(allKeys.filter((k) => k !== key));
      setExpanded(next);
    } else {
      const next = new Set(expanded);
      next.has(key) ? next.delete(key) : next.add(key);
      setExpanded(next);
    }
  };

  const groups = React.useMemo(() => {
    if (!groupBy) return null;
    const map = new Map();
    sortedRows.forEach((r) => {
      const key = String(r[groupBy] ?? 'Ungrouped');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return Array.from(map, ([key, rows]) => ({
      key,
      label: groupLabel ? groupLabel(key, rows) : key,
      rows,
    }));
  }, [sortedRows, groupBy, groupLabel]);

  // Flat list for rendering (group headers interleaved with rows)
  const flatItems = React.useMemo(() => {
    if (!groups) return sortedRows.map((r) => ({ type: 'row', row: r }));
    const items = [];
    groups.forEach((g) => {
      items.push({ type: 'group', group: g });
      if (isGroupExpanded(g.key)) {
        g.rows.forEach((r) =>
          items.push({ type: 'row', row: r, groupKey: g.key }),
        );
      }
    });
    return items;
  }, [groups, sortedRows, expanded]);

  const dataRows = flatItems.filter((i) => i.type === 'row');
  const allRowIds = dataRows.map((i) => getRowId(i.row));
  const allSelected =
    effectiveSelected.size > 0 && effectiveSelected.size === allRowIds.length;
  const someSelected = effectiveSelected.size > 0 && !allSelected;
  const toggleAll = () => {
    updateSelection(allSelected ? new Set() : new Set(allRowIds));
  };

  const totalCols = visibleCols.length + (selectable ? 1 : 0);

  // --- Virtual scroll ---
  const scrollRef = React.useRef(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const handleScroll = React.useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const viewportHeight = maxHeight
    ? typeof maxHeight === 'number'
      ? maxHeight
      : 560
    : 560;
  const vsStart = virtualScroll
    ? Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    : 0;
  const vsEnd = virtualScroll
    ? Math.min(
        flatItems.length,
        Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan,
      )
    : flatItems.length;
  const vsItems = virtualScroll ? flatItems.slice(vsStart, vsEnd) : flatItems;
  const vsPaddingTop = virtualScroll ? vsStart * rowHeight : 0;
  const vsPaddingBottom = virtualScroll
    ? (flatItems.length - vsEnd) * rowHeight
    : 0;

  // --- Grid state for slot render functions ---
  const gridState = {
    selected: effectiveSelected,
    sort: effectiveSort,
    rows: sortedRows,
    visibleRows: dataRows.map((i) => i.row),
    totalRows: rows.length,
    toggleAll,
    clearSelection,
    allSelected,
    someSelected,
  };

  const renderSlot = (slot) =>
    typeof slot === 'function' ? slot(gridState) : slot;

  // --- Header groups ---
  const renderHeaderGroups = () => {
    if (!headerGroups || headerGroups.length === 0) return null;
    const cells = [];
    if (selectable)
      cells.push(<th key="__chk" className="x-grid__header-group--empty" />);
    let i = 0;
    while (i < visibleCols.length) {
      const col = visibleCols[i];
      if (col.group) {
        const g = headerGroups.find((h) => h.id === col.group);
        let span = 0;
        while (
          i + span < visibleCols.length &&
          visibleCols[i + span].group === col.group
        )
          span++;
        cells.push(
          <th key={col.group} colSpan={span} style={{ textAlign: g?.align }}>
            {g?.label || col.group}
          </th>,
        );
        i += span;
      } else {
        cells.push(
          <th key={`__empty_${i}`} className="x-grid__header-group--empty" />,
        );
        i++;
      }
    }
    return <tr className="x-grid__header-group">{cells}</tr>;
  };

  const hasGroups = headerGroups && headerGroups.length > 0;

  // --- Built-in settings panel ---
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <div
      className={cls(
        'x-grid-wrap',
        hasGroups && 'x-grid--has-groups',
        className,
      )}
    >
      {/* Toolbar slot */}
      {(toolbar || settingsEnabled) && (
        <div className="x-grid-toolbar">
          {renderSlot(toolbar)}
          {settingsEnabled && (
            <IconButton
              icon="settings"
              onClick={() => setSettingsOpen((v) => !v)}
              title="Grid settings"
              aria-expanded={settingsOpen}
            />
          )}
        </div>
      )}

      {/* Settings panel (centered modal) */}
      {settingsEnabled && (
        <GridSettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          columns={columns}
          onColumnsChange={onColumnsChange}
          density={density}
          onDensityChange={onDensityChange}
          fitWindow={fitWindow}
          onFitWindowChange={onFitWindowChange}
          fixedHeader={fixedHeader}
          onFixedHeaderChange={onFixedHeaderChange}
        />
      )}

      {/* Table */}
      <div
        ref={scrollRef}
        className={cls('x-grid__scroll', virtualScroll && 'x-grid-vscroll')}
        style={maxHeight ? { overflow: 'auto', maxHeight } : undefined}
        onScroll={virtualScroll ? handleScroll : undefined}
      >
        <table className="x-grid">
          <thead>
            {renderHeaderGroups()}
            <tr>
              {selectable && (
                <th className="x-cell--checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {visibleCols.map((c) =>
                c.sortable ? (
                  <DG_SortHeader
                    key={c.key}
                    label={c.label}
                    sortKey={c.key}
                    sort={effectiveSort}
                    onSort={handleSort}
                    align={c.align}
                    width={c.width}
                  />
                ) : (
                  <th
                    key={c.key}
                    style={{ width: c.width, textAlign: c.align }}
                  >
                    {c.headerRender
                      ? c.headerRender(c, effectiveSort)
                      : c.label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {/* Virtual scroll top spacer */}
            {vsPaddingTop > 0 && (
              <tr className="x-grid__vspacer">
                <td colSpan={totalCols} style={{ height: vsPaddingTop }} />
              </tr>
            )}

            {vsItems.length === 0 && !virtualScroll && (
              <tr>
                <td colSpan={totalCols}>
                  <div className="x-grid__empty">
                    {emptyState || (
                      <>
                        <div className="x-grid__empty-icon">
                          <Icon name="search" size={20} />
                        </div>
                        No results found
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {vsItems.map((item, idx) => {
              if (item.type === 'group') {
                const g = item.group;
                const isExp = isGroupExpanded(g.key);
                return (
                  <tr
                    key={`g_${g.key}`}
                    className="x-grid__group-row"
                    onClick={() => toggleGroup(g.key)}
                  >
                    <td colSpan={totalCols}>
                      <span
                        className={cls(
                          'x-grid__group-chevron',
                          isExp && 'is-expanded',
                        )}
                      >
                        <Icon name="chevronRight" size={12} />
                      </span>
                      {g.label}
                      <span className="x-grid__group-count">
                        ({g.rows.length})
                      </span>
                    </td>
                  </tr>
                );
              }

              const r = item.row;
              const id = getRowId(r);
              const isSelected = effectiveSelected.has(id);
              return (
                <tr
                  key={id}
                  className={cls(
                    isSelected && 'is-selected',
                    rowClassName && rowClassName(r),
                  )}
                  onClick={onRowClick ? (e) => onRowClick(r, e) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {selectable && (
                    <td
                      className="x-cell--checkbox"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggle(id)}
                      />
                    </td>
                  )}
                  {visibleCols.map((c) => (
                    <td
                      key={c.key}
                      className={c.className}
                      style={{ textAlign: c.align, width: c.width }}
                    >
                      {c.render ? c.render(r[c.key], r, idx) : r[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Virtual scroll bottom spacer */}
            {vsPaddingBottom > 0 && (
              <tr className="x-grid__vspacer">
                <td colSpan={totalCols} style={{ height: vsPaddingBottom }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer slot */}
      {footer && <div>{renderSlot(footer)}</div>}

      {/* Bulk bar slot */}
      {bulkBar && effectiveSelected.size > 0 && renderSlot(bulkBar)}
    </div>
  );
};

Object.assign(window, { DataGrid });
