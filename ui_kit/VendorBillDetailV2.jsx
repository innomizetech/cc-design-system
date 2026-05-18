/* global React, Icon, Button, IconButton, Badge, Avatar, BillStatus, PageNav, fmtMoney, fmtDate, fmtDateTime, cls */

// ======================================================================
// VendorBillDetailV2 — Attio/CRM-style two-column detail layout.
//
//   Header (slim):   icon + id/vendor + star           link · pdf · check · Reports
//   Body (split):
//     LEFT  — Overview | Activity | Lines | Docs        (tabs)
//             Highlights    (small KPI cards row)
//             Activity      (list + Today/Week/Month/Year)
//             Comments      (recent 3 + View all)
//     RIGHT — Details | Comments                         (tabs)
//             Bill details  (collapsible, icon + label + value rows)
//             Audit         (collapsible, metadata rows)
//             Lists         (collapsible, empty state)
//
// The whole thing lives inside the normal x-main window scroll. The right
// column sticks under the topbar so it stays visible while the left scrolls.
// ======================================================================

// Helpers ---------------------------------------------------------------
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

const Row = ({ icon, label, children }) => (
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
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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

// Highlight cards ------------------------------------------------------
const HighlightCard = ({ title, children, actions }) => (
  <div
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 12,
      minWidth: 240,
      flex: '1 1 240px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <span
        style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: 600,
          color: 'var(--fg-1)',
        }}
      >
        {title}
      </span>
      <div style={{ flex: 1 }} />
      {actions || <IconButton icon="more" />}
    </div>
    {children}
  </div>
);

// Sample data scoped to V2 example -------------------------------------
const V2_ACTIVITY = [
  {
    who: 'Eleanor Wu',
    what: 'moved the bill to ',
    target: 'Partner approval',
    when: '1 day ago',
    avatar: 'EW',
  },
  {
    who: 'K. Alvarez',
    what: 'submitted revision ',
    target: 'v2',
    when: '3 days ago',
    avatar: 'KA',
  },
  {
    who: 'Marcus Orr',
    what: 'rejected ',
    target: 'v1',
    when: '6 days ago',
    avatar: 'MO',
  },
];

const V2_NOTES = [
  {
    who: 'Eleanor Wu',
    title: 'Rate review',
    body: 'Paralegal rate aligned with engagement letter.',
    when: '1 day ago',
    avatar: 'EW',
  },
  {
    who: 'Marcus Orr',
    title: 'Policy flag',
    body: 'Block billing on line 2 resolved in v2.',
    when: '6 days ago',
    avatar: 'MO',
  },
  {
    who: 'K. Alvarez',
    title: 'Cover note',
    body: 'Submitted v1 — happy to walk through on a call.',
    when: '12 days ago',
    avatar: 'KA',
  },
];

