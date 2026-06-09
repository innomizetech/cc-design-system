/* global React, Icon, Button, IconButton, Badge, Avatar, Tabs, Card, Checkbox, Field, Input, Textarea, SidePanel, fmtMoney, fmtDate, fmtDateTime, cls, Breadcrumbs */
/* global BillStatus, PageNav, CommentsContent, AttachmentsContent, AuditTimeline */

// =====================================================================
// VendorBillDetailP1 — Container-agnostic Vendor Bill Detail
// Content components know nothing about their container (full page,
// drawer, or side panel). The container decides layout constraints;
// the content adapts via CSS auto-fit and overflow.
// =====================================================================

const VENDOR_BILL_LINES = [
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

const VENDOR_BILL_DOCS = [
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

// ---------- Bill Details Form ----------------------------------------
const VBP1DetailsForm = ({ bill }) => {
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
        <Button variant="secondary">Cancel</Button>
        <Button variant="accent" icon="check">
          Save
        </Button>
      </footer>
    </section>
  );
};

// ---------- Lines Section (inline table) -----------------------------
const VBP1LinesSection = () => {
  const [selected, setSelected] = React.useState(new Set());
  const allSelected =
    VENDOR_BILL_LINES.length > 0 &&
    selected.size === VENDOR_BILL_LINES.length;
  const subtotal = VENDOR_BILL_LINES.reduce((s, l) => s + (l.total - l.tax), 0);
  const tax = VENDOR_BILL_LINES.reduce((s, l) => s + l.tax, 0);
  const total = subtotal + tax;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(VENDOR_BILL_LINES.map((l) => l.id)));
  };

  return (
    <div className="x-grid-wrap" style={{ overflowX: 'auto' }}>
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
        <span className="x-grid-toolbar__count">
          · {VENDOR_BILL_LINES.length}
        </span>
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
              <Checkbox checked={allSelected} onChange={toggleAll} />
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
          {VENDOR_BILL_LINES.map((l) => (
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

// =====================================================================
// Container-agnostic content components
// These render into whatever space they're given.
// =====================================================================

// ---------- Header (title + status + actions) ------------------------
const VendorBillDetailHeader = ({
  bill,
  onBack,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  breadcrumbs,
  onExpand,
}) => (
  <div
    style={{
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
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
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-sm)',
              color: 'var(--fg-3)',
            }}
          >
            {bill.id}
          </span>
        </div>
      </div>
      <div
        className="x-page__actions"
        style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
      >
        {(onPrev || onNext) && (
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
        )}
        {onExpand && (
          <Button variant="ghost" icon="external" onClick={onExpand} title="Open full page">
            Expand
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
  </div>
);

// ---------- Content (tabs + tab body) --------------------------------
const VendorBillDetailContent = ({ bill, onExpand }) => {
  const [tab, setTab] = React.useState('overview');

  const MAIN_TABS = [
    { value: 'overview', label: 'Overview', icon: 'invoice' },
    {
      value: 'attachments',
      label: 'Attachments',
      icon: 'paperclip',
      count: VENDOR_BILL_DOCS.length,
    },
    { value: 'comments', label: 'Comments', icon: 'comment', count: 3 },
    { value: 'history', label: 'History', icon: 'history' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div
        style={{
          padding: '0 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Tabs value={tab} onChange={setTab} items={MAIN_TABS} />
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <VBP1DetailsForm bill={bill} />
            <VBP1LinesSection />
          </div>
        )}
        {tab === 'attachments' && <AttachmentsContent />}
        {tab === 'comments' && <CommentsContent />}
        {tab === 'history' && <AuditTimeline />}
      </div>
    </div>
  );
};

// =====================================================================
// Thin wrappers — one per container mode.
// Each provides the chrome (breadcrumbs, close button, sizing) then
// drops in the same VendorBillDetailHeader + VendorBillDetailContent.
// =====================================================================

// ---------- Full page wrapper ----------------------------------------
const VendorBillDetailPage = ({
  bill,
  breadcrumbs,
  onBack,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <VendorBillDetailHeader
      bill={bill}
      onBack={onBack}
      onPrev={onPrev}
      onNext={onNext}
      hasPrev={hasPrev}
      hasNext={hasNext}
      breadcrumbs={breadcrumbs}
    />
    <VendorBillDetailContent bill={bill} />
  </div>
);

// ---------- Side panel wrapper ---------------------------------------
const VendorBillDetailPanel = ({
  bill,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onExpand,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--bg-page)',
    }}
  >
    <VendorBillDetailHeader
      bill={bill}
      onBack={onClose}
      onPrev={onPrev}
      onNext={onNext}
      hasPrev={hasPrev}
      hasNext={hasNext}
      onExpand={onExpand}
    />
    <VendorBillDetailContent bill={bill} />
  </div>
);

Object.assign(window, {
  VendorBillDetailPage,
  VendorBillDetailPanel,
  VendorBillDetailContent,
  VendorBillDetailHeader,
});
