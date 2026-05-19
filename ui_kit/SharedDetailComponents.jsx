/* global React, ReactDOM, Icon, Button, IconButton, Badge, InvoiceStatus, Avatar, Tabs, Card, CollapsibleCard, Checkbox, Field, Input, Textarea, SidePanel, fmtMoney, fmtDate, fmtDateTime, cls, Breadcrumbs */

// =====================================================================
// SharedDetailComponents — reusable data + components for detail pages
// Extracted from paradigm-showcase.html so both index.html and the
// showcase can share them without duplication.
// =====================================================================

// ---------- Shared mock data ----------------------------------------
const INVOICE = {
  id: '1262',
  status: 'in_review',
  priority: 'high',
  amount: 142880.0,
  total: 142880.0,
  vendor: 'Morris Pine Chandler LLP',
  vendorCode: 'MPC',
  client: 'Acme Corporation',
  clientCode: 'ACM-001',
  matter: 'Patent Litigation — Northern District',
  matterCode: 'M-2024-00418',
  period: 'Apr 1 – 15, 2026',
  currency: 'USD',
  submitted: '2026-04-18',
  due: '2026-05-18',
  lines: 8,
  fees: 138420.0,
  expenses: 4460.0,
  adjustments: 0,
  editLock: { by: 'K. Alvarez', acquiredAt: '2026-04-19T08:30:00' },
};

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

const SAMPLE_EXPENSES = [
  {
    id: 1,
    date: '2026-04-02',
    expense: 'Court filing fees — Northern District of California',
    amount: 402.0,
  },
  {
    id: 2,
    date: '2026-04-08',
    expense: 'Expert consultant fee — forensic analysis',
    amount: 3500.0,
  },
  {
    id: 3,
    date: '2026-04-12',
    expense: 'Deposition transcript — Apex Court Reporters',
    amount: 285.0,
  },
  {
    id: 4,
    date: '2026-04-14',
    expense: 'Travel — client meeting (airfare + hotel)',
    amount: 1840.0,
  },
  {
    id: 5,
    date: '2026-05-01',
    expense: 'Electronic discovery hosting — May 2026',
    amount: 650.0,
  },
];

// ---------- Activity Log (event-shape based) ---------------------------

// Field label mapping — raw field → human-readable i18n label
const FIELD_LABELS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phone: 'Phone',
  status: 'Status',
  priority: 'Priority',
  amount: 'Amount',
  rate: 'Rate',
  managerId: 'Manager',
  assigneeId: 'Assignee',
  roleIds: 'Roles',
  tags: 'Tags',
  address: 'Address',
  'address.city': 'City',
  'address.state': 'State',
  'address.street1': 'Street',
  'address.postalCode': 'Postal Code',
  clientId: 'Client',
  matterId: 'Matter',
  handlingAttorneyId: 'Handling Attorney',
  responsibleAttorneyId: 'Responsible Attorney',
  billingPeriod: 'Billing Period',
  dueDate: 'Due Date',
  currency: 'Currency',
  description: 'Description',
  holdType: 'Hold Type',
  serviceType: 'Service Type',
};
const fieldLabel = (raw) =>
  FIELD_LABELS[raw] ||
  raw
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Id$/, '');

// Category → icon + color
const CATEGORY_STYLE = {
  entity: { icon: 'edit', color: 'var(--fg-2)' },
  auth: { icon: 'lock', color: 'var(--info-600)' },
  security: { icon: 'alertCircle', color: 'var(--warn-600)' },
  business: { icon: 'workflow', color: 'var(--a-600)' },
  system: { icon: 'settings', color: 'var(--fg-3)' },
  integration: { icon: 'link', color: 'var(--fg-2)' },
};

// Mock events covering ALL 6 change types + failure + metadata
const AUDIT_EVENTS = [
  {
    id: 'evt-010',
    timestamp: '2026-04-19T15:40:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'Marcus Orr', type: 'user' },
    reason: 'Paralegal rate per engagement letter',
    changes: [
      { type: 'scalar', field: 'rate', from: '$320.00', to: '$285.00' },
      { type: 'scalar', field: 'amount', from: '$2,080.00', to: '$1,852.50' },
    ],
  },
  {
    id: 'evt-009',
    timestamp: '2026-04-19T14:10:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'Eleanor Wu', type: 'user' },
    changes: [
      {
        type: 'state-transition',
        field: 'status',
        from: 'draft',
        to: 'in_review',
        reason: 'Moved to review after rate correction',
      },
    ],
  },
  {
    id: 'evt-008',
    timestamp: '2026-04-19T11:30:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'K. Alvarez', type: 'user' },
    changes: [
      {
        type: 'ref',
        field: 'handlingAttorneyId',
        refType: 'User',
        from: { id: 'u-10', label: 'S. Okonkwo' },
        to: { id: 'u-20', label: 'J. Bhatt' },
      },
    ],
  },
  {
    id: 'evt-007',
    timestamp: '2026-04-19T10:00:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'Priya Shah', type: 'user' },
    changes: [
      {
        type: 'ref-array',
        field: 'roleIds',
        refType: 'Role',
        added: [{ id: 'r-2', label: 'Reviewer' }],
        removed: [{ id: 'r-3', label: 'Observer' }],
      },
    ],
  },
  {
    id: 'evt-006',
    timestamp: '2026-04-19T09:15:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'Eleanor Wu', type: 'user' },
    changes: [
      {
        type: 'array',
        field: 'tags',
        added: ['urgent', 'rate-review'],
        removed: ['pending-intake'],
      },
    ],
  },
  {
    id: 'evt-005',
    timestamp: '2026-04-18T16:45:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'Morgan Patel', type: 'user' },
    changes: [
      {
        type: 'object',
        field: 'address',
        changes: [
          {
            type: 'scalar',
            field: 'address.city',
            from: 'Sydney',
            to: 'Melbourne',
          },
          { type: 'scalar', field: 'address.state', from: 'NSW', to: 'VIC' },
          {
            type: 'scalar',
            field: 'address.postalCode',
            from: '2000',
            to: '3000',
          },
        ],
      },
    ],
  },
  {
    id: 'evt-004',
    timestamp: '2026-04-18T16:28:00Z',
    category: 'entity',
    action: 'create',
    outcome: 'success',
    actor: { label: 'Morgan Patel', type: 'user' },
    changes: [
      {
        type: 'state-transition',
        field: 'status',
        from: null,
        to: 'submitted',
        reason: 'Initial submission',
      },
    ],
    metadata: { source: 'Client portal', lineItems: 47, total: 142880.0 },
  },
  {
    id: 'evt-003',
    timestamp: '2026-04-18T15:00:00Z',
    category: 'entity',
    action: 'update',
    outcome: 'success',
    actor: { label: 'K. Alvarez', type: 'user' },
    changes: [
      {
        type: 'scalar',
        field: 'description',
        from: 'Monthly retainer — March services',
        to: 'Monthly retainer — March 2026 professional services and disbursements',
      },
      {
        type: 'scalar',
        field: 'dueDate',
        from: 'Apr 30, 2026',
        to: 'May 18, 2026',
      },
      { type: 'scalar', field: 'priority', from: 'Normal', to: 'High' },
      {
        type: 'ref',
        field: 'clientId',
        refType: 'Client',
        from: null,
        to: { id: 'c-1', label: 'Morris Pine Chandler LLP' },
      },
    ],
  },
  {
    id: 'evt-002',
    timestamp: '2026-04-17T11:00:00Z',
    category: 'business',
    action: 'assign',
    outcome: 'success',
    actor: { label: 'System', type: 'system' },
    changes: [
      {
        type: 'ref',
        field: 'assigneeId',
        refType: 'User',
        from: null,
        to: { id: 'u-ewu', label: 'Eleanor Wu' },
      },
    ],
  },
  {
    id: 'evt-f01',
    timestamp: '2026-04-16T14:20:00Z',
    category: 'integration',
    action: 'sync',
    outcome: 'failure',
    actor: { label: 'System', type: 'system' },
    errorCode: 'SYNC_TIMEOUT',
    errorMessage: 'Connection to Clio timed out after 30s',
    changes: [],
  },
];

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

