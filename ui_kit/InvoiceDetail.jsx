/* global React, Icon, Button, IconButton, Badge, InvoiceStatus, Avatar, Tabs, Card, CollapsibleCard, SidePanel, Checkbox, Field, Input, Textarea, fmtMoney, fmtDate, fmtDateTime, cls */

// ======================================================================
// InvoiceDetail — complex detail page with:
//   - header (breadcrumb, status, actions)
//   - summary strip (KPI-ish metadata)
//   - tabs: Line items, Comments, Audit log, Attachments, Documents
//   - right rail: activity + quick facts
// ======================================================================

const SAMPLE_LINES = [
  {
    id: 1,
    date: '2026-04-01',
    tk: 'K. Alvarez',
    lvl: 'Partner',
    task: 'L110',
    act: 'A104',
    hrs: 2.4,
    rate: 1250,
    amount: 3000.0,
    desc: 'Review complaint and initial case strategy; analyze jurisdiction question.',
    flags: ['block'],
  },
  {
    id: 2,
    date: '2026-04-02',
    tk: 'J. Bhatt',
    lvl: 'Associate',
    task: 'L120',
    act: 'A103',
    hrs: 4.8,
    rate: 780,
    amount: 3744.0,
    desc: 'Draft response to motion to dismiss; research standing arguments.',
    flags: [],
  },
  {
    id: 3,
    date: '2026-04-02',
    tk: 'K. Alvarez',
    lvl: 'Partner',
    task: 'L110',
    act: 'A106',
    hrs: 1.2,
    rate: 1250,
    amount: 1500.0,
    desc: 'Call with client re: strategy for upcoming hearing.',
    flags: [],
  },
  {
    id: 4,
    date: '2026-04-03',
    tk: 'M. Chen',
    lvl: 'Paralegal',
    task: 'L140',
    act: 'A111',
    hrs: 6.5,
    rate: 320,
    amount: 2080.0,
    desc: 'Document review — first pass of production batch 03.',
    flags: ['rate'],
  },
  {
    id: 5,
    date: '2026-04-05',
    tk: 'J. Bhatt',
    lvl: 'Associate',
    task: 'L120',
    act: 'A103',
    hrs: 8.2,
    rate: 780,
    amount: 6396.0,
    desc: 'Continue drafting response brief; incorporate partner edits.',
    flags: ['block', 'vague'],
  },
  {
    id: 6,
    date: '2026-04-05',
    tk: 'K. Alvarez',
    lvl: 'Partner',
    task: 'L120',
    act: 'A104',
    hrs: 3.1,
    rate: 1250,
    amount: 3875.0,
    desc: 'Revise and finalize response brief for filing.',
    flags: [],
  },
  {
    id: 7,
    date: '2026-04-06',
    tk: 'S. Okonkwo',
    lvl: 'Associate',
    task: 'L190',
    act: 'A108',
    hrs: 5.5,
    rate: 720,
    amount: 3960.0,
    desc: 'Prepare discovery requests; draft interrogatories and RFPs.',
    flags: [],
  },
  {
    id: 8,
    date: '2026-04-08',
    tk: 'M. Chen',
    lvl: 'Paralegal',
    task: 'L140',
    act: 'A111',
    hrs: 7.0,
    rate: 320,
    amount: 2240.0,
    desc: 'Document review — privilege log updates.',
    flags: [],
  },
];

const FlagTag = ({ kind }) => {
  const map = {
    block: { label: 'Block billing', variant: 'warn' },
    rate: { label: 'Rate mismatch', variant: 'danger' },
    vague: { label: 'Vague', variant: 'warn' },
  };
  const m = map[kind];
  if (!m) return null;
  return <Badge variant={m.variant}>{m.label}</Badge>;
};

const MetaRow = ({ label, children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      fontSize: 'var(--fs-sm)',
    }}
  >
    <div
      style={{
        color: 'var(--fg-3)',
        fontSize: 'var(--fs-xs)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)',
        fontWeight: 600,
      }}
    >
      {label}
    </div>
    <div style={{ color: 'var(--fg-1)' }}>{children}</div>
  </div>
);

