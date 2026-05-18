/* global React, Icon, Button, IconButton, Badge, Avatar, Card, Tabs, Checkbox, BillStatus, PageNav, Field, Input, Textarea, SidePanel, fmtMoney, fmtDate, fmtDateTime, cls */

const BILL_LINES = [
  {
    id: 1,
    date: '2026-03-03',
    cat: 'Professional fees',
    task: 'L110',
    desc: 'Initial case assessment and intake meeting',
    qty: 3.5,
    unit: 750,
    tax: 52.5,
    total: 2677.5,
  },
  {
    id: 2,
    date: '2026-03-05',
    cat: 'Professional fees',
    task: 'L120',
    desc: 'Draft motion to dismiss — research & first pass',
    qty: 6.2,
    unit: 520,
    tax: 96.72,
    total: 3320.12,
  },
  {
    id: 3,
    date: '2026-03-08',
    cat: 'Professional fees',
    task: 'L210',
    desc: 'Review and revise pleadings',
    qty: 2.0,
    unit: 850,
    tax: 34.0,
    total: 1734.0,
  },
  {
    id: 4,
    date: '2026-03-12',
    cat: 'Expenses',
    task: 'E101',
    desc: 'Court filing fees — Northern District of California',
    qty: 1,
    unit: 402,
    tax: 0.0,
    total: 402.0,
  },
  {
    id: 5,
    date: '2026-03-15',
    cat: 'Professional fees',
    task: 'L310',
    desc: 'Written discovery — interrogatories & RFPs',
    qty: 4.8,
    unit: 520,
    tax: 74.88,
    total: 2570.88,
  },
  {
    id: 6,
    date: '2026-03-18',
    cat: 'Expenses',
    task: 'E111',
    desc: 'Expert consultant fee — forensic analysis',
    qty: 1,
    unit: 3500,
    tax: 280.0,
    total: 3780.0,
  },
  {
    id: 7,
    date: '2026-03-22',
    cat: 'Professional fees',
    task: 'L330',
    desc: 'Deposition preparation — witness outlines',
    qty: 5.5,
    unit: 780,
    tax: 103.68,
    total: 4393.68,
  },
];

const REVISIONS = [
  {
    v: 'v2',
    current: true,
    status: 'in_review',
    submitted: '2026-04-15T09:12:00',
    by: 'K. Alvarez',
    summary:
      'Corrected paralegal rate per engagement letter; re-itemized block-billed line 2.',
  },
  {
    v: 'v1',
    current: false,
    status: 'rejected',
    submitted: '2026-04-08T14:33:00',
    by: 'K. Alvarez',
    summary:
      'Initial submission. Rejected due to rate mismatch on line 4 and block billing on line 2.',
  },
];

const COMMENTS = [
  {
    id: 1,
    author: 'Eleanor Wu',
    time: '2026-04-15T14:10:00',
    body: 'v2 looks good — the rate adjustment is consistent with our engagement letter. Moving to partner approval.',
    rev: 'v2',
    resolved: false,
  },
  {
    id: 2,
    author: 'Marcus Orr',
    time: '2026-04-09T10:44:00',
    body: 'The paralegal rate on line 4 of v1 is $320 but the engagement caps paralegals at $285. Please resubmit.',
    rev: 'v1',
    resolved: true,
  },
  {
    id: 3,
    author: 'K. Alvarez',
    time: '2026-04-08T16:05:00',
    body: 'Submitted v1 for your review. Happy to walk through the discovery phase on a call.',
    rev: 'v1',
    resolved: true,
  },
];

const AUDIT = [
  {
    time: '2026-04-15T14:10:00',
    actor: 'Eleanor Wu',
    icon: 'comment',
    title: 'Commented on v2',
  },
  {
    time: '2026-04-15T09:12:00',
    actor: 'K. Alvarez',
    icon: 'upload',
    title: 'Submitted revision v2',
    detail: 'Corrected paralegal rate; re-itemized block-billed line',
  },
  {
    time: '2026-04-09T10:44:00',
    actor: 'Marcus Orr',
    icon: 'x',
    title: 'Rejected v1',
    detail: 'Rate mismatch on line 4; block billing on line 2',
  },
  {
    time: '2026-04-08T16:05:00',
    actor: 'K. Alvarez',
    icon: 'upload',
    title: 'Submitted v1',
    detail: 'Via vendor portal · 7 line items · $18,878.18',
  },
  {
    time: '2026-04-08T15:50:00',
    actor: 'System',
    icon: 'checkCircle',
    title: 'LEDES validation passed',
  },
];

