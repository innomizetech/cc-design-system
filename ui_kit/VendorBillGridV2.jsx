/* global React, Icon, Button, IconButton, Badge, Segmented, fmtMoney, fmtDate, cls, DateRangePicker, FilterLabel, QuickSelect */

const _W = new Proxy({}, { get: (_, k) => window[k] });

// =====================================================================
// VendorBillGridV2 — Three-layer list page
// Layer 1: Global filters (date range, vendor, matter)
// Layer 2: Stats cards (status buckets, clickable)
// Layer 3: DataGrid with toolbar filters
// =====================================================================

// ---------- Layer 1: Global Filters ----------------------------------

const BillGlobalFilters = ({ filters, onChange, onReset }) => {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  const hasActive =
    filters.vendor ||
    filters.period !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 0',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Date range picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FilterLabel icon="calendar">Date</FilterLabel>
        <DateRangePicker
          preset={filters.datePreset}
          from={filters.dateFrom}
          to={filters.dateTo}
          onPresetChange={(v) => set('datePreset', v)}
          onFromChange={(v) => set('dateFrom', v)}
          onToChange={(v) => set('dateTo', v)}
        />
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

      {/* Period quick select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FilterLabel icon="matter">Period</FilterLabel>
        <div className="x-segmented" role="tablist">
          <QuickSelect
            value={filters.period}
            onChange={(v) => set('period', v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'Mar 2026', label: 'Mar' },
              { value: 'Q1 2026', label: 'Q1' },
            ]}
          />
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

      {/* Vendor select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FilterLabel icon="vendor">Vendor</FilterLabel>
        <select
          className="x-select"
          value={filters.vendor}
          onChange={(e) => set('vendor', e.target.value)}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            paddingRight: 28,
            minWidth: 160,
            fontSize: 'var(--fs-sm)',
          }}
        >
          <option value="">All vendors</option>
          <option value="Morgan, Patel & Clark LLP">Morgan, Patel & Clark</option>
          <option value="Kroll Associates">Kroll Associates</option>
          <option value="Dentons U.S. LLP">Dentons U.S.</option>
          <option value="Baker & Hostetler">Baker & Hostetler</option>
          <option value="Skadden, Arps">Skadden, Arps</option>
          <option value="Cooley LLP">Cooley LLP</option>
          <option value="Quinn Emanuel">Quinn Emanuel</option>
          <option value="WilmerHale">WilmerHale</option>
        </select>
      </div>

      <div style={{ flex: 1 }} />

      {hasActive && (
        <Button variant="ghost" size="sm" icon="x" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  );
};

// ---------- Layer 2: Stats Cards -------------------------------------
const BILL_STATS = [
  {
    key: 'draft',
    label: 'Draft',
    icon: 'edit',
    statuses: ['draft'],
    color: 'var(--fg-3)',
  },
  {
    key: 'under_review',
    label: 'Under Review',
    icon: 'eye',
    statuses: ['under_review'],
    color: 'var(--warning-500)',
  },
  {
    key: 'exception',
    label: 'Exception',
    icon: 'warning',
    statuses: ['exception', 'over_cap'],
    color: 'var(--error-500)',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: 'checkCircle',
    statuses: ['processed', 'closed'],
    color: 'var(--success-500)',
  },
];

const BillStatsCards = ({ rows, activeKey, onCardClick }) => {
  const stats = BILL_STATS.map((s) => {
    const matching = rows.filter((r) => s.statuses.includes(r.status));
    return {
      ...s,
      count: matching.length,
      total: matching.reduce((sum, r) => sum + r.amount, 0),
    };
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
      }}
    >
      {stats.map((s) => {
        const active = activeKey === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onCardClick(active ? null : s.key)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              boxSizing: 'border-box',
              padding: '14px 16px',
              borderRadius: 'var(--radius-lg)',
              border: active
                ? '2px solid var(--border-focus)'
                : '1px solid var(--border-subtle)',
              background: active ? 'var(--bg-accent-subtle, var(--a-50))' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              transition: 'border-color 0.12s ease, background 0.12s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name={s.icon} size={16} style={{ color: s.color }} />
              <span
                style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--fg-2)',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 600,
                  color: 'var(--fg-1)',
                }}
              >
                {s.count}
              </span>
              <span
                style={{
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--fg-3)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {fmtMoney(s.total)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ---------- Layer 3: Grid (reuses existing infrastructure) -----------

const BILL_STATUS_OPTIONS_V2 = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'exception', label: 'Exception' },
  { value: 'over_cap', label: 'Over the Cap' },
  { value: 'processed', label: 'Processed' },
  { value: 'closed', label: 'Closed' },
];

const BILL_FILTER_FIELDS_V2 = [
  { id: 'status', label: 'Status', icon: 'workflow', type: 'multiselect', options: BILL_STATUS_OPTIONS_V2 },
  { id: 'vendor', label: 'Vendor', icon: 'briefcase', type: 'text' },
  { id: 'amount', label: 'Amount', icon: 'dollar', type: 'range' },
  { id: 'due', label: 'Due', icon: 'calendar', type: 'daterange' },
];

const BILL_COLUMNS_V2 = [
  {
    key: 'id',
    label: 'Bill',
    sortable: true,
    width: 150,
    render: (v) => (
      <span className="x-cell--mono" style={{ color: 'var(--fg-accent)', fontWeight: 500 }}>{v}</span>
    ),
  },
  { key: 'vendor', label: 'Vendor', sortable: true },
  {
    key: 'po',
    label: 'PO',
    sortable: true,
    width: 130,
    render: (v) => (
      <span className="x-cell--mono" style={{ color: v === '—' ? 'var(--fg-4)' : 'var(--fg-2)' }}>{v}</span>
    ),
  },
  {
    key: 'period',
    label: 'Period',
    sortable: true,
    width: 110,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{v}</span>,
  },
  {
    key: 'received',
    label: 'Received',
    sortable: true,
    width: 120,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtDate(v)}</span>,
  },
  {
    key: 'due',
    label: 'Due',
    sortable: true,
    width: 120,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtDate(v)}</span>,
  },
  {
    key: 'lines',
    label: 'Lines',
    sortable: true,
    width: 70,
    align: 'right',
    className: 'x-cell--num',
  },
  {
    key: 'rev',
    label: 'Rev',
    width: 60,
    align: 'center',
    render: (v) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--fg-3)', fontSize: 'var(--fs-xs)' }}>
        <Icon name="history" size={10} />v{v}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 130,
    render: (v) => <_W.BillStatus status={v} />,
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    width: 130,
    align: 'right',
    className: 'x-cell--num',
    render: (v) => <span style={{ fontWeight: 500 }}>{fmtMoney(v)}</span>,
  },
  {
    key: '_actions',
    label: '',
    width: 48,
    className: 'x-cell--actions',
    render: () => <IconButton icon="more" />,
  },
];

const BILL_BULK_ACTIONS_V2 = [
  { id: 'approve', label: 'Approve', icon: 'check' },
  { id: 'reject', label: 'Reject', icon: 'x' },
  { id: 'export', label: 'Export', icon: 'download' },
  { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
];

// ---------- Main component -------------------------------------------
const VendorBillGridV2 = ({ onOpen }) => {
  // Layer 1: Global filter state
  const [globalFilters, setGlobalFilters] = React.useState({
    datePreset: '',
    dateFrom: '',
    dateTo: '',
    vendor: '',
    period: 'all',
  });
  const resetGlobal = () =>
    setGlobalFilters({ datePreset: '', dateFrom: '', dateTo: '', vendor: '', period: 'all' });

  // Apply global filters to all rows
  const globalFiltered = React.useMemo(() => {
    return SAMPLE_BILLS.filter((r) => {
      if (globalFilters.vendor && r.vendor !== globalFilters.vendor) return false;
      if (globalFilters.period !== 'all' && r.period !== globalFilters.period) return false;
      if (globalFilters.dateFrom && r.received < globalFilters.dateFrom) return false;
      if (globalFilters.dateTo && r.received > globalFilters.dateTo) return false;
      return true;
    });
  }, [globalFilters]);

  // Layer 2: Stats card selection
  const [activeCard, setActiveCard] = React.useState(null);

  const cardFiltered = React.useMemo(() => {
    if (!activeCard) return globalFiltered;
    const stat = BILL_STATS.find((s) => s.key === activeCard);
    if (!stat) return globalFiltered;
    return globalFiltered.filter((r) => stat.statuses.includes(r.status));
  }, [globalFiltered, activeCard]);

  // Layer 3: Grid filters (search, chips)
  const gf = _W.useGridFilters({
    rows: cardFiltered,
    filterFields: BILL_FILTER_FIELDS_V2,
  });

  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [sort, setSort] = React.useState({ key: 'received', dir: 'desc' });
  const [columns, setColumns] = React.useState(BILL_COLUMNS_V2);
  const [density, setDensity] = React.useState('default');
  const [fixedHeader, setFixedHeader] = React.useState(true);

  // Reset page when filters change
  React.useEffect(() => { setPage(1); }, [globalFilters, activeCard]);

  const displayRows = gf.filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const total = gf.filteredRows.reduce((s, r) => s + r.amount, 0);
  const allSelected = selected.size === displayRows.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Layer 1 */}
      <BillGlobalFilters
        filters={globalFilters}
        onChange={setGlobalFilters}
        onReset={resetGlobal}
      />

      {/* Layer 2 */}
      <BillStatsCards
        rows={globalFiltered}
        activeKey={activeCard}
        onCardClick={(key) => {
          setActiveCard(key);
          setSelected(new Set());
        }}
      />

      {/* Layer 3 */}
      <_W.DataGrid
        columns={columns}
        rows={displayRows}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPage(1);
        }}
        onRowClick={(r) => onOpen && onOpen(r)}
        settingsEnabled
        onColumnsChange={setColumns}
        density={density}
        onDensityChange={setDensity}
        fixedHeader={fixedHeader}
        onFixedHeaderChange={setFixedHeader}
        maxHeight={500}
        toolbar={
          <>
            <_W.GridSearchInput
              {...gf.searchProps}
              placeholder="Search bills, vendors, PO…"
            />
            <_W.ChipFilterBar {...gf.chipProps} maxVisible={4} />
            {gf.hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  gf.clearAll();
                  setPage(1);
                }}
              >
                Clear all
              </Button>
            )}
            <div className="x-grid-toolbar__spacer" />
            <span className="x-grid-toolbar__count">
              {selected.size > 0 ? (
                <>{selected.size} selected</>
              ) : (
                <>
                  {gf.filteredCount} bills · {fmtMoney(total)}
                </>
              )}
            </span>
            {selected.size === 0 && (
              <>
                <Button variant="secondary" size="sm" icon="download">
                  Export
                </Button>
                <Button variant="accent" size="sm" icon="plus">
                  New bill
                </Button>
              </>
            )}
          </>
        }
        footer={
          <_W.DataGridPagination
            totalRows={gf.filteredCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(ps) => {
              setPageSize(ps);
              setPage(1);
            }}
          />
        }
        bulkBar={
          <_W.BulkActionBar
            mode="floating"
            selected={selected}
            totalRows={displayRows.length}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={() => {
              if (allSelected) setSelected(new Set());
              else setSelected(new Set(displayRows.map((r) => r.id)));
            }}
            onClearSelection={() => setSelected(new Set())}
            actions={BILL_BULK_ACTIONS_V2}
          />
        }
      />
    </div>
  );
};

Object.assign(window, { VendorBillGridV2 });
