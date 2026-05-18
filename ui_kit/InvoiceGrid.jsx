/* global React, Icon, Button, IconButton, Checkbox, Badge, InvoiceStatus, Avatar, Chip, Segmented, fmtMoney, fmtDate */

// ======================================================================
// InvoiceGrid — sortable, selectable, filterable data grid
// ======================================================================

const SAMPLE_INVOICES = [
  {
    id: 'INV-2026-00418',
    vendor: 'Morgan, Patel & Clark LLP',
    matter: 'Contract breach resolution under intellectual rights conflict',
    matterCode: '00012',
    client: 'Everest National Insurance Group',
    clientCode: '1096',
    amount: 142880.0,
    submitted: '2026-04-18',
    due: '2026-05-18',
    status: 'in_review',
    assignee: 'Eleanor Wu',
    priority: 'high',
    lines: 47,
    editLock: { by: 'K. Alvarez', acquiredAt: '2026-04-21T14:02:00' },
  },
  {
    id: 'INV-2026-00417',
    vendor: 'Dentons U.S. LLP',
    matter: 'Employment Matter — Class Action',
    amount: 68420.5,
    submitted: '2026-04-18',
    due: '2026-05-17',
    status: 'submitted',
    assignee: '—',
    priority: 'med',
    lines: 23,
  },
  {
    id: 'INV-2026-00416',
    vendor: 'Kroll Associates',
    matter: 'Forensic Accounting — Jensen',
    amount: 12750.0,
    submitted: '2026-04-17',
    due: '2026-05-17',
    status: 'approved',
    assignee: 'Marcus Orr',
    priority: 'low',
    lines: 8,
  },
  {
    id: 'INV-2026-00415',
    vendor: 'Baker & Hostetler',
    matter: 'Data Breach Response',
    amount: 210000.0,
    submitted: '2026-04-16',
    due: '2026-05-16',
    status: 'disputed',
    assignee: 'Eleanor Wu',
    priority: 'high',
    lines: 64,
  },
  {
    id: 'INV-2026-00414',
    vendor: 'Skadden, Arps',
    matter: 'M&A — Project Phoenix',
    amount: 485300.0,
    submitted: '2026-04-16',
    due: '2026-05-16',
    status: 'in_review',
    assignee: 'Priya Shah',
    priority: 'high',
    lines: 112,
  },
  {
    id: 'INV-2026-00413',
    vendor: 'Paul Hastings LLP',
    matter: 'Regulatory — FTC Inquiry',
    amount: 34210.75,
    submitted: '2026-04-15',
    due: '2026-05-15',
    status: 'paid',
    assignee: 'Marcus Orr',
    priority: 'med',
    lines: 19,
  },
  {
    id: 'INV-2026-00412',
    vendor: 'Latham & Watkins',
    matter: 'SEC Filing Support',
    amount: 92640.0,
    submitted: '2026-04-15',
    due: '2026-05-15',
    status: 'on_hold',
    assignee: 'Eleanor Wu',
    priority: 'med',
    lines: 31,
  },
  {
    id: 'INV-2026-00411',
    vendor: 'Cooley LLP',
    matter: 'Patent Prosecution — Atlas',
    amount: 18975.0,
    submitted: '2026-04-14',
    due: '2026-05-14',
    status: 'approved',
    assignee: 'Priya Shah',
    priority: 'low',
    lines: 14,
  },
  {
    id: 'INV-2026-00410',
    vendor: 'Gibson, Dunn & Crutcher',
    matter: 'Antitrust — Helios Acquisition',
    amount: 318450.25,
    submitted: '2026-04-14',
    due: '2026-05-14',
    status: 'in_review',
    assignee: 'Eleanor Wu',
    priority: 'high',
    lines: 88,
  },
  {
    id: 'INV-2026-00409',
    vendor: 'Quinn Emanuel',
    matter: 'Litigation — Northfield v. Acme',
    amount: 156780.0,
    submitted: '2026-04-13',
    due: '2026-05-13',
    status: 'submitted',
    assignee: '—',
    priority: 'med',
    lines: 52,
  },
  {
    id: 'INV-2026-00408',
    vendor: 'Morgan, Patel & Clark LLP',
    matter: 'IP Portfolio Review',
    amount: 27300.0,
    submitted: '2026-04-12',
    due: '2026-05-12',
    status: 'approved',
    assignee: 'Marcus Orr',
    priority: 'low',
    lines: 11,
  },
  {
    id: 'INV-2026-00407',
    vendor: 'WilmerHale',
    matter: 'Export Controls Advisory',
    amount: 41250.0,
    submitted: '2026-04-12',
    due: '2026-05-12',
    status: 'rejected',
    assignee: 'Priya Shah',
    priority: 'med',
    lines: 17,
  },
  {
    id: 'INV-2026-00406',
    vendor: 'Jones Day',
    matter: 'General Corporate — Q2',
    amount: 88420.0,
    submitted: '2026-04-11',
    due: '2026-05-11',
    status: 'paid',
    assignee: 'Marcus Orr',
    priority: 'low',
    lines: 29,
  },
  {
    id: 'INV-2026-00405',
    vendor: 'Sidley Austin',
    matter: 'Tax Controversy — State',
    amount: 54100.0,
    submitted: '2026-04-10',
    due: '2026-05-10',
    status: 'in_review',
    assignee: 'Eleanor Wu',
    priority: 'med',
    lines: 22,
  },
];