const AUDIT_META = {
  createdAt: '2026-04-08T16:05:00',
  createdBy: 'K. Alvarez',
  updatedAt: '2026-04-15T14:10:00',
  updatedBy: 'Eleanor Wu',
};

const SAMPLE_DOCS = [
  {
    name: 'VendorBill_MPC_v2.pdf',
    type: 'pdf',
    size: '318 KB',
    by: 'K. Alvarez',
    at: '2026-04-15',
  },
  {
    name: 'LEDES_1998B_v2.txt',
    type: 'ledes',
    size: '52 KB',
    by: 'System',
    at: '2026-04-15',
  },
  {
    name: 'VendorBill_MPC_v1.pdf',
    type: 'pdf',
    size: '296 KB',
    by: 'K. Alvarez',
    at: '2026-04-08',
  },
  {
    name: 'Engagement_Letter_Signed.pdf',
    type: 'pdf',
    size: '221 KB',
    by: 'K. Alvarez',
    at: '2026-01-12',
  },
];

// ---------- Sections ----------------------------------------------
const LinesSection = () => {
  const [selected, setSelected] = React.useState(new Set());
  const subtotal = BILL_LINES.reduce((s, l) => s + (l.total - l.tax), 0);
  const tax = BILL_LINES.reduce((s, l) => s + l.tax, 0);
  const total = subtotal + tax;
  // 1-10 lines expected — render inline, no max-height scroller.
  return (
    <div className="x-grid-wrap">
      <div className="x-grid-toolbar">
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-lg)',
            color: 'var(--fg-1)',
          }}
        >
          Lines
        </span>
        <span className="x-grid-toolbar__count">· {BILL_LINES.length}</span>
        <div className="x-grid-toolbar__spacer" />
        <Button variant="ghost" size="sm" icon="sparkles">
          AI audit
        </Button>
        <Button variant="secondary" size="sm" icon="plus">
          Add line
        </Button>
      </div>
      <table className="x-grid">
        <thead>
          <tr>
            <th className="x-cell--checkbox">
              <Checkbox />
            </th>
            <th style={{ width: 100 }}>Date</th>
            <th style={{ width: 140 }}>Category</th>
            <th style={{ width: 80 }}>Task</th>
            <th>Description</th>
            <th style={{ width: 70, textAlign: 'right' }}>Qty / Hrs</th>
            <th style={{ width: 100, textAlign: 'right' }}>Unit</th>
            <th style={{ width: 90, textAlign: 'right' }}>Tax</th>
            <th style={{ width: 110, textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {BILL_LINES.map((l) => (
            <tr key={l.id} className={cls(selected.has(l.id) && 'is-selected')}>
              <td className="x-cell--checkbox">
                <Checkbox
                  checked={selected.has(l.id)}
                  onChange={() => {
                    const n = new Set(selected);
                    n.has(l.id) ? n.delete(l.id) : n.add(l.id);
                    setSelected(n);
                  }}
                />
              </td>
              <td style={{ color: 'var(--fg-2)' }}>{fmtDate(l.date)}</td>
              <td>{l.cat}</td>
              <td className="x-cell--mono">{l.task}</td>
              <td style={{ whiteSpace: 'normal' }}>{l.desc}</td>
              <td className="x-cell--num">{l.qty}</td>
              <td className="x-cell--num" style={{ color: 'var(--fg-2)' }}>
                {fmtMoney(l.unit)}
              </td>
              <td className="x-cell--num" style={{ color: 'var(--fg-2)' }}>
                {fmtMoney(l.tax)}
              </td>
              <td className="x-cell--num" style={{ fontWeight: 500 }}>
                {fmtMoney(l.total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={7}
              style={{
                textAlign: 'right',
                padding: '6px 12px',
                color: 'var(--fg-2)',
                fontSize: 'var(--fs-sm)',
              }}
            >
              Subtotal
            </td>
            <td
              colSpan={2}
              className="x-cell--num"
              style={{ padding: '6px 12px', fontSize: 'var(--fs-sm)' }}
            >
              {fmtMoney(subtotal)}
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              style={{
                textAlign: 'right',
                padding: '6px 12px',
                color: 'var(--fg-2)',
                fontSize: 'var(--fs-sm)',
              }}
            >
              Tax
            </td>
            <td
              colSpan={2}
              className="x-cell--num"
              style={{ padding: '6px 12px', fontSize: 'var(--fs-sm)' }}
            >
              {fmtMoney(tax)}
            </td>
          </tr>
          <tr style={{ background: 'var(--n-50)', fontWeight: 500 }}>
            <td
              colSpan={7}
              style={{ textAlign: 'right', padding: '10px 12px' }}
            >
              Total
            </td>
            <td
              colSpan={2}
              className="x-cell--num"
              style={{
                padding: '10px 12px',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-lg)',
              }}
            >
              {fmtMoney(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ---------- Documents list (attachments, list view) --------------
const FileIcon = ({ type }) => {
  const palette = {
    pdf: '#B45C48',
    ledes: '#54504A',
    xlsx: '#3F7A42',
    docx: '#3C6079',
  };
  return (
    <div
      style={{
        width: 32,
        height: 38,
        background: palette[type] || '#6f6b5f',
        borderRadius: 3,
        display: 'grid',
        placeItems: 'center',
        color: 'white',
        fontSize: 9,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        fontWeight: 600,
        flex: 'none',
      }}
    >
      {(type || 'file').toUpperCase()}
    </div>
  );
};

const DocumentsList = () => (
  <div className="x-grid-wrap">
    <div className="x-grid-toolbar">
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-lg)',
          color: 'var(--fg-1)',
        }}
      >
        Documents
      </span>
      <span className="x-grid-toolbar__count">· {SAMPLE_DOCS.length}</span>
      <div className="x-grid-toolbar__spacer" />
      <Button variant="secondary" size="sm" icon="upload">
        Upload
      </Button>
    </div>
    <table className="x-grid">
      <thead>
        <tr>
          <th style={{ width: 48 }}></th>
          <th>Name</th>
          <th style={{ width: 110 }}>Size</th>
          <th style={{ width: 180 }}>Uploaded by</th>
          <th style={{ width: 120 }}>Date</th>
          <th className="x-cell--actions"></th>
        </tr>
      </thead>
      <tbody>
        {SAMPLE_DOCS.map((f) => (
          <tr key={f.name} style={{ cursor: 'pointer' }}>
            <td style={{ padding: '8px 12px' }}>
              <FileIcon type={f.type} />
            </td>
            <td>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1.3,
                }}
              >
                <span style={{ fontWeight: 500 }}>{f.name}</span>
                <span
                  style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}
                >
                  {f.type.toUpperCase()}
                </span>
              </div>
            </td>
            <td style={{ color: 'var(--fg-2)' }}>{f.size}</td>
            <td style={{ color: 'var(--fg-2)' }}>{f.by}</td>
            <td style={{ color: 'var(--fg-2)' }}>{fmtDate(f.at)}</td>
            <td className="x-cell--actions">
              <div style={{ display: 'inline-flex', gap: 2 }}>
                <IconButton icon="download" title="Download" />
                <IconButton icon="more" title="More" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ---------- Side-panel content ------------------------------------
const CommentItem = ({ c }) => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Avatar name={c.author} size="md" />
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 'var(--fs-md)' }}>
          {c.author}
        </span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
          {fmtDateTime(c.time)}
        </span>
        <Badge variant="outline">{c.rev}</Badge>
        {c.resolved && <Badge variant="success">Resolved</Badge>}
      </div>
      <div
        style={{
          fontSize: 'var(--fs-md)',
          color: 'var(--fg-1)',
          marginTop: 4,
          lineHeight: 1.5,
        }}
      >
        {c.body}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <Button variant="ghost" size="sm" icon="comment">
          Reply
        </Button>
        {!c.resolved && (
          <Button variant="ghost" size="sm" icon="check">
            Resolve
          </Button>
        )}
      </div>
    </div>
  </div>
);

const CommentsPanel = () => {
  const [draft, setDraft] = React.useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Textarea
          rows={3}
          placeholder="Leave a comment. Use @ to mention, # to reference a line."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <IconButton icon="paperclip" />
          <IconButton icon="user" />
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="accent" size="sm" icon="comment">
            Post
          </Button>
        </div>
      </div>
      <hr className="x-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {COMMENTS.map((c) => (
          <CommentItem key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
};

const RevisionRow = ({ r }) => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}
  >
    <div
      style={{
        width: 48,
        flex: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-sm)',
        color: r.current ? 'var(--fg-accent)' : 'var(--fg-2)',
        fontWeight: 500,
        paddingTop: 2,
      }}
    >
      {r.v}
      {r.current && (
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--fg-3)',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            marginTop: 2,
          }}
        >
          current
        </div>
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
          flexWrap: 'wrap',
        }}
      >
        <BillStatus status={r.status} />
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
          {fmtDateTime(r.submitted)} · by {r.by}
        </span>
      </div>
      <div
        style={{
          fontSize: 'var(--fs-sm)',
          color: 'var(--fg-1)',
          lineHeight: 1.5,
        }}
      >
        {r.summary}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <Button variant="ghost" size="sm" icon="eye">
          View
        </Button>
        {!r.current && (
          <Button variant="ghost" size="sm" icon="external">
            Compare
          </Button>
        )}
      </div>
    </div>
  </div>
);

const RevisionsPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div
      style={{
        fontSize: 'var(--fs-xs)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)',
        color: 'var(--fg-3)',
        fontWeight: 600,
        marginBottom: 8,
      }}
    >
      History
    </div>
    {REVISIONS.map((r) => (
      <RevisionRow key={r.v} r={r} />
    ))}
  </div>
);

const AuditPanel = () => {
  const MetaCell = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-1)' }}>
        {children}
      </div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Entity metadata: first + last events, surfaced at top of audit view */}
      <div
        style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 12,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 16px',
          background: 'var(--n-25)',
        }}
      >
        <MetaCell label="Created at">
          {fmtDateTime(AUDIT_META.createdAt)}
        </MetaCell>
        <MetaCell label="Created by">{AUDIT_META.createdBy}</MetaCell>
        <MetaCell label="Last updated">
          {fmtDateTime(AUDIT_META.updatedAt)}
        </MetaCell>
        <MetaCell label="Last updated by">{AUDIT_META.updatedBy}</MetaCell>
      </div>

      <div
        style={{
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)',
          color: 'var(--fg-3)',
          fontWeight: 600,
        }}
      >
        Activity
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 16,
            bottom: 16,
            width: 1,
            background: 'var(--border)',
          }}
        />
        {AUDIT.map((e, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              padding: '14px 0',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                display: 'grid',
                placeItems: 'center',
                flex: 'none',
                position: 'relative',
                zIndex: 1,
                color: 'var(--fg-2)',
              }}
            >
              <Icon name={e.icon} size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 'var(--fs-md)' }}>
                {e.title}
              </div>
              {e.detail && (
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--fg-2)',
                    marginTop: 2,
                  }}
                >
                  {e.detail}
                </div>
              )}
              <div
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--fg-3)',
                  marginTop: 4,
                }}
              >
                {e.actor} · {fmtDateTime(e.time)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PeoplePanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)',
          color: 'var(--fg-3)',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        Collaborators
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'Eleanor Wu', role: 'Reviewer', you: true },
          { name: 'Priya Shah', role: 'Approver' },
          { name: 'Marcus Orr', role: 'Auditor' },
        ].map((p) => (
          <div
            key={p.name}
            style={{ display: 'flex', gap: 10, alignItems: 'center' }}
          >
            <Avatar name={p.name} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
                {p.name}
                {p.you && (
                  <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>
                    {' '}
                    · you
                  </span>
                )}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                {p.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <hr className="x-divider" />
    <div>
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)',
          color: 'var(--fg-3)',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        Vendor contact
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Avatar name="K. Alvarez" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
            K. Alvarez
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
            Partner · Morris Pine Chandler
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ---------- Edit form section (top of page) -----------------------
const BillDetailsForm = ({ bill, onCancel }) => {
  const [form, setForm] = React.useState(() => ({
    amount: String(bill.amount ?? ''),
    date: bill.received || '',
    matterId: '01JPMTR1234567890ABCD47',
    clientName: '',
    revenueLocation: '',
    claimNumber: 'cln-1234',
    attorney: '01JPATTY123456789ABC47',
    serviceType: '',
    serviceDate: bill.received || '',
  }));
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const clear = (k) => () => setForm((f) => ({ ...f, [k]: '' }));

  const DateIcon = () => (
    <span
      style={{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--fg-3)',
        pointerEvents: 'none',
      }}
    >
      <Icon name="calendar" size={14} />
    </span>
  );

  const ClearableLookup = ({ value, onChange, onClear, placeholder }) => (
    <div style={{ position: 'relative' }}>
      <input
        className="x-input"
        style={{ paddingRight: 62 }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <button
          aria-label="Clear"
          onClick={onClear}
          style={{
            all: 'unset',
            cursor: 'pointer',
            position: 'absolute',
            right: 36,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--fg-3)',
            padding: 2,
          }}
        >
          <Icon name="x" size={12} />
        </button>
      )}
      <span
        style={{
          position: 'absolute',
          right: 24,
          top: 6,
          bottom: 6,
          width: 1,
          background: 'var(--border-subtle)',
        }}
      />
      <button
        aria-label="Open"
        style={{
          all: 'unset',
          cursor: 'pointer',
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--fg-3)',
          padding: 4,
        }}
      >
        <Icon name="caretDown" size={12} />
      </button>
    </div>
  );

  return (
    <section
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-lg)',
            color: 'var(--fg-1)',
          }}
        >
          Bill details
        </span>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-3)' }}>
          Fields editable pre-approval
        </span>
      </header>

      <div
        style={{
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px 20px',
        }}
      >
        <Field label="Invoice Amount" required>
          <Input
            value={form.amount}
            onChange={set('amount')}
            inputMode="decimal"
          />
        </Field>
        <Field label="Invoice Date" required>
          <div style={{ position: 'relative' }}>
            <Input
              value={form.date}
              onChange={set('date')}
              placeholder="MM/DD/YYYY"
            />
            <DateIcon />
          </div>
        </Field>
        <Field label="Matter ID" required>
          <Input value={form.matterId} onChange={set('matterId')} />
        </Field>
        <Field label="Client Name">
          <Input
            value={form.clientName}
            onChange={set('clientName')}
            placeholder="—"
          />
        </Field>
        <Field label="Revenue Location">
          <Input
            value={form.revenueLocation}
            onChange={set('revenueLocation')}
            placeholder="—"
          />
        </Field>
        <Field label="Claim Number">
          <Input value={form.claimNumber} onChange={set('claimNumber')} />
        </Field>
        <Field label="Handling Attorney">
          <ClearableLookup
            value={form.attorney}
            onChange={set('attorney')}
            onClear={clear('attorney')}
          />
        </Field>
        <Field label="Service Type">
          <div style={{ position: 'relative' }}>
            <select
              className="x-select"
              value={form.serviceType}
              onChange={set('serviceType')}
              style={{
                paddingRight: 28,
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="">Service Type</option>
              <option value="consulting">Consulting</option>
              <option value="litigation">Litigation</option>
              <option value="advisory">Advisory</option>
              <option value="expenses">Expenses</option>
            </select>
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--fg-3)',
                pointerEvents: 'none',
              }}
            >
              <Icon name="caretDown" size={12} />
            </span>
          </div>
        </Field>
        <Field label="Date of Service" required>
          <div style={{ position: 'relative' }}>
            <Input
              value={form.serviceDate}
              onChange={set('serviceDate')}
              placeholder="MM/DD/YYYY"
            />
            <DateIcon />
          </div>
        </Field>
      </div>

      <footer
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--n-25)',
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="accent" icon="check">
          Save
        </Button>
      </footer>
    </section>
  );
};