// ---------- Line Items Tab ------------------------------------------
const LineItemsTab = ({ invoice, gridMode = 'normal', onGridMode }) => {
  const [selected, setSelected] = React.useState(new Set());
  const totals = SAMPLE_LINES.reduce(
    (a, l) => ({ hrs: a.hrs + l.hrs, amt: a.amt + l.amount }),
    { hrs: 0, amt: 0 },
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Flags summary */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          padding: '10px 12px',
          background: 'var(--warn-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #e8d4a8',
        }}
      >
        <Icon
          name="alertCircle"
          size={14}
          style={{ color: 'var(--warn-500)' }}
        />
        <span
          style={{
            fontSize: 'var(--fs-sm)',
            color: 'var(--warn-700)',
            fontWeight: 500,
          }}
        >
          4 line items flagged by policy rules
        </span>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--warn-700)' }}>
          · Block billing (2) · Rate mismatch (1) · Vague description (1)
        </span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">
          Review flags
        </Button>
      </div>

      <div className="x-grid-wrap" style={{ boxShadow: 'none' }}>
        <div className="x-grid-toolbar">
          <Button variant="secondary" size="sm" icon="filter">
            Filter
          </Button>
          <Button variant="ghost" size="sm" icon="sparkles">
            AI audit
          </Button>
          <div className="x-grid-toolbar__spacer" />
          <span className="x-grid-toolbar__count">
            {SAMPLE_LINES.length} lines · {totals.hrs.toFixed(1)}h ·{' '}
            {fmtMoney(totals.amt)}
          </span>
          <Button variant="secondary" size="sm" icon="download">
            Export
          </Button>
          {onGridMode && (
            <div className="x-nav-arrows" title="Grid width">
              <button
                onClick={() =>
                  onGridMode(gridMode === 'wide' ? 'normal' : 'wide')
                }
                title={
                  gridMode === 'wide'
                    ? 'Restore side panels'
                    : 'Full width (hide side panels)'
                }
                aria-pressed={gridMode === 'wide'}
                style={{
                  color: gridMode === 'wide' ? 'var(--a-600)' : undefined,
                }}
              >
                <Icon
                  name={gridMode === 'wide' ? 'minimize' : 'maximize'}
                  size={14}
                />
              </button>
              <button
                onClick={() =>
                  onGridMode(
                    gridMode === 'fullscreen' ? 'normal' : 'fullscreen',
                  )
                }
                title={
                  gridMode === 'fullscreen' ? 'Exit full screen' : 'Full screen'
                }
                aria-pressed={gridMode === 'fullscreen'}
                style={{
                  color: gridMode === 'fullscreen' ? 'var(--a-600)' : undefined,
                }}
              >
                <Icon name="expand" size={14} />
              </button>
            </div>
          )}
        </div>
        <div className="x-grid-scroll">
          <table className="x-grid">
            <thead>
              <tr>
                <th className="x-cell--checkbox">
                  <Checkbox />
                </th>
                <th style={{ width: 90 }}>Date</th>
                <th style={{ width: 140 }}>Timekeeper</th>
                <th style={{ width: 70 }}>Task</th>
                <th style={{ width: 70 }}>Activity</th>
                <th>Description</th>
                <th style={{ width: 60, textAlign: 'right' }}>Hours</th>
                <th style={{ width: 80, textAlign: 'right' }}>Rate</th>
                <th style={{ width: 110, textAlign: 'right' }}>Amount</th>
                <th className="x-cell--actions"></th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LINES.map((l) => (
                <tr
                  key={l.id}
                  className={cls(selected.has(l.id) && 'is-selected')}
                >
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
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        lineHeight: 1.3,
                      }}
                    >
                      <span>{l.tk}</span>
                      <span
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                        }}
                      >
                        {l.lvl}
                      </span>
                    </div>
                  </td>
                  <td className="x-cell--mono">{l.task}</td>
                  <td className="x-cell--mono">{l.act}</td>
                  <td style={{ whiteSpace: 'normal', maxWidth: 380 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        padding: '8px 0',
                      }}
                    >
                      <span>{l.desc}</span>
                      {l.flags.length > 0 && (
                        <div
                          style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}
                        >
                          {l.flags.map((f) => (
                            <FlagTag key={f} kind={f} />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="x-cell--num">{l.hrs.toFixed(1)}</td>
                  <td className="x-cell--num" style={{ color: 'var(--fg-2)' }}>
                    {fmtMoney(l.rate)}
                  </td>
                  <td className="x-cell--num" style={{ fontWeight: 500 }}>
                    {fmtMoney(l.amount)}
                  </td>
                  <td className="x-cell--actions">
                    <IconButton icon="more" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--n-50)', fontWeight: 500 }}>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'right',
                    padding: '10px 12px',
                    color: 'var(--fg-2)',
                  }}
                >
                  Subtotal
                </td>
                <td className="x-cell--num" style={{ padding: '10px 12px' }}>
                  {totals.hrs.toFixed(1)}
                </td>
                <td></td>
                <td
                  className="x-cell--num"
                  style={{
                    padding: '10px 12px',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-lg)',
                  }}
                >
                  {fmtMoney(totals.amt)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

// ---------- Comments Tab --------------------------------------------
const SAMPLE_COMMENTS = [
  {
    id: 1,
    author: 'Eleanor Wu',
    time: '2026-04-19T10:24:00',
    body: 'Line 5 appears to be block billing — please itemize the 8.2 hours into discrete tasks.',
    line: 5,
    resolved: false,
  },
  {
    id: 2,
    author: 'K. Alvarez',
    time: '2026-04-19T14:02:00',
    body: 'Acknowledged. Will revise and resubmit the time narrative with a proper task breakdown by end of week.',
    line: 5,
    resolved: false,
    thread: 1,
  },
  {
    id: 3,
    author: 'Marcus Orr',
    time: '2026-04-19T15:40:00',
    body: 'The paralegal rate on line 4 is $320 but the engagement letter caps paralegals at $285. Adjusting.',
    line: 4,
    resolved: true,
  },
];

const CommentItem = ({ c, isReply }) => (
  <div style={{ display: 'flex', gap: 10, paddingLeft: isReply ? 40 : 0 }}>
    <Avatar name={c.author} size="md" />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontWeight: 500, fontSize: 'var(--fs-md)' }}>
          {c.author}
        </span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
          {fmtDateTime(c.time)}
        </span>
        {c.line && <Badge variant="outline">Line {c.line}</Badge>}
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
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
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

