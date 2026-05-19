// =====================================================================
// Paradigm Showcase — all detail page layout paradigms
// Shared data and components loaded from SharedDetailComponents.jsx
// InvoiceDetailP1 loaded from InvoiceDetailP1.jsx
// =====================================================================

const USER = {
  name: 'Sarah Chen',
  role: 'Billing Reviewer',
  email: 'sarah.chen@sterlingmcgill.com',
  phone: '+1 (415) 555-0142',
  department: 'Finance',
  location: 'San Francisco, CA',
  timezone: 'America/Los_Angeles (PT)',
  manager: 'David Kim',
  createdAt: '2024-06-15',
  lastLogin: '2026-05-15T14:32:00',
  teams: ['Billing', 'AP Review', 'Month-End Close'],
  permissions: [
    'Invoice Review',
    'Vendor Bills',
    'Matter Mgmt',
    'Reports',
    'Trust (read)',
  ],
  activity: [
    {
      icon: 'check',
      action: 'Approved invoice INV-2024-0891',
      time: '2 hours ago',
    },
    {
      icon: 'comment',
      action: 'Commented on INV-2024-0887',
      time: '5 hours ago',
    },
    { icon: 'x', action: 'Rejected invoice INV-2024-0882', time: 'Yesterday' },
    {
      icon: 'settings',
      action: 'Updated profile settings',
      time: '3 days ago',
    },
    {
      icon: 'users',
      action: 'Joined team "Month-End Close"',
      time: '6 days ago',
    },
  ],
};

const ROLE = {
  name: 'Billing Reviewer',
  type: 'Custom',
  description:
    'Can review, annotate and approve invoices. Cannot modify billing rates or access trust accounts.',
  memberCount: 12,
  createdAt: '2024-01-10',
  updatedAt: '2026-04-22',
  updatedBy: 'David Kim',
  permissions: [
    {
      group: 'Invoices',
      items: ['View', 'Review', 'Approve', 'Reject', 'Comment'],
    },
    { group: 'Vendor Bills', items: ['View'] },
    { group: 'Matters', items: ['View', 'Edit'] },
    { group: 'Reports', items: ['View', 'Export'] },
    { group: 'Trust Accounting', items: [] },
    { group: 'Admin', items: [] },
  ],
  members: [
    { name: 'Sarah Chen', dept: 'Finance' },
    { name: 'Marcus Orr', dept: 'Finance' },
    { name: 'Lisa Park', dept: 'Legal Ops' },
    { name: 'James Wright', dept: 'Accounting' },
    { name: 'Nina Patel', dept: 'Finance' },
  ],
};

const PS_BILL = {
  id: 'VB-2024-0087',
  status: 'under_review',
  vendor: 'Apex Legal Services',
  amount: 18878.18,
  received: '2026-04-08',
  due: '2026-05-08',
  rev: 2,
};

// Shared data (FIELD_LABELS, AUDIT_EVENTS, CATEGORY_STYLE, etc.)
// and shared components (ActivityLog, CommentsContent, SummaryContent, etc.)
// are loaded from SharedDetailComponents.jsx

const PS_BILL_LINES = [
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

const PS_SAMPLE_DOCS = [
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

// ---------- Reusable edit patterns ----------------------------------

// EditableSection: a card that toggles between read and edit mode
const EditableSection = ({
  title,
  icon,
  editing,
  onEdit,
  onCancel,
  onSave,
  children,
}) => (
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
        gap: 8,
      }}
    >
      {icon && <Icon name={icon} size={14} style={{ color: 'var(--fg-2)' }} />}
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-lg)',
        }}
      >
        {title}
      </span>
      <div style={{ flex: 1 }} />
      {editing ? (
        <>
          <Badge variant="info">Editing</Badge>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" icon="edit" onClick={onEdit}>
          Edit
        </Button>
      )}
    </header>
    <div style={{ padding: 20 }}>{children}</div>
    {editing && (
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
        <Button variant="accent" icon="check" onClick={onSave}>
          Save Changes
        </Button>
      </footer>
    )}
  </section>
);

// EditableField: renders as text in read mode, input in edit mode
const EditableField = ({
  label,
  value,
  editing,
  onChange,
  type = 'text',
  required,
  options,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
      {required && editing && (
        <span style={{ color: 'var(--danger-500)' }}> *</span>
      )}
    </div>
    {editing ? (
      options ? (
        <div style={{ position: 'relative' }}>
          <select
            className="x-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              paddingRight: 28,
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
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
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
        />
      )
    ) : (
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-1)' }}>
        {value || '—'}
      </span>
    )}
  </div>
);

// CRMEditableRow: per-field inline edit for CRM icon+label+value rows.
// Click the value or pencil icon to edit just that one field.
const CRMEditableRow = ({
  icon,
  label,
  value,
  displayValue,
  onChange,
  editable = true,
  options,
  inputProps,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value || '');
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);
  const startEdit = () => {
    if (!editable) return;
    setDraft(value || '');
    setEditing(true);
  };
  const save = () => {
    if (onChange) onChange(draft);
    setEditing(false);
  };
  const cancel = () => setEditing(false);
  const onKey = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        alignItems: 'center',
        gap: 'var(--sp-group)',
        padding: '6px 0',
        fontSize: 'var(--fs-sm)',
        minHeight: 32,
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
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {editing ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flex: 1,
            }}
          >
            {options ? (
              <select
                ref={inputRef}
                className="x-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                style={{
                  height: 28,
                  fontSize: 'var(--fs-sm)',
                  padding: '0 8px',
                  flex: 1,
                }}
              >
                {options.map((o) => (
                  <option key={o.value ?? o} value={o.value ?? o}>
                    {o.label ?? o}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                style={{ height: 28, fontSize: 'var(--fs-sm)', flex: 1 }}
                {...inputProps}
              />
            )}
            <button
              onClick={save}
              title="Save"
              style={{
                all: 'unset',
                cursor: 'pointer',
                width: 24,
                height: 24,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--success-600)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--success-50)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <Icon name="check" size={12} />
            </button>
            <button
              onClick={cancel}
              title="Cancel"
              style={{
                all: 'unset',
                cursor: 'pointer',
                width: 24,
                height: 24,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--fg-3)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--n-100)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <Icon name="x" size={12} />
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flex: 1,
              minWidth: 0,
              cursor: editable ? 'pointer' : 'default',
              padding: '2px 4px',
              margin: '-2px -4px',
              borderRadius: 'var(--radius-sm)',
              transition: 'background 0.1s',
            }}
            onClick={startEdit}
            onMouseEnter={(e) => {
              if (editable)
                e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span
              style={{
                color: 'var(--fg-1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {displayValue || value || (
                <span style={{ color: 'var(--fg-3)' }}>—</span>
              )}
            </span>
            {editable && (
              <Icon
                name="edit"
                size={11}
                style={{
                  color: 'var(--fg-4)',
                  flex: 'none',
                  opacity: 0.5,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// EditDrawer: a right-slide overlay for multi-field editing
const EditDrawer = ({ open, onClose, title, onSave, children }) => {
  if (!open) return null;
  return (
    <>
      <div className="ps-drawer-scrim" onClick={onClose} />
      <aside className="ps-drawer">
        <div className="ps-drawer__header">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              flex: 1,
            }}
          >
            {title}
          </span>
          <IconButton icon="x" onClick={onClose} />
        </div>
        <div className="ps-drawer__body">{children}</div>
        <div className="ps-drawer__footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" icon="check" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </aside>
    </>
  );
};

// =====================================================================
// PARADIGM 1A: Tab + Collapsible Side Column (Invoice)
// Uses InvoiceDetailP1 from InvoiceDetailP1.jsx
// =====================================================================
const Paradigm1A = () => <InvoiceDetailP1 />;

// =====================================================================
// PARADIGM 1B: Tab + Full Width (Invoice)
// =====================================================================
const Paradigm1B = () => {
  const [tab, setTab] = React.useState('fees');
  const [workflowOpen, setWorkflowOpen] = React.useState(false);
  const [editState, setEditState] = React.useState('other');
  const lock = editState === 'other' ? INVOICE.editLock : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <InvoiceHeader
        editState={editState}
        lock={lock}
        onStartEdit={() => setEditState('self')}
        onStopEdit={() => setEditState('none')}
        onForceRelease={() => setEditState('none')}
        workflowOpen={workflowOpen}
        onToggleWorkflow={() => setWorkflowOpen((v) => !v)}
      />
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
          value={tab}
          onChange={setTab}
          items={[
            { value: 'fees', label: 'Fees', icon: 'list', count: 8 },
            {
              value: 'expenses',
              label: 'Expenses',
              icon: 'dollar',
              count: 5,
            },
            {
              value: 'attachments',
              label: 'Attachments',
              icon: 'paperclip',
              count: 4,
            },
            { value: 'people', label: 'People', icon: 'users', count: 3 },
            { value: 'summary', label: 'Summary', icon: 'invoice' },
            {
              value: 'comments',
              label: 'Comments',
              icon: 'comment',
              count: 3,
            },
            { value: 'audit', label: 'History', icon: 'history' },
          ]}
        />
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ padding: 'var(--sp-page-y) var(--sp-page-x)' }}>
        {tab === 'fees' && <LineItemsGrid fullWidth />}
        {tab === 'expenses' && <ExpensesGrid />}
        {tab === 'attachments' && <AttachmentsContent />}
        {tab === 'people' && <PeopleContent />}
        {tab === 'summary' && (
          <div style={{ maxWidth: 600 }}>
            <SummaryContent />
          </div>
        )}
        {tab === 'comments' && (
          <ContentLayoutToggle contextPanel={<CommentsContextPanel />}>
            <CommentsContent />
          </ContentLayoutToggle>
        )}
        {tab === 'audit' && (
          <ContentLayoutToggle contextPanel={<AuditContextPanel />}>
            <AuditTimeline />
          </ContentLayoutToggle>
        )}
      </div>
      {workflowOpen && (
        <WorkflowSheet
          invoice={INVOICE}
          lock={lock}
          onClose={() => setWorkflowOpen(false)}
        />
      )}
    </div>
  );
};

// ContentLayoutToggle, CommentsContextPanel, AuditContextPanel
// loaded from SharedDetailComponents.jsx

// =====================================================================
// PARADIGM 2: Block Stacked (Invoice)
// =====================================================================
const InvoiceStacked = () => {
  const [workflowOpen, setWorkflowOpen] = React.useState(false);
  const [editState, setEditState] = React.useState('none');
  const lock = editState === 'other' ? INVOICE.editLock : null;
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
  const RailBtn = ({ value, icon, label, count }) => {
    const active = panelOpen && panelTab === value;
    return (
      <button
        className="x-context-rail__btn"
        onClick={() => togglePanel(value)}
        aria-pressed={active}
        title={count != null ? `${label} (${count})` : label}
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 44px 0 0',
        position: 'relative',
      }}
    >
      <InvoiceHeader
        editState={editState}
        lock={lock}
        onStartEdit={() => setEditState('self')}
        onStopEdit={() => setEditState('none')}
        onForceRelease={() => setEditState('none')}
        workflowOpen={workflowOpen}
        onToggleWorkflow={() => setWorkflowOpen((v) => !v)}
      />
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        {/* Summary card */}
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
              gap: 8,
            }}
          >
            <Icon name="invoice" size={14} style={{ color: 'var(--fg-2)' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-lg)',
                color: 'var(--fg-1)',
              }}
            >
              Summary
            </span>
          </header>
          <div style={{ padding: 'var(--sp-page-y)' }}>
            <SummaryContent />
          </div>
        </section>
        {/* Fees */}
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
              gap: 8,
            }}
          >
            <Icon name="list" size={14} style={{ color: 'var(--fg-2)' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-lg)',
                color: 'var(--fg-1)',
              }}
            >
              Fees
            </span>
            <Badge variant="outline">{SAMPLE_LINES.length}</Badge>
          </header>
          <div style={{ padding: 'var(--sp-page-y)' }}>
            <LineItemsGrid />
          </div>
        </section>
        {/* Expenses */}
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
              gap: 8,
            }}
          >
            <Icon name="dollar" size={14} style={{ color: 'var(--fg-2)' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-lg)',
                color: 'var(--fg-1)',
              }}
            >
              Expenses
            </span>
            <Badge variant="outline">5</Badge>
          </header>
          <div style={{ padding: 'var(--sp-page-y)' }}>
            <ExpensesGrid />
          </div>
        </section>
        {/* Attachments */}
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
              gap: 8,
            }}
          >
            <Icon name="paperclip" size={14} style={{ color: 'var(--fg-2)' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-lg)',
                color: 'var(--fg-1)',
              }}
            >
              Attachments
            </span>
            <Badge variant="outline">4</Badge>
          </header>
          <div style={{ padding: 'var(--sp-page-y)' }}>
            <AttachmentsContent />
          </div>
        </section>
        {/* People */}
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
              gap: 8,
            }}
          >
            <Icon name="users" size={14} style={{ color: 'var(--fg-2)' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-lg)',
                color: 'var(--fg-1)',
              }}
            >
              People
            </span>
          </header>
          <div style={{ padding: 'var(--sp-page-y)' }}>
            <PeopleContent />
          </div>
        </section>
      </div>
      {/* Context Rail */}
      <aside
        className="x-context-rail"
        aria-label="Invoice context"
        style={{ position: 'fixed', top: 52, right: 0, bottom: 0 }}
      >
        <RailBtn value="comments" icon="comment" label="Comments" count={3} />
        <RailBtn value="audit" icon="history" label="History" />
      </aside>
      {/* SidePanel overlay */}
      {panelOpen && (
        <>
          <div
            className="x-sidepanel-scrim"
            style={{ top: 52, right: 44 }}
            onClick={() => setPanelOpen(false)}
          />
          <SidePanel
            open
            onClose={() => setPanelOpen(false)}
            width={panelWidth}
            onWidthChange={setPanelWidth}
            storageKey="invoice-stacked.panelWidth"
            tabs={[
              {
                value: 'comments',
                label: 'Comments',
                icon: 'comment',
                count: 3,
              },
              { value: 'audit', label: 'History', icon: 'history' },
            ]}
            tab={panelTab}
            onTabChange={setPanelTab}
          >
            {panelTab === 'comments' && <CommentsContent />}
            {panelTab === 'audit' && <AuditTimeline compact />}
          </SidePanel>
        </>
      )}
      {workflowOpen && (
        <WorkflowSheet
          invoice={INVOICE}
          lock={lock}
          onClose={() => setWorkflowOpen(false)}
        />
      )}
    </div>
  );
};

