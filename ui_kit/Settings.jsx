/* global React, Icon, Button, IconButton, Badge, Avatar, Card, Checkbox, Field, Input, Segmented, cls, fmtDate */

// ======================================================================
// Settings — nested page with secondary sidebar.
// Layout: [primary sidebar]  [secondary settings nav]  [content]
// ======================================================================

const SETTINGS_NAV = [
  {
    group: 'General',
    items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard' },
      { id: 'tenant', label: 'Tenant profile', icon: 'building' },
      { id: 'branding', label: 'Branding', icon: 'sparkles' },
      { id: 'locales', label: 'Locales & currency', icon: 'external' },
    ],
  },
  {
    group: 'Master data',
    items: [
      { id: 'matter-types', label: 'Matter types', icon: 'matter' },
      { id: 'practice', label: 'Practice areas', icon: 'folder' },
      { id: 'offices', label: 'Offices', icon: 'building' },
      { id: 'timekeepers', label: 'Timekeepers', icon: 'users' },
      { id: 'rate-cards', label: 'Rate cards', icon: 'dollar' },
      { id: 'vendors', label: 'Client directory', icon: 'vendor' },
    ],
  },
  {
    group: 'Reference data',
    items: [
      { id: 'ledes-task', label: 'LEDES task codes', icon: 'list' },
      { id: 'ledes-activity', label: 'LEDES activity codes', icon: 'list' },
      { id: 'ledes-expense', label: 'LEDES expense codes', icon: 'list' },
      { id: 'tax', label: 'Tax codes', icon: 'ledger' },
      { id: 'gl-accounts', label: 'GL accounts', icon: 'ledger' },
    ],
  },
  {
    group: 'Workflow',
    items: [
      { id: 'approvals', label: 'Approval policies', icon: 'approval' },
      { id: 'sla', label: 'Review SLAs', icon: 'clock' },
      { id: 'automations', label: 'Automations', icon: 'workflow' },
    ],
  },
  {
    group: 'Security',
    items: [
      { id: 'members', label: 'Members', icon: 'users' },
      { id: 'roles', label: 'Roles', icon: 'lock' },
      { id: 'api', label: 'API keys', icon: 'lock' },
      { id: 'audit', label: 'Audit log', icon: 'history' },
    ],
  },
];