const PriorityFlag = ({ priority }) => {
  const color =
    priority === 'high'
      ? 'var(--danger-500)'
      : priority === 'med'
        ? 'var(--warn-500)'
        : 'var(--fg-4)';
  return <Icon name="flag" size={12} style={{ color }} />;
};

const SortHeader = ({ label, sortKey, sort, setSort, align, width }) => {
  const active = sort.key === sortKey;
  const dir = active ? sort.dir : null;
  return (
    <th
      className={cls('is-sortable', active && 'is-sorted')}
      style={{ textAlign: align || 'left', width }}
      onClick={() =>
        setSort({ key: sortKey, dir: active && dir === 'asc' ? 'desc' : 'asc' })
      }
    >
      {label}
      <span className="sort-icon">
        {active ? (
          <Icon name={dir === 'asc' ? 'sortUp' : 'sortDown'} size={10} />
        ) : (
          <Icon name="caretDown" size={10} />
        )}
      </span>
    </th>
  );
};

// Fields available to filter on — used by the Filter picker popover.
const INVOICE_FILTER_FIELDS = [
  { id: 'status', label: 'Status', icon: 'workflow' },
  { id: 'assignee', label: 'Assignee', icon: 'user' },
  { id: 'vendor', label: 'Vendor', icon: 'briefcase' },
  { id: 'matter', label: 'Matter', icon: 'matter' },
  { id: 'amount', label: 'Amount', icon: 'dollar' },
  { id: 'submitted', label: 'Submitted', icon: 'calendar' },
  { id: 'priority', label: 'Priority', icon: 'flag' },
];

// Columns that can be toggled (checkbox/priority/actions are always on).
const INVOICE_COLUMNS = [
  { key: 'id', label: 'Invoice #' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'matter', label: 'Matter' },
  { key: 'status', label: 'Status' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'amount', label: 'Amount' },
];

// Close-on-outside hook used by popovers.
const useClickOutside = (ref, onOutside, when) => {
  React.useEffect(() => {
    if (!when) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') onOutside();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [when, onOutside, ref]);
};

// Option sets used by the filter value editors.
const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'paid', label: 'Paid' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'on_hold', label: 'On hold' },
];
const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'med', label: 'Medium' },
  { value: 'low', label: 'Low' },
];
const ASSIGNEE_OPTIONS = [
  { value: 'Eleanor Wu', label: 'Eleanor Wu' },
  { value: 'Priya Shah', label: 'Priya Shah' },
  { value: 'Marcus Orr', label: 'Marcus Orr' },
  { value: '—', label: 'Unassigned' },
];