// ---------- User & Role shared mock data ----------------------------
const MASTER_ATTORNEYS = [
  { name: 'K. Alvarez', role: 'Responsible Attorney', title: 'Partner' },
  { name: 'J. Bhatt', role: 'Handling Attorney', title: 'Senior Associate' },
];
const COLLABORATORS = [
  { name: 'Eleanor Wu', role: 'Reviewer', you: true },
  { name: 'Priya Shah', role: 'Approver' },
  { name: 'Marcus Orr', role: 'Auditor' },
];
const ASSISTANTS = [{ name: 'Lisa Park', role: 'Legal Assistant' }];
const DELEGATORS = [
  { name: 'Robert Chen', role: 'Billing Partner', delegatedTo: 'Eleanor Wu' },
];
const CLIENT_CONTACTS = [
  {
    name: 'Sarah Mitchell',
    role: 'General Counsel',
    email: 'smitchell@acme.com',
    phone: '+1 (212) 555-0190',
  },
  {
    name: 'David Torres',
    role: 'AP Manager',
    email: 'dtorres@acme.com',
    phone: '+1 (212) 555-0142',
  },
];
const CLIENT_ADDRESSES = [
  {
    type: 'Headquarters',
    street1: '1200 Market Street',
    street2: 'Suite 4500',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'US',
    isPrimary: true,
  },
  {
    type: 'Billing',
    street1: '300 Park Avenue',
    street2: null,
    city: 'New York',
    state: 'NY',
    postalCode: '10022',
    country: 'US',
    isPrimary: false,
  },
];

// ---------- Utility helpers ------------------------------------------

// Action → human verb (no entity type prefix)
const actionVerb = (action) => {
  const map = {
    update: 'updated',
    create: 'created',
    delete: 'deleted',
    assign: 'assigned',
    sync: 'synced',
  };
  return map[action] || action;
};

// Group events by date
const groupByDate = (events) => {
  const groups = [];
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let currentGroup = null;
  events.forEach((e) => {
    const d = new Date(e.timestamp).toDateString();
    const label =
      d === today
        ? 'Today'
        : d === yesterday
          ? 'Yesterday'
          : fmtDate(e.timestamp);
    if (!currentGroup || currentGroup.label !== label) {
      currentGroup = { label, events: [] };
      groups.push(currentGroup);
    }
    currentGroup.events.push(e);
  });
  return groups;
};

const minutesSince = (iso) => {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
};

// ---------- Small utility components ---------------------------------

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

const PersonRow = ({ name, email, subtitle, you }) => (
  <div
    style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0' }}
  >
    <Avatar name={name} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
        {name}
        {you && (
          <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}> · you</span>
        )}
      </div>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
        {email ||
          subtitle ||
          `${name.toLowerCase().replace(/\.\s/g, '').replace(/\s/g, '.')}@acme.com`}
      </div>
    </div>
  </div>
);

const SectionLabel = ({ icon, children, actions }) => (
  <div
    style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
  >
    {icon && <Icon name={icon} size={13} style={{ color: 'var(--fg-4)' }} />}
    <span
      style={{
        fontSize: 'var(--fs-xs)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)',
        color: 'var(--fg-3)',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
    <div style={{ flex: 1 }} />
    {actions}
  </div>
);

const AddressCard = ({ addr }) => (
  <div
    style={{
      padding: '10px 14px',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-surface)',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}
  >
    <Icon
      name="building"
      size={14}
      style={{ color: 'var(--fg-4)', marginTop: 2, flex: 'none' }}
    />
    <div style={{ flex: 1, fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 2,
        }}
      >
        <span style={{ fontWeight: 500, color: 'var(--fg-1)' }}>
          {addr.type}
        </span>
        {addr.isPrimary && <Badge variant="accent">Primary</Badge>}
      </div>
      <div style={{ color: 'var(--fg-2)' }}>
        {addr.street1}
        <br />
        {addr.street2 && (
          <>
            {addr.street2}
            <br />
          </>
        )}
        {addr.city}, {addr.state} {addr.postalCode}
        <br />
        {addr.country}
      </div>
    </div>
  </div>
);

const BillStatus = ({ status }) => {
  const map = {
    draft: { variant: 'neutral', label: 'Draft' },
    under_review: { variant: 'warn', label: 'Under Review' },
    exception: { variant: 'danger', label: 'Exception' },
    over_cap: { variant: 'danger', label: 'Over the Cap' },
    processed: { variant: 'info', label: 'Processed' },
    closed: { variant: 'success', label: 'Closed' },
  };
  const s = map[status] || map.draft;
  return (
    <Badge variant={s.variant} dot>
      {s.label}
    </Badge>
  );
};

// Shared breadcrumb + prev/next row for all detail pages
const PageNav = ({ crumbs, prevLabel, nextLabel, onBack, onPrev, onNext }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--sp-group)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-inline)',
        minWidth: 0,
      }}
    >
      {onBack && (
        <div className="x-nav-arrows" style={{ flex: 'none' }}>
          <button type="button" onClick={onBack} title="Back">
            <Icon name="chevronLeft" size={14} />
          </button>
        </div>
      )}
      <Breadcrumbs items={crumbs} />
    </div>
    <div className="x-nav-arrows" style={{ flex: 'none' }}>
      <button
        disabled={!prevLabel}
        title={prevLabel ? `Previous: ${prevLabel}` : 'No previous'}
        onClick={onPrev}
      >
        <Icon name="chevronLeft" size={14} />
      </button>
      <button
        disabled={!nextLabel}
        title={nextLabel ? `Next: ${nextLabel}` : 'No next'}
        onClick={onNext}
      >
        <Icon name="chevronRight" size={14} />
      </button>
    </div>
  </div>
);

