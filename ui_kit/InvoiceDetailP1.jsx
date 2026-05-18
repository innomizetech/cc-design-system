/* global React, Icon, Button, IconButton, Badge, InvoiceStatus, Avatar, Tabs, Card, CollapsibleCard, Checkbox, Field, Input, Textarea, SidePanel, fmtMoney, fmtDate, fmtDateTime, cls, Breadcrumbs */
/* global INVOICE, SAMPLE_LINES, SAMPLE_COMMENTS, SAMPLE_FILES, SAMPLE_EXPENSES */
/* global AUDIT_EVENTS, FIELD_LABELS, CATEGORY_STYLE, WORKFLOW_STATES */
/* global MASTER_ATTORNEYS, COLLABORATORS, ASSISTANTS, DELEGATORS, CLIENT_CONTACTS, CLIENT_ADDRESSES */
/* global fieldLabel, actionVerb, groupByDate, minutesSince */
/* global FlagTag, MetaRow, FileIcon, PersonRow, SectionLabel, AddressCard */
/* global BillStatus, PageNav, CommentItem, ChangeEntry */
/* global ActivityLog, AuditTimeline, CommentsContent, SummaryContent, ExpensesGrid, AttachmentsContent */
/* global LineRowMenu, LineItemsGrid, PeopleContent, ManagePeopleDialog */
/* global ScopedDrawer, EditLockBannerP, WorkflowSheet, MoreActionsDropdown, InvoiceHeader */

// =====================================================================
// InvoiceDetailP1 — Paradigm 1A: Tab + Collapsible Side Column
// Uses shared components from SharedDetailComponents.jsx
// =====================================================================

const InvoiceDetailP1 = ({
  invoice,
  breadcrumbs,
  onBack,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => {
  const inv = invoice || INVOICE;

  const [tab, setTab] = React.useState('fees');
  const [sideTab, setSideTab] = React.useState('summary');
  const [collapsed, setCollapsed] = React.useState(false);
  const [sideWidth, setSideWidth] = React.useState(380);
  const [workflowOpen, setWorkflowOpen] = React.useState(false);
  // Edit lock state: 'none' | 'self' | 'other'
  const [editState, setEditState] = React.useState('other');
  const lock = editState === 'other' ? inv.editLock : null;

  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = sideWidth;
    const onMove = (ev) => {
      const delta = startX - ev.clientX;
      setSideWidth(
        Math.max(
          280,
          Math.min(Math.round(window.innerWidth * 0.5), startW + delta),
        ),
      );
    };
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
    { value: 'comments', label: 'Comments', icon: 'comment', count: 3 },
    { value: 'audit', label: 'History', icon: 'history' },
  ];

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
      {/* Two-column layout: left (tabs + content) | right (panel) */}
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 500 }}>
        {/* LEFT COLUMN */}
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
              ]}
            />
            <div style={{ flex: 1 }} />
          </div>
          <div
            style={{ flex: 1, padding: 'var(--sp-page-y) var(--sp-page-x)' }}
          >
            {tab === 'fees' && <LineItemsGrid />}
            {tab === 'expenses' && <ExpensesGrid />}
            {tab === 'attachments' && <AttachmentsContent />}
            {tab === 'people' && <PeopleContent />}
          </div>
        </div>
        {/* RIGHT PANEL — collapsible */}
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
            <div
              className="ps-side-col__resizer"
              onMouseDown={onMouseDown}
              title="Drag to resize"
            />
            <div
              style={{
                padding: '0 12px',
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
              {sideTab === 'summary' && <SummaryContent />}
              {sideTab === 'comments' && <CommentsContent />}
              {sideTab === 'audit' && <AuditTimeline compact />}
            </div>
          </div>
        )}
      </div>
      {workflowOpen && (
        <WorkflowSheet
          invoice={inv}
          lock={lock}
          onClose={() => setWorkflowOpen(false)}
        />
      )}
    </div>
  );
};

Object.assign(window, { InvoiceDetailP1 });
