/* global React, Icon, Button, IconButton, Badge, Tabs, Avatar, fmtMoney, fmtDate, fmtDateTime, cls */
/* global BillStatus, PageNav, CommentsContent, AuditTimeline, TxnStatus, TxnBadge, TXN_STATUS_MAP, SAMPLE_TRANSACTIONS */
/* global LineItemsGrid, ExpensesGrid */

// =====================================================================
// TransactionDetail — Container-agnostic transaction detail view
// Data comes from SAMPLE_TRANSACTIONS (single source, shared with grid)
// =====================================================================

// ---------- Helpers --------------------------------------------------

const STATUS_INTENT = {
  pending: 'warn', preparing: 'warn', awaiting_trust_approval: 'warn',
  generating: 'neutral', file_generated: 'neutral',
  email_held: 'warn',
  email_sent: 'info', tpa_uploaded: 'info', tpa_processing: 'neutral',
  completed: 'success', skipped: 'neutral', failed: 'danger', cancelled: 'neutral',
};

const PRIMARY_ACTION = (status, lastError, deliveryMethod) => {
  if (status === 'email_held') return { label: 'Send Email', icon: 'external', variant: 'accent' };
  if (status === 'failed' && lastError) {
    if (lastError.step === 'send_email' || lastError.step === 'upload_tpa')
      return { label: 'Retry Delivery', icon: 'external', variant: 'accent' };
    return { label: 'Reprocess', icon: 'workflow', variant: 'accent' };
  }
  if (status === 'completed' && deliveryMethod === 'email')
    return { label: 'Resend Email', icon: 'external', variant: 'secondary' };
  if (status === 'email_sent' || status === 'tpa_uploaded')
    return { label: 'Mark Completed', icon: 'check', variant: 'accent' };
  return null;
};

const BILL_STATE_MAP = {
  draft: { label: 'Draft', variant: 'neutral' },
  pending_approval: { label: 'Pending Approval', variant: 'warn' },
  awaiting_payment: { label: 'Awaiting Payment', variant: 'warn' },
  paid: { label: 'Paid', variant: 'success' },
  voided: { label: 'Voided', variant: 'danger' },
  deleted: { label: 'Deleted', variant: 'neutral' },
};

// ---------- Overflow Menu --------------------------------------------

const OverflowMenu = ({ tx }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const canRegenerate = ['file_generated', 'email_held', 'failed'].includes(tx.status);
  const isTerminal = ['completed', 'cancelled', 'skipped'].includes(tx.status);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <IconButton icon="more" title="More actions" onClick={() => setOpen((v) => !v)} />
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 40,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          padding: 4, minWidth: 200,
        }}>
          <button type="button" className="x-menu-item" onClick={() => setOpen(false)}>
            <Icon name="download" size={14} /> Download invoice
          </button>
          {canRegenerate && (
            <button type="button" className="x-menu-item" onClick={() => setOpen(false)}>
              <Icon name="workflow" size={14} /> Regenerate PDF
            </button>
          )}
          {!isTerminal && (
            <>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
              <button type="button" className="x-menu-item x-menu-item--danger" onClick={() => setOpen(false)}>
                <Icon name="x" size={14} /> Cancel transaction
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ---------- Notice Banner --------------------------------------------

const NoticeBanner = ({ tx }) => {
  if (tx.status === 'failed' && tx.lastError) {
    return (
      <div style={{
        padding: '12px 16px', borderRadius: 'var(--radius-md)',
        background: 'var(--error-50, #fef2f2)', border: '1px solid var(--error-200, #fecaca)',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <Icon name="warning" size={16} style={{ color: 'var(--error-500)', flex: 'none', marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: 'var(--error-700, var(--fg-1))' }}>
            Error: {tx.lastError.code}
          </div>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--error-600, var(--fg-2))', marginTop: 2 }}>
            {tx.lastError.message} — Attempt #{tx.lastError.attemptNumber}
          </div>
        </div>
      </div>
    );
  }
  if (tx.status === 'cancelled') {
    return (
      <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--n-50)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontWeight: 500, color: 'var(--fg-1)' }}>Cancelled</div>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)', marginTop: 2 }}>Manually cancelled by admin</div>
      </div>
    );
  }
  if (tx.status === 'skipped') {
    return (
      <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--n-50)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontWeight: 500, color: 'var(--fg-1)' }}>Skipped</div>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)', marginTop: 2 }}>Transaction skipped by system rule</div>
      </div>
    );
  }
  return null;
};