// Format a filter's internal data as a short chip value.
const formatFilterValue = (filter) => {
  const d = filter.data || {};
  switch (filter.id) {
    case 'status':
    case 'priority':
    case 'assignee': {
      const opts =
        filter.id === 'status'
          ? STATUS_OPTIONS
          : filter.id === 'priority'
            ? PRIORITY_OPTIONS
            : ASSIGNEE_OPTIONS;
      const labels = (d.values || []).map(
        (v) => opts.find((o) => o.value === v)?.label || v,
      );
      if (labels.length === 0) return 'Any';
      if (labels.length <= 2) return labels.join(', ');
      return `${labels.slice(0, 2).join(', ')} +${labels.length - 2}`;
    }
    case 'vendor':
    case 'matter':
      return d.text ? `contains "${d.text}"` : 'Contains…';
    case 'amount': {
      const min =
        d.min != null && d.min !== ''
          ? `$${Number(d.min).toLocaleString()}`
          : null;
      const max =
        d.max != null && d.max !== ''
          ? `$${Number(d.max).toLocaleString()}`
          : null;
      if (!min && !max) return 'Any range';
      if (min && max) return `${min} – ${max}`;
      return min ? `≥ ${min}` : `≤ ${max}`;
    }
    case 'submitted': {
      if (!d.from && !d.to) return 'Any date';
      if (d.from && d.to) return `${d.from} – ${d.to}`;
      return d.from ? `from ${d.from}` : `until ${d.to}`;
    }
    default:
      return filter.value || '—';
  }
};