const CommentsTab = () => {
  const [draft, setDraft] = React.useState('');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        maxWidth: 820,
      }}
    >
      {/* Composer */}
      <Card noPad>
        <div style={{ padding: 12 }}>
          <Textarea
            placeholder="Leave a comment. Use @ to mention, # to reference a line."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
        </div>
        <div
          style={{
            padding: '0 12px 12px',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <IconButton icon="paperclip" />
          <IconButton icon="user" />
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="accent" size="sm" icon="comment">
            Post comment
          </Button>
        </div>
      </Card>

      {/* Thread */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <CommentItem c={SAMPLE_COMMENTS[0]} />
        <CommentItem c={SAMPLE_COMMENTS[1]} isReply />
        <hr className="x-divider" />
        <CommentItem c={SAMPLE_COMMENTS[2]} />
      </div>
    </div>
  );
};

// ---------- Audit Log Tab -------------------------------------------
const SAMPLE_AUDIT = [
  {
    time: '2026-04-19T15:40:00',
    actor: 'Marcus Orr',
    icon: 'edit',
    title: 'Rate adjusted on line 4',
    detail: 'Paralegal rate changed from $320 → $285 per engagement letter',
  },
  {
    time: '2026-04-19T14:02:00',
    actor: 'K. Alvarez',
    icon: 'comment',
    title: 'Replied to comment on line 5',
  },
  {
    time: '2026-04-19T10:24:00',
    actor: 'Eleanor Wu',
    icon: 'comment',
    title: 'Added comment on line 5',
  },
  {
    time: '2026-04-19T09:00:00',
    actor: 'System',
    icon: 'sparkles',
    title: 'AI audit completed',
    detail: '4 potential issues surfaced across 8 line items',
  },
  {
    time: '2026-04-19T08:55:00',
    actor: 'Eleanor Wu',
    icon: 'user',
    title: 'Assigned to Eleanor Wu',
  },
  {
    time: '2026-04-18T16:30:00',
    actor: 'System',
    icon: 'checkCircle',
    title: 'LEDES 1998B validation passed',
  },
  {
    time: '2026-04-18T16:28:00',
    actor: 'Morgan Patel',
    icon: 'upload',
    title: 'Invoice submitted',
    detail: 'Via vendor portal · 47 line items · $142,880.00',
  },
];

const AuditTab = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 820,
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
    {SAMPLE_AUDIT.map((e, i) => (
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 'var(--fs-md)' }}>
              {e.title}
            </span>
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
);

// ---------- Attachments Tab -----------------------------------------
const SAMPLE_FILES = [
  {
    name: 'Invoice_MPC_2026-00418.pdf',
    type: 'pdf',
    size: '412 KB',
    by: 'Morgan Patel',
    at: '2026-04-18',
  },
  {
    name: 'LEDES_1998B_00418.txt',
    type: 'ledes',
    size: '68 KB',
    by: 'System',
    at: '2026-04-18',
  },
  {
    name: 'Engagement_Letter_Signed.pdf',
    type: 'pdf',
    size: '221 KB',
    by: 'K. Alvarez',
    at: '2026-01-12',
  },
  {
    name: 'Rate_Card_2026.xlsx',
    type: 'xlsx',
    size: '34 KB',
    by: 'K. Alvarez',
    at: '2026-01-12',
  },
];

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
        width: 36,
        height: 44,
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
      {type.toUpperCase()}
    </div>
  );
};

const AttachmentsTab = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 12,
      maxWidth: 900,
    }}
  >
    {SAMPLE_FILES.map((f) => (
      <div
        key={f.name}
        className="x-card"
        style={{
          padding: 12,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          cursor: 'pointer',
        }}
      >
        <FileIcon type={f.type} />
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
            {f.name}
          </div>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--fg-3)',
              marginTop: 2,
            }}
          >
            {f.size} · uploaded by {f.by}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
            {fmtDate(f.at)}
          </div>
        </div>
        <IconButton icon="download" />
      </div>
    ))}
    <div
      className="x-card"
      style={{
        padding: 12,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        color: 'var(--fg-3)',
        cursor: 'pointer',
      }}
    >
      <Icon name="upload" size={14} /> Upload file
    </div>
  </div>
);

