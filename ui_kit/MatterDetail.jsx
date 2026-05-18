/* global React, Icon, Button, IconButton, Badge, Avatar, Tabs, MatterStatus, PageNav, fmtMoney, fmtDate, fmtDateTime, cls */

// ======================================================================
// MatterDetail — two-column CRM-style detail.
//
//   Slim header: matter glyph + name + star      prev/next · share · PDF · Reports · New time entry
//
//   LEFT  (scrolls with page)
//     Tabs: Overview | Activity | Team | Time | Invoices | Bills | Documents | Tasks
//     Overview:
//       Highlights  — WIP, AR, Budget utilization, Realization (4 KPI cards)
//       Deadlines   — upcoming items with date chip + assignee
//       Activity    — recent feed (submit / approve / doc upload / comment)
//       Invoices    — last N invoices on matter (mini grid)
//       Notes       — short feed of updates
//
//   RIGHT (sticky under topbar)
//     Tabs: Details | Comments
//     Collapsible sections:
//       Matter Information  — id, name, client, type, practice, partner, manager,
//                             opened, status, jurisdiction, office
//       Fee Arrangement     — fee type, rate card, budget, alert threshold, retainer
//       People              — responsible partner, matter manager, billing attorney,
//                             client contact, opposing counsel
//       Compliance          — conflict check, engagement letter, NDA, E&O check
//       Tags / Lists
// ======================================================================

// ---------- Shared row / section primitives (local, matches V2 style) -
const SectionHeader = ({ icon, label, expanded, onToggle, actions }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '14px 0 8px',
      cursor: onToggle ? 'pointer' : undefined,
      userSelect: 'none',
    }}
    onClick={onToggle}
  >
    {onToggle && (
      <Icon
        name="caretDown"
        size={12}
        style={{
          color: 'var(--fg-3)',
          transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.12s ease',
        }}
      />
    )}
    {icon && <Icon name={icon} size={14} style={{ color: 'var(--fg-2)' }} />}
    <span
      style={{
        fontSize: 'var(--fs-sm)',
        fontWeight: 600,
        color: 'var(--fg-1)',
      }}
    >
      {label}
    </span>
    <div style={{ flex: 1 }} />
    {actions}
  </div>
);

const Row = ({ icon, label, children, truncate = true }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      alignItems: 'center',
      gap: 12,
      padding: '6px 0',
      fontSize: 'var(--fs-sm)',
      minHeight: 28,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--fg-3)',
      }}
    >
      {icon && (
        <Icon
          name={icon}
          size={13}
          style={{ color: 'var(--fg-4)', flex: 'none' }}
        />
      )}
      <span>{label}</span>
    </div>
    <div
      style={{
        color: 'var(--fg-1)',
        minWidth: 0,
        ...(truncate
          ? {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          : {}),
      }}
    >
      {children}
    </div>
  </div>
);

