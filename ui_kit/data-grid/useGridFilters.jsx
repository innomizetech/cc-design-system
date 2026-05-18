/* global React */

// =========================================================================
// useGridFilters — composable hook for search, chip, and advanced filters.
// Manages filter state, applies filters to rows, and syncs with URL params.
//
// Usage:
//   const gf = useGridFilters({ rows, filterFields, urlKey: 'inv' });
//   <DataGrid rows={gf.filteredRows} toolbar={<>
//     <GridSearchInput {...gf.searchProps} />
//     <ChipFilterBar {...gf.chipProps} />
//   </>} />
// =========================================================================

const formatFilterDisplay = (data) => {
  if (data.values) {
    if (data.values.length <= 2) return data.values.join(', ');
    return `${data.values.slice(0, 2).join(', ')} +${data.values.length - 2}`;
  }
  if (data.text) return data.text;
  if (data.min != null || data.max != null)
    return `${data.min ?? '…'}–${data.max ?? '…'}`;
  if (data.from || data.to) return `${data.from ?? '…'} → ${data.to ?? '…'}`;
  return '…';
};

const serializeFilters = (q, filters, conditions, prefix) => {
  const p = new URLSearchParams(window.location.search);
  const pfx = prefix ? `${prefix}.` : '';

  // Clear old keys with this prefix
  Array.from(p.keys()).forEach((k) => {
    if (k.startsWith(pfx)) p.delete(k);
  });

  if (q) p.set(`${pfx}q`, q);

  filters.forEach((f) => {
    if (f.data.values?.length) p.set(`${pfx}${f.id}`, f.data.values.join(','));
    else if (f.data.text) p.set(`${pfx}${f.id}`, f.data.text);
    else if (f.data.min != null || f.data.max != null) {
      if (f.data.min != null) p.set(`${pfx}${f.id}_min`, String(f.data.min));
      if (f.data.max != null) p.set(`${pfx}${f.id}_max`, String(f.data.max));
    } else if (f.data.from || f.data.to) {
      if (f.data.from) p.set(`${pfx}${f.id}_from`, f.data.from);
      if (f.data.to) p.set(`${pfx}${f.id}_to`, f.data.to);
    }
  });

  conditions.forEach((c, i) => {
    if (!c.field) return;
    p.set(`${pfx}adv${i}`, `${c.field}|${c.operator}|${c.value}`);
  });

  return p;
};

const deserializeFilters = (filterFields, prefix) => {
  const p = new URLSearchParams(window.location.search);
  const pfx = prefix ? `${prefix}.` : '';

  const q = p.get(`${pfx}q`) || '';
  const filters = [];
  const conditions = [];

  filterFields.forEach((field) => {
    const key = `${pfx}${field.id}`;
    const val = p.get(key);
    const min = p.get(`${key}_min`);
    const max = p.get(`${key}_max`);
    const from = p.get(`${key}_from`);
    const to = p.get(`${key}_to`);

    if (val && field.type === 'multiselect') {
      const values = val.split(',');
      const data = { values };
      filters.push({
        id: field.id,
        label: field.label,
        data,
        value: formatFilterDisplay(data),
      });
    } else if (val && field.type === 'text') {
      const data = { text: val };
      filters.push({
        id: field.id,
        label: field.label,
        data,
        value: formatFilterDisplay(data),
      });
    } else if (min != null || max != null) {
      const data = {};
      if (min != null) data.min = min;
      if (max != null) data.max = max;
      filters.push({
        id: field.id,
        label: field.label,
        data,
        value: formatFilterDisplay(data),
      });
    } else if (from || to) {
      const data = {};
      if (from) data.from = from;
      if (to) data.to = to;
      filters.push({
        id: field.id,
        label: field.label,
        data,
        value: formatFilterDisplay(data),
      });
    }
  });

  // Advanced conditions: adv0=field|operator|value
  let i = 0;
  while (p.has(`${pfx}adv${i}`)) {
    const raw = p.get(`${pfx}adv${i}`);
    const [field, operator, ...rest] = raw.split('|');
    conditions.push({
      id: String(i + 1),
      field,
      operator: operator || 'is',
      value: rest.join('|'),
    });
    i++;
  }

  return { q, filters, conditions };
};

const applySearch = (rows, q) => {
  if (!q) return rows;
  const lower = q.toLowerCase();
  return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(lower));
};