const CommentItem = ({ c, isReply }) => (
  <div style={{ display: 'flex', gap: 10, paddingLeft: isReply ? 40 : 0 }}>
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

// Render a single typed change entry
const ChangeEntry = ({ change, nested }) => {
  const label = fieldLabel(change.field);
  const indent = nested ? 16 : 0;

  if (change.type === 'scalar') {
    const isLong =
      (change.from && change.from.length > 40) ||
      (change.to && change.to.length > 40);
    if (isLong) {
      return (
        <div style={{ padding: '4px 0', paddingLeft: indent }}>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--fg-3)',
              fontWeight: 500,
              marginBottom: 3,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--danger-600)',
              textDecoration: 'line-through',
              opacity: 0.7,
              lineHeight: 1.4,
            }}
          >
            {change.from || '—'}
          </div>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--success-700)',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {change.to}
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          fontSize: 'var(--fs-xs)',
          padding: '3px 0',
          paddingLeft: indent,
        }}
      >
        <span style={{ color: 'var(--fg-3)', fontWeight: 500, minWidth: 90 }}>
          {label}
        </span>
        <span
          style={{
            textDecoration: 'line-through',
            color: 'var(--danger-600)',
            opacity: 0.7,
          }}
        >
          {change.from || '—'}
        </span>
        <Icon
          name="chevronRight"
          size={10}
          style={{ color: 'var(--fg-4)', flex: 'none' }}
        />
        <span style={{ color: 'var(--success-700)', fontWeight: 500 }}>
          {change.to}
        </span>
      </div>
    );
  }

  if (change.type === 'state-transition') {
    return (
      <div style={{ padding: '4px 0', paddingLeft: indent }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 'var(--fs-xs)',
          }}
        >
          <span style={{ color: 'var(--fg-3)', fontWeight: 500, minWidth: 90 }}>
            {label}
          </span>
          {change.from && <Badge variant="outline">{change.from}</Badge>}
          <Icon
            name="chevronRight"
            size={10}
            style={{ color: 'var(--fg-4)', flex: 'none' }}
          />
          <Badge variant="success">{change.to}</Badge>
        </div>
        {change.reason && (
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--fg-3)',
              marginTop: 2,
              paddingLeft: 98,
            }}
          >
            {change.reason}
          </div>
        )}
      </div>
    );
  }

  if (change.type === 'ref') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          fontSize: 'var(--fs-xs)',
          padding: '3px 0',
          paddingLeft: indent,
        }}
      >
        <span style={{ color: 'var(--fg-3)', fontWeight: 500, minWidth: 90 }}>
          {label}
        </span>
        {change.from ? (
          <span
            style={{ textDecoration: 'line-through', color: 'var(--fg-3)' }}
          >
            {change.from.label}
          </span>
        ) : (
          <span style={{ color: 'var(--fg-4)' }}>—</span>
        )}
        <Icon
          name="chevronRight"
          size={10}
          style={{ color: 'var(--fg-4)', flex: 'none' }}
        />
        <span style={{ color: 'var(--a-600)', fontWeight: 500 }}>
          {change.to?.label || '—'}
        </span>
      </div>
    );
  }

  if (change.type === 'ref-array') {
    return (
      <div style={{ padding: '3px 0', paddingLeft: indent }}>
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--fg-3)',
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        {(change.added || []).map((r, i) => (
          <div
            key={`a${i}`}
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--success-700)',
              paddingLeft: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            + {r.label}
          </div>
        ))}
        {(change.removed || []).map((r, i) => (
          <div
            key={`r${i}`}
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--danger-600)',
              paddingLeft: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            − {r.label}
          </div>
        ))}
      </div>
    );
  }

  if (change.type === 'array') {
    return (
      <div style={{ padding: '3px 0', paddingLeft: indent }}>
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--fg-3)',
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        {(change.added || []).map((v, i) => (
          <div
            key={`a${i}`}
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--success-700)',
              paddingLeft: 16,
            }}
          >
            + {v}
          </div>
        ))}
        {(change.removed || []).map((v, i) => (
          <div
            key={`r${i}`}
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--danger-600)',
              paddingLeft: 16,
            }}
          >
            − {v}
          </div>
        ))}
      </div>
    );
  }

  if (change.type === 'object') {
    return (
      <div style={{ padding: '3px 0', paddingLeft: indent }}>
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--fg-3)',
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        {(change.changes || []).map((c, ci) => (
          <ChangeEntry key={ci} change={c} nested />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        fontSize: 'var(--fs-xs)',
        color: 'var(--fg-3)',
        padding: '3px 0',
        paddingLeft: indent,
      }}
    >
      {label}: changed
    </div>
  );
};

// ---------- Feature components ----------------------------------------