// ---------- Secondary nav sidebar -----------------------------------
const SettingsNav = ({
  current,
  onNavigate,
  onCollapse,
  width = 228,
  onResize,
}) => (
  <div style={{ position: 'relative', flex: 'none', display: 'flex' }}>
    <aside className="x-pagenav" style={{ width }}>
      {/* Header with collapse button at top */}
      {onCollapse && (
        <div className="x-pagenav__header">
          <span className="x-pagenav__title">Settings</span>
          <button
            type="button"
            className="x-pagenav__collapse"
            onClick={onCollapse}
            title="Collapse"
          >
            <Icon name="chevronLeft" size={12} />
          </button>
        </div>
      )}
      <nav className="x-pagenav__list">
        {SETTINGS_NAV.map((section) => (
          <React.Fragment key={section.group}>
            <div className="x-pagenav__group">{section.group}</div>
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cls(
                  'x-pagenav__item',
                  current === item.id && 'is-active',
                )}
                aria-current={current === item.id ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
                title={item.label}
              >
                <Icon
                  name={item.icon}
                  size={14}
                  style={{ color: 'var(--fg-3)', flex: 'none' }}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>
    </aside>
    {onResize && (
      <div
        onMouseDown={onResize}
        style={{
          position: 'absolute',
          right: -2,
          top: 0,
          bottom: 0,
          width: 4,
          cursor: 'col-resize',
          zIndex: 3,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'var(--a-300)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      />
    )}
  </div>
);

// ---------- Overview page -------------------------------------------
const SettingsOverviewPage = ({ onNavigate }) => (
  <div
    style={{
      padding: 'var(--sp-page-y) var(--sp-page-x)',
      maxWidth: 1100,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-section)',
    }}
  >
    <div>
      <div className="x-page__sub">
        Manage the configuration, master data and reference data that power
        reviews, approvals and LEDES export for this tenant.
      </div>
    </div>

    {SETTINGS_NAV.slice(1, 4).map((section) => (
      <div
        key={section.group}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-group)',
        }}
      >
        <h2
          className="x-h3"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'var(--fs-lg)',
          }}
        >
          {section.group}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--sp-group)',
          }}
        >
          {section.items.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="x-card"
              style={{
                padding: 'var(--sp-section)',
                cursor: 'pointer',
                display: 'flex',
                gap: 'var(--sp-group)',
                alignItems: 'flex-start',
                transition: 'border-color 180ms ease',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--n-100)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--fg-2)',
                  flex: 'none',
                }}
              >
                <Icon name={item.icon} size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--fs-md)', fontWeight: 500 }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--fg-3)',
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {MASTER_HINT[item.id] || 'Manage this area'}
                </div>
                {HELP_URLS[item.id] && (
                  <a
                    href={HELP_URLS[item.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--fg-accent)',
                      textDecoration: 'none',
                      marginTop: 6,
                    }}
                  >
                    <Icon name="external" size={11} />
                    Get help
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const MASTER_HINT = {
  'matter-types':
    'Define case types, billing defaults, and matter templates used when opening new matters.',
  practice:
    'Organize practice groups for reporting, rate card assignment, and team structure.',
  offices:
    'Manage office locations, jurisdictions, and associated tax configurations.',
  timekeepers:
    'Maintain the directory of attorneys, paralegals, and other billing professionals.',
  'rate-cards':
    'Set contracted hourly rates per client and timekeeper level for billing validation.',
  vendors:
    'Manage the approved client directory including contact details and engagement terms.',
  'ledes-task':
    'Configure LEDES task codes (L100–L700) for standardized legal billing classification.',
  'ledes-activity':
    'Configure LEDES activity codes (A101–A111) for time entry categorization.',
  'ledes-expense':
    'Configure LEDES expense codes (E101–E124) for disbursement classification.',
  tax: 'Define tax codes and jurisdiction-specific rates applied to invoices and expenses.',
  'gl-accounts':
    'Map general ledger accounts for revenue recognition, trust, and expense posting.',
  approvals:
    'Configure multi-step approval workflows, thresholds, and escalation rules.',
  sla: 'Set review turnaround targets and notification triggers for overdue items.',
  automations:
    'Build automated rules for routing, flagging, and status transitions.',
  members: 'Manage team members, invite new users, and assign roles.',
  roles:
    'Define roles and permissions that control access across the workspace.',
  api: 'Generate and manage API keys for integrations and external system access.',
  audit: 'View the complete audit trail of all configuration and data changes.',
  tenant:
    'Update your organization name, legal entity details, and primary contact.',
  branding:
    'Customize logo, brand colors, and email templates for your workspace.',
  locales: 'Set default language, date format, timezone, and base currency.',
};

const HELP_URLS = {
  'matter-types': 'https://docs.xtnd.io/settings/matter-types',
  practice: 'https://docs.xtnd.io/settings/practice-areas',
  offices: 'https://docs.xtnd.io/settings/offices',
  timekeepers: 'https://docs.xtnd.io/settings/timekeepers',
  'rate-cards': 'https://docs.xtnd.io/settings/rate-cards',
  vendors: 'https://docs.xtnd.io/settings/client-directory',
  'ledes-task': 'https://docs.xtnd.io/reference/ledes-task-codes',
  'ledes-activity': 'https://docs.xtnd.io/reference/ledes-activity-codes',
  'ledes-expense': 'https://docs.xtnd.io/reference/ledes-expense-codes',
  tax: 'https://docs.xtnd.io/reference/tax-codes',
  'gl-accounts': 'https://docs.xtnd.io/reference/gl-accounts',
  approvals: 'https://docs.xtnd.io/workflow/approval-policies',
  sla: 'https://docs.xtnd.io/workflow/review-slas',
  automations: 'https://docs.xtnd.io/workflow/automations',
  members: 'https://docs.xtnd.io/security/members',
  roles: 'https://docs.xtnd.io/security/roles',
  api: 'https://docs.xtnd.io/security/api-keys',
  audit: 'https://docs.xtnd.io/security/audit-log',
};

// ======================================================================
// Data table page — shared shell for master/reference data
// Title + description + tab strip + toolbar + data grid
// ======================================================================
const DEFAULT_BULK_ACTIONS = [
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'export', label: 'Export', icon: 'download' },
  { id: 'delete', label: 'Delete', icon: 'x', variant: 'danger' },
];