const applyChipFilters = (rows, filters) => {
  if (!filters.length) return rows;
  let result = rows;
  filters.forEach((f) => {
    if (f.data.values?.length) {
      result = result.filter((r) => f.data.values.includes(String(r[f.id])));
    }
    if (f.data.text) {
      const t = f.data.text.toLowerCase();
      result = result.filter((r) =>
        String(r[f.id] ?? '')
          .toLowerCase()
          .includes(t),
      );
    }
    if (f.data.min != null) {
      result = result.filter((r) => Number(r[f.id]) >= Number(f.data.min));
    }
    if (f.data.max != null) {
      result = result.filter((r) => Number(r[f.id]) <= Number(f.data.max));
    }
    if (f.data.from) {
      result = result.filter((r) => String(r[f.id]) >= f.data.from);
    }
    if (f.data.to) {
      result = result.filter((r) => String(r[f.id]) <= f.data.to);
    }
  });
  return result;
};

const applyAdvancedConditions = (rows, conditions) => {
  if (!conditions.length) return rows;
  let result = rows;
  conditions.forEach((c) => {
    if (!c.field || c.value === '' || c.value == null) return;
    const val = c.value;
    result = result.filter((r) => {
      const rv = String(r[c.field] ?? '');
      switch (c.operator) {
        case 'is':
          return rv === val;
        case 'is_not':
          return rv !== val;
        case 'contains':
          return rv.toLowerCase().includes(val.toLowerCase());
        case 'gt':
          return Number(rv) > Number(val);
        case 'lt':
          return Number(rv) < Number(val);
        case 'is_empty':
          return !rv;
        default:
          return true;
      }
    });
  });
  return result;
};

const useGridFilters = ({
  rows = [],
  filterFields = [],
  initialFilters,
  initialSearch,
  initialConditions,
  syncUrl = false,
  urlKey = '',
}) => {
  // Hydrate from URL on mount, then fall back to initial props
  const hydrated = React.useRef(null);
  if (hydrated.current === null) {
    if (syncUrl) {
      hydrated.current = deserializeFilters(filterFields, urlKey);
    } else {
      hydrated.current = {
        q: initialSearch || '',
        filters: (initialFilters || []).map((f) => ({
          ...f,
          value: f.data ? formatFilterDisplay(f.data) : f.value || '',
        })),
        conditions: initialConditions || [],
      };
    }
  }

  const [q, setQ] = React.useState(hydrated.current.q);
  const [filters, setFilters] = React.useState(hydrated.current.filters);
  const [conditions, setConditions] = React.useState(
    hydrated.current.conditions,
  );
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  // Sync to URL when state changes
  React.useEffect(() => {
    if (!syncUrl) return;
    const params = serializeFilters(q, filters, conditions, urlKey);
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params}`
      : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [q, filters, conditions, syncUrl, urlKey]);

  // Apply all filters
  const filteredRows = React.useMemo(() => {
    let r = rows;
    r = applySearch(r, q);
    r = applyChipFilters(r, filters);
    r = applyAdvancedConditions(r, conditions);
    return r;
  }, [rows, q, filters, conditions]);

  const clearAll = () => {
    setQ('');
    setFilters([]);
    setConditions([]);
  };

  const hasActiveFilters = q || filters.length > 0 || conditions.length > 0;

  // Prop bundles ready to spread
  const searchProps = {
    value: q,
    onChange: setQ,
  };

  const chipProps = {
    filterFields,
    activeFilters: filters,
    onFiltersChange: setFilters,
  };

  const advancedProps = {
    open: advancedOpen,
    onClose: () => setAdvancedOpen(false),
    onApply: (c) => {
      setConditions(c);
      setAdvancedOpen(false);
    },
    fields: filterFields,
    initialConditions: conditions,
  };

  return {
    // Filtered data
    filteredRows,
    totalRows: rows.length,
    filteredCount: filteredRows.length,

    // Individual state (for custom use)
    search: q,
    setSearch: setQ,
    filters,
    setFilters,
    conditions,
    setConditions,

    // Convenience
    hasActiveFilters,
    clearAll,

    // Advanced modal
    advancedOpen,
    openAdvanced: () => setAdvancedOpen(true),
    closeAdvanced: () => setAdvancedOpen(false),

    // Prop bundles for components
    searchProps,
    chipProps,
    advancedProps,
  };
};

Object.assign(window, { useGridFilters, formatFilterDisplay });