// ActivityLog — reusable, works in side column, tab, sheet
const ActivityLog = ({ events = AUDIT_EVENTS, compact = false }) => {
  const [expanded, setExpanded] = React.useState(new Set());
  const [visibleCount, setVisibleCount] = React.useState(6);
  const toggleExpand = (id) =>
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const visible = events.slice(0, visibleCount);
  const groups = groupByDate(visible);
  const hasMore = visibleCount < events.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {groups.map((g) => (
        <div key={g.label}>
          <div
            style={{
              fontSize: 'var(--fs-xs)',
              fontWeight: 600,
              color: 'var(--fg-3)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-caps)',
              padding: '12px 0 8px',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: 4,
            }}
          >
            {g.label}
          </div>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: compact ? 13 : 15,
                top: 8,
                bottom: 8,
                width: 1,
                background: 'var(--border)',
              }}
            />
            {g.events.map((evt) => {
              const cat = CATEGORY_STYLE[evt.category] || CATEGORY_STYLE.entity;
              const isFail = evt.outcome === 'failure';
              const hasChanges = evt.changes && evt.changes.length > 0;
              const isOpen = expanded.has(evt.id);
              const circleSize = compact ? 28 : 32;
              const totalFieldChanges = hasChanges
                ? evt.changes.reduce(
                    (n, c) =>
                      n +
                      (c.type === 'object' && c.changes ? c.changes.length : 1),
                    0,
                  )
                : 0;

              return (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    gap: compact ? 10 : 14,
                    padding: `${compact ? 8 : 10}px 0`,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: circleSize,
                      height: circleSize,
                      borderRadius: '50%',
                      flex: 'none',
                      zIndex: 1,
                      display: 'grid',
                      placeItems: 'center',
                      background: isFail
                        ? 'var(--danger-50)'
                        : 'var(--bg-surface)',
                      border: `1px solid ${isFail ? 'var(--danger-200)' : 'var(--border)'}`,
                      color: isFail ? 'var(--danger-600)' : cat.color,
                    }}
                  >
                    <Icon
                      name={isFail ? 'x' : cat.icon}
                      size={compact ? 12 : 14}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--fs-sm)',
                          fontWeight: 500,
                          color: 'var(--fg-1)',
                        }}
                      >
                        {evt.actor.label}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--fs-sm)',
                          color: 'var(--fg-2)',
                        }}
                      >
                        {actionVerb(evt.action)}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                          marginLeft: 'auto',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {new Date(evt.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {isFail && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <Badge variant="danger">Failed</Badge>
                        <span
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--danger-600)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {evt.errorCode}
                        </span>
                        {evt.errorMessage && (
                          <span
                            style={{
                              fontSize: 'var(--fs-xs)',
                              color: 'var(--fg-3)',
                            }}
                          >
                            {evt.errorMessage}
                          </span>
                        )}
                      </div>
                    )}

                    {evt.metadata && !hasChanges && !isFail && (
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                          marginTop: 2,
                        }}
                      >
                        {evt.metadata.source && `${evt.metadata.source}`}
                        {evt.metadata.lineItems &&
                          ` · ${evt.metadata.lineItems} line items`}
                        {evt.metadata.total &&
                          ` · ${fmtMoney(evt.metadata.total)}`}
                      </div>
                    )}

                    {hasChanges && (
                      <div style={{ marginTop: 4 }}>
                        <button
                          onClick={() => toggleExpand(evt.id)}
                          style={{
                            all: 'unset',
                            cursor: 'pointer',
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--a-600)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span>
                            {totalFieldChanges}{' '}
                            {totalFieldChanges === 1
                              ? 'field changed'
                              : 'fields changed'}
                          </span>
                          <Icon
                            name={isOpen ? 'caretDown' : 'chevronRight'}
                            size={10}
                          />
                        </button>
                        {isOpen && (
                          <div
                            style={{
                              marginTop: 6,
                              padding: '8px 10px',
                              background: 'var(--n-25)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {evt.changes.map((c, ci) => (
                              <ChangeEntry key={ci} change={c} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {evt.reason && !hasChanges && (
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                          marginTop: 2,
                        }}
                      >
                        {evt.reason}
                      </div>
                    )}
                    {evt.reason && hasChanges && isOpen && (
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                          marginTop: 4,
                          fontStyle: 'italic',
                        }}
                      >
                        Reason: {evt.reason}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setVisibleCount((c) => c + 6)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '12px 0',
            fontSize: 'var(--fs-sm)',
            color: 'var(--a-600)',
            fontWeight: 500,
            borderTop: '1px solid var(--border-subtle)',
            marginTop: 8,
          }}
        >
          Load more <Icon name="caretDown" size={12} />
        </button>
      )}
    </div>
  );
};

// AuditTimeline — shared, scoped by context
const AuditTimeline = ({ compact, events }) => (
  <ActivityLog events={events || AUDIT_EVENTS} compact={compact} />
);

// CommentsContent — shared comment UI, same everywhere
const CommentsContent = () => {
  const [draft, setDraft] = React.useState('');
  const comments = SAMPLE_COMMENTS;
  const placeholder =
    'Leave a comment. Use @ to mention, # to reference a line.';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-section)',
      }}
    >
      <div>
        <Textarea
          rows={3}
          placeholder={placeholder}
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
      {comments.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-section)',
          }}
        >
          {comments.map((c, i) => (
            <React.Fragment key={c.id}>
              {i > 0 && !c.thread && <hr className="x-divider" />}
              <CommentItem c={c} isReply={!!c.thread} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--sp-page-y)',
            color: 'var(--fg-3)',
            fontSize: 'var(--fs-sm)',
          }}
        >
          No comments yet.
        </div>
      )}
    </div>
  );
};

// SummaryContent — invoice summary panel
const SummaryContent = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px 16px',
    }}
  >
    <div style={{ gridColumn: '1 / -1' }}>
      <MetaRow label="Client">{INVOICE.vendor}</MetaRow>
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <MetaRow label="Matter">{INVOICE.matter}</MetaRow>
    </div>
    <MetaRow label="Period">{INVOICE.period}</MetaRow>
    <MetaRow label="Currency">{INVOICE.currency}</MetaRow>
    <MetaRow label="Submitted">{fmtDate(INVOICE.submitted)}</MetaRow>
    <MetaRow label="Due">{fmtDate(INVOICE.due)}</MetaRow>
    <hr
      className="x-divider"
      style={{ margin: '4px 0', gridColumn: '1 / -1' }}
    />
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
        <span className="x-num">{fmtMoney(INVOICE.fees)}</span>
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
        <span className="x-num">{fmtMoney(INVOICE.expenses)}</span>
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
        <span className="x-num">-{fmtMoney(INVOICE.adjustments)}</span>
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
          {fmtMoney(INVOICE.amount)}
        </span>
      </div>
    </div>
  </div>
);

// ExpensesGrid — using shared DataGrid
const EXPENSE_COLUMNS = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    width: 120,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtDate(v)}</span>,
  },
  {
    key: 'expense',
    label: 'Expense',
    sortable: true,
    wrap: true,
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
    render: () => <IconButton icon="edit" title="Edit expense" />,
  },
];