const DataTablePage = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  columns,
  rows,
  primaryAction = 'Add',
  searchPlaceholder = 'Search…',
  footerCount,
  bulkActionMode = 'floating',
  bulkActions = DEFAULT_BULK_ACTIONS,
}) => {
  const [q, setQ] = React.useState('');
  const [selected, setSelected] = React.useState(new Set());
  const filtered = React.useMemo(
    () =>
      !q
        ? rows
        : rows.filter((r) =>
            JSON.stringify(r).toLowerCase().includes(q.toLowerCase()),
          ),
    [q, rows],
  );
  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };
  const toggleAll = () =>
    setSelected(
      selected.size === filtered.length
        ? new Set()
        : new Set(filtered.map((r) => r.id)),
    );
  const clearSelection = () => setSelected(new Set());
  const hasSelection = selected.size > 0;

  const BulkActionsToolbar = () =>
    hasSelection ? (
      <>
        <Button variant="secondary" size="sm" icon="edit">
          Edit
        </Button>
        <Button variant="secondary" size="sm" icon="x">
          Delete
        </Button>
      </>
    ) : null;

  const BulkActionsFloating = () =>
    hasSelection ? (
      <div className="x-bulk-bar">
        <Checkbox
          checked={selected.size === filtered.length}
          indeterminate={selected.size > 0 && selected.size < filtered.length}
          onChange={toggleAll}
        />
        <span className="x-bulk-bar__count">{selected.size} selected</span>
        <div className="x-bulk-bar__sep" />
        {bulkActions.map((a) => (
          <button
            key={a.id}
            className={cls(
              'x-bulk-bar__btn',
              a.variant === 'danger' && 'x-bulk-bar__btn--danger',
            )}
          >
            <Icon name={a.icon} size={14} />
            {a.label}
          </button>
        ))}
        <div className="x-bulk-bar__sep" />
        <button
          className="x-bulk-bar__close"
          onClick={clearSelection}
          title="Deselect all"
        >
          <Icon name="x" size={14} />
        </button>
      </div>
    ) : null;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      {/* Page header */}
      <div
        style={{
          padding: 'var(--sp-page-y) var(--sp-page-x)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-section)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="x-page__head">
          <div className="x-page__title-wrap">
            {description && <div className="x-page__sub">{description}</div>}
          </div>
          <div className="x-page__actions">
            <Button variant="secondary" icon="upload">
              Import
            </Button>
            <Button variant="secondary" icon="download">
              Export
            </Button>
            <Button variant="accent" icon="plus">
              {primaryAction}
            </Button>
          </div>
        </div>

        {/* Secondary tabs within the page */}
        {tabs && (
          <div className="x-tabs" style={{ padding: 0 }}>
            {tabs.map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={activeTab === t.value}
                className="x-tab"
                onClick={() => onTabChange && onTabChange(t.value)}
              >
                {t.label}
                {t.count != null && (
                  <span className="x-tab__count">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table area */}
      <div
        style={{
          padding: 'var(--sp-section) var(--sp-page-x) var(--sp-page-x)',
          flex: 1,
        }}
      >
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
                placeholder={searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Button variant="secondary" size="sm" icon="filter">
              Filter
            </Button>
            <div className="x-grid-toolbar__spacer" />
            <span className="x-grid-toolbar__count">
              {hasSelection
                ? `${selected.size} selected`
                : `${filtered.length} ${footerCount || 'records'}`}
            </span>
            {bulkActionMode === 'toolbar' && <BulkActionsToolbar />}
          </div>
          <table className="x-grid">
            <thead>
              <tr>
                <th className="x-cell--checkbox">
                  <Checkbox
                    checked={
                      selected.size > 0 && selected.size === filtered.length
                    }
                    indeterminate={
                      selected.size > 0 && selected.size < filtered.length
                    }
                    onChange={toggleAll}
                  />
                </th>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    style={{ width: c.width, textAlign: c.align }}
                  >
                    {c.label}
                  </th>
                ))}
                <th className="x-cell--actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={cls(selected.has(r.id) && 'is-selected')}
                >
                  <td className="x-cell--checkbox">
                    <Checkbox
                      checked={selected.has(r.id)}
                      onChange={() => toggle(r.id)}
                    />
                  </td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        textAlign: c.align,
                        fontFamily: c.mono ? 'var(--font-mono)' : undefined,
                        fontSize: c.mono ? 'var(--fs-sm)' : undefined,
                        color: c.muted ? 'var(--fg-2)' : undefined,
                      }}
                    >
                      {c.render ? c.render(r) : r[c.key]}
                    </td>
                  ))}
                  <td className="x-cell--actions">
                    <IconButton icon="more" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating bulk action bar */}
      {bulkActionMode === 'floating' && <BulkActionsFloating />}
    </div>
  );
};

