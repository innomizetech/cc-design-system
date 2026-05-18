/* global React, Icon, Button, IconButton, Checkbox, Badge, Avatar, Chip, Segmented, fmtMoney, fmtDate, cls */

// ======================================================================
// VendorBillGrid — list of vendor bills with filtering/sort/selection
// ======================================================================

const SAMPLE_BILLS = [
  {
    id: 'VB-2026-00287',
    vendor: 'Morgan, Patel & Clark LLP',
    po: 'PO-2025-0812',
    period: 'Mar 2026',
    amount: 48210.0,
    received: '2026-04-02',
    due: '2026-04-17',
    status: 'under_review',
    lines: 14,
    rev: 2,
  },
  {
    id: 'VB-2026-00288',
    vendor: 'Kroll Associates',
    po: 'PO-2025-0840',
    period: 'Mar 2026',
    amount: 8940.5,
    received: '2026-04-04',
    due: '2026-04-19',
    status: 'under_review',
    lines: 6,
    rev: 1,
  },
  {
    id: 'VB-2026-00289',
    vendor: 'Dentons U.S. LLP',
    po: '—',
    period: 'Mar 2026',
    amount: 24620.0,
    received: '2026-04-05',
    due: '2026-04-20',
    status: 'exception',
    lines: 11,
    rev: 1,
  },
  {
    id: 'VB-2026-00290',
    vendor: 'Baker & Hostetler',
    po: 'PO-2025-0901',
    period: 'Q1 2026',
    amount: 112450.75,
    received: '2026-04-08',
    due: '2026-04-23',
    status: 'over_cap',
    lines: 33,
    rev: 3,
  },
  {
    id: 'VB-2026-00291',
    vendor: 'Skadden, Arps',
    po: 'PO-2026-0112',
    period: 'Mar 2026',
    amount: 298200.0,
    received: '2026-04-10',
    due: '2026-04-25',
    status: 'exception',
    lines: 58,
    rev: 4,
  },
  {
    id: 'VB-2026-00292',
    vendor: 'Cooley LLP',
    po: 'PO-2025-0788',
    period: 'Mar 2026',
    amount: 14210.0,
    received: '2026-04-11',
    due: '2026-04-26',
    status: 'processed',
    lines: 9,
    rev: 1,
  },
  {
    id: 'VB-2026-00293',
    vendor: 'Quinn Emanuel',
    po: 'PO-2026-0045',
    period: 'Mar 2026',
    amount: 186400.0,
    received: '2026-04-12',
    due: '2026-04-27',
    status: 'closed',
    lines: 42,
    rev: 2,
  },
  {
    id: 'VB-2026-00294',
    vendor: 'WilmerHale',
    po: '—',
    period: 'Mar 2026',
    amount: 32180.0,
    received: '2026-04-14',
    due: '2026-04-29',
    status: 'under_review',
    lines: 12,
    rev: 1,
  },
  {
    id: 'VB-2026-00295',
    vendor: 'Gibson, Dunn & Crutcher',
    po: 'PO-2026-0204',
    period: 'Mar 2026',
    amount: 241600.25,
    received: '2026-04-15',
    due: '2026-04-30',
    status: 'over_cap',
    lines: 64,
    rev: 1,
  },
  {
    id: 'VB-2026-00296',
    vendor: 'Paul Hastings LLP',
    po: 'PO-2025-0910',
    period: 'Mar 2026',
    amount: 27300.75,
    received: '2026-04-17',
    due: '2026-05-02',
    status: 'closed',
    lines: 15,
    rev: 2,
  },
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
  const s = map[status] || map.pending;
  return (
    <Badge variant={s.variant} dot>
      {s.label}
    </Badge>
  );
};

