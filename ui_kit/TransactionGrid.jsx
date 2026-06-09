/* global React, Icon, Button, IconButton, Badge, Segmented, fmtMoney, fmtDate, cls */

const _W = new Proxy({}, { get: (_, k) => window[k] });

// =====================================================================
// TransactionGrid — Three-layer list page for billing transactions
// Layer 1: Global filters (date range, invoice type quick select)
// Layer 2: Stats cards (workflow stage buckets)
// Layer 3: DataGrid with grouping, toolbar filters, bulk actions
// =====================================================================

// ---------- Data -----------------------------------------------------

const SAMPLE_TRANSACTIONS = [
  // Evergreen + Email — email_held (has trust calc)
  { id: '019050a3-2b10-7d02-b002-000000000002', matter: 'Branford Holdings — Q2 Retainer', client: 'Branford Holdings LLC', invoiceType: 'evergreen', status: 'email_held', deliveryMethod: 'email', date: '2026-04-14', matterDisplayNumber: 'M-2024-00220', matterStatus: 'Active', matterExtId: 'clio-m-220', clientId: 'CLI-0022',
    opAmount: 3800.00, opInvoice: 'INV-220', opBillStatus: 'awaiting_payment', trustAmount: 1200.00, trustInvoice: 'TRR-221', trustBillStatus: 'draft',
    operationalBill: { billNumber: 'INV-220', extId: 'clio-b-220', state: 'awaiting_payment', total: 3800.00, dueDate: '2026-04-28' },
    trustBill: { billNumber: 'TRR-221', extId: 'clio-b-221', state: 'draft', total: 1200.00, dueDate: null },
    trustCalculation: { minimumThreshold: 2000.00, calculatedTrustAmount: 1200.00, outstandingBalance: 3100.00, adminOverrideAmount: null, trustBalance: { total: 4200.00, fetchedAt: '2026-04-14T10:00:00Z', accounts: [{ name: 'Operating Trust', balance: 2800.00 }, { name: 'IOLTA', balance: 1400.00 }] } },
    billRecipientEmails: ['billing@branford.com', 'accounts@branford.com'], paymentLinkUrl: 'https://pay.xtnd.io/bh220', lastError: null, createdAt: '2026-04-14T08:00:00Z', updatedAt: '2026-04-14T12:30:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '10 KB', generatedAt: '2026-04-14T09:00:00Z' }, ledger: { name: 'Ledger PDF', size: '6 KB', generatedAt: '2026-04-14T09:00:00Z' } },
    execLogs: [
      { id: '019e9750-b002-72ff-b002-000000000002', attemptNumber: 2, status: 'succeeded', step: 'generate_document', triggeredBy: 'system', triggerReason: 'stale_recovery', startedAt: '2026-04-14T08:01:00Z', completedAt: '2026-04-14T08:01:04Z', correlationId: '9f3a1b2c-4d5e-7f60-a1b2-c3d4e5f60002', errors: [], documents: { invoice: true, ledger: true }, tpaSubmission: null },
      { id: '019e9750-b001-72ff-b001-000000000001', attemptNumber: 1, status: 'failed', step: 'generate_document', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-14T07:30:00Z', completedAt: '2026-04-14T07:30:31Z', correlationId: '9f3a1b2c-4d5e-7f60-a1b2-c3d4e5f60001', errors: [{ code: 'PDF_TEMPLATE_ERROR', message: 'Ledger template missing trust account mapping', severity: 'error', retryable: true, occurredAt: '2026-04-14T07:30:31Z' }], documents: null, tpaSubmission: null },
    ],
  },
  // Operational + TPA — completed
  { id: '019050a3-3c20-7d03-c003-000000000003', matter: 'Chen IP Portfolio — Patent Filing', client: 'Chen Biotech Inc', invoiceType: 'operational', status: 'completed', deliveryMethod: 'tpa', date: '2026-04-12', matterDisplayNumber: 'M-2024-00310', matterStatus: 'Active', matterExtId: 'clio-m-310', clientId: 'CLI-0031',
    opAmount: 12480.00, opInvoice: 'INV-310', opBillStatus: 'paid', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-310', extId: 'clio-b-310', state: 'paid', total: 12480.00, dueDate: '2026-04-26' },
    trustBill: null, trustCalculation: null,
    tpaSiteId: 'IP Filing Portal', claimNumber: 'PAT-2024-00512', carrierMatterId: 'CM-3100', carrierClientName: 'Chen Biotech — Patent Portfolio', ledesClientId: 'CHEN-001',
    billRecipientEmails: [], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-12T07:30:00Z', updatedAt: '2026-04-12T14:20:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '14 KB', generatedAt: '2026-04-12T08:00:00Z' }, ledes: { name: 'LEDES 1998B', size: '3 KB', generatedAt: '2026-04-12T08:00:00Z' } },
    execLogs: [{ id: '019e9750-a001-72ff-a001-000000000001', attemptNumber: 1, status: 'succeeded', step: 'upload_tpa', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-12T08:05:00Z', completedAt: '2026-04-12T08:05:42Z', correlationId: 'a4b5c6d7-8e9f-7a01-b2c3-d4e5f6a70001', errors: [], documents: { invoice: true, ledes: true }, tpaSubmission: { tpaSiteUrl: 'IP Filing Portal', payerName: 'Chen Biotech Inc', status: 'uploaded', attemptNumber: 1, confirmationRef: 'REF-PAT-0512', screenshotPrefix: 'screenshots/chen/attempt-1/', uploadedAt: '2026-04-12T08:05:42Z', errors: [] } }],
  },
  // Operational + Email — failed at create_transaction (fast failure)
  { id: '019050a3-4d30-7d04-d004-000000000004', matter: 'Delgado Employment Dispute', client: 'Delgado Enterprises', invoiceType: 'operational', status: 'failed', deliveryMethod: 'email', date: '2026-04-15', matterDisplayNumber: 'M-2024-00440', matterStatus: 'Active', matterExtId: 'clio-m-440', clientId: 'CLI-0044',
    opAmount: 6720.50, opInvoice: 'INV-440', opBillStatus: 'draft', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-440', extId: null, state: 'draft', total: 6720.50, dueDate: null },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['legal@delgado.com'], paymentLinkUrl: null,
    lastError: { code: 'BILL_NOT_FOUND', message: 'Clio bill not found — may have been deleted', step: 'create_transaction', attemptNumber: 1 },
    createdAt: '2026-04-15T11:00:00Z', updatedAt: '2026-04-15T11:00:00Z',
    latestDocuments: null,
    execLogs: [
      { id: '019e9743-a513-72ff-a5a0-b94abbb2feef', attemptNumber: 1, status: 'failed', step: 'create_transaction', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-15T11:00:00.331Z', completedAt: '2026-04-15T11:00:00.871Z', correlationId: '503c2f01-314b-4d6c-a747-0444300d2644', errors: [{ code: 'BILL_NOT_FOUND', message: 'Clio bill not found — may have been deleted or voided in source system', severity: 'error', retryable: false, occurredAt: '2026-04-15T11:00:00.850Z' }], documents: null, tpaSubmission: null },
    ],
  },
  // Operational + TPA — failed (delivery step)
  { id: '019050a3-8a70-7d08-a008-000000000008', matter: 'Harper M&A Advisory', client: 'Harper Industries', invoiceType: 'operational', status: 'failed', deliveryMethod: 'tpa', date: '2026-04-11', matterDisplayNumber: 'M-2024-00872', matterStatus: 'Active', matterExtId: 'clio-m-872', clientId: 'CLI-0108',
    opAmount: 28900.00, opInvoice: 'INV-872', opBillStatus: 'voided', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-872', extId: 'clio-b-872', state: 'voided', total: 28900.00, dueDate: '2026-06-20' },
    trustBill: null, trustCalculation: null,
    tpaSiteId: 'Carrier Portal West', claimNumber: 'CLM-2024-00847', carrierMatterId: 'CM-9912', carrierClientName: 'Smith v. Jones — Bodily Injury', ledesClientId: 'HARPER-001',
    billRecipientEmails: [], paymentLinkUrl: null,
    lastError: { code: 'AUTH_EXPIRED', message: 'Portal session expired during upload (transient)', step: 'upload_tpa', attemptNumber: 2 },
    createdAt: '2026-04-08T09:00:00Z', updatedAt: '2026-04-11T11:45:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '15 KB', generatedAt: '2026-04-09T10:00:00Z' }, ledes: { name: 'LEDES 1998B', size: '3 KB', generatedAt: '2026-04-09T10:00:00Z' } },
    execLogs: [
      { id: '019e9750-8003-72ff-8003-000000000003', attemptNumber: 3, status: 'failed', step: 'upload_tpa', triggeredBy: 'user', triggerReason: 'user_reprocess', reprocessNote: 'Carrier confirmed portal is back online', startedAt: '2026-04-11T14:20:00Z', completedAt: '2026-04-11T14:20:22Z', correlationId: 'b7c8d9e0-1f2a-7b34-c5d6-e7f8a9b00003',
        errors: [{ code: 'AUTH_EXPIRED', message: 'Portal session expired during upload — credentials rotated by carrier', severity: 'error', retryable: true, occurredAt: '2026-04-11T14:20:22Z' }],
        documents: { invoice: true, ledes: true },
        tpaSubmission: { tpaSiteUrl: 'Carrier Portal West', payerName: 'Harper Industries', status: 'failed', attemptNumber: 1, confirmationRef: null, screenshotPrefix: 'screenshots/harper/attempt-3/', uploadedAt: null, errors: [{ message: 'AUTH_EXPIRED', description: 'Portal session expired — credentials rotated by carrier', occurredAt: '2026-04-11T14:20:22Z' }] } },
      { id: '019e9750-8002-72ff-8002-000000000002', attemptNumber: 2, status: 'failed', step: 'upload_tpa', triggeredBy: 'user', triggerReason: 'user_reprocess', reprocessNote: null, startedAt: '2026-04-11T10:00:00Z', completedAt: '2026-04-11T10:00:18Z', correlationId: 'b7c8d9e0-1f2a-7b34-c5d6-e7f8a9b00002',
        errors: [{ code: 'TPA_UPLOAD_TIMEOUT', message: 'Upload timed out after 15s — portal unresponsive', severity: 'error', retryable: true, occurredAt: '2026-04-11T10:00:18Z' }],
        documents: { invoice: true, ledes: true },
        tpaSubmission: { tpaSiteUrl: 'Carrier Portal West', payerName: 'Harper Industries', status: 'failed', attemptNumber: 1, confirmationRef: null, screenshotPrefix: 'screenshots/harper/attempt-2/', uploadedAt: null, errors: [{ message: 'TPA_UPLOAD_TIMEOUT', description: 'Connection timed out waiting for portal response', occurredAt: '2026-04-11T10:00:18Z' }] } },
      { id: '019e9750-8001-72ff-8001-000000000001', attemptNumber: 1, status: 'failed', step: 'generate_document', triggeredBy: 'system', triggerReason: 'initial', reprocessNote: null, startedAt: '2026-04-08T09:01:00Z', completedAt: '2026-04-08T09:01:30Z', correlationId: 'b7c8d9e0-1f2a-7b34-c5d6-e7f8a9b00001',
        errors: [{ code: 'PDF_GENERATION_TIMEOUT', message: 'Template render exceeded 30s — matter has 64 line items', severity: 'error', retryable: true, occurredAt: '2026-04-08T09:01:30Z' }],
        documents: null, tpaSubmission: null },
    ],
  },
  // Operational + TPA — tpa_processing
  { id: '019050a3-bb10-7d0b-b00b-00000000000b', matter: 'Kimura Patent Litigation', client: 'Kimura Technologies', invoiceType: 'operational', status: 'tpa_processing', deliveryMethod: 'tpa', date: '2026-04-14', matterDisplayNumber: 'M-2024-00550', matterStatus: 'Active', matterExtId: 'clio-m-550', clientId: 'CLI-0055',
    opAmount: 15300.00, opInvoice: 'INV-550', opBillStatus: 'awaiting_payment', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-550', extId: 'clio-b-550', state: 'awaiting_payment', total: 15300.00, dueDate: '2026-04-28' },
    trustBill: null, trustCalculation: null,
    tpaSiteId: 'Patent Claims Hub', claimNumber: 'CLM-2024-01100', carrierMatterId: 'CM-5500', carrierClientName: 'Kimura v. TechCorp', ledesClientId: 'KIMURA-001',
    billRecipientEmails: [], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-14T06:00:00Z', updatedAt: '2026-04-14T13:00:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '12 KB', generatedAt: '2026-04-14T07:00:00Z' }, ledes: { name: 'LEDES 1998B', size: '4 KB', generatedAt: '2026-04-14T07:00:00Z' } },
    execLogs: [{ id: '019e9750-c001-72ff-c001-000000000001', attemptNumber: 1, status: 'running', step: 'upload_tpa', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-14T07:05:00Z', completedAt: null, correlationId: 'c1d2e3f4-5a6b-7c78-d9e0-f1a2b3c40001', errors: [], documents: { invoice: true, ledes: true }, tpaSubmission: { tpaSiteUrl: 'Patent Claims Hub', payerName: 'Kimura Technologies', status: 'processing', attemptNumber: 1, confirmationRef: null, screenshotPrefix: null, uploadedAt: null, errors: [] } }],
  },
  // Evergreen + Email — email_held (no trust)
  { id: '019050a3-dd30-7d0d-d00d-00000000000d', matter: 'Monroe Insurance Defense', client: 'Monroe Mutual Group', invoiceType: 'evergreen', status: 'email_held', deliveryMethod: 'email', date: '2026-04-15', matterDisplayNumber: 'M-2024-00660', matterStatus: 'Active', matterExtId: 'clio-m-660', clientId: 'CLI-0066',
    opAmount: 11200.00, opInvoice: 'INV-660', opBillStatus: 'pending_approval', trustAmount: 2800.00, trustInvoice: 'TRR-661', trustBillStatus: 'draft',
    operationalBill: { billNumber: 'INV-660', extId: 'clio-b-660', state: 'pending_approval', total: 11200.00, dueDate: '2026-04-30' },
    trustBill: { billNumber: 'TRR-661', extId: null, state: 'draft', total: 2800.00, dueDate: null },
    trustCalculation: { minimumThreshold: 3000.00, calculatedTrustAmount: 2800.00, outstandingBalance: 4500.00, adminOverrideAmount: null, trustBalance: { total: 6100.00, fetchedAt: '2026-04-15T09:00:00Z', accounts: [{ name: 'Operating Trust', balance: 6100.00 }] } },
    billRecipientEmails: ['claims@monroe-mutual.com'], paymentLinkUrl: 'https://pay.xtnd.io/mm660', lastError: null, createdAt: '2026-04-15T07:00:00Z', updatedAt: '2026-04-15T12:00:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '9 KB', generatedAt: '2026-04-15T08:00:00Z' }, ledger: { name: 'Ledger PDF', size: '5 KB', generatedAt: '2026-04-15T08:00:00Z' } },
    execLogs: [{ id: '019e9750-d001-72ff-d001-000000000001', attemptNumber: 1, status: 'succeeded', step: 'generate_document', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-15T07:01:00Z', completedAt: '2026-04-15T07:01:05Z', correlationId: 'd5e6f7a8-9b0c-7d12-e3f4-a5b6c7d80001', errors: [], documents: { invoice: true, ledger: true }, tpaSubmission: null }],
  },
  // Operational + Email — skipped
  { id: '019050a3-ff50-7d0f-f00f-00000000000f', matter: 'Ostrowski Labor Arbitration', client: 'Ostrowski Manufacturing', invoiceType: 'operational', status: 'skipped', deliveryMethod: 'email', date: '2026-04-12', matterDisplayNumber: 'M-2024-00750', matterStatus: 'Closed', matterExtId: 'clio-m-750', clientId: 'CLI-0075',
    opAmount: 4100.00, opInvoice: 'INV-750', opBillStatus: 'deleted', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-750', extId: 'clio-b-750', state: 'deleted', total: 4100.00, dueDate: null },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['ap@ostrowski.com'], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-12T06:00:00Z', updatedAt: '2026-04-12T06:02:00Z',
    latestDocuments: null,
    execLogs: [],
  },
  // Evergreen + Email — completed
  { id: '019050a4-1060-7d10-a010-000000000010', matter: 'Palmer Trademark Registration', client: 'Palmer Brands International', invoiceType: 'evergreen', status: 'completed', deliveryMethod: 'email', date: '2026-04-08', matterDisplayNumber: 'M-2024-00800', matterStatus: 'Active', matterExtId: 'clio-m-800', clientId: 'CLI-0080',
    opAmount: 3250.00, opInvoice: 'INV-800', opBillStatus: 'paid', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-800', extId: 'clio-b-800', state: 'paid', total: 3250.00, dueDate: '2026-04-22' },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['finance@palmer-brands.com', 'legal@palmer-brands.com'], paymentLinkUrl: 'https://pay.xtnd.io/pb800', lastError: null, createdAt: '2026-04-08T05:00:00Z', updatedAt: '2026-04-08T14:00:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '8 KB', generatedAt: '2026-04-08T06:00:00Z' } },
    execLogs: [
      { id: '019e9750-e003-72ff-e003-000000000003', attemptNumber: 3, status: 'succeeded', step: 'send_email', triggeredBy: 'system', triggerReason: 'stale_recovery', reprocessNote: null, startedAt: '2026-04-08T06:05:00Z', completedAt: '2026-04-08T06:05:03Z', correlationId: 'e9f0a1b2-3c4d-7e56-f7a8-b9c0d1e20003',
        errors: [], documents: { invoice: true }, tpaSubmission: null },
      { id: '019e9750-e002-72ff-e002-000000000002', attemptNumber: 2, status: 'failed', step: 'send_email', triggeredBy: 'system', triggerReason: 'initial', reprocessNote: null, startedAt: '2026-04-08T05:40:00Z', completedAt: '2026-04-08T05:40:12Z', correlationId: 'e9f0a1b2-3c4d-7e56-f7a8-b9c0d1e20002',
        errors: [{ code: 'EMAIL_DELIVERY_FAILED', message: 'SMTP connection refused by relay', severity: 'error', retryable: true, occurredAt: '2026-04-08T05:40:12Z' }],
        documents: { invoice: true }, tpaSubmission: null },
      { id: '019e9750-e001-72ff-e001-000000000001', attemptNumber: 1, status: 'succeeded', step: 'generate_document', triggeredBy: 'system', triggerReason: 'initial', reprocessNote: null, startedAt: '2026-04-08T05:30:00Z', completedAt: '2026-04-08T05:30:04Z', correlationId: 'e9f0a1b2-3c4d-7e56-f7a8-b9c0d1e20001',
        errors: [], documents: { invoice: true }, tpaSubmission: null },
    ],
  },
  // Operational + TPA — completed
  { id: '019050a4-3280-7d12-c012-000000000012', matter: 'Russo Securities Fraud', client: 'Russo Investment Group', invoiceType: 'operational', status: 'completed', deliveryMethod: 'tpa', date: '2026-04-07', matterDisplayNumber: 'M-2024-00900', matterStatus: 'Active', matterExtId: 'clio-m-900', clientId: 'CLI-0090',
    opAmount: 67500.00, opInvoice: 'INV-900', opBillStatus: 'paid', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-900', extId: 'clio-b-900', state: 'paid', total: 67500.00, dueDate: '2026-04-21' },
    trustBill: null, trustCalculation: null,
    tpaSiteId: 'Securities Claims Portal', claimNumber: 'SEC-2024-00190', carrierMatterId: 'CM-9000', carrierClientName: 'Russo v. Atlantic Financial', ledesClientId: 'RUSSO-001',
    billRecipientEmails: [], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-07T04:00:00Z', updatedAt: '2026-04-07T15:00:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '18 KB', generatedAt: '2026-04-07T05:00:00Z' }, ledes: { name: 'LEDES 1998B', size: '5 KB', generatedAt: '2026-04-07T05:00:00Z' } },
    execLogs: [{ id: '019e9750-e001-72ff-e001-000000000001', attemptNumber: 1, status: 'succeeded', step: 'upload_tpa', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-07T05:10:00Z', completedAt: '2026-04-07T05:10:45Z', correlationId: 'f3a4b5c6-7d8e-7f90-a1b2-c3d4e5f60001', errors: [], documents: { invoice: true, ledes: true }, tpaSubmission: { tpaSiteUrl: 'Securities Claims Portal', payerName: 'Russo Investment Group', status: 'uploaded', attemptNumber: 1, confirmationRef: 'REF-SEC-0190', screenshotPrefix: 'screenshots/russo/attempt-1/', uploadedAt: '2026-04-07T05:10:45Z', errors: [] } }],
  },

  // SIR — TPA + Email legs
  {
    id: '019050a3-1a00-7d01-a001-000000000001', billId: 'BILL-901', matter: 'Lydecker FL — Matter 123', client: 'National Indemnity Corp', invoiceType: 'operational', date: '2026-04-14', deliveryMethod: 'tpa', matterDisplayNumber: 'M-2024-00123', matterStatus: 'Active', matterExtId: 'clio-m-123', clientId: 'CLI-0201',
    isSir: true,
    opAmount: 10000.00, opInvoice: 'INV-123', opBillStatus: 'awaiting_payment', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-123', extId: 'clio-b-123', state: 'awaiting_payment', total: 10000.00, dueDate: '2026-06-25' },
    trustBill: null, trustCalculation: null,
    tpaSiteId: 'Carrier Portal West', claimNumber: 'CLM-2024-01234', carrierMatterId: 'CM-5501', carrierClientName: 'Lydecker Construction — General Liability', ledesClientId: 'NATIND-001',
    billRecipientEmails: [], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-07T14:00:00Z', updatedAt: '2026-04-14T08:20:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '11 KB', generatedAt: '2026-04-08T09:15:00Z' }, ledes: { name: 'LEDES 1998B', size: '4 KB', generatedAt: '2026-04-08T09:15:00Z' } },
    execLogs: [],
    legs: [
      { id: '019050a3-1a00-7d01-a001-00000000001a', label: 'National Indemnity Corp', status: 'tpa_uploaded', amount: 10000.00, invoice: 'INV-123', billStatus: 'awaiting_payment' },
      { id: '019050a3-1a00-7d01-a001-00000000001b', label: 'Lydecker Construction Inc', status: 'email_held', amount: 10000.00, invoice: 'INV-123', billStatus: 'awaiting_payment' },
    ],
  },
  {
    id: '019050a3-5e40-7d05-e005-000000000005', billId: 'BILL-905', matter: 'Aldridge v. Continental Mutual', client: 'Continental Mutual Insurance', invoiceType: 'evergreen', date: '2026-04-15', deliveryMethod: 'email', matterDisplayNumber: 'M-2024-00418', matterStatus: 'Active', matterExtId: 'clio-m-418', clientId: 'CLI-0042',
    isSir: true,
    opAmount: 4250.00, opInvoice: 'INV-418', opBillStatus: 'awaiting_payment', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-418', extId: 'clio-b-418', state: 'awaiting_payment', total: 4250.00, dueDate: '2026-04-30' },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['billing@continental-mutual.com'], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-15T09:00:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '10 KB', generatedAt: '2026-04-11T08:00:00Z' } },
    execLogs: [],
    legs: [
      { id: '019050a3-5e40-7d05-e005-00000000005a', label: 'Continental Mutual Insurance', status: 'tpa_processing', amount: 4250.00, invoice: 'INV-418', billStatus: 'awaiting_payment' },
      { id: '019050a3-5e40-7d05-e005-00000000005b', label: 'Aldridge Manufacturing Co', status: 'email_sent', amount: 4250.00, invoice: 'INV-418', billStatus: 'awaiting_payment' },
    ],
  },

  // Split bills (flat rows with badge)
  { id: '019050a3-9b80-7d09-b009-000000000009', matter: 'Irving Securities Compliance', client: 'Irving Capital Markets', invoiceType: 'operational', status: 'email_sent', deliveryMethod: 'email', isSplit: true, date: '2026-04-15', matterDisplayNumber: 'M-2024-00500', matterStatus: 'Active', matterExtId: 'clio-m-500', clientId: 'CLI-0050',
    opAmount: 5670.00, opInvoice: 'INV-500-A', opBillStatus: 'awaiting_payment', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-500-A', extId: 'clio-b-500a', state: 'awaiting_payment', total: 5670.00, dueDate: '2026-04-30' },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['finance@irving-capital.com'], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-15T08:00:00Z', updatedAt: '2026-04-15T10:00:00Z',
    latestDocuments: { invoice: { name: 'Invoice PDF', size: '9 KB', generatedAt: '2026-04-15T09:00:00Z' } },
    execLogs: [{ id: '019e9750-f001-72ff-f001-000000000001', attemptNumber: 1, status: 'succeeded', step: 'send_email', triggeredBy: 'system', triggerReason: 'initial', startedAt: '2026-04-15T09:05:00Z', completedAt: '2026-04-15T09:05:03Z', correlationId: 'a1b2c3d4-5e6f-7a89-b0c1-d2e3f4a50001', errors: [], documents: { invoice: true }, tpaSubmission: null }],
  },
  { id: '019050a3-9b80-7d09-b009-00000000009b', matter: 'Irving Securities Compliance', client: 'Irving Ventures LLC', invoiceType: 'operational', status: 'pending', deliveryMethod: 'email', isSplit: true, date: '2026-04-15', matterDisplayNumber: 'M-2024-00500', matterStatus: 'Active', matterExtId: 'clio-m-500', clientId: 'CLI-0051',
    opAmount: 3780.00, opInvoice: 'INV-500-B', opBillStatus: 'draft', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-500-B', extId: null, state: 'draft', total: 3780.00, dueDate: null },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['ap@irving-ventures.com'], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-15T08:00:00Z', updatedAt: '2026-04-15T08:00:00Z',
    latestDocuments: null,
    execLogs: [],
  },
  { id: '019050a4-2170-7d11-b011-000000000011', matter: 'Quinn Environmental Remediation', client: 'Quinn Chemical Corp', invoiceType: 'operational', status: 'generating', deliveryMethod: 'tpa', isSplit: true, date: '2026-04-16', matterDisplayNumber: 'M-2024-00850', matterStatus: 'Active', matterExtId: 'clio-m-850', clientId: 'CLI-0085',
    opAmount: 15400.00, opInvoice: 'INV-850-A', opBillStatus: 'draft', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-850-A', extId: null, state: 'draft', total: 15400.00, dueDate: null },
    trustBill: null, trustCalculation: null,
    tpaSiteId: 'EPA Claims Portal', claimNumber: 'ENV-2024-00340', carrierMatterId: 'CM-8500', carrierClientName: 'Quinn Chemical — Superfund', ledesClientId: 'QUINN-001',
    billRecipientEmails: [], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-16T06:00:00Z', updatedAt: '2026-04-16T06:05:00Z',
    latestDocuments: null,
    execLogs: [],
  },
  { id: '019050a4-2170-7d11-b011-00000000011b', matter: 'Quinn Environmental Remediation', client: 'Quinn Subsidiary Inc', invoiceType: 'operational', status: 'pending', deliveryMethod: 'email', isSplit: true, date: '2026-04-16', matterDisplayNumber: 'M-2024-00850', matterStatus: 'Active', matterExtId: 'clio-m-850', clientId: 'CLI-0086',
    opAmount: 6600.00, opInvoice: 'INV-850-B', opBillStatus: 'draft', trustAmount: null, trustInvoice: null, trustBillStatus: null,
    operationalBill: { billNumber: 'INV-850-B', extId: null, state: 'draft', total: 6600.00, dueDate: null },
    trustBill: null, trustCalculation: null,
    billRecipientEmails: ['billing@quinn-sub.com'], paymentLinkUrl: null, lastError: null, createdAt: '2026-04-16T06:00:00Z', updatedAt: '2026-04-16T06:00:00Z',
    latestDocuments: null,
    execLogs: [],
  },
];

// Aggregated status for grouped rows (SIR / Split)
const aggregateStatus = (legs) => {
  const statuses = legs.map((l) => l.status);
  if (statuses.every((s) => s === 'completed')) return 'completed';
  if (statuses.some((s) => s === 'failed')) return 'failed';
  if (statuses.some((s) => s === 'email_held')) return 'email_held';
  if (statuses.some((s) => s === 'cancelled' || s === 'skipped')) return 'cancelled';
  return 'email_sent';
};

// Compute parent status for SIR grouped rows
SAMPLE_TRANSACTIONS.forEach((t) => {
  if (t.isSir && t.legs) t.status = aggregateStatus(t.legs);
});

// ---------- Status config --------------------------------------------

const TXN_STATUS_MAP = {
  pending: { label: 'Pending', variant: 'neutral' },
  preparing: { label: 'Preparing', variant: 'neutral' },
  awaiting_trust_approval: { label: 'Awaiting Trust', variant: 'warn' },
  generating: { label: 'Generating', variant: 'neutral' },
  file_generated: { label: 'File Generated', variant: 'info' },
  email_held: { label: 'Email Held', variant: 'warn' },
  email_sent: { label: 'Email Sent', variant: 'info' },
  tpa_processing: { label: 'TPA Processing', variant: 'info' },
  tpa_uploaded: { label: 'TPA Uploaded', variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  skipped: { label: 'Skipped', variant: 'neutral' },
  failed: { label: 'Failed', variant: 'danger' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
};

const TxnStatus = ({ status }) => {
  const s = TXN_STATUS_MAP[status] || { label: status, variant: 'neutral' };
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
};

const BILL_STATUS_LABELS = {
  draft: { label: 'Draft', color: 'var(--fg-3)' },
  pending_approval: { label: 'Pending Approval', color: 'var(--warning-500)' },
  awaiting_payment: { label: 'Awaiting payment', color: 'var(--warning-500)' },
  paid: { label: 'Paid', color: 'var(--success-600)' },
  voided: { label: 'Voided', color: 'var(--error-500)' },
  deleted: { label: 'Deleted', color: 'var(--fg-4)' },
};

const INVOICE_TYPE_STYLE = {
  evergreen: { label: 'Evergreen', color: 'var(--primary-600)' },
  operational: { label: 'Operational', color: 'var(--fg-2)' },
};

// ---------- Layer 1: Global Filters ----------------------------------

const FilterLabel = ({ icon, children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 'var(--fs-xs)',
      fontWeight: 600,
      color: 'var(--fg-3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      whiteSpace: 'nowrap',
    }}
  >
    <Icon name={icon} size={12} />
    {children}
  </span>
);

const QuickSelect = ({ value, onChange, options }) => (
  <div style={{ display: 'inline-flex', gap: 2 }}>
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className="x-segmented__item"
        aria-selected={value === opt.value}
        style={{ padding: '4px 10px', fontSize: 'var(--fs-sm)' }}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
];

const presetToRange = (preset) => {
  const now = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const weekStart = (d) => { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r; };
  switch (preset) {
    case 'today': return { from: fmt(now), to: fmt(now) };
    case 'yesterday': { const d = new Date(now); d.setDate(d.getDate() - 1); return { from: fmt(d), to: fmt(d) }; }
    case 'this_week': return { from: fmt(weekStart(now)), to: fmt(now) };
    case 'last_week': { const s = weekStart(now); s.setDate(s.getDate() - 7); const e = new Date(s); e.setDate(e.getDate() + 6); return { from: fmt(s), to: fmt(e) }; }
    case '7d': { const d = new Date(now); d.setDate(d.getDate() - 6); return { from: fmt(d), to: fmt(now) }; }
    case '30d': { const d = new Date(now); d.setDate(d.getDate() - 29); return { from: fmt(d), to: fmt(now) }; }
    case 'this_month': return { from: fmt(startOf(now)), to: fmt(now) };
    default: return { from: '', to: '' };
  }
};

// ---------- Calendar Month Grid --------------------------------------
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CalendarMonth = ({ year, month, from, to, hoverDate, onDayClick, onDayHover }) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fmt = (d) => d.toISOString().slice(0, 10);
  const todayStr = fmt(new Date());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isInRange = (dateStr) => {
    if (!from) return false;
    const end = to || hoverDate;
    if (!end) return dateStr === from;
    const lo = from < end ? from : end;
    const hi = from < end ? end : from;
    return dateStr >= lo && dateStr <= hi;
  };

  return (
    <div style={{ width: 252 }}>
      <div style={{ textAlign: 'center', fontWeight: 500, fontSize: 'var(--fs-sm)', color: 'var(--fg-1)', padding: '0 0 8px' }}>
        {monthLabel}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', justifyContent: 'center' }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 'var(--fs-xs)', color: 'var(--fg-3)', fontWeight: 600, padding: '4px 0' }}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day == null) return <div key={'e' + i} />;
          const dateStr = fmt(new Date(year, month, day));
          const isToday = dateStr === todayStr;
          const isFrom = dateStr === from;
          const isTo = dateStr === to;
          const inRange = isInRange(dateStr);
          const isEndpoint = isFrom || isTo;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onDayClick(dateStr)}
              onMouseEnter={() => onDayHover(dateStr)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                boxSizing: 'border-box',
                width: 36,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--fs-sm)',
                borderRadius: isEndpoint ? 'var(--radius-md)' : 0,
                background: isEndpoint
                  ? 'var(--fg-accent)'
                  : inRange
                    ? 'var(--a-100, var(--bg-accent-subtle, rgba(100,140,200,0.12)))'
                    : 'transparent',
                color: isEndpoint
                  ? 'white'
                  : isToday
                    ? 'var(--fg-accent)'
                    : 'var(--fg-1)',
                fontWeight: isToday || isEndpoint ? 600 : 400,
                transition: 'background 0.08s ease',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Dual Calendar DateRangePicker ----------------------------
const DateRangePicker = ({ preset, from, to, onPresetChange, onFromChange, onToChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const now = new Date();
  const [leftMonth, setLeftMonth] = React.useState(now.getMonth());
  const [leftYear, setLeftYear] = React.useState(now.getFullYear());
  const [picking, setPicking] = React.useState(null);
  const [hoverDate, setHoverDate] = React.useState(null);

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const navMonth = (delta) => {
    let m = leftMonth + delta;
    let y = leftYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setLeftMonth(m);
    setLeftYear(y);
  };

  const activePreset = DATE_PRESETS.find((p) => p.value === preset);
  let displayLabel = 'Date Range';
  if (activePreset) {
    displayLabel = activePreset.label;
  } else if (from && to) {
    displayLabel = fmtDate(from) + ' – ' + fmtDate(to);
  } else if (from) {
    displayLabel = fmtDate(from) + ' – …';
  }

  const pickPreset = (p) => {
    const range = presetToRange(p);
    onPresetChange(p);
    onFromChange(range.from);
    onToChange(range.to);
    setPicking(null);
    setOpen(false);
  };

  const onDayClick = (dateStr) => {
    if (!picking || picking === 'from') {
      onPresetChange('custom');
      onFromChange(dateStr);
      onToChange('');
      setPicking('to');
    } else {
      const f = from;
      if (dateStr < f) {
        onFromChange(dateStr);
        onToChange(f);
      } else {
        onToChange(dateStr);
      }
      onPresetChange('custom');
      setPicking(null);
      setOpen(false);
    }
  };

  const navBtnStyle = {
    all: 'unset',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 'var(--radius-md)',
    color: 'var(--fg-2)',
    fontSize: 'var(--fs-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="x-input"
        onClick={() => { setOpen((v) => !v); setPicking('from'); }}
        style={{
          width: 'auto',
          minWidth: 170,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 'var(--fs-sm)',
          padding: '0 10px',
          lineHeight: 'var(--input-h)',
        }}
      >
        <Icon name="calendar" size={13} style={{ color: 'var(--fg-3)', flex: 'none' }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{displayLabel}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 40,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: 16,
            display: 'flex',
            gap: 0,
          }}
        >
          {/* Dual calendars */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Navigation row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 8px' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                <button type="button" style={navBtnStyle} onClick={() => navMonth(-12)} title="Previous year">
                  <Icon name="chevronLeft" size={10} /><Icon name="chevronLeft" size={10} />
                </button>
                <button type="button" style={navBtnStyle} onClick={() => navMonth(-1)} title="Previous month">
                  <Icon name="chevronLeft" size={12} />
                </button>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: 2 }}>
                <button type="button" style={navBtnStyle} onClick={() => navMonth(1)} title="Next month">
                  <Icon name="chevronRight" size={12} />
                </button>
                <button type="button" style={navBtnStyle} onClick={() => navMonth(12)} title="Next year">
                  <Icon name="chevronRight" size={10} /><Icon name="chevronRight" size={10} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <CalendarMonth
                year={leftYear} month={leftMonth}
                from={from} to={to} hoverDate={picking === 'to' ? hoverDate : null}
                onDayClick={onDayClick}
                onDayHover={setHoverDate}
              />
              <CalendarMonth
                year={rightYear} month={rightMonth}
                from={from} to={to} hoverDate={picking === 'to' ? hoverDate : null}
                onDayClick={onDayClick}
                onDayHover={setHoverDate}
              />
            </div>
          </div>

          {/* Quick select sidebar */}
          <div
            style={{
              borderLeft: '1px solid var(--border-subtle)',
              marginLeft: 16,
              paddingLeft: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 130,
            }}
          >
            <div
              style={{
                fontSize: 'var(--fs-xs)',
                fontWeight: 600,
                color: 'var(--fg-3)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
                padding: '4px 8px 8px',
              }}
            >
              Quick Select
            </div>
            {DATE_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => pickPreset(p.value)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--fs-sm)',
                  color: preset === p.value ? 'var(--fg-accent)' : 'var(--fg-1)',
                  fontWeight: preset === p.value ? 500 : 400,
                  background: preset === p.value ? 'var(--bg-accent-subtle, var(--a-50))' : 'transparent',
                }}
                onMouseEnter={(e) => { if (preset !== p.value) e.currentTarget.style.background = 'var(--n-50)'; }}
                onMouseLeave={(e) => { if (preset !== p.value) e.currentTarget.style.background = 'transparent'; }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TxnGlobalFilters = ({ filters, onChange, onReset, statsCollapsed, onToggleStats, activeCard }) => {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  const hasActive = filters.invoiceType !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-section)',
        padding: 'var(--sp-group) 0',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FilterLabel icon="calendar">Date</FilterLabel>
        <DateRangePicker
          preset={filters.datePreset}
          from={filters.dateFrom}
          to={filters.dateTo}
          onPresetChange={(v) => set('datePreset', v)}
          onFromChange={(v) => set('dateFrom', v)}
          onToChange={(v) => set('dateTo', v)}
        />
      </div>

      <div style={{ width: 1, height: 'var(--row-h-header)', background: 'var(--border-subtle)' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FilterLabel icon="invoice">Type</FilterLabel>
        <div className="x-segmented" role="tablist">
          <QuickSelect
            value={filters.invoiceType}
            onChange={(v) => set('invoiceType', v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'evergreen', label: 'Evergreen' },
              { value: 'operational', label: 'Operational' },
            ]}
          />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {hasActive && (
        <Button variant="ghost" size="sm" icon="x" onClick={onReset}>
          Reset
        </Button>
      )}
      {statsCollapsed && activeCard && (
        <Badge variant="accent" size="sm">{TXN_STATS.find((s) => s.key === activeCard)?.label}</Badge>
      )}
      <button
        type="button"
        onClick={onToggleStats}
        style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
          padding: 4, color: 'var(--fg-3)', borderRadius: 'var(--radius-sm)',
        }}
        title={statsCollapsed ? 'Show summary' : 'Hide summary'}
      >
        <Icon name="chevronRight" size={12}
          style={{ transform: statsCollapsed ? 'rotate(90deg)' : 'rotate(-90deg)', transition: 'transform 0.12s ease' }}
        />
      </button>
    </div>
  );
};