// ---------- Concrete pages ------------------------------------------
const MatterTypesPage = () => {
  const [tab, setTab] = React.useState('active');
  const rows = [
    {
      id: 1,
      code: 'LIT-GEN',
      name: 'General litigation',
      group: 'Litigation',
      default_rate: 'Standard',
      matters: 128,
      status: 'active',
    },
    {
      id: 2,
      code: 'LIT-IP',
      name: 'IP / patent litigation',
      group: 'Litigation',
      default_rate: 'Premium',
      matters: 42,
      status: 'active',
    },
    {
      id: 3,
      code: 'CORP-MA',
      name: 'M&A transactions',
      group: 'Corporate',
      default_rate: 'Premium',
      matters: 31,
      status: 'active',
    },
    {
      id: 4,
      code: 'CORP-GOV',
      name: 'Corporate governance',
      group: 'Corporate',
      default_rate: 'Standard',
      matters: 64,
      status: 'active',
    },
    {
      id: 5,
      code: 'EMP-CLASS',
      name: 'Employment — class action',
      group: 'Labor',
      default_rate: 'Standard',
      matters: 14,
      status: 'active',
    },
    {
      id: 6,
      code: 'EMP-IND',
      name: 'Employment — individual',
      group: 'Labor',
      default_rate: 'Standard',
      matters: 86,
      status: 'active',
    },
    {
      id: 7,
      code: 'REG-FTC',
      name: 'Regulatory — FTC',
      group: 'Regulatory',
      default_rate: 'Premium',
      matters: 9,
      status: 'active',
    },
    {
      id: 8,
      code: 'TAX-CTRL',
      name: 'Tax controversy',
      group: 'Tax',
      default_rate: 'Standard',
      matters: 22,
      status: 'active',
    },
    {
      id: 9,
      code: 'DATA-BR',
      name: 'Data breach response',
      group: 'Privacy',
      default_rate: 'Urgent',
      matters: 4,
      status: 'archived',
    },
  ];
  const filtered = rows.filter((r) => tab === 'all' || r.status === tab);

  return (
    <DataTablePage
      title="Matter types"
      description="Categorize matters for reporting, rate selection and approval routing. Each matter type maps to a billing group and a default rate card."
      tabs={[
        {
          value: 'active',
          label: 'Active',
          count: rows.filter((r) => r.status === 'active').length,
        },
        {
          value: 'archived',
          label: 'Archived',
          count: rows.filter((r) => r.status === 'archived').length,
        },
        { value: 'all', label: 'All', count: rows.length },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      primaryAction="New matter type"
      searchPlaceholder="Search matter types, codes…"
      footerCount="matter types"
      columns={[
        { key: 'code', label: 'Code', width: 110, mono: true },
        { key: 'name', label: 'Name' },
        { key: 'group', label: 'Practice group', width: 140, muted: true },
        {
          key: 'default_rate',
          label: 'Default rate card',
          width: 170,
          render: (r) => <Badge variant="neutral">{r.default_rate}</Badge>,
        },
        {
          key: 'matters',
          label: 'Active matters',
          width: 140,
          align: 'right',
          render: (r) => <span className="x-num">{r.matters}</span>,
        },
        {
          key: 'status',
          label: 'Status',
          width: 110,
          render: (r) => (
            <Badge dot variant={r.status === 'active' ? 'success' : 'neutral'}>
              {r.status === 'active' ? 'Active' : 'Archived'}
            </Badge>
          ),
        },
      ]}
      rows={filtered}
    />
  );
};

const LEDESTaskPage = () => {
  const [tab, setTab] = React.useState('L100');
  const all = [
    {
      id: 'L110',
      phase: 'L100',
      code: 'L110',
      name: 'Fact Investigation / Development',
      standard: true,
    },
    {
      id: 'L120',
      phase: 'L100',
      code: 'L120',
      name: 'Analysis / Strategy',
      standard: true,
    },
    {
      id: 'L130',
      phase: 'L100',
      code: 'L130',
      name: 'Experts / Consultants',
      standard: true,
    },
    {
      id: 'L140',
      phase: 'L100',
      code: 'L140',
      name: 'Document / File Management',
      standard: true,
    },
    {
      id: 'L160',
      phase: 'L100',
      code: 'L160',
      name: 'Settlement / Non-Binding ADR',
      standard: true,
    },
    {
      id: 'L190',
      phase: 'L100',
      code: 'L190',
      name: 'Other Case Assessment',
      standard: true,
    },
    {
      id: 'L210',
      phase: 'L200',
      code: 'L210',
      name: 'Pleadings',
      standard: true,
    },
    {
      id: 'L220',
      phase: 'L200',
      code: 'L220',
      name: 'Preliminary Injunctions / Provisional Remedies',
      standard: true,
    },
    {
      id: 'L230',
      phase: 'L200',
      code: 'L230',
      name: 'Court Mandated Conferences',
      standard: true,
    },
    {
      id: 'L240',
      phase: 'L200',
      code: 'L240',
      name: 'Dispositive Motions',
      standard: true,
    },
    {
      id: 'L250',
      phase: 'L200',
      code: 'L250',
      name: 'Other Written Motions',
      standard: true,
    },
    {
      id: 'L310',
      phase: 'L300',
      code: 'L310',
      name: 'Written Discovery',
      standard: true,
    },
    {
      id: 'L320',
      phase: 'L300',
      code: 'L320',
      name: 'Document Production',
      standard: true,
    },
    {
      id: 'L330',
      phase: 'L300',
      code: 'L330',
      name: 'Depositions',
      standard: true,
    },
    {
      id: 'L340',
      phase: 'L300',
      code: 'L340',
      name: 'Expert Discovery',
      standard: true,
    },
    {
      id: 'XTN-REV',
      phase: 'Custom',
      code: 'XTN-REV',
      name: 'Internal peer review',
      standard: false,
    },
  ];
  const rows =
    tab === 'Custom'
      ? all.filter((r) => !r.standard)
      : all.filter((r) => r.phase === tab);

  return (
    <DataTablePage
      title="LEDES task codes"
      description="Standard ABA task codes used for LEDES 1998B exports, plus tenant-specific custom codes. Standard codes are read-only."
      tabs={[
        {
          value: 'L100',
          label: 'L100 · Case assessment',
          count: all.filter((r) => r.phase === 'L100').length,
        },
        {
          value: 'L200',
          label: 'L200 · Pre-trial pleadings',
          count: all.filter((r) => r.phase === 'L200').length,
        },
        {
          value: 'L300',
          label: 'L300 · Discovery',
          count: all.filter((r) => r.phase === 'L300').length,
        },
        {
          value: 'Custom',
          label: 'Custom',
          count: all.filter((r) => !r.standard).length,
        },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      primaryAction="New custom code"
      searchPlaceholder="Search codes or descriptions…"
      footerCount="task codes"
      columns={[
        {
          key: 'code',
          label: 'Code',
          width: 120,
          mono: true,
          render: (r) => (
            <span
              style={{
                color: r.standard ? 'var(--fg-accent)' : 'var(--fg-1)',
                fontWeight: 500,
              }}
            >
              {r.code}
            </span>
          ),
        },
        { key: 'name', label: 'Description' },
        { key: 'phase', label: 'Phase', width: 120, muted: true },
        {
          key: 'standard',
          label: 'Source',
          width: 140,
          render: (r) =>
            r.standard ? (
              <Badge variant="info">ABA standard</Badge>
            ) : (
              <Badge variant="accent">Tenant custom</Badge>
            ),
        },
      ]}
      rows={rows}
    />
  );
};

const RateCardsPage = () => {
  const rows = [
    {
      id: 1,
      name: 'Standard 2026',
      vendor: '—',
      effective: '2026-01-01',
      partner: 850,
      associate: 520,
      paralegal: 285,
      status: 'active',
    },
    {
      id: 2,
      name: 'Premium 2026',
      vendor: '—',
      effective: '2026-01-01',
      partner: 1250,
      associate: 780,
      paralegal: 320,
      status: 'active',
    },
    {
      id: 3,
      name: 'Urgent 2026',
      vendor: '—',
      effective: '2026-01-01',
      partner: 1450,
      associate: 920,
      paralegal: 350,
      status: 'active',
    },
    {
      id: 4,
      name: 'Skadden — M&A',
      vendor: 'Skadden, Arps',
      effective: '2026-02-15',
      partner: 1650,
      associate: 980,
      paralegal: 380,
      status: 'active',
    },
    {
      id: 5,
      name: 'MPC — IP Retainer',
      vendor: 'Morgan, Patel & Clark LLP',
      effective: '2025-10-01',
      partner: 1250,
      associate: 780,
      paralegal: 320,
      status: 'active',
    },
    {
      id: 6,
      name: 'Kroll — Forensics',
      vendor: 'Kroll Associates',
      effective: '2025-07-01',
      partner: 650,
      associate: 420,
      paralegal: 220,
      status: 'expiring',
    },
    {
      id: 7,
      name: 'Standard 2025',
      vendor: '—',
      effective: '2025-01-01',
      partner: 800,
      associate: 495,
      paralegal: 265,
      status: 'archived',
    },
  ];
  return (
    <DataTablePage
      title="Rate cards"
      description="Contracted hourly rates by timekeeper level. Every invoice is validated against the rate card effective on the service date."
      primaryAction="New rate card"
      searchPlaceholder="Search rate cards, vendors…"
      footerCount="rate cards"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'vendor', label: 'Vendor', width: 240, muted: true },
        {
          key: 'effective',
          label: 'Effective',
          width: 120,
          render: (r) => (
            <span style={{ color: 'var(--fg-2)' }}>{fmtDate(r.effective)}</span>
          ),
        },
        {
          key: 'partner',
          label: 'Partner',
          width: 100,
          align: 'right',
          render: (r) => (
            <span className="x-num">${r.partner.toLocaleString()}</span>
          ),
        },
        {
          key: 'associate',
          label: 'Associate',
          width: 100,
          align: 'right',
          render: (r) => (
            <span className="x-num">${r.associate.toLocaleString()}</span>
          ),
        },
        {
          key: 'paralegal',
          label: 'Paralegal',
          width: 100,
          align: 'right',
          render: (r) => (
            <span className="x-num">${r.paralegal.toLocaleString()}</span>
          ),
        },
        {
          key: 'status',
          label: 'Status',
          width: 110,
          render: (r) => (
            <Badge
              dot
              variant={
                r.status === 'active'
                  ? 'success'
                  : r.status === 'expiring'
                    ? 'warn'
                    : 'neutral'
              }
            >
              {r.status === 'active'
                ? 'Active'
                : r.status === 'expiring'
                  ? 'Expiring'
                  : 'Archived'}
            </Badge>
          ),
        },
      ]}
      rows={rows}
    />
  );
};

const TenantProfilePage = () => (
  <div
    style={{
      padding: 'var(--sp-page-y) var(--sp-page-x)',
      maxWidth: 820,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-section)',
    }}
  >
    <div className="x-page__sub">
      Company details, default locale and fiscal calendar.
    </div>
    <Card title="Company">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--sp-section)',
        }}
      >
        <Field label="Legal name" required>
          <Input defaultValue="Sterling & McGill LLP" />
        </Field>
        <Field label="Display name">
          <Input defaultValue="Sterling & McGill" />
        </Field>
        <Field label="Tax ID / EIN">
          <Input defaultValue="47-1928374" />
        </Field>
        <Field label="Subdomain" hint="sterling-mcgill.xtnd.app">
          <Input defaultValue="sterling-mcgill" />
        </Field>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Billing address">
            <Input defaultValue="1200 Market Street, Suite 2400, San Francisco, CA 94102" />
          </Field>
        </div>
      </div>
    </Card>
    <Card title="Regional preferences">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--sp-section)',
        }}
      >
        <Field label="Default currency">
          <Input defaultValue="USD — US Dollar" />
        </Field>
        <Field label="Fiscal year start">
          <Input defaultValue="January 1" />
        </Field>
        <Field label="Time zone">
          <Input defaultValue="America/Los_Angeles (UTC−08:00)" />
        </Field>
        <Field label="Week starts on">
          <Input defaultValue="Monday" />
        </Field>
      </div>
    </Card>
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <Button variant="ghost">Cancel</Button>
      <Button variant="accent" icon="check">
        Save changes
      </Button>
    </div>
  </div>
);

