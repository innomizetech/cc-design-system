/* global React, Icon, Button, IconButton, Badge, Avatar, Segmented, fmtMoney, fmtDate */

const _W = new Proxy({}, { get: (_, k) => window[k] });

const SAMPLE_MATTERS = [
  { id: 'LIT-2026-00418', name: 'Acme v. Helios — IP Dispute', client: 'Acme Holdings Inc.', practice: 'IP Litigation', partner: 'K. Alvarez', manager: 'Eleanor Wu', status: 'open', feeType: 'hourly', budget: 850000, wip: 142880, ar: 68420, opened: '2025-06-14', jurisdiction: 'N.D. Cal.', office: 'San Francisco', pri: 'high', star: true },
  { id: 'MA-2026-00019', name: 'Project Phoenix — Apollo Bio IPO', client: 'Apollo Biosciences', practice: 'Capital Markets', partner: 'Priya Shah', manager: 'Marcus Orr', status: 'open', feeType: 'flat', budget: 1200000, wip: 485300, ar: 120000, opened: '2025-11-02', jurisdiction: 'SEC', office: 'New York', pri: 'high', star: true },
  { id: 'LIT-2025-00411', name: 'Northfield v. Acme — Contract', client: 'Acme Holdings Inc.', practice: 'Commercial Lit.', partner: 'J. Wilson', manager: 'Eleanor Wu', status: 'open', feeType: 'hourly', budget: 420000, wip: 88640, ar: 14500, opened: '2025-03-08', jurisdiction: 'S.D.N.Y.', office: 'New York', pri: 'med' },
  { id: 'REG-2026-00007', name: 'FTC Inquiry — Meridian Health', client: 'Meridian Health', practice: 'Regulatory', partner: 'Sarah Chen', manager: 'Priya Shah', status: 'open', feeType: 'blended', budget: 300000, wip: 34210, ar: 8600, opened: '2026-01-14', jurisdiction: 'FTC', office: 'Washington, D.C.', pri: 'high' },
  { id: 'EMP-2026-00102', name: 'Torres class action — Overtime', client: 'Fleet Logistics Co.', practice: 'Employment', partner: 'D. Park', manager: 'Marcus Orr', status: 'open', feeType: 'capped', budget: 650000, wip: 210350, ar: 42200, opened: '2025-10-21', jurisdiction: 'C.D. Cal.', office: 'Los Angeles', pri: 'med' },
  { id: 'IP-2026-00033', name: 'Atlas Patent Prosecution — Sterling', client: 'Sterling Labs', practice: 'Patent Prosecution', partner: 'Priya Shah', manager: 'J. Tanaka', status: 'open', feeType: 'flat', budget: 90000, wip: 18975, ar: 4200, opened: '2026-02-03', jurisdiction: 'USPTO', office: 'Palo Alto', pri: 'low' },
  { id: 'REG-2026-00011', name: 'Export controls — Helios shipments', client: 'Helios Corp.', practice: 'Regulatory', partner: 'Sarah Chen', manager: '—', status: 'on_hold', feeType: 'hourly', budget: 150000, wip: 41250, ar: 12000, opened: '2025-12-19', jurisdiction: 'BIS', office: 'Washington, D.C.', pri: 'med' },
  { id: 'TAX-2026-00004', name: 'State tax controversy — Apollo', client: 'Apollo Biosciences', practice: 'Tax', partner: 'K. Alvarez', manager: 'Eleanor Wu', status: 'open', feeType: 'hourly', budget: 180000, wip: 54100, ar: 22400, opened: '2026-03-05', jurisdiction: 'CA DTA', office: 'San Francisco', pri: 'med' },
  { id: 'CORP-2026-0088', name: 'Q2 Corporate — Jensen & Co.', client: 'Jensen Family Trust', practice: 'Corporate', partner: 'J. Wilson', manager: '—', status: 'open', feeType: 'hourly', budget: 240000, wip: 88420, ar: 31500, opened: '2025-07-11', jurisdiction: 'Delaware', office: 'New York', pri: 'low' },
  { id: 'LIT-2026-00420', name: 'Data breach — Helios (2026 Q1)', client: 'Helios Corp.', practice: 'Cyber / Privacy', partner: 'Sarah Chen', manager: 'Eleanor Wu', status: 'open', feeType: 'hourly', budget: 1500000, wip: 360450, ar: 115000, opened: '2026-02-22', jurisdiction: 'Multi', office: 'San Francisco', pri: 'high', star: true },
  { id: 'MA-2026-00024', name: 'Antitrust review — Helios/Orion', client: 'Helios Corp.', practice: 'Antitrust / M&A', partner: 'Priya Shah', manager: 'Marcus Orr', status: 'prospective', feeType: 'blended', budget: 520000, wip: 0, ar: 0, opened: '2026-04-05', jurisdiction: 'DOJ Antitrust', office: 'Washington, D.C.', pri: 'high' },
  { id: 'LIT-2024-00312', name: 'Kroll forensic — Jensen accounting', client: 'Jensen Family Trust', practice: 'Litigation Supp.', partner: 'J. Wilson', manager: 'Marcus Orr', status: 'closed', feeType: 'hourly', budget: 95000, wip: 0, ar: 0, opened: '2024-05-30', jurisdiction: 'N.Y. Cty.', office: 'New York', pri: 'low' },
];

