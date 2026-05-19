/* global React, Icon, Button, IconButton, Badge, Segmented, fmtMoney, fmtDate */

const _W = new Proxy({}, { get: (_, k) => window[k] });

const SAMPLE_BILLS = [
  { id: 'VB-2026-00287', vendor: 'Morgan, Patel & Clark LLP', po: 'PO-2025-0812', period: 'Mar 2026', amount: 48210.0, received: '2026-04-02', due: '2026-04-17', status: 'under_review', lines: 14, rev: 2 },
  { id: 'VB-2026-00288', vendor: 'Kroll Associates', po: 'PO-2025-0840', period: 'Mar 2026', amount: 8940.5, received: '2026-04-04', due: '2026-04-19', status: 'under_review', lines: 6, rev: 1 },
  { id: 'VB-2026-00289', vendor: 'Dentons U.S. LLP', po: '—', period: 'Mar 2026', amount: 24620.0, received: '2026-04-05', due: '2026-04-20', status: 'exception', lines: 11, rev: 1 },
  { id: 'VB-2026-00290', vendor: 'Baker & Hostetler', po: 'PO-2025-0901', period: 'Q1 2026', amount: 112450.75, received: '2026-04-08', due: '2026-04-23', status: 'over_cap', lines: 33, rev: 3 },
  { id: 'VB-2026-00291', vendor: 'Skadden, Arps', po: 'PO-2026-0112', period: 'Mar 2026', amount: 298200.0, received: '2026-04-10', due: '2026-04-25', status: 'exception', lines: 58, rev: 4 },
  { id: 'VB-2026-00292', vendor: 'Cooley LLP', po: 'PO-2025-0788', period: 'Mar 2026', amount: 14210.0, received: '2026-04-11', due: '2026-04-26', status: 'processed', lines: 9, rev: 1 },
  { id: 'VB-2026-00293', vendor: 'Quinn Emanuel', po: 'PO-2026-0045', period: 'Mar 2026', amount: 186400.0, received: '2026-04-12', due: '2026-04-27', status: 'closed', lines: 42, rev: 2 },
  { id: 'VB-2026-00294', vendor: 'WilmerHale', po: '—', period: 'Mar 2026', amount: 32180.0, received: '2026-04-14', due: '2026-04-29', status: 'under_review', lines: 12, rev: 1 },
  { id: 'VB-2026-00295', vendor: 'Gibson, Dunn & Crutcher', po: 'PO-2026-0204', period: 'Mar 2026', amount: 241600.25, received: '2026-04-15', due: '2026-04-30', status: 'over_cap', lines: 64, rev: 1 },
  { id: 'VB-2026-00296', vendor: 'Paul Hastings LLP', po: 'PO-2025-0910', period: 'Mar 2026', amount: 27300.75, received: '2026-04-17', due: '2026-05-02', status: 'closed', lines: 15, rev: 2 },
];

const BillStatus = ({ status }) => {
  const map = {
    under_review: { variant: 'warn', label: 'Under Review' },
    exception: { variant: 'danger', label: 'Exception' },
    over_cap: { variant: 'danger', label: 'Over the Cap' },
    processed: { variant: 'info', label: 'Processed' },
    closed: { variant: 'success', label: 'Closed' },
    draft: { variant: 'neutral', label: 'Draft' },
  };
  const s = map[status] || map.draft;
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
};

const BILL_STATUS_OPTIONS = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'exception', label: 'Exception' },
  { value: 'over_cap', label: 'Over the Cap' },
  { value: 'processed', label: 'Processed' },
  { value: 'closed', label: 'Closed' },
];

const BILL_FILTER_FIELDS = [
  { id: 'status', label: 'Status', icon: 'workflow', type: 'multiselect', options: BILL_STATUS_OPTIONS },
  { id: 'vendor', label: 'Vendor', icon: 'briefcase', type: 'text' },
  { id: 'period', label: 'Period', icon: 'calendar', type: 'text' },
  { id: 'amount', label: 'Amount', icon: 'dollar', type: 'range' },
  { id: 'received', label: 'Received', icon: 'calendar', type: 'daterange' },
  { id: 'due', label: 'Due', icon: 'calendar', type: 'daterange' },
];