// ---------- Members page -----------------------------------------------
const MEMBERS_DATA = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@sterlingmcgill.com',
    role: 'Billing Reviewer',
    department: 'Finance',
    status: 'active',
    lastLogin: '2026-05-15T14:32:00',
  },
  {
    id: 2,
    name: 'David Kim',
    email: 'david.kim@sterlingmcgill.com',
    role: 'Admin',
    department: 'Legal Ops',
    status: 'active',
    lastLogin: '2026-05-16T09:10:00',
  },
  {
    id: 3,
    name: 'Marcus Orr',
    email: 'marcus.orr@sterlingmcgill.com',
    role: 'Billing Reviewer',
    department: 'Finance',
    status: 'active',
    lastLogin: '2026-05-14T17:45:00',
  },
  {
    id: 4,
    name: 'Lisa Park',
    email: 'lisa.park@sterlingmcgill.com',
    role: 'Matter Manager',
    department: 'Legal Ops',
    status: 'active',
    lastLogin: '2026-05-15T11:20:00',
  },
  {
    id: 5,
    name: 'James Wright',
    email: 'james.wright@sterlingmcgill.com',
    role: 'Billing Attorney',
    department: 'Accounting',
    status: 'active',
    lastLogin: '2026-05-13T16:05:00',
  },
  {
    id: 6,
    name: 'Nina Patel',
    email: 'nina.patel@sterlingmcgill.com',
    role: 'Billing Reviewer',
    department: 'Finance',
    status: 'active',
    lastLogin: '2026-05-15T10:30:00',
  },
  {
    id: 7,
    name: 'Robert Torres',
    email: 'robert.torres@sterlingmcgill.com',
    role: 'Partner',
    department: 'Litigation',
    status: 'active',
    lastLogin: '2026-05-12T08:15:00',
  },
  {
    id: 8,
    name: 'Emily Sato',
    email: 'emily.sato@sterlingmcgill.com',
    role: 'Read-only',
    department: 'Compliance',
    status: 'active',
    lastLogin: '2026-05-10T14:00:00',
  },
  {
    id: 9,
    name: 'Thomas Reed',
    email: 'thomas.reed@sterlingmcgill.com',
    role: 'Billing Attorney',
    department: 'Corporate',
    status: 'invited',
    lastLogin: null,
  },
  {
    id: 10,
    name: 'Angela Morris',
    email: 'angela.morris@sterlingmcgill.com',
    role: 'Admin',
    department: 'IT',
    status: 'deactivated',
    lastLogin: '2026-03-22T09:45:00',
  },
];