// Popover editor for a single filter chip. Body varies by filter.id.
const FilterValueEditor = ({ filter, onApply, onClose }) => {
  const [data, setData] = React.useState(filter.data || {});
  const ref = React.useRef(null);
  useClickOutside(ref, onClose, true);

  const apply = () =>
    onApply({ ...filter, data, value: formatFilterValue({ ...filter, data }) });

  const MultiSelect = ({ options }) => {
    const values = new Set(data.values || []);
    const toggle = (v) => {
      const n = new Set(values);
      n.has(v) ? n.delete(v) : n.add(v);
      setData({ ...data, values: [...n] });
    };
    return (
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        {options.map((o) => (
          <label
            key={o.value}
            className="x-popover__row"
            style={{ cursor: 'pointer' }}
          >
            <Checkbox
              checked={values.has(o.value)}
              onChange={() => toggle(o.value)}
            />
            <span style={{ flex: 1 }}>{o.label}</span>
          </label>
        ))}
      </div>
    );
  };

  const body = (() => {
    switch (filter.id) {
      case 'status':
        return <MultiSelect options={STATUS_OPTIONS} />;
      case 'priority':
        return <MultiSelect options={PRIORITY_OPTIONS} />;
      case 'assignee':
        return <MultiSelect options={ASSIGNEE_OPTIONS} />;
      case 'vendor':
      case 'matter':
        return (
          <div style={{ padding: '6px 10px' }}>
            <input
              className="x-input"
              placeholder={`${filter.label} contains…`}
              value={data.text || ''}
              onChange={(e) => setData({ ...data, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') apply();
              }}
              autoFocus
            />
          </div>
        );
      case 'amount':
        return (
          <div
            style={{
              padding: '6px 10px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            <Field label="Min">
              <input
                className="x-input"
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={data.min ?? ''}
                onChange={(e) => setData({ ...data, min: e.target.value })}
              />
            </Field>
            <Field label="Max">
              <input
                className="x-input"
                type="number"
                inputMode="decimal"
                placeholder="∞"
                value={data.max ?? ''}
                onChange={(e) => setData({ ...data, max: e.target.value })}
              />
            </Field>
          </div>
        );
      case 'submitted':
        return (
          <div
            style={{
              padding: '6px 10px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            <Field label="From">
              <input
                className="x-input"
                type="date"
                value={data.from || ''}
                onChange={(e) => setData({ ...data, from: e.target.value })}
              />
            </Field>
            <Field label="To">
              <input
                className="x-input"
                type="date"
                value={data.to || ''}
                onChange={(e) => setData({ ...data, to: e.target.value })}
              />
            </Field>
          </div>
        );
      default:
        return (
          <div style={{ padding: 12, color: 'var(--fg-3)' }}>
            No editor for this field.
          </div>
        );
    }
  })();

  return (
    <div
      ref={ref}
      className="x-popover"
      style={{ minWidth: 280 }}
      role="dialog"
      aria-label={`Edit ${filter.label} filter`}
    >
      <div className="x-popover__header">{filter.label}</div>
      {body}
      <div className="x-popover__footer">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setData({});
          }}
        >
          Clear
        </Button>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" size="sm" onClick={apply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

const InvoiceGrid = ({ onOpen }) => {
  const [selected, setSelected] = React.useState(new Set());
  const [sort, setSort] = React.useState({ key: 'submitted', dir: 'desc' });
  const [activeFilters, setActiveFilters] = React.useState([
    {
      id: 'status',
      label: 'Status',
      data: { values: ['in_review', 'submitted'] },
      value: 'In review, Submitted',
    },
    {
      id: 'assignee',
      label: 'Assignee',
      data: { values: ['Eleanor Wu'] },
      value: 'Eleanor Wu',
    },
  ]);
  const [view, setView] = React.useState('list');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [editingFilterId, setEditingFilterId] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [hiddenCols, setHiddenCols] = React.useState(new Set());
  const [density, setDensity] = React.useState(
    () => document.documentElement.getAttribute('data-density') || 'default',
  );
  const filterRef = React.useRef(null);
  const settingsRef = React.useRef(null);
  useClickOutside(filterRef, () => setFilterOpen(false), filterOpen);
  useClickOutside(settingsRef, () => setSettingsOpen(false), settingsOpen);

  const addFilter = (field) => {
    if (activeFilters.find((f) => f.id === field.id)) {
      setFilterOpen(false);
      return;
    }
    const seed = {
      id: field.id,
      label: field.label,
      data: {},
      value: formatFilterValue({ id: field.id, data: {} }),
    };
    setActiveFilters((x) => [...x, seed]);
    setFilterOpen(false);
    // Immediately open the editor so the user can set a real value.
    setEditingFilterId(field.id);
  };

  const updateFilter = (next) => {
    setActiveFilters((x) => x.map((f) => (f.id === next.id ? next : f)));
    setEditingFilterId(null);
  };

  const toggleCol = (key) => {
    setHiddenCols((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };
  const isVisible = (key) => !hiddenCols.has(key);

  const applyDensity = (v) => {
    setDensity(v);
    document.documentElement.setAttribute('data-density', v);
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 650);
  };

  const rows = React.useMemo(() => {
    const sorted = [...SAMPLE_INVOICES].sort((a, b) => {
      const A = a[sort.key],
        B = b[sort.key];
      if (A === B) return 0;
      return (A < B ? -1 : 1) * (sort.dir === 'asc' ? 1 : -1);
    });
    return sorted;
  }, [sort]);

  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };
  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };
  const allSelected = selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="x-grid-wrap">
      {/* Toolbar */}
      <div className="x-grid-toolbar">
        <div ref={filterRef} style={{ position: 'relative' }}>
          <Button
            variant="secondary"
            size="sm"
            icon="filter"
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
          >
            Filter
          </Button>
          {filterOpen && (
            <div className="x-popover" role="menu">
              <div className="x-popover__header">Filter by</div>
              {INVOICE_FILTER_FIELDS.map((f) => {
                const already = activeFilters.some((a) => a.id === f.id);
                return (
                  <div
                    key={f.id}
                    className="x-popover__row"
                    role="menuitem"
                    onClick={() => addFilter(f)}
                    style={
                      already
                        ? { opacity: 0.5, pointerEvents: 'none' }
                        : undefined
                    }
                  >
                    <Icon
                      name={f.icon}
                      size={14}
                      className="x-popover__row-icon"
                    />
                    <span style={{ flex: 1 }}>{f.label}</span>
                    {already && (
                      <Icon
                        name="check"
                        size={12}
                        style={{ color: 'var(--a-500)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {activeFilters.map((f) => (
          <div key={f.id} style={{ position: 'relative' }}>
            <Chip
              label={f.label}
              value={f.value}
              active
              onClick={() => setEditingFilterId(f.id)}
              onRemove={() => {
                setActiveFilters((x) => x.filter((k) => k.id !== f.id));
                if (editingFilterId === f.id) setEditingFilterId(null);
              }}
            />
            {editingFilterId === f.id && (
              <FilterValueEditor
                filter={f}
                onApply={updateFilter}
                onClose={() => setEditingFilterId(null)}
              />
            )}
          </div>
        ))}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilters([])}
          >
            Clear all
          </Button>
        )}

        <div className="x-grid-toolbar__spacer" />

        <span className="x-grid-toolbar__count">
          {selected.size > 0 ? (
            <>
              {selected.size} selected ·{' '}
              <a className="x-link" onClick={() => setSelected(new Set())}>
                Clear
              </a>
            </>
          ) : (
            <>
              {rows.length} invoices · {fmtMoney(total)}
            </>
          )}
        </span>

        {selected.size === 0 && (
          <>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'list', icon: 'list', label: 'List' },
                { value: 'grid', icon: 'grid', label: 'Board' },
              ]}
            />
            <IconButton
              icon="refresh"
              onClick={refresh}
              title="Refresh"
              className={refreshing ? 'x-spin' : undefined}
            />
            <div ref={settingsRef} style={{ position: 'relative' }}>
              <IconButton
                icon="settings"
                onClick={() => setSettingsOpen((v) => !v)}
                title="Grid settings"
                aria-expanded={settingsOpen}
              />
              {settingsOpen && (
                <div
                  className="x-popover"
                  style={{ right: 0, minWidth: 260 }}
                  role="menu"
                >
                  <div className="x-popover__header">Density</div>
                  <div style={{ padding: '0 8px 8px' }}>
                    <Segmented
                      value={density}
                      onChange={applyDensity}
                      options={[
                        { value: 'compact', label: 'Compact' },
                        { value: 'default', label: 'Default' },
                        { value: 'comfortable', label: 'Airy' },
                      ]}
                    />
                  </div>
                  <div className="x-popover__divider" />
                  <div className="x-popover__header">Columns</div>
                  {INVOICE_COLUMNS.map((c) => (
                    <label
                      key={c.key}
                      className="x-popover__row"
                      style={{ cursor: 'pointer' }}
                    >
                      <Checkbox
                        checked={isVisible(c.key)}
                        onChange={() => toggleCol(c.key)}
                      />
                      <span style={{ flex: 1 }}>{c.label}</span>
                    </label>
                  ))}
                  <div className="x-popover__footer">
                    <span
                      style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}
                    >
                      {INVOICE_COLUMNS.length - hiddenCols.size} of{' '}
                      {INVOICE_COLUMNS.length} visible
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHiddenCols(new Set())}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button variant="secondary" size="sm" icon="download">
              Export
            </Button>
            <Button variant="accent" size="sm" icon="plus">
              Upload invoice
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <div style={{ overflow: 'auto', maxHeight: 560 }}>
        <table className="x-grid">
          <thead>
            <tr>
              <th className="x-cell--checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: 24 }}></th>
              {isVisible('id') && (
                <SortHeader
                  label="Invoice"
                  sortKey="id"
                  sort={sort}
                  setSort={setSort}
                  width={160}
                />
              )}
              {isVisible('vendor') && (
                <SortHeader
                  label="Vendor"
                  sortKey="vendor"
                  sort={sort}
                  setSort={setSort}
                />
              )}
              {isVisible('matter') && (
                <SortHeader
                  label="Matter"
                  sortKey="matter"
                  sort={sort}
                  setSort={setSort}
                />
              )}
              {isVisible('status') && (
                <SortHeader
                  label="Status"
                  sortKey="status"
                  sort={sort}
                  setSort={setSort}
                  width={120}
                />
              )}
              {isVisible('assignee') && (
                <SortHeader
                  label="Assignee"
                  sortKey="assignee"
                  sort={sort}
                  setSort={setSort}
                  width={150}
                />
              )}
              {isVisible('submitted') && (
                <SortHeader
                  label="Submitted"
                  sortKey="submitted"
                  sort={sort}
                  setSort={setSort}
                  width={110}
                />
              )}
              {isVisible('amount') && (
                <SortHeader
                  label="Amount"
                  sortKey="amount"
                  sort={sort}
                  setSort={setSort}
                  align="right"
                  width={130}
                />
              )}
              <th className="x-cell--actions"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className={cls(selected.has(r.id) && 'is-selected')}
                onClick={() => onOpen && onOpen(r)}
                style={{ cursor: 'pointer' }}
              >
                <td
                  className="x-cell--checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                </td>
                <td style={{ padding: 0, textAlign: 'center' }}>
                  <PriorityFlag priority={r.priority} />
                </td>
                {isVisible('id') && (
                  <td className="x-cell--mono">
                    <span
                      style={{ color: 'var(--fg-accent)', fontWeight: 500 }}
                    >
                      {r.id}
                    </span>
                  </td>
                )}
                {isVisible('vendor') && <td title={r.vendor}>{r.vendor}</td>}
                {isVisible('matter') && (
                  <td style={{ color: 'var(--fg-2)' }} title={r.matter}>
                    {r.matter}
                  </td>
                )}
                {isVisible('status') && (
                  <td>
                    <InvoiceStatus status={r.status} />
                  </td>
                )}
                {isVisible('assignee') && (
                  <td>
                    {r.assignee === '—' ? (
                      <span style={{ color: 'var(--fg-4)' }}>Unassigned</span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Avatar name={r.assignee} size="sm" />
                        <span>{r.assignee}</span>
                      </span>
                    )}
                  </td>
                )}
                {isVisible('submitted') && (
                  <td style={{ color: 'var(--fg-2)' }}>
                    {fmtDate(r.submitted)}
                  </td>
                )}
                {isVisible('amount') && (
                  <td className="x-cell--num" style={{ fontWeight: 500 }}>
                    {fmtMoney(r.amount)}
                  </td>
                )}
                <td
                  className="x-cell--actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton icon="more" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--fg-3)',
        }}
      >
        <span>Showing 1–{rows.length} of 128</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconButton icon="chevronLeft" />
          <span style={{ padding: '0 8px' }}>
            Page <strong style={{ color: 'var(--fg-1)' }}>1</strong> of 10
          </span>
          <IconButton icon="chevronRight" />
        </div>
      </div>

      {/* Floating bulk action bar */}
      {selected.size > 0 && (
        <div className="x-bulk-bar">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={toggleAll}
          />
          <span className="x-bulk-bar__count">{selected.size} selected</span>
          <div className="x-bulk-bar__sep" />
          <button className="x-bulk-bar__btn">
            <Icon name="check" size={14} />
            Approve
          </button>
          <button className="x-bulk-bar__btn">
            <Icon name="x" size={14} />
            Reject
          </button>
          <button className="x-bulk-bar__btn">
            <Icon name="user" size={14} />
            Assign
          </button>
          <button className="x-bulk-bar__btn">
            <Icon name="download" size={14} />
            Export
          </button>
          <button className="x-bulk-bar__btn x-bulk-bar__btn--danger">
            <Icon name="x" size={14} />
            Delete
          </button>
          <div className="x-bulk-bar__sep" />
          <button
            className="x-bulk-bar__close"
            onClick={() => setSelected(new Set())}
            title="Deselect all"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { InvoiceGrid, SAMPLE_INVOICES });