// ---------- Overview Tab ---------------------------------------------

const KVRow = ({ label, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '9rem 1fr', gap: 8, padding: '6px 0' }}>
    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-3)' }}>{label}</span>
    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-1)' }}>{children}</span>
  </div>
);

const SectionTitle = ({ children, badge }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0 4px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
    <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--fg-1)' }}>{children}</span>
    {badge}
  </div>
);

const BillCard = ({ title, bill }) => {
  if (!bill) return null;
  const bs = BILL_STATE_MAP[bill.state] || { label: bill.state, variant: 'neutral' };
  return (
    <div style={{
      padding: '14px 16px', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', flex: 1, minWidth: 200,
    }}>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
        {bill.extId ? (
          <a href={'https://app.clio.com/nc/#/bills/' + bill.extId} target="_blank" rel="noopener noreferrer" title="Open in Clio"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--fg-accent)', fontWeight: 500, textDecoration: 'none' }}>
            {bill.billNumber} <Icon name="external" size={10} style={{ marginLeft: 2 }} />
          </a>
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--fg-accent)', fontWeight: 500 }}>
            {bill.billNumber}
          </span>
        )}
        <Badge variant={bs.variant} dot>{bs.label}</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-xl)', fontWeight: 500 }}>
          {fmtMoney(bill.total)}
        </span>
        {bill.dueDate && (
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-3)' }}>Due {fmtDate(bill.dueDate)}</span>
        )}
      </div>
    </div>
  );
};

const TrustCalcSection = ({ calc }) => {
  const [trustOpen, setTrustOpen] = React.useState(false);
  if (!calc) return (
    <div style={{ padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--n-25)', color: 'var(--fg-3)', fontSize: 'var(--fs-sm)' }}>
      Trust calculation pending
    </div>
  );
  return (
    <div style={{ padding: '14px 16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', marginBottom: 10 }}>
        Trust calculation
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
        <KVRow label="Min threshold">{fmtMoney(calc.minimumThreshold)}</KVRow>
        <KVRow label="Calculated">{fmtMoney(calc.calculatedTrustAmount)}</KVRow>
        <KVRow label="Trust balance">{fmtMoney(calc.trustBalance.total)}</KVRow>
        <KVRow label="Outstanding">{fmtMoney(calc.outstandingBalance)}</KVRow>
        <KVRow label="Admin override">{calc.adminOverrideAmount ? fmtMoney(calc.adminOverrideAmount) : '—'}</KVRow>
      </div>
      <button type="button" onClick={() => setTrustOpen((v) => !v)}
        style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 'var(--fs-sm)', color: 'var(--fg-accent)' }}>
        <Icon name="chevronRight" size={11} style={{ transform: trustOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.12s ease' }} />
        Trust accounts ({calc.trustBalance.accounts.length})
      </button>
      {trustOpen && (
        <div style={{ marginTop: 6, paddingLeft: 16 }}>
          {calc.trustBalance.accounts.map((a) => (
            <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 'var(--fs-sm)' }}>
              <span style={{ color: 'var(--fg-2)' }}>{a.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(a.balance)}</span>
            </div>
          ))}
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-4)', marginTop: 4 }}>
            Fetched at: {fmtDateTime(calc.trustBalance.fetchedAt)}
          </div>
        </div>
      )}
    </div>
  );
};