const MembersPage = ({ onOpen }) => {
  const [tab, setTab] = React.useState('active');
  const filtered = MEMBERS_DATA.filter((r) =>
    tab === 'all' ? true : r.status === tab,
  );

  return (
    <DataTablePage
      title="Members"
      description="Manage team members who have access to this workspace. Invite new members, assign roles, and deactivate accounts."
      tabs={[
        {
          value: 'active',
          label: 'Active',
          count: MEMBERS_DATA.filter((r) => r.status === 'active').length,
        },
        {
          value: 'invited',
          label: 'Invited',
          count: MEMBERS_DATA.filter((r) => r.status === 'invited').length,
        },
        {
          value: 'deactivated',
          label: 'Deactivated',
          count: MEMBERS_DATA.filter((r) => r.status === 'deactivated').length,
        },
        { value: 'all', label: 'All', count: MEMBERS_DATA.length },
      ]}
      activeTab={tab}
      onTabChange={setTab}
      primaryAction="Invite member"
      searchPlaceholder="Search members…"
      footerCount="members"
      columns={[
        {
          key: 'name',
          label: 'Name',
          render: (r) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-inline)',
              }}
            >
              <Avatar name={r.name} />
              <div style={{ minWidth: 0 }}>
                <a
                  className="x-link"
                  style={{ fontWeight: 500, cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(r);
                  }}
                >
                  {r.name}
                </a>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                  {r.email}
                </div>
              </div>
            </div>
          ),
        },
        {
          key: 'role',
          label: 'Role',
          width: 160,
          render: (r) => <Badge variant="neutral">{r.role}</Badge>,
        },
        { key: 'department', label: 'Department', width: 140, muted: true },
        {
          key: 'status',
          label: 'Status',
          width: 120,
          render: (r) => (
            <Badge
              dot
              variant={
                r.status === 'active'
                  ? 'success'
                  : r.status === 'invited'
                    ? 'info'
                    : 'neutral'
              }
            >
              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
            </Badge>
          ),
        },
        {
          key: 'lastLogin',
          label: 'Last active',
          width: 140,
          muted: true,
          render: (r) => (
            <span>{r.lastLogin ? fmtDate(r.lastLogin) : '—'}</span>
          ),
        },
      ]}
      rows={filtered}
    />
  );
};

