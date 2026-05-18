/* global React, Icon, Button, IconButton, Badge, Avatar, Chip, Segmented, Checkbox, fmtMoney, fmtDate, cls */

// ======================================================================
// MatterGrid — firm-wide matter list.
//
// Columns (opinionated for a legal-tech console):
//   Matter # · Name · Client · Practice · Status · Partner · Open date
//   · WIP · Budget utilization · AR
// Filters: My matters / All, Status, Practice, Partner, Client, Date range.
// ======================================================================

const SAMPLE_MATTERS = [
  {
    id: 'LIT-2026-00418',
    name: 'Acme v. Helios — IP Dispute',
    client: 'Acme Holdings Inc.',
    practice: 'IP Litigation',
    partner: 'K. Alvarez',
    manager: 'Eleanor Wu',
    status: 'open',
    feeType: 'hourly',
    budget: 850000,
    wip: 142880,
    ar: 68420,
    opened: '2025-06-14',
    jurisdiction: 'N.D. Cal.',
    office: 'San Francisco',
    pri: 'high',
    star: true,
  },
  {
    id: 'MA-2026-00019',
    name: 'Project Phoenix — Apollo Bio IPO',
    client: 'Apollo Biosciences',
    practice: 'Capital Markets',
    partner: 'Priya Shah',
    manager: 'Marcus Orr',
    status: 'open',
    feeType: 'flat',
    budget: 1200000,
    wip: 485300,
    ar: 120000,
    opened: '2025-11-02',
    jurisdiction: 'SEC',
    office: 'New York',
    pri: 'high',
    star: true,
  },
  {
    id: 'LIT-2025-00411',
    name: 'Northfield v. Acme — Contract',
    client: 'Acme Holdings Inc.',
    practice: 'Commercial Lit.',
    partner: 'J. Wilson',
    manager: 'Eleanor Wu',
    status: 'open',
    feeType: 'hourly',
    budget: 420000,
    wip: 88640,
    ar: 14500,
    opened: '2025-03-08',
    jurisdiction: 'S.D.N.Y.',
    office: 'New York',
    pri: 'med',
  },
  {
    id: 'REG-2026-00007',
    name: 'FTC Inquiry — Meridian Health',
    client: 'Meridian Health',
    practice: 'Regulatory',
    partner: 'Sarah Chen',
    manager: 'Priya Shah',
    status: 'open',
    feeType: 'blended',
    budget: 300000,
    wip: 34210,
    ar: 8600,
    opened: '2026-01-14',
    jurisdiction: 'FTC',
    office: 'Washington, D.C.',
    pri: 'high',
  },
  {
    id: 'EMP-2026-00102',
    name: 'Torres class action — Overtime',
    client: 'Fleet Logistics Co.',
    practice: 'Employment',
    partner: 'D. Park',
    manager: 'Marcus Orr',
    status: 'open',
    feeType: 'capped',
    budget: 650000,
    wip: 210350,
    ar: 42200,
    opened: '2025-10-21',
    jurisdiction: 'C.D. Cal.',
    office: 'Los Angeles',
    pri: 'med',
  },
  {
    id: 'IP-2026-00033',
    name: 'Atlas Patent Prosecution — Sterling',
    client: 'Sterling Labs',
    practice: 'Patent Prosecution',
    partner: 'Priya Shah',
    manager: 'J. Tanaka',
    status: 'open',
    feeType: 'flat',
    budget: 90000,
    wip: 18975,
    ar: 4200,
    opened: '2026-02-03',
    jurisdiction: 'USPTO',
    office: 'Palo Alto',
    pri: 'low',
  },
  {
    id: 'REG-2026-00011',
    name: 'Export controls — Helios shipments',
    client: 'Helios Corp.',
    practice: 'Regulatory',
    partner: 'Sarah Chen',
    manager: '—',
    status: 'on_hold',
    feeType: 'hourly',
    budget: 150000,
    wip: 41250,
    ar: 12000,
    opened: '2025-12-19',
    jurisdiction: 'BIS',
    office: 'Washington, D.C.',
    pri: 'med',
  },
  {
    id: 'TAX-2026-00004',
    name: 'State tax controversy — Apollo',
    client: 'Apollo Biosciences',
    practice: 'Tax',
    partner: 'K. Alvarez',
    manager: 'Eleanor Wu',
    status: 'open',
    feeType: 'hourly',
    budget: 180000,
    wip: 54100,
    ar: 22400,
    opened: '2026-03-05',
    jurisdiction: 'CA DTA',
    office: 'San Francisco',
    pri: 'med',
  },
  {
    id: 'CORP-2026-0088',
    name: 'Q2 Corporate — Jensen & Co.',
    client: 'Jensen Family Trust',
    practice: 'Corporate',
    partner: 'J. Wilson',
    manager: '—',
    status: 'open',
    feeType: 'hourly',
    budget: 240000,
    wip: 88420,
    ar: 31500,
    opened: '2025-07-11',
    jurisdiction: 'Delaware',
    office: 'New York',
    pri: 'low',
  },
  {
    id: 'LIT-2026-00420',
    name: 'Data breach — Helios (2026 Q1)',
    client: 'Helios Corp.',
    practice: 'Cyber / Privacy',
    partner: 'Sarah Chen',
    manager: 'Eleanor Wu',
    status: 'open',
    feeType: 'hourly',
    budget: 1500000,
    wip: 360450,
    ar: 115000,
    opened: '2026-02-22',
    jurisdiction: 'Multi',
    office: 'San Francisco',
    pri: 'high',
    star: true,
  },
  {
    id: 'MA-2026-00024',
    name: 'Antitrust review — Helios/Orion',
    client: 'Helios Corp.',
    practice: 'Antitrust / M&A',
    partner: 'Priya Shah',
    manager: 'Marcus Orr',
    status: 'prospective',
    feeType: 'blended',
    budget: 520000,
    wip: 0,
    ar: 0,
    opened: '2026-04-05',
    jurisdiction: 'DOJ Antitrust',
    office: 'Washington, D.C.',
    pri: 'high',
  },
  {
    id: 'LIT-2024-00312',
    name: 'Kroll forensic — Jensen accounting',
    client: 'Jensen Family Trust',
    practice: 'Litigation Supp.',
    partner: 'J. Wilson',
    manager: 'Marcus Orr',
    status: 'closed',
    feeType: 'hourly',
    budget: 95000,
    wip: 0,
    ar: 0,
    opened: '2024-05-30',
    jurisdiction: 'N.Y. Cty.',
    office: 'New York',
    pri: 'low',
  },
];