// ---------- Layer 2: Stats Cards -------------------------------------

const TXN_STATS = [
  { key: 'processing', label: 'Processing', icon: 'clock', statuses: ['pending', 'preparing', 'awaiting_trust_approval', 'generating'], color: 'var(--fg-3)' },
  { key: 'ready', label: 'Ready', icon: 'checkCircle', statuses: ['file_generated', 'email_held'], color: 'var(--primary-500)' },
  { key: 'delivering', label: 'Delivering', icon: 'external', statuses: ['email_sent', 'tpa_processing', 'tpa_uploaded'], color: 'var(--info-500, var(--primary-600))' },
  { key: 'completed', label: 'Completed', icon: 'check', statuses: ['completed'], color: 'var(--success-600)' },
  { key: 'failed', label: 'Failed', icon: 'warning', statuses: ['failed'], color: 'var(--error-500)' },
  { key: 'cancelled', label: 'Cancelled', icon: 'x', statuses: ['cancelled', 'skipped'], color: 'var(--fg-4)' },
];

const TxnStatsCards = ({ rows, activeKey, onCardClick }) => {
  const stats = TXN_STATS.map((s) => {
    const matching = rows.filter((r) => s.statuses.includes(r.status));
    return {
      ...s,
      count: matching.length,
      total: matching.reduce((sum, r) => sum + r.opAmount + (r.trustAmount || 0), 0),
    };
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 'var(--sp-group)',
      }}
    >
      {stats.map((s) => {
        const active = activeKey === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onCardClick(active ? null : s.key)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              boxSizing: 'border-box',
              padding: 'var(--sp-group) var(--card-pad)',
              borderRadius: 'var(--radius-lg)',
              border: active
                ? '2px solid var(--border-focus)'
                : '1px solid var(--border-subtle)',
              background: active ? 'var(--bg-accent-subtle, var(--a-50))' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-inline)',
              transition: 'border-color 0.12s ease, background 0.12s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name={s.icon} size={16} style={{ color: s.color }} />
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-2)', fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-2xl)',
                  fontWeight: 600,
                  color: 'var(--fg-1)',
                }}
              >
                {s.count}
              </span>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                {fmtMoney(s.total)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ---------- Layer 3: Grid --------------------------------------------

const BillCell = ({ amount, invoice, billStatus }) => {
  if (amount == null) {
    return <span style={{ color: 'var(--fg-4)' }}>—</span>;
  }
  const bs = BILL_STATUS_LABELS[billStatus] || { label: billStatus, color: 'var(--fg-3)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div>
        <span style={{ fontWeight: 500 }}>{fmtMoney(amount)}</span>
        {invoice && (
          <span style={{ color: 'var(--fg-3)', fontSize: 'var(--fs-sm)', marginLeft: 6, fontFamily: 'var(--font-mono)' }}>
            {invoice}
          </span>
        )}
      </div>
      <span style={{ fontSize: 'var(--fs-xs)', color: bs.color }}>
        {bs.label}
      </span>
    </div>
  );
};

const TXN_STATUS_OPTIONS = Object.entries(TXN_STATUS_MAP).map(([value, { label }]) => ({
  value,
  label,
}));

const TXN_FILTER_FIELDS = [
  { id: 'status', label: 'Status', icon: 'workflow', type: 'multiselect', options: TXN_STATUS_OPTIONS },
  { id: 'matter', label: 'Matter', icon: 'matter', type: 'text' },
  { id: 'client', label: 'Client', icon: 'vendor', type: 'text' },
  { id: 'opAmount', label: 'Operational', icon: 'dollar', type: 'range' },
];

const TxnBadge = ({ type }) => {
  const styles = {
    SIR: { bg: 'var(--warning-100, #fef3c7)', color: 'var(--warning-700, #92400e)', border: 'var(--warning-200, #fde68a)' },
    Split: { bg: 'var(--primary-100, #dbeafe)', color: 'var(--primary-700, #1d4ed8)', border: 'var(--primary-200, #bfdbfe)' },
  };
  const s = styles[type] || styles.SIR;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 600,
        padding: '1px 5px',
        borderRadius: 'var(--radius-sm)',
        background: s.bg,
        color: s.color,
        border: '1px solid ' + s.border,
        letterSpacing: '0.03em',
        lineHeight: '16px',
      }}
    >
      {type}
    </span>
  );
};