// =====================================================================
// PARADIGM 2: Block Stacked (Vendor Bill)
// =====================================================================
const PSBillDetailsForm = () => {
  const [form, setForm] = React.useState({
    amount: String(PS_BILL.amount),
    date: PS_BILL.received,
    matterId: '01JPMTR1234567890ABCD47',
    clientName: '',
    revenueLocation: '',
    claimNumber: 'cln-1234',
    attorney: '01JPATTY123456789ABC47',
    serviceType: '',
    serviceDate: PS_BILL.received,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
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
          gap: 'var(--sp-group)',
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
          padding: 'var(--sp-page-y)',
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
          <Input
            value={form.date}
            onChange={set('date')}
            placeholder="MM/DD/YYYY"
          />
        </Field>
        <Field label="Matter ID" required>
          <Input value={form.matterId} onChange={set('matterId')} />
        </Field>
        <Field label="Client Name">
          <Input
            value={form.clientName}
            onChange={set('clientName')}
            placeholder="---"
          />
        </Field>
        <Field label="Revenue Location">
          <Input
            value={form.revenueLocation}
            onChange={set('revenueLocation')}
            placeholder="---"
          />
        </Field>
        <Field label="Claim Number">
          <Input value={form.claimNumber} onChange={set('claimNumber')} />
        </Field>
        <Field label="Handling Attorney">
          <Input value={form.attorney} onChange={set('attorney')} />
        </Field>
        <Field label="Service Type">
          <Input
            value={form.serviceType}
            onChange={set('serviceType')}
            placeholder="Service Type"
          />
        </Field>
        <Field label="Date of Service" required>
          <Input
            value={form.serviceDate}
            onChange={set('serviceDate')}
            placeholder="MM/DD/YYYY"
          />
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
        <Button variant="secondary">Cancel</Button>
        <Button variant="accent" icon="check">
          Save
        </Button>
      </footer>
    </section>
  );
};

const BillLinesSection = () => {
  const [selected, setSelected] = React.useState(new Set());
  const subtotal = PS_BILL_LINES.reduce((s, l) => s + (l.total - l.tax), 0);
  const tax = PS_BILL_LINES.reduce((s, l) => s + l.tax, 0);
  const total = subtotal + tax;
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
        <span className="x-grid-toolbar__count">· {PS_BILL_LINES.length}</span>
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
          {PS_BILL_LINES.map((l) => (
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

const BillDocsList = () => (
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
      <span className="x-grid-toolbar__count">· {PS_SAMPLE_DOCS.length}</span>
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
        {PS_SAMPLE_DOCS.map((f) => (
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
                <IconButton icon="download" />
                <IconButton icon="more" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Paradigm2 = () => {
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

  const RailButton = ({ value, icon, label, count }) => {
    const active = panelOpen && panelTab === value;
    return (
      <button
        className="x-context-rail__btn"
        onClick={() => togglePanel(value)}
        aria-pressed={active}
        title={count != null ? `${label} (${count})` : label}
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 44px 0 0',
        position: 'relative',
      }}
    >
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        <PageNav
          onBack={() => {}}
          crumbs={[
            { label: 'Sycamore' },
            { label: 'Vendor Bills' },
            { label: PS_BILL.id },
          ]}
          prevLabel="VB-0086"
          nextLabel="VB-0088"
        />
        <div className="x-page__head">
          <div className="x-page__title-wrap" style={{ gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 500,
                  color: 'var(--fg-1)',
                }}
              >
                {PS_BILL.vendor}
              </span>
              <BillStatus status={PS_BILL.status} />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-lg)',
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--fg-1)',
                }}
              >
                {fmtMoney(PS_BILL.amount)}
              </span>
            </div>
          </div>
          <div
            className="x-page__actions"
            style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            <Button variant="secondary" icon="more">
              More
            </Button>
            <Button variant="secondary" icon="x">
              Reject
            </Button>
            <Button variant="accent" icon="check">
              Approve
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        <PSBillDetailsForm />
        <BillLinesSection />
        <BillDocsList />
      </div>
      <aside
        className="x-context-rail"
        aria-label="Vendor bill context"
        style={{ position: 'fixed', top: 52, right: 0, bottom: 0 }}
      >
        <RailButton
          value="comments"
          icon="comment"
          label="Comments"
          count={3}
        />
        <RailButton value="audit" icon="history" label="History" count={5} />
      </aside>
      {panelOpen && (
        <>
          <div
            className="x-sidepanel-scrim"
            style={{ top: 52, right: 44 }}
            onClick={() => setPanelOpen(false)}
          />
          <SidePanel
            open
            onClose={() => setPanelOpen(false)}
            width={panelWidth}
            onWidthChange={setPanelWidth}
            storageKey="paradigm2.panelWidth"
            tabs={[
              {
                value: 'comments',
                label: 'Comments',
                icon: 'comment',
                count: 3,
              },
              { value: 'audit', label: 'History', icon: 'history' },
            ]}
            tab={panelTab}
            onTabChange={setPanelTab}
          >
            {panelTab === 'comments' && <CommentsContent />}
            {panelTab === 'audit' && <AuditTimeline compact />}
          </SidePanel>
        </>
      )}
    </div>
  );
};

// =====================================================================
// PARADIGM 3: CRM Two-Column (Vendor Bill V2)
// =====================================================================
const PS_V2_ACTIVITY = [
  {
    who: 'Eleanor Wu',
    what: 'moved the bill to ',
    target: 'Partner approval',
    when: '1 day ago',
  },
  {
    who: 'K. Alvarez',
    what: 'submitted revision ',
    target: 'v2',
    when: '3 days ago',
  },
  {
    who: 'Marcus Orr',
    what: 'rejected ',
    target: 'v1',
    when: '6 days ago',
  },
];
const PS_V2_NOTES = [
  {
    who: 'Eleanor Wu',
    title: 'Rate review',
    body: 'Paralegal rate aligned with engagement letter.',
    when: '1 day ago',
  },
  {
    who: 'Marcus Orr',
    title: 'Policy flag',
    body: 'Block billing on line 2 resolved in v2.',
    when: '6 days ago',
  },
  {
    who: 'K. Alvarez',
    title: 'Cover note',
    body: 'Submitted v1 — happy to walk through on a call.',
    when: '12 days ago',
  },
];

const PSSectionHeader = ({ icon, label, expanded, onToggle, actions }) => (
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

const CRMRow = ({ icon, label, children }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      alignItems: 'center',
      gap: 'var(--sp-group)',
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

const PSTabRow = ({ value, onChange, items }) => (
  <div
    style={{
      display: 'flex',
      gap: 0,
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 var(--sp-page-x)',
      background: 'var(--bg-surface)',
    }}
  >
    {items.map((t, i) => {
      const active = value === t.value;
      return (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: `var(--tab-pad-y) var(--tab-pad-x) var(--tab-pad-y) ${i === 0 ? '0px' : 'var(--tab-pad-x)'}`,
            marginBottom: -1,
            fontSize: 'var(--fs-md)',
            fontWeight: active ? 500 : 400,
            color: active ? 'var(--a-700)' : 'var(--fg-2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: `2px solid ${active ? 'var(--a-500)' : 'transparent'}`,
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

const PSHighlightCard = ({ title, children }) => (
  <div
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 12,
      minWidth: 220,
      flex: '1 1 220px',
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
      <IconButton icon="more" />
    </div>
    {children}
  </div>
);

const Paradigm3 = () => {
  const [leftTab, setLeftTab] = React.useState('overview');
  const [rightTab, setRightTab] = React.useState('details');
  const [range, setRange] = React.useState('today');
  const [open, setOpen] = React.useState({
    details: true,
    audit: true,
    lists: true,
  });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const [editMode, setEditMode] = React.useState('field');
  const detailsEditing = editMode === 'section';
  const setDetailsEditing = (v) => setEditMode(v ? 'section' : 'field');
  const [billForm, setBillForm] = React.useState({
    amount: String(PS_BILL.amount),
    date: PS_BILL.received,
    matterId: '01JPMTR1234567890ABCD47',
    clientName: '',
    revenueLocation: '',
    claimNumber: 'cln-1234',
    attorney: '01JPATTY123456789ABC47',
    serviceType: '',
    serviceDate: PS_BILL.received,
  });
  const setBillField = (k, v) => setBillForm((f) => ({ ...f, [k]: v }));
  // Right panel: resizable + collapsible
  const [rightWidth, setRightWidth] = React.useState(420);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const onRightResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = rightWidth;
    const maxW = Math.round(window.innerWidth * 0.5);
    const onMove = (ev) =>
      setRightWidth(
        Math.max(280, Math.min(maxW, startW + (startX - ev.clientX))),
      );
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
  const expandRightTo = (tab) => {
    setRightTab(tab);
    setRightCollapsed(false);
  };
  const RIGHT_TABS = [
    { value: 'details', label: 'Details', icon: 'invoice' },
    { value: 'comments', label: 'Comments', icon: 'comment', count: 3 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb + header */}
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-group)',
        }}
      >
        <PageNav
          onBack={() => {}}
          crumbs={[
            { label: 'Sycamore' },
            { label: 'Vendor Bills' },
            { label: PS_BILL.id },
          ]}
          prevLabel="VB-0086"
          nextLabel="VB-0088"
        />
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
              background: 'var(--a-500)',
              color: 'var(--fg-inverse)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 15,
              flex: 'none',
            }}
          >
            A
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-xl)',
                color: 'var(--fg-1)',
                fontWeight: 500,
              }}
            >
              {PS_BILL.vendor}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-inline)',
                fontSize: 'var(--fs-sm)',
              }}
            >
              <BillStatus status={PS_BILL.status} />
              <span
                style={{
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--fg-2)',
                }}
              >
                {fmtMoney(PS_BILL.amount)}
              </span>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <IconButton icon="link" title="Copy link" />
          <IconButton icon="invoice" title="Open PDF" />
          <Button variant="secondary" size="sm" icon="report">
            Reports
          </Button>
        </div>
      </div>
      {/* Two-column body */}
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 0 }}>
        <div
          style={{
            flex: 1,
            borderRight: '1px solid var(--border-subtle)',
            minWidth: 0,
            background: 'var(--bg-page)',
          }}
        >
          <PSTabRow
            value={leftTab}
            onChange={setLeftTab}
            items={[
              { value: 'overview', label: 'Overview', icon: 'dashboard' },
              { value: 'activity', label: 'Activity', icon: 'history' },
              { value: 'lines', label: 'Lines', icon: 'list', count: 7 },
              {
                value: 'docs',
                label: 'Files',
                icon: 'paperclip',
                count: 4,
              },
            ]}
          />
          <div
            style={{
              padding: 'var(--sp-page-y) var(--sp-page-x)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-section)',
            }}
          >
            {leftTab === 'overview' && (
              <>
                <div>
                  <PSSectionHeader icon="grid" label="Highlights" />
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--sp-group)',
                    }}
                  >
                    <PSHighlightCard title="Status">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <BillStatus status={PS_BILL.status} />
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
                    </PSHighlightCard>
                    <PSHighlightCard title="Payment schedule">
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
                          <span>Due {fmtDate(PS_BILL.due)}</span>
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
                          <span className="x-num">
                            {fmtMoney(PS_BILL.amount)}
                          </span>
                        </div>
                        <Badge variant="warn">Schedules in 8 days</Badge>
                      </div>
                    </PSHighlightCard>
                  </div>
                </div>
                <div>
                  <PSSectionHeader
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
                    {PS_V2_ACTIVITY.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 0',
                          borderBottom:
                            i < PS_V2_ACTIVITY.length - 1
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
                <div>
                  <PSSectionHeader
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
                    {PS_V2_NOTES.map((n, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '12px 0',
                          borderBottom:
                            i < PS_V2_NOTES.length - 1
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
            {leftTab === 'activity' && (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  color: 'var(--fg-3)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                Full activity feed appears here.
              </div>
            )}
            {leftTab === 'lines' && <BillLinesSection />}
            {leftTab === 'docs' && <BillDocsList />}
          </div>
        </div>
        {rightCollapsed ? (
          <div
            className="ps-strip"
            style={{
              position: 'sticky',
              top: 0,
              alignSelf: 'flex-start',
            }}
          >
            {RIGHT_TABS.map((t) => (
              <button
                key={t.value}
                className="ps-strip__btn"
                onClick={() => expandRightTo(t.value)}
                title={t.label}
              >
                <Icon name={t.icon} size={16} />
                {t.count != null && t.count > 0 && (
                  <span className="ps-strip__count">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div
            className="ps-side-col"
            style={{
              width: rightWidth,
              position: 'sticky',
              top: 0,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 56px)',
              overflowY: 'auto',
            }}
          >
            <div
              className="ps-side-col__resizer"
              onMouseDown={onRightResize}
              title="Drag to resize"
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                borderBottom: '1px solid var(--border-subtle)',
                gap: 2,
              }}
            >
              <Tabs
                value={rightTab}
                onChange={setRightTab}
                items={RIGHT_TABS}
              />
              <div style={{ flex: 1 }} />
              <button
                className="ps-side-col__collapse-btn"
                onClick={() => setRightCollapsed(true)}
                title="Collapse"
              >
                <Icon name="panelClose" size={14} />
              </button>
            </div>
            <div style={{ padding: '12px 20px 24px' }}>
              {rightTab === 'details' && (
                <>
                  {/* Edit mode toggle: field-level vs section-level */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 0 6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--fg-3)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--tracking-caps)',
                      }}
                    >
                      Edit style
                    </span>
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: 2,
                        background: 'var(--n-100)',
                        padding: 2,
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {[
                        { value: 'field', label: 'Per field' },
                        { value: 'section', label: 'All fields' },
                      ].map((o) => (
                        <button
                          key={o.value}
                          onClick={() => setEditMode(o.value)}
                          style={{
                            all: 'unset',
                            cursor: 'pointer',
                            padding: '3px 10px',
                            borderRadius: 3,
                            fontSize: 'var(--fs-xs)',
                            fontWeight: 500,
                            color:
                              editMode === o.value
                                ? 'var(--fg-1)'
                                : 'var(--fg-3)',
                            background:
                              editMode === o.value
                                ? 'var(--bg-surface)'
                                : 'transparent',
                            boxShadow:
                              editMode === o.value
                                ? '0 0 0 1px var(--border-subtle)'
                                : 'none',
                          }}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bill Details section header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 0 8px',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={() => toggle('details')}
                  >
                    <Icon
                      name="caretDown"
                      size={12}
                      style={{
                        color: 'var(--fg-3)',
                        transform: open.details
                          ? 'rotate(0deg)'
                          : 'rotate(-90deg)',
                        transition: 'transform 0.12s ease',
                      }}
                    />
                    <Icon
                      name="invoice"
                      size={14}
                      style={{ color: 'var(--fg-2)' }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 600,
                        color: 'var(--fg-1)',
                      }}
                    >
                      Bill Details
                    </span>
                    <div style={{ flex: 1 }} />
                    {editMode === 'section' &&
                      (detailsEditing ? (
                        <>
                          <Badge variant="info">Editing</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsEditing(true);
                            setOpen((o) => ({ ...o, details: true }));
                          }}
                        >
                          Edit all
                        </Button>
                      ))}
                    {editMode === 'field' && (
                      <span
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                          fontStyle: 'italic',
                        }}
                      >
                        click a value to edit
                      </span>
                    )}
                  </div>
                  {open.details && (
                    <div>
                      {editMode === 'section' && detailsEditing ? (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 'var(--sp-group)',
                            }}
                          >
                            <CRMRow icon="dollar" label="Invoice Amount">
                              <Input
                                value={billForm.amount}
                                onChange={(e) =>
                                  setBillField('amount', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="calendar" label="Invoice Date">
                              <Input
                                value={billForm.date}
                                onChange={(e) =>
                                  setBillField('date', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="matter" label="Matter ID">
                              <Input
                                value={billForm.matterId}
                                onChange={(e) =>
                                  setBillField('matterId', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="building" label="Client Name">
                              <Input
                                value={billForm.clientName}
                                onChange={(e) =>
                                  setBillField('clientName', e.target.value)
                                }
                                placeholder="—"
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="folder" label="Revenue Location">
                              <Input
                                value={billForm.revenueLocation}
                                onChange={(e) =>
                                  setBillField(
                                    'revenueLocation',
                                    e.target.value,
                                  )
                                }
                                placeholder="—"
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="invoice" label="Claim Number">
                              <Input
                                value={billForm.claimNumber}
                                onChange={(e) =>
                                  setBillField('claimNumber', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="user" label="Handling Attorney">
                              <Input
                                value={billForm.attorney}
                                onChange={(e) =>
                                  setBillField('attorney', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                            <CRMRow icon="list" label="Service Type">
                              <select
                                className="x-input"
                                value={billForm.serviceType}
                                onChange={(e) =>
                                  setBillField('serviceType', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                  padding: '0 8px',
                                }}
                              >
                                <option value="">Select...</option>
                                <option value="consulting">Consulting</option>
                                <option value="litigation">Litigation</option>
                                <option value="advisory">Advisory</option>
                                <option value="expenses">Expenses</option>
                              </select>
                            </CRMRow>
                            <CRMRow icon="calendar" label="Date of Service">
                              <Input
                                value={billForm.serviceDate}
                                onChange={(e) =>
                                  setBillField('serviceDate', e.target.value)
                                }
                                style={{
                                  height: 28,
                                  fontSize: 'var(--fs-sm)',
                                }}
                              />
                            </CRMRow>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              justifyContent: 'flex-end',
                              marginTop: 14,
                              paddingTop: 12,
                              borderTop: '1px solid var(--border-subtle)',
                            }}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setDetailsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="accent"
                              size="sm"
                              icon="check"
                              onClick={() => setDetailsEditing(false)}
                            >
                              Save
                            </Button>
                          </div>
                        </>
                      ) : editMode === 'field' ? (
                        <div>
                          <CRMEditableRow
                            icon="dollar"
                            label="Invoice Amount"
                            value={billForm.amount}
                            displayValue={
                              <span className="x-num">
                                {fmtMoney(Number(billForm.amount))}
                              </span>
                            }
                            onChange={(v) => setBillField('amount', v)}
                          />
                          <CRMEditableRow
                            icon="calendar"
                            label="Invoice Date"
                            value={billForm.date}
                            displayValue={fmtDate(billForm.date)}
                            onChange={(v) => setBillField('date', v)}
                          />
                          <CRMEditableRow
                            icon="matter"
                            label="Matter ID"
                            value={billForm.matterId}
                            displayValue={
                              <span
                                className="x-mono"
                                style={{ color: 'var(--a-600)' }}
                              >
                                {billForm.matterId}
                              </span>
                            }
                            onChange={(v) => setBillField('matterId', v)}
                          />
                          <CRMEditableRow
                            icon="building"
                            label="Client Name"
                            value={billForm.clientName}
                            onChange={(v) => setBillField('clientName', v)}
                          />
                          <CRMEditableRow
                            icon="folder"
                            label="Revenue Location"
                            value={billForm.revenueLocation}
                            onChange={(v) => setBillField('revenueLocation', v)}
                          />
                          <CRMEditableRow
                            icon="invoice"
                            label="Claim Number"
                            value={billForm.claimNumber}
                            displayValue={
                              <span className="x-mono">
                                {billForm.claimNumber}
                              </span>
                            }
                            onChange={(v) => setBillField('claimNumber', v)}
                          />
                          <CRMEditableRow
                            icon="user"
                            label="Handling Attorney"
                            value={billForm.attorney}
                            displayValue={
                              <span
                                className="x-mono"
                                style={{ color: 'var(--a-600)' }}
                              >
                                {billForm.attorney}
                              </span>
                            }
                            onChange={(v) => setBillField('attorney', v)}
                          />
                          <CRMEditableRow
                            icon="list"
                            label="Service Type"
                            value={billForm.serviceType}
                            onChange={(v) => setBillField('serviceType', v)}
                            options={[
                              { value: '', label: 'Select...' },
                              {
                                value: 'consulting',
                                label: 'Consulting',
                              },
                              {
                                value: 'litigation',
                                label: 'Litigation',
                              },
                              { value: 'advisory', label: 'Advisory' },
                              { value: 'expenses', label: 'Expenses' },
                            ]}
                          />
                          <CRMEditableRow
                            icon="calendar"
                            label="Date of Service"
                            value={billForm.serviceDate}
                            displayValue={fmtDate(billForm.serviceDate)}
                            onChange={(v) => setBillField('serviceDate', v)}
                          />
                          <CRMRow icon="workflow" label="Status">
                            <BillStatus status={PS_BILL.status} />
                          </CRMRow>
                          <CRMRow icon="history" label="Revision">
                            <Badge variant="outline">v{PS_BILL.rev}</Badge>
                          </CRMRow>
                        </div>
                      ) : (
                        <div>
                          <CRMRow icon="dollar" label="Invoice Amount">
                            <span className="x-num">
                              {fmtMoney(PS_BILL.amount)}
                            </span>
                          </CRMRow>
                          <CRMRow icon="calendar" label="Invoice Date">
                            {fmtDate(PS_BILL.received)}
                          </CRMRow>
                          <CRMRow icon="matter" label="Matter ID">
                            <span
                              className="x-mono"
                              style={{ color: 'var(--a-600)' }}
                            >
                              01JPMTR12...ABCD47
                            </span>
                          </CRMRow>
                          <CRMRow icon="building" label="Client Name">
                            <span style={{ color: 'var(--fg-3)' }}>—</span>
                          </CRMRow>
                          <CRMRow icon="folder" label="Revenue Location">
                            <span style={{ color: 'var(--fg-3)' }}>—</span>
                          </CRMRow>
                          <CRMRow icon="invoice" label="Claim Number">
                            <span className="x-mono">cln-1234</span>
                          </CRMRow>
                          <CRMRow icon="user" label="Handling Attorney">
                            <span
                              className="x-mono"
                              style={{ color: 'var(--a-600)' }}
                            >
                              01JPATTY...ABC47
                            </span>
                          </CRMRow>
                          <CRMRow icon="workflow" label="Status">
                            <BillStatus status={PS_BILL.status} />
                          </CRMRow>
                          <CRMRow icon="history" label="Revision">
                            <Badge variant="outline">v{PS_BILL.rev}</Badge>
                          </CRMRow>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 4,
                    }}
                  >
                    <PSSectionHeader
                      icon="clock"
                      label="History"
                      expanded={open.audit}
                      onToggle={() => toggle('audit')}
                    />
                    {open.audit && (
                      <div>
                        <CRMRow icon="clock" label="Created at">
                          Apr 8, 2026 · 16:05
                        </CRMRow>
                        <CRMRow icon="user" label="Created by">
                          K. Alvarez
                        </CRMRow>
                        <CRMRow icon="clock" label="Last updated">
                          Apr 15, 2026 · 14:10
                        </CRMRow>
                        <CRMRow icon="user" label="Last updated by">
                          Eleanor Wu
                        </CRMRow>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 4,
                    }}
                  >
                    <PSSectionHeader
                      label="Lists"
                      expanded={open.lists}
                      onToggle={() => toggle('lists')}
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
                    gap: 'var(--sp-section)',
                    paddingTop: 12,
                  }}
                >
                  {/* Composer */}
                  <div>
                    <Textarea
                      rows={2}
                      placeholder="Leave a comment. Use @ to mention, # to reference a line."
                      style={{ fontSize: 'var(--fs-sm)' }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                        alignItems: 'center',
                        marginTop: 6,
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
                  {/* Thread */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--sp-section)',
                    }}
                  >
                    {SAMPLE_COMMENTS.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          gap: 10,
                          paddingLeft: c.thread ? 32 : 0,
                        }}
                      >
                        <Avatar name={c.author} size="sm" />
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
                              }}
                            >
                              {c.author}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--fs-xs)',
                                color: 'var(--fg-3)',
                              }}
                            >
                              {fmtDateTime(c.time)}
                            </span>
                            {c.line && (
                              <Badge variant="outline">Line {c.line}</Badge>
                            )}
                            {c.resolved && (
                              <Badge variant="success">Resolved</Badge>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--fs-sm)',
                              color: 'var(--fg-1)',
                              marginTop: 3,
                              lineHeight: 1.5,
                            }}
                          >
                            {c.body}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: 6,
                              marginTop: 4,
                            }}
                          >
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// USER DETAIL — Block Stacked (Paradigm 2)
// =====================================================================
const UserDetail = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div
      style={{
        padding: 'var(--sp-page-y) var(--sp-page-x)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-section)',
      }}
    >
      <PageNav
        onBack={() => {}}
        crumbs={[
          { label: 'Heartwood' },
          { label: 'Users' },
          { label: USER.name },
        ]}
        prevLabel="David Kim"
        nextLabel="Marcus Orr"
      />
      <div className="x-page__head">
        <div className="x-page__title-wrap" style={{ gap: 8 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-caps)',
              color: 'var(--fg-3)',
              fontWeight: 600,
            }}
          >
            {USER.role}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-group)',
              flexWrap: 'wrap',
            }}
          >
            <Avatar name={USER.name} size="lg" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-2xl)',
                fontWeight: 500,
                color: 'var(--fg-1)',
              }}
            >
              {USER.name}
            </span>
            <Badge variant="success" dot>
              Active
            </Badge>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 16,
              rowGap: 4,
              marginTop: 4,
              fontSize: 'var(--fs-sm)',
              color: 'var(--fg-2)',
            }}
          >
            <span>{USER.email}</span>
            <span>·</span>
            <span>{USER.department}</span>
            <span>·</span>
            <span>{USER.location}</span>
          </div>
        </div>
        <div
          className="x-page__actions"
          style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
        >
          <Button variant="secondary" icon="edit">
            Edit Profile
          </Button>
          <Button variant="secondary" icon="lock">
            Disable Account
          </Button>
        </div>
      </div>
    </div>
    <div
      style={{
        padding: 'var(--sp-page-y) var(--sp-page-x)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-section)',
      }}
    >
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
            gap: 8,
          }}
        >
          <Icon name="user" size={14} style={{ color: 'var(--fg-2)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              color: 'var(--fg-1)',
            }}
          >
            Profile Information
          </span>
        </header>
        <div
          style={{
            padding: 'var(--sp-page-y)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px 24px',
          }}
        >
          <MetaRow label="Email">{USER.email}</MetaRow>
          <MetaRow label="Phone">{USER.phone}</MetaRow>
          <MetaRow label="Location">{USER.location}</MetaRow>
          <MetaRow label="Timezone">{USER.timezone}</MetaRow>
          <MetaRow label="Manager">{USER.manager}</MetaRow>
          <MetaRow label="Department">{USER.department}</MetaRow>
          <MetaRow label="Member since">{fmtDate(USER.createdAt)}</MetaRow>
          <MetaRow label="Last login">{fmtDateTime(USER.lastLogin)}</MetaRow>
        </div>
      </section>
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
            gap: 8,
          }}
        >
          <Icon name="users" size={14} style={{ color: 'var(--fg-2)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              color: 'var(--fg-1)',
            }}
          >
            Teams & Access
          </span>
        </header>
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            {USER.teams.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-caps)',
              color: 'var(--fg-3)',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Permissions
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {USER.permissions.map((p) => (
              <span
                key={p}
                className="x-mono"
                style={{
                  fontSize: 'var(--fs-xs)',
                  padding: '2px 8px',
                  background: 'var(--n-50)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--fg-2)',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
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
            gap: 8,
          }}
        >
          <Icon name="history" size={14} style={{ color: 'var(--fg-2)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              color: 'var(--fg-1)',
            }}
          >
            Recent Activity
          </span>
        </header>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 35,
              top: 16,
              bottom: 16,
              width: 1,
              background: 'var(--border)',
            }}
          />
          {USER.activity.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 20px',
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
                  zIndex: 1,
                  color: 'var(--fg-2)',
                }}
              >
                <Icon name={e.icon} size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--fg-1)',
                  }}
                >
                  {e.action}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--fg-3)',
                    marginTop: 2,
                  }}
                >
                  {e.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

// =====================================================================
// USER DETAIL — Tab + Side Column (Paradigm 1A) with Edit Patterns
// =====================================================================
const UserTabsDetail = ({ onBack } = {}) => {
  const [tab, setTab] = React.useState('profile');
  const [sideTab, setSideTab] = React.useState('summary');
  const [collapsed, setCollapsed] = React.useState(false);
  const [sideWidth, setSideWidth] = React.useState(360);
  const [profileEditing, setProfileEditing] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [adminNotes, setAdminNotes] = React.useState(
    'Onboarded during Q1 2024 Legal Ops expansion. Promoted to Senior Reviewer after 6-month probation.',
  );

  // Profile form state (edit mode)
  const [profileForm, setProfileForm] = React.useState({
    email: USER.email,
    phone: USER.phone,
    location: USER.location,
    department: USER.department,
    timezone: 'America/Los_Angeles (PST)',
    manager: USER.manager,
  });
  const setField = (k, v) => setProfileForm((f) => ({ ...f, [k]: v }));

  // Drawer form state
  const [drawerForm, setDrawerForm] = React.useState({
    name: USER.name,
    email: USER.email,
    role: USER.role,
    department: USER.department,
    phone: USER.phone,
    location: USER.location,
    manager: USER.manager,
  });
  const setDrawerField = (k, v) => setDrawerForm((f) => ({ ...f, [k]: v }));

  const allRoles = window.PERM_ROLES_DATA || [];
  const [assignedRoleIds, setAssignedRoleIds] = React.useState(() => {
    const ids = new Set();
    allRoles.forEach((r) => { if (r.name === 'Billing clerk' || r.name === 'Supervisor') ids.add(r.id); });
    return ids;
  });
  const [rolePickerOpen, setRolePickerOpen] = React.useState(false);
  const [rolePickerQ, setRolePickerQ] = React.useState('');
  const [roleAssigning, setRoleAssigning] = React.useState(new Set());
  const [roleDetailState, setRoleDetailState] = React.useState({});
  const [roleDetailData, setRoleDetailData] = React.useState({});

  const userRoles = allRoles.filter((r) => assignedRoleIds.has(r.id));

  const toggleRoleAssignment = (id) => {
    if (assignedRoleIds.has(id)) {
      setRoleAssigning((prev) => { const n = new Set(prev); n.add(id); return n; });
      setTimeout(() => {
        setAssignedRoleIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setRoleDetailState((prev) => { const n = { ...prev }; delete n[id]; return n; });
        setRoleDetailData((prev) => { const n = { ...prev }; delete n[id]; return n; });
        setRoleAssigning((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setEpState('idle');
        setEffectiveCaps(null);
      }, 500);
    } else {
      setRoleAssigning((prev) => { const n = new Set(prev); n.add(id); return n; });
      setTimeout(() => {
        setAssignedRoleIds((prev) => new Set([...prev, id]));
        setRoleAssigning((prev) => { const n = new Set(prev); n.delete(id); return n; });
        setEpState('idle');
        setEffectiveCaps(null);
      }, 600);
    }
  };
  const removeRole = (id) => {
    setRoleAssigning((prev) => { const n = new Set(prev); n.add(id); return n; });
    setTimeout(() => {
      setAssignedRoleIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setRoleDetailState((prev) => { const n = { ...prev }; delete n[id]; return n; });
      setRoleDetailData((prev) => { const n = { ...prev }; delete n[id]; return n; });
      setRoleAssigning((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setEpState('idle');
      setEffectiveCaps(null);
    }, 500);
  };

  const fetchRoleDetail = (roleId) => {
    setRoleDetailState((p) => ({ ...p, [roleId]: 'loading' }));
    setTimeout(() => {
      try {
        const role = allRoles.find((r) => r.id === roleId);
        const caps = role && window.getRoleTotalCaps ? window.getRoleTotalCaps(role) : new Set();
        setRoleDetailData((p) => ({ ...p, [roleId]: caps }));
        setRoleDetailState((p) => ({ ...p, [roleId]: 'loaded' }));
      } catch {
        setRoleDetailState((p) => ({ ...p, [roleId]: 'error' }));
      }
    }, 700);
  };

  // Effective permissions — fetch on demand (simulated API call)
  const [epState, setEpState] = React.useState('idle'); // idle | loading | loaded | error
  const [effectiveCaps, setEffectiveCaps] = React.useState(null);

  const fetchEffectivePerms = () => {
    setEpState('loading');
    setTimeout(() => {
      try {
        const s = new Set();
        const fn = window.getRoleTotalCaps;
        if (fn) userRoles.forEach((r) => { fn(r).forEach((c) => s.add(c)); });
        setEffectiveCaps(s);
        setEpState('loaded');
      } catch {
        setEpState('error');
      }
    }, 900);
  };

  // Side column resize
  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = sideWidth;
    const onMove = (ev) =>
      setSideWidth(
        Math.max(
          280,
          Math.min(
            Math.round(window.innerWidth * 0.5),
            startW + (startX - ev.clientX),
          ),
        ),
      );
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
  const expandTo = (t) => {
    setSideTab(t);
    setCollapsed(false);
  };

  const SIDE_TABS = [
    { value: 'summary', label: 'Summary', icon: 'user' },
    { value: 'notes', label: 'Notes', icon: 'comment' },
    { value: 'audit', label: 'History', icon: 'history' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        {!onBack && (
          <PageNav
            crumbs={[
              { label: 'Heartwood' },
              { label: 'Users' },
              { label: USER.name },
            ]}
            prevLabel="David Kim"
            nextLabel="Marcus Orr"
          />
        )}
        <div className="x-page__head">
          <div className="x-page__title-wrap" style={{ gap: 8 }}>
            <div
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
                color: 'var(--fg-3)',
                fontWeight: 600,
              }}
            >
              {USER.role}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-group)',
                flexWrap: 'wrap',
              }}
            >
              <Avatar name={USER.name} size="lg" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 500,
                  color: 'var(--fg-1)',
                }}
              >
                {USER.name}
              </span>
              <Badge variant="success" dot>
                Active
              </Badge>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 16,
                rowGap: 4,
                marginTop: 4,
                fontSize: 'var(--fs-sm)',
                color: 'var(--fg-2)',
              }}
            >
              <span>{USER.email}</span>
              <span>·</span>
              <span>{USER.department}</span>
              <span>·</span>
              <span>{USER.location}</span>
            </div>
          </div>
          <div
            className="x-page__actions"
            style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            <Button variant="secondary" icon="more">
              More
            </Button>
            <Button
              variant="secondary"
              icon="edit"
              onClick={() => setDrawerOpen(true)}
            >
              Edit Profile
            </Button>
            <Button variant="secondary" icon="lock">
              Disable
            </Button>
          </div>
        </div>
      </div>

      {/* Body: tab content + side column */}
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Tabs inside left column */}
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
              value={tab}
              onChange={setTab}
              items={[
                { value: 'profile', label: 'Profile', icon: 'user' },
                { value: 'activity', label: 'Activity', icon: 'history' },
                { value: 'roles', label: 'Roles', icon: 'lock' },
                { value: 'sessions', label: 'Sessions', icon: 'settings' },
              ]}
            />
            <div style={{ flex: 1 }} />
          </div>
          <div
            style={{
              flex: 1,
              padding: 'var(--sp-page-y) var(--sp-page-x)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-section)',
            }}
          >
            {/* Profile Tab — Pattern A: Inline Edit */}
            {tab === 'profile' && (
              <EditableSection
                title="Profile Information"
                icon="user"
                editing={profileEditing}
                onEdit={() => setProfileEditing(true)}
                onCancel={() => setProfileEditing(false)}
                onSave={() => setProfileEditing(false)}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '16px 24px',
                  }}
                >
                  <EditableField
                    label="Email"
                    value={profileForm.email}
                    editing={profileEditing}
                    onChange={(v) => setField('email', v)}
                    required
                  />
                  <EditableField
                    label="Phone"
                    value={profileForm.phone}
                    editing={profileEditing}
                    onChange={(v) => setField('phone', v)}
                  />
                  <EditableField
                    label="Location"
                    value={profileForm.location}
                    editing={profileEditing}
                    onChange={(v) => setField('location', v)}
                  />
                  <EditableField
                    label="Department"
                    value={profileForm.department}
                    editing={profileEditing}
                    onChange={(v) => setField('department', v)}
                    options={[
                      'Legal Operations',
                      'Finance',
                      'Compliance',
                      'IT',
                      'Human Resources',
                    ]}
                  />
                  <EditableField
                    label="Timezone"
                    value={profileForm.timezone}
                    editing={profileEditing}
                    onChange={(v) => setField('timezone', v)}
                    options={[
                      'America/Los_Angeles (PST)',
                      'America/Chicago (CST)',
                      'America/New_York (EST)',
                      'Europe/London (GMT)',
                      'Asia/Tokyo (JST)',
                    ]}
                  />
                  <EditableField
                    label="Manager"
                    value={profileForm.manager}
                    editing={profileEditing}
                    onChange={(v) => setField('manager', v)}
                  />
                </div>
              </EditableSection>
            )}

            {/* Activity Tab */}
            {tab === 'activity' && (
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
                    gap: 8,
                  }}
                >
                  <Icon
                    name="history"
                    size={14}
                    style={{ color: 'var(--fg-2)' }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--fs-lg)',
                      color: 'var(--fg-1)',
                    }}
                  >
                    Recent Activity
                  </span>
                </header>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 35,
                      top: 16,
                      bottom: 16,
                      width: 1,
                      background: 'var(--border)',
                    }}
                  />
                  {USER.activity.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 14,
                        padding: '14px 20px',
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
                          zIndex: 1,
                          color: 'var(--fg-2)',
                        }}
                      >
                        <Icon name={e.icon} size={14} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                          }}
                        >
                          {e.action}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                            marginTop: 2,
                          }}
                        >
                          {e.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Roles Tab */}
            {tab === 'roles' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-section)' }}>
                {/* Assigned roles */}
                <Card title="Assigned Roles" actions={<Badge variant="neutral">{userRoles.length} roles</Badge>}>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 12, lineHeight: 1.5 }}>
                    Roles determine what {USER.name.split(' ')[0]} can access. Each role bundles permission sets and individual capabilities.
                  </div>

                  {/* Role cards */}
                  {userRoles.length === 0 && (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 8 }}>
                      No roles assigned yet. Click below to assign one.
                    </div>
                  )}
                  {userRoles.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                      {userRoles.map((role) => {
                        const sets = (role.permissionSets || []).map((id) => (window.PERMISSION_SETS_DATA || []).find((ps) => ps.id === id)).filter(Boolean);
                        const rdState = roleDetailState[role.id] || 'idle';
                        const rdCaps = roleDetailData[role.id];
                        const isRemoving = roleAssigning.has(role.id);
                        return (
                          <div key={role.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', opacity: isRemoving ? 0.5 : 1, transition: 'opacity 120ms ease' }}>
                            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="lock" size={14} style={{ color: 'var(--fg-3)' }} />
                                <span style={{ fontWeight: 500, fontSize: 'var(--fs-sm)', color: 'var(--fg-1)', flex: 1 }}>{role.name}</span>
                                <Badge variant={role.type === 'System' ? 'info' : 'accent'}>{role.type}</Badge>
                                {isRemoving ? <span className="x-spinner" /> : <IconButton icon="x" size="sm" title={`Remove ${role.name}`} onClick={() => removeRole(role.id)} />}
                              </div>
                              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.4 }}>{role.description}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{sets.length} permission sets</span>
                                {(role.customCapabilities || []).length > 0 && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{role.customCapabilities.length} custom capabilities</span>}
                                <div style={{ flex: 1 }} />
                                {rdState === 'idle' && (
                                  <button type="button" onClick={() => fetchRoleDetail(role.id)} style={{ all: 'unset', cursor: 'pointer', fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Icon name="chevronRight" size={11} />View sets & capabilities
                                  </button>
                                )}
                                {rdState === 'loading' && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                                    <span className="x-spinner" /> Loading...
                                  </span>
                                )}
                                {rdState === 'loaded' && (
                                  <button type="button" onClick={() => setRoleDetailState((p) => ({ ...p, [role.id]: 'idle' }))} style={{ all: 'unset', cursor: 'pointer', fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Icon name="chevronDown" size={11} />Hide details
                                  </button>
                                )}
                                {rdState === 'error' && (
                                  <button type="button" onClick={() => fetchRoleDetail(role.id)} style={{ all: 'unset', cursor: 'pointer', fontSize: 'var(--fs-xs)', color: 'var(--error-500)', fontWeight: 500 }}>
                                    Failed — retry
                                  </button>
                                )}
                              </div>
                            </div>
                            {/* Loaded detail */}
                            {rdState === 'loaded' && rdCaps && (
                              <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--n-50)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {sets.length > 0 && (
                                  <div>
                                    <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--fg-3)', marginBottom: 6 }}>Permission Sets</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                      {sets.map((ps) => (
                                        <div key={ps.id} style={{ padding: '4px 0' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-sm)' }}>
                                            <span style={{ color: 'var(--fg-1)', fontWeight: 500, flex: 1 }}>{ps.name}</span>
                                            {ps.module && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{ps.module}</span>}
                                            <Badge variant={ps.type === 'System' ? 'info' : 'accent'}>{ps.type.toLowerCase()}</Badge>
                                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{ps.capabilities.length}</span>
                                          </div>
                                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.4, marginTop: 2 }}>{ps.description}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {(role.customCapabilities || []).length > 0 && (
                                  <div>
                                    <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--fg-3)', marginBottom: 6 }}>Custom Capabilities</div>
                                    {role.customCapabilities.map((ck) => {
                                      const cap = window.lookupCapability ? window.lookupCapability(ck) : null;
                                      return (
                                        <div key={ck} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '3px 0', fontSize: 'var(--fs-sm)' }}>
                                          <code style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)' }}>{ck}</code>
                                          {cap && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{cap.description}</span>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--fg-3)', marginBottom: 6 }}>All Capabilities ({rdCaps.size})</div>
                                  {window.CapabilityGrid && <window.CapabilityGrid capKeys={rdCaps} />}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Assign role button */}
                  <Button variant="ghost" size="sm" icon="plus" onClick={() => setRolePickerOpen(true)} style={{ width: '100%' }}>
                    Assign role
                  </Button>
                </Card>

                {/* Assign role sheet — multi-select with loading */}
                {rolePickerOpen && window.InlineSheet && (
                  <window.InlineSheet
                    title="Assign Roles"
                    subtitle={`Toggle roles for ${USER.name}. Changes are saved automatically.`}
                    onClose={() => { setRolePickerOpen(false); setRolePickerQ(''); }}
                    footer={<Button variant="accent" onClick={() => { setRolePickerOpen(false); setRolePickerQ(''); }}>Done</Button>}
                  >
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}><Icon name="search" size={14} /></span>
                      <input className="x-input" style={{ paddingLeft: 32, height: 32, width: '100%' }} placeholder="Search roles..." value={rolePickerQ} onChange={(e) => setRolePickerQ(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {(() => {
                        const lq = rolePickerQ.toLowerCase().trim();
                        const filtered = allRoles.filter((r) => !lq || r.name.toLowerCase().includes(lq) || r.description.toLowerCase().includes(lq));
                        if (filtered.length === 0) return <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>No roles match your search.</div>;
                        return filtered.map((role) => {
                          const isAssigned = assignedRoleIds.has(role.id);
                          const isLoading = roleAssigning.has(role.id);
                          const sets = (role.permissionSets || []).map((id) => (window.PERMISSION_SETS_DATA || []).find((ps) => ps.id === id)).filter(Boolean);
                          return (
                            <label
                              key={role.id}
                              style={{
                                padding: '12px 14px', border: '1px solid', borderRadius: 'var(--radius-md)',
                                borderColor: isAssigned ? 'var(--fg-accent)' : 'var(--border-subtle)',
                                background: isAssigned ? 'var(--a-50)' : 'transparent',
                                cursor: isLoading ? 'wait' : 'pointer',
                                opacity: isLoading ? 0.6 : 1,
                                transition: 'border-color 120ms ease, background 120ms ease, opacity 120ms ease',
                                display: 'flex', gap: 12, alignItems: 'flex-start',
                              }}
                            >
                              <div style={{ paddingTop: 2, flexShrink: 0 }}>
                                {isLoading ? <span className="x-spinner" /> : <Checkbox checked={isAssigned} onChange={() => toggleRoleAssignment(role.id)} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                  <span style={{ fontWeight: 500, fontSize: 'var(--fs-sm)', color: 'var(--fg-1)', flex: 1 }}>{role.name}</span>
                                  <Badge variant={role.type === 'System' ? 'info' : 'accent'}>{role.type}</Badge>
                                </div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.4, marginBottom: 4 }}>{role.description}</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                  {sets.map((ps) => <Badge key={ps.id} variant="neutral">{ps.name}</Badge>)}
                                  {(role.customCapabilities || []).length > 0 && <Badge variant="neutral">{role.customCapabilities.length} custom</Badge>}
                                </div>
                              </div>
                            </label>
                          );
                        });
                      })()}
                    </div>
                  </window.InlineSheet>
                )}

                {/* Effective permissions — loaded on demand */}
                <Card
                  title="Effective Permissions"
                  actions={
                    epState === 'idle' ? (
                      <Button variant="secondary" size="sm" icon="lock" onClick={fetchEffectivePerms}>
                        Load effective permissions
                      </Button>
                    ) : epState === 'loaded' ? (
                      <Badge variant="accent">{effectiveCaps.size} capabilities</Badge>
                    ) : null
                  }
                >
                  {epState === 'idle' && (
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.5 }}>
                      Effective permissions are the combined set of all capabilities from {USER.name.split(' ')[0]}'s assigned roles. Click "Load" to compute them — this requires a server call.
                    </div>
                  )}

                  {epState === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="x-spinner" />
                        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>Computing effective permissions across {userRoles.length} roles...</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[1, 2, 3].map((i) => (
                          <div key={i} style={{ height: 14, borderRadius: 'var(--radius-sm)', background: 'var(--n-50)', animation: 'x-fade-in 0.6s ease infinite alternate', animationDelay: `${i * 0.15}s`, opacity: 0.6 }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {epState === 'loaded' && effectiveCaps && (
                    <div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 12, lineHeight: 1.5 }}>
                        This is what {USER.name.split(' ')[0]} can actually do — the union of all capabilities from assigned roles.
                      </div>
                      {window.CapabilityGrid ? (
                        <window.CapabilityGrid capKeys={effectiveCaps} />
                      ) : (
                        <div style={{ color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>Capability viewer unavailable.</div>
                      )}
                    </div>
                  )}

                  {epState === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', padding: '16px 0' }}>
                      <Icon name="x" size={20} style={{ color: 'var(--error-500)' }} />
                      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>Failed to load effective permissions.</span>
                      <Button variant="secondary" size="sm" onClick={fetchEffectivePerms}>Retry</Button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Sessions Tab */}
            {tab === 'sessions' && (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  color: 'var(--fg-3)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <Icon name="settings" size={24} />
                <div style={{ marginTop: 8 }}>Active sessions appear here.</div>
              </div>
            )}
          </div>
        </div>

        {/* Side column */}
        {collapsed ? (
          <div className="ps-strip">
            {SIDE_TABS.map((t) => (
              <button
                key={t.value}
                className="ps-strip__btn"
                onClick={() => expandTo(t.value)}
                title={t.label}
              >
                <Icon name={t.icon} size={16} />
              </button>
            ))}
          </div>
        ) : (
          <div className="ps-side-col" style={{ width: sideWidth }}>
            <div className="ps-side-col__resizer" onMouseDown={onMouseDown} />
            <div
              style={{
                padding: '0 var(--sp-group)',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tabs
                value={sideTab}
                onChange={setSideTab}
                items={SIDE_TABS.map((t) => ({
                  value: t.value,
                  label: t.label,
                  icon: t.icon,
                  count: t.count,
                }))}
              />
              <div style={{ flex: 1 }} />
              <button
                className="ps-side-col__collapse-btn"
                onClick={() => setCollapsed(true)}
                title="Collapse"
              >
                <Icon name="panelClose" size={14} />
              </button>
            </div>
            <div className="ps-side-col__body">
              {sideTab === 'summary' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px 16px',
                  }}
                >
                  <div style={{ gridColumn: '1 / -1' }}>
                    <MetaRow label="Email">{USER.email}</MetaRow>
                  </div>
                  <MetaRow label="Phone">{USER.phone}</MetaRow>
                  <MetaRow label="Department">{USER.department}</MetaRow>
                  <MetaRow label="Manager">{USER.manager}</MetaRow>
                  <MetaRow label="Member since">
                    {fmtDate(USER.createdAt)}
                  </MetaRow>
                </div>
              )}
              {sideTab === 'notes' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sp-group)',
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
                    Admin Notes
                  </div>
                  <Textarea
                    rows={5}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button variant="accent" size="sm" icon="check">
                      Save Notes
                    </Button>
                  </div>
                </div>
              )}
              {sideTab === 'audit' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px 16px',
                  }}
                >
                  <MetaRow label="Created">{fmtDate(USER.createdAt)}</MetaRow>
                  <MetaRow label="Created by">System</MetaRow>
                  <MetaRow label="Last updated">May 14, 2026</MetaRow>
                  <MetaRow label="Updated by">Priya Shah</MetaRow>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pattern B: Edit Drawer */}
      <EditDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Edit User Profile"
        onSave={() => setDrawerOpen(false)}
      >
        <Field label="Full Name" required>
          <Input
            value={drawerForm.name}
            onChange={(e) => setDrawerField('name', e.target.value)}
          />
        </Field>
        <Field label="Email" required>
          <Input
            value={drawerForm.email}
            onChange={(e) => setDrawerField('email', e.target.value)}
            type="email"
          />
        </Field>
        <Field label="Role">
          <div style={{ position: 'relative' }}>
            <select
              className="x-input"
              value={drawerForm.role}
              onChange={(e) => setDrawerField('role', e.target.value)}
              style={{
                paddingRight: 28,
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option>Senior Reviewer</option>
              <option>Reviewer</option>
              <option>Billing Admin</option>
              <option>Auditor</option>
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
        <Field label="Department">
          <div style={{ position: 'relative' }}>
            <select
              className="x-input"
              value={drawerForm.department}
              onChange={(e) => setDrawerField('department', e.target.value)}
              style={{
                paddingRight: 28,
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option>Legal Operations</option>
              <option>Finance</option>
              <option>Compliance</option>
              <option>IT</option>
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
        <Field label="Phone">
          <Input
            value={drawerForm.phone}
            onChange={(e) => setDrawerField('phone', e.target.value)}
          />
        </Field>
        <Field label="Location">
          <Input
            value={drawerForm.location}
            onChange={(e) => setDrawerField('location', e.target.value)}
          />
        </Field>
        <Field label="Manager">
          <Input
            value={drawerForm.manager}
            onChange={(e) => setDrawerField('manager', e.target.value)}
          />
        </Field>
      </EditDrawer>
    </div>
  );
};

// =====================================================================
// USER DETAIL — CRM Two-Column (Paradigm 3)
// =====================================================================
const UserCRMDetail = () => {
  const [leftTab, setLeftTab] = React.useState('overview');
  const [rightTab, setRightTab] = React.useState('details');
  const [profileOpen, setProfileOpen] = React.useState(true);
  const [teamsOpen, setTeamsOpen] = React.useState(true);
  const [auditOpen, setAuditOpen] = React.useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb + header */}
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
        <PageNav
          onBack={() => {}}
          crumbs={[
            { label: 'Heartwood' },
            { label: 'Users' },
            { label: USER.name },
          ]}
          prevLabel="David Kim"
          nextLabel="Marcus Orr"
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-group)',
          }}
        >
          <Avatar name={USER.name} size="lg" />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-xl)',
                color: 'var(--fg-1)',
                fontWeight: 500,
              }}
            >
              {USER.name}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 'var(--fs-sm)',
              }}
            >
              <Badge variant="success" dot>
                Active
              </Badge>
              <span style={{ color: 'var(--fg-2)' }}>
                {USER.role} · {USER.department}
              </span>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" icon="edit">
            Edit Profile
          </Button>
          <Button variant="secondary" icon="lock">
            Disable
          </Button>
        </div>
      </div>

      {/* Two-column split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 420px',
          alignItems: 'flex-start',
          minHeight: 0,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            borderRight: '1px solid var(--border-subtle)',
            minWidth: 0,
          }}
        >
          <PSTabRow
            value={leftTab}
            onChange={setLeftTab}
            items={[
              { value: 'overview', label: 'Overview', icon: 'dashboard' },
              { value: 'activity', label: 'Activity', icon: 'history' },
              {
                value: 'permissions',
                label: 'Permissions',
                icon: 'lock',
              },
              { value: 'sessions', label: 'Sessions', icon: 'settings' },
            ]}
          />
          <div
            style={{
              padding: 'var(--sp-page-y) var(--sp-page-x)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-section)',
            }}
          >
            {leftTab === 'overview' && (
              <>
                <div>
                  <PSSectionHeader icon="grid" label="Highlights" />
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--sp-group)',
                    }}
                  >
                    <PSHighlightCard title="Status">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <Badge variant="success" dot>
                          Active
                        </Badge>
                        <div
                          style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-2)',
                          }}
                        >
                          Last login: {fmtDateTime(USER.lastLogin)}
                        </div>
                      </div>
                    </PSHighlightCard>
                    <PSHighlightCard title="Quick Stats">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          fontSize: 'var(--fs-sm)',
                        }}
                      >
                        <div style={{ color: 'var(--fg-2)' }}>
                          Member since {fmtDate(USER.createdAt)}
                        </div>
                        <div style={{ color: 'var(--fg-2)' }}>
                          {USER.teams.length} teams
                        </div>
                        <div style={{ color: 'var(--fg-2)' }}>
                          {USER.permissions.length} permissions
                        </div>
                      </div>
                    </PSHighlightCard>
                  </div>
                </div>
                <div>
                  <PSSectionHeader icon="history" label="Recent Activity" />
                  <div
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      padding: '8px 14px',
                    }}
                  >
                    {USER.activity.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 0',
                          borderBottom:
                            i < USER.activity.length - 1
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
                            display: 'grid',
                            placeItems: 'center',
                            flex: 'none',
                            color: 'var(--fg-2)',
                          }}
                        >
                          <Icon name={a.icon} size={12} />
                        </div>
                        <div
                          style={{
                            flex: 1,
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                          }}
                        >
                          {a.action}
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {a.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {leftTab === 'activity' && (
              <section
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', padding: '8px 20px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 35,
                      top: 16,
                      bottom: 16,
                      width: 1,
                      background: 'var(--border)',
                    }}
                  />
                  {USER.activity.map((e, i) => (
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
                          zIndex: 1,
                          color: 'var(--fg-2)',
                        }}
                      >
                        <Icon name={e.icon} size={14} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                          }}
                        >
                          {e.action}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                            marginTop: 2,
                          }}
                        >
                          {e.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {leftTab === 'permissions' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 'var(--sp-section)',
                }}
              >
                {ROLE.permissions.map((g) => (
                  <div key={g.group}>
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
                      {g.group}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      {g.items.map((item) => (
                        <div
                          key={item}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--fg-1)',
                          }}
                        >
                          <Icon
                            name="check"
                            size={12}
                            style={{ color: 'var(--success-500)' }}
                          />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {leftTab === 'sessions' && (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  color: 'var(--fg-3)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <Icon name="settings" size={24} />
                <div style={{ marginTop: 8 }}>Active sessions appear here.</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — sticky details column */}
        <div
          style={{
            background: 'var(--bg-surface)',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 56px)',
            overflowY: 'auto',
          }}
        >
          <PSTabRow
            value={rightTab}
            onChange={setRightTab}
            items={[
              { value: 'details', label: 'Details', icon: 'user' },
              { value: 'notes', label: 'Notes', icon: 'comment' },
            ]}
          />
          <div style={{ padding: '12px 20px 24px' }}>
            {rightTab === 'details' && (
              <>
                <PSSectionHeader
                  icon="user"
                  label="Profile"
                  expanded={profileOpen}
                  onToggle={() => setProfileOpen((v) => !v)}
                  actions={
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="edit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Button>
                  }
                />
                {profileOpen && (
                  <div>
                    <CRMRow icon="user" label="Email">
                      {USER.email}
                    </CRMRow>
                    <CRMRow icon="user" label="Phone">
                      {USER.phone}
                    </CRMRow>
                    <CRMRow icon="building" label="Department">
                      {USER.department}
                    </CRMRow>
                    <CRMRow icon="user" label="Manager">
                      {USER.manager}
                    </CRMRow>
                    <CRMRow icon="clock" label="Timezone">
                      {USER.timezone}
                    </CRMRow>
                    <CRMRow icon="calendar" label="Member since">
                      {fmtDate(USER.createdAt)}
                    </CRMRow>
                  </div>
                )}
                <div
                  style={{
                    marginTop: 8,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 4,
                  }}
                >
                  <PSSectionHeader
                    icon="users"
                    label="Teams & Access"
                    expanded={teamsOpen}
                    onToggle={() => setTeamsOpen((v) => !v)}
                  />
                  {teamsOpen && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          flexWrap: 'wrap',
                          padding: '4px 0 8px',
                        }}
                      >
                        {USER.teams.map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 4,
                          flexWrap: 'wrap',
                        }}
                      >
                        {USER.permissions.map((p) => (
                          <span
                            key={p}
                            className="x-mono"
                            style={{
                              fontSize: 'var(--fs-xs)',
                              padding: '2px 6px',
                              background: 'var(--n-50)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--fg-2)',
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 4,
                  }}
                >
                  <PSSectionHeader
                    icon="clock"
                    label="History"
                    expanded={auditOpen}
                    onToggle={() => setAuditOpen((v) => !v)}
                  />
                  {auditOpen && (
                    <div>
                      <CRMRow icon="clock" label="Created">
                        {fmtDate(USER.createdAt)}
                      </CRMRow>
                      <CRMRow icon="user" label="Created by">
                        System
                      </CRMRow>
                      <CRMRow icon="clock" label="Last login">
                        {fmtDateTime(USER.lastLogin)}
                      </CRMRow>
                    </div>
                  )}
                </div>
              </>
            )}
            {rightTab === 'notes' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  paddingTop: 12,
                }}
              >
                {PS_V2_NOTES.map((n, i) => (
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
      </div>
    </div>
  );
};

// =====================================================================
// ROLE DETAIL — Block Stacked (Paradigm 2)
// =====================================================================
const RoleDetail = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div
      style={{
        padding: 'var(--sp-page-y) var(--sp-page-x)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-section)',
      }}
    >
      <PageNav
        onBack={() => {}}
        crumbs={[
          { label: 'Heartwood' },
          { label: 'Roles' },
          { label: ROLE.name },
        ]}
      />
      <div className="x-page__head">
        <div className="x-page__title-wrap" style={{ gap: 8 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-caps)',
              color: 'var(--fg-3)',
              fontWeight: 600,
            }}
          >
            {ROLE.type}
          </div>
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
              {ROLE.name}
            </span>
            <Badge variant="success" dot>
              Active
            </Badge>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>
              {ROLE.memberCount} members
            </span>
          </div>
          <div
            style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--fg-2)',
              marginTop: 2,
            }}
          >
            {ROLE.description}
          </div>
        </div>
        <div
          className="x-page__actions"
          style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
        >
          <Button variant="secondary" icon="edit">
            Edit
          </Button>
          <Button variant="secondary" icon="copy">
            Duplicate
          </Button>
        </div>
      </div>
    </div>
    <div
      style={{
        padding: 'var(--sp-page-y) var(--sp-page-x)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-section)',
      }}
    >
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
            gap: 8,
          }}
        >
          <Icon name="lock" size={14} style={{ color: 'var(--fg-2)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              color: 'var(--fg-1)',
            }}
          >
            Permissions
          </span>
        </header>
        <div
          style={{
            padding: 'var(--sp-page-y)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--sp-section)',
          }}
        >
          {ROLE.permissions.map((g) => (
            <div key={g.group}>
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
                {g.group}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {g.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--fg-1)',
                    }}
                  >
                    <Icon
                      name="check"
                      size={12}
                      style={{ color: 'var(--success-500)' }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
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
            gap: 8,
          }}
        >
          <Icon name="users" size={14} style={{ color: 'var(--fg-2)' }} />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-lg)',
              color: 'var(--fg-1)',
            }}
          >
            Members
          </span>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-3)' }}>
            · {ROLE.members.length} of {ROLE.memberCount}
          </span>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm" icon="user">
            Add member
          </Button>
        </header>
        <div
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {ROLE.members.map((m) => (
            <div
              key={m.name}
              style={{ display: 'flex', gap: 10, alignItems: 'center' }}
            >
              <Avatar name={m.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500 }}>
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--fg-3)',
                  }}
                >
                  {m.dept}
                </div>
              </div>
              <IconButton icon="more" />
            </div>
          ))}
        </div>
      </section>
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px 16px',
          }}
        >
          <MetaRow label="Created">{fmtDate(ROLE.createdAt)}</MetaRow>
          <MetaRow label="Last updated">{fmtDate(ROLE.updatedAt)}</MetaRow>
          <MetaRow label="Updated by">{ROLE.updatedBy}</MetaRow>
        </div>
      </section>
    </div>
  </div>
);