const MatterStatus = ({ status }) => {
  const map = {
    open: { variant: 'success', label: 'Open' },
    on_hold: { variant: 'warn', label: 'On hold' },
    closed: { variant: 'neutral', label: 'Closed' },
    conflict: { variant: 'danger', label: 'Conflict check' },
    prospective: { variant: 'info', label: 'Prospective' },
  };
  const s = map[status] || map.open;
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
};

const BudgetBar = ({ wip, budget }) => {
  const pct = budget > 0 ? Math.min(100, Math.round((wip / budget) * 100)) : 0;
  const color = pct >= 90 ? 'var(--danger-500)' : pct >= 70 ? 'var(--warn-500)' : 'var(--success-500)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'var(--n-100)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.2s' }} />
      </div>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums', width: 32, textAlign: 'right' }}>
        {pct}%
      </span>
    </div>
  );
};

const PracticeBadge = ({ name }) => {
  const palettes = [
    { bg: '#ECE7D6', fg: '#6B5A2A' },
    { bg: '#DDE4E5', fg: '#2F5A66' },
    { bg: '#E5DED8', fg: '#6F4A35' },
    { bg: '#E0E4DB', fg: '#3F5A3E' },
    { bg: '#E8DCDE', fg: '#703545' },
    { bg: '#E4E1DA', fg: '#4A453D' },
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const p = palettes[h % palettes.length];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 10, background: p.bg, color: p.fg, fontSize: 'var(--fs-xs)', fontWeight: 500, whiteSpace: 'nowrap' }}>
      {name}
    </span>
  );
};