const TXN_COLUMNS = [
  {
    key: 'matter',
    label: 'Matter',
    sortable: true,
    render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {row.legs && (
          <Icon
            name="chevronRight" size={12}
            style={{
              color: 'var(--fg-3)',
              flex: 'none',
              transform: row._expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.12s ease',
            }}
          />
        )}
        <span style={{ fontWeight: 450 }}>{v}</span>
        {row.isSir && <TxnBadge type="SIR" />}
        {row.isSplit && <TxnBadge type="Split" />}
      </div>
    ),
  },
  {
    key: 'invoiceType',
    label: 'Invoice Type',
    sortable: true,
    width: 140,
    render: (v) => {
      const s = INVOICE_TYPE_STYLE[v] || { label: v, color: 'var(--fg-2)' };
      return <span style={{ color: s.color, fontWeight: 500, fontSize: 'var(--fs-sm)' }}>{s.label}</span>;
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 160,
    render: (v) => <TxnStatus status={v} />,
  },
  {
    key: 'opAmount',
    label: 'Operational Bill',
    sortable: true,
    width: 200,
    render: (v, row) => (
      <BillCell amount={row.opAmount} invoice={row.opInvoice} billStatus={row.opBillStatus} />
    ),
  },
  {
    key: 'trustAmount',
    label: 'Trust request',
    sortable: true,
    width: 200,
    render: (v, row) => (
      <BillCell amount={row.trustAmount} invoice={row.trustInvoice} billStatus={row.trustBillStatus} />
    ),
  },
  {
    key: '_actions',
    label: '',
    width: 48,
    className: 'x-cell--actions',
    render: () => <IconButton icon="more" />,
  },
];