const BILL_COLUMNS = [
  {
    key: 'id',
    label: 'Bill',
    sortable: true,
    width: 150,
    render: (v) => <span className="x-cell--mono" style={{ color: 'var(--fg-accent)', fontWeight: 500 }}>{v}</span>,
  },
  { key: 'vendor', label: 'Vendor', sortable: true },
  {
    key: 'po',
    label: 'PO',
    sortable: true,
    width: 130,
    render: (v) => <span className="x-cell--mono" style={{ color: v === '—' ? 'var(--fg-4)' : 'var(--fg-2)' }}>{v}</span>,
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
    render: (v) => <BillStatus status={v} />,
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

const BILL_BULK_ACTIONS = [
  { id: 'approve', label: 'Approve', icon: 'check' },
  { id: 'reject', label: 'Reject', icon: 'x' },
  { id: 'export', label: 'Export', icon: 'download' },
  { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
];

const VendorBillGrid = ({ onOpen }) => {
  const [tab, setTab] = React.useState('all');
  const allRows = tab === 'all' ? SAMPLE_BILLS : SAMPLE_BILLS.filter((r) => r.status === tab);

  const gf = _W.useGridFilters({
    rows: allRows,
    filterFields: BILL_FILTER_FIELDS,
  });

  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [sort, setSort] = React.useState({ key: 'received', dir: 'desc' });
  const [columns, setColumns] = React.useState(BILL_COLUMNS);
  const [density, setDensity] = React.useState('default');
  const [fixedHeader, setFixedHeader] = React.useState(true);

  const displayRows = gf.filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const total = gf.filteredRows.reduce((s, r) => s + r.amount, 0);
  const allSelected = selected.size === displayRows.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  const tabs = [
    { value: 'all', label: 'All', count: SAMPLE_BILLS.length },
    { value: 'under_review', label: 'Under Review', count: SAMPLE_BILLS.filter((r) => r.status === 'under_review').length },
    { value: 'exception', label: 'Exception', count: SAMPLE_BILLS.filter((r) => r.status === 'exception').length },
    { value: 'over_cap', label: 'Over the Cap', count: SAMPLE_BILLS.filter((r) => r.status === 'over_cap').length },
    { value: 'processed', label: 'Processed', count: SAMPLE_BILLS.filter((r) => r.status === 'processed').length },
    { value: 'closed', label: 'Closed', count: SAMPLE_BILLS.filter((r) => r.status === 'closed').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="x-tabs" style={{ padding: 0, border: 'none' }}>
        {tabs.map((t) => (
          <button key={t.value} role="tab" aria-selected={tab === t.value} className="x-tab" onClick={() => { setTab(t.value); setPage(1); }}>
            {t.label}
            <span className="x-tab__count">{t.count}</span>
          </button>
        ))}
      </div>

      <_W.DataGrid
        columns={columns}
        rows={displayRows}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={(s) => { setSort(s); setPage(1); }}
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
            <_W.GridSearchInput {...gf.searchProps} placeholder="Search bills, vendors, PO…" />
            <_W.ChipFilterBar {...gf.chipProps} maxVisible={4} />
            {gf.hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={() => { gf.clearAll(); setPage(1); }}>
                Clear all
              </Button>
            )}
            <div className="x-grid-toolbar__spacer" />
            <span className="x-grid-toolbar__count">
              {selected.size > 0 ? (
                <>{selected.size} selected</>
              ) : (
                <>{gf.filteredCount} bills · {fmtMoney(total)}</>
              )}
            </span>
            {selected.size === 0 && (
              <>
                <Button variant="secondary" size="sm" icon="download">Export</Button>
                <Button variant="accent" size="sm" icon="plus">New bill</Button>
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
            onPageSizeChange={(ps) => { setPageSize(ps); setPage(1); }}
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
            actions={BILL_BULK_ACTIONS}
          />
        }
      />
    </div>
  );
};

Object.assign(window, { VendorBillGrid, SAMPLE_BILLS, BillStatus });