// ---------- Main detail ------------------------------------------
const VendorBillDetail = ({
  bill,
  breadcrumbs,
  onBack,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
  onSwitchLayout,
}) => {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [panelTab, setPanelTab] = React.useState('comments');
  const [panelWidth, setPanelWidth] = React.useState(420);

  const togglePanel = (t) => {
    if (panelOpen && panelTab === t) setPanelOpen(false);
    else {
      setPanelTab(t);
      setPanelOpen(true);
    }
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && panelOpen) setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const RailButton = ({ value, icon, label, count }) => {
    const active = panelOpen && panelTab === value;
    return (
      <button
        className="x-context-rail__btn"
        onClick={() => togglePanel(value)}
        aria-pressed={active}
        title={count != null ? `${label} (${count})` : label}
        aria-label={count != null ? `${label}, ${count}` : label}
      >
        <Icon name={icon} size={16} />
        {count != null && count > 0 && (
          <span className="x-context-rail__count">{count}</span>
        )}
      </button>
    );
  };

  return (
    <div
      className="x-page"
      style={{
        maxWidth: 'none',
        padding: '0 44px 0 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        {breadcrumbs && <PageNav onBack={onBack} crumbs={breadcrumbs} />}
        <div className="x-page__head">
          <div className="x-page__title-wrap" style={{ gap: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 500,
                  color: 'var(--fg-1)',
                }}
              >
                {bill.vendor}
              </span>
              <BillStatus status={bill.status} />
            </div>
          </div>
          <div
            className="x-page__actions"
            style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            <div className="x-nav-arrows" title="Previous / next bill">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                title="Previous bill"
              >
                <Icon name="chevronLeft" size={14} />
              </button>
              <button onClick={onNext} disabled={!hasNext} title="Next bill">
                <Icon name="chevronRight" size={14} />
              </button>
            </div>
            {onSwitchLayout && (
              <Button
                variant="ghost"
                icon="grid"
                onClick={onSwitchLayout}
                title="Switch to 2-column layout"
              >
                2-col
              </Button>
            )}
            <Button variant="secondary" icon="x">
              Reject
            </Button>
            <Button variant="accent" icon="check">
              Approve
            </Button>
          </div>
        </div>

        {/* Summary strip */}
      </div>

      {/* Stacked body: Form → Lines → Documents. No tabs — each section is a
          first-class card. Window scrolls the whole thing. */}
      <div
        style={{
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <BillDetailsForm bill={bill} onCancel={onBack} />
        <LinesSection />
        <DocumentsList />
      </div>

      {/* Entity-level context rail */}
      <aside className="x-context-rail" aria-label="Vendor bill context">
        <RailButton
          value="comments"
          icon="comment"
          label="Comments"
          count={COMMENTS.length}
        />
        <RailButton
          value="audit"
          icon="clock"
          label="Audit log"
          count={AUDIT.length}
        />
      </aside>

      {/* Overlay drawer */}
      {panelOpen && (
        <>
          <div
            className="x-sidepanel-scrim"
            onClick={() => setPanelOpen(false)}
          />
          <SidePanel
            open
            onClose={() => setPanelOpen(false)}
            width={panelWidth}
            onWidthChange={setPanelWidth}
            storageKey="xtnd.bill.panelWidth"
            tabs={[
              {
                value: 'comments',
                label: 'Comments',
                icon: 'comment',
                count: COMMENTS.length,
              },
              {
                value: 'audit',
                label: 'Audit',
                icon: 'clock',
                count: AUDIT.length,
              },
            ]}
            tab={panelTab}
            onTabChange={setPanelTab}
          >
            {panelTab === 'comments' && <CommentsPanel />}
            {panelTab === 'audit' && <AuditPanel />}
          </SidePanel>
        </>
      )}
    </div>
  );
};

Object.assign(window, { VendorBillDetail });