const MATTER_STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'closed', label: 'Closed' },
  { value: 'prospective', label: 'Prospective' },
];
const PRACTICE_OPTIONS = [
  { value: 'IP Litigation', label: 'IP Litigation' },
  { value: 'Capital Markets', label: 'Capital Markets' },
  { value: 'Commercial Lit.', label: 'Commercial Lit.' },
  { value: 'Regulatory', label: 'Regulatory' },
  { value: 'Employment', label: 'Employment' },
  { value: 'Patent Prosecution', label: 'Patent Prosecution' },
  { value: 'Tax', label: 'Tax' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Cyber / Privacy', label: 'Cyber / Privacy' },
  { value: 'Antitrust / M&A', label: 'Antitrust / M&A' },
  { value: 'Litigation Supp.', label: 'Litigation Supp.' },
];
const PARTNER_OPTIONS = [
  { value: 'K. Alvarez', label: 'K. Alvarez' },
  { value: 'Priya Shah', label: 'Priya Shah' },
  { value: 'J. Wilson', label: 'J. Wilson' },
  { value: 'Sarah Chen', label: 'Sarah Chen' },
  { value: 'D. Park', label: 'D. Park' },
];

const MATTER_FILTER_FIELDS = [
  { id: 'status', label: 'Status', icon: 'workflow', type: 'multiselect', options: MATTER_STATUS_OPTIONS },
  { id: 'practice', label: 'Practice', icon: 'briefcase', type: 'multiselect', options: PRACTICE_OPTIONS },
  { id: 'partner', label: 'Partner', icon: 'user', type: 'multiselect', options: PARTNER_OPTIONS },
  { id: 'client', label: 'Client', icon: 'briefcase', type: 'text' },
  { id: 'name', label: 'Name', icon: 'matter', type: 'text' },
  { id: 'wip', label: 'WIP', icon: 'dollar', type: 'range' },
  { id: 'opened', label: 'Opened', icon: 'calendar', type: 'daterange' },
];

const MATTER_COLUMNS = [
  {
    key: 'star',
    label: '',
    width: 28,
    render: (v) => (
      <Icon name="star" size={13} style={{ color: v ? 'var(--warn-500)' : 'var(--fg-4)', fill: v ? 'var(--warn-500)' : 'none' }} />
    ),
  },
  {
    key: 'id',
    label: 'Matter #',
    sortable: true,
    width: 150,
    render: (v) => <span className="x-cell--mono" style={{ color: 'var(--fg-accent)', fontWeight: 500 }}>{v}</span>,
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    wrap: true,
    render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
  },
  {
    key: 'client',
    label: 'Client',
    sortable: true,
    width: 200,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{v}</span>,
  },
  {
    key: 'practice',
    label: 'Practice',
    sortable: true,
    width: 170,
    render: (v) => <PracticeBadge name={v} />,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 140,
    render: (v) => <MatterStatus status={v} />,
  },
  {
    key: 'partner',
    label: 'Partner',
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
    key: 'opened',
    label: 'Opened',
    sortable: true,
    width: 110,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtDate(v)}</span>,
  },
  {
    key: 'wip',
    label: 'WIP',
    sortable: true,
    width: 110,
    align: 'right',
    className: 'x-cell--num',
    render: (v) => v > 0 ? <span style={{ fontWeight: 500 }}>{fmtMoney(v)}</span> : <span style={{ color: 'var(--fg-4)' }}>—</span>,
  },
  {
    key: 'budget',
    label: 'Budget',
    width: 170,
    render: (_, r) => r.budget > 0 ? <BudgetBar wip={r.wip} budget={r.budget} /> : <span style={{ color: 'var(--fg-4)' }}>—</span>,
  },
  {
    key: 'ar',
    label: 'AR',
    sortable: true,
    width: 110,
    align: 'right',
    className: 'x-cell--num',
    render: (v) => v > 0 ? fmtMoney(v) : <span style={{ color: 'var(--fg-4)' }}>—</span>,
  },
  {
    key: '_actions',
    label: '',
    width: 48,
    className: 'x-cell--actions',
    render: () => <IconButton icon="more" />,
  },
];

const MATTER_BULK_ACTIONS = [
  { id: 'reassign', label: 'Reassign', icon: 'user' },
  { id: 'close', label: 'Close', icon: 'lock' },
  { id: 'export', label: 'Export', icon: 'download' },
  { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
];

const MatterGrid = ({ onOpen }) => {
  const [scope, setScope] = React.useState('all');
  const baseRows = scope === 'mine'
    ? SAMPLE_MATTERS.filter((m) => m.partner === 'K. Alvarez' || m.manager === 'Eleanor Wu')
    : SAMPLE_MATTERS;

  const gf = _W.useGridFilters({
    rows: baseRows,
    filterFields: MATTER_FILTER_FIELDS,
    initialFilters: [
      { id: 'status', label: 'Status', data: { values: ['open', 'on_hold'] } },
    ],
  });

  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [sort, setSort] = React.useState({ key: 'opened', dir: 'desc' });
  const [columns, setColumns] = React.useState(MATTER_COLUMNS);
  const [density, setDensity] = React.useState('default');
  const [fixedHeader, setFixedHeader] = React.useState(true);

  const displayRows = gf.filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const totalWip = gf.filteredRows.reduce((s, r) => s + (r.wip || 0), 0);
  const totalAr = gf.filteredRows.reduce((s, r) => s + (r.ar || 0), 0);
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
          <Segmented
            value={scope}
            onChange={(v) => { setScope(v); setPage(1); }}
            options={[
              { value: 'mine', label: 'My matters' },
              { value: 'all', label: 'All' },
            ]}
          />
          <_W.GridSearchInput {...gf.searchProps} placeholder="Search matters…" />
          <_W.ChipFilterBar {...gf.chipProps} maxVisible={3} />
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
              <>{gf.filteredCount} matters · WIP {fmtMoney(totalWip)} · AR {fmtMoney(totalAr)}</>
            )}
          </span>
          {selected.size === 0 && (
            <>
              <Button variant="secondary" size="sm" icon="download">Export</Button>
              <Button variant="accent" size="sm" icon="plus">New matter</Button>
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
          actions={MATTER_BULK_ACTIONS}
        />
      }
    />
  );
};

Object.assign(window, { MatterGrid, MatterStatus, SAMPLE_MATTERS });