// ---- Matter status badge ---------------------------------------------
const MatterStatus = ({ status }) => {
  const map = {
    open: { variant: 'success', label: 'Open' },
    on_hold: { variant: 'warn', label: 'On hold' },
    closed: { variant: 'neutral', label: 'Closed' },
    conflict: { variant: 'danger', label: 'Conflict check' },
    prospective: { variant: 'info', label: 'Prospective' },
  };
  const s = map[status] || map.open;
  return (
    <Badge variant={s.variant} dot>
      {s.label}
    </Badge>
  );
};

// ---- Budget utilization bar ------------------------------------------
const BudgetBar = ({ wip, budget }) => {
  const pct = budget > 0 ? Math.min(100, Math.round((wip / budget) * 100)) : 0;
  const color =
    pct >= 90
      ? 'var(--danger-500)'
      : pct >= 70
        ? 'var(--warn-500)'
        : 'var(--success-500)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: 'var(--n-100)',
          borderRadius: 3,
          overflow: 'hidden',
          minWidth: 60,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            transition: 'width 0.2s',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 'var(--fs-xs)',
          color: 'var(--fg-2)',
          fontVariantNumeric: 'tabular-nums',
          width: 32,
          textAlign: 'right',
        }}
      >
        {pct}%
      </span>
    </div>
  );
};

const PracticeBadge = ({ name }) => {
  // Hash practice name to a stable color family.
  const palettes = [
    { bg: '#ECE7D6', fg: '#6B5A2A' }, // warm tan
    { bg: '#DDE4E5', fg: '#2F5A66' }, // cool blue
    { bg: '#E5DED8', fg: '#6F4A35' }, // clay
    { bg: '#E0E4DB', fg: '#3F5A3E' }, // sage
    { bg: '#E8DCDE', fg: '#703545' }, // mauve
    { bg: '#E4E1DA', fg: '#4A453D' }, // stone
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const p = palettes[h % palettes.length];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 20,
        padding: '0 8px',
        borderRadius: 10,
        background: p.bg,
        color: p.fg,
        fontSize: 'var(--fs-xs)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </span>
  );
};

// ---- Sort header -----------------------------------------------------
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