// ---------- Roles page -------------------------------------------------
const ROLES_DATA = [
  {
    id: 1,
    name: 'Admin',
    type: 'System',
    description: 'Full access to all features, settings and member management.',
    members: 2,
    permissions: 24,
    updatedAt: '2026-04-22',
  },
  {
    id: 2,
    name: 'Billing Reviewer',
    type: 'Custom',
    description:
      'Review, annotate and approve invoices. No access to billing rates or trust.',
    members: 5,
    permissions: 12,
    updatedAt: '2026-04-18',
  },
  {
    id: 3,
    name: 'Billing Attorney',
    type: 'Custom',
    description: 'Create and submit pre-bills, view matters and rate cards.',
    members: 3,
    permissions: 14,
    updatedAt: '2026-03-10',
  },
  {
    id: 4,
    name: 'Matter Manager',
    type: 'Custom',
    description:
      'Full matter lifecycle management including budgets and timekeepers.',
    members: 2,
    permissions: 16,
    updatedAt: '2026-04-05',
  },
  {
    id: 5,
    name: 'Partner',
    type: 'Custom',
    description:
      'Senior review and override authority. Read access to all modules.',
    members: 4,
    permissions: 18,
    updatedAt: '2026-02-28',
  },
  {
    id: 6,
    name: 'Read-only',
    type: 'System',
    description: 'View-only access across all modules. Cannot modify any data.',
    members: 3,
    permissions: 6,
    updatedAt: '2025-12-15',
  },
  {
    id: 7,
    name: 'Vendor Portal',
    type: 'System',
    description:
      'External vendor access for bill submission and status tracking.',
    members: 12,
    permissions: 4,
    updatedAt: '2025-11-20',
  },
];

const RolesPage = ({ onOpen }) => (
  <DataTablePage
    title="Roles"
    description="Define roles that control what members can see and do. System roles cannot be modified. Custom roles can be tailored to your workflow."
    primaryAction="New role"
    searchPlaceholder="Search roles…"
    footerCount="roles"
    columns={[
      {
        key: 'name',
        label: 'Role name',
        render: (r) => (
          <div>
            <a
              className="x-link"
              style={{ fontWeight: 500, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(r);
              }}
            >
              {r.name}
            </a>
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--fg-3)',
                marginTop: 2,
                maxWidth: 320,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {r.description}
            </div>
          </div>
        ),
      },
      {
        key: 'type',
        label: 'Type',
        width: 120,
        render: (r) => (
          <Badge variant={r.type === 'System' ? 'info' : 'accent'}>
            {r.type}
          </Badge>
        ),
      },
      {
        key: 'members',
        label: 'Members',
        width: 100,
        align: 'right',
        render: (r) => <span className="x-num">{r.members}</span>,
      },
      {
        key: 'permissions',
        label: 'Permissions',
        width: 120,
        align: 'right',
        render: (r) => <span className="x-num">{r.permissions}</span>,
      },
      {
        key: 'updatedAt',
        label: 'Last updated',
        width: 140,
        muted: true,
        render: (r) => <span>{fmtDate(r.updatedAt)}</span>,
      },
    ]}
    rows={ROLES_DATA}
  />
);