// ---------- Edit lock (pessimistic concurrency) --------------------
// An invoice in the Editing workflow state is "acquired" by one user.
// Everyone else can view but not act on it. Users with the unlock role
// (billing / admin) can force-release.
const VIEWER_ROLES = [
  {
    id: 'kalvarez',
    name: 'K. Alvarez',
    role: 'Editor',
    isLockHolder: true,
    canRelease: false,
  },
  {
    id: 'ewu',
    name: 'Eleanor Wu',
    role: 'Reviewer',
    isLockHolder: false,
    canRelease: false,
  },
  {
    id: 'pshah',
    name: 'Priya Shah',
    role: 'Billing admin',
    isLockHolder: false,
    canRelease: true,
  },
];

const minutesSince = (iso) => {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
};

const EditLockBanner = ({ lock, viewer, onRelease }) => {
  if (!lock) return null;
  const isHolder = viewer.isLockHolder;
  const canRelease = viewer.canRelease;

  // Variant 1: viewer is the lock-holder — they can turn edit mode off
  if (isHolder) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          background: 'var(--info-50)',
          border: '1px solid #c8d6df',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <Icon name="edit" size={16} style={{ color: 'var(--info-700)' }} />
        <div
          style={{
            flex: 1,
            fontSize: 'var(--fs-sm)',
            color: 'var(--info-700)',
            lineHeight: 1.4,
          }}
        >
          <strong>You're editing this invoice.</strong>
          <span style={{ color: 'var(--fg-2)' }}>
            {' '}
            Started {minutesSince(lock.acquiredAt)}. Changes autosave every 30s.
            Turn off edit mode when done so others can act on it.
          </span>
        </div>
        <Button variant="secondary" size="sm" icon="check" onClick={onRelease}>
          Turn off edit mode
        </Button>
      </div>
    );
  }

  // Variant 2 / 3: someone else holds the lock. Only billing users can
  // override; everyone else just sees the warning.
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: 'var(--warn-50)',
        border: '1px solid #e8d4a8',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <Icon name="lock" size={16} style={{ color: 'var(--warn-700)' }} />
      <Avatar name={lock.by} size="sm" />
      <div
        style={{
          flex: 1,
          fontSize: 'var(--fs-sm)',
          color: 'var(--warn-700)',
          lineHeight: 1.4,
        }}
      >
        <strong>{lock.by}</strong>
        <span>
          {' '}
          is editing this invoice · acquired {minutesSince(lock.acquiredAt)}.
        </span>
        <span style={{ color: 'var(--fg-2)' }}>
          {' '}
          Approve and Reject are disabled until edit mode is turned off.
        </span>
      </div>
      {canRelease && (
        <Button
          variant="danger"
          size="sm"
          icon="lock"
          onClick={onRelease}
          title="Turn off edit mode — the current editor will lose unsaved changes"
        >
          Turn off edit mode
        </Button>
      )}
    </div>
  );
};

// ---------- Workflow pipeline --------------------------------------
// Canonical 6-state flow for invoices:
//   Pending → Draft → Editing → Syncing → Pending approval → Approved
// "Sync failed" is not a 7th state in the strip — it renders as an error
// marker on the Syncing circle, with an inline Retry action. This keeps the
// forward flow linear and one-directional.
const WORKFLOW_STATES = [
  {
    key: 'pending',
    label: 'Pending',
    icon: 'clock',
    hint: 'System gathering data',
  },
  { key: 'draft', label: 'Draft', icon: 'edit', hint: 'Ready for reviewer' },
  { key: 'editing', label: 'Editing', icon: 'edit', hint: 'User editing' },
  {
    key: 'syncing',
    label: 'Syncing',
    icon: 'refresh',
    hint: 'Pushing to Clio / LPMS',
  },
  {
    key: 'pending_approval',
    label: 'Pending approval',
    icon: 'clock',
    hint: 'Billing review',
  },
  { key: 'approved', label: 'Approved', icon: 'check', hint: 'Completed' },
];

const mapInvoiceStatusToWorkflow = (status) => {
  switch (status) {
    case 'draft':
      return { currentKey: 'draft', doneCount: 1, failed: false };
    case 'submitted':
      return { currentKey: 'draft', doneCount: 1, failed: false };
    case 'on_hold':
      return { currentKey: 'editing', doneCount: 2, failed: false };
    case 'in_review':
      return { currentKey: 'pending_approval', doneCount: 4, failed: false };
    case 'rejected':
      return { currentKey: 'pending_approval', doneCount: 4, failed: false };
    case 'disputed':
      return { currentKey: 'syncing', doneCount: 3, failed: true };
    case 'approved':
      return { currentKey: 'approved', doneCount: 5, failed: false };
    case 'paid':
      return { currentKey: 'approved', doneCount: 5, failed: false };
    default:
      return { currentKey: 'pending', doneCount: 0, failed: false };
  }
};