const ExpensesGrid = () => {
  const gf = _W.useGridFilters({ rows: SAMPLE_EXPENSES, filterFields: [] });
  const [sort, setSort] = React.useState({ key: 'date', dir: 'asc' });
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const total = gf.filteredRows.reduce((s, e) => s + e.amount, 0);
  const displayRows = gf.filteredRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <_W.DataGrid
      columns={EXPENSE_COLUMNS}
      rows={displayRows}
      sort={sort}
      onSortChange={setSort}
      className="x-grid-wrap--flat"
      toolbar={
        <>
          <_W.GridSearchInput {...gf.searchProps} placeholder="Search expenses…" />
          <div className="x-grid-toolbar__spacer" />
          <span className="x-grid-toolbar__count">
            {gf.filteredCount} expenses · {fmtMoney(total)}
          </span>
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
    />
  );
};

// AttachmentsContent — list/card toggle file view
const AttachmentsContent = () => {
  const [view, setView] = React.useState('list');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-group)',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-inline)',
        }}
      >
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>
          {SAMPLE_FILES.length} files
        </span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'inline-flex',
            gap: 1,
            background: 'var(--n-100)',
            padding: 2,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <button
            onClick={() => setView('list')}
            title="List view"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: view === 'list' ? 'var(--fg-1)' : 'var(--fg-3)',
              background: view === 'list' ? 'var(--bg-surface)' : 'transparent',
              boxShadow:
                view === 'list' ? '0 0 0 1px var(--border-subtle)' : 'none',
            }}
          >
            <Icon name="list" size={14} />
          </button>
          <button
            onClick={() => setView('card')}
            title="Card view"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: view === 'card' ? 'var(--fg-1)' : 'var(--fg-3)',
              background: view === 'card' ? 'var(--bg-surface)' : 'transparent',
              boxShadow:
                view === 'card' ? '0 0 0 1px var(--border-subtle)' : 'none',
            }}
          >
            <Icon name="grid" size={14} />
          </button>
        </div>
        <Button variant="secondary" size="sm" icon="upload">
          Upload
        </Button>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="x-grid-wrap" style={{ boxShadow: 'none' }}>
          <table className="x-grid">
            <thead>
              <tr>
                <th style={{ width: 44 }}></th>
                <th>Name</th>
                <th style={{ width: 90 }}>Size</th>
                <th style={{ width: 140 }}>Uploaded by</th>
                <th style={{ width: 120 }}>Date</th>
                <th className="x-cell--actions"></th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_FILES.map((f) => (
                <tr key={f.name} style={{ cursor: 'pointer' }}>
                  <td style={{ padding: '6px 12px' }}>
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
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                        }}
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
      )}

      {/* Card view */}
      {view === 'card' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--sp-group)',
          }}
        >
          {SAMPLE_FILES.map((f) => (
            <div
              key={f.name}
              className="x-card"
              style={{
                padding: 'var(--sp-group)',
                display: 'flex',
                gap: 'var(--sp-group)',
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
                  {f.size} · {f.by}
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                  {fmtDate(f.at)}
                </div>
              </div>
              <IconButton icon="download" />
            </div>
          ))}
          {/* Upload placeholder card */}
          <div
            className="x-card"
            style={{
              padding: 'var(--sp-group)',
              display: 'flex',
              gap: 'var(--sp-group)',
              alignItems: 'center',
              justifyContent: 'center',
              borderStyle: 'dashed',
              color: 'var(--fg-3)',
              cursor: 'pointer',
              minHeight: 80,
            }}
          >
            <Icon name="upload" size={14} /> Upload file
          </div>
        </div>
      )}
    </div>
  );
};