// Main component -------------------------------------------------------
const VendorBillDetailV2 = ({
  bill,
  breadcrumbs,
  onBack,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
  onSwitchLayout,
}) => {
  const [leftTab, setLeftTab] = React.useState('overview');
  const [rightTab, setRightTab] = React.useState('details');
  const [range, setRange] = React.useState('today');
  const [open, setOpen] = React.useState({
    details: true,
    audit: true,
    lists: true,
  });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

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
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--a-500)',
              color: 'white',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 14,
              flex: 'none',
            }}
          >
            {(bill.vendor || 'V').slice(0, 1).toUpperCase()}
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
                {bill.vendor}
              </span>
              <Icon
                name="flag"
                size={14}
                style={{ color: 'var(--warn-500)' }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--fg-3)',
              }}
            >
              {bill.id}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <div className="x-nav-arrows" title="Previous / next bill">
            <button onClick={onPrev} disabled={!hasPrev} title="Previous bill">
              <Icon name="chevronLeft" size={14} />
            </button>
            <button onClick={onNext} disabled={!hasNext} title="Next bill">
              <Icon name="chevronRight" size={14} />
            </button>
          </div>
          <IconButton icon="link" title="Copy link" />
          <IconButton icon="invoice" title="Open PDF" />
          <IconButton icon="check" title="Tasks" />
          <Button variant="secondary" size="sm" icon="report">
            Reports
          </Button>
          {onSwitchLayout && (
            <Button
              variant="ghost"
              size="sm"
              icon="sidebar"
              onClick={onSwitchLayout}
              title="Switch to stacked layout"
            >
              Stacked
            </Button>
          )}
        </div>
      </div>

      {/* Two-column split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 460px',
          alignItems: 'flex-start',
          minHeight: 0,
        }}
      >
        {/* ========== LEFT column ========== */}
        <div
          style={{ borderRight: '1px solid var(--border-subtle)', minWidth: 0 }}
        >
          <TabRow
            value={leftTab}
            onChange={setLeftTab}
            items={[
              { value: 'overview', label: 'Overview', icon: 'dashboard' },
              { value: 'activity', label: 'Activity', icon: 'history' },
              { value: 'lines', label: 'Lines', icon: 'list', count: 7 },
              { value: 'docs', label: 'Files', icon: 'paperclip', count: 4 },
            ]}
          />

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
                    <HighlightCard title="Status">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <BillStatus status={bill.status} />
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-2)',
                          }}
                        >
                          <Icon
                            name="user"
                            size={13}
                            style={{ color: 'var(--fg-4)' }}
                          />
                          <span>Eleanor Wu</span>
                        </div>
                      </div>
                    </HighlightCard>
                    <HighlightCard title="Payment schedule">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          fontSize: 'var(--fs-sm)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: 'var(--fg-2)',
                          }}
                        >
                          <Icon
                            name="calendar"
                            size={13}
                            style={{ color: 'var(--fg-4)' }}
                          />
                          <span>Due {fmtDate(bill.due)}</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: 'var(--fg-2)',
                          }}
                        >
                          <Icon
                            name="dollar"
                            size={13}
                            style={{ color: 'var(--fg-4)' }}
                          />
                          <span className="x-num">{fmtMoney(bill.amount)}</span>
                        </div>
                        <Badge variant="warn">Schedules in 8 days</Badge>
                      </div>
                    </HighlightCard>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <SectionHeader
                    icon="history"
                    label="Activity"
                    actions={
                      <div
                        style={{
                          display: 'inline-flex',
                          gap: 2,
                          background: 'var(--n-100)',
                          padding: 2,
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {['today', 'week', 'month', 'year'].map((v) => (
                          <button
                            key={v}
                            onClick={(e) => {
                              e.stopPropagation();
                              setRange(v);
                            }}
                            style={{
                              all: 'unset',
                              cursor: 'pointer',
                              padding: '3px 10px',
                              borderRadius: 3,
                              fontSize: 'var(--fs-xs)',
                              fontWeight: 500,
                              color:
                                range === v ? 'var(--fg-1)' : 'var(--fg-3)',
                              background:
                                range === v
                                  ? 'var(--bg-surface)'
                                  : 'transparent',
                              boxShadow:
                                range === v
                                  ? '0 0 0 1px var(--border-subtle)'
                                  : 'none',
                              textTransform: 'capitalize',
                            }}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    }
                  />
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      padding: '8px 14px',
                    }}
                  >
                    {V2_ACTIVITY.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 0',
                          borderBottom:
                            i < V2_ACTIVITY.length - 1
                              ? '1px solid var(--border-subtle)'
                              : 'none',
                        }}
                      >
                        <Avatar name={a.who} size="sm" />
                        <div
                          style={{
                            flex: 1,
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
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

                {/* Notes / Comments summary */}
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
                    {V2_NOTES.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '12px 0',
                          borderBottom:
                            i < V2_NOTES.length - 1
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
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
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
                    <button
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '8px 0',
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--a-600)',
                      }}
                    >
                      View all
                    </button>
                  </div>
                </div>
              </>
            )}

            {leftTab !== 'overview' && (
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
                {leftTab === 'lines' &&
                  'Lines table — see Lines tab in V1 layout.'}
                {leftTab === 'docs' && 'Files / attachments list appears here.'}
              </div>
            )}
          </div>
        </div>

        {/* ========== RIGHT column ========== */}
        <div
          style={{
            background: 'var(--bg-surface)',
            position: 'sticky',
            top: 96,
            alignSelf: 'flex-start',
          }}
        >
          <TabRow
            value={rightTab}
            onChange={setRightTab}
            items={[
              { value: 'details', label: 'Details', icon: 'invoice' },
              {
                value: 'comments',
                label: 'Comments',
                icon: 'comment',
                count: 3,
              },
            ]}
          />

          <div style={{ padding: '8px 20px 24px' }}>
            {rightTab === 'details' && (
              <>
                {/* Bill details */}
                <SectionHeader
                  icon="invoice"
                  label="Bill Details"
                  expanded={open.details}
                  onToggle={() => toggle('details')}
                />
                {open.details && (
                  <div>
                    <Row icon="dollar" label="Invoice Amount">
                      <span className="x-num">{fmtMoney(bill.amount)}</span>
                    </Row>
                    <Row icon="calendar" label="Invoice Date">
                      {fmtDate(bill.received)}
                    </Row>
                    <Row icon="matter" label="Matter ID">
                      <span
                        className="x-mono"
                        style={{ color: 'var(--a-600)' }}
                      >
                        01JPMTR12...ABCD47
                      </span>
                    </Row>
                    <Row icon="building" label="Client Name">
                      <span style={{ color: 'var(--fg-3)' }}>—</span>
                    </Row>
                    <Row icon="folder" label="Revenue Location">
                      <span style={{ color: 'var(--fg-3)' }}>—</span>
                    </Row>
                    <Row icon="invoice" label="Claim Number">
                      <span className="x-mono">cln-1234</span>
                    </Row>
                    <Row icon="user" label="Handling Attorney">
                      <span
                        className="x-mono"
                        style={{ color: 'var(--a-600)' }}
                      >
                        01JPATTY...ABC47
                      </span>
                    </Row>
                    <Row icon="list" label="Service Type">
                      <span style={{ color: 'var(--fg-3)' }}>—</span>
                    </Row>
                    <Row icon="calendar" label="Date of Service">
                      {fmtDate(bill.received)}
                    </Row>
                    <Row icon="workflow" label="Status">
                      <BillStatus status={bill.status} />
                    </Row>
                    <Row icon="history" label="Revision">
                      <span style={{ display: 'inline-flex', gap: 6 }}>
                        <Badge variant="outline">v{bill.rev}</Badge>
                      </span>
                    </Row>
                    <button
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        marginTop: 10,
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--fg-1)',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      Show all details <Icon name="chevronRight" size={12} />
                    </button>
                  </div>
                )}

                {/* Audit */}
                <div
                  style={{
                    marginTop: 8,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 4,
                  }}
                >
                  <SectionHeader
                    icon="clock"
                    label="Audit"
                    expanded={open.audit}
                    onToggle={() => toggle('audit')}
                  />
                  {open.audit && (
                    <div>
                      <Row icon="clock" label="Created at">
                        Apr 8, 2026 · 16:05
                      </Row>
                      <Row icon="user" label="Created by">
                        K. Alvarez
                      </Row>
                      <Row icon="clock" label="Last updated">
                        Apr 15, 2026 · 14:10
                      </Row>
                      <Row icon="user" label="Last updated by">
                        Eleanor Wu
                      </Row>
                    </div>
                  )}
                </div>

                {/* Lists */}
                <div
                  style={{
                    marginTop: 8,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 4,
                  }}
                >
                  <SectionHeader
                    label="Lists"
                    expanded={open.lists}
                    onToggle={() => toggle('lists')}
                    actions={
                      <button
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          fontSize: 'var(--fs-sm)',
                          color: 'var(--fg-2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon name="plus" size={12} /> Add to list
                      </button>
                    }
                  />
                  {open.lists && (
                    <div
                      style={{
                        fontSize: 'var(--fs-sm)',
                        color: 'var(--fg-3)',
                        padding: '4px 0 12px',
                      }}
                    >
                      This bill has not been added to any lists
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
                {V2_NOTES.slice(0, 3).map((n, i) => (
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
                          style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}
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
      </div>
    </div>
  );
};

Object.assign(window, { VendorBillDetailV2 });