const TXN_BULK_ACTIONS = [
  { id: 'complete', label: 'Complete', icon: 'check' },
  { id: 'email', label: 'Send Email', icon: 'external' },
  { id: 'cancel', label: 'Cancel', icon: 'x', variant: 'danger' },
];

// ---------- Main component -------------------------------------------

const TransactionGrid = ({ onOpen }) => {
  // Layer 1
  const [globalFilters, setGlobalFilters] = React.useState({
    datePreset: '',
    dateFrom: '',
    dateTo: '',
    invoiceType: 'all',
  });
  const resetGlobal = () =>
    setGlobalFilters({ datePreset: '', dateFrom: '', dateTo: '', invoiceType: 'all' });

  const globalFiltered = React.useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter((r) => {
      if (globalFilters.invoiceType !== 'all' && r.invoiceType !== globalFilters.invoiceType) return false;
      if (globalFilters.dateFrom && r.date < globalFilters.dateFrom) return false;
      if (globalFilters.dateTo && r.date > globalFilters.dateTo) return false;
      return true;
    });
  }, [globalFilters]);

  // Layer 2
  const [activeCard, setActiveCard] = React.useState(null);

  const cardFiltered = React.useMemo(() => {
    if (!activeCard) return globalFiltered;
    const stat = TXN_STATS.find((s) => s.key === activeCard);
    if (!stat) return globalFiltered;
    return globalFiltered.filter((r) => stat.statuses.includes(r.status));
  }, [globalFiltered, activeCard]);

  // Layer 3
  const gf = _W.useGridFilters({
    rows: cardFiltered,
    filterFields: TXN_FILTER_FIELDS,
  });

  const [selected, setSelected] = React.useState(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [sort, setSort] = React.useState({ key: 'date', dir: 'desc' });
  const [columns, setColumns] = React.useState(TXN_COLUMNS);
  const [density, setDensity] = React.useState('default');
  const [fixedHeader, setFixedHeader] = React.useState(true);
  const [groupBy, setGroupBy] = React.useState('matter');
  const [expandedRows, setExpandedRows] = React.useState(new Set());
  const [statsCollapsed, setStatsCollapsed] = React.useState(() => {
    try { return localStorage.getItem('xtnd.txnStatsCollapsed') === 'true'; }
    catch { return false; }
  });
  const toggleStats = () => {
    setStatsCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem('xtnd.txnStatsCollapsed', String(next)); } catch {}
      return next;
    });
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getWeek = (dateStr) => {
    const d = new Date(dateStr);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return fmtDate(start.toISOString()) + ' – ' + fmtDate(end.toISOString());
  };
  const getMonth = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const groupByKey = groupBy === 'weekly' ? '_week' : groupBy === 'monthly' ? '_month' : groupBy !== 'none' ? groupBy : undefined;

  const rowsWithGroupKeys = React.useMemo(() => {
    if (groupBy === 'weekly') return gf.filteredRows.map((r) => ({ ...r, _week: getWeek(r.date) }));
    if (groupBy === 'monthly') return gf.filteredRows.map((r) => ({ ...r, _month: getMonth(r.date) }));
    return gf.filteredRows;
  }, [gf.filteredRows, groupBy]);

  React.useEffect(() => { setPage(1); }, [globalFilters, activeCard]);

  const displayRows = rowsWithGroupKeys
    .slice((page - 1) * pageSize, page * pageSize)
    .map((r) => (r.legs ? { ...r, _expanded: expandedRows.has(r.id) } : r));
  const total = gf.filteredRows.reduce((s, r) => s + r.opAmount + (r.trustAmount || 0), 0);
  const allSelected = selected.size === displayRows.length && selected.size > 0;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Unified filter + stats block */}
      <div style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        padding: '0 var(--card-pad)',
      }}>
        <TxnGlobalFilters
          filters={globalFilters}
          onChange={setGlobalFilters}
          onReset={resetGlobal}
          statsCollapsed={statsCollapsed}
          onToggleStats={toggleStats}
          activeCard={activeCard}
        />
        {!statsCollapsed && (
          <div style={{ paddingBottom: 'var(--sp-section)' }}>
            <TxnStatsCards
              rows={globalFiltered}
              activeKey={activeCard}
              onCardClick={(key) => {
                setActiveCard(key);
                setSelected(new Set());
              }}
            />
          </div>
        )}
      </div>

      {/* Layer 3 */}
      <_W.DataGrid
        columns={columns}
        rows={displayRows}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={(s) => { setSort(s); setPage(1); }}
        onRowClick={(r) => {
          if (r.legs) { toggleExpand(r.id); return; }
          if (onOpen) onOpen(r);
        }}
        renderSubRows={(r, visibleCols, { selectable, totalCols }) => {
          if (!r.legs || !r._expanded) return null;
          return r.legs.map((leg) => (
            <tr
              key={leg.id}
              style={{
                background: 'var(--n-25)',
                borderLeft: '3px solid var(--a-300, var(--border-focus))',
              }}
              onClick={(e) => { e.stopPropagation(); if (onOpen) onOpen(leg); }}
              className="x-grid__sub-row"
            >
              {selectable && <td className="x-cell--checkbox" />}
              {visibleCols.map((c) => (
                <td
                  key={c.key}
                  className={cls(c.className)}
                  style={{ textAlign: c.align }}
                >
                  {c.key === 'matter' ? (
                    <span style={{ paddingLeft: 24, color: 'var(--fg-2)', fontSize: 'var(--fs-sm)' }}>
                      └─ {leg.label}
                    </span>
                  ) : c.key === 'invoiceType' ? null
                  : c.key === 'status' ? <TxnStatus status={leg.status} />
                  : c.key === 'opAmount' ? (
                    <BillCell amount={leg.amount} invoice={leg.invoice} billStatus={leg.billStatus} />
                  ) : c.key === 'trustAmount' ? null
                  : c.key === '_actions' ? <IconButton icon="more" />
                  : null}
                </td>
              ))}
            </tr>
          ));
        }}
        settingsEnabled
        onColumnsChange={setColumns}
        density={density}
        onDensityChange={setDensity}
        fixedHeader={fixedHeader}
        onFixedHeaderChange={setFixedHeader}
        maxHeight={500}
        groupBy={groupByKey}
        toolbar={
          <>
            <_W.GridSearchInput {...gf.searchProps} placeholder="Search matters, clients…" />
            <_W.ChipFilterBar {...gf.chipProps} maxVisible={3} />
            {gf.hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={() => { gf.clearAll(); setPage(1); }}>
                Clear all
              </Button>
            )}
            <div className="x-grid-toolbar__spacer" />

            {/* Group by control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="grid" size={13} style={{ color: 'var(--fg-3)' }} />
              <select
                className="x-select"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingRight: 28,
                  width: 'auto',
                  minWidth: 110,
                  fontSize: 'var(--fs-sm)',
                }}
              >
                <option value="matter">Matter</option>
                <option value="client">Client</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="none">No grouping</option>
              </select>
            </div>

            <span className="x-grid-toolbar__count">
              {selected.size > 0 ? (
                <>{selected.size} selected</>
              ) : (
                <>{gf.filteredCount} transactions · {fmtMoney(total)}</>
              )}
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
        bulkBar={
          <_W.BulkActionBar
            mode="floating"
            selected={selected}
            totalRows={displayRows.length}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={() => {
              if (allSelected) setSelected(new Set());
              else setSelected(new Set(displayRows.map((r) => r.id)));
            }}
            onClearSelection={() => setSelected(new Set())}
            actions={TXN_BULK_ACTIONS}
          />
        }
      />
    </div>
  );
};

Object.assign(window, { TransactionGrid, TxnStatus, TxnBadge, TXN_STATUS_MAP, SAMPLE_TRANSACTIONS, DateRangePicker, FilterLabel, QuickSelect });