const MatterGrid = ({ onOpen }) => {
  const [selected, setSelected] = React.useState(new Set());
  const [sort, setSort] = React.useState({ key: 'opened', dir: 'desc' });
  const [scope, setScope] = React.useState('all');
  const [activeFilters, setActiveFilters] = React.useState([
    { id: 'status', label: 'Status', value: 'Open, On hold' },
    { id: 'practice', label: 'Practice', value: 'Litigation, IP' },
  ]);

  const rows = React.useMemo(() => {
    const all =
      scope === 'mine'
        ? SAMPLE_MATTERS.filter(
            (m) => m.partner === 'K. Alvarez' || m.manager === 'Eleanor Wu',
          )
        : SAMPLE_MATTERS;
    return [...all].sort((a, b) => {
      const A = a[sort.key],
        B = b[sort.key];
      if (A === B) return 0;
      return (A < B ? -1 : 1) * (sort.dir === 'asc' ? 1 : -1);
    });
  }, [sort, scope]);

  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };
  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };
  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  const totalWip = rows.reduce((s, r) => s + (r.wip || 0), 0);
  const totalAr = rows.reduce((s, r) => s + (r.ar || 0), 0);

  return (
    <div className="x-grid-wrap">
      {/* Toolbar */}
      <div className="x-grid-toolbar">
        <Segmented
          value={scope}
          onChange={setScope}
          options={[
            { value: 'mine', label: 'My matters' },
            { value: 'all', label: 'All' },
          ]}
        />
        <Button variant="secondary" size="sm" icon="filter">
          Filter
        </Button>
        {activeFilters.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            value={f.value}
            active
            onRemove={() =>
              setActiveFilters((x) => x.filter((k) => k.id !== f.id))
            }
          />
        ))}
        <Button variant="ghost" size="sm" icon="plus">
          Add filter
        </Button>

        <div className="x-grid-toolbar__spacer" />

        <span className="x-grid-toolbar__count">
          {selected.size > 0 ? (
            <>
              {selected.size} selected · <a className="x-link">Clear</a>
            </>
          ) : (
            <>
              {rows.length} matters · WIP {fmtMoney(totalWip)} · AR{' '}
              {fmtMoney(totalAr)}
            </>
          )}
        </span>

        {selected.size > 0 ? (
          <>
            <Button variant="secondary" size="sm" icon="user">
              Reassign
            </Button>
            <Button variant="secondary" size="sm" icon="lock">
              Close
            </Button>
            <Button variant="ghost" size="sm" icon="more" />
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" icon="download">
              Export
            </Button>
            <Button variant="accent" size="sm" icon="plus">
              New matter
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="x-grid-scroll">
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
              <th style={{ width: 28 }}></th>
              <SortHeader
                label="Matter #"
                sortKey="id"
                sort={sort}
                setSort={setSort}
                width={150}
              />
              <SortHeader
                label="Name"
                sortKey="name"
                sort={sort}
                setSort={setSort}
              />
              <SortHeader
                label="Client"
                sortKey="client"
                sort={sort}
                setSort={setSort}
                width={200}
              />
              <SortHeader
                label="Practice"
                sortKey="practice"
                sort={sort}
                setSort={setSort}
                width={170}
              />
              <SortHeader
                label="Status"
                sortKey="status"
                sort={sort}
                setSort={setSort}
                width={140}
              />
              <SortHeader
                label="Partner"
                sortKey="partner"
                sort={sort}
                setSort={setSort}
                width={150}
              />
              <SortHeader
                label="Opened"
                sortKey="opened"
                sort={sort}
                setSort={setSort}
                width={110}
              />
              <SortHeader
                label="WIP"
                sortKey="wip"
                sort={sort}
                setSort={setSort}
                align="right"
                width={110}
              />
              <th style={{ width: 170 }}>Budget</th>
              <SortHeader
                label="AR"
                sortKey="ar"
                sort={sort}
                setSort={setSort}
                align="right"
                width={110}
              />
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
                  <Icon
                    name="star"
                    size={13}
                    style={{
                      color: r.star ? 'var(--warn-500)' : 'var(--fg-4)',
                      fill: r.star ? 'var(--warn-500)' : 'none',
                    }}
                  />
                </td>
                <td className="x-cell--mono">
                  <span style={{ color: 'var(--fg-accent)', fontWeight: 500 }}>
                    {r.id}
                  </span>
                </td>
                <td title={r.name} style={{ fontWeight: 500 }}>
                  {r.name}
                </td>
                <td style={{ color: 'var(--fg-2)' }} title={r.client}>
                  {r.client}
                </td>
                <td>
                  <PracticeBadge name={r.practice} />
                </td>
                <td>
                  <MatterStatus status={r.status} />
                </td>
                <td>
                  {r.partner === '—' ? (
                    <span style={{ color: 'var(--fg-4)' }}>Unassigned</span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Avatar name={r.partner} size="sm" />
                      <span>{r.partner}</span>
                    </span>
                  )}
                </td>
                <td style={{ color: 'var(--fg-2)' }}>{fmtDate(r.opened)}</td>
                <td className="x-cell--num" style={{ fontWeight: 500 }}>
                  {r.wip > 0 ? (
                    fmtMoney(r.wip)
                  ) : (
                    <span style={{ color: 'var(--fg-4)' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '0 12px' }}>
                  {r.budget > 0 ? (
                    <BudgetBar wip={r.wip} budget={r.budget} />
                  ) : (
                    <span style={{ color: 'var(--fg-4)' }}>—</span>
                  )}
                </td>
                <td
                  className="x-cell--num"
                  style={{ color: r.ar > 0 ? 'var(--fg-1)' : 'var(--fg-4)' }}
                >
                  {r.ar > 0 ? fmtMoney(r.ar) : '—'}
                </td>
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

      {/* Footer */}
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
        <span>
          Showing 1–{rows.length} of {SAMPLE_MATTERS.length}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconButton icon="chevronLeft" />
          <span style={{ padding: '0 8px' }}>
            Page <strong style={{ color: 'var(--fg-1)' }}>1</strong> of 1
          </span>
          <IconButton icon="chevronRight" />
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MatterGrid, MatterStatus, SAMPLE_MATTERS });