// LineRowMenu — portal dropdown for line-level actions
const LineRowMenu = ({ lineId, onHistory, onDelete }) => {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const btnRef = React.useRef(null);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      )
        setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.right - 160 });
    }
    setOpen((v) => !v);
  };
  return (
    <>
      <span ref={btnRef}>
        <IconButton icon="more" title="More actions" onClick={toggle} />
      </span>
      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              minWidth: 160,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 9999,
              padding: 4,
              fontSize: 'var(--fs-sm)',
            }}
          >
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onHistory && onHistory(lineId);
              }}
              style={{
                all: 'unset',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box',
                color: 'var(--fg-1)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--bg-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <Icon name="history" size={14} style={{ color: 'var(--fg-3)' }} />
              History
            </button>
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onDelete && onDelete(lineId);
              }}
              style={{
                all: 'unset',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                width: '100%',
                boxSizing: 'border-box',
                color: 'var(--danger-600)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--bg-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <Icon
                name="xCircle"
                size={14}
                style={{ color: 'var(--danger-600)' }}
              />
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

// LineItemsGrid — full line items table using shared DataGrid
const _W = new Proxy({}, { get: (_, k) => window[k] });

const makeLineItemColumns = (setDrawer) => [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    width: 90,
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtDate(v)}</span>,
  },
  {
    key: 'tk',
    label: 'Timekeeper',
    sortable: true,
    width: 140,
    render: (_, r) => (
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
        <span>{r.tk}</span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{r.lvl}</span>
      </div>
    ),
  },
  { key: 'task', label: 'Task', sortable: true, width: 70, className: 'x-cell--mono' },
  { key: 'act', label: 'Activity', sortable: true, width: 70, className: 'x-cell--mono' },
  {
    key: 'desc',
    label: 'Description',
    wrap: true,
    render: (v, r) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0' }}>
        <span>{v}</span>
        {r.flags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {r.flags.map((f) => <FlagTag key={f} kind={f} />)}
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'hrs',
    label: 'Hours',
    sortable: true,
    width: 60,
    align: 'right',
    className: 'x-cell--num',
    render: (v) => v.toFixed(1),
  },
  {
    key: 'rate',
    label: 'Rate',
    sortable: true,
    width: 80,
    align: 'right',
    className: 'x-cell--num',
    render: (v) => <span style={{ color: 'var(--fg-2)' }}>{fmtMoney(v)}</span>,
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    width: 110,
    align: 'right',
    className: 'x-cell--num',
    render: (v) => <span style={{ fontWeight: 500 }}>{fmtMoney(v)}</span>,
  },
  {
    key: '_actions',
    label: '',
    width: 120,
    className: 'x-cell--actions',
    render: (_, r) => (
      <div style={{ display: 'inline-flex', gap: 2 }}>
        <IconButton icon="edit" title="Edit line item" />
        <IconButton icon="comment" title="Comments" onClick={() => setDrawer('comments')} />
        <LineRowMenu lineId={r.id} onHistory={() => setDrawer('history')} onDelete={() => {}} />
      </div>
    ),
  },
];

const LineItemsGrid = ({ fullWidth }) => {
  const [selected, setSelected] = React.useState(new Set());
  const [drawer, setDrawer] = React.useState(null);
  const [sort, setSort] = React.useState({ key: 'date', dir: 'asc' });
  const [columns, setColumns] = React.useState(() => makeLineItemColumns(setDrawer));

  const totals = SAMPLE_LINES.reduce(
    (a, l) => ({ hrs: a.hrs + l.hrs, amt: a.amt + l.amount }),
    { hrs: 0, amt: 0 },
  );

  const allSelected = selected.size === SAMPLE_LINES.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-section)' }}>
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
        <Icon name="alertCircle" size={14} style={{ color: 'var(--warn-500)' }} />
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--warn-700)', fontWeight: 500 }}>
          4 line items flagged by policy rules
        </span>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--warn-700)' }}>
          · Block billing (2) · Rate mismatch (1) · Vague description (1)
        </span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">Review flags</Button>
      </div>

      <_W.DataGrid
        columns={columns}
        rows={SAMPLE_LINES}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={setSort}
        settingsEnabled
        onColumnsChange={setColumns}
        className="x-grid-wrap--flat"
        toolbar={
          <>
            <Button variant="secondary" size="sm" icon="filter">Filter</Button>
            <Button variant="ghost" size="sm" icon="sparkles">AI audit</Button>
            <div className="x-grid-toolbar__spacer" />
            <span className="x-grid-toolbar__count">
              {SAMPLE_LINES.length} lines · {totals.hrs.toFixed(1)}h · {fmtMoney(totals.amt)}
            </span>
            <Button variant="secondary" size="sm" icon="download">Export</Button>
          </>
        }
      />

      {drawer && <ScopedDrawer type={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
};

// PeopleContent — attorneys, collaborators, assistants, delegators, client contacts
const PeopleContent = () => {
  const [dialog, setDialog] = React.useState(null); // null | 'collaborators' | 'assistants' | 'contacts'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 900,
      }}
    >
      {/* Master-level attorneys */}
      <section>
        <SectionLabel icon="briefcase">Attorneys</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--sp-group)',
          }}
        >
          {MASTER_ATTORNEYS.map((p) => (
            <div
              key={p.name}
              className="x-card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <Avatar name={p.name} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--a-700)',
                    fontWeight: 500,
                  }}
                >
                  {p.role}
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                  {p.title}
                </div>
              </div>
              <IconButton icon="more" />
            </div>
          ))}
        </div>
      </section>

      {/* Collaborators */}
      <section>
        <SectionLabel
          icon="users"
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon="user"
              onClick={() => setDialog('collaborators')}
            >
              Add
            </Button>
          }
        >
          Collaborators
        </SectionLabel>
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            padding: '4px 14px',
          }}
        >
          {COLLABORATORS.map((p) => (
            <PersonRow key={p.name} {...p} />
          ))}
        </div>
      </section>

      {/* Assistants */}
      <section>
        <SectionLabel
          icon="user"
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon="user"
              onClick={() => setDialog('assistants')}
            >
              Add
            </Button>
          }
        >
          Assistants
        </SectionLabel>
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            padding: '4px 14px',
          }}
        >
          {ASSISTANTS.map((p) => (
            <PersonRow key={p.name} {...p} />
          ))}
        </div>
      </section>

      {/* Delegators */}
      <section>
        <SectionLabel icon="workflow">Delegators</SectionLabel>
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            padding: '4px 14px',
          }}
        >
          {DELEGATORS.map((p) => (
            <PersonRow
              key={p.name}
              {...p}
              subtitle={`Delegated to ${p.delegatedTo}`}
            />
          ))}
        </div>
      </section>

      <hr className="x-divider" />

      {/* Client contacts */}
      <section>
        <SectionLabel
          icon="building"
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon="user"
              onClick={() => setDialog('contacts')}
            >
              Add contact
            </Button>
          }
        >
          Client contacts
        </SectionLabel>
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            padding: '4px 14px',
          }}
        >
          {CLIENT_CONTACTS.map((p) => (
            <PersonRow key={p.name} name={p.name} email={p.email} />
          ))}
        </div>
      </section>

      {/* Client addresses */}
      <section>
        <SectionLabel icon="matter">Client addresses</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 10,
          }}
        >
          {CLIENT_ADDRESSES.map((a) => (
            <AddressCard key={a.type} addr={a} />
          ))}
        </div>
      </section>

      {/* Manage dialogs */}
      {dialog === 'collaborators' && (
        <ManagePeopleDialog
          title="Manage Collaborators"
          description="Manage which team members can view and collaborate on this invoice."
          currentMembers={COLLABORATORS}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'assistants' && (
        <ManagePeopleDialog
          title="Manage Assistants"
          description="Add or remove assistants who support the review process."
          currentMembers={ASSISTANTS}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'contacts' && (
        <ManagePeopleDialog
          title="Manage Client Contacts"
          description="Add or remove client contacts associated with this invoice."
          currentMembers={CLIENT_CONTACTS.map((c) => ({
            name: c.name,
            role: c.role,
          }))}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
};

// ManagePeopleDialog — reusable modal for adding people
const ManagePeopleDialog = ({
  title,
  description,
  currentMembers,
  onClose,
}) => {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'hsla(0,0%,0%,0.3)',
          zIndex: 9998,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 420,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '20px 24px 0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-xl)',
                fontWeight: 500,
                color: 'var(--fg-1)',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 'var(--fs-sm)',
                color: 'var(--fg-3)',
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          </div>
          <IconButton icon="x" onClick={onClose} />
        </div>
        <div style={{ padding: '16px 24px' }}>
          <div style={{ position: 'relative' }}>
            <Input placeholder="Select users..." style={{ paddingRight: 32 }} />
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
        </div>
        {currentMembers && currentMembers.length > 0 && (
          <div
            style={{
              padding: '0 24px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--fg-3)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
              }}
            >
              Current
            </div>
            {currentMembers.map((m) => (
              <div
                key={m.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                }}
              >
                <Avatar name={m.name} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
                    {m.name}
                  </div>
                  <div
                    style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}
                  >
                    {m.email ||
                      `${m.name.toLowerCase().replace(/\.\s/g, '').replace(/\s/g, '.')}@acme.com`}
                  </div>
                </div>
                <IconButton icon="x" title={`Remove ${m.name}`} />
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" icon="check">
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

// ScopedDrawer — resizable drawer for Comments or History
const ScopedDrawer = ({ type, onClose }) => {
  const [width, setWidth] = React.useState(440);
  const widthRef = React.useRef(width);
  widthRef.current = width;
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = widthRef.current;
    const maxW = Math.round(window.innerWidth * 0.5);
    const onMove = (ev) =>
      setWidth(Math.max(320, Math.min(maxW, startW + (startX - ev.clientX))));
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  return (
    <>
      <div className="ps-drawer-scrim" onClick={onClose} />
      <aside className="ps-drawer" style={{ width }}>
        <div
          className="ps-side-col__resizer"
          onMouseDown={onMouseDown}
          title="Drag to resize"
          style={{
            left: -3,
            top: 0,
            bottom: 0,
            width: 6,
            position: 'absolute',
            cursor: 'col-resize',
            zIndex: 2,
          }}
        />
        <div className="ps-drawer__header">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              flex: 1,
            }}
          >
            {type === 'comments' ? 'Comments' : 'History'}
          </span>
          <IconButton icon="x" onClick={onClose} />
        </div>
        <div className="ps-drawer__body">
          {type === 'comments' && <CommentsContent />}
          {type === 'history' && <AuditTimeline compact />}
        </div>
      </aside>
    </>
  );
};

// EditLockBannerP — edit lock warning banner
const EditLockBannerP = ({ lock, onForceRelease }) => {
  if (!lock) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-group)',
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
        <strong>{lock.by}</strong> is editing this invoice · acquired{' '}
        {minutesSince(lock.acquiredAt)}.
        <span style={{ color: 'var(--fg-2)' }}>
          {' '}
          Approve and Reject are disabled until edit mode is turned off.
        </span>
      </div>
      {onForceRelease && (
        <Button variant="danger" size="sm" icon="lock" onClick={onForceRelease}>
          Force Release
        </Button>
      )}
    </div>
  );
};

// WorkflowSheet — bottom sheet for workflow states
const WorkflowSheet = ({ invoice, lock, onClose }) => {
  const currentIdx = 4;
  const doneCount = 4;
  return (
    <>
      <div className="ps-wf-scrim" onClick={onClose} />
      <div className="ps-wf-sheet">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 'var(--fs-sm)',
              fontWeight: 600,
              color: 'var(--fg-1)',
            }}
          >
            Workflow
          </span>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
            Currently at{' '}
            <strong style={{ color: 'var(--fg-1)' }}>
              {WORKFLOW_STATES[currentIdx].label}
            </strong>
          </span>
          <div style={{ flex: 1 }} />
          <IconButton icon="x" onClick={onClose} />
        </div>
        <div className="x-wf-steps">
          {WORKFLOW_STATES.map((s, i) => {
            const isCurrent = i === currentIdx;
            const isDone = i < doneCount;
            const cn = [
              'x-wf-step',
              isDone && 'is-done',
              isCurrent && 'is-current',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <div key={s.key} className={cn}>
                <div className="x-wf-step__circle">
                  {isDone ? (
                    <Icon name="check" size={14} />
                  ) : (
                    <Icon name={s.icon} size={13} />
                  )}
                </div>
                <div className="x-wf-step__label">{s.label}</div>
                <div className="x-wf-step__hint">
                  {s.key === 'editing' && lock ? (
                    <>
                      Locked by{' '}
                      <strong style={{ color: 'var(--fg-2)' }}>
                        {lock.by}
                      </strong>
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
    </>
  );
};

// MoreActionsDropdown — header more-actions menu
const MoreActionsDropdown = () => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = [
    { group: 'Actions' },
    {
      icon: 'link',
      label: 'Copy share link',
      hint: 'Copy a direct link to this invoice',
    },
    { icon: 'external', label: 'Open in legacy console' },
    { group: 'Export' },
    { icon: 'download', label: 'Export LEDES 1998B' },
    { icon: 'download', label: 'Export PDF' },
    { icon: 'upload', label: 'Replace source file…' },
    { group: 'Admin' },
    {
      icon: 'lock',
      label: 'Put on hold',
      hint: 'Pauses workflow and notifies client',
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

// InvoiceHeader — shared between 1A and 1B
// editState: 'none' | 'self' | 'other'
const InvoiceHeader = ({
  editState,
  lock,
  onStartEdit,
  onStopEdit,
  onForceRelease,
  workflowOpen,
  onToggleWorkflow,
  onBack,
}) => {
  const lockedByOther = editState === 'other';
  const editingSelf = editState === 'self';
  return (
    <div
      style={{
        padding: 'var(--sp-page-y) var(--sp-page-x)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-section)',
      }}
    >
      <PageNav
        onBack={onBack || (() => {})}
        crumbs={[
          { label: 'Willow' },
          { label: 'Invoices' },
          { label: INVOICE.id },
        ]}
        prevLabel="1261"
        nextLabel="1263"
      />
      {/* Row 1: Client name (left) + Actions (right) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--sp-section)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-2xl)',
            fontWeight: 500,
            color: 'var(--fg-1)',
            margin: 0,
            minWidth: 0,
          }}
        >
          {INVOICE.vendor}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flex: 'none',
          }}
        >
          {editingSelf ? (
            <Button
              variant="secondary"
              icon="check"
              onClick={onStopEdit}
              title="Release edit lock and stop editing"
            >
              Stop Editing
            </Button>
          ) : !lockedByOther ? (
            <Button
              variant="secondary"
              icon="edit"
              onClick={onStartEdit}
              title="Take edit lock to make changes"
            >
              Edit
            </Button>
          ) : null}
          <MoreActionsDropdown />
          <Button
            variant="secondary"
            icon="x"
            disabled={lockedByOther || editingSelf}
            title={
              lockedByOther
                ? `Locked by ${lock.by} — cannot reject while editing`
                : editingSelf
                  ? 'Stop editing before rejecting'
                  : 'Reject this invoice'
            }
          >
            Reject
          </Button>
          <Button
            variant="accent"
            icon="check"
            disabled={lockedByOther || editingSelf}
            title={
              lockedByOther
                ? `Locked by ${lock.by} — cannot approve while editing`
                : editingSelf
                  ? 'Stop editing before approving'
                  : 'Approve this invoice'
            }
          >
            Approve
          </Button>
        </div>
      </div>
      {/* Row 2: Status + amount + priority + matter context */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          marginTop: 'calc(var(--sp-group) * -0.5)',
        }}
      >
        <button
          className="x-status-btn"
          onClick={onToggleWorkflow}
          aria-expanded={workflowOpen}
          title="Show workflow"
        >
          <InvoiceStatus status={INVOICE.status} />
          <Icon
            name="caretDown"
            size={11}
            style={{
              color: 'var(--fg-3)',
              transform: workflowOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.12s ease',
            }}
          />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-lg)',
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--fg-1)',
          }}
        >
          {fmtMoney(INVOICE.amount)}
        </span>
        <Badge variant="outline">Priority: High</Badge>
        <span
          style={{ color: 'var(--border)', userSelect: 'none' }}
          aria-hidden
        >
          ·
        </span>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--fs-sm)',
          }}
        >
          <Icon
            name="matter"
            size={13}
            style={{ color: 'var(--fg-4)', flex: 'none' }}
          />
          <span style={{ color: 'var(--fg-2)' }}>{INVOICE.matter}</span>
        </div>
      </div>
      {/* Banner only for others — not shown when you're the editor */}
      {lockedByOther && (
        <EditLockBannerP lock={lock} onForceRelease={onForceRelease} />
      )}
    </div>
  );
};

// ---------- Content Layout Toggle (for Comments/Audit in 1B) ----------
const ContentLayoutToggle = ({ children, contextPanel }) => {
  const [layout, setLayout] = React.useState('compact');
  const options = [
    { value: 'compact', label: 'Compact', icon: 'list' },
    { value: 'split', label: 'Split view', icon: 'sidebar' },
    { value: 'full', label: 'Full width', icon: 'maximize' },
  ];
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            gap: 1,
            background: 'var(--n-100)',
            padding: 2,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => setLayout(o.value)}
              title={o.label}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 'var(--fs-xs)',
                fontWeight: 500,
                color: layout === o.value ? 'var(--fg-1)' : 'var(--fg-3)',
                background:
                  layout === o.value ? 'var(--bg-surface)' : 'transparent',
                boxShadow:
                  layout === o.value
                    ? '0 0 0 1px var(--border-subtle)'
                    : 'none',
              }}
            >
              <Icon name={o.icon} size={12} />
              {o.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
          {layout === 'compact' && '600px max — optimal for reading'}
          {layout === 'split' && 'Content + context side-by-side'}
          {layout === 'full' && 'Full width — stretches to fill'}
        </span>
      </div>
      {layout === 'compact' && <div style={{ maxWidth: 600 }}>{children}</div>}
      {layout === 'split' && (
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 600px', maxWidth: 680, minWidth: 0 }}>
            {children}
          </div>
          <div style={{ flex: '0 0 280px', position: 'sticky', top: 120 }}>
            {contextPanel}
          </div>
        </div>
      )}
      {layout === 'full' && <div>{children}</div>}
    </div>
  );
};