const OverviewTab = ({ tx }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <SectionTitle>Client & matter</SectionTitle>
    <KVRow label="Client">{tx.client}</KVRow>
    <KVRow label="Client ID"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>{tx.clientId}</span></KVRow>
    <KVRow label="Matter">{tx.matterDisplayNumber} — {tx.matter}</KVRow>
    <KVRow label="Matter status">{tx.matterStatus}</KVRow>

    <SectionTitle>Invoice</SectionTitle>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
      <BillCard title="Operational bill" bill={tx.operationalBill} />
      {tx.invoiceType === 'evergreen' && <BillCard title="Trust request" bill={tx.trustBill} />}
    </div>
    {tx.invoiceType === 'evergreen' && tx.trustCalculation && (
      <div style={{ marginTop: 8 }}>
        <TrustCalcSection calc={tx.trustCalculation} />
      </div>
    )}

    <SectionTitle>Delivery: {tx.deliveryMethod === 'tpa' ? 'TPA' : 'Email'}</SectionTitle>
    {tx.deliveryMethod === 'email' ? (
      <>
        <KVRow label="Recipients">
          {tx.billRecipientEmails && tx.billRecipientEmails.length > 0
            ? tx.billRecipientEmails.join(', ')
            : <span style={{ color: 'var(--fg-4)' }}>No recipients configured</span>}
        </KVRow>
        {tx.paymentLinkUrl && (
          <KVRow label="Payment link">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                {tx.paymentLinkUrl}
              </span>
              <IconButton icon="copy" title="Copy link" />
            </div>
          </KVRow>
        )}
      </>
    ) : (
      <>
        {tx.tpaSiteId && (
          <KVRow label="TPA site">
            <a href="https://app.clio.com/nc/#/settings/tpa-sites" target="_blank" rel="noopener noreferrer" title="Open TPA settings"
              style={{ color: 'var(--fg-accent)', textDecoration: 'none' }}>
              {tx.tpaSiteId} <Icon name="external" size={10} />
            </a>
          </KVRow>
        )}
        {tx.claimNumber && <KVRow label="Claim #">{tx.claimNumber}</KVRow>}
        {tx.carrierMatterId && <KVRow label="Client matter ID">{tx.carrierMatterId}</KVRow>}
        {tx.carrierClientName && <KVRow label="Client matter">{tx.carrierClientName}</KVRow>}
        {tx.ledesClientId && <KVRow label="LEDES client ID"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>{tx.ledesClientId}</span></KVRow>}
      </>
    )}

    <SectionTitle>Activity</SectionTitle>
    <KVRow label="Created at">{tx.createdAt ? fmtDateTime(tx.createdAt) : '—'}</KVRow>
    <KVRow label="Updated at">{tx.updatedAt ? fmtDateTime(tx.updatedAt) : '—'}</KVRow>
    <KVRow label="Updated by">{tx.updatedBy || 'System'}</KVRow>
  </div>
);

// ---------- Documents Tab --------------------------------------------

const DocRow = ({ doc }) => {
  const palette = { 'Invoice PDF': '#B45C48', 'Ledger PDF': '#3C6079', 'LEDES 1998B': '#54504A' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{
        width: 32, height: 38, background: palette[doc.name] || '#6f6b5f',
        borderRadius: 3, display: 'grid', placeItems: 'center',
        color: 'white', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600, flex: 'none',
      }}>
        {doc.name.includes('LEDES') ? 'TXT' : 'PDF'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 'var(--fs-sm)' }}>{doc.name}</div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>{doc.size} · {fmtDateTime(doc.generatedAt)}</div>
      </div>
      <IconButton icon="download" title="Download" />
    </div>
  );
};

const DocumentsTab = ({ tx }) => {
  const docs = tx.latestDocuments;
  if (!docs) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)' }}>No documents generated yet</div>;
  const items = [docs.invoice, docs.ledger, docs.ledes].filter(Boolean);
  return <div>{items.map((d) => <DocRow key={d.name} doc={d} />)}</div>;
};

// ---------- Screenshot Lightbox ---------------------------------------

const PLACEHOLDER_SCREENSHOTS = [
  { name: 'login-page.png', label: 'Portal login page' },
  { name: 'upload-form.png', label: 'Upload form with LEDES file' },
  { name: 'confirmation.png', label: 'Upload confirmation' },
];