// ---------- Generic placeholder for pages we haven't fleshed out ----
const SettingsPlaceholder = ({ title }) => (
  <div
    style={{
      padding: 'var(--sp-page-y) var(--sp-page-x)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-section)',
    }}
  >
    <div
      style={{
        padding: 60,
        textAlign: 'center',
        color: 'var(--fg-3)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
      }}
    >
      This area is a placeholder — wire it up with the same DataTablePage shell
      used elsewhere.
    </div>
  </div>
);

// ---------- Settings hub container ----------------------------------
const SettingsHub = ({ breadcrumbs }) => {
  const [page, setPage] = React.useState('overview');
  const [navCollapsed, setNavCollapsed] = React.useState(false);
  const [navWidth, setNavWidth] = React.useState(228);
  const onNavResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = navWidth;
    const onMove = (ev) =>
      setNavWidth(Math.max(180, Math.min(360, startW + (ev.clientX - startX))));
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
  const [detailView, setDetailView] = React.useState(null);

  const openMemberDetail = (row) =>
    setDetailView({ type: 'member', data: row });
  const openRoleDetail = (row) => setDetailView({ type: 'role', data: row });
  const closeDetail = () => setDetailView(null);

  React.useEffect(() => {
    setDetailView(null);
  }, [page]);

  const title =
    SETTINGS_NAV.flatMap((s) => s.items).find((i) => i.id === page)?.label ||
    'Settings';
  const crumbs = React.useMemo(() => {
    if (!breadcrumbs) return null;
    if (page === 'overview') return breadcrumbs;
    const base = [
      ...breadcrumbs.slice(0, -1),
      {
        label: 'Settings',
        onClick: () => {
          setPage('overview');
          setDetailView(null);
        },
      },
      {
        label: title,
        onClick: detailView ? () => setDetailView(null) : undefined,
      },
    ];
    if (detailView) {
      base.push({ label: detailView.data?.name || 'Detail' });
    }
    return base;
  }, [breadcrumbs, page, title, detailView]);
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {navCollapsed ? (
        <aside
          className="x-pagenav x-pagenav--collapsed"
          style={{
            width: 48,
            alignItems: 'center',
            padding: 'var(--sp-group) 0',
          }}
        >
          <button
            className="x-pagenav__icon-btn"
            onClick={() => setNavCollapsed(false)}
            title="Expand settings menu"
          >
            <Icon name="chevronRight" size={14} />
          </button>
          <div
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              width: '100%',
              margin: 'var(--sp-inline) 0',
            }}
          />
          {SETTINGS_NAV.flatMap((s) => s.items)
            .filter((_, i) => i < 8)
            .map((item) => (
              <button
                key={item.id}
                className={cls(
                  'x-pagenav__icon-btn',
                  page === item.id && 'is-active',
                )}
                title={item.label}
                onClick={() => {
                  setNavCollapsed(false);
                  setPage(item.id);
                }}
              >
                <Icon name={item.icon} size={16} />
              </button>
            ))}
        </aside>
      ) : (
        <SettingsNav
          current={page}
          onNavigate={setPage}
          onCollapse={() => setNavCollapsed(true)}
          width={navWidth}
          onResize={onNavResize}
        />
      )}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          minWidth: 0,
          background: 'var(--bg-page)',
        }}
      >
        {crumbs && (
          <div style={{ padding: 'var(--sp-section) var(--sp-page-x) 0' }}>
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        {page === 'overview' && <SettingsOverviewPage onNavigate={setPage} />}
        {page === 'tenant' && <TenantProfilePage />}
        {page === 'matter-types' && <MatterTypesPage />}
        {page === 'rate-cards' && <RateCardsPage />}
        {page === 'ledes-task' && <LEDESTaskPage />}
        {page === 'members' && !detailView && (
          <MembersPage onOpen={openMemberDetail} />
        )}
        {page === 'members' && detailView?.type === 'member' && (
          <UserTabsDetail onBack={closeDetail} />
        )}
        {page === 'roles' && (
          <>
            <RolesPage onOpen={openRoleDetail} />
            <DetailDrawer
              open={!!detailView && detailView.type === 'role'}
              onClose={closeDetail}
              title={detailView?.data?.name}
              subtitle={detailView?.data?.description}
            >
              <RoleTabsDetail onBack={closeDetail} />
            </DetailDrawer>
          </>
        )}
        {![
          'overview',
          'tenant',
          'matter-types',
          'rate-cards',
          'ledes-task',
          'members',
          'roles',
        ].includes(page) && <SettingsPlaceholder title={title} />}
      </div>
    </div>
  );
};

Object.assign(window, { SettingsHub, DataTablePage });