const TabRow = ({ value, onChange, items }) => (
  <div
    style={{
      display: 'flex',
      gap: 0,
      overflowX: 'auto',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 16px',
    }}
  >
    {items.map((t) => {
      const active = value === t.value;
      return (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '12px 10px',
            marginBottom: -1,
            fontSize: 'var(--fs-md)',
            fontWeight: active ? 500 : 400,
            color: active ? 'var(--a-700)' : 'var(--fg-2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: `2px solid ${active ? 'var(--a-500)' : 'transparent'}`,
            background: active ? 'var(--bg-selected)' : 'transparent',
            borderTopLeftRadius: active ? 6 : 0,
            borderTopRightRadius: active ? 6 : 0,
            whiteSpace: 'nowrap',
          }}
        >
          {t.icon && <Icon name={t.icon} size={14} />}
          <span>{t.label}</span>
          {t.count != null && (
            <span
              style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 10,
                background: active ? 'var(--a-100)' : 'var(--n-100)',
                color: active ? 'var(--a-700)' : 'var(--fg-2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {t.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ---------- KPI tile (compact) --------------------------------------
const Kpi = ({ label, value, sub, tone }) => {
  const toneColor =
    tone === 'danger'
      ? 'var(--danger-700)'
      : tone === 'warn'
        ? 'var(--warn-700)'
        : tone === 'success'
          ? 'var(--success-700)'
          : 'var(--fg-1)';
  return (
    <div
      style={{
        flex: '1 1 180px',
        minWidth: 160,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)',
          color: 'var(--fg-3)',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-2xl)',
          marginTop: 4,
          color: toneColor,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--fg-3)',
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

// ---------- Sample data scoped to matter detail ---------------------
const DEADLINES = [
  {
    date: '2026-04-25',
    label: 'Response brief due',
    assignee: 'K. Alvarez',
    kind: 'filing',
  },
  {
    date: '2026-05-02',
    label: 'Expert designation deadline',
    assignee: 'J. Bhatt',
    kind: 'filing',
  },
  {
    date: '2026-05-14',
    label: 'Mediation — San Francisco',
    assignee: 'K. Alvarez',
    kind: 'meeting',
  },
  {
    date: '2026-06-03',
    label: 'Discovery cutoff',
    assignee: 'M. Chen',
    kind: 'filing',
  },
];

const ACTIVITY = [
  {
    who: 'K. Alvarez',
    what: 'logged ',
    target: '2.4 hrs · Review complaint',
    when: '2 hrs ago',
    avatar: 'KA',
    icon: 'clock',
  },
  {
    who: 'Eleanor Wu',
    what: 'approved ',
    target: 'Invoice INV-2026-00418',
    when: '1 day ago',
    avatar: 'EW',
    icon: 'check',
  },
  {
    who: 'K. Alvarez',
    what: 'uploaded ',
    target: 'Response_Draft_v3.docx',
    when: '2 days ago',
    avatar: 'KA',
    icon: 'upload',
  },
  {
    who: 'Marcus Orr',
    what: 'added note on ',
    target: 'Budget variance',
    when: '3 days ago',
    avatar: 'MO',
    icon: 'comment',
  },
  {
    who: 'System',
    what: 'flagged ',
    target: 'rate mismatch on bill v1',
    when: '6 days ago',
    avatar: 'SY',
    icon: 'alertCircle',
  },
];

const RECENT_INVOICES = [
  {
    id: 'INV-2026-00418',
    vendor: '—',
    period: 'Apr 1–15',
    amount: 142880.0,
    status: 'in_review',
  },
  {
    id: 'INV-2026-00410',
    vendor: '—',
    period: 'Mar 1–31',
    amount: 128350.0,
    status: 'approved',
  },
  {
    id: 'INV-2026-00392',
    vendor: '—',
    period: 'Feb 1–28',
    amount: 94620.0,
    status: 'paid',
  },
];

const NOTES = [
  {
    who: 'Eleanor Wu',
    title: 'Budget check-in',
    body: '70% utilization. Flagged partner — expecting $240k remaining work.',
    when: '1 day ago',
    avatar: 'EW',
  },
  {
    who: 'K. Alvarez',
    title: 'Strategy call',
    body: 'Discussed mediation tactics; client prefers early resolution.',
    when: '4 days ago',
    avatar: 'KA',
  },
  {
    who: 'Marcus Orr',
    title: 'Opposing counsel',
    body: 'Kirkland confirmed receipt of our discovery requests.',
    when: '9 days ago',
    avatar: 'MO',
  },
];

const TEAM = [
  {
    name: 'K. Alvarez',
    role: 'Responsible partner',
    rate: 1250,
    hrs: 48.2,
    you: false,
  },
  {
    name: 'Eleanor Wu',
    role: 'Matter manager',
    rate: 980,
    hrs: 22.1,
    you: true,
  },
  { name: 'J. Bhatt', role: 'Associate', rate: 780, hrs: 68.5, you: false },
  { name: 'S. Okonkwo', role: 'Associate', rate: 720, hrs: 32.0, you: false },
  { name: 'M. Chen', role: 'Paralegal', rate: 320, hrs: 84.0, you: false },
];

// ---------- Helper badges -------------------------------------------
const FeeTypeBadge = ({ type }) => {
  const map = {
    hourly: { label: 'Hourly', variant: 'neutral' },
    flat: { label: 'Flat fee', variant: 'info' },
    contingent: { label: 'Contingent', variant: 'warn' },
    capped: { label: 'Capped', variant: 'warn' },
    blended: { label: 'Blended', variant: 'info' },
  };
  const s = map[type] || map.hourly;
  return <Badge variant={s.variant}>{s.label}</Badge>;
};

const DeadlineIcon = ({ kind }) => {
  const style =
    kind === 'meeting'
      ? { bg: 'var(--info-50)', fg: 'var(--info-700)' }
      : { bg: 'var(--warn-50)', fg: 'var(--warn-700)' };
  const icon = kind === 'meeting' ? 'users' : 'scales';
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-sm)',
        background: style.bg,
        color: style.fg,
        display: 'grid',
        placeItems: 'center',
        flex: 'none',
      }}
    >
      <Icon name={icon} size={14} />
    </div>
  );
};

// ---------- Main ----------------------------------------------------
const MatterDetail = ({
  matter,
  breadcrumbs,
  onBack,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => {
  const [leftTab, setLeftTab] = React.useState('overview');
  const [rightTab, setRightTab] = React.useState('details');
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState({
    matter: true,
    fee: true,
    people: true,
    compliance: true,
    tags: true,
  });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const glyph = (matter.id || '').slice(0, 2);
  const budgetPct =
    matter.budget > 0 ? Math.round((matter.wip / matter.budget) * 100) : 0;
  const realization = 0.86; // fake: billed / worked

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Header with breadcrumbs */}
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x) var(--sp-section)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-group)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        {breadcrumbs && <PageNav onBack={onBack} crumbs={breadcrumbs} />}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-group)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--n-800)',
              color: 'white',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 13,
              flex: 'none',
            }}
          >
            {glyph}
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-xl)',
                  color: 'var(--fg-1)',
                  fontWeight: 500,
                }}
              >
                {matter.name}
              </span>
              <Icon
                name="star"
                size={14}
                style={{
                  color: matter.star ? 'var(--warn-500)' : 'var(--fg-4)',
                  fill: matter.star ? 'var(--warn-500)' : 'none',
                  cursor: 'pointer',
                }}
              />
              <MatterStatus status={matter.status} />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 2,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--fg-accent)',
                  fontWeight: 500,
                }}
              >
                {matter.id}
              </span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                ·
              </span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                {matter.client}
              </span>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div className="x-nav-arrows" title="Previous / next matter">
            <button onClick={onPrev} disabled={!hasPrev}>
              <Icon name="chevronLeft" size={14} />
            </button>
            <button onClick={onNext} disabled={!hasNext}>
              <Icon name="chevronRight" size={14} />
            </button>
          </div>
          <IconButton icon="link" title="Copy link" />
          <IconButton icon="paperclip" title="Open folder" />
          <Button variant="secondary" size="sm" icon="report">
            Reports
          </Button>
          <Button variant="accent" size="sm" icon="plus">
            Time entry
          </Button>
        </div>
      </div>

      {/* Two-column split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: rightCollapsed
            ? 'minmax(0, 1fr) 48px'
            : 'minmax(0, 1fr) 420px',
          alignItems: 'stretch',
          flex: 1,
        }}
      >
        {/* ============ LEFT column ============ */}
        <div
          style={{ borderRight: '1px solid var(--border-subtle)', minWidth: 0 }}
        >
          <div
            style={{
              padding: '0 var(--sp-page-x)',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Tabs
              value={leftTab}
              onChange={setLeftTab}
              items={[
                { value: 'overview', label: 'Overview', icon: 'dashboard' },
                { value: 'activity', label: 'Activity', icon: 'history' },
                {
                  value: 'team',
                  label: 'Team',
                  icon: 'users',
                  count: TEAM.length,
                },
                {
                  value: 'invoices',
                  label: 'Financials',
                  icon: 'invoice',
                  count: RECENT_INVOICES.length + 2,
                },
                { value: 'docs', label: 'Files', icon: 'paperclip', count: 17 },
              ]}
            />
            <div style={{ flex: 1 }} />
          </div>

          <div
            style={{
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {leftTab === 'overview' && (
              <>
                {/* Highlights */}
                <div>
                  <SectionHeader icon="grid" label="Highlights" />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <Kpi
                      label="WIP"
                      value={fmtMoney(matter.wip)}
                      sub={`${budgetPct}% of budget`}
                      tone={
                        budgetPct >= 90
                          ? 'danger'
                          : budgetPct >= 70
                            ? 'warn'
                            : 'success'
                      }
                    />
                    <Kpi
                      label="Accounts receivable"
                      value={fmtMoney(matter.ar)}
                      sub="Oldest: 34 days"
                      tone={matter.ar > 50000 ? 'warn' : undefined}
                    />
                    <Kpi
                      label="Budget"
                      value={fmtMoney(matter.budget)}
                      sub={`${fmtMoney(matter.budget - matter.wip)} remaining`}
                    />
                    <Kpi
                      label="Realization"
                      value={`${Math.round(realization * 100)}%`}
                      sub="Billed vs. worked (90-day)"
                      tone={realization < 0.85 ? 'warn' : 'success'}
                    />
                  </div>
                </div>

                {/* Deadlines */}
                <div>
                  <SectionHeader
                    icon="calendar"
                    label="Deadlines"
                    actions={<IconButton icon="plus" title="Add deadline" />}
                  />
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      overflow: 'hidden',
                    }}
                  >
                    {DEADLINES.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 14px',
                          borderBottom:
                            i < DEADLINES.length - 1
                              ? '1px solid var(--border-subtle)'
                              : 'none',
                        }}
                      >
                        <DeadlineIcon kind={d.kind} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 'var(--fs-sm)',
                              fontWeight: 500,
                            }}
                          >
                            {d.label}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--fs-xs)',
                              color: 'var(--fg-3)',
                            }}
                          >
                            {d.assignee}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-2)',
                            fontVariantNumeric: 'tabular-nums',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {fmtDate(d.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <SectionHeader icon="history" label="Activity" />
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      padding: '8px 14px',
                    }}
                  >
                    {ACTIVITY.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 0',
                          borderBottom:
                            i < ACTIVITY.length - 1
                              ? '1px solid var(--border-subtle)'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: 'var(--n-100)',
                            color: 'var(--fg-2)',
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                          }}
                        >
                          <Icon name={a.icon} size={13} />
                        </div>
                        <div
                          style={{
                            flex: 1,
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                            minWidth: 0,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>{a.who}</span>
                          <span style={{ color: 'var(--fg-3)' }}>
                            {' '}
                            {a.what}
                          </span>
                          <span style={{ fontWeight: 500 }}>{a.target}</span>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {a.when}
                        </span>
                      </div>
                    ))}
                    <button
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 0 4px',
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--a-600)',
                      }}
                    >
                      View all
                    </button>
                  </div>
                </div>

                {/* Recent invoices */}
                <div>
                  <SectionHeader
                    icon="invoice"
                    label="Recent invoices"
                    actions={
                      <Button
                        variant="ghost"
                        size="sm"
                        iconRight="chevronRight"
                      >
                        See all
                      </Button>
                    }
                  />
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      overflow: 'hidden',
                    }}
                  >
                    {RECENT_INVOICES.map((inv, i) => {
                      const statusColor =
                        inv.status === 'paid'
                          ? 'var(--success-700)'
                          : inv.status === 'approved'
                            ? 'var(--info-700)'
                            : 'var(--warn-700)';
                      const statusBg =
                        inv.status === 'paid'
                          ? 'var(--success-50)'
                          : inv.status === 'approved'
                            ? 'var(--info-50)'
                            : 'var(--warn-50)';
                      const statusLabel =
                        inv.status === 'paid'
                          ? 'Paid'
                          : inv.status === 'approved'
                            ? 'Approved'
                            : 'In review';
                      return (
                        <div
                          key={inv.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '140px 1fr 120px 100px',
                            alignItems: 'center',
                            gap: 16,
                            padding: '10px 14px',
                            borderBottom:
                              i < RECENT_INVOICES.length - 1
                                ? '1px solid var(--border-subtle)'
                                : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            className="x-mono"
                            style={{
                              color: 'var(--a-600)',
                              fontSize: 'var(--fs-sm)',
                            }}
                          >
                            {inv.id}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--fs-sm)',
                              color: 'var(--fg-2)',
                            }}
                          >
                            Period {inv.period}
                          </span>
                          <span
                            style={{
                              justifySelf: 'start',
                              padding: '2px 8px',
                              borderRadius: 10,
                              fontSize: 'var(--fs-xs)',
                              background: statusBg,
                              color: statusColor,
                              fontWeight: 500,
                            }}
                          >
                            {statusLabel}
                          </span>
                          <span
                            className="x-num"
                            style={{ textAlign: 'right', fontWeight: 500 }}
                          >
                            {fmtMoney(inv.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <SectionHeader
                    icon="comment"
                    label="Notes"
                    actions={<IconButton icon="plus" title="Add note" />}
                  />
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      padding: '4px 14px',
                    }}
                  >
                    {NOTES.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '12px 0',
                          borderBottom:
                            i < NOTES.length - 1
                              ? '1px solid var(--border-subtle)'
                              : 'none',
                        }}
                      >
                        <Avatar name={n.who} size="sm" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: 8,
                              fontSize: 'var(--fs-sm)',
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>{n.title}</span>
                            <span
                              style={{
                                color: 'var(--fg-3)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {n.body}
                            </span>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {n.when}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {leftTab === 'team' && (
              <div
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  overflow: 'hidden',
                }}
              >
                {TEAM.map((m, i) => (
                  <div
                    key={m.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr 140px 80px 100px',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderBottom:
                        i < TEAM.length - 1
                          ? '1px solid var(--border-subtle)'
                          : 'none',
                    }}
                  >
                    <Avatar name={m.name} size="sm" />
                    <div>
                      <div
                        style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}
                      >
                        {m.name}
                        {m.you && (
                          <span
                            style={{ color: 'var(--fg-3)', fontWeight: 400 }}
                          >
                            {' '}
                            · you
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                        }}
                      >
                        {m.role}
                      </div>
                    </div>
                    <span
                      style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}
                    >
                      {fmtMoney(m.rate)}/hr
                    </span>
                    <span
                      className="x-num"
                      style={{ fontSize: 'var(--fs-sm)', textAlign: 'right' }}
                    >
                      {m.hrs.toFixed(1)}h
                    </span>
                    <IconButton icon="more" />
                  </div>
                ))}
              </div>
            )}

            {!['overview', 'team'].includes(leftTab) && (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  color: 'var(--fg-3)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {leftTab === 'activity' && 'Full activity feed appears here.'}
                {leftTab === 'time' &&
                  'Time entries for this matter appear here.'}
                {leftTab === 'invoices' &&
                  'All invoices on this matter appear here.'}
                {leftTab === 'bills' &&
                  'Vendor bills on this matter appear here.'}
                {leftTab === 'docs' &&
                  'Matter documents / file tree appears here.'}
                {leftTab === 'tasks' && 'Tasks and deadlines appear here.'}
              </div>
            )}
          </div>
        </div>

        {/* ============ RIGHT column ============ */}
        {rightCollapsed ? (
          <div
            className="ps-strip"
            style={{ borderLeft: '1px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              className="ps-strip__btn"
              onClick={() => {
                setRightTab('details');
                setRightCollapsed(false);
              }}
              title="Details"
            >
              <Icon name="invoice" size={16} />
            </button>
            <button
              type="button"
              className="ps-strip__btn"
              onClick={() => {
                setRightTab('comments');
                setRightCollapsed(false);
              }}
              title="Comments"
            >
              <Icon name="comment" size={16} />
              <span className="ps-strip__count">5</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              background: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'calc(100vh - var(--topbar-h) - 200px)',
            }}
          >
            <div
              style={{
                padding: '0 var(--sp-group)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tabs
                value={rightTab}
                onChange={setRightTab}
                items={[
                  { value: 'details', label: 'Details', icon: 'invoice' },
                  {
                    value: 'comments',
                    label: 'Comments',
                    icon: 'comment',
                    count: 5,
                  },
                ]}
              />
              <div style={{ flex: 1 }} />
              <button
                type="button"
                className="ps-side-col__collapse-btn"
                onClick={() => setRightCollapsed(true)}
                title="Collapse"
              >
                <Icon name="panelClose" size={14} />
              </button>
            </div>

            <div style={{ padding: '8px 20px 24px' }}>
              {rightTab === 'details' && (
                <>
                  {/* Matter information */}
                  <SectionHeader
                    icon="matter"
                    label="Matter Information"
                    expanded={open.matter}
                    onToggle={() => toggle('matter')}
                  />
                  {open.matter && (
                    <div>
                      <Row icon="matter" label="Matter #">
                        <span
                          className="x-mono"
                          style={{ color: 'var(--a-600)' }}
                        >
                          {matter.id}
                        </span>
                      </Row>
                      <Row icon="briefcase" label="Name" truncate={false}>
                        <span style={{ whiteSpace: 'normal' }}>
                          {matter.name}
                        </span>
                      </Row>
                      <Row icon="building" label="Client">
                        {matter.client}
                      </Row>
                      <Row icon="scales" label="Practice">
                        {matter.practice}
                      </Row>
                      <Row icon="workflow" label="Status">
                        <MatterStatus status={matter.status} />
                      </Row>
                      <Row icon="calendar" label="Opened">
                        {fmtDate(matter.opened)}
                      </Row>
                      <Row icon="folder" label="Jurisdiction">
                        {matter.jurisdiction}
                      </Row>
                      <Row icon="building" label="Office">
                        {matter.office}
                      </Row>
                      <Row icon="flag" label="Priority">
                        <Badge
                          variant={
                            matter.pri === 'high'
                              ? 'danger'
                              : matter.pri === 'med'
                                ? 'warn'
                                : 'neutral'
                          }
                        >
                          {matter.pri === 'high'
                            ? 'High'
                            : matter.pri === 'med'
                              ? 'Medium'
                              : 'Low'}
                        </Badge>
                      </Row>
                    </div>
                  )}

                  {/* Fee arrangement */}
                  <div
                    style={{
                      marginTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 4,
                    }}
                  >
                    <SectionHeader
                      icon="dollar"
                      label="Fee Arrangement"
                      expanded={open.fee}
                      onToggle={() => toggle('fee')}
                    />
                    {open.fee && (
                      <div>
                        <Row icon="dollar" label="Fee type">
                          <FeeTypeBadge type={matter.feeType} />
                        </Row>
                        <Row icon="list" label="Rate card">
                          Standard 2026 ·{' '}
                          <span style={{ color: 'var(--fg-3)' }}>v4.12</span>
                        </Row>
                        <Row icon="dollar" label="Budget">
                          <span className="x-num">
                            {fmtMoney(matter.budget)}
                          </span>
                        </Row>
                        <Row icon="alertCircle" label="Budget alert">
                          80% threshold ·{' '}
                          <span style={{ color: 'var(--fg-3)' }}>on</span>
                        </Row>
                        <Row icon="dollar" label="Retainer">
                          <span
                            className="x-num"
                            style={{
                              color:
                                matter.wip > 150000
                                  ? 'var(--warn-700)'
                                  : 'var(--fg-1)',
                            }}
                          >
                            {fmtMoney(150000)}
                          </span>
                        </Row>
                        <Row icon="clock" label="Realization">
                          <span className="x-num">
                            {Math.round(realization * 100)}%
                          </span>
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* People */}
                  <div
                    style={{
                      marginTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 4,
                    }}
                  >
                    <SectionHeader
                      icon="users"
                      label="People"
                      expanded={open.people}
                      onToggle={() => toggle('people')}
                    />
                    {open.people && (
                      <div>
                        <Row icon="user" label="Responsible partner">
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Avatar name={matter.partner} size="sm" />
                            <span>{matter.partner}</span>
                          </span>
                        </Row>
                        <Row icon="user" label="Matter manager">
                          {matter.manager === '—' ? (
                            <span style={{ color: 'var(--fg-4)' }}>
                              Unassigned
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <Avatar name={matter.manager} size="sm" />
                              <span>{matter.manager}</span>
                            </span>
                          )}
                        </Row>
                        <Row icon="user" label="Billing attorney">
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Avatar name={matter.partner} size="sm" />
                            <span>{matter.partner}</span>
                          </span>
                        </Row>
                        <Row icon="building" label="Client contact">
                          General Counsel — Jordan Lee
                        </Row>
                        <Row icon="scales" label="Opposing counsel">
                          Kirkland & Ellis LLP
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Compliance */}
                  <div
                    style={{
                      marginTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 4,
                    }}
                  >
                    <SectionHeader
                      icon="lock"
                      label="Compliance"
                      expanded={open.compliance}
                      onToggle={() => toggle('compliance')}
                    />
                    {open.compliance && (
                      <div>
                        <Row icon="checkCircle" label="Conflict check">
                          <Badge variant="success">Cleared · 2025-06-10</Badge>
                        </Row>
                        <Row icon="paperclip" label="Engagement letter">
                          <span className="x-link">EL_2025_Acme.pdf</span>
                        </Row>
                        <Row icon="paperclip" label="NDA">
                          <span className="x-link">NDA_2025_Acme.pdf</span>
                        </Row>
                        <Row icon="checkCircle" label="E&O insurance">
                          <Badge variant="success">Current</Badge>
                        </Row>
                        <Row icon="alertCircle" label="Matter review">
                          <span style={{ color: 'var(--warn-700)' }}>
                            Due for quarterly review
                          </span>
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Tags / Lists */}
                  <div
                    style={{
                      marginTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 4,
                    }}
                  >
                    <SectionHeader
                      label="Tags & Lists"
                      expanded={open.tags}
                      onToggle={() => toggle('tags')}
                      actions={
                        <button
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            all: 'unset',
                            cursor: 'pointer',
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-2)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Icon name="plus" size={12} /> Add
                        </button>
                      }
                    />
                    {open.tags && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          flexWrap: 'wrap',
                          padding: '4px 0 12px',
                        }}
                      >
                        <Badge variant="neutral">Key client</Badge>
                        {matter.pri === 'high' && (
                          <Badge variant="danger">High priority</Badge>
                        )}
                        {matter.status === 'open' && (
                          <Badge variant="success">Active</Badge>
                        )}
                        <Badge variant="outline">Strategic</Badge>
                      </div>
                    )}
                  </div>
                </>
              )}

              {rightTab === 'comments' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    paddingTop: 12,
                  }}
                >
                  {NOTES.map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10 }}>
                      <Avatar name={n.who} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 'var(--fs-sm)',
                              fontWeight: 500,
                            }}
                          >
                            {n.who}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--fs-xs)',
                              color: 'var(--fg-3)',
                            }}
                          >
                            {n.when}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                            marginTop: 2,
                            lineHeight: 1.5,
                          }}
                        >
                          {n.body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { MatterDetail });
