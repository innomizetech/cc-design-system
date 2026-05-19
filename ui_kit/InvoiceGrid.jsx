/* global React, Icon, Button, IconButton, Badge, InvoiceStatus, Avatar, Segmented, fmtMoney, fmtDate */

const _W = new Proxy({}, { get: (_, k) => window[k] });

const SAMPLE_INVOICES = [
  { id: 'INV-2026-00418', vendor: 'Morgan, Patel & Clark LLP', matter: 'Contract breach resolution under intellectual rights conflict', matterCode: '00012', client: 'Everest National Insurance Group', clientCode: '1096', amount: 142880.0, submitted: '2026-04-18', due: '2026-05-18', status: 'in_review', assignee: 'Eleanor Wu', priority: 'high', lines: 47, editLock: { by: 'K. Alvarez', acquiredAt: '2026-04-21T14:02:00' } },
  { id: 'INV-2026-00417', vendor: 'Dentons U.S. LLP', matter: 'Employment Matter — Class Action', amount: 68420.5, submitted: '2026-04-18', due: '2026-05-17', status: 'submitted', assignee: '—', priority: 'med', lines: 23 },
  { id: 'INV-2026-00416', vendor: 'Kroll Associates', matter: 'Forensic Accounting — Jensen', amount: 12750.0, submitted: '2026-04-17', due: '2026-05-17', status: 'approved', assignee: 'Marcus Orr', priority: 'low', lines: 8 },
  { id: 'INV-2026-00415', vendor: 'Baker & Hostetler', matter: 'Data Breach Response', amount: 210000.0, submitted: '2026-04-16', due: '2026-05-16', status: 'disputed', assignee: 'Eleanor Wu', priority: 'high', lines: 64 },
  { id: 'INV-2026-00414', vendor: 'Skadden, Arps', matter: 'M&A — Project Phoenix', amount: 485300.0, submitted: '2026-04-16', due: '2026-05-16', status: 'in_review', assignee: 'Priya Shah', priority: 'high', lines: 112 },
  { id: 'INV-2026-00413', vendor: 'Paul Hastings LLP', matter: 'Regulatory — FTC Inquiry', amount: 34210.75, submitted: '2026-04-15', due: '2026-05-15', status: 'paid', assignee: 'Marcus Orr', priority: 'med', lines: 19 },
  { id: 'INV-2026-00412', vendor: 'Latham & Watkins', matter: 'SEC Filing Support', amount: 92640.0, submitted: '2026-04-15', due: '2026-05-15', status: 'on_hold', assignee: 'Eleanor Wu', priority: 'med', lines: 31 },
  { id: 'INV-2026-00411', vendor: 'Cooley LLP', matter: 'Patent Prosecution — Atlas', amount: 18975.0, submitted: '2026-04-14', due: '2026-05-14', status: 'approved', assignee: 'Priya Shah', priority: 'low', lines: 14 },
  { id: 'INV-2026-00410', vendor: 'Gibson, Dunn & Crutcher', matter: 'Antitrust — Helios Acquisition', amount: 318450.25, submitted: '2026-04-14', due: '2026-05-14', status: 'in_review', assignee: 'Eleanor Wu', priority: 'high', lines: 88 },
  { id: 'INV-2026-00409', vendor: 'Quinn Emanuel', matter: 'Litigation — Northfield v. Acme', amount: 156780.0, submitted: '2026-04-13', due: '2026-05-13', status: 'submitted', assignee: '—', priority: 'med', lines: 52 },
  { id: 'INV-2026-00408', vendor: 'Morgan, Patel & Clark LLP', matter: 'IP Portfolio Review', amount: 27300.0, submitted: '2026-04-12', due: '2026-05-12', status: 'approved', assignee: 'Marcus Orr', priority: 'low', lines: 11 },
  { id: 'INV-2026-00407', vendor: 'WilmerHale', matter: 'Export Controls Advisory', amount: 41250.0, submitted: '2026-04-12', due: '2026-05-12', status: 'rejected', assignee: 'Priya Shah', priority: 'med', lines: 17 },
  { id: 'INV-2026-00406', vendor: 'Jones Day', matter: 'General Corporate — Q2', amount: 88420.0, submitted: '2026-04-11', due: '2026-05-11', status: 'paid', assignee: 'Marcus Orr', priority: 'low', lines: 29 },
  { id: 'INV-2026-00405', vendor: 'Sidley Austin', matter: 'Tax Controversy — State', amount: 54100.0, submitted: '2026-04-10', due: '2026-05-10', status: 'in_review', assignee: 'Eleanor Wu', priority: 'med', lines: 22 },
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

const INVOICE_FILTER_FIELDS = [
  { id: 'status', label: 'Status', icon: 'workflow', type: 'multiselect', options: STATUS_OPTIONS },
  { id: 'assignee', label: 'Assignee', icon: 'user', type: 'multiselect', options: ASSIGNEE_OPTIONS },
  { id: 'vendor', label: 'Vendor', icon: 'briefcase', type: 'text' },
  { id: 'matter', label: 'Matter', icon: 'matter', type: 'text' },
  { id: 'amount', label: 'Amount', icon: 'dollar', type: 'range' },
  { id: 'submitted', label: 'Submitted', icon: 'calendar', type: 'daterange' },
  { id: 'priority', label: 'Priority', icon: 'flag', type: 'multiselect', options: PRIORITY_OPTIONS },
];

const INVOICE_COLUMNS = [
  {
    key: 'priority',
    label: '',
    width: 32,
    render: (_, r) => <PriorityFlag priority={r.priority} />,
  },
  {
    key: 'id',
    label: 'Invoice',
    sortable: true,
    width: 160,
    render: (v) => (
      <span className="x-cell--mono" style={{ color: 'var(--fg-accent)', fontWeight: 500 }}>{v}</span>
    ),
  },
  { key: 'vendor', label: 'Vendor', sortable: true },
  {
    key: 'matter',
    label: 'Matter',
    sortable: true,
    wrap: true,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{v}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 120,
    render: (v) => <InvoiceStatus status={v} />,
  },
  {
    key: 'assignee',
    label: 'Assignee',
    sortable: true,
    width: 150,
    render: (v) =>
      v === '—' ? (
        <span style={{ color: 'var(--fg-4)' }}>Unassigned</span>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Avatar name={v} size="sm" />
          <span>{v}</span>
        </span>
      ),
  },
  {
    key: 'submitted',
    label: 'Submitted',
    sortable: true,
    width: 110,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtDate(v)}</span>,
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

const INVOICE_BULK_ACTIONS = [
  { id: 'approve', label: 'Approve', icon: 'check' },
  { id: 'reject', label: 'Reject', icon: 'x' },
  { id: 'assign', label: 'Assign', icon: 'user' },
  { id: 'export', label: 'Export', icon: 'download' },
  { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
];

const InvoiceGrid = ({ onOpen }) => {
  const gf = _W.useGridFilters({
    rows: SAMPLE_INVOICES,
    filterFields: INVOICE_FILTER_FIELDS,
    initialFilters: [
      { id: 'status', label: 'Status', data: { values: ['in_review', 'submitted'] } },
      { id: 'assignee', label: 'Assignee', data: { values: ['Eleanor Wu'] } },
    ],
  });

  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [sort, setSort] = React.useState({ key: 'submitted', dir: 'desc' });
  const [columns, setColumns] = React.useState(INVOICE_COLUMNS);
  const [density, setDensity] = React.useState('default');
  const [fixedHeader, setFixedHeader] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [view, setView] = React.useState('list');

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 650);
  };

  const displayRows = gf.filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const total = gf.filteredRows.reduce((s, r) => s + r.amount, 0);
  const allSelected = selected.size === displayRows.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  return (
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
      maxHeight={560}
      toolbar={
        <>
          <_W.GridSearchInput {...gf.searchProps} placeholder="Search invoices…" />
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
              <>{gf.filteredCount} invoices · {fmtMoney(total)}</>
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
              <Button variant="secondary" size="sm" icon="download">Export</Button>
              <Button variant="accent" size="sm" icon="plus">Upload invoice</Button>
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
          actions={INVOICE_BULK_ACTIONS}
        />
      }
    />
  );
};

Object.assign(window, { InvoiceGrid, SAMPLE_INVOICES });