const VendorBillGrid = ({ onOpen }) => {
  const [selected, setSelected] = React.useState(new Set());
  const [tab, setTab] = React.useState('all');
  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };
  const rows =
    tab === 'all' ? SAMPLE_BILLS : SAMPLE_BILLS.filter((r) => r.status === tab);
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 0 }}>
        <div className="x-tabs" style={{ padding: 0, border: 'none' }}>
          {[
            { value: 'all', label: 'All', count: SAMPLE_BILLS.length },
            {
              value: 'under_review',
              label: 'Under Review',
              count: SAMPLE_BILLS.filter((r) => r.status === 'under_review')
                .length,
            },
            {
              value: 'exception',
              label: 'Exception',
              count: SAMPLE_BILLS.filter((r) => r.status === 'exception')
                .length,
            },
            {
              value: 'over_cap',
              label: 'Over the Cap',
              count: SAMPLE_BILLS.filter((r) => r.status === 'over_cap').length,
            },
            {
              value: 'processed',
              label: 'Processed',
              count: SAMPLE_BILLS.filter((r) => r.status === 'processed')
                .length,
            },
            {
              value: 'closed',
              label: 'Closed',
              count: SAMPLE_BILLS.filter((r) => r.status === 'closed').length,
            },
          ].map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              className="x-tab"
              onClick={() => setTab(t.value)}
            >
              {t.label}
              <span className="x-tab__count">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="x-grid-wrap">
        <div className="x-grid-toolbar">
          <div style={{ position: 'relative', width: 260 }}>
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--fg-3)',
                pointerEvents: 'none',
              }}
            >
              <Icon name="search" size={14} />
            </span>
            <input
              className="x-input"
              style={{ paddingLeft: 32, height: 30 }}
              placeholder="Search bills, vendors, PO…"
            />
          </div>
          <Button variant="secondary" size="sm" icon="filter">
            Filter
          </Button>
          <Chip label="Period" value="Mar 2026" active onRemove={() => {}} />
          <div className="x-grid-toolbar__spacer" />
          <span className="x-grid-toolbar__count">
            {selected.size > 0
              ? `${selected.size} selected`
              : `${rows.length} bills · ${fmtMoney(total)}`}
          </span>
          {selected.size > 0 ? (
            <>
              <Button variant="secondary" size="sm" icon="check">
                Approve
              </Button>
              <Button variant="secondary" size="sm" icon="x">
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" icon="download">
                Export
              </Button>
              <Button variant="accent" size="sm" icon="plus">
                New bill
              </Button>
            </>
          )}
        </div>

        <table className="x-grid">
          <thead>
            <tr>
              <th className="x-cell--checkbox">
                <Checkbox
                  checked={selected.size > 0 && selected.size === rows.length}
                  indeterminate={
                    selected.size > 0 && selected.size < rows.length
                  }
                  onChange={() =>
                    setSelected(
                      selected.size === rows.length
                        ? new Set()
                        : new Set(rows.map((r) => r.id)),
                    )
                  }
                />
              </th>
              <th style={{ width: 150 }}>Bill</th>
              <th>Vendor</th>
              <th style={{ width: 130 }}>PO</th>
              <th style={{ width: 110 }}>Period</th>
              <th style={{ width: 120 }}>Received</th>
              <th style={{ width: 120 }}>Due</th>
              <th style={{ width: 70, textAlign: 'right' }}>Lines</th>
              <th style={{ width: 60, textAlign: 'center' }}>Rev</th>
              <th style={{ width: 130 }}>Status</th>
              <th style={{ width: 130, textAlign: 'right' }}>Amount</th>
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
                <td className="x-cell--mono">
                  <span style={{ color: 'var(--fg-accent)', fontWeight: 500 }}>
                    {r.id}
                  </span>
                </td>
                <td title={r.vendor}>{r.vendor}</td>
                <td
                  className="x-cell--mono"
                  style={{
                    color: r.po === '—' ? 'var(--fg-4)' : 'var(--fg-2)',
                  }}
                >
                  {r.po}
                </td>
                <td style={{ color: 'var(--fg-2)' }}>{r.period}</td>
                <td style={{ color: 'var(--fg-2)' }}>{fmtDate(r.received)}</td>
                <td style={{ color: 'var(--fg-2)' }}>{fmtDate(r.due)}</td>
                <td className="x-cell--num">{r.lines}</td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      color: 'var(--fg-3)',
                      fontSize: 'var(--fs-xs)',
                    }}
                  >
                    <Icon name="history" size={10} />v{r.rev}
                  </span>
                </td>
                <td>
                  <BillStatus status={r.status} />
                </td>
                <td className="x-cell--num" style={{ fontWeight: 500 }}>
                  {fmtMoney(r.amount)}
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
            Showing 1–{rows.length} of {SAMPLE_BILLS.length}
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
    </div>
  );
};

Object.assign(window, { VendorBillGrid, SAMPLE_BILLS, BillStatus });
