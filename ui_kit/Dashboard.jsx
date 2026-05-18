/* global React, Icon, Button, IconButton, Badge, KPI, Card, Avatar, InvoiceStatus, fmtMoney, fmtDate, cls */

// Dashboard = landing page for the console
const Dashboard = ({ onOpenInvoice }) => (
  <div className="x-page" style={{ paddingTop: 8 }}>
    <div className="x-page__head">
      <div className="x-page__title-wrap">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-2xl)',
            fontWeight: 500,
            color: 'var(--fg-1)',
            margin: 0,
          }}
        >
          Good morning, Eleanor
        </h1>
        <div className="x-page__sub">
          You have <strong style={{ color: 'var(--fg-1)' }}>7 invoices</strong>{' '}
          awaiting your review.
        </div>
      </div>
      <div className="x-page__actions">
        <Button variant="secondary" icon="download">
          Export report
        </Button>
        <Button variant="accent" icon="plus">
          New workflow
        </Button>
      </div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}
    >
      <KPI
        label="Awaiting review"
        value="7"
        delta="+2 vs last week"
        deltaDir="up"
      />
      <KPI
        label="In review (MTD)"
        value={fmtMoney(1245000)}
        delta="+8.4%"
        deltaDir="up"
      />
      <KPI
        label="Approved (MTD)"
        value={fmtMoney(892400)}
        delta="−3.1%"
        deltaDir="down"
      />
      <KPI
        label="Avg. review time"
        value="2.3 days"
        delta="−0.4 days"
        deltaDir="up"
      />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <Card
        title="Needs your attention"
        actions={
          <Button variant="ghost" size="sm" iconRight="arrowRight">
            View all
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            margin: '-4px 0',
          }}
        >
          {[
            {
              id: 'INV-2026-00418',
              v: 'Morgan, Patel & Clark LLP',
              a: 142880.0,
              s: 'in_review',
              reason: '4 policy flags',
            },
            {
              id: 'INV-2026-00415',
              v: 'Baker & Hostetler',
              a: 210000.0,
              s: 'disputed',
              reason: 'Vendor responded',
            },
            {
              id: 'INV-2026-00414',
              v: 'Skadden, Arps',
              a: 485300.0,
              s: 'in_review',
              reason: 'Due in 3 days',
            },
            {
              id: 'INV-2026-00410',
              v: 'Gibson, Dunn & Crutcher',
              a: 318450.25,
              s: 'in_review',
              reason: 'Awaiting approval',
            },
          ].map((r) => (
            <div
              key={r.id}
              onClick={() => onOpenInvoice && onOpenInvoice(r.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 4px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span
                className="x-mono"
                style={{
                  color: 'var(--fg-accent)',
                  fontWeight: 500,
                  fontSize: 'var(--fs-sm)',
                }}
              >
                {r.id}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.v}
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                  {r.reason}
                </div>
              </div>
              <InvoiceStatus status={r.s} />
              <span
                className="x-num"
                style={{
                  fontWeight: 500,
                  fontSize: 'var(--fs-md)',
                  width: 110,
                  textAlign: 'right',
                }}
              >
                {fmtMoney(r.a)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recent activity">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              who: 'Priya Shah',
              did: 'approved',
              what: 'INV-2026-00411',
              when: '2h ago',
            },
            {
              who: 'Marcus Orr',
              did: 'commented on',
              what: 'INV-2026-00416',
              when: '4h ago',
            },
            {
              who: 'System',
              did: 'flagged',
              what: 'INV-2026-00418',
              when: '6h ago',
            },
            {
              who: 'Morgan Patel',
              did: 'submitted',
              what: 'INV-2026-00418',
              when: '1d ago',
            },
            {
              who: 'K. Alvarez',
              did: 'replied in',
              what: 'INV-2026-00415',
              when: '1d ago',
            },
          ].map((e, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 10, fontSize: 'var(--fs-sm)' }}
            >
              <Avatar name={e.who} size="sm" />
              <div style={{ flex: 1 }}>
                <div>
                  <strong style={{ fontWeight: 500 }}>{e.who}</strong>{' '}
                  <span style={{ color: 'var(--fg-2)' }}>{e.did}</span>{' '}
                  <span
                    className="x-mono"
                    style={{ color: 'var(--fg-accent)' }}
                  >
                    {e.what}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                  {e.when}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

Object.assign(window, { Dashboard });