const WorkflowBar = ({ invoice, lock, onClose }) => {
  const { currentKey, doneCount, failed } = mapInvoiceStatusToWorkflow(
    invoice.status,
  );
  const currentIdx = WORKFLOW_STATES.findIndex((s) => s.key === currentKey);

  return (
    <div className="x-workflow-bar" role="region" aria-label="Invoice workflow">
      <div className="x-workflow-bar__head">
        <span className="x-workflow-bar__title">Workflow</span>
        <span className="x-workflow-bar__meta">
          {failed ? (
            <>
              Sync to Clio failed ·{' '}
              <span style={{ color: 'var(--danger-700)', fontWeight: 500 }}>
                action required
              </span>
            </>
          ) : (
            <>
              Currently at{' '}
              <strong style={{ color: 'var(--fg-1)' }}>
                {WORKFLOW_STATES[currentIdx]?.label}
              </strong>
            </>
          )}
        </span>
        <div style={{ flex: 1 }} />
        {failed && (
          <Button variant="accent" size="sm" icon="refresh">
            Retry sync
          </Button>
        )}
        <IconButton icon="x" onClick={onClose} title="Close workflow" />
      </div>
      <div className="x-wf-steps">
        {WORKFLOW_STATES.map((s, i) => {
          const isFailedStep = failed && s.key === 'syncing';
          const isCurrent = !isFailedStep && i === currentIdx;
          const isDone = !isFailedStep && i < doneCount;
          const cls = [
            'x-wf-step',
            isDone && 'is-done',
            isCurrent && 'is-current',
            isFailedStep && 'is-failed',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <div key={s.key} className={cls}>
              <div className="x-wf-step__circle">
                {isFailedStep ? (
                  <Icon name="x" size={14} />
                ) : isDone ? (
                  <Icon name="check" size={14} />
                ) : (
                  <Icon
                    name={s.icon}
                    size={13}
                    className={
                      s.key === 'syncing' && isCurrent ? 'x-wf-step__spin' : ''
                    }
                  />
                )}
              </div>
              <div className="x-wf-step__label">{s.label}</div>
              <div className="x-wf-step__hint">
                {isFailedStep ? (
                  'Failed · retry to continue'
                ) : s.key === 'editing' && lock ? (
                  <>
                    Locked by{' '}
                    <strong style={{ color: 'var(--fg-2)' }}>{lock.by}</strong>
                  </>
                ) : (
                  s.hint
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Right Rail ----------------------------------------------
const RightRail = ({ invoice }) => (
  <aside
    style={{
      width: 320,
      flex: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <CollapsibleCard id="detail.summary" title="Summary" icon="invoice">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 16px',
        }}
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <MetaRow label="Vendor">{invoice.vendor}</MetaRow>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <MetaRow label="Matter">{invoice.matter}</MetaRow>
        </div>
        <MetaRow label="Period">Apr 1 – 15, 2026</MetaRow>
        <MetaRow label="Currency">USD</MetaRow>
        <MetaRow label="Submitted">{fmtDate(invoice.submitted)}</MetaRow>
        <MetaRow label="Due">{fmtDate(invoice.due)}</MetaRow>
        <div style={{ gridColumn: '1 / -1' }}>
          <MetaRow label="LEDES">
            <span className="x-mono" style={{ color: 'var(--fg-2)' }}>
              1998B · Validated
            </span>
          </MetaRow>
        </div>
        <hr className="x-divider" style={{ margin: '4px 0' }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            gridColumn: '1 / -1',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--fs-sm)',
              color: 'var(--fg-2)',
            }}
          >
            <span>Fees</span>
            <span className="x-num">{fmtMoney(138420.0)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--fs-sm)',
              color: 'var(--fg-2)',
            }}
          >
            <span>Expenses</span>
            <span className="x-num">{fmtMoney(4460.0)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--fs-sm)',
              color: 'var(--success-700)',
            }}
          >
            <span>Adjustments</span>
            <span className="x-num">−{fmtMoney(0)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: '1px solid var(--border-subtle)',
              marginTop: 4,
            }}
          >
            <span style={{ fontWeight: 500 }}>Total</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-xl)',
              }}
              className="x-num"
            >
              {fmtMoney(invoice.amount)}
            </span>
          </div>
        </div>
      </div>
    </CollapsibleCard>

    <CollapsibleCard id="detail.audit" title="Audit" icon="history">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 16px',
        }}
      >
        <MetaRow label="Created">{fmtDate(invoice.submitted)}</MetaRow>
        <MetaRow label="Created by">Morgan Patel</MetaRow>
        <MetaRow label="Last updated">Apr 19, 2026</MetaRow>
        <MetaRow label="Updated by">Marcus Orr</MetaRow>
        <div style={{ gridColumn: '1 / -1' }}>
          <MetaRow label="Source">
            <span className="x-mono" style={{ color: 'var(--fg-2)' }}>
              Vendor portal · v4.12
            </span>
          </MetaRow>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <MetaRow label="Revision">
            <span style={{ color: 'var(--fg-2)' }}>
              3 of 3 ·{' '}
              <a
                href="#"
                style={{ color: 'var(--a-600)', textDecoration: 'none' }}
              >
                view history
              </a>
            </span>
          </MetaRow>
        </div>
      </div>
    </CollapsibleCard>

    <CollapsibleCard
      id="detail.participants"
      title="Participants"
      icon="users"
      defaultCollapsed
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Eleanor Wu', role: 'Reviewer' },
          { name: 'Priya Shah', role: 'Approver' },
          { name: 'K. Alvarez', role: 'Vendor contact' },
        ].map((p) => (
          <div
            key={p.name}
            style={{ display: 'flex', gap: 10, alignItems: 'center' }}
          >
            <Avatar name={p.name} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                {p.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  </aside>
);

const WorkflowStep = ({ done, active, label, by, at }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        flex: 'none',
        marginTop: 1,
        background: done
          ? 'var(--success-500)'
          : active
            ? 'var(--bg-surface)'
            : 'var(--n-100)',
        border: active
          ? '2px solid var(--a-500)'
          : done
            ? 'none'
            : '1px solid var(--border)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {done && (
        <Icon
          name="check"
          size={10}
          style={{ color: 'white', strokeWidth: 3 }}
        />
      )}
      {active && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--a-500)',
          }}
        />
      )}
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 'var(--fs-sm)',
          fontWeight: active ? 500 : 400,
          color: done || active ? 'var(--fg-1)' : 'var(--fg-3)',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
        {by} · {at}
      </div>
    </div>
  </div>
);