// =====================================================================
// ROLE DETAIL — Tab + Side Column (Paradigm 1A) with Permission Edit
// =====================================================================
const RoleTabsDetail = ({ onBack, roleData } = {}) => {
  const [tab, setTab] = React.useState('permissions');
  const [sideTab, setSideTab] = React.useState('summary');
  const [collapsed, setCollapsed] = React.useState(false);
  const [sideWidth, setSideWidth] = React.useState(360);
  const [editSheetOpen, setEditSheetOpen] = React.useState(false);

  const matchedRole = React.useMemo(() => {
    if (roleData) return roleData;
    const roles = window.PERM_ROLES_DATA || [];
    return roles.find((r) => r.name === ROLE.name) || null;
  }, [roleData]);

  const roleSets = React.useMemo(() => {
    if (!matchedRole) return [];
    return (matchedRole.permissionSets || []).map((id) => (window.PERMISSION_SETS_DATA || []).find((ps) => ps.id === id)).filter(Boolean);
  }, [matchedRole]);

  const [allCapsState, setAllCapsState] = React.useState('idle');
  const [allCapKeys, setAllCapKeys] = React.useState(null);

  const fetchAllCaps = () => {
    setAllCapsState('loading');
    setTimeout(() => {
      try {
        const caps = matchedRole && window.getRoleTotalCaps ? window.getRoleTotalCaps(matchedRole) : new Set();
        setAllCapKeys(caps);
        setAllCapsState('loaded');
      } catch { setAllCapsState('error'); }
    }, 800);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = sideWidth;
    const onMove = (ev) =>
      setSideWidth(
        Math.max(
          280,
          Math.min(
            Math.round(window.innerWidth * 0.5),
            startW + (startX - ev.clientX),
          ),
        ),
      );
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
  const expandTo = (t) => {
    setSideTab(t);
    setCollapsed(false);
  };
  const SIDE_TABS = [
    { value: 'summary', label: 'Summary', icon: 'lock' },
    { value: 'notes', label: 'Notes', icon: 'comment' },
  ];

  const rd = roleData || ROLE;
  const isSystem = (rd.type || matchedRole?.type) === 'System';
  const roleName = rd.name || ROLE.name;
  const roleDesc = rd.description || ROLE.description;
  const roleType = rd.type || ROLE.type;
  const roleMemberCount = rd.members || ROLE.memberCount;
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        {onBack && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
            <button type="button" onClick={onBack} style={{ all: 'unset', cursor: 'pointer', color: 'var(--fg-accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="chevronLeft" size={11} />Roles & permissions
            </button>
            <span style={{ color: 'var(--fg-4)' }}>/</span>
            <span>{roleName}</span>
          </div>
        )}
        {!onBack && (
          <PageNav crumbs={[{ label: 'Settings' }, { label: 'Roles & permissions' }, { label: roleName }]} />
        )}
        <div className="x-page__head">
          <div className="x-page__title-wrap" style={{ gap: 8 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--fg-3)', fontWeight: 600 }}>
              {roleType}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 500, color: 'var(--fg-1)' }}>{roleName}</span>
              <Badge variant="success" dot>Active</Badge>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>{roleMemberCount} members</span>
              {rd.key && <code style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', background: 'var(--n-50)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{rd.key}</code>}
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)', marginTop: 2 }}>{roleDesc}</div>
            {isSystem && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginTop: 4 }}>This is a system role managed by XTND. To customize access, create a custom role instead.</div>}
          </div>
          <div className="x-page__actions" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {!isSystem && (
              <>
                <Button variant="secondary" icon="edit" onClick={() => setEditSheetOpen(true)}>Edit role</Button>
                <Button variant="secondary" icon="copy">Duplicate</Button>
                <Button variant="danger" icon="x" onClick={() => setDeleteConfirm(true)}>Delete</Button>
              </>
            )}
            {isSystem && (
              <Button variant="secondary" icon="copy">Duplicate as custom</Button>
            )}
          </div>
        </div>
      </div>
      {/* Delete confirmation */}
      {deleteConfirm && (
        <div style={{ margin: '0 var(--sp-page-x) var(--sp-section)', padding: '12px 16px', background: 'var(--error-50)', border: '1px solid var(--error-200)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="x" size={16} style={{ color: 'var(--error-500)' }} />
          <div style={{ flex: 1, fontSize: 'var(--fs-sm)', color: 'var(--fg-1)' }}>
            Are you sure you want to delete <strong>{roleName}</strong>? This will remove the role from all {roleMemberCount} assigned members. This action cannot be undone.
          </div>
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => { setDeleteConfirm(false); onBack && onBack(); }}>Delete role</Button>
        </div>
      )}

      {/* Body */}
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Tabs inside left column */}
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
              value={tab}
              onChange={setTab}
              items={[
                { value: 'permissions', label: 'Permissions', icon: 'lock' },
                {
                  value: 'members',
                  label: 'Members',
                  icon: 'users',
                  count: ROLE.memberCount,
                },
                { value: 'audit', label: 'History', icon: 'history' },
              ]}
            />
            <div style={{ flex: 1 }} />
          </div>
          <div
            style={{
              flex: 1,
              padding: 'var(--sp-page-y) var(--sp-page-x)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-section)',
            }}
          >
            {/* Permissions Tab */}
            {tab === 'permissions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-section)' }}>
                {/* Permission sets */}
                {roleSets.length > 0 && (
                  <Card title="Permission Sets" actions={<Badge variant="neutral">{roleSets.length}</Badge>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {roleSets.map((ps) => (
                        <div key={ps.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-sm)' }}>
                            <span style={{ fontWeight: 500, color: 'var(--fg-1)', flex: 1 }}>{ps.name}</span>
                            {ps.module && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{ps.module}</span>}
                            <Badge variant={ps.type === 'System' ? 'info' : 'accent'}>{ps.type.toLowerCase()}</Badge>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{ps.capabilities.length} capabilities</span>
                          </div>
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.4, marginTop: 4 }}>{ps.description}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                {/* Custom capabilities */}
                {matchedRole && (matchedRole.customCapabilities || []).length > 0 && (
                  <Card title="Custom Capabilities" actions={<Badge variant="neutral">{matchedRole.customCapabilities.length}</Badge>}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 8, lineHeight: 1.5 }}>
                      Individual capabilities added to this role beyond what permission sets provide.
                    </div>
                    {matchedRole.customCapabilities.map((ck) => {
                      const cap = window.lookupCapability ? window.lookupCapability(ck) : null;
                      return (
                        <div key={ck} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '4px 0', fontSize: 'var(--fs-sm)' }}>
                          <code style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)' }}>{ck}</code>
                          {cap && <span style={{ color: 'var(--fg-3)', fontSize: 'var(--fs-xs)' }}>{cap.description}</span>}
                        </div>
                      );
                    })}
                  </Card>
                )}
                {/* All capabilities — on demand */}
                <Card
                  title="All Capabilities"
                  actions={
                    allCapsState === 'idle' ? (
                      <Button variant="secondary" size="sm" icon="lock" onClick={fetchAllCaps}>
                        View all capabilities
                      </Button>
                    ) : allCapsState === 'loaded' && allCapKeys ? (
                      <Badge variant="accent">{allCapKeys.size} capabilities</Badge>
                    ) : null
                  }
                >
                  {allCapsState === 'idle' && (
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', lineHeight: 1.5 }}>
                      The effective set of all capabilities this role grants — computed from permission sets and custom capabilities combined. Click "View" to load.
                    </div>
                  )}
                  {allCapsState === 'loading' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                      <span className="x-spinner" />
                      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>Computing capabilities across {roleSets.length} permission sets...</span>
                    </div>
                  )}
                  {allCapsState === 'loaded' && allCapKeys && (
                    <div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 12, lineHeight: 1.5 }}>
                        The union of all capabilities from permission sets and custom capabilities.
                      </div>
                      {window.CapabilityGrid && <window.CapabilityGrid capKeys={allCapKeys} />}
                    </div>
                  )}
                  {allCapsState === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', padding: '16px 0' }}>
                      <Icon name="x" size={20} style={{ color: 'var(--error-500)' }} />
                      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>Failed to load capabilities.</span>
                      <Button variant="secondary" size="sm" onClick={fetchAllCaps}>Retry</Button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Members Tab */}
            {tab === 'members' && (
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
                    gap: 8,
                  }}
                >
                  <Icon
                    name="users"
                    size={14}
                    style={{ color: 'var(--fg-2)' }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--fs-lg)',
                      color: 'var(--fg-1)',
                    }}
                  >
                    Members
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--fs-sm)',
                      color: 'var(--fg-3)',
                    }}
                  >
                    · {ROLE.members.length} of {ROLE.memberCount}
                  </span>
                  <div style={{ flex: 1 }} />
                  <Button variant="ghost" size="sm" icon="user">
                    Add member
                  </Button>
                </header>
                <div
                  style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {ROLE.members.map((m) => (
                    <div
                      key={m.name}
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                      }}
                    >
                      <Avatar name={m.name} />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 'var(--fs-sm)',
                            fontWeight: 500,
                          }}
                        >
                          {m.name}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                          }}
                        >
                          {m.dept}
                        </div>
                      </div>
                      <IconButton icon="more" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Audit Tab */}
            {tab === 'audit' && (
              <section
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px 16px',
                  }}
                >
                  <MetaRow label="Created">{fmtDate(ROLE.createdAt)}</MetaRow>
                  <MetaRow label="Created by">System</MetaRow>
                  <MetaRow label="Last updated">
                    {fmtDate(ROLE.updatedAt)}
                  </MetaRow>
                  <MetaRow label="Updated by">{ROLE.updatedBy}</MetaRow>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Side column */}
        {collapsed ? (
          <div className="ps-strip">
            {SIDE_TABS.map((t) => (
              <button
                key={t.value}
                className="ps-strip__btn"
                onClick={() => expandTo(t.value)}
                title={t.label}
              >
                <Icon name={t.icon} size={16} />
              </button>
            ))}
          </div>
        ) : (
          <div className="ps-side-col" style={{ width: sideWidth }}>
            <div className="ps-side-col__resizer" onMouseDown={onMouseDown} />
            <div
              style={{
                padding: '0 var(--sp-group)',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tabs
                value={sideTab}
                onChange={setSideTab}
                items={SIDE_TABS.map((t) => ({
                  value: t.value,
                  label: t.label,
                  icon: t.icon,
                  count: t.count,
                }))}
              />
              <div style={{ flex: 1 }} />
              <button
                className="ps-side-col__collapse-btn"
                onClick={() => setCollapsed(true)}
                title="Collapse"
              >
                <Icon name="panelClose" size={14} />
              </button>
            </div>
            <div className="ps-side-col__body">
              {sideTab === 'summary' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px 16px',
                  }}
                >
                  <div style={{ gridColumn: '1 / -1' }}>
                    <MetaRow label="Type">{ROLE.type}</MetaRow>
                  </div>
                  <MetaRow label="Members">{ROLE.memberCount}</MetaRow>
                  <MetaRow label="Status">
                    <Badge variant="success" dot>
                      Active
                    </Badge>
                  </MetaRow>
                  <MetaRow label="Created">{fmtDate(ROLE.createdAt)}</MetaRow>
                  <MetaRow label="Updated">{fmtDate(ROLE.updatedAt)}</MetaRow>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <MetaRow label="Updated by">{ROLE.updatedBy}</MetaRow>
                  </div>
                </div>
              )}
              {sideTab === 'notes' && (
                <div
                  style={{
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--fg-3)',
                  }}
                >
                  No notes have been added to this role.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Edit role sheet */}
      {editSheetOpen && window.InlineSheet && (() => {
        const EditRoleForm = () => {
          const [name, setName] = React.useState(ROLE.name);
          const [description, setDescription] = React.useState(ROLE.description);
          const [activeTab, setActiveTab] = React.useState('sets');
          const [selectedSets, setSelectedSets] = React.useState(() => new Set(matchedRole ? matchedRole.permissionSets : []));
          const [customCaps, setCustomCaps] = React.useState(() => new Set(matchedRole ? matchedRole.customCapabilities : []));
          const [conditions, setConditions] = React.useState({});
          const [setSearchQ, setSetSearchQ] = React.useState('');
          const [capSearchQ, setCapSearchQ] = React.useState('');

          const allSets = window.PERMISSION_SETS_DATA || [];
          const disabledCaps = React.useMemo(() => {
            const d = new Set();
            allSets.forEach((ps) => { if (selectedSets.has(ps.id)) ps.capabilities.forEach((c) => d.add(c)); });
            return d;
          }, [selectedSets]);
          const totalCaps = new Set([...disabledCaps, ...customCaps]).size;

          const filteredSets = React.useMemo(() => {
            const q = setSearchQ.toLowerCase().trim();
            if (!q) return allSets;
            return allSets.filter((ps) => ps.name.toLowerCase().includes(q) || ps.description.toLowerCase().includes(q));
          }, [setSearchQ]);

          return (
            <window.InlineSheet
              title={`Edit: ${ROLE.name}`}
              subtitle="Update this role's permission sets and capabilities. Changes take effect immediately for all assigned members."
              onClose={() => setEditSheetOpen(false)}
              footer={<><Button variant="ghost" onClick={() => setEditSheetOpen(false)}>Cancel</Button><Button variant="accent" disabled={!name.trim()}>Save Changes</Button></>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="Name" required>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Description">
                  <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Field>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Segmented value={activeTab} onChange={setActiveTab} options={[{ value: 'sets', label: 'Permission Sets' }, { value: 'custom', label: 'Custom Capabilities' }]} />
                  {totalCaps > 0 && <Badge variant="accent">{totalCaps} capabilities</Badge>}
                </div>
                {activeTab === 'sets' && (
                  <div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 10, lineHeight: 1.5 }}>Select which permission sets this role includes.</div>
                    <div style={{ position: 'relative', marginBottom: 10 }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}><Icon name="search" size={14} /></span>
                      <input className="x-input" style={{ paddingLeft: 32, height: 30, width: '100%' }} placeholder="Filter permission sets..." value={setSearchQ} onChange={(e) => setSetSearchQ(e.target.value)} />
                    </div>
                    {filteredSets.map((ps) => (
                      <label key={ps.id} className="x-perm-set-row">
                        <Checkbox checked={selectedSets.has(ps.id)} onChange={() => { const n = new Set(selectedSets); n.has(ps.id) ? n.delete(ps.id) : n.add(ps.id); setSelectedSets(n); }} />
                        <div className="x-perm-set-row__info">
                          <div className="x-perm-set-row__name">{ps.name} {ps.module && <span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>· {ps.module}</span>}</div>
                          <div className="x-perm-set-row__desc">{ps.description}</div>
                        </div>
                        <div className="x-perm-set-row__meta">
                          <Badge variant={ps.type === 'System' ? 'info' : 'accent'}>{ps.type.toLowerCase()}</Badge>
                          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>{ps.capabilities.length}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {activeTab === 'custom' && (
                  <div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', marginBottom: 10, lineHeight: 1.5 }}>Add individual capabilities. Those from selected permission sets are locked.</div>
                    <div style={{ position: 'relative', marginBottom: 10 }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-3)', pointerEvents: 'none' }}><Icon name="search" size={14} /></span>
                      <input className="x-input" style={{ paddingLeft: 32, height: 30, width: '100%' }} placeholder="Filter capabilities..." value={capSearchQ} onChange={(e) => setCapSearchQ(e.target.value)} />
                    </div>
                    {window.CapabilityTree && <window.CapabilityTree selectedCaps={customCaps} onToggleCap={(k) => { const n = new Set(customCaps); n.has(k) ? n.delete(k) : n.add(k); setCustomCaps(n); }} conditions={conditions} onSetConditions={(k, c) => setConditions((p) => ({ ...p, [k]: c }))} searchQ={capSearchQ} disabledCaps={disabledCaps} />}
                  </div>
                )}
              </div>
            </window.InlineSheet>
          );
        };
        return <EditRoleForm />;
      })()}
    </div>
  );
};

// =====================================================================
// MATTER DETAIL — Tab + Side Column (Paradigm 1A)
// =====================================================================
const MATTER = {
  id: 'M-2024-00418',
  title: 'Patent Litigation — Northern District',
  status: 'active',
  client: 'Acme Corporation',
  clientCode: 'ACM-001',
  leadAttorney: 'K. Alvarez',
  practiceArea: 'Intellectual Property',
  budget: 2100000,
  spent: 845000,
  openedDate: '2024-01-15',
  description:
    'Patent infringement case filed in N.D. Cal. covering three utility patents related to distributed computing architecture.',
  team: [
    { name: 'K. Alvarez', role: 'Lead Partner', rate: 1250 },
    { name: 'J. Bhatt', role: 'Senior Associate', rate: 780 },
    { name: 'S. Okonkwo', role: 'Associate', rate: 720 },
    { name: 'M. Chen', role: 'Paralegal', rate: 320 },
  ],
  invoices: [
    {
      id: '1255',
      vendor: 'Morris Pine Chandler',
      amount: 98500,
      status: 'approved',
    },
    {
      id: '1262',
      vendor: 'Morris Pine Chandler',
      amount: 142880,
      status: 'in_review',
    },
    {
      id: '1270',
      vendor: 'Apex Legal Services',
      amount: 18878,
      status: 'draft',
    },
  ],
  milestones: [
    { label: 'Complaint Filed', date: '2024-01-15', done: true },
    { label: 'Discovery Phase', date: '2024-06-01', done: true },
    { label: 'Expert Reports', date: '2025-03-01', done: true },
    { label: 'Summary Judgment', date: '2026-06-15', done: false },
    { label: 'Trial', date: '2026-11-01', done: false },
  ],
};

const PSMatterDetail = () => {
  const [tab, setTab] = React.useState('overview');
  const [sideTab, setSideTab] = React.useState('summary');
  const [collapsed, setCollapsed] = React.useState(false);
  const [sideWidth, setSideWidth] = React.useState(360);
  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = sideWidth;
    const onMove = (ev) =>
      setSideWidth(
        Math.max(
          280,
          Math.min(
            Math.round(window.innerWidth * 0.5),
            startW + (startX - ev.clientX),
          ),
        ),
      );
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
  const expandTo = (t) => {
    setSideTab(t);
    setCollapsed(false);
  };
  const SIDE_TABS = [
    { value: 'summary', label: 'Summary', icon: 'invoice' },
    { value: 'comments', label: 'Comments', icon: 'comment', count: 2 },
    { value: 'audit', label: 'History', icon: 'history' },
  ];
  const pctSpent = Math.round((MATTER.spent / MATTER.budget) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
        }}
      >
        <PageNav
          onBack={() => {}}
          crumbs={[
            { label: 'Banyan' },
            { label: 'Matters' },
            { label: MATTER.id },
          ]}
          prevLabel="M-2024-00417"
          nextLabel="M-2024-00419"
        />
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
                {MATTER.title}
              </span>
              <Badge variant="success" dot>
                Active
              </Badge>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)' }}>
                Budget: {fmtMoney(MATTER.budget)} ({pctSpent}% spent)
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 20,
                rowGap: 4,
                marginTop: 4,
                fontSize: 'var(--fs-sm)',
                color: 'var(--fg-2)',
              }}
            >
              <span>
                <Icon
                  name="building"
                  size={13}
                  style={{
                    verticalAlign: -2,
                    marginRight: 6,
                    color: 'var(--fg-4)',
                  }}
                />
                Client: {MATTER.client}
              </span>
              <span>·</span>
              <span>Lead: {MATTER.leadAttorney}</span>
              <span>·</span>
              <span>Practice: {MATTER.practiceArea}</span>
            </div>
          </div>
          <div
            className="x-page__actions"
            style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            <Button variant="secondary" icon="edit">
              Edit
            </Button>
            <Button variant="secondary" icon="x">
              Close Matter
            </Button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
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
              value={tab}
              onChange={setTab}
              items={[
                { value: 'overview', label: 'Overview', icon: 'dashboard' },
                {
                  value: 'invoices',
                  label: 'Invoices',
                  icon: 'invoice',
                  count: 3,
                },
                { value: 'team', label: 'Team', icon: 'users', count: 4 },
                { value: 'documents', label: 'Documents', icon: 'paperclip' },
              ]}
            />
            <div style={{ flex: 1 }} />
          </div>
          <div
            style={{ flex: 1, padding: 'var(--sp-page-y) var(--sp-page-x)' }}
          >
            {tab === 'overview' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-section)',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--fs-md)',
                    color: 'var(--fg-1)',
                    lineHeight: 1.6,
                  }}
                >
                  {MATTER.description}
                </div>
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
                    Milestones
                  </div>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {MATTER.milestones.map((m, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          position: 'relative',
                        }}
                      >
                        {i > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              right: '50%',
                              top: 10,
                              height: 2,
                              background: m.done
                                ? 'var(--success-400)'
                                : 'var(--border)',
                            }}
                          />
                        )}
                        {i < MATTER.milestones.length - 1 && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              right: 0,
                              top: 10,
                              height: 2,
                              background: MATTER.milestones[i + 1]?.done
                                ? 'var(--success-400)'
                                : 'var(--border)',
                            }}
                          />
                        )}
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: m.done
                              ? 'var(--success-500)'
                              : 'var(--bg-surface)',
                            border: m.done ? 'none' : '2px solid var(--border)',
                            display: 'grid',
                            placeItems: 'center',
                            zIndex: 1,
                          }}
                        >
                          {m.done && (
                            <Icon
                              name="check"
                              size={12}
                              style={{ color: 'white' }}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--fs-xs)',
                            fontWeight: 500,
                            color: m.done ? 'var(--fg-1)' : 'var(--fg-3)',
                            textAlign: 'center',
                          }}
                        >
                          {m.label}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--fg-3)',
                          }}
                        >
                          {fmtDate(m.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === 'invoices' && (
              <div className="x-grid-wrap" style={{ boxShadow: 'none' }}>
                <table className="x-grid">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Client</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATTER.invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="x-cell--mono">{inv.id}</td>
                        <td>{inv.vendor}</td>
                        <td className="x-cell--num">{fmtMoney(inv.amount)}</td>
                        <td>
                          <InvoiceStatus status={inv.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'team' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 'var(--sp-group)',
                }}
              >
                {MATTER.team.map((m) => (
                  <div
                    key={m.name}
                    className="x-card"
                    style={{
                      padding: 16,
                      display: 'flex',
                      gap: 'var(--sp-group)',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar name={m.name} size="lg" />
                    <div>
                      <div style={{ fontWeight: 500 }}>{m.name}</div>
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-3)',
                        }}
                      >
                        {m.role}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--fg-2)',
                          marginTop: 2,
                        }}
                      >
                        {fmtMoney(m.rate)}/hr
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                Documents for this matter appear here.
              </div>
            )}
          </div>
        </div>
        {collapsed ? (
          <div className="ps-strip">
            {SIDE_TABS.map((t) => (
              <button
                key={t.value}
                className="ps-strip__btn"
                onClick={() => expandTo(t.value)}
                title={t.label}
              >
                <Icon name={t.icon} size={16} />
                {t.count != null && t.count > 0 && (
                  <span className="ps-strip__count">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="ps-side-col" style={{ width: sideWidth }}>
            <div className="ps-side-col__resizer" onMouseDown={onMouseDown} />
            <div
              style={{
                padding: '0 var(--sp-group)',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tabs
                value={sideTab}
                onChange={setSideTab}
                items={SIDE_TABS.map((t) => ({
                  value: t.value,
                  label: t.label,
                  icon: t.icon,
                  count: t.count,
                }))}
              />
              <div style={{ flex: 1 }} />
              <button
                className="ps-side-col__collapse-btn"
                onClick={() => setCollapsed(true)}
                title="Collapse"
              >
                <Icon name="panelClose" size={14} />
              </button>
            </div>
            <div className="ps-side-col__body">
              {sideTab === 'summary' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px 16px',
                  }}
                >
                  <div style={{ gridColumn: '1 / -1' }}>
                    <MetaRow label="Client">
                      {MATTER.client} ({MATTER.clientCode})
                    </MetaRow>
                  </div>
                  <MetaRow label="Lead">{MATTER.leadAttorney}</MetaRow>
                  <MetaRow label="Practice">{MATTER.practiceArea}</MetaRow>
                  <MetaRow label="Opened">{fmtDate(MATTER.openedDate)}</MetaRow>
                  <MetaRow label="Budget">{fmtMoney(MATTER.budget)}</MetaRow>
                  <MetaRow label="Spent">
                    {fmtMoney(MATTER.spent)} ({pctSpent}%)
                  </MetaRow>
                  <MetaRow label="Invoices">{MATTER.invoices.length}</MetaRow>
                </div>
              )}
              {sideTab === 'comments' && (
                <div
                  style={{
                    color: 'var(--fg-3)',
                    fontSize: 'var(--fs-sm)',
                  }}
                >
                  2 comments on this matter.
                </div>
              )}
              {sideTab === 'audit' && (
                <div
                  style={{
                    color: 'var(--fg-3)',
                    fontSize: 'var(--fs-sm)',
                  }}
                >
                  Revision history appears here.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// PARADIGM SHOWCASE — rendered as a screen inside the main App.
// Accepts `paradigm` prop mapped from the nav route (e.g. 'ps-1a' → '1a').
// =====================================================================
const PS_ROUTE_MAP = {
  'ps-tabs': '1a',
  'ps-1a': '1a',
  'ps-1b': '1b',
  'ps-matter': 'matter',
  'ps-user-tabs': 'user-tabs',
  'ps-role-tabs': 'role-tabs',
  'ps-stacked': 'invoice-stacked',
  'ps-invoice-stacked': 'invoice-stacked',
  'ps-2': '2',
  'ps-user': 'user',
  'ps-role': 'role',
  'ps-crm': '3',
  'ps-3': '3',
  'ps-user-crm': 'user-crm',
};

const ParadigmShowcase = ({ screen }) => {
  const paradigm = PS_ROUTE_MAP[screen] || '1a';

  return (
    <>
      {paradigm === '1a' && <Paradigm1A />}
      {paradigm === '1b' && <Paradigm1B />}
      {paradigm === 'matter' && <PSMatterDetail />}
      {paradigm === 'invoice-stacked' && <InvoiceStacked />}
      {paradigm === '2' && <Paradigm2 />}
      {paradigm === 'user' && <UserDetail />}
      {paradigm === 'role' && <RoleDetail />}
      {paradigm === '3' && <Paradigm3 />}
      {paradigm === 'user-tabs' && <UserTabsDetail />}
      {paradigm === 'user-crm' && <UserCRMDetail />}
      {paradigm === 'role-tabs' && <RoleTabsDetail />}
    </>
  );
};