// Context panel for Comments split view
const CommentsContextPanel = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-section)',
    }}
  >
    <div>
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
        Filter
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['All', 'Open', 'Resolved'].map((f, i) => (
          <button
            key={f}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 500,
              color: i === 0 ? 'var(--a-700)' : 'var(--fg-3)',
              background: i === 0 ? 'var(--a-50)' : 'var(--n-50)',
            }}
          >
            {f}
          </button>
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
          marginBottom: 8,
        }}
      >
        Linked lines
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { line: 4, label: 'Rate mismatch — paralegal rate', resolved: true },
          { line: 5, label: 'Block billing — 8.2 hours', resolved: false },
        ].map((l) => (
          <div
            key={l.line}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 'var(--fs-sm)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            <Badge variant="outline">Line {l.line}</Badge>
            <span
              style={{
                flex: 1,
                color: 'var(--fg-2)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {l.label}
            </span>
            {l.resolved && (
              <Icon
                name="check"
                size={12}
                style={{ color: 'var(--success-500)', flex: 'none' }}
              />
            )}
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
          marginBottom: 8,
        }}
      >
        Participants
      </div>
      <div style={{ display: 'flex', gap: -4 }}>
        {['Eleanor Wu', 'K. Alvarez', 'Marcus Orr'].map((n) => (
          <Avatar key={n} name={n} size="sm" style={{ marginLeft: -4 }} />
        ))}
        <span
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--fg-3)',
            marginLeft: 8,
            alignSelf: 'center',
          }}
        >
          3 people
        </span>
      </div>
    </div>
  </div>
);