const ScreenshotLightbox = ({ screenshotPrefix, onClose }) => {
  const [idx, setIdx] = React.useState(0);
  const items = PLACEHOLDER_SCREENSHOTS;
  const total = items.length;

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && idx > 0) { e.stopPropagation(); setIdx((i) => i - 1); }
      if (e.key === 'ArrowRight' && idx < total - 1) { e.stopPropagation(); setIdx((i) => i + 1); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [idx, total]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
      }} onClick={(e) => e.stopPropagation()}>
        <span style={{ color: 'white', fontSize: 'var(--fs-sm)', opacity: 0.7 }}>
          {items[idx].label}
        </span>
        <span style={{ color: 'white', fontSize: 'var(--fs-xs)', fontFamily: 'var(--font-mono)', opacity: 0.4 }}>
          {screenshotPrefix}{items[idx].name}
        </span>
        <span style={{ color: 'white', fontSize: 'var(--fs-xs)', opacity: 0.5 }}>
          {idx + 1} / {total}
        </span>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={onClose}
          style={{ all: 'unset', cursor: 'pointer', color: 'white', opacity: 0.7, padding: 4 }}>
          <Icon name="x" size={20} />
        </button>
      </div>

      {/* Image placeholder */}
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '80%', maxWidth: 900, aspectRatio: '16/9',
        background: 'var(--n-800, #1e1e1e)', borderRadius: 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <Icon name="eye" size={32} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 8 }} />
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--fs-sm)' }}>
          {items[idx].label}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 'var(--fs-xs)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          Will load from S3 presigned URL
        </span>
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'absolute', bottom: 20,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button type="button" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}
            style={{
              all: 'unset', cursor: idx === 0 ? 'default' : 'pointer',
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center',
              color: idx === 0 ? 'rgba(255,255,255,0.2)' : 'white',
            }}>
            <Icon name="chevronLeft" size={16} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {items.map((_, i) => (
              <button key={i} type="button" onClick={() => setIdx(i)}
                style={{
                  all: 'unset', cursor: 'pointer',
                  width: 8, height: 8, borderRadius: '50%',
                  background: i === idx ? 'white' : 'rgba(255,255,255,0.3)',
                  transition: 'background 0.12s ease',
                }} />
            ))}
          </div>
          <button type="button" onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} disabled={idx === total - 1}
            style={{
              all: 'unset', cursor: idx === total - 1 ? 'default' : 'pointer',
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center',
              color: idx === total - 1 ? 'rgba(255,255,255,0.2)' : 'white',
            }}>
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// ---------- Exec Logs Tab ---------------------------------------------

const STEP_LABELS = {
  create_transaction: 'Create transaction',
  prepare: 'Prepare',
  handle_trust_approval: 'Trust approval',
  generate_document: 'Generate documents',
  send_email: 'Send email',
  upload_tpa: 'Upload to TPA',
  complete: 'Complete',
};

const TRIGGER_LABELS = {
  initial: 'Initial',
  user_reprocess: 'Reprocess',
  stale_recovery: 'Stale recovery',
  bill_version_updated: 'Bill updated',
};

const EXEC_STATUS_VARIANT = {
  succeeded: 'success',
  failed: 'danger',
  running: 'warn',
  superseded: 'neutral',
};

const EXEC_BORDER = {
  succeeded: 'var(--success-400, #4ade80)',
  failed: 'var(--error-400, #f87171)',
  running: 'var(--warning-400, #facc15)',
  superseded: 'var(--border)',
};

const ExecMetaItem = ({ icon, children }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
    <Icon name={icon} size={11} style={{ color: 'var(--fg-4)', flex: 'none' }} />
    {children}
  </span>
);