// ---------- Participants Panel Body (for side panel) -----------------
const ParticipantsPanel = () => (
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
            <IconButton icon="more" />
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" icon="user" style={{ marginTop: 10 }}>
        Add collaborator
      </Button>
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
        Vendor contacts
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'K. Alvarez', role: 'Partner · Morris Pine Chandler' },
          { name: 'J. Bhatt', role: 'Associate · Morris Pine Chandler' },
        ].map((p) => (
          <div
            key={p.name}
            style={{ display: 'flex', gap: 10, alignItems: 'center' }}
          >
            <Avatar name={p.name} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                {p.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ---------- More-actions dropdown -----------------------------------
const MoreActionsMenu = ({ invoice }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = [
    { group: 'Integrations' },
    {
      icon: 'database',
      label: 'Sync to Strapi CMS',
      hint: 'Push invoice content to CMS',
    },
    { icon: 'link', label: 'Copy share link' },
    { icon: 'external', label: 'Open in legacy console' },
    { group: 'Data' },
    { icon: 'download', label: 'Export LEDES 1998B' },
    { icon: 'download', label: 'Export PDF' },
    { icon: 'upload', label: 'Replace source file…' },
    { group: 'Admin' },
    {
      icon: 'lock',
      label: 'Put on hold',
      hint: 'Pauses workflow and notifies vendor',
    },
    { icon: 'refresh', label: 'Recompute policy checks' },
    { icon: 'xCircle', label: 'Void invoice', danger: true },
  ];

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <Button
        variant="secondary"
        icon="more"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="More actions"
      >
        More
      </Button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 4px)',
            minWidth: 260,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 20,
            padding: 4,
            fontSize: 'var(--fs-sm)',
          }}
        >
          {items.map((it, i) =>
            it.group ? (
              <div
                key={`g${i}`}
                style={{
                  padding: '8px 10px 4px',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-caps)',
                  color: 'var(--fg-3)',
                  fontWeight: 600,
                }}
              >
                {it.group}
              </div>
            ) : (
              <button
                key={i}
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  all: 'unset',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: it.danger ? 'var(--danger-600)' : 'var(--fg-1)',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--bg-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <Icon
                  name={it.icon}
                  size={14}
                  style={{
                    marginTop: 2,
                    color: it.danger ? 'var(--danger-600)' : 'var(--fg-3)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div>{it.label}</div>
                  {it.hint && (
                    <div
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--fg-3)',
                        marginTop: 1,
                      }}
                    >
                      {it.hint}
                    </div>
                  )}
                </div>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

// ---------- Main detail page ----------------------------------------
// Layout is entity-level:
//   Header → Summary strip → Tabs → { tab content | right rail (always visible) }
// The side panel is an overlay drawer (Comments / Audit / People), opened from
// the header. It applies to the whole invoice entity, not a specific tab.
const InvoiceDetail = ({
  invoice,
  breadcrumbs,
  onBack,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => {
  const [tab, setTab] = React.useState('lines');
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [panelTab, setPanelTab] = React.useState('comments');
  const [panelWidth, setPanelWidth] = React.useState(420);
  // Grid width mode: "normal" | "wide" (hide right rail) | "fullscreen"
  const [gridMode, setGridMode] = React.useState('normal');
  // Workflow bar (docked to bottom, triggered by clicking the status badge)
  const [workflowOpen, setWorkflowOpen] = React.useState(false);
  // Viewer identity comes from auth in production; fixed to "Reviewer" for the
  // prototype so the locked-by-someone-else state is what's rendered by default.
  const viewer = VIEWER_ROLES[1]; // Eleanor Wu · Reviewer
  const [lock, setLock] = React.useState(invoice.editLock || null);
  // Sync lock when invoice changes (prev/next navigation)
  React.useEffect(() => {
    setLock(invoice.editLock || null);
  }, [invoice.id]);
  const lockedByOther = !!lock && !viewer.isLockHolder;
  const releaseLock = () => setLock(null);

  // Escape closes side panel or exits fullscreen
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (gridMode === 'fullscreen') setGridMode('normal');
      else if (panelOpen) setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [gridMode, panelOpen]);

  // Right rail is entity-level: visible across all tabs. Hidden only when the
  // user explicitly widens the grid or enters fullscreen.
  const showRightRail = gridMode === 'normal';

  const togglePanel = (t) => {
    if (panelOpen && panelTab === t) setPanelOpen(false);
    else {
      setPanelTab(t);
      setPanelOpen(true);
    }
  };

  // Fullscreen: render just the grid inside a fixed overlay
  if (gridMode === 'fullscreen' && tab === 'lines') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 95,
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}
        >
          <span className="x-mono" style={{ color: 'var(--fg-3)' }}>
            {invoice.id}
          </span>
          <span style={{ fontWeight: 500 }}>{invoice.vendor}</span>
          <span style={{ color: 'var(--fg-3)' }}>· {invoice.matter}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
            Press Esc to exit
          </span>
          <Button
            variant="secondary"
            size="sm"
            icon="minimize"
            onClick={() => setGridMode('normal')}
          >
            Exit
          </Button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <LineItemsTab
            invoice={invoice}
            gridMode={gridMode}
            onGridMode={setGridMode}
          />
        </div>
      </div>
    );
  }

  // Entity-level context rail button (Comments / Audit / People). Lives in
  // the right-edge icon strip; always accessible, never crowds the header.
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
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
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
                {invoice.vendor}
              </span>
              <button
                className="x-status-btn"
                onClick={() => setWorkflowOpen((v) => !v)}
                aria-expanded={workflowOpen}
                title="Show workflow"
              >
                <InvoiceStatus status={invoice.status} />
                <Icon
                  name="caretDown"
                  size={11}
                  className="x-status-btn__caret"
                  style={{
                    color: 'var(--fg-3)',
                    transform: workflowOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.12s ease',
                  }}
                />
              </button>
              <Badge variant="outline">
                Priority:{' '}
                {invoice.priority === 'high'
                  ? 'High'
                  : invoice.priority === 'med'
                    ? 'Medium'
                    : 'Low'}
              </Badge>
            </div>
            {/* Matter — primary identity (what the invoice is for).
              Format: {number} — {description} */}

            {/* Supporting entities — Vendor (who bills) and Client (who pays).
              Client follows the same "{code} — {name}" format as Matter. */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 20,
                rowGap: 6,
                marginTop: 10,
                fontSize: 'var(--fs-sm)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <Icon
                  name="briefcase"
                  size={14}
                  style={{ color: 'var(--fg-4)', flex: 'none' }}
                />
                <span
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-caps)',
                    color: 'var(--fg-3)',
                    fontWeight: 600,
                  }}
                >
                  Vendor
                </span>
                <span style={{ color: 'var(--fg-1)' }}>{invoice.vendor}</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <Icon
                  name="building"
                  size={14}
                  style={{ color: 'var(--fg-4)', flex: 'none' }}
                />
                <span
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-caps)',
                    color: 'var(--fg-3)',
                    fontWeight: 600,
                  }}
                >
                  Client
                </span>
                {invoice.clientCode && (
                  <span
                    className="x-mono"
                    style={{
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--a-700)',
                      fontWeight: 500,
                    }}
                  >
                    {invoice.clientCode}
                  </span>
                )}
                <span
                  style={{
                    color: invoice.client ? 'var(--fg-1)' : 'var(--fg-4)',
                  }}
                >
                  {invoice.client || '—'}
                </span>
              </div>
            </div>
          </div>
          <div
            className="x-page__actions"
            style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            <div className="x-nav-arrows" title="Previous / next invoice">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                title="Previous invoice"
              >
                <Icon name="chevronLeft" size={14} />
              </button>
              <button onClick={onNext} disabled={!hasNext} title="Next invoice">
                <Icon name="chevronRight" size={14} />
              </button>
            </div>
            <Button variant="ghost" icon="eye">
              Preview PDF
            </Button>
            <MoreActionsMenu invoice={invoice} />
            <Button
              variant="secondary"
              icon="x"
              disabled={lockedByOther}
              title={lockedByOther ? `Locked by ${lock.by}` : undefined}
            >
              Reject
            </Button>
            <Button
              variant="accent"
              icon="check"
              disabled={lockedByOther}
              title={lockedByOther ? `Locked by ${lock.by}` : undefined}
            >
              Approve
            </Button>
          </div>
        </div>

        {/* Edit lock banner — shown when an invoice is currently being edited */}
        <EditLockBanner lock={lock} viewer={viewer} onRelease={releaseLock} />

        {/* Summary strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: 0,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            overflow: 'hidden',
          }}
        >
          <SummaryCell label="Total" value={fmtMoney(invoice.amount)} accent />
          <SummaryCell label="Line items" value={invoice.lines} />
          <SummaryCell label="Period" value="Apr 1 – 15, 2026" />
          <SummaryCell label="Submitted" value={fmtDate(invoice.submitted)} />
          <SummaryCell label="Due" value={fmtDate(invoice.due)} />
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          padding: '0 12px 0 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            {
              value: 'lines',
              label: 'Line items',
              icon: 'list',
              count: invoice.lines,
            },
            {
              value: 'attachments',
              label: 'Attachments',
              icon: 'paperclip',
              count: 4,
            },
            { value: 'documents', label: 'Generated PDF', icon: 'invoice' },
          ]}
        />
        <div style={{ flex: 1 }} />
        {gridMode === 'wide' && tab === 'lines' && (
          <Button
            variant="ghost"
            size="sm"
            icon="minimize"
            onClick={() => setGridMode('normal')}
            style={{ marginRight: 8 }}
          >
            Restore
          </Button>
        )}
      </div>

      {/* Body: tab content + entity-level right rail. No internal scrolling —
          the window scrolls. The side panel is an overlay, rendered separately. */}
      <div
        style={{
          padding: '24px 32px',
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {tab === 'lines' && (
            <LineItemsTab
              invoice={invoice}
              gridMode={gridMode}
              onGridMode={setGridMode}
            />
          )}
          {tab === 'attachments' && <AttachmentsTab />}
          {tab === 'documents' && (
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                color: 'var(--fg-3)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Icon name="invoice" size={24} />
              <div style={{ marginTop: 8 }}>
                Generated PDF + LEDES 1998B output appears here once approved.
              </div>
            </div>
          )}
        </div>
        {showRightRail && <RightRail invoice={invoice} />}
      </div>

      {/* Spacer so content isn't hidden behind the docked workflow bar */}
      {workflowOpen && <div style={{ height: 120 }} aria-hidden="true" />}

      {/* Workflow bar — triggered by clicking the status badge */}
      {workflowOpen && (
        <WorkflowBar
          invoice={invoice}
          lock={lock}
          onClose={() => setWorkflowOpen(false)}
        />
      )}

      {/* Entity-level context rail — always visible right-edge icon strip */}
      <aside className="x-context-rail" aria-label="Invoice context">
        <RailButton
          value="comments"
          icon="comment"
          label="Comments"
          count={3}
        />
        <RailButton value="audit" icon="history" label="Audit" count={7} />
        <RailButton value="people" icon="users" label="People" />
      </aside>

      {/* Overlay drawer — entity-level context (applies to the whole invoice) */}
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
            storageKey="xtnd.detail.panelWidth"
            tabs={[
              {
                value: 'comments',
                label: 'Comments',
                icon: 'comment',
                count: 3,
              },
              { value: 'audit', label: 'Audit', icon: 'history', count: 7 },
              { value: 'people', label: 'People', icon: 'users' },
            ]}
            tab={panelTab}
            onTabChange={setPanelTab}
          >
            {panelTab === 'comments' && <CommentsTab />}
            {panelTab === 'audit' && <AuditTab />}
            {panelTab === 'people' && <ParticipantsPanel />}
          </SidePanel>
        </>
      )}
    </div>
  );
};

const SummaryCell = ({ label, value, accent }) => (
  <div
    style={{
      padding: '14px 18px',
      borderRight: '1px solid var(--border-subtle)',
    }}
  >
    <div
      style={{
        fontSize: 'var(--fs-xs)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
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
        color: accent ? 'var(--fg-1)' : 'var(--fg-1)',
        marginTop: 4,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </div>
  </div>
);

Object.assign(window, { InvoiceDetail });