// Context panel for Audit split view
const AuditContextPanel = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-section)',
    }}
  >
    <div>
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
        Record info
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MetaRow label="Created">Apr 18, 2026</MetaRow>
        <MetaRow label="Created by">Morgan Patel</MetaRow>
        <MetaRow label="Last updated">Apr 19, 2026</MetaRow>
        <MetaRow label="Updated by">Marcus Orr</MetaRow>
      </div>
    </div>
  </div>
);

// ---------- Export everything to global scope -------------------------
Object.assign(window, {
  // Data
  INVOICE,
  SAMPLE_LINES,
  SAMPLE_COMMENTS,
  SAMPLE_FILES,
  SAMPLE_EXPENSES,
  AUDIT_EVENTS,
  FIELD_LABELS,
  CATEGORY_STYLE,
  WORKFLOW_STATES,
  MASTER_ATTORNEYS,
  COLLABORATORS,
  ASSISTANTS,
  DELEGATORS,
  CLIENT_CONTACTS,
  CLIENT_ADDRESSES,
  // Utilities
  fieldLabel,
  actionVerb,
  groupByDate,
  minutesSince,
  // Small components
  FlagTag,
  MetaRow,
  FileIcon,
  PersonRow,
  SectionLabel,
  AddressCard,
  BillStatus,
  PageNav,
  CommentItem,
  ChangeEntry,
  // Feature components
  ActivityLog,
  AuditTimeline,
  CommentsContent,
  SummaryContent,
  ExpensesGrid,
  AttachmentsContent,
  LineRowMenu,
  LineItemsGrid,
  PeopleContent,
  ManagePeopleDialog,
  ScopedDrawer,
  EditLockBannerP,
  WorkflowSheet,
  MoreActionsDropdown,
  InvoiceHeader,
  ContentLayoutToggle,
  CommentsContextPanel,
  AuditContextPanel,
});