const ScreenshotLink = ({ screenshotPrefix }) => {
  const [open, setOpen] = React.useState(false);
  if (!screenshotPrefix) return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        style={{ all: 'unset', cursor: 'pointer', fontSize: 'var(--fs-xs)', color: 'var(--fg-accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Icon name="eye" size={11} />View screenshots
      </button>
      {open && <ScreenshotLightbox screenshotPrefix={screenshotPrefix} onClose={() => setOpen(false)} />}
    </>
  );
};

const ExecLogEntry = ({ log }) => {
  const borderColor = EXEC_BORDER[log.status] || 'var(--border)';
  const duration = log.completedAt
    ? ((new Date(log.completedAt) - new Date(log.startedAt)) / 1000).toFixed(1) + 's'
    : 'running…';
  const triggerLabel = log.triggeredBy === 'user' ? 'Manual' : 'System';
  const reasonLabel = TRIGGER_LABELS[log.triggerReason] || log.triggerReason || '';

  return (
    <div style={{
      border: '1px solid var(--border-subtle)',
      borderLeft: '3px solid ' + borderColor,
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-surface)',
      padding: 'var(--sp-group) var(--card-pad)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-inline)',
    }}>
      {/* Header: attempt + step + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-inline)', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', fontWeight: 600 }}>
          #{log.attemptNumber}
        </span>
        <span style={{ fontWeight: 500, fontSize: 'var(--fs-sm)', color: 'var(--fg-1)' }}>
          {STEP_LABELS[log.step] || log.step}
        </span>
        <Badge variant={EXEC_STATUS_VARIANT[log.status] || 'neutral'} dot>{log.status}</Badge>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
          {fmtDateTime(log.startedAt)}
        </span>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-section)', flexWrap: 'wrap' }}>
        <ExecMetaItem icon="user">{triggerLabel}{reasonLabel ? ' · ' + reasonLabel : ''}</ExecMetaItem>
        <ExecMetaItem icon="clock">{duration}</ExecMetaItem>
        {log.reprocessNote && <ExecMetaItem icon="comment">{log.reprocessNote}</ExecMetaItem>}
      </div>

      {/* IDs row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-section)', flexWrap: 'wrap', fontSize: 'var(--fs-xs)', color: 'var(--fg-4)' }}>
        {log.id && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--fg-4)' }}>ID:</span>
            <span style={{ fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{log.id}</span>
            <IconButton icon="copy" title="Copy execution log ID" />
          </div>
        )}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--fg-4)' }}>Corr:</span>
          <span style={{ fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{log.correlationId}</span>
          <IconButton icon="copy" title="Copy correlation ID" />
        </div>
      </div>

      {/* Errors */}
      {log.errors && log.errors.length > 0 && (
        <div style={{
          padding: 'var(--sp-inline) var(--sp-group)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--error-50, rgba(239,68,68,0.06))',
          border: '1px solid var(--error-200, rgba(239,68,68,0.15))',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {log.errors.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-inline)', fontSize: 'var(--fs-sm)' }}>
              <Icon name="warning" size={12} style={{ color: 'var(--error-500)', flex: 'none', marginTop: 3 }} />
              <div style={{ flex: 1 }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--fg-1)', fontSize: 'var(--fs-xs)' }}>{e.code}</span>
                  {e.retryable && (
                    <span style={{
                      marginLeft: 6, fontSize: 10, fontWeight: 600,
                      color: 'var(--warning-600, var(--fg-3))',
                      padding: '1px 5px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--warning-200, var(--border-subtle))',
                    }}>retryable</span>
                  )}
                </div>
                <div style={{ color: 'var(--fg-2)', marginTop: 2 }}>{e.message}</div>
                {e.occurredAt && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-4)', marginTop: 2 }}>{fmtDateTime(e.occurredAt)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents snapshot */}
      {log.documents && (
        <div style={{ display: 'flex', gap: 'var(--sp-inline)', flexWrap: 'wrap', fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
          <ExecMetaItem icon="paperclip">
            {[log.documents.invoice && 'Invoice', log.documents.ledger && 'Ledger', log.documents.ledes && 'LEDES'].filter(Boolean).join(', ') || 'No documents'}
          </ExecMetaItem>
        </div>
      )}

      {/* TPA submission */}
      {log.tpaSubmission && (
        <div style={{
          padding: 'var(--sp-inline) var(--sp-group)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          background: 'var(--n-25)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-inline)', fontSize: 'var(--fs-sm)' }}>
            <Icon name="upload" size={12} style={{ color: 'var(--fg-3)', flex: 'none' }} />
            <span style={{ fontWeight: 500, color: 'var(--fg-1)' }}>{log.tpaSubmission.tpaSiteUrl}</span>
            {log.tpaSubmission.payerName && (
              <span style={{ color: 'var(--fg-3)', fontSize: 'var(--fs-xs)' }}>· {log.tpaSubmission.payerName}</span>
            )}
            <Badge
              variant={log.tpaSubmission.status === 'uploaded' ? 'success' : log.tpaSubmission.status === 'failed' ? 'danger' : log.tpaSubmission.status === 'processing' ? 'warn' : 'neutral'}
              dot
            >
              {log.tpaSubmission.status}
            </Badge>
          </div>
          <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {log.tpaSubmission.confirmationRef && (
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-2)' }}>
                Ref: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--fg-1)' }}>{log.tpaSubmission.confirmationRef}</span>
              </div>
            )}
            {log.tpaSubmission.uploadedAt && (
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--fg-3)' }}>
                Uploaded: {fmtDateTime(log.tpaSubmission.uploadedAt)}
              </div>
            )}
            <ScreenshotLink screenshotPrefix={log.tpaSubmission.screenshotPrefix} />
            {log.tpaSubmission.errors && log.tpaSubmission.errors.length > 0 && log.tpaSubmission.errors.map((e, i) => (
              <div key={i} style={{ fontSize: 'var(--fs-xs)', color: 'var(--error-500)' }}>
                {e.message}{e.description ? ' — ' + e.description : ''}
                {e.occurredAt && <span style={{ color: 'var(--fg-4)', marginLeft: 6 }}>{fmtDateTime(e.occurredAt)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExecLogsTab = ({ logs }) => {
  if (!logs || logs.length === 0) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)' }}>
      <Icon name="clock" size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
      <div style={{ fontSize: 'var(--fs-sm)' }}>No execution logs yet</div>
      <div style={{ fontSize: 'var(--fs-xs)', marginTop: 4, color: 'var(--fg-4)' }}>Transaction is still in queue</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-group)' }}>
      {logs.map((l) => <ExecLogEntry key={l.attemptNumber} log={l} />)}
    </div>
  );
};

// ---------- Bill Tab --------------------------------------------------

const BillTab = ({ tx }) => {
  const bill = tx.operationalBill;
  const bs = bill ? (BILL_STATE_MAP[bill.state] || { label: bill.state, variant: 'neutral' }) : null;
  const fees = bill ? (bill.total * 0.85) : 0;
  const expenses = bill ? (bill.total * 0.12) : 0;
  const adjustments = bill ? (bill.total * 0.03) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {bill && (
        <>
          <SectionTitle>Operational bill</SectionTitle>
          <KVRow label="Bill #">
            {bill.extId ? (
              <a href={'https://app.clio.com/nc/#/bills/' + bill.extId} target="_blank" rel="noopener noreferrer" title="Open in Clio"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-accent)', fontWeight: 500, textDecoration: 'none' }}>
                {bill.billNumber} <Icon name="external" size={10} />
              </a>
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{bill.billNumber}</span>
            )}
          </KVRow>
          <KVRow label="Status"><Badge variant={bs.variant} dot>{bs.label}</Badge></KVRow>
          <KVRow label="Due date">{bill.dueDate ? fmtDate(bill.dueDate) : '—'}</KVRow>
          <KVRow label="Fees"><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(fees)}</span></KVRow>
          <KVRow label="Expenses"><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(expenses)}</span></KVRow>
          <KVRow label="Adjustments"><span style={{ fontFamily: 'var(--font-mono)' }}>{fmtMoney(adjustments)}</span></KVRow>
          <KVRow label="Total"><span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{fmtMoney(bill.total)}</span></KVRow>
        </>
      )}

      {tx.invoiceType === 'evergreen' && tx.trustBill && (() => {
        const tb = tx.trustBill;
        const tbs = BILL_STATE_MAP[tb.state] || { label: tb.state, variant: 'neutral' };
        return (
          <>
            <SectionTitle>Trust request</SectionTitle>
            <KVRow label="Bill #">
              {tb.extId ? (
                <a href={'https://app.clio.com/nc/#/bills/' + tb.extId} target="_blank" rel="noopener noreferrer" title="Open in Clio"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-accent)', fontWeight: 500, textDecoration: 'none' }}>
                  {tb.billNumber} <Icon name="external" size={10} />
                </a>
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{tb.billNumber}</span>
              )}
            </KVRow>
            <KVRow label="Status"><Badge variant={tbs.variant} dot>{tbs.label}</Badge></KVRow>
            <KVRow label="Amount"><span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{fmtMoney(tb.total)}</span></KVRow>
          </>
        );
      })()}

      <div style={{ marginTop: 'var(--sp-group)' }}>
        <LineItemsGrid readOnly />
      </div>

      <div style={{ marginTop: 'var(--sp-group)' }}>
        <ExpensesGrid readOnly />
      </div>
    </div>
  );
};

// =====================================================================
// Main container-agnostic component
// =====================================================================

const TransactionDetailContent = ({
  tx,
  onBack,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  breadcrumbs,
  onExpand,
  isFullPage,
}) => {
  const [tab, setTab] = React.useState('overview');

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) { e.preventDefault(); onPrev(); }
      if (e.key === 'ArrowRight' && onNext && hasNext) { e.preventDefault(); onNext(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onPrev, onNext, hasPrev, hasNext]);

  const action = PRIMARY_ACTION(tx.status, tx.lastError, tx.deliveryMethod);
  const intent = STATUS_INTENT[tx.status] || 'neutral';

  const TABS = [
    { value: 'overview', label: 'Overview', icon: 'invoice' },
    { value: 'bill', label: 'Bill', icon: 'dollar' },
    { value: 'documents', label: 'Documents', icon: 'paperclip' },
    { value: 'exec-logs', label: 'Exec Logs', icon: 'workflow' },
    { value: 'comments', label: 'Comments', icon: 'comment', count: 3 },
    { value: 'history', label: 'History', icon: 'history' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Breadcrumb — full page only */}
      {isFullPage && breadcrumbs && (
        <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          {onBack && (
            <button type="button" onClick={onBack} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--fg-3)' }}>
              <Icon name="chevronLeft" size={14} />
            </button>
          )}
          <nav style={{ flex: 1, fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Icon name="chevronRight" size={8} />}
                <span
                  style={{
                    color: i === breadcrumbs.length - 1 ? 'var(--fg-1)' : undefined,
                    fontWeight: i === breadcrumbs.length - 1 ? 500 : undefined,
                    cursor: c.onClick ? 'pointer' : undefined,
                  }}
                  onClick={c.onClick}
                >{c.label}</span>
              </React.Fragment>
            ))}
          </nav>
          {(onPrev || onNext) && (
            <div className="x-nav-arrows">
              <button onClick={onPrev} disabled={!hasPrev} title="Previous"><Icon name="chevronLeft" size={14} /></button>
              <button onClick={onNext} disabled={!hasNext} title="Next"><Icon name="chevronRight" size={14} /></button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isFullPage && onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Close"
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-3)', flex: 'none', padding: 4, borderRadius: 'var(--radius-sm)' }}
            >
              <Icon name="chevronLeft" size={16} />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Line 1: Matter + invoice type + flags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {tx.matterExtId ? (
                <a
                  href={'https://app.clio.com/nc/#/matters/' + tx.matterExtId}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in Clio"
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: 'var(--fs-xl)', fontWeight: 500,
                    color: 'var(--fg-accent)', textDecoration: 'none',
                  }}
                >
                  {tx.matter}
                  <Icon name="external" size={12} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                </a>
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-xl)', fontWeight: 500, color: 'var(--fg-1)' }}>
                  {tx.matter}
                </span>
              )}
              <Badge variant={tx.invoiceType === 'evergreen' ? 'info' : 'neutral'} size="sm">
                {tx.invoiceType === 'evergreen' ? 'Evergreen' : 'Operational'}
              </Badge>
              {tx.isSir && <TxnBadge type="SIR" />}
              {tx.isSplit && <TxnBadge type="Split" />}
            </div>
            {/* Line 2: Status + TX ID */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Badge variant={intent} dot>{TXN_STATUS_MAP[tx.status]?.label ?? tx.status}</Badge>
              <span style={{ color: 'var(--fg-4)', fontSize: 'var(--fs-xs)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--fg-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                {tx.id}
              </span>
              <IconButton icon="copy" title="Copy transaction ID" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
            {action && (
              <Button variant={action.variant} size="sm" icon={action.icon}>{action.label}</Button>
            )}
            <OverflowMenu tx={tx} />
            {!isFullPage && (onPrev || onNext) && (
              <div className="x-nav-arrows">
                <button onClick={onPrev} disabled={!hasPrev} title="Previous"><Icon name="chevronLeft" size={14} /></button>
                <button onClick={onNext} disabled={!hasNext} title="Next"><Icon name="chevronRight" size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice banner */}
      {(tx.status === 'failed' || tx.status === 'skipped' || tx.status === 'cancelled') && (
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <NoticeBanner tx={tx} />
        </div>
      )}

      {/* Tab bar */}
      <div style={{
        padding: '0 20px', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)', display: 'flex', alignItems: 'center',
      }}>
        <Tabs value={tab} onChange={setTab} items={TABS} />
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
        {tab === 'overview' && <OverviewTab tx={tx} />}
        {tab === 'bill' && <BillTab tx={tx} />}
        {tab === 'documents' && <DocumentsTab tx={tx} />}
        {tab === 'exec-logs' && <ExecLogsTab logs={tx.execLogs} />}
        {tab === 'comments' && <CommentsContent />}
        {tab === 'history' && <AuditTimeline />}
      </div>
    </div>
  );
};

Object.assign(window, { TransactionDetailContent });
